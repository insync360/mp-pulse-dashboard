import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Newspaper, Clock, ExternalLink, Hash, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News & Hashtags — MP Pulse" },
      {
        name: "description",
        content:
          "Live news feed and trending hashtags relevant to your constituency, state and national agenda.",
      },
    ],
  }),
  component: NewsPage,
});

type Level = "District" | "State" | "National";
type Sentiment = "Positive" | "Neutral" | "Negative";

type NewsItem = {
  headline: string;
  summary: string;
  source: string;
  level: Level;
  topic: string;
  minutesAgo: number;
  relevance: number;
  sentiment: Sentiment;
};

const NEWS: NewsItem[] = [
  {
    headline: "BBMP clears ₹240 cr tender for Mahadevapura stormwater drain overhaul",
    summary: "Work to start in February covering 18 km of choked drains across Whitefield and KR Puram wards.",
    source: "Deccan Herald",
    level: "District",
    topic: "Infrastructure",
    minutesAgo: 12,
    relevance: 96,
    sentiment: "Positive",
  },
  {
    headline: "Cauvery Stage V pipeline delayed again; supply to East Bengaluru hit",
    summary: "BWSSB cites land acquisition issues near Hoskote; residents in Whitefield, Bellandur affected.",
    source: "The Hindu",
    level: "District",
    topic: "Water",
    minutesAgo: 41,
    relevance: 94,
    sentiment: "Negative",
  },
  {
    headline: "Namma Metro Phase 3 DPR cleared by state cabinet",
    summary: "ORR-Hebbal-Sarjapur lines to add 44 km; tech corridor connectivity gets a major boost.",
    source: "Times of India",
    level: "State",
    topic: "Transport",
    minutesAgo: 88,
    relevance: 92,
    sentiment: "Positive",
  },
  {
    headline: "Karnataka tables Bill mandating 70% local hiring in private sector",
    summary: "Industry bodies including Nasscom raise concerns; political reactions polarised online.",
    source: "Indian Express",
    level: "State",
    topic: "Jobs",
    minutesAgo: 120,
    relevance: 88,
    sentiment: "Neutral",
  },
  {
    headline: "Union Budget hikes outlay for urban transport by 28%",
    summary: "Tier-1 metros including Bengaluru likely to benefit; metro extension funding announced.",
    source: "Mint",
    level: "National",
    topic: "Budget",
    minutesAgo: 175,
    relevance: 82,
    sentiment: "Positive",
  },
  {
    headline: "Pothole-related accidents up 31% YoY in Bengaluru: HC takes suo motu cognizance",
    summary: "Bench seeks reply from BBMP and state PWD within two weeks; civic groups call for accountability.",
    source: "Bangalore Mirror",
    level: "District",
    topic: "Roads",
    minutesAgo: 210,
    relevance: 95,
    sentiment: "Negative",
  },
  {
    headline: "Lake activists submit Bellandur revival roadmap to NGT",
    summary: "Citizen volunteers propose phased de-weeding and STP audits; seek MP and MLA endorsement.",
    source: "Citizen Matters",
    level: "District",
    topic: "Environment",
    minutesAgo: 260,
    relevance: 90,
    sentiment: "Positive",
  },
  {
    headline: "ESCOMs propose 35 paise/unit tariff hike; KERC public hearing on Friday",
    summary: "BESCOM consumers in Bengaluru Urban likely to see steepest increase if approved.",
    source: "Deccan Chronicle",
    level: "State",
    topic: "Power",
    minutesAgo: 320,
    relevance: 78,
    sentiment: "Negative",
  },
  {
    headline: "Centre notifies Gig Workers Social Security Rules 2026",
    summary: "Aggregators to contribute 1-2% of turnover; Karnataka first state to begin implementation.",
    source: "Reuters India",
    level: "National",
    topic: "Welfare",
    minutesAgo: 410,
    relevance: 80,
    sentiment: "Positive",
  },
  {
    headline: "IISc-BBMP study flags 41% drop in Bengaluru green cover since 2010",
    summary: "Recommends ward-level tree census; civic body to integrate findings in Master Plan 2041.",
    source: "The Print",
    level: "District",
    topic: "Environment",
    minutesAgo: 540,
    relevance: 87,
    sentiment: "Neutral",
  },
  {
    headline: "Parliament Winter Session: AI Regulation Bill listed for first reading",
    summary: "Karnataka MPs expected to weigh in given Bengaluru's stake in the IT-AI ecosystem.",
    source: "ANI",
    level: "National",
    topic: "Tech Policy",
    minutesAgo: 720,
    relevance: 76,
    sentiment: "Neutral",
  },
  {
    headline: "Anna Bhagya rice quota restored to 10 kg per family",
    summary: "State govt secures supply from FCI; rollout begins next ration cycle.",
    source: "Prajavani",
    level: "State",
    topic: "Welfare",
    minutesAgo: 900,
    relevance: 70,
    sentiment: "Positive",
  },
];

