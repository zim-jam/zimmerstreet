import { Card, Chip, Spinner } from "@heroui/react";

import {
  CircleNumber1,
  CircleNumber2,
  CircleNumber3,
  CircleNumber4,
  CircleNumber5,
  CircleNumber6,
  CircleNumber7,
  CircleNumber8,
} from "@gravity-ui/icons";

import { useForecast } from "../hooks/useForecast";

interface FuturePricesProps {
  ticker: string;
}

const iconMap: Record<number, React.ElementType> = {
  1: CircleNumber1,
  2: CircleNumber2,
  3: CircleNumber3,
  4: CircleNumber4,
  5: CircleNumber5,
  6: CircleNumber6,
  7: CircleNumber7,
  8: CircleNumber8,
};

const FuturePrices = ({ ticker }: FuturePricesProps) => {
  const { data, isLoading, isError } = useForecast(ticker);

  if (!ticker) {
    return (
      <div>
        <h3 className="text-base font-semibold text-foreground">
          Future Prices
        </h3>
        <div className="text-left pt-8 text-muted">
          Please first select your stock
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-danger text-sm">
        Failed to load forecast for {ticker}.
      </div>
    );
  }

  const forecast = data?.forecast || [];
  const currency = data?.currency || "USD";

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="bg-transparent shadow-none border-none w-full max-w-sm">
      <Card.Header className="flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-foreground">
            Future Prices
          </h3>
          <Chip size="sm" variant="primary" className="text-default-500">
            {forecast.length}
          </Chip>
        </div>
      </Card.Header>

      <Card.Content className="flex flex-col gap-1.2 px-0 py-0">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Spinner size="sm" aria-label="Loading forecast..." />
          </div>
        ) : (
          forecast.map((day) => {
            const DayIcon = iconMap[day.day_ahead] || CircleNumber1;
            return (
              <div
                key={day.day_ahead}
                className="flex items-center justify-between rounded-lg px-1 py-1"
              >
                <div className="flex items-center gap-3">
                  <DayIcon className="w-6 h-6 text-muted" />

                  <div className="flex flex-col">
                    <span className="text-foreground text-xs font-medium">
                      Day {day.day_ahead}
                    </span>
                    <span className="text-muted text-xs">
                      {formatDate(day.target_date)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-foreground text-xs font-medium">
                    {formatCurrency(day.predicted_price)}
                  </span>
                  <span className="text-muted text-xs">Predicted</span>
                </div>
              </div>
            );
          })
        )}
      </Card.Content>
    </Card>
  );
};

export default FuturePrices;
