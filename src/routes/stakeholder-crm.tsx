import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/stakeholder-crm")({
  head: () => ({ meta: [{ title: "Stakeholder CRM — MP Pulse" }] }),
  component: () => (
    <PlaceholderPage
      title="Stakeholder CRM"
      icon={Contact}
      emptyTitle="Relationship graph initialising"
      emptyBody="Track interactions with party leaders, bureaucrats, donors, journalists and community heads — with last-contact reminders and influence scoring."
    />
  ),
});
