import { createFileRoute } from "@tanstack/react-router";
import { Sun } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/daily-briefing")({
  head: () => ({ meta: [{ title: "Daily Briefing — MP Pulse" }] }),
  component: () => (
    <PlaceholderPage
      title="Daily Briefing"
      icon={Sun}
      emptyTitle="Today's briefing is being assembled"
      emptyBody="Your morning intelligence digest — overnight sentiment shifts, priority grievances, scheduled visits and recommended posts — will land here at 7:00 AM IST."
    />
  ),
});
