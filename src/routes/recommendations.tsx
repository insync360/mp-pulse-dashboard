import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "./accounts";

export const Route = createFileRoute("/recommendations")({
  head: () => ({ meta: [{ title: "Recommendations — MP Pulse" }] }),
  component: () => (
    <PlaceholderPage
      title="AI Recommendations"
      description="Suggested content, timing, and outreach moves to drive sentiment."
    />
  ),
});
