import { Button, Spinner } from "@heroui/react";

import { ArrowDownToLine } from "@gravity-ui/icons";

interface DashHeaderProps {
  onDownload: () => void;
  isDownloading?: boolean;
}

const DashHeader = ({ onDownload, isDownloading }: DashHeaderProps) => {
  var user = "Jatinjay Mohapatra";
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-foreground text-xl font-semibold">
        Greetings, Mr. {user}
      </h1>

      <Button
        variant="tertiary"
        size="sm"
        onPress={onDownload}
        isDisabled={isDownloading}
      >
        {isDownloading ? (
          <Spinner size="sm" className="w-4 h-4" />
        ) : (
          <ArrowDownToLine className="w-4 h-4" />
        )}
        {isDownloading ? "Generating PDF..." : "Download Report"}
      </Button>
    </div>
  );
};

export default DashHeader;
