import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Smile,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  MessageSquare,
  Heart,
  Repeat2,
  Eye,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Command Center — MP Pulse" },
      {
        name: "description",
        content:
          "Real-time political social-media intelligence: reach, engagement, sentiment, and emerging issues across Bengaluru.",
      },
    ],
  }),
  component: CommandCenter,
});

// ---------- Mock data ----------
const reachData = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const base = 60000 + Math.sin(i / 3) * 12000 + i * 1800;
  const noise = (i % 5) * 3500;
  return {
    day: `${day}`,
    reach: Math.round(base + noise),
    engagement: Math.round((base + noise) * 0.048),
  };
});

const sentimentData = [
  { name: "Positive", value: 68, color: "var(--success)" },
  { name: "Neutral", value: 22, color: "var(--chart-5)" },
  { name: "Negative", value: 10, color: "var(--destructive)" },
];

const topPosts = [
  {
    platform: "X",
    text: "Inaugurated the new metro feeder bus service connecting Whitefield to KR Puram — 42 new buses, 18 routes. #NammaBengaluru",
    impressions: "412K",
    likes: "18.2K",
    shares: "3.1K",
    comments: "1.4K",
    engagement: "5.4%",
    sentiment: "positive",
  },
  {
    platform: "Instagram",
    text: "Walked through Bellandur lake rejuvenation site with BBMP officials. Phase 2 starts next month. Bengaluru deserves clean lakes.",
    impressions: "287K",
    likes: "24.1K",
    shares: "1.8K",
    comments: "962",
    engagement: "9.4%",
    sentiment: "positive",
  },
  {
    platform: "Facebook",
    text: "Raised the issue of stalled Mahadevapura water supply in Parliament today. Cauvery Stage V must be fast-tracked.",
    impressions: "198K",
    likes: "9.7K",
    shares: "2.4K",
    comments: "1.1K",
    engagement: "6.7%",
    sentiment: "neutral",
  },
];

const alerts = [
  {
    icon: AlertTriangle,
    tone: "danger",
    title: "Negative spike on #BengaluruTraffic",
    body: "Sentiment dropped 14% in the last 24h — 2,431 mentions, mostly around ORR congestion.",
    time: "23 min ago",
  },
  {
    icon: TrendingUp,
    tone: "warning",
    title: "Rising issue: Water supply in Mahadevapura",
    body: "Mentions up 312% week-over-week. 7 local media outlets picked up the story.",
    time: "1h ago",
  },
  {
    icon: Sparkles,
    tone: "saffron",
    title: "Opportunity: Metro Phase 3 announcement trending",
    body: "Positive narrative across 4 hashtags. Consider amplifying with a constituency visit reel.",
    time: "3h ago",
  },
];

// ---------- Helpers ----------
function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${n}`;
}

// ---------- Components ----------
function KpiCard({
  label,
  value,
  delta,
  deltaPositive = true,
  icon: Icon,
  sub,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  icon: React.ElementType;
  sub?: string;
}) {
  return (
    <Card className="p-5 shadow-soft border-border/70 bg-card hover:shadow-card transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy/5 text-navy">
          <Icon className="h-4 w-4" />
        </div>
        {delta && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5 ${
              deltaPositive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {deltaPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {delta}
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          {label}
        </div>
        <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
          {value}
        </div>
        {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
      </div>
    </Card>
  );
}

function GaugeKpi({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card className="p-5 shadow-soft border-border/70 bg-gradient-to-br from-navy to-navy/90 text-navy-foreground">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-navy-foreground/60 font-medium">
            Aspiration Readiness
          </div>
          <div className="mt-1 text-2xl font-bold tracking-tight">
            {score}<span className="text-sm text-navy-foreground/60 font-medium">/100</span>
          </div>
          <Badge className="mt-2 bg-saffron/20 text-saffron border-0 text-[10px] uppercase tracking-wider">
            Strong
          </Badge>
        </div>
        <div className="relative h-20 w-20">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="oklch(1 0 0 / 0.12)"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="var(--saffron)"
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
            {score}%
          </div>
        </div>
      </div>
    </Card>
  );
}

function AlertCard({
  icon: Icon,
  tone,
  title,
  body,
  time,
}: (typeof alerts)[number]) {
  const toneStyles =
    tone === "danger"
      ? "border-red-200 bg-red-50/60"
      : tone === "warning"
      ? "border-amber-200 bg-amber-50/60"
      : "border-saffron/30 bg-saffron/10";
  const iconStyles =
    tone === "danger"
      ? "bg-red-100 text-red-700"
      : tone === "warning"
      ? "bg-amber-100 text-amber-700"
      : "bg-saffron/20 text-saffron";
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 ${toneStyles}`}
    >
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconStyles} shrink-0`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-semibold text-foreground">{title}</div>
          <span className="text-[11px] text-muted-foreground shrink-0">{time}</span>
        </div>
        <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{body}</div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="text-xs h-7 px-2 text-navy hover:bg-navy/5 shrink-0"
      >
        Investigate
        <ArrowUpRight className="h-3 w-3 ml-1" />
      </Button>
    </div>
  );
}

function PlatformDot({ platform }: { platform: string }) {
  const map: Record<string, string> = {
    X: "bg-foreground text-background",
    Instagram: "bg-gradient-to-br from-pink-500 to-orange-400 text-white",
    Facebook: "bg-blue-600 text-white",
  };
  return (
    <span
      className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold ${
        map[platform] ?? "bg-muted"
      }`}
    >
      {platform === "Instagram" ? "Ig" : platform === "Facebook" ? "f" : "𝕏"}
    </span>
  );
}

