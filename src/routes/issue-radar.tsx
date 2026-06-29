import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
} from "recharts";
import { TrendingUp, TrendingDown, Sparkles, Target, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/issue-radar")({
  head: () => ({
    meta: [
      { title: "Issue Radar — MP Pulse" },
      {
        name: "description",
        content:
          "Trending civic issues and hashtags across district, state, and national levels with whitespace opportunity mapping.",
      },
    ],
  }),
  component: IssueRadarPage,
});

type Issue = {
  name: string;
  tag: string;
  volume: number;
  change: number;
  positive: number;
  neutral: number;
  negative: number;
  relevance: number;
};

const district: Issue[] = [
  { name: "Bengaluru Traffic Gridlock", tag: "#BengaluruTraffic", volume: 48200, change: 22.4, positive: 18, neutral: 32, negative: 50, relevance: 96 },
  { name: "Cauvery Water Crisis", tag: "#CauveryWater", volume: 36100, change: 14.1, positive: 24, neutral: 28, negative: 48, relevance: 94 },
  { name: "Mahadevapura Potholes", tag: "#FixOurRoads", volume: 21800, change: 31.7, positive: 12, neutral: 24, negative: 64, relevance: 91 },
  { name: "Namma Metro Phase 3", tag: "#NammaMetro", volume: 18900, change: 8.2, positive: 62, neutral: 26, negative: 12, relevance: 88 },
  { name: "Whitefield Tech Park Connectivity", tag: "#WFconnect", volume: 12400, change: 19.6, positive: 34, neutral: 38, negative: 28, relevance: 86 },
  { name: "Lake Rejuvenation", tag: "#SaveOurLakes", volume: 9800, change: 12.3, positive: 58, neutral: 30, negative: 12, relevance: 82 },
  { name: "BBMP Property Tax", tag: "#BBMPTax", volume: 7600, change: -4.8, positive: 22, neutral: 44, negative: 34, relevance: 74 },
  { name: "Stray Dog Menace", tag: "#StrayDogs", volume: 6400, change: 9.1, positive: 18, neutral: 36, negative: 46, relevance: 68 },
];

const state: Issue[] = [
  { name: "Karnataka Job Reservations", tag: "#KannadigaJobs", volume: 88200, change: 41.2, positive: 46, neutral: 24, negative: 30, relevance: 89 },
  { name: "Power Tariff Hike", tag: "#PowerHike", volume: 52400, change: 18.6, positive: 14, neutral: 28, negative: 58, relevance: 84 },
  { name: "Anna Bhagya Scheme", tag: "#AnnaBhagya", volume: 41700, change: 6.4, positive: 64, neutral: 22, negative: 14, relevance: 78 },
  { name: "Mekedatu Project", tag: "#Mekedatu", volume: 33800, change: 12.9, positive: 52, neutral: 24, negative: 24, relevance: 81 },
  { name: "Mysuru Dasara Tourism", tag: "#Dasara2026", volume: 28600, change: 22.1, positive: 72, neutral: 22, negative: 6, relevance: 64 },
  { name: "Coastal Karnataka Floods", tag: "#KarnatakaRains", volume: 22400, change: -8.4, positive: 28, neutral: 30, negative: 42, relevance: 71 },
  { name: "Kalyana Karnataka Dev", tag: "#KK371J", volume: 16200, change: 4.7, positive: 48, neutral: 34, negative: 18, relevance: 66 },
];

