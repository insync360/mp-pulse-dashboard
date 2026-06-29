import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, ExternalLink, Flame, TrendingUp, X, Hash, Shield } from "lucide-react";

const HASHTAGS = [
  { tag: "#BengaluruTraffic", volume: 48200, change: 22.4, level: "City" },
  { tag: "#CauveryWater", volume: 36100, change: 14.1, level: "City" },
  { tag: "#FixOurRoads", volume: 21800, change: 31.7, level: "City" },
  { tag: "#NammaMetro", volume: 18900, change: 8.2, level: "City" },
  { tag: "#SaveOurLakes", volume: 9800, change: 12.3, level: "City" },
  { tag: "#KannadigaJobs", volume: 88200, change: 41.2, level: "State" },
  { tag: "#Mekedatu", volume: 33800, change: 12.9, level: "State" },
  { tag: "#Budget2026", volume: 412000, change: 28.4, level: "National" },
  { tag: "#AIBill", volume: 98400, change: 34.2, level: "National" },
];

const fmtVol = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : `${n}`;
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/media-watch")({
  head: () => ({
    meta: [
      { title: "Media Watch — MP Pulse" },
      {
        name: "description",
        content:
          "Track news coverage across Bengaluru, Karnataka and national press with credibility tiers, sentiment and traction.",
      },
    ],
  }),
  component: MediaWatchPage,
});

type Level = "city" | "state" | "national";
type Sentiment = "Positive" | "Neutral" | "Negative";
type Traction = "Low" | "Medium" | "High" | "Viral";

type Article = {
  id: string;
  source: string;
  tier: 1 | 2;
  time: string;
  headline: string;
  topic: string;
  sentiment: Sentiment;
  traction: Traction;
  level: Level;
  actionNeeded?: boolean;
  draft?: string;
};

