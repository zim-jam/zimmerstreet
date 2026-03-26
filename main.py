import urllib.request
import xml.etree.ElementTree as ET
import warnings
from datetime import timedelta
from typing import List, Tuple

import numpy as np
import pandas as pd
import yfinance as yf
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.ensemble import RandomForestRegressor

# ==========================================
# Configurations
# ==========================================

warnings.filterwarnings("ignore")

FEATURE_COLS: List[str] = [
    "Open", "High", "Low", "Close", "Volume",
    "Daily_Range", "Intraday_Return", "Overnight_Gap",
    "Close_to_10d_High", "Close_to_10d_Low",
    "RSI_14", "MACD", "MACD_Signal", "MACD_Histogram",
]

FORECAST_DAYS: int = 5

# ==========================================
# Pydantic Models
# ==========================================


class NewsItem(BaseModel):
    title: str
    publisher: str
    link: str
    publish_time: str


class ForecastDay(BaseModel):
    day_ahead: int
    target_date: str
    predicted_price: float


class TechnicalIndicators(BaseModel):
    rsi_14: float
    macd: float
    macd_signal: float
    macd_histogram: float


class PredictionResponse(BaseModel):
    ticker: str
    latest_date: str
    latest_close_price: float
    currency: str
    forecast: List[ForecastDay]
    technical_indicators: TechnicalIndicators
    recent_news: List[NewsItem]


# ==========================================
# FastAPI Initialization
# ==========================================

app = FastAPI(
    title="Quant Trading Regressor API",
    description="Predicts next 5 days of stock prices using RandomForest",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# Feature Engineering
# ==========================================


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Generate technical indicators and derived features."""
    data = df.copy()

    # Basic price features
    data["Daily_Range"] = data["High"] - data["Low"]
    data["Intraday_Return"] = (data["Close"] - data["Open"]) / data["Open"]

    prev_close = data["Close"].shift(1)
    data["Overnight_Gap"] = np.where(
        prev_close.notna(),
        (data["Open"] - prev_close) / prev_close,
        0,
    )

    # Rolling metrics
    rolling_high = data["High"].rolling(window=10).max()
    rolling_low = data["Low"].rolling(window=10).min()

    data["Close_to_10d_High"] = data["Close"] / rolling_high
    data["Close_to_10d_Low"] = data["Close"] / rolling_low

    # RSI (14)
    delta = data["Close"].diff()
    gain = delta.clip(lower=0).ewm(com=13, adjust=False).mean()
    loss = (-delta.clip(upper=0)).ewm(com=13, adjust=False).mean()

    rs = np.divide(gain, loss, out=np.zeros_like(gain), where=loss != 0)
    data["RSI_14"] = 100 - (100 / (1 + rs))

    # MACD
    ema12 = data["Close"].ewm(span=12, adjust=False).mean()
    ema26 = data["Close"].ewm(span=26, adjust=False).mean()

    data["MACD"] = ema12 - ema26
    data["MACD_Signal"] = data["MACD"].ewm(span=9, adjust=False).mean()
    data["MACD_Histogram"] = data["MACD"] - data["MACD_Signal"]

    return data.dropna()


def build_multi_day_targets(
    df: pd.DataFrame, days: int = FORECAST_DAYS
) -> Tuple[pd.DataFrame, List[str]]:
    """Create future return targets for multiple days ahead."""
    data = df.copy()
    target_cols: List[str] = []

    for i in range(1, days + 1):
        col = f"Return_{i}d"
        data[col] = (data["Close"].shift(-i) - data["Close"]) / data["Close"]
        target_cols.append(col)

    return data, target_cols


# ==========================================
# News Fetching (Robust RSS Implementation)
# ==========================================


def fetch_stock_news(ticker_symbol: str) -> List[dict]:
    """Fetch latest news from Yahoo Finance official RSS feed."""
    try:
        url = f"https://feeds.finance.yahoo.com/rss/2.0/headline?s={ticker_symbol}&region=US&lang=en-US"

        # Add User-Agent to prevent 403 Forbidden errors
        req = urllib.request.Request(
            url, headers={'User-Agent': 'Mozilla/5.0'})

        # Use a timeout (5 seconds) so a hanging network request doesn't freeze the API
        with urllib.request.urlopen(req, timeout=5) as response:
            xml_data = response.read()

        root = ET.fromstring(xml_data)
        formatted_news: List[dict] = []

        for item in root.findall('.//item')[:10]:
            formatted_news.append({
                "title": item.findtext('title') or "No Title",
                "publisher": "Yahoo Finance",
                "link": item.findtext('link') or "#",
                "publish_time": item.findtext('pubDate') or ""
            })

        return formatted_news

    except Exception as e:
        print(f"News fetch error for {ticker_symbol}: {e}")
        return []


# ==========================================
# API Endpoint
# ==========================================


@app.get("/api/v1/forecast/{ticker}", response_model=PredictionResponse)
async def get_5_day_forecast(ticker: str) -> PredictionResponse:
    """Return 5-day price forecast for a given stock ticker."""
    try:
        stock = yf.Ticker(ticker)
        raw_data = stock.history(period="3y")

        if raw_data.empty:
            raise HTTPException(
                status_code=404,
                detail=f"No data found for ticker '{ticker}'",
            )

        currency = stock.info.get("currency", "USD") if stock.info else "USD"

        # Feature engineering
        data = engineer_features(raw_data)

        # Build targets
        data, target_cols = build_multi_day_targets(data)

        historical_data = data.dropna(subset=target_cols)
        live_row = data.iloc[[-1]]

        # Training
        model = RandomForestRegressor(
            n_estimators=150,
            max_depth=8,
            random_state=42,
            n_jobs=-1,
        )

        model.fit(
            historical_data[FEATURE_COLS],
            historical_data[target_cols],
        )

        # Prediction
        predicted_returns = model.predict(live_row[FEATURE_COLS])[0]

        latest_close = float(live_row["Close"].values[0])
        latest_date = live_row.index[0]

        forecast: List[dict] = []
        for i, ret in enumerate(predicted_returns, start=1):
            predicted_price = latest_close * (1 + float(ret))
            forecast.append({
                "day_ahead": i,
                "target_date": (latest_date + timedelta(days=i)).strftime("%Y-%m-%d"),
                "predicted_price": round(predicted_price, 2),
            })

        # Indicators
        indicators = {
            "rsi_14": round(float(live_row["RSI_14"].values[0]), 2),
            "macd": round(float(live_row["MACD"].values[0]), 2),
            "macd_signal": round(float(live_row["MACD_Signal"].values[0]), 2),
            "macd_histogram": round(float(live_row["MACD_Histogram"].values[0]), 2),
        }

        return {
            "ticker": ticker.upper(),
            "latest_date": latest_date.strftime("%Y-%m-%d"),
            "latest_close_price": round(latest_close, 2),
            "currency": currency,
            "forecast": forecast,
            "technical_indicators": indicators,
            "recent_news": fetch_stock_news(ticker),
        }

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {str(exc)}",
        )


# ==========================================
# Run Server
# ==========================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
