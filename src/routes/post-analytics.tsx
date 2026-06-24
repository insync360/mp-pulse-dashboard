import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Heart,
  Repeat2,
  MessageSquare,
  Eye,
  Calendar,
  Download,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/post-analytics")({
  head: () => ({
    meta: [
      { title: "Post Analytics — MP Pulse" },
      {
        name: "description",
        content:
          "Deep-dive post-level analytics across X, Instagram, Facebook & YouTube with engagement, topic, and timing intelligence.",
      },
    ],
  }),
  component: PostAnalytics,
});

// ---------- Mock posts ----------
type Platform = "X" | "Instagram" | "Facebook" | "YouTube";
type Topic = "Infrastructure" | "Water" | "Jobs" | "Healthcare" | "Education" | "Transport" | "Environment";

type Post = {
  id: number;
  platform: Platform;
  text: string;
  date: string;
  impressions: number;
  likes: number;
  reposts: number;
  comments: number;
  topic: Topic;
  type: "Video" | "Image" | "Text" | "Poll";
};

const posts: Post[] = [
  { id: 1, platform: "X", text: "Inaugurated the new metro feeder bus service connecting Whitefield to KR Puram — 42 buses, 18 routes.", date: "Jun 22", impressions: 412000, likes: 18200, reposts: 3100, comments: 1400, topic: "Transport", type: "Image" },
  { id: 2, platform: "Instagram", text: "Walked through Bellandur lake rejuvenation site with BBMP officials. Phase 2 starts next month.", date: "Jun 21", impressions: 287000, likes: 24100, reposts: 1800, comments: 962, topic: "Environment", type: "Video" },
  { id: 3, platform: "Facebook", text: "Raised the issue of stalled Mahadevapura water supply in Parliament today. Cauvery Stage V must be fast-tracked.", date: "Jun 20", impressions: 198000, likes: 9700, reposts: 2400, comments: 1100, topic: "Water", type: "Text" },
  { id: 4, platform: "X", text: "₹340 cr sanctioned for ORR signal-free corridor. Work begins post-monsoon. #NammaBengaluru", date: "Jun 19", impressions: 356000, likes: 14800, reposts: 4200, comments: 1850, topic: "Infrastructure", type: "Image" },
  { id: 5, platform: "YouTube", text: "Town hall with IT employees in Electronic City on the Karnataka Gig Workers Bill.", date: "Jun 18", impressions: 89000, likes: 6200, reposts: 412, comments: 730, topic: "Jobs", type: "Video" },
  { id: 6, platform: "Instagram", text: "Free health camp at Hebbal: 1,240 citizens screened. Diabetes & BP top concerns.", date: "Jun 17", impressions: 164000, likes: 19800, reposts: 920, comments: 540, topic: "Healthcare", type: "Image" },
  { id: 7, platform: "X", text: "Which Bengaluru issue should we prioritise this monsoon?", date: "Jun 16", impressions: 221000, likes: 8100, reposts: 1240, comments: 3400, topic: "Infrastructure", type: "Poll" },
  { id: 8, platform: "Facebook", text: "Met with Class 10 toppers from BBMP schools. Scholarships announced for top 50 students.", date: "Jun 15", impressions: 112000, likes: 14200, reposts: 980, comments: 612, topic: "Education", type: "Image" },
  { id: 9, platform: "X", text: "Reviewed pothole repair status across Bommanahalli. BBMP missed 38% of SLA targets — calling joint review.", date: "Jun 14", impressions: 273000, likes: 11400, reposts: 2700, comments: 1820, topic: "Infrastructure", type: "Text" },
  { id: 10, platform: "Instagram", text: "Ground-breaking for the 200-bed multi-speciality hospital in Yelahanka. 18 months to completion.", date: "Jun 13", impressions: 198000, likes: 22100, reposts: 1340, comments: 720, topic: "Healthcare", type: "Video" },
  { id: 11, platform: "YouTube", text: "Full speech: Bengaluru's water crisis and the Cauvery Stage V roadmap.", date: "Jun 12", impressions: 64000, likes: 4800, reposts: 380, comments: 540, topic: "Water", type: "Video" },
  { id: 12, platform: "X", text: "Skill India centre at Peenya inaugurated. 8 trades, 2,400 seats / year. Placement tie-ups with 38 firms.", date: "Jun 11", impressions: 154000, likes: 7800, reposts: 1620, comments: 410, topic: "Jobs", type: "Image" },
  { id: 13, platform: "Facebook", text: "Detailed thread on the new Bengaluru Suburban Rail funding agreement signed today.", date: "Jun 10", impressions: 132000, likes: 8900, reposts: 1480, comments: 720, topic: "Transport", type: "Text" },
  { id: 14, platform: "Instagram", text: "Tree plantation drive with school students at Cubbon Park — 1,200 saplings planted.", date: "Jun 09", impressions: 178000, likes: 21400, reposts: 1120, comments: 480, topic: "Environment", type: "Image" },
  { id: 15, platform: "X", text: "Government school teachers in Karnataka deserve better. Pushing for the pending DA arrears in this session.", date: "Jun 08", impressions: 241000, likes: 12800, reposts: 3100, comments: 1410, topic: "Education", type: "Text" },
];

