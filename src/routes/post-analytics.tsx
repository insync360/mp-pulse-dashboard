import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "./accounts";

export const Route = createFileRoute("/post-analytics")({
  head: () => ({ meta: [{ title: "Post Analytics — MP Pulse" }] }),
  component: () => (
    <PlaceholderPage
      title="Post Analytics"
      description="Deep-dive engagement, virality, and audience breakdown per post."
    />
  ),
});
