import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Smile,
  MessageCircle,
  ShieldAlert,
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertOctagon,
  ThumbsUp,
  ThumbsDown,
  Bot,
  ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/sentiment")({
  head: () => ({
    meta: [
      { title: "Sentiment Analysis — MP Pulse" },
      {
        name: "description",
        content:
          "Citizen sentiment, surfaced grievances, and coordinated-campaign detection across Bengaluru.",
      },
    ],
  }),
  component: SentimentPage,
});

// ---------- Mock data ----------
const trend = Array.from({ length: 30 }, (_, i) => {
  const posBase = 62 + Math.sin(i / 4) * 6 + (i > 18 ? 3 : 0);
  const negBase = 12 + Math.cos(i / 3) * 4 + (i > 20 && i < 25 ? 6 : 0);
  const pos = Math.max(40, Math.min(80, posBase));
  const neg = Math.max(5, Math.min(25, negBase));
  const neu = 100 - pos - neg;
  return {
    day: `${i + 1}`,
    positive: Math.round(pos),
    neutral: Math.round(neu),
    negative: Math.round(neg),
  };
});

const byIssue = [
  { issue: "Infrastructure", positive: 62, negative: 38 },
  { issue: "Water Supply", positive: 28, negative: 72 },
  { issue: "Jobs", positive: 71, negative: 29 },
  { issue: "Traffic", positive: 21, negative: 79 },
  { issue: "Healthcare", positive: 78, negative: 22 },
  { issue: "Law & Order", positive: 54, negative: 46 },
];

type Grievance = {
  text: string;
  location: string;
  issue: string;
  urgency: "High" | "Med" | "Low";
  count: number;
};

const grievances: Grievance[] = [
  {
    text: "No Cauvery water in Mahadevapura since 4 days. Tanker mafia charging ₹1,800 per load.",
    location: "Mahadevapura",
    issue: "Water Supply",
    urgency: "High",
    count: 184,
  },
  {
    text: "ORR signal at Marathahalli broken for a week. 2 hour jam every evening.",
    location: "Marathahalli",
    issue: "Traffic",
    urgency: "High",
    count: 312,
  },
  {
    text: "Garbage not lifted in HSR Sector 2 since Sunday. Stench unbearable.",
    location: "HSR Layout",
    issue: "Sanitation",
    urgency: "Med",
    count: 96,
  },
  {
    text: "BBMP school in Whitefield has no working toilets. Parents pulling kids out.",
    location: "Whitefield",
    issue: "Education",
    urgency: "High",
    count: 64,
  },
  {
    text: "Street lights on KR Puram main road have been off for 11 days. Unsafe at night.",
    location: "KR Puram",
    issue: "Infrastructure",
    urgency: "Med",
    count: 142,
  },
  {
    text: "Stray dog attacks rising in Bellandur — 6 cases this week. Need urgent vaccination drive.",
    location: "Bellandur",
    issue: "Healthcare",
    urgency: "Low",
    count: 38,
  },
];

type Thread = {
  tone: "support" | "critical";
  title: string;
  source: string;
  count: string;
  comments: { user: string; text: string }[];
};

const threads: Thread[] = [
  {
    tone: "support",
    title: "Bellandur lake rejuvenation update",
    source: "Instagram · 2 days ago",
    count: "962 comments",
    comments: [
      { user: "@arvind_blr", text: "Finally some real action. The foam was suffocating. Thank you sir 🙏" },
      { user: "@kavya.s", text: "Please ensure phase 2 doesn't get stuck like the earlier round. We're with you." },
    ],
  },
  {
    tone: "support",
    title: "Hebbal free health camp",
    source: "Facebook · 4 days ago",
    count: "540 comments",
    comments: [
      { user: "Lakshmi N.", text: "Got my mother screened. Diabetes caught early. Grateful for this initiative." },
      { user: "Suresh K.", text: "More such camps in north Bengaluru wards please." },
    ],
  },
  {
    tone: "critical",
    title: "Mahadevapura water supply Parliament statement",
    source: "X · 3 days ago",
    count: "1.1K comments",
    comments: [
      { user: "@mahesh_blr", text: "Speeches won't bring water. We've been hearing Cauvery Stage V for 6 years now." },
      { user: "@nidhi_w", text: "Visit Sai Layout once. Tankers are looting us and your office is silent." },
    ],
  },
  {
    tone: "critical",
    title: "Pothole repair review post",
    source: "X · 5 days ago",
    count: "1.8K comments",
    comments: [
      { user: "@ravib", text: "Bommanahalli roads are a war zone. SLA targets are a joke." },
      { user: "@deepathomas", text: "Three two-wheeler accidents on our road this month. Who is accountable?" },
    ],
  },
];

