import { createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/commitment-tracker")({
  head: () => ({ meta: [{ title: "Commitment & Assurance Tracker — MP Pulse" }] }),
  component: () => <PlaceholderPage title="Commitment & Assurance Tracker" icon={ListChecks} />,
});
