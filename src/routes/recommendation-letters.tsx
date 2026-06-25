import { createFileRoute } from "@tanstack/react-router";
import { FileSignature } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/recommendation-letters")({
  head: () => ({ meta: [{ title: "Recommendation Letters — MP Pulse" }] }),
  component: () => (
    <PlaceholderPage
      title="Recommendation Letters"
      icon={FileSignature}
      emptyTitle="Letter workflow ready"
      emptyBody="Draft, approve and dispatch recommendation letters to ministries, departments and PSUs — with full audit trail and template library."
    />
  ),
});
