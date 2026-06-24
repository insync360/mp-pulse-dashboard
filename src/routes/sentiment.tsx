import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "./accounts";

export const Route = createFileRoute("/sentiment")({
  head: () => ({ meta: [{ title: "Sentiment — MP Pulse" }] }),
  component: () => (
    <PlaceholderPage
      title="Sentiment Analysis"
      description="Track tone of voice across constituents, media, and political opponents."
    />
  ),
});
