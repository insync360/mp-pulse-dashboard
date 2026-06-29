import { createFileRoute } from "@tanstack/react-router";
import { CasesView } from "@/components/cases-view";

export const Route = createFileRoute("/closure-verification")({
  head: () => ({ meta: [{ title: "Closure Verification — Citizen Pulse" }] }),
  component: () => (
    <CasesView
      lockedType="AwaitingClosure"
      title="Closure Verification"
      description="Cases with action taken — waiting for citizen confirmation before final closure."
    />
  ),
});
