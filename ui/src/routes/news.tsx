import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import NewsTable from "../components/NewsTable";
import SideBar from "../components/SideBar";
import Stock from "../components/Stock";

export const Route = createFileRoute("/news")({
  component: RouteComponent,
});

function RouteComponent() {
  const [ticker, setTicker] = useState("NVDA");
  return (
    <div className="flex">
      <SideBar />
      <div className="p-8 w-full">
        <div className="p-4">
          <Stock ticker={ticker} setTicker={setTicker} />
        </div>
        <NewsTable ticker={ticker} />
      </div>
    </div>
  );
}
