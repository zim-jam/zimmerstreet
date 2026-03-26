import { useState } from "react";

import DashHeader from "./DashHeader";
import FuturePrices from "./FuturePrice";
import News from "./news";
import Stock from "./Stock";

const Dashboard = () => {
  const [ticker, setTicker] = useState("");

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <DashHeader />
      <div className="grid grid-cols-[1fr_316px] gap-3 p-6">
        <Stock ticker={ticker} setTicker={setTicker} />
        <FuturePrices ticker={ticker} />
      </div>
      <News ticker={ticker} />
    </main>
  );
};

export default Dashboard;
