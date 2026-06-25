import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/visitors")({
  head: () => ({ meta: [{ title: "Visitors & Appointments — MP Pulse" }] }),
  component: () => (
    <PlaceholderPage
      title="Visitors & Appointments"
      icon={Users}
      emptyTitle="Front-office queue is empty"
      emptyBody="Walk-in visitors, scheduled appointments and meeting requests from your constituency office will appear here once the front-desk app starts syncing."
    />
  ),
});
