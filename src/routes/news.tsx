import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "./accounts";

export const Route = createFileRoute("/news")({
  head: () => ({ meta: [{ title: "News & Hashtags — MP Pulse" }] }),
  component: () => (
    <PlaceholderPage
      title="News & Hashtags"
      description="Live feed of news mentions and trending hashtags across Karnataka."
    />
  ),
});
