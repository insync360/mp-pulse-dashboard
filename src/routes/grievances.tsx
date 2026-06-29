import { createFileRoute } from "@tanstack/react-router";
import { CasesView } from "@/components/cases-view";

export const Route = createFileRoute("/grievances")({
  head: () => ({ meta: [{ title: "Grievances — Citizen Pulse" }] }),
  component: () => (
    <CasesView
      lockedType="Grievance"
      title="Grievances"
      description="All grievance cases — one record type inside the unified Cases module."
    />
  ),
});
