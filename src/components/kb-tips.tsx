import { Lightbulb, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import type { Category } from "@/data/types";

const TIPS: Partial<Record<Category, { title: string; body: string }[]>> = {
  Water: [
    { title: "First check BWSSB jurisdiction", body: "Use the RR number on the citizen's last bill. Outside BWSSB → route to GP / Mini Water Supply via EO Taluk Panchayat." },
    { title: "Acute SLA: 48 hours", body: "Letter to AEE Service Station with copy to EE Division. Escalate to CE if no acknowledgement in 24h." },
  ],
  Roads: [
    { title: "Identify the road owner first", body: "BBMP for city roads, PWD for State Highways, NHAI for NHs, GP for peri-urban. Wrong dept = 30-day delay." },
    { title: "Always attach geo-tagged photo", body: "Without GPS the file is returned. Use the Field app or Google Maps screenshot with pin." },
  ],
  "Pension/Ration": [
    { title: "Documents most-rejected-for", body: "Bank IFSC mismatch and missing spouse death certificate cause 60% of pension rejections. Verify both at intake." },
  ],
  "Land/Revenue": [
    { title: "Escalate to AC/DC, not just Tahsildar", body: "Khata cases sit at sub-registrar. Mark CC to Assistant Commissioner and Deputy Commissioner from L2." },
  ],
  Police: [
    { title: "Reference the FIR number", body: "Letters without FIR no. get filed away. If no FIR, request one before the recommendation letter." },
  ],
  Health: [
    { title: "Engage DHO + BBMP Health jointly", body: "Urban PHC issues need both DHO and BBMP JC Health on the same letter for action." },
  ],
};

export function KbTips({ category, compact }: { category?: string; compact?: boolean }) {
  const tips = (category && TIPS[category as Category]) || [];
  if (tips.length === 0) {
    return (
      <Card className="p-3 bg-saffron/5 border-saffron/30">
        <div className="flex items-center gap-1.5 text-xs text-saffron font-semibold mb-1">
          <Lightbulb className="h-3.5 w-3.5" /> Knowledge Base
        </div>
        <p className="text-xs text-muted-foreground">No category-specific tips. Search the KB for similar past cases.</p>
        <Link to="/knowledge-base" className="text-xs text-saffron mt-1 inline-flex items-center gap-0.5">
          Open KB <ArrowRight className="h-3 w-3" />
        </Link>
      </Card>
    );
  }
  return (
    <Card className={`${compact ? "p-3" : "p-4"} bg-saffron/5 border-saffron/30`}>
      <div className="flex items-center gap-1.5 text-xs text-saffron font-semibold mb-2">
        <Lightbulb className="h-3.5 w-3.5" /> Knowledge Base — how to handle this
      </div>
      <ul className="space-y-2">
        {tips.map((t) => (
          <li key={t.title} className="text-xs">
            <div className="font-semibold text-navy">{t.title}</div>
            <div className="text-muted-foreground mt-0.5">{t.body}</div>
          </li>
        ))}
      </ul>
      <Link to="/knowledge-base" className="text-xs text-saffron mt-2 inline-flex items-center gap-0.5">
        More in KB <ArrowRight className="h-3 w-3" />
      </Link>
    </Card>
  );
}
