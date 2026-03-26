import DashHeader from "./DashHeader";
import FuturePrices from "./FuturePrice";
import News from "./news";

const Dashboard = () => {
  var ticker = "AAPL";

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <DashHeader />
      <div>
        <FuturePrices ticker={ticker} />
      </div>
      <News ticker={ticker} />
    </main>
  );
};

export default Dashboard;
