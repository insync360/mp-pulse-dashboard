import { createFileRoute } from "@tanstack/react-router";
import { Inbox } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/unified-inbox")({
  head: () => ({ meta: [{ title: "Unified Inbox — MP Pulse" }] }),
  component: () => <PlaceholderPage title="Unified Inbox" icon={Inbox} />,
});
