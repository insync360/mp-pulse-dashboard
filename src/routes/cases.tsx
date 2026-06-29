import { createFileRoute } from "@tanstack/react-router";
import { CasesView } from "@/components/cases-view";

export const Route = createFileRoute("/cases")({
  head: () => ({
    meta: [
      { title: "Cases — Citizen Pulse" },
      { name: "description", content: "Unified case-management for grievances, scheme requests, recommendations, emergencies and enquiries." },
    ],
  }),
  component: () => <CasesView />,
});
