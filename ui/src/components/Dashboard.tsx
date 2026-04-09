import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

import DashHeader from "./DashHeader";
import FuturePrices from "./FuturePrice";
import Stock from "./Stock";
import PriceChart from "./PriceChart";
import Summarize from "./summarise";
import LockScreen from "./LockScreen";

const Dashboard = () => {
  const navigate = useNavigate();
  const [ticker, setTicker] = useState("NVDA");
  const [isDownloading, setIsDownloading] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("quantUserProfile");
    if (!savedUser) {
      navigate({ to: "/profile" });
    }
  }, [navigate]);

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;

    try {
      setIsDownloading(true);

      await new Promise((resolve) => setTimeout(resolve, 200));

      const width = element.scrollWidth;
      const height = element.scrollHeight;

      const imgData = await toPng(element, {
        pixelRatio: 2,
        backgroundColor: "#18181b",
        width: width,
        height: height,
        style: {
          overflow: "visible",
        },
        filter: (node) => {
          const exclusionId = "no-export";
          return node.id !== exclusionId;
        },
      });

      const pdf = new jsPDF({
        orientation: width > height ? "landscape" : "portrait",
        unit: "px",
        format: [width, height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save(`${ticker}-Forecast-Report.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <LockScreen>
      <main ref={printRef} className="flex-1 p-8 overflow-y-auto">
        <div id="no-export">
          <DashHeader
            onDownload={handleDownloadPdf}
            isDownloading={isDownloading}
          />
        </div>
        <div className="grid grid-cols-[1fr_316px] gap-3 p-4">
          <div className="flex flex-col gap-3">
            <Stock ticker={ticker} setTicker={setTicker} />
            <PriceChart ticker={ticker} />
            <Summarize ticker={ticker} />
          </div>
          <FuturePrices ticker={ticker} />
        </div>
      </main>
    </LockScreen>
  );
};

export default Dashboard;