// ---------- Components ----------
function KpiCard({
  icon: Icon,
  label,
  value,
  delta,
  positive,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
  sub: string;
  accent?: "navy" | "emerald" | "red";
}) {
  const accents = {
    navy: "bg-navy/5 text-navy",
    emerald: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
  };
  return (
    <Card className="p-5 shadow-soft border-border/70">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            accents[accent ?? "navy"]
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        {delta && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5 ${
              positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            }`}
          >
            {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {delta}
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
          {label}
        </div>
        <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{sub}</div>
      </div>
    </Card>
  );
}

function urgencyClass(u: Grievance["urgency"]) {
  if (u === "High") return "bg-red-50 text-red-700";
  if (u === "Med") return "bg-amber-50 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

function SentimentPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Sentiment Analysis
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          What citizens are saying — by issue, by ward, in their own words.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          icon={Smile}
          label="Overall Sentiment"
          value="68% positive"
          delta="+3%"
          positive
          sub="vs. previous 30 days"
          accent="emerald"
        />
        <KpiCard
          icon={MessageCircle}
          label="Comments Analyzed"
          value="47,200"
          delta="+12%"
          positive
          sub="across all connected accounts"
          accent="navy"
        />
        <KpiCard
          icon={ShieldAlert}
          label="Bot / Troll Flagged"
          value="8.4%"
          delta="+1.6pp"
          positive={false}
          sub="3,964 comments quarantined"
          accent="red"
        />
      </div>

      {/* Trend + by-issue */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3 p-5 shadow-soft border-border/70">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Sentiment Trend — 30 Days</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Daily share of positive, neutral, and negative comments
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Positive
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-slate-400" /> Neutral
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-red-500" /> Negative
              </span>
            </div>
          </div>
          <div className="h-64 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} stackOffset="expand" margin={{ top: 4, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="pos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.16 155)" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="oklch(0.65 0.16 155)" stopOpacity={0.55} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${Math.round(v * 100)}%`}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number, name) => [`${v}%`, name]}
                  labelFormatter={(l) => `Day ${l}`}
                />
                <Area
                  type="monotone"
                  dataKey="positive"
                  stackId="1"
                  stroke="oklch(0.65 0.16 155)"
                  fill="url(#pos)"
                />
                <Area
                  type="monotone"
                  dataKey="neutral"
                  stackId="1"
                  stroke="oklch(0.7 0.03 260)"
                  fill="oklch(0.85 0.02 260)"
                />
                <Area
                  type="monotone"
                  dataKey="negative"
                  stackId="1"
                  stroke="oklch(0.6 0.22 27)"
                  fill="oklch(0.78 0.14 27)"
                  fillOpacity={0.85}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-5 shadow-soft border-border/70">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">Sentiment by Issue</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              % positive vs. % negative, top 6 issues
            </p>
          </div>
          <div className="space-y-3">
            {byIssue.map((row) => (
              <div key={row.issue}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-foreground">{row.issue}</span>
                  <span className="text-muted-foreground tabular-nums">
                    <span className="text-emerald-700 font-semibold">{row.positive}%</span>
                    <span className="mx-1">·</span>
                    <span className="text-red-700 font-semibold">{row.negative}%</span>
                  </span>
                </div>
                <div className="flex h-2.5 rounded-full overflow-hidden bg-muted">
                  <div
                    className="bg-emerald-500"
                    style={{ width: `${row.positive}%` }}
                  />
                  <div
                    className="bg-red-500"
                    style={{ width: `${row.negative}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Grievances + Campaign detection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5 shadow-soft border-border/70">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Surfaced Grievances</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Auto-extracted from {`47,200`} comments · clustered by topic & location
              </p>
            </div>
            <Button size="sm" variant="outline" className="text-xs h-8">
              Assign to office
            </Button>
          </div>
          <div className="space-y-2.5">
            {grievances.map((g, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-3.5 hover:border-saffron/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-foreground leading-snug flex-1">"{g.text}"</p>
                  <Badge className={`border-0 text-[10px] uppercase tracking-wider shrink-0 ${urgencyClass(g.urgency)}`}>
                    {g.urgency}
                  </Badge>
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="font-medium text-foreground">{g.location}</span>
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <Badge variant="outline" className="text-[10px] border-border">
                      {g.issue}
                    </Badge>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">
                      <span className="font-medium text-foreground tabular-nums">{g.count}</span> similar mentions
                    </span>
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 text-xs text-navy">
                    View cluster <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 shadow-soft border-border/70 bg-gradient-to-br from-red-50/60 to-amber-50/40 border-red-200/60">
          <div className="flex items-start gap-3 mb-3">
            <div className="h-9 w-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Coordinated Campaign Detected</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Suspicious cluster flagged in the last 24 hours
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-card border border-red-200/60 p-3.5">
            <div className="flex items-center justify-between">
              <Badge className="bg-red-100 text-red-700 border-0 text-[10px] uppercase tracking-wider">
                <AlertOctagon className="h-3 w-3 mr-1" /> High confidence
              </Badge>
              <span className="text-[11px] text-muted-foreground">94% similarity</span>
            </div>
            <div className="mt-3 text-sm text-foreground font-medium">
              218 near-identical replies on Mahadevapura water thread
            </div>
            <div className="mt-2 rounded-lg bg-muted/60 p-2.5 text-xs text-foreground italic">
              "MP only does drama. No real work for Bengaluru. Vote wisely 2029."
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-lg bg-muted/50 p-2">
                <div className="text-muted-foreground">Accounts</div>
                <div className="font-semibold text-foreground tabular-nums">218 · 73% &lt;30 days old</div>
              </div>
              <div className="rounded-lg bg-muted/50 p-2">
                <div className="text-muted-foreground">Posting window</div>
                <div className="font-semibold text-foreground">11:42 – 11:58 PM</div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" className="flex-1 h-8 text-xs bg-navy text-navy-foreground hover:bg-navy/90">
                Review cluster
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs">
                Auto-mute
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Threads */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Top Threads</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Most active supportive and critical conversations this week
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {threads.map((t, i) => {
            const isSupport = t.tone === "support";
            return (
              <Card
                key={i}
                className={`p-5 shadow-soft border-border/70 border-l-4 ${
                  isSupport ? "border-l-emerald-500" : "border-l-red-500"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`border-0 text-[10px] uppercase tracking-wider ${
                          isSupport
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {isSupport ? (
                          <ThumbsUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ThumbsDown className="h-3 w-3 mr-1" />
                        )}
                        {isSupport ? "Supportive" : "Critical"}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">{t.count}</span>
                    </div>
                    <div className="text-sm font-semibold text-foreground mt-2">{t.title}</div>
                    <div className="text-[11px] text-muted-foreground">{t.source}</div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-8 text-xs text-navy">
                    Open <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {t.comments.map((c, ci) => (
                    <div
                      key={ci}
                      className="rounded-lg bg-muted/40 border border-border p-3"
                    >
                      <div className="text-[11px] font-semibold text-foreground">{c.user}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {c.text}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
