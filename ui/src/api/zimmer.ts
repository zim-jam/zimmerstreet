export type NewsItem = {
  title: string;
  publisher: string;
  link: string;
  publish_time: string;
};

export type ForecastDay = {
  day_ahead: number;
  target_date: string;
  predicted_price: number;
};

export type TechnicalIndicators = {
  rsi_14: number;
  macd: number;
  macd_signal: number;
  macd_histogram: number;
};

export type PredictionResponse = {
  ticker: string;
  latest_date: string;
  latest_close_price: number;
  currency: string;
  forecast: ForecastDay[];
  technical_indicators: TechnicalIndicators;
  recent_news: NewsItem[];
};

const API_BASE: string =
  (import.meta.env.VITE_API_BASE as string) || "http://localhost:8000";
const DEFAULT_TIMEOUT = 10_000; // ms

export class ApiError extends Error {
  public status: number;
  public body: string | null;

  constructor(status: number, message: string, body: string | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

async function request<T>(
  input: RequestInfo,
  init: RequestInit = {},
  timeout = DEFAULT_TIMEOUT,
): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(input, { signal: controller.signal, ...init });
    clearTimeout(id);

    const contentType = res.headers.get("content-type") || "";
    const text = await res.text();

    if (!res.ok) {
      const body = contentType.includes("application/json")
        ? tryParseJson(text)
        : text;
      throw new ApiError(
        res.status,
        res.statusText || "HTTP Error",
        typeof body === "string" ? body : JSON.stringify(body),
      );
    }

    return contentType.includes("application/json")
      ? (JSON.parse(text) as T)
      : (text as unknown as T);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if ((err as Error).name === "AbortError")
      throw new Error("Request timed out");
    throw err;
  }
}

function tryParseJson(input: string): unknown {
  try {
    return JSON.parse(input);
  } catch {
    return input;
  }
}

export async function getForecast(ticker: string): Promise<PredictionResponse> {
  if (!ticker || typeof ticker !== "string")
    throw new Error("`ticker` is required");

  const url = `${API_BASE.replace(/\/$/, "")}/api/v1/forecast/${encodeURIComponent(ticker)}`;
  return request<PredictionResponse>(url, { method: "GET" });
}

export default { getForecast };
