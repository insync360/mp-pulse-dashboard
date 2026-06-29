import { createFileRoute } from "@tanstack/react-router";
import { Network } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/authority-mapping")({
  head: () => ({ meta: [{ title: "Authority Mapping — MP Pulse" }] }),
  component: () => <PlaceholderPage title="Authority Mapping" icon={Network} />,
});
