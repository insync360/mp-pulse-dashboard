import { createFileRoute } from "@tanstack/react-router";
import { Users2 } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/local-body-meetings")({
  head: () => ({ meta: [{ title: "Local Body Meetings — MP Pulse" }] }),
  component: () => <PlaceholderPage title="Local Body Meetings" icon={Users2} />,
});