const HASHTAGS = [
  { tag: "#BengaluruTraffic", volume: 48200, change: 22.4 },
  { tag: "#CauveryWater", volume: 36100, change: 14.1 },
  { tag: "#FixOurRoads", volume: 21800, change: 31.7 },
  { tag: "#NammaMetro", volume: 18900, change: 8.2 },
  { tag: "#SaveOurLakes", volume: 9800, change: 12.3 },
  { tag: "#KannadigaJobs", volume: 88200, change: 41.2 },
  { tag: "#Mekedatu", volume: 33800, change: 12.9 },
  { tag: "#Budget2026", volume: 412000, change: 28.4 },
  { tag: "#AIBill", volume: 98400, change: 34.2 },
];

const LEVEL_STYLES: Record<Level, string> = {
  District: "bg-saffron/15 text-saffron border-saffron/30",
  State: "bg-navy/10 text-navy border-navy/20",
  National: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const SENT_STYLES: Record<Sentiment, string> = {
  Positive: "bg-emerald-50 text-emerald-700",
  Neutral: "bg-slate-100 text-slate-700",
  Negative: "bg-rose-50 text-rose-700",
};

function fmtTime(min: number) {
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function fmtVol(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

function NewsPage() {
  const [filter, setFilter] = useState<"All" | Level>("All");

  const filtered = useMemo(
    () => (filter === "All" ? NEWS : NEWS.filter((n) => n.level === filter)),
    [filter],
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            News &amp; Hashtags
          </h1>
          <p className="text-sm text-muted-foreground">
            Live feed of news mentions and trending hashtags across your priority topics.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          14 sources · refreshed 1 min ago
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {(["All", "District", "State", "National"] as const).map((l) => (
              <Button
                key={l}
                size="sm"
                variant={filter === l ? "default" : "outline"}
                onClick={() => setFilter(l)}
                className={
                  filter === l
                    ? "bg-navy text-white hover:bg-navy/90"
                    : "text-muted-foreground"
                }
              >
                {l}
              </Button>
            ))}
            <span className="ml-auto text-xs text-muted-foreground">
              {filtered.length} stories
            </span>
          </div>

          <div className="space-y-3">
            {filtered.map((n) => (
              <Card
                key={n.headline}
                className="group p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`border text-[10px] uppercase tracking-wider ${LEVEL_STYLES[n.level]}`}
                      >
                        {n.level}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {n.topic}
                      </Badge>
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${SENT_STYLES[n.sentiment]}`}>
                        {n.sentiment}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold leading-snug text-foreground">
                      {n.headline}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {n.summary}
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Newspaper className="h-3 w-3" /> {n.source}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {fmtTime(n.minutesAgo)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="rounded-md bg-navy/5 px-2.5 py-1.5 text-center">
                      <div className="text-base font-semibold tabular-nums text-navy">
                        {n.relevance}
                      </div>
                      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                        Relevance
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100"
                    >
                      Open <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-saffron" />
                <h2 className="text-sm font-semibold text-foreground">Trending Hashtags</h2>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">24h</span>
            </div>
            <div className="space-y-1">
              {HASHTAGS.map((h, i) => (
                <div
                  key={h.tag}
                  className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/60"
                >
                  <span className="w-5 text-xs font-mono text-muted-foreground">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-saffron">{h.tag}</div>
                    <div className="text-[11px] text-muted-foreground tabular-nums">
                      {fmtVol(h.volume)} mentions
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <TrendingUp className="h-3 w-3" />+{h.change.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-saffron/30 bg-saffron/5 p-4">
            <div className="text-xs font-semibold text-foreground">Editor's pick</div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Stormwater drain overhaul + lake revival roadmap align with your top
              constituent grievances this week. Consider a joint statement.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
