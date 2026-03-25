import { Button } from "@heroui/react";
import { ArrowDownToLine } from "@gravity-ui/icons";
const DashHeader = () => {
  var user = "Jatinjay Mohapatra";
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-foreground text-xl font-semibold">
        Greetings, Mr. {user}
      </h1>

      <Button variant="tertiary" size="sm">
        <ArrowDownToLine />
        Download Report
      </Button>
    </div>
  );
};

export default DashHeader;
