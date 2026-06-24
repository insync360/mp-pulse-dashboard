import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, ExternalLink, Flame, TrendingUp, X } from "lucide-react";
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

      {/* Tabs + Filters */}
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
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
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
