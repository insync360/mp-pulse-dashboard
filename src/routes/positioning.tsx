import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Award, TrendingUp, Users, Megaphone, Target, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/positioning")({
  head: () => ({
    meta: [
      { title: "Positioning — MP Pulse" },
      {
        name: "description",
        content:
          "Aspiration Readiness scoring, share of voice vs peers, and alignment with national narratives.",
      },
    ],
  }),
  component: PositioningPage,
});

const subScores = [
  { label: "Visibility", value: 78, icon: Megaphone, note: "Top 25% in Karnataka cohort" },
  { label: "Sentiment", value: 68, icon: TrendingUp, note: "+4 pts vs last month" },
  { label: "Share of Voice", value: 64, icon: Users, note: "Rank 3 of 28 in region" },
  { label: "Party Alignment", value: 82, icon: Target, note: "Strong on 4 of 6 themes" },
  { label: "Constituency Strength", value: 71, icon: MapPin, note: "Stable across all wards" },
];

const peers = [
  { name: "You — Bengaluru", sov: 26.4, mentions: 48200, self: true },
  { name: "P. Rajashekar — Bengaluru South", sov: 22.1, mentions: 41800 },
  { name: "Anita Kulkarni — Bengaluru North", sov: 18.7, mentions: 35400 },
  { name: "S. Manjunath — Bengaluru Rural", sov: 14.2, mentions: 26900 },
  { name: "K. Ramesh Gowda — Mysuru", sov: 11.8, mentions: 22300 },
  { name: "D. Lakshmi Bai — Tumkur", sov: 6.8, mentions: 12900 },
];

const narratives = [
  { theme: "Viksit Bharat 2047", strength: 78, mentions: 142, trend: "+12%" },
  { theme: "Digital India / AI Mission", strength: 84, mentions: 198, trend: "+24%" },
  { theme: "Atmanirbhar Bharat — Manufacturing", strength: 56, mentions: 71, trend: "+4%" },
  { theme: "Nari Shakti", strength: 62, mentions: 88, trend: "+9%" },
  { theme: "Infrastructure & Connectivity", strength: 88, mentions: 224, trend: "+18%" },
  { theme: "Climate & Renewable Energy", strength: 41, mentions: 46, trend: "-2%" },
];

function strengthColor(v: number) {
  if (v >= 75) return "text-emerald-600";
  if (v >= 55) return "text-saffron";
  return "text-rose-600";
}

function strengthBg(v: number) {
  if (v >= 75) return "bg-emerald-500";
  if (v >= 55) return "bg-saffron";
  return "bg-rose-500";
}

function BigGauge({ score }: { score: number }) {
  const r = 88;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative flex h-56 w-56 items-center justify-center">
      <svg width="224" height="224" viewBox="0 0 224 224" className="-rotate-90">
        <circle cx="112" cy="112" r={r} stroke="hsl(var(--muted))" strokeWidth="14" fill="none" />
        <circle
          cx="112"
          cy="112"
          r={r}
          stroke="url(#gaugeGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF9933" />
            <stop offset="100%" stopColor="#0A1F44" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <div className="text-5xl font-semibold tracking-tight text-foreground tabular-nums">{score}</div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">out of 100</div>
        <Badge className="mt-2 bg-saffron/15 text-saffron hover:bg-saffron/15">Strong contender</Badge>
      </div>
    </div>
  );
}

function PositioningPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Positioning</h1>
        <p className="text-sm text-muted-foreground">
          Strategic readiness assessment, peer benchmarking, and national narrative alignment.
        </p>
      </div>

      <Card className="overflow-hidden border-0 bg-gradient-to-br from-navy via-navy to-[#152d5e] text-white shadow-lg">
        <div className="grid gap-8 p-8 lg:grid-cols-[auto_1fr] lg:items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-saffron">
              <Award className="h-4 w-4" /> Aspiration Readiness
            </div>
            <BigGauge score={72} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {subScores.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/60">
                  <s.icon className="h-3.5 w-3.5 text-saffron" />
                  {s.label}
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div className="text-3xl font-semibold tabular-nums">{s.value}</div>
                  <div className="text-xs text-white/50">/100</div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-saffron to-amber-300"
                    style={{ width: `${s.value}%` }}
                  />
                </div>
                <div className="mt-2 text-[11px] text-white/70">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Card className="p-5">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Share of Voice vs Peers</h2>
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
              Last 30 days
            </Badge>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            % of total political conversation in Karnataka attributable to each leader.
          </p>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peers} layout="vertical" margin={{ left: 20, right: 30 }}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} unit="%" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={180}
                  tick={{ fontSize: 11, fill: "#0f172a" }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(10,31,68,0.04)" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0].payload as typeof peers[number];
                    return (
                      <div className="rounded-md border border-border bg-background px-3 py-2 text-xs shadow-md">
                        <div className="font-semibold text-foreground">{p.name}</div>
                        <div className="text-muted-foreground">SoV: {p.sov}%</div>
                        <div className="text-muted-foreground">
                          Mentions: {p.mentions.toLocaleString()}
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="sov" radius={[0, 6, 6, 0]}>
                  {peers.map((p, i) => (
                    <Cell key={i} fill={p.self ? "#FF9933" : "#0A1F44"} fillOpacity={p.self ? 1 : 0.75} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Alignment with National Narratives
            </h2>
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
              Party priorities
            </Badge>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            How strongly the MP is associated with each party-priority theme.
          </p>
          <div className="space-y-4">
            {narratives.map((n) => (
              <div key={n.theme}>
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="text-sm font-medium text-foreground">{n.theme}</div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground tabular-nums">{n.mentions}</span>
                    <span className={`tabular-nums font-medium ${strengthColor(n.strength)}`}>
                      {n.strength}
                    </span>
                    <span className="w-12 text-right text-emerald-600">{n.trend}</span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${strengthBg(n.strength)}`}
                    style={{ width: `${n.strength}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-saffron/30 bg-saffron/5 p-3 text-xs leading-relaxed text-foreground">
            <span className="font-semibold text-saffron">Strategic gap:</span> Climate &amp;
            renewable energy under-indexed despite high constituency relevance — consider a
            flagship initiative.
          </div>
        </Card>
      </div>
    </div>
  );
}
