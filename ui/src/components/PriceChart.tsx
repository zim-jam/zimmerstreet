import { useMemo } from "react";
import { Card, Spinner } from "@heroui/react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
  Tooltip,
  ReferenceDot,
  XAxis,
} from "recharts";

import { CircleInfo } from "@gravity-ui/icons";

import { useForecast } from "../hooks/useForecast";

interface PriceChartProps {
  ticker: string;
}

const PriceChart = ({ ticker }: PriceChartProps) => {
  const { data, isLoading, isError } = useForecast(ticker);

  const chartData = useMemo(() => {
    if (!data) return [];

    const history = (data.historical_prices || []).map((day) => ({
      date: new Date(day.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      price: day.close,
      isForecast: false,
    }));

    const forecast = (data.forecast || []).map((day) => ({
      date: new Date(day.target_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      price: day.predicted_price,
      isForecast: true,
    }));

    return [...history, ...forecast];
  }, [data]);

  if (isError) {
    return (
      <div className="text-danger text-sm">
        Failed to load chart data for {ticker}.
      </div>
    );
  }

  const latestPrice = data?.latest_close_price || 0;

  const forecastLength = data?.forecast?.length || 0;
  const finalForecastPrice =
    forecastLength > 0 ? data!.forecast[forecastLength - 1].predicted_price : 0;

  const priceDiff = finalForecastPrice - latestPrice;
  const percentDiff = latestPrice ? (priceDiff / latestPrice) * 100 : 0;
  const isPositive = priceDiff >= 0;

  const historyLength = data?.historical_prices?.length || 0;

  return (
    <div className="pt-3">
      <Card className="rounded-2xl shadow-sm bg-content1 w-full border border-divider">
        <Card.Header className="flex-row items-start justify-between pb-0 pt-5 px-5">
          <div className="flex flex-col gap-3">
            <div className="flex w-full items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">
                {ticker} Overview
              </h3>
            </div>

            <div className="flex flex-col gap-0.5">
              <div className="text-default-500 flex items-center gap-1 text-xs">
                Latest Close
                <CircleInfo className="w-3 h-3" />
              </div>

              <span className="text-foreground text-2xl font-semibold">
                $
                {latestPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>

              <span
                className={`text-xs font-medium ${isPositive ? "text-success" : "text-danger"}`}
              >
                {isPositive ? "+" : ""}${Math.abs(priceDiff).toFixed(2)} (
                {isPositive ? "+" : ""}
                {percentDiff.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="cursor-pointer text-xs font-medium transition-colors text-focus">
              1D
            </button>
          </div>
        </Card.Header>

        <Card.Content className="px-0 pb-0 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-45.5 w-full">
              <Spinner size="sm" aria-label="Loading chart..." />
            </div>
          ) : (
            <div className="h-45.5 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const point = payload[0].payload;
                        return (
                          <div className="bg-surface border border-border shadow-md rounded-lg p-2 text-xs">
                            <div className="text-muted mb-1">{point.date}</div>
                            <div className="font-semibold text-(--foreground)">
                              ${point.price.toFixed(2)}
                              {point.isForecast && (
                                <span className="text-muted ml-1">(Est.)</span>
                              )}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <XAxis dataKey="date" hide />

                  <YAxis domain={["dataMin - 2", "dataMax + 2"]} hide />

                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="var(--focus)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: "var(--focus)",
                      strokeWidth: 0,
                    }}
                  />

                  {historyLength > 0 && forecastLength > 0 && (
                    <ReferenceDot
                      x={chartData[historyLength - 1]?.date}
                      y={latestPrice}
                      r={4}
                      fill="var(--focus)"
                      stroke="var(--background)"
                      strokeWidth={2}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
};

export default PriceChart;
