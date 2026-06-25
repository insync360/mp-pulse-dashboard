import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/grievances")({
  head: () => ({ meta: [{ title: "Grievances — MP Pulse" }] }),
  component: () => (
    <PlaceholderPage
      title="Grievances"
      icon={ClipboardList}
      emptyTitle="Grievance inbox ready"
      emptyBody="Citizen complaints — from social mentions, email, walk-ins and helplines — will be triaged here with urgency, location and assigned officer."
    />
  ),
});
