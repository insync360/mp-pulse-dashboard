import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "./accounts";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — MP Pulse" }] }),
  component: () => (
    <PlaceholderPage
      title="Reports"
      description="Generate weekly, monthly, and event-driven briefings for the MP's office."
    />
  ),
});
