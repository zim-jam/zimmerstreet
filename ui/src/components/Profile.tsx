import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Card, Input, Button } from "@heroui/react";

const Profile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [firm, setFirm] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("quantUserProfile");
    if (saved) {
      const parsed = JSON.parse(saved);
      setName(parsed.name || "");
      setEmail(parsed.email || "");
      setFirm(parsed.firm || "");
    }
  }, []);

  const handleSaveProfile = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const profileData = { name, email, firm };
    localStorage.setItem("quantUserProfile", JSON.stringify(profileData));

    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-md rounded-2xl">
        <Card.Header className="flex-col items-start gap-1 pt-8 pb-4 px-8 border-none">
          <h2 className="text-2xl font-bold text-foreground">
            Welcome to Zimmer Street Dash
          </h2>
          <p className="text-sm text-default-500">
            Please complete your profile to initialize the workspace.
          </p>
        </Card.Header>

        <Card.Content className="px-8 pb-8 pt-2">
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Full Name <span className="text-danger">*</span>
                </label>
                <Input
                  placeholder="e.g. Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Email Address <span className="text-danger">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="trader@zimmerstreet.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Firm / Organization
                </label>
                <Input
                  placeholder="e.g. Zimmer Streets"
                  value={firm}
                  onChange={(e) => setFirm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full font-semibold bg-primary text-primary-foreground mt-2"
            >
              Save Profile & Continue
            </Button>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Profile;
