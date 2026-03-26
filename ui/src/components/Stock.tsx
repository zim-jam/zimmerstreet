import { Input } from "@heroui/react";

interface StockProps {
  ticker: string;
  setTicker: (value: string) => void;
}

const Stock = ({ ticker, setTicker }: StockProps) => {
  return (
    <Input
      aria-label="Stock"
      className="w-64"
      placeholder="Enter stock symbol"
      value={ticker}
      onChange={(e) => setTicker(e.target.value)}
    />
  );
};

export default Stock;