const topicColors: Record<Topic, string> = {
  Infrastructure: "bg-blue-50 text-blue-700",
  Water: "bg-cyan-50 text-cyan-700",
  Jobs: "bg-amber-50 text-amber-700",
  Healthcare: "bg-emerald-50 text-emerald-700",
  Education: "bg-violet-50 text-violet-700",
  Transport: "bg-indigo-50 text-indigo-700",
  Environment: "bg-lime-50 text-lime-700",
};

function PlatformDot({ platform }: { platform: Platform }) {
  const map: Record<Platform, string> = {
    X: "bg-foreground text-background",
    Instagram: "bg-gradient-to-br from-pink-500 to-orange-400 text-white",
    Facebook: "bg-blue-600 text-white",
    YouTube: "bg-red-600 text-white",
  };
  const label: Record<Platform, string> = {
    X: "𝕏",
    Instagram: "Ig",
    Facebook: "f",
    YouTube: "▶",
  };
  return (
    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold shrink-0 ${map[platform]}`}>
      {label[platform]}
    </span>
  );
}

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

function engagementRate(p: Post) {
  return ((p.likes + p.reposts + p.comments) / p.impressions) * 100;
}

// Heatmap data: 7 days x 12 hours (6am-6pm window)
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = ["6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p", "10p"];
const heatmap = days.map((d, di) =>
  hours.map((_, hi) => {
    // Engineered "best time" pattern: 8-10am and 6-8pm peaks, weekends slightly different
    const morningPeak = Math.exp(-((hi - 1.5) ** 2) / 2);
    const eveningPeak = Math.exp(-((hi - 6) ** 2) / 2);
    const weekendBoost = di >= 5 ? 0.6 : 1;
    const v = (morningPeak * 0.55 + eveningPeak * 0.75) * weekendBoost;
    const noise = ((di * 7 + hi * 13) % 11) / 60;
    return Math.min(1, v + noise);
  })
);

const byType = [
  { type: "Video", engagement: 7.4, count: 4 },
  { type: "Image", engagement: 6.1, count: 6 },
  { type: "Poll", engagement: 5.8, count: 1 },
  { type: "Text", engagement: 4.2, count: 4 },
];

function PostAnalytics() {
  const [platform, setPlatform] = useState<string>("all");
  const [topic, setTopic] = useState<string>("all");
  const [sort, setSort] = useState<string>("date");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let list = posts.filter((p) => {
      if (platform !== "all" && p.platform !== platform) return false;
      if (topic !== "all" && p.topic !== topic) return false;
      if (q && !p.text.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "impressions") return b.impressions - a.impressions;
      if (sort === "engagement") return engagementRate(b) - engagementRate(a);
      if (sort === "likes") return b.likes - a.likes;
      return b.id - a.id; // date proxy
    });
    return list;
  }, [platform, topic, sort, q]);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Post Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Every post, every metric — across X, Instagram, Facebook & YouTube.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </Button>
      </div>

      {/* Insight row: heatmap + bar chart */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3 p-5 shadow-soft border-border/70">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Best Time to Post</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Engagement intensity by day & hour (IST). Darker saffron = higher.
              </p>
            </div>
            <Badge className="bg-saffron/15 text-saffron border-0 text-[10px]">
              Peak: Tue 8 PM
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[480px]">
              <div className="flex">
                <div className="w-10" />
                {hours.map((h) => (
                  <div
                    key={h}
                    className="flex-1 text-center text-[10px] text-muted-foreground font-medium"
                  >
                    {h}
                  </div>
                ))}
              </div>
              {heatmap.map((row, di) => (
                <div key={days[di]} className="flex items-center mt-1">
                  <div className="w-10 text-[11px] text-muted-foreground font-medium">
                    {days[di]}
                  </div>
                  {row.map((v, hi) => (
                    <div key={hi} className="flex-1 px-0.5">
                      <div
                        className="h-7 rounded-md"
                        style={{
                          background: `color-mix(in oklch, var(--saffron) ${Math.round(
                            v * 100
                          )}%, var(--muted))`,
                        }}
                        title={`${days[di]} ${hours[hi]} · ${(v * 10).toFixed(1)}`}
                      />
                    </div>
                  ))}
                </div>
              ))}
              <div className="mt-3 flex items-center justify-end gap-2 text-[10px] text-muted-foreground">
                <span>Low</span>
                <div className="flex">
                  {[10, 30, 50, 70, 90].map((p) => (
                    <div
                      key={p}
                      className="h-2 w-6"
                      style={{
                        background: `color-mix(in oklch, var(--saffron) ${p}%, var(--muted))`,
                      }}
                    />
                  ))}
                </div>
                <span>High</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-5 shadow-soft border-border/70">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">Engagement by Post Type</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Average engagement rate, last 30 days
            </p>
          </div>
          <div className="h-56 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byType} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="type" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => `${v}%`}
                />
                <Bar dataKey="engagement" radius={[8, 8, 0, 0]}>
                  {byType.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "var(--saffron)" : "var(--navy)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-3 shadow-soft border-border/70">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-[200px] rounded-lg border border-border bg-background px-3 py-1.5 text-muted-foreground">
            <Search className="h-3.5 w-3.5" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search posts…"
              className="bg-transparent text-sm outline-none placeholder:text-muted-foreground/70 w-full text-foreground"
            />
          </div>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-[150px] h-9 text-sm">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All platforms</SelectItem>
              <SelectItem value="X">X (Twitter)</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
            </SelectContent>
          </Select>
          <Select value={topic} onValueChange={setTopic}>
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder="Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All topics</SelectItem>
              {Object.keys(topicColors).map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2 h-9">
            <Calendar className="h-3.5 w-3.5" /> Last 30 days
          </Button>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[170px] h-9 text-sm">
              <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Most recent</SelectItem>
              <SelectItem value="impressions">Impressions</SelectItem>
              <SelectItem value="engagement">Engagement rate</SelectItem>
              <SelectItem value="likes">Likes</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" className="gap-2 h-9">
            <SlidersHorizontal className="h-3.5 w-3.5" /> More
          </Button>
        </div>
      </Card>

      {/* Posts table */}
      <Card className="shadow-soft border-border/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-3 min-w-[320px]">Post</th>
                <th className="text-left font-medium px-3 py-3">Platform</th>
                <th className="text-left font-medium px-3 py-3">Date</th>
                <th className="text-right font-medium px-3 py-3">Impressions</th>
                <th className="text-right font-medium px-3 py-3">Likes</th>
                <th className="text-right font-medium px-3 py-3">Reposts</th>
                <th className="text-right font-medium px-3 py-3">Comments</th>
                <th className="text-right font-medium px-3 py-3">Eng. Rate</th>
                <th className="text-left font-medium px-3 py-3">Topic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => {
                const er = engagementRate(p);
                return (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`h-10 w-10 rounded-md shrink-0 flex items-center justify-center text-[10px] font-semibold ${
                            p.type === "Video"
                              ? "bg-red-100 text-red-700"
                              : p.type === "Image"
                              ? "bg-blue-100 text-blue-700"
                              : p.type === "Poll"
                              ? "bg-violet-100 text-violet-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {p.type === "Video" ? "▶" : p.type === "Image" ? "🖼" : p.type === "Poll" ? "📊" : "T"}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm text-foreground line-clamp-2 leading-snug max-w-md">
                            {p.text}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {p.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3"><PlatformDot platform={p.platform} /></td>
                    <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{p.date}</td>
                    <td className="px-3 py-3 text-right tabular-nums font-medium text-foreground">
                      <span className="inline-flex items-center gap-1 justify-end">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        {formatNum(p.impressions)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                      <span className="inline-flex items-center gap-1 justify-end">
                        <Heart className="h-3 w-3" /> {formatNum(p.likes)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                      <span className="inline-flex items-center gap-1 justify-end">
                        <Repeat2 className="h-3 w-3" /> {formatNum(p.reposts)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                      <span className="inline-flex items-center gap-1 justify-end">
                        <MessageSquare className="h-3 w-3" /> {formatNum(p.comments)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${
                          er >= 6
                            ? "bg-emerald-50 text-emerald-700"
                            : er >= 3
                            ? "bg-saffron/15 text-saffron"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {er.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <Badge className={`border-0 text-[10px] ${topicColors[p.topic]}`}>
                        {p.topic}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted-foreground">
          <span>
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {posts.length} posts
          </span>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" className="h-7 px-2 text-xs">Prev</Button>
            <Button size="sm" variant="outline" className="h-7 px-2 text-xs">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