const national: Issue[] = [
  { name: "Union Budget Reactions", tag: "#Budget2026", volume: 412000, change: 28.4, positive: 38, neutral: 32, negative: 30, relevance: 72 },
  { name: "Parliament Winter Session", tag: "#WinterSession", volume: 198000, change: 14.1, positive: 32, neutral: 38, negative: 30, relevance: 78 },
  { name: "Digital India 2.0", tag: "#DigitalIndia", volume: 156000, change: 19.8, positive: 58, neutral: 28, negative: 14, relevance: 74 },
  { name: "GST Council Reforms", tag: "#GSTReform", volume: 124000, change: 22.6, positive: 36, neutral: 30, negative: 34, relevance: 69 },
  { name: "AI Regulation Bill", tag: "#AIBill", volume: 98400, change: 34.2, positive: 44, neutral: 36, negative: 20, relevance: 81 },
  { name: "Farmers MSP Protest", tag: "#MSPGuarantee", volume: 82100, change: -6.2, positive: 28, neutral: 26, negative: 46, relevance: 58 },
  { name: "EV Subsidy Rollout", tag: "#EVIndia", volume: 64200, change: 16.8, positive: 62, neutral: 26, negative: 12, relevance: 67 },
];

const whitespace = [
  { name: "Lake Rejuvenation", interest: 82, ownership: 18, why: "High citizen demand across Bellandur, Varthur; no MP has anchored a flagship plan." },
  { name: "Tech-Park Last-Mile Connectivity", interest: 78, ownership: 24, why: "Whitefield/ORR commuters vocal; competitors silent on BMTC feeder routes." },
  { name: "Apartment Solid Waste Reform", interest: 66, ownership: 12, why: "RWA conversations spiking; opportunity to lead BBMP-citizen dialogue." },
  { name: "Gig Worker Welfare Board", interest: 71, ownership: 22, why: "Rapid rider/delivery worker discourse; first-mover advantage available." },
];

const quadrantData = [
  { name: "Lake Rejuvenation", interest: 82, ownership: 18, vol: 9800, color: "#FF9933" },
  { name: "Last-Mile Connectivity", interest: 78, ownership: 24, vol: 12400, color: "#FF9933" },
  { name: "Gig Worker Welfare", interest: 71, ownership: 22, vol: 8600, color: "#FF9933" },
  { name: "Waste Reform", interest: 66, ownership: 12, vol: 6200, color: "#FF9933" },
  { name: "Namma Metro", interest: 74, ownership: 68, vol: 18900, color: "#0A1F44" },
  { name: "Cauvery Water", interest: 88, ownership: 72, vol: 36100, color: "#0A1F44" },
  { name: "Traffic Gridlock", interest: 92, ownership: 64, vol: 48200, color: "#0A1F44" },
  { name: "Property Tax", interest: 42, ownership: 38, vol: 7600, color: "#94a3b8" },
  { name: "Stray Dogs", interest: 38, ownership: 14, vol: 6400, color: "#94a3b8" },
  { name: "Dasara Tourism", interest: 30, ownership: 56, vol: 28600, color: "#94a3b8" },
];

