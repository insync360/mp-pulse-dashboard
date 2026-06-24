import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Info,
  PenLine,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunities — MP Pulse" },
      {
        name: "description",
        content:
          "Proactive conversation opportunities ranked by momentum, risk and constituency relevance.",
      },
    ],
  }),
  component: OpportunitiesPage,
});

type Phase = "Emerging" | "Accelerating" | "Peaking" | "Cooling";
type Risk = "Safe to engage" | "Engage carefully" | "Avoid";

type Opportunity = {
  id: string;
  topic: string;
  hashtag: string;
  momentum: number;
  phase: Phase;
  spark: number[];
  why: string;
  risk: Risk;
  relevance: number;
  whitespace?: boolean;
};

const opportunities: Opportunity[] = [
  {
    id: "o1",
    topic: "Bellandur Lake rejuvenation milestone",
    hashtag: "#SaveBellanduru",
    momentum: 88,
    phase: "Accelerating",
    spark: [10, 14, 22, 30, 42, 55, 71, 88],
    why: "Citizen videos of foam reduction trending; KSPCB report due tomorrow.",
    risk: "Safe to engage",
    relevance: 94,
    whitespace: true,
  },
  {
    id: "o2",
    topic: "Namma Metro Phase 3 funding clearance",
    hashtag: "#NammaMetroPhase3",
    momentum: 82,
    phase: "Peaking",
    spark: [40, 55, 62, 70, 78, 82, 84, 82],
    why: "Centre's nod expected this week; commuter associations actively posting.",
    risk: "Safe to engage",
    relevance: 91,
  },
  {
    id: "o3",
    topic: "Gig worker welfare board",
    hashtag: "#GigWorkerRights",
    momentum: 74,
    phase: "Accelerating",
    spark: [20, 28, 35, 44, 52, 60, 68, 74],
    why: "Karnataka draft bill leaked; Swiggy/Ola riders amplifying. Low MP ownership.",
    risk: "Engage carefully",
    relevance: 79,
    whitespace: true,
  },
  {
    id: "o4",
    topic: "Tech-park last-mile shuttle pilot",
    hashtag: "#ORRCommute",
    momentum: 69,
    phase: "Emerging",
    spark: [8, 12, 18, 25, 34, 48, 60, 69],
    why: "ORRCA proposed shuttle network — no political voice has claimed the idea yet.",
    risk: "Safe to engage",
    relevance: 88,
    whitespace: true,
  },
  {
    id: "o5",
    topic: "Cauvery water rationing protest",
    hashtag: "#CauveryCrisis",
    momentum: 81,
    phase: "Peaking",
    spark: [45, 58, 66, 74, 80, 83, 81, 79],
    why: "KR Puram protests gaining attention; high emotional charge.",
    risk: "Engage carefully",
    relevance: 92,
  },
  {
    id: "o6",
    topic: "Karnataka job reservation bill",
    hashtag: "#KarnatakaJobs",
    momentum: 76,
    phase: "Accelerating",
    spark: [30, 38, 45, 52, 60, 68, 72, 76],
    why: "Industry pushback today; polarised — depends on party line.",
    risk: "Avoid",
    relevance: 70,
  },
  {
    id: "o7",
    topic: "Semiconductor incentive — Karnataka shortlist",
    hashtag: "#MakeInKarnataka",
    momentum: 65,
    phase: "Emerging",
    spark: [12, 18, 24, 32, 42, 50, 58, 65],
    why: "Centre's ₹15,000 cr scheme names Karnataka; jobs angle is open.",
    risk: "Safe to engage",
    relevance: 84,
    whitespace: true,
  },
  {
    id: "o8",
    topic: "Whitefield flooding drainage audit",
    hashtag: "#FixWhitefield",
    momentum: 79,
    phase: "Peaking",
    spark: [35, 48, 60, 70, 76, 79, 78, 76],
    why: "Viral TOI piece + resident videos; constructive announcement window.",
    risk: "Engage carefully",
    relevance: 96,
  },
  {
    id: "o9",
    topic: "BMTC electric bus expansion",
    hashtag: "#GreenBMTC",
    momentum: 58,
    phase: "Emerging",
    spark: [10, 14, 20, 28, 36, 44, 52, 58],
    why: "Tender bids open Friday; positive sentiment, low coverage.",
    risk: "Safe to engage",
    relevance: 76,
    whitespace: true,
  },
  {
    id: "o10",
    topic: "Mysuru–Bengaluru toll hike",
    hashtag: "#TollBack",
    momentum: 54,
    phase: "Cooling",
    spark: [70, 68, 65, 60, 58, 56, 54, 52],
    why: "Conversation already cooling; late entry adds limited value.",
    risk: "Avoid",
    relevance: 60,
  },
];