function CommandCenter() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Command Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time pulse of your digital presence across X, Instagram, Facebook & news media.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Synced 2 minutes ago
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          label="Total Reach"
          value="2.4M"
          delta="+12%"
          icon={Eye}
          sub="vs. previous 30 days"
        />
        <KpiCard
          label="Follower Growth"
          value="+18.3K"
          delta="+24%"
          icon={Users}
          sub="this month"
        />
        <KpiCard
          label="Engagement Rate"
          value="4.8%"
          delta="+0.6pp"
          icon={Activity}
          sub="industry avg. 2.1%"
        />
        <KpiCard
          label="Overall Sentiment"
          value="68%"
          delta="+3%"
          icon={Smile}
          sub="positive mentions"
        />
        <GaugeKpi score={72} />
      </div>

      {/* Alert strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">Priority Alerts</h2>
            <Badge className="bg-saffron/15 text-saffron border-0 text-[10px]">
              3 active
            </Badge>
          </div>
          <Button variant="link" size="sm" className="text-xs text-navy h-auto p-0">
            View all alerts →
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {alerts.map((a, i) => (
            <AlertCard key={i} {...a} />
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Reach line chart */}
        <Card className="lg:col-span-2 p-5 shadow-soft border-border/70">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Reach — Last 30 Days</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Cumulative impressions across all platforms
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-navy" /> Reach
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-saffron" /> Engagement
              </span>
            </div>
          </div>
          <div className="h-64 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reachData} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--navy)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--navy)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--saffron)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--saffron)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatNum(v)}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                    boxShadow: "var(--shadow-card)",
                  }}
                  formatter={(v: number) => formatNum(v)}
                  labelFormatter={(l) => `Day ${l}`}
                />
                <Area
                  type="monotone"
                  dataKey="reach"
                  stroke="var(--navy)"
                  strokeWidth={2.5}
                  fill="url(#reachGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  stroke="var(--saffron)"
                  strokeWidth={2}
                  fill="url(#engGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Sentiment donut */}
        <Card className="p-5 shadow-soft border-border/70">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">Sentiment Split</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Across 8,412 mentions analyzed
            </p>
          </div>
          <div className="h-44 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {sentimentData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => `${v}%`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-2xl font-bold text-foreground">68%</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Positive
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {sentimentData.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ background: s.color }}
                  />
                  <span className="text-foreground font-medium">{s.name}</span>
                </span>
                <span className="text-muted-foreground tabular-nums">{s.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top performing posts */}
      <Card className="p-5 shadow-soft border-border/70">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Top Performing Posts</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ranked by engagement in the last 30 days
            </p>
          </div>
          <Button variant="outline" size="sm" className="text-xs h-8">
            Full breakdown
          </Button>
        </div>
        <div className="divide-y divide-border">
          {topPosts.map((p, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-3 py-4 first:pt-0 last:pb-0 items-center"
            >
              <div className="col-span-12 md:col-span-6 flex items-start gap-3">
                <PlatformDot platform={p.platform} />
                <div className="min-w-0">
                  <div className="text-sm text-foreground line-clamp-2 leading-snug">
                    {p.text}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] uppercase border-0 ${
                        p.sentiment === "positive"
                          ? "bg-emerald-50 text-emerald-700"
                          : p.sentiment === "negative"
                          ? "bg-red-50 text-red-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {p.sentiment}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">{p.platform}</span>
                  </div>
                </div>
              </div>
              <div className="col-span-6 md:col-span-2 flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Impressions
                </span>
                <span className="text-sm font-semibold text-foreground tabular-nums">
                  {p.impressions}
                </span>
              </div>
              <div className="col-span-6 md:col-span-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" /> {p.likes}
                </span>
                <span className="flex items-center gap-1">
                  <Repeat2 className="h-3.5 w-3.5" /> {p.shares}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" /> {p.comments}
                </span>
              </div>
              <div className="col-span-12 md:col-span-1 text-right">
                <span className="inline-flex items-center gap-1 rounded-full bg-saffron/15 text-saffron text-xs font-semibold px-2 py-0.5">
                  {p.engagement}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
