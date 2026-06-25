import { createFileRoute } from "@tanstack/react-router";
import { Landmark } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/funds-projects")({
  head: () => ({ meta: [{ title: "Funds & Projects — MP Pulse" }] }),
  component: () => (
    <PlaceholderPage
      title="Funds & Projects"
      icon={Landmark}
      emptyTitle="MPLADS dashboard ready"
      emptyBody="Track sanctioned MPLADS funds, project status across wards, utilisation certificates and completion timelines — with photo evidence from the field."
    />
  ),
});