const phaseColor: Record<Phase, string> = {
  Emerging: "bg-blue-50 text-blue-700 border-blue-200",
  Accelerating: "bg-saffron/15 text-saffron border-saffron/30",
  Peaking: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cooling: "bg-slate-100 text-slate-600 border-slate-200",
};

const riskMeta: Record<Risk, { class: string; icon: React.ElementType }> = {
  "Safe to engage": {
    class: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: ShieldCheck,
  },
  "Engage carefully": {
    class: "bg-amber-50 text-amber-700 border-amber-200",
    icon: ShieldAlert,
  },
  Avoid: { class: "bg-rose-50 text-rose-700 border-rose-200", icon: ShieldX },
};

function Sparkline({ data, color = "#FF9933" }: { data: number[]; color?: string }) {
  const w = 80;
  const h = 26;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth={1.5} points={points} strokeLinecap="round" />
      <circle
        cx={(data.length - 1) * step}
        cy={h - ((data[data.length - 1] - min) / range) * h}
        r={2}
        fill={color}
      />
    </svg>
  );
}

function MomentumBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-navy to-saffron rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function OpportunityCard({ o }: { o: Opportunity }) {
  const RiskIcon = riskMeta[o.risk].icon;
  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="text-sm font-semibold text-navy">{o.topic}</span>
            <span className="text-xs text-saffron font-medium">{o.hashtag}</span>
            {o.whitespace && (
              <Badge variant="outline" className="text-[10px] bg-saffron/10 text-saffron border-saffron/30">
                Whitespace
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            <span className="font-medium text-slate-700">Why now:</span> {o.why}
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <Badge variant="outline" className={phaseColor[o.phase]}>
              {o.phase}
            </Badge>
            <Badge variant="outline" className={riskMeta[o.risk].class}>
              <RiskIcon className="h-3 w-3 mr-1" />
              {o.risk}
            </Badge>
            <div className="text-xs text-slate-600">
              Relevance{" "}
              <span className="font-semibold text-navy">{o.relevance}</span>
              <span className="text-slate-400">/100</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0 w-[180px]">
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">Momentum</div>
              <div className="text-2xl font-semibold text-navy leading-none">{o.momentum}</div>
            </div>
            <Sparkline data={o.spark} />
          </div>
          <div className="w-full">
            <MomentumBar value={o.momentum} />
          </div>
          <Button size="sm" className="bg-navy hover:bg-navy/90 text-white h-8 text-xs w-full">
            <PenLine className="h-3.5 w-3.5 mr-1" />
            Generate Draft Post
          </Button>
        </div>
      </div>
    </Card>
  );
}

function OpportunitiesPage() {
  const sorted = useMemo(
    () => [...opportunities].sort((a, b) => b.momentum - a.momentum),
    [],
  );
  const whitespace = sorted.filter((o) => o.whitespace);
  const rest = sorted.filter((o) => !o.whitespace);

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-navy">Opportunities</h1>
          <p className="text-sm text-slate-500 mt-1">
            Proactive conversations ranked by momentum, risk and constituency relevance.
          </p>
        </div>
      </div>

      {/* Legend */}
      <Card className="p-4 bg-gradient-to-r from-navy/[0.03] to-saffron/[0.03]">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-navy/10 p-2">
            <Info className="h-4 w-4 text-navy" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-navy mb-2">
              Momentum Score Legend
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={phaseColor.Emerging}>Emerging</Badge>
                <span className="text-slate-600">0–60 · early signal</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={phaseColor.Accelerating}>Accelerating</Badge>
                <span className="text-slate-600">60–80 · rising fast</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={phaseColor.Peaking}>Peaking</Badge>
                <span className="text-slate-600">80+ · max attention</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={phaseColor.Cooling}>Cooling</Badge>
                <span className="text-slate-600">declining velocity</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Whitespace */}
      {whitespace.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-saffron" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-navy">
              Whitespace · Low political ownership
            </h2>
            <Badge variant="outline" className="text-[10px]">
              {whitespace.length} opportunities
            </Badge>
          </div>
          <div className="grid gap-3">
            {whitespace.map((o) => (
              <div key={o.id} className="relative">
                <div className="absolute -left-px top-4 bottom-4 w-1 rounded-full bg-saffron" />
                <OpportunityCard o={o} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rest */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-navy" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-navy">
            All trending conversations
          </h2>
        </div>
        <div className="grid gap-3">
          {rest.map((o) => (
            <OpportunityCard key={o.id} o={o} />
          ))}
        </div>
      </div>
    </div>
  );
}
