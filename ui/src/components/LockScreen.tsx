import { useState } from "react";
import { Card, Input, Button } from "@heroui/react";
import { Lock } from "@gravity-ui/icons";

interface LockScreenProps {
  children: React.ReactNode;
}

const LockScreen = ({ children }: LockScreenProps) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const SECRET_CODE = "quant";

  const handleUnlock = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (code === SECRET_CODE) {
      setIsUnlocked(true);
      setError("");
    } else {
      setError("Invalid secret code.");
      setCode("");
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm shadow-md rounded-2xl">
          <Card.Header className="flex-col items-center gap-2 pt-8 pb-0 border-none">
            <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center text-danger">
              <Lock className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">
                Restricted Access
              </h2>
              <p className="text-sm text-default-500 mt-1">
                Please enter your secret code to view this dashboard.
              </p>
            </div>
          </Card.Header>

          <Card.Content className="px-6 py-8">
            <form
              onSubmit={handleUnlock}
              className="w-full flex flex-col gap-5"
            >
              <div className="flex flex-col gap-1.5">
                <Input
                  type="password"
                  placeholder="Enter secret code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  color={error ? "danger" : "default"}
                  className="w-full"
                  autoFocus
                />
                {error && (
                  <span className="text-danger text-xs px-1 font-medium">
                    {error}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                className="w-full font-semibold bg-primary text-primary-foreground"
              >
                Access Dashboard
              </Button>
            </form>
          </Card.Content>
        </Card>
      </div>
    );
  }
};

export default LockScreen;
