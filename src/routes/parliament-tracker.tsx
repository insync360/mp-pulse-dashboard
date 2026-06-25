import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/parliament-tracker")({
  head: () => ({ meta: [{ title: "Parliament Tracker — MP Pulse" }] }),
  component: () => (
    <PlaceholderPage
      title="Parliament Tracker"
      icon={Building2}
      emptyTitle="Session tracker ready"
      emptyBody="Bills listed, questions tabled, attendance, debate participation and committee work — benchmarked against Karnataka peers."
    />
  ),
});
