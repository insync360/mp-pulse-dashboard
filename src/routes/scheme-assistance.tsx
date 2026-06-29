import { createFileRoute, Link } from "@tanstack/react-router";
import { CasesView } from "@/components/cases-view";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useData } from "@/data/store";

export const Route = createFileRoute("/scheme-assistance")({
  head: () => ({ meta: [{ title: "Scheme Assistance — Citizen Pulse" }] }),
  component: SchemeAssistancePage,
});

function SchemeAssistancePage() {
  const { schemes, departments } = useData();
  return (
    <div>
      <div className="px-4 md:px-6 lg:px-8 pt-6 max-w-[1400px] mx-auto">
        <Card className="p-5 mb-4">
          <h2 className="font-semibold text-navy mb-2">Scheme catalog</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Quick reference for the most-asked welfare schemes. Scheme requests are now tracked as Cases below.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {schemes.map((s) => {
              const dept = departments.find((d) => d.id === s.departmentId);
              return (
                <div key={s.id} className="rounded-lg border p-3">
                  <div className="font-medium text-navy text-sm">{s.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{dept?.short}</div>
                  <a href={`https://${s.portal}`} target="_blank" rel="noreferrer"
                    className="text-xs text-saffron inline-flex items-center gap-1 mt-2">
                    {s.portal} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      <CasesView
        lockedType="SchemeRequest"
        title="Scheme Requests"
        description="Citizen scheme-assistance cases — shared with the unified Cases module."
      />
    </div>
  );
}
