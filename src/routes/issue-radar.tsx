import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "./accounts";

export const Route = createFileRoute("/issue-radar")({
  head: () => ({ meta: [{ title: "Issue Radar — MP Pulse" }] }),
  component: () => (
    <PlaceholderPage
      title="Issue Radar"
      description="Emerging civic issues by ward, hashtag, and momentum."
    />
  ),
});
