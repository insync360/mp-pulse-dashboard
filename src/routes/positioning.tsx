import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "./accounts";

export const Route = createFileRoute("/positioning")({
  head: () => ({ meta: [{ title: "Positioning — MP Pulse" }] }),
  component: () => (
    <PlaceholderPage
      title="Positioning"
      description="Share-of-voice vs. peer MPs and topic-level brand positioning."
    />
  ),
});
