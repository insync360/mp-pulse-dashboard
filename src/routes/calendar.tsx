import { createFileRoute } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar & Visits — MP Pulse" }] }),
  component: () => (
    <PlaceholderPage
      title="Calendar & Visits"
      icon={Calendar}
      emptyTitle="Schedule is clear"
      emptyBody="Constituency visits, parliament sittings, party events and public engagements — unified on one calendar with travel and protocol notes."
    />
  ),
});
