import { createFileRoute } from "@tanstack/react-router";
import { Mic } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/briefings-speeches")({
  head: () => ({ meta: [{ title: "Briefings & Speeches — MP Pulse" }] }),
  component: () => (
    <PlaceholderPage
      title="Briefings & Speeches"
      icon={Mic}
      emptyTitle="Speechwriter workspace ready"
      emptyBody="Draft event briefs and speeches with auto-pulled local data, talking points aligned to party narrative, and translations in English, Hindi and Kannada."
    />
  ),
});