function fmtVol(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

function SentimentBar({ pos, neu, neg }: { pos: number; neu: number; neg: number }) {
  return (
    <div className="flex h-1.5 w-28 overflow-hidden rounded-full bg-muted">
      <div style={{ width: `${pos}%` }} className="bg-emerald-500" />
      <div style={{ width: `${neu}%` }} className="bg-slate-300" />
      <div style={{ width: `${neg}%` }} className="bg-rose-500" />
    </div>
  );
}

function IssueList({ data }: { data: Issue[] }) {
  return (
    <div className="divide-y divide-border">
      {data.map((it, i) => {
        const up = it.change >= 0;
        return (
          <div key={it.tag} className="grid grid-cols-12 items-center gap-3 py-3">
            <div className="col-span-1 text-sm font-mono text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="col-span-4">
              <div className="text-sm font-medium text-foreground">{it.name}</div>
              <div className="text-xs text-saffron">{it.tag}</div>
            </div>
            <div className="col-span-2">
              <div className="text-sm font-semibold text-foreground tabular-nums">
                {fmtVol(it.volume)}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">mentions</div>
            </div>
            <div className="col-span-2">
              <div
                className={`inline-flex items-center gap-1 text-sm font-medium ${
                  up ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {up ? "+" : ""}
                {it.change.toFixed(1)}%
              </div>
            </div>
            <div className="col-span-2">
              <SentimentBar pos={it.positive} neu={it.neutral} neg={it.negative} />
            </div>
            <div className="col-span-1 text-right">
              <div className="inline-flex items-center justify-end gap-1 rounded-md bg-navy/5 px-2 py-1 text-xs font-semibold text-navy">
                {it.relevance}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SocialRadarTab() {
  const [tab, setTab] = useState("district");
  return (
    <div className="space-y-6">


      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="district">District — Bengaluru</TabsTrigger>
          <TabsTrigger value="state">State — Karnataka</TabsTrigger>
          <TabsTrigger value="national">National — India</TabsTrigger>
        </TabsList>

        {[
          { key: "district", data: district, label: "Bengaluru" },
          { key: "state", data: state, label: "Karnataka" },
          { key: "national", data: national, label: "India" },
        ].map(({ key, data, label }) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <Card className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-saffron" />
                  <h2 className="text-sm font-semibold text-foreground">
                    Trending in {label}
                  </h2>
                </div>
                <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                  {data.length} issues
                </Badge>
              </div>
              <div className="grid grid-cols-12 gap-3 border-b border-border pb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                <div className="col-span-1">#</div>
                <div className="col-span-4">Issue / Hashtag</div>
                <div className="col-span-2">Volume</div>
                <div className="col-span-2">24h change</div>
                <div className="col-span-2">Sentiment</div>
                <div className="col-span-1 text-right">Relevance</div>
              </div>
              <IssueList data={data} />
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="border-saffron/30 bg-gradient-to-br from-saffron/8 via-background to-background p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-saffron" />
            <h2 className="text-sm font-semibold text-foreground">Whitespace Opportunities</h2>
          </div>
          <span className="text-xs text-muted-foreground">
            High public interest · Low political ownership
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {whitespace.map((w) => (
            <div
              key={w.name}
              className="rounded-lg border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-foreground">{w.name}</div>
                <Target className="h-4 w-4 text-saffron" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md bg-emerald-50 px-2 py-1.5 text-emerald-700">
                  <div className="font-semibold tabular-nums">{w.interest}</div>
                  <div className="text-[10px] uppercase tracking-wider">Interest</div>
                </div>
                <div className="rounded-md bg-rose-50 px-2 py-1.5 text-rose-700">
                  <div className="font-semibold tabular-nums">{w.ownership}</div>
                  <div className="text-[10px] uppercase tracking-wider">Ownership</div>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{w.why}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Issue Landscape Map</h2>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-saffron" /> Whitespace
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-navy" /> Owned
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-400" /> Low priority
            </span>
          </div>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          Public Interest (x) vs Political Ownership (y) — bubble size = mention volume
        </p>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="interest"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "#64748b" }}
                label={{ value: "Public Interest", position: "insideBottom", offset: -10, fontSize: 11, fill: "#64748b" }}
              />
              <YAxis
                type="number"
                dataKey="ownership"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "#64748b" }}
                label={{ value: "Political Ownership", angle: -90, position: "insideLeft", fontSize: 11, fill: "#64748b" }}
              />
              <ZAxis type="number" dataKey="vol" range={[120, 900]} />
              <ReferenceLine x={50} stroke="#cbd5e1" strokeDasharray="4 4" />
              <ReferenceLine y={50} stroke="#cbd5e1" strokeDasharray="4 4" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const p = payload[0].payload as typeof quadrantData[number];
                  return (
                    <div className="rounded-md border border-border bg-background px-3 py-2 text-xs shadow-md">
                      <div className="font-semibold text-foreground">{p.name}</div>
                      <div className="text-muted-foreground">Interest: {p.interest} · Ownership: {p.ownership}</div>
                      <div className="text-muted-foreground">Volume: {fmtVol(p.vol)}</div>
                    </div>
                  );
                }}
              />
              <Scatter data={quadrantData}>
                {quadrantData.map((d) => (
                  <Cell key={d.name} fill={d.color} fillOpacity={0.75} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

// ─────────── Heatmap (governance layer) ───────────

type WardCell = {
  name: string;
  segment: "Assembly A" | "Assembly B" | "Assembly C";
  volume: number;
  severity: number; // 0-100
  topDept: string;
  topIssue: string;
  ageDays: number;
  repeats: number;
  sentiment: number; // -100..100
};

const WARDS: WardCell[] = [
  { name: "Mahadevapura W-84", segment: "Assembly A", volume: 142, severity: 88, topDept: "BWSSB", topIssue: "Water supply", ageDays: 41, repeats: 18, sentiment: -38 },
  { name: "KR Puram W-58", segment: "Assembly A", volume: 121, severity: 84, topDept: "BWSSB", topIssue: "Water supply", ageDays: 47, repeats: 22, sentiment: -42 },
  { name: "Hoodi W-83", segment: "Assembly A", volume: 96, severity: 71, topDept: "BBMP", topIssue: "Stormwater drains", ageDays: 33, repeats: 11, sentiment: -18 },
  { name: "Whitefield W-149", segment: "Assembly A", volume: 88, severity: 62, topDept: "BBMP", topIssue: "Potholes", ageDays: 22, repeats: 8, sentiment: -10 },
  { name: "Bellandur W-150", segment: "Assembly A", volume: 74, severity: 58, topDept: "BBMP", topIssue: "Garbage", ageDays: 26, repeats: 6, sentiment: -6 },
  { name: "CV Raman Nagar W-90", segment: "Assembly B", volume: 64, severity: 44, topDept: "BESCOM", topIssue: "Power cuts", ageDays: 18, repeats: 4, sentiment: 4 },
  { name: "Indiranagar W-80", segment: "Assembly B", volume: 51, severity: 36, topDept: "Police (Tr.)", topIssue: "Traffic", ageDays: 12, repeats: 3, sentiment: 12 },
  { name: "Shivajinagar W-92", segment: "Assembly B", volume: 84, severity: 67, topDept: "Revenue", topIssue: "Khata transfers", ageDays: 38, repeats: 9, sentiment: -22 },
  { name: "Hebbal W-19", segment: "Assembly C", volume: 102, severity: 73, topDept: "BBMP", topIssue: "Flyover repair", ageDays: 29, repeats: 14, sentiment: -16 },
  { name: "Yelahanka W-6", segment: "Assembly C", volume: 58, severity: 41, topDept: "BWSSB", topIssue: "Borewell", ageDays: 19, repeats: 5, sentiment: 8 },
  { name: "Rajajinagar W-101", segment: "Assembly C", volume: 47, severity: 32, topDept: "BBMP", topIssue: "Parks", ageDays: 14, repeats: 2, sentiment: 18 },
  { name: "Bommanahalli W-186", segment: "Assembly A", volume: 119, severity: 79, topDept: "BBMP", topIssue: "Flooding", ageDays: 36, repeats: 16, sentiment: -28 },
];

function HeatmapTab() {
  const [grain, setGrain] = useState<"Ward" | "Booth" | "Taluk" | "Assembly">("Ward");
  const [metric, setMetric] = useState<"severity" | "volume">("severity");
  const [dept, setDept] = useState<string>("All");

  const visible = WARDS.filter(w => dept === "All" || w.topDept === dept);

  const heat = (v: number) => {
    if (v >= 80) return "bg-red-600 text-white border-red-700";
    if (v >= 65) return "bg-red-400 text-white border-red-500";
    if (v >= 50) return "bg-orange-400 text-white border-orange-500";
    if (v >= 35) return "bg-amber-300 text-amber-900 border-amber-400";
    if (v >= 20) return "bg-yellow-200 text-yellow-900 border-yellow-300";
    return "bg-emerald-200 text-emerald-900 border-emerald-300";
  };

  const mostNeglected = [...WARDS].sort((a,b) => b.ageDays - a.ageDays)[0];
  const worstDept = "BWSSB · 263 open complaints across 4 wards";
  const wardWaterTop = "KR Puram (W-58) — 89 open water cases";
  const slowestOfficer = "AE M. Rajashekhar (PWD East) — avg 51d on file";

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-navy flex items-center gap-2">
              <Target className="h-4 w-4 text-saffron" /> Constituency Governance Heatmap
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ground-truth office data — beneath the social listening layer.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-md border">
              {(["Ward", "Booth", "Taluk", "Assembly"] as const).map(g => (
                <button key={g} onClick={() => setGrain(g)}
                  className={`text-xs px-2.5 py-1 ${grain === g ? "bg-navy text-white" : "text-navy"}`}>
                  {g}
                </button>
              ))}
            </div>
            <div className="flex rounded-md border">
              {(["severity", "volume"] as const).map(m => (
                <button key={m} onClick={() => setMetric(m)}
                  className={`text-xs px-2.5 py-1 capitalize ${metric === m ? "bg-saffron text-navy font-semibold" : "text-navy"}`}>
                  {m}
                </button>
              ))}
            </div>
            <select value={dept} onChange={e => setDept(e.target.value)} className="text-xs border rounded-md h-7 px-2">
              <option>All</option>
              <option>BWSSB</option><option>BBMP</option><option>BESCOM</option><option>Revenue</option>
              <option>Police (Tr.)</option>
            </select>
          </div>
        </div>

        {/* Heat grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {visible.map(w => {
            const v = metric === "severity" ? w.severity : Math.min(100, Math.round(w.volume / 1.5));
            return (
              <div key={w.name} className={`rounded-lg border p-3 ${heat(v)}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="text-[11px] font-semibold opacity-80">{w.segment}</div>
                  <div className="text-lg font-bold tabular-nums">{v}</div>
                </div>
                <div className="text-sm font-bold leading-tight mt-1">{w.name}</div>
                <div className="text-[11px] opacity-90 mt-1">{w.topIssue} · {w.topDept}</div>
                <div className="text-[10px] opacity-80 mt-1.5 flex items-center gap-2">
                  <span>{w.volume} cases</span>
                  <span>·</span>
                  <span>{w.ageDays}d avg</span>
                  {w.repeats > 10 && <span className="bg-white/30 px-1 rounded">{w.repeats} repeats</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-2 text-[10px]">
          <span className="text-muted-foreground">Low</span>
          <div className="flex">
            <span className="w-5 h-3 bg-emerald-200" />
            <span className="w-5 h-3 bg-yellow-200" />
            <span className="w-5 h-3 bg-amber-300" />
            <span className="w-5 h-3 bg-orange-400" />
            <span className="w-5 h-3 bg-red-400" />
            <span className="w-5 h-3 bg-red-600" />
          </div>
          <span className="text-muted-foreground">Critical</span>
        </div>
      </Card>

      {/* Surfaced answers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Most-neglected area", val: `${mostNeglected.name} — ${mostNeglected.ageDays} days avg open`, accent: "border-l-red-500" },
          { label: "Department causing most complaints", val: worstDept, accent: "border-l-saffron" },
          { label: "Ward with most water complaints", val: wardWaterTop, accent: "border-l-blue-500" },
          { label: "Officer delaying most cases", val: slowestOfficer, accent: "border-l-amber-500" },
        ].map(s => (
          <Card key={s.label} className={`p-4 border-l-4 ${s.accent}`}>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="text-sm font-semibold text-navy mt-1">{s.val}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function IssueRadarPage() {
  const [outer, setOuter] = useState<"radar" | "heatmap">("radar");
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Issue Radar</h1>
          <p className="text-sm text-muted-foreground">
            Social listening on top — governance heatmap underneath. Two lenses, one picture.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Updated 2 min ago
        </div>
      </div>

      <Tabs value={outer} onValueChange={(v) => setOuter(v as "radar" | "heatmap")}>
        <TabsList>
          <TabsTrigger value="radar">📡 Social Radar</TabsTrigger>
          <TabsTrigger value="heatmap">🗺 Governance Heatmap</TabsTrigger>
        </TabsList>
        <TabsContent value="radar" className="mt-4">
          <SocialRadarTab />
        </TabsContent>
        <TabsContent value="heatmap" className="mt-4">
          <HeatmapTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

