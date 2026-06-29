import { createFileRoute } from "@tanstack/react-router";
import { HandHelping } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/scheme-assistance")({
  head: () => ({ meta: [{ title: "Scheme Assistance — MP Pulse" }] }),
  component: () => <PlaceholderPage title="Scheme Assistance" icon={HandHelping} />,
});
