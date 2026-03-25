import { createFileRoute } from "@tanstack/react-router";

import SideBar from "../components/SideBar";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <SideBar />;
}