const articles: Article[] = [
  {
    id: "a1",
    source: "Times of India",
    tier: 1,
    time: "42 min ago",
    headline: "Civic body slammed over Whitefield flooding as monsoon exposes drain neglect",
    topic: "Infrastructure",
    sentiment: "Negative",
    traction: "Viral",
    level: "city",
    actionNeeded: true,
    draft:
      "We share the frustration of Whitefield residents. I have written to the BBMP Commissioner seeking a 72-hour action plan on storm-water drains in Varthur and Mahadevapura. A ground inspection with engineers will be held tomorrow at 9 AM. Citizens deserve resilient infrastructure, not annual flooding — and we will deliver it.",
  },
  {
    id: "a2",
    source: "Deccan Herald",
    tier: 1,
    time: "1 hr ago",
    headline: "Bengaluru South MP pushes Centre on Namma Metro Phase 3 funding clearance",
    topic: "Transport",
    sentiment: "Positive",
    traction: "High",
    level: "city",
  },
  {
    id: "a3",
    source: "The Hindu",
    tier: 1,
    time: "2 hrs ago",
    headline: "Cauvery water rationing extended in 110 villages; residents protest in KR Puram",
    topic: "Water Supply",
    sentiment: "Negative",
    traction: "High",
    level: "city",
    actionNeeded: true,
    draft:
      "The water crisis in KR Puram and surrounding wards is unacceptable. I am convening a meeting with BWSSB and Cauvery Neeravari Nigam this evening. Immediate measures: 40 additional tankers from tomorrow, an emergency borewell rejuvenation drive, and weekly public dashboards on supply schedules until normal pressure is restored.",
  },
  {
    id: "a4",
    source: "Indian Express",
    tier: 1,
    time: "3 hrs ago",
    headline: "Tech parks demand last-mile shuttle relief as ORR commute times hit new high",
    topic: "Transport",
    sentiment: "Neutral",
    traction: "Medium",
    level: "city",
  },
  {
    id: "a5",
    source: "Prajavani",
    tier: 2,
    time: "5 hrs ago",
    headline: "Mahadevapura lake rejuvenation drive draws 1,200 volunteers over weekend",
    topic: "Environment",
    sentiment: "Positive",
    traction: "Medium",
    level: "city",
  },
  {
    id: "a6",
    source: "Vijaya Karnataka",
    tier: 2,
    time: "6 hrs ago",
    headline: "Auto unions threaten strike over app aggregator fare cap dispute",
    topic: "Jobs",
    sentiment: "Negative",
    traction: "Medium",
    level: "city",
  },
  {
    id: "a7",
    source: "Deccan Herald",
    tier: 1,
    time: "8 hrs ago",
    headline: "BBMP awards ₹420 cr white-topping tender; opposition flags single-bidder concern",
    topic: "Governance",
    sentiment: "Neutral",
    traction: "Low",
    level: "city",
  },
  // STATE
  {
    id: "s1",
    source: "The Hindu",
    tier: 1,
    time: "1 hr ago",
    headline: "Karnataka cabinet clears ₹2,800 cr Upper Bhadra phase-II irrigation outlay",
    topic: "Agriculture",
    sentiment: "Positive",
    traction: "High",
    level: "state",
  },
  {
    id: "s2",
    source: "Deccan Herald",
    tier: 1,
    time: "3 hrs ago",
    headline: "Karnataka job reservation bill back on table; industry seeks consultations",
    topic: "Jobs",
    sentiment: "Neutral",
    traction: "Viral",
    level: "state",
  },
  {
    id: "s3",
    source: "Times of India",
    tier: 1,
    time: "4 hrs ago",
    headline: "Mysuru–Bengaluru expressway tolls hiked; commuters call for review",
    topic: "Transport",
    sentiment: "Negative",
    traction: "High",
    level: "state",
  },
  {
    id: "s4",
    source: "Prajavani",
    tier: 2,
    time: "7 hrs ago",
    headline: "Coastal Karnataka braces for cyclone alert; NDRF teams pre-positioned",
    topic: "Disaster",
    sentiment: "Neutral",
    traction: "Medium",
    level: "state",
  },
  {
    id: "s5",
    source: "Vijaya Karnataka",
    tier: 2,
    time: "9 hrs ago",
    headline: "Anganwadi workers in Kalaburagi end 11-day strike after pay assurance",
    topic: "Welfare",
    sentiment: "Positive",
    traction: "Low",
    level: "state",
  },
  // NATIONAL
  {
    id: "n1",
    source: "Indian Express",
    tier: 1,
    time: "2 hrs ago",
    headline: "Centre clears ₹15,000 cr semiconductor incentive; Karnataka among frontrunners",
    topic: "Industry",
    sentiment: "Positive",
    traction: "High",
    level: "national",
  },
  {
    id: "n2",
    source: "The Hindu",
    tier: 1,
    time: "4 hrs ago",
    headline: "Lok Sabha takes up Digital India Act draft; data localisation in spotlight",
    topic: "Policy",
    sentiment: "Neutral",
    traction: "High",
    level: "national",
  },
  {
    id: "n3",
    source: "Times of India",
    tier: 1,
    time: "5 hrs ago",
    headline: "GST council eyes rate rationalisation; states push for compensation extension",
    topic: "Economy",
    sentiment: "Neutral",
    traction: "Medium",
    level: "national",
  },
  {
    id: "n4",
    source: "Deccan Herald",
    tier: 1,
    time: "10 hrs ago",
    headline: "Monsoon session: 14 bills lined up, opposition seeks debate on price rise",
    topic: "Parliament",
    sentiment: "Neutral",
    traction: "Medium",
    level: "national",
  },
];

const tractionWeight: Record<Traction, number> = { Viral: 4, High: 3, Medium: 2, Low: 1 };

const sentimentClass: Record<Sentiment, string> = {
  Positive: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Neutral: "bg-slate-100 text-slate-700 border-slate-200",
  Negative: "bg-rose-50 text-rose-700 border-rose-200",
};

const tractionClass: Record<Traction, string> = {
  Viral: "bg-saffron/15 text-saffron border-saffron/30",
  High: "bg-amber-50 text-amber-700 border-amber-200",
  Medium: "bg-blue-50 text-blue-700 border-blue-200",
  Low: "bg-slate-50 text-slate-600 border-slate-200",
};

function TractionMeter({ value }: { value: Traction }) {
  const filled = tractionWeight[value];
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 w-4 rounded-full ${
              i <= filled
                ? value === "Viral"
                  ? "bg-saffron"
                  : value === "High"
                    ? "bg-amber-500"
                    : value === "Medium"
                      ? "bg-blue-500"
                      : "bg-slate-400"
                : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <span className="text-[11px] font-medium text-slate-600">{value}</span>
    </div>
  );
}

