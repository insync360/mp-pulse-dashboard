import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/event-lifecycle")({
  head: () => ({ meta: [{ title: "Event Lifecycle — MP Pulse" }] }),
  component: () => <PlaceholderPage title="Event Lifecycle" icon={CalendarCheck} />,
});
