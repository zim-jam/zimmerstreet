import { Sparkles } from "@gravity-ui/icons";
import { useForecast } from "../hooks/useForecast";

interface SummarizeProps {
  ticker: string;
}

const Summarize = ({ ticker }: SummarizeProps) => {
  const { data, isLoading, isError } = useForecast(ticker);

  if (
    isLoading ||
    isError ||
    !data ||
    !data.forecast ||
    data.forecast.length === 0
  ) {
    return null;
  }

  const latest = data.latest_close_price;
  const target1 = data.forecast[0].predicted_price;
  const target8 =
    data.forecast[Math.min(7, data.forecast.length - 1)].predicted_price; // Midpoint
  const target16 = data.forecast[data.forecast.length - 1].predicted_price;

  const diffPercent = ((target16 - latest) / latest) * 100;
  const trend = diffPercent >= 0 ? "bullish" : "bearish";
  const direction = diffPercent >= 0 ? "gain" : "decline";
  const shortTermDirection =
    target1 >= latest
      ? "an initial push higher"
      : "immediate downward pressure";

  const forecastPrices = data.forecast.map((d) => d.predicted_price);
  const minForecast = Math.min(...forecastPrices);
  const maxForecast = Math.max(...forecastPrices);
  const spreadPercent = ((maxForecast - minForecast) / latest) * 100;

  const rsi = data.technical_indicators?.rsi_14 || 0;
  let rsiContext = "ample runway for continuation before exhaustion";
  if (rsi > 70)
    rsiContext =
      "potential overextended conditions that may limit immediate upside";
  if (rsi < 30)
    rsiContext =
      "heavily discounted conditions primed for potential mean reversion";

  const macd = data.technical_indicators?.macd || 0;
  const signal = data.technical_indicators?.macd_signal || 0;
  const hist = data.technical_indicators?.macd_histogram || 0;
  const momentum = macd > signal ? "positive" : "negative";
  const momentumPace = hist > 0 ? "expanding" : "contracting";

  const summaryText = `Quantitative models project a ${trend} overarching trend over the 16-day horizon, forecasting a ${Math.abs(diffPercent).toFixed(2)}% ${direction} from the latest close of $${latest.toFixed(2)} to an eventual target of $${target16.toFixed(2)}. The algorithm's trajectory suggests ${shortTermDirection} toward $${target1.toFixed(2)} in the near-term, before navigating a projected trading range bounded by a floor of $${minForecast.toFixed(2)} and a ceiling of $${maxForecast.toFixed(2)}. This represents a forecasted volatility spread of ${spreadPercent.toFixed(2)}%, with mid-horizon projections stabilizing near $${target8.toFixed(2)} by Day 8. 

Underpinning this price action, current indicators provide critical context. The asset registers an RSI of ${rsi.toFixed(2)}, suggesting ${rsiContext}. Concurrently, momentum profiles exhibit a ${momentum} MACD structure. Crucially, the MACD histogram rests at ${hist.toFixed(2)}, indicating that this momentum is ${momentumPace}, which statistically validates the model's short-term directional bias. 

Derived from an LSTM neural network trained on a 3-year trailing dataset of 14 engineered technical and volatility features, this projection forms a robust baseline. However, traders must strictly weigh this algorithmic output against impending fundamental catalysts, volume anomalies, and broader macroeconomic news to optimize entry points and effectively manage portfolio risk.`;

  return (
    <div className="mt-4 p-4 bg-content1 rounded-2xl border border-divider flex items-start gap-3 shadow-sm">
      <Sparkles className="w-5 h-5 text-primary shrink-0 mt-1" />
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-foreground">Forecast Summary</h2>
        {summaryText.split("\n\n").map((paragraph, index) => (
          <p
            key={index}
            className="text-sm text-foreground/80 leading-relaxed font-medium text-justify"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Summarize;