function MediaWatchPage() {
  const [level, setLevel] = useState<Level>("city");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [draftFor, setDraftFor] = useState<Article | null>(null);

  const topics = useMemo(
    () => Array.from(new Set(articles.map((a) => a.topic))).sort(),
    [],
  );

  const visible = useMemo(() => {
    return articles
      .filter((a) => a.level === level)
      .filter((a) => sentimentFilter === "all" || a.sentiment === sentimentFilter)
      .filter((a) => topicFilter === "all" || a.topic === topicFilter)
      .sort((a, b) => tractionWeight[b.traction] - tractionWeight[a.traction]);
  }, [level, sentimentFilter, topicFilter]);

  const actionItems = articles.filter((a) => a.actionNeeded);

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-navy">Media Watch</h1>
        <p className="text-sm text-slate-500 mt-1">
          Curated news coverage with credibility, sentiment and traction signals.
        </p>
      </div>

      {/* Action Needed */}
      {actionItems.length > 0 && (
        <Card className="border-l-4 border-l-saffron bg-gradient-to-r from-saffron/5 to-transparent p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-saffron" />
            <span className="text-xs font-semibold uppercase tracking-wider text-saffron">
              Action Needed
            </span>
            <Badge variant="outline" className="ml-auto text-[10px]">
              {actionItems.length} flagged
            </Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {actionItems.map((a) => (
              <div
                key={a.id}
                className="rounded-lg border border-saffron/30 bg-white p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
                      <span className="font-semibold text-navy">{a.source}</span>
                      <span>•</span>
                      <span>{a.time}</span>
                    </div>
                    <div className="text-sm font-medium text-slate-900 leading-snug">
                      {a.headline}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={sentimentClass[a.sentiment]}>
                    {a.sentiment}
                  </Badge>
                  <Badge variant="outline" className={tractionClass[a.traction]}>
                    <Flame className="h-3 w-3 mr-1" />
                    {a.traction}
                  </Badge>
                  <Button
                    size="sm"
                    className="ml-auto bg-navy hover:bg-navy/90 text-white h-7 text-xs"
                    onClick={() => setDraftFor(a)}
                  >
                    Draft Official Statement
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Press Desk stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Open queries", val: "5", tone: "text-saffron" },
          { label: "Quotes approved today", val: "3", tone: "text-emerald-600" },
          { label: "Coverage tracked", val: "28", tone: "text-navy" },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">{s.label}</div>
            <div className={`text-2xl font-bold mt-1 ${s.tone}`}>{s.val}</div>
          </Card>
        ))}
      </div>

      {/* Outer view tabs: News Feed / Hashtags / Press Desk */}
      <Tabs defaultValue="feed">
        <TabsList>
          <TabsTrigger value="feed">News Feed</TabsTrigger>
          <TabsTrigger value="hashtags">Trending Hashtags</TabsTrigger>
          <TabsTrigger value="press">📰 Press Desk</TabsTrigger>
        </TabsList>


        <TabsContent value="feed" className="mt-4 space-y-4">
          <Tabs value={level} onValueChange={(v) => setLevel(v as Level)}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <TabsList>
                <TabsTrigger value="city">City · Bengaluru</TabsTrigger>
                <TabsTrigger value="state">State · Karnataka</TabsTrigger>
                <TabsTrigger value="national">National</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <TrendingUp className="h-3.5 w-3.5" /> Sorted by traction
                </div>
                <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                  <SelectTrigger className="h-8 w-[140px] text-xs">
                    <SelectValue placeholder="Sentiment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All sentiment</SelectItem>
                    <SelectItem value="Positive">Positive</SelectItem>
                    <SelectItem value="Neutral">Neutral</SelectItem>
                    <SelectItem value="Negative">Negative</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={topicFilter} onValueChange={setTopicFilter}>
                  <SelectTrigger className="h-8 w-[140px] text-xs">
                    <SelectValue placeholder="Topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All topics</SelectItem>
                    {topics.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value={level} className="mt-4">
              <div className="grid gap-3">
                {visible.map((a) => (
                  <Card key={a.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1.5 flex-wrap">
                          <span className="font-semibold text-navy">{a.source}</span>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              a.tier === 1
                                ? "bg-navy/5 text-navy border-navy/20"
                                : "bg-slate-50 text-slate-600 border-slate-200"
                            }`}
                          >
                            Tier {a.tier}
                          </Badge>
                          <span>•</span>
                          <span>{a.time}</span>
                          <span>•</span>
                          <span className="text-slate-600">{a.topic}</span>
                        </div>
                        <div className="text-sm font-medium text-slate-900 leading-snug">
                          {a.headline}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge variant="outline" className={sentimentClass[a.sentiment]}>
                          {a.sentiment}
                        </Badge>
                        <TractionMeter value={a.traction} />
                        <button className="text-[11px] text-slate-500 hover:text-navy flex items-center gap-1">
                          Open <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
                {visible.length === 0 && (
                  <Card className="p-8 text-center text-sm text-slate-500">
                    No articles match the current filters.
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="hashtags" className="mt-4">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-saffron" />
                <h2 className="text-sm font-semibold text-navy">Trending Hashtags</h2>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500">last 24h</span>
            </div>
            <div className="divide-y divide-border/60">
              {HASHTAGS.map((h, i) => (
                <div key={h.tag} className="flex items-center gap-4 py-3">
                  <span className="w-6 text-xs font-mono text-slate-400">{i + 1}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-saffron">{h.tag}</div>
                    <div className="text-[11px] text-slate-500 tabular-nums">
                      {fmtVol(h.volume)} mentions · {h.level}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <TrendingUp className="h-3 w-3" />+{h.change.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="press" className="mt-4 space-y-4">
          <PressDeskPanel />
        </TabsContent>
      </Tabs>


      {/* Draft Modal */}
      <Dialog open={!!draftFor} onOpenChange={(o) => !o && setDraftFor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-navy">Suggested Official Statement</DialogTitle>
            <DialogDescription>
              Drafted in response to: <span className="font-medium">{draftFor?.headline}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
              {draftFor?.draft}
            </div>
            <div className="rounded-md bg-saffron/10 border border-saffron/30 px-3 py-2 text-xs text-navy">
              ✓ Routed to comms team for approval. Human review required before publishing.
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setDraftFor(null)}>
                <X className="h-3.5 w-3.5 mr-1" /> Close
              </Button>
              <Button size="sm" className="bg-navy hover:bg-navy/90 text-white">
                Send to Comms
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─────────── Press Desk ───────────

type PressContact = { name: string; outlet: string; beat: string; phone: string; relationship: "Warm" | "Steady" | "Cold"; lastTouch: string };
const PRESS_CONTACTS: PressContact[] = [
  { name: "A. Prakash", outlet: "Prajavani", beat: "Politics — Bengaluru East", phone: "+91 98800 77881", relationship: "Warm", lastTouch: "4 d" },
  { name: "R. Iyer", outlet: "Deccan Herald", beat: "Civic / BBMP", phone: "+91 98452 33001", relationship: "Steady", lastTouch: "12 d" },
  { name: "S. Murthy", outlet: "Times of India", beat: "Infrastructure", phone: "+91 98452 99110", relationship: "Steady", lastTouch: "8 d" },
  { name: "Anjali Pinto", outlet: "The Hindu", beat: "Policy & Parliament", phone: "+91 98860 21134", relationship: "Warm", lastTouch: "2 d" },
  { name: "K. Hegde", outlet: "Vijaya Karnataka", beat: "State politics", phone: "+91 99004 19087", relationship: "Cold", lastTouch: "42 d" },
  { name: "Rohit Kumar", outlet: "TV9 Kannada", beat: "Breaking / city", phone: "+91 99000 33491", relationship: "Steady", lastTouch: "6 d" },
];

type PressQuery = {
  id: string; journalist: string; outlet: string; topic: string; deadline: string;
  sensitivity: "Low" | "Medium" | "High"; status: "Incoming" | "Drafting" | "Awaiting MP" | "Approved" | "Sent";
  draft?: string; approvedQuote?: string;
};
const PRESS_QUERIES: PressQuery[] = [
  { id: "PQ-041", journalist: "R. Iyer", outlet: "Deccan Herald", topic: "MP's position on Mahadayi water sharing in Belagavi belt", deadline: "Today 18:00", sensitivity: "High", status: "Awaiting MP", draft: "On Mahadayi, our position is clear: every drop allocated by the tribunal must reach Karnataka farmers without delay. I am writing to the Union Jal Shakti Minister this week seeking a status update on the project DPRs and intend to raise the matter in Parliament next session." },
  { id: "PQ-040", journalist: "S. Murthy", outlet: "Times of India", topic: "ORR last-mile shuttle progress", deadline: "Tomorrow 11:00", sensitivity: "Medium", status: "Drafting" },
  { id: "PQ-039", journalist: "Anjali Pinto", outlet: "The Hindu", topic: "Citizen Pulse — case management approach", deadline: "Fri 14:00", sensitivity: "Low", status: "Approved", approvedQuote: "Every grievance gets a ticket, an owner, and a deadline. That's the bare minimum citizens deserve." },
  { id: "PQ-038", journalist: "Rohit Kumar", outlet: "TV9 Kannada", topic: "Hebbal flyover potholes", deadline: "Today 20:00", sensitivity: "Medium", status: "Sent" },
  { id: "PQ-037", journalist: "K. Hegde", outlet: "Vijaya Karnataka", topic: "Kannada in tech-park signage", deadline: "Mon 10:00", sensitivity: "Medium", status: "Incoming" },
];

const sensTone: Record<PressQuery["sensitivity"], string> = {
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50 text-amber-800 border-amber-200",
  High: "bg-red-50 text-red-700 border-red-200",
};
const statusTone: Record<PressQuery["status"], string> = {
  Incoming: "bg-slate-100 text-slate-700 border-slate-200",
  Drafting: "bg-blue-50 text-blue-700 border-blue-200",
  "Awaiting MP": "bg-saffron/15 text-saffron border-saffron/40",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Sent: "bg-navy/5 text-navy border-navy/20",
};

function PressDeskPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-navy mb-3">Incoming press queries</h3>
          <div className="space-y-3">
            {PRESS_QUERIES.map(q => (
              <div key={q.id} className="rounded-lg border p-3">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-semibold text-navy">{q.journalist}</span>
                  <span className="text-slate-500">· {q.outlet}</span>
                  <Badge variant="outline" className={sensTone[q.sensitivity]}>{q.sensitivity} sensitivity</Badge>
                  <Badge variant="outline" className={statusTone[q.status]}>{q.status}</Badge>
                  <span className="ml-auto text-slate-500">Deadline: <span className="font-medium text-navy">{q.deadline}</span></span>
                </div>
                <div className="text-sm text-slate-900 mt-1.5 font-medium">{q.topic}</div>
                {q.draft && (
                  <div className="mt-2 rounded-md bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-700 leading-relaxed">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">Draft response</span>
                    <p className="mt-1">{q.draft}</p>
                  </div>
                )}
                {q.approvedQuote && (
                  <div className="mt-2 rounded-md bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-900 leading-relaxed">
                    <span className="text-[10px] uppercase tracking-wider text-emerald-700">✓ Approved quote</span>
                    <p className="mt-1 italic">"{q.approvedQuote}"</p>
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {q.status === "Incoming" && <Button size="sm" className="h-7 text-xs bg-navy text-white hover:bg-navy/90">Draft response</Button>}
                  {q.status === "Drafting" && <Button size="sm" className="h-7 text-xs bg-saffron text-navy hover:bg-saffron/90">Send to MP</Button>}
                  {q.status === "Awaiting MP" && <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">Approve quote</Button>}
                  {q.status === "Approved" && <Button size="sm" className="h-7 text-xs bg-navy text-white hover:bg-navy/90">Send to journalist</Button>}
                  <Button size="sm" variant="outline" className="h-7 text-xs">Log coverage</Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs">Follow-up note</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold text-navy mb-3">Press note workflow</h3>
          <div className="grid grid-cols-4 gap-2 text-xs">
            {["Draft", "MP review", "Approved quote", "Released + tracked"].map((s, i) => (
              <div key={s} className={`rounded-md border p-2.5 text-center ${i === 1 ? "bg-saffron/10 border-saffron/40 text-saffron font-semibold" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                <div className="text-[10px] uppercase tracking-wider">Stage {i + 1}</div>
                <div className="mt-0.5">{s}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1.5">
            <Shield className="h-3 w-3 text-saffron" /> Every quote requires explicit MP approval before release.
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-semibold text-navy mb-3">Media contacts</h3>
        <div className="space-y-2.5">
          {PRESS_CONTACTS.map(c => (
            <div key={c.name} className="rounded-md border p-2.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium text-navy text-sm">{c.name}</div>
                  <div className="text-[11px] text-slate-500">{c.outlet} · {c.beat}</div>
                </div>
                <Badge variant="outline" className={
                  c.relationship === "Warm" ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]" :
                  c.relationship === "Steady" ? "bg-blue-50 text-blue-700 border-blue-200 text-[10px]" :
                  "bg-rose-50 text-rose-700 border-rose-200 text-[10px]"
                }>{c.relationship}</Badge>
              </div>
              <div className="text-[10px] text-slate-400 mt-1.5">{c.phone} · last touch {c.lastTouch}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

