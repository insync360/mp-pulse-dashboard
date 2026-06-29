import { createFileRoute } from "@tanstack/react-router";
import { PiggyBank } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/development-demand-bank")({
  head: () => ({ meta: [{ title: "Development Demand Bank — MP Pulse" }] }),
  component: () => <PlaceholderPage title="Development Demand Bank" icon={PiggyBank} />,
});
