import { ShieldCheck, Building2, User, ArrowRight, FileSignature } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useData } from "@/data/store";
import type { Case, Category, Ward } from "@/data/types";

// Default escalation path by category.
const ESCALATION: Partial<Record<Category, string[]>> = {
  Water: ["AEE", "EE Division", "CE", "Chairman BWSSB"],
  Roads: ["AE/AEE", "EE Sub-division", "JC Zone", "Commissioner BBMP"],
  Electricity: ["AE", "AEE", "EE O&M", "SE BESCOM"],
  Sanitation: ["Health Inspector", "AEE SWM", "JC SWM"],
  Health: ["MO PHC", "JC Health", "DHO", "Commissioner H&FW"],
  Education: ["HM", "BEO", "DDPI", "Commissioner DPI"],
  Police: ["Inspector", "ACP", "DCP", "Joint CP"],
  "Land/Revenue": ["VA", "RI", "Tahsildar", "AC", "DC"],
  "Pension/Ration": ["VA", "Tahsildar", "AC", "DC", "Secretary Soc. Welfare"],
  Housing: ["Engineer BBMP", "JC Welfare", "Commissioner"],
  "Civic/BBMP": ["AEE", "EE", "JC Zone", "Commissioner BBMP"],
  Other: ["Owner desk", "Department", "Secretary"],
};

const TEMPLATE_BY_CAT: Partial<Record<Category, string>> = {
  Water: "bwssb",
  Roads: "bbmp",
  Electricity: "bescom",
  Sanitation: "bbmp",
  Health: "health",
  Education: "edu",
  Police: "police",
  "Land/Revenue": "tahsildar",
  "Pension/Ration": "tahsildar",
  Housing: "mc",
  "Civic/BBMP": "mc",
  Other: "formal-req",
};

export function AuthorityHintPanel({ c, onGenerateLetter }: {
  c: { category: Category; wardId?: Ward; departmentId?: string; officerId?: string };
  onGenerateLetter?: () => void;
}) {
  const { departments, officers, getOfficer } = useData();
  const dept = c.departmentId ? departments.find((d) => d.id === c.departmentId) : undefined;
  const officer = c.officerId ? getOfficer(c.officerId) : undefined;

  // Suggest an officer if not set: same category-mapped dept + same ward
  const suggested = officers
    .filter((o) => o.jurisdiction === c.wardId || o.jurisdiction === "Constituency")
    .slice(0, 2);

  const path = ESCALATION[c.category] ?? ESCALATION.Other!;
  const tmpl = TEMPLATE_BY_CAT[c.category] ?? "formal-req";

  return (
    <Card className="p-4 border-l-4 border-l-saffron bg-saffron/5">
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck className="h-4 w-4 text-saffron" />
        <div className="text-sm font-semibold text-navy">Authority Mapping</div>
        <Badge variant="outline" className="text-[10px]">embedded</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-start gap-2">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Responsible dept.</div>
            <div className="font-medium text-navy">{dept?.name ?? "—"}</div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <User className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Officer</div>
            <div className="font-medium text-navy">{officer?.name ?? "—"}</div>
            <div className="text-muted-foreground">{officer?.designation}</div>
          </div>
        </div>
      </div>

      {!officer && suggested.length > 0 && (
        <div className="mt-3 text-xs">
          <div className="text-muted-foreground mb-1">Suggested officers for {c.wardId}:</div>
          <div className="flex flex-wrap gap-1.5">
            {suggested.map((o) => (
              <Badge key={o.id} variant="outline" className="text-[10px]">{o.name} · {o.designation}</Badge>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3">
        <div className="text-[10px] uppercase text-muted-foreground mb-1">Escalation path</div>
        <div className="flex flex-wrap items-center gap-1 text-[11px]">
          {path.map((step, i) => (
            <span key={step} className="inline-flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded border bg-card text-navy">{step}</span>
              {i < path.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 pt-3 border-t">
        <div className="text-[11px] text-muted-foreground">
          Template: <span className="font-mono text-navy">{tmpl}</span>
        </div>
        {onGenerateLetter && (
          <Button size="sm" className="bg-saffron hover:bg-saffron/90 text-navy h-7" onClick={onGenerateLetter}>
            <FileSignature className="h-3 w-3" /> Generate pre-merged letter
          </Button>
        )}
      </div>
    </Card>
  );
}

export function suggestedTemplateFor(c: Case): string {
  return TEMPLATE_BY_CAT[c.category] ?? "formal-req";
}
