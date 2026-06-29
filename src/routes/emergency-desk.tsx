import { createFileRoute } from "@tanstack/react-router";
import { CasesView } from "@/components/cases-view";

export const Route = createFileRoute("/emergency-desk")({
  head: () => ({ meta: [{ title: "Emergency Desk — Citizen Pulse" }] }),
  component: () => (
    <CasesView
      lockedType="Emergency"
      title="Emergency Desk"
      description="Speed-first incidents — emergencies are Cases with the highest priority and an urgent skin."
      urgent
    />
  ),
});
