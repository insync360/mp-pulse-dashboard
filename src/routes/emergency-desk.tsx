import { createFileRoute } from "@tanstack/react-router";
import { Siren } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/emergency-desk")({
  head: () => ({ meta: [{ title: "Emergency Desk — MP Pulse" }] }),
  component: () => <PlaceholderPage title="Emergency Desk" icon={Siren} />,
});
