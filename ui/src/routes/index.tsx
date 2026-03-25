import { createFileRoute } from "@tanstack/react-router";

import SideBar from "../components/SideBar";
import Dashboard from "../components/Dashboard";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex h-screen w-full bg-background">
      <SideBar />
      <Dashboard />
    </div>
  );
}
