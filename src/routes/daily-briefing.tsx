import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Headphones,
  Printer,
  MapPin,
  Clock,
  AlertTriangle,
  TrendingUp,
  Newspaper,
  ClipboardList,
  Users,
  FileSignature,
  Contact,
  Landmark,
  ArrowUpRight,
  ArrowDownRight,
  Gift,
  Cake,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/daily-briefing")({
  head: () => ({
    meta: [
      { title: "Daily Briefing — MP Pulse" },
      {
        name: "description",
        content:
          "Your morning command view: today's schedule, top intelligence, office pulse, and approvals queue.",
      },
    ],
  }),
  component: DailyBriefing,
});

const schedule = [
  {
    time: "09:00",
    title: "RWA Federation Meeting",
    location: "Whitefield Community Hall",
    travel: "25 min drive",
    type: "Constituency",
    hasBrief: true,
  },
  {
    time: "11:30",
    title: "Inauguration: New Borewell Project",
    location: "Ward 84, KR Puram",
    travel: "18 min drive",
    type: "Constituency",
    hasBrief: true,
  },
  {
    time: "13:30",
    title: "Lunch with Industry Delegation (IT corridor)",
    location: "ITPL Club, Marathahalli",
    travel: "22 min drive",
    type: "Political",
    hasBrief: true,
  },
  {
    time: "16:00",
    title: "Condolence Visit — Family of Sri Narayan Swamy",
    location: "Mahadevapura",
    travel: "14 min drive",
    type: "Personal",
    hasBrief: false,
  },
  {
    time: "18:30",
    title: "Party Cadre Review",
    location: "MP Office, Indiranagar",
    travel: "9 min drive",
    type: "Political",
    hasBrief: true,
  },
];

const typeStyles: Record<string, string> = {
  Constituency: "bg-saffron/15 text-saffron border-saffron/30",
  Political: "bg-navy/10 text-navy border-navy/20",
  Personal: "bg-slate-100 text-slate-700 border-slate-200",
};

const topThree = [
  {
    icon: TrendingUp,
    tone: "saffron",
    tag: "Rising Issue",
    title: "#BengaluruWater up 240% in 24h",
    body: "Sentiment turning negative in Mahadevapura and KR Puram clusters.",
    cta: "Open Issue Radar",
    href: "/issue-radar",
  },
  {
    icon: Newspaper,
    tone: "danger",
    tag: "Media",
    title: "Deccan Herald: 'Whitefield flooding — civic apathy'",
    body: "Traction: High • 2.1K shares in 6h • picked up by 4 outlets.",
    cta: "Open Media Watch",
    href: "/media-watch",
  },
  {
    icon: AlertTriangle,
    tone: "warning",
    tag: "Grievance Cluster",
    title: "14 new water-supply complaints — KR Puram",
    body: "Submitted overnight via MP office portal and WhatsApp.",
    cta: "Open Grievances",
    href: "/grievances",
  },
];

const toneMap: Record<string, { bg: string; border: string; icon: string; tag: string }> = {
  saffron: {
    bg: "bg-saffron/8",
    border: "border-saffron/30",
    icon: "bg-saffron/20 text-saffron",
    tag: "bg-saffron/15 text-saffron",
  },
  danger: {
    bg: "bg-red-50/60",
    border: "border-red-200",
    icon: "bg-red-100 text-red-700",
    tag: "bg-red-100 text-red-700",
  },
  warning: {
    bg: "bg-amber-50/60",
    border: "border-amber-200",
    icon: "bg-amber-100 text-amber-700",
    tag: "bg-amber-100 text-amber-700",
  },
};

const relationships = [
  {
    name: "Sri Ramesh Kumar",
    role: "Corporator, Whitefield Ward",
    reason: "Birthday today",
    tier: "Very Important",
    icon: Cake,
    cta: "Send via MP WhatsApp",
  },
  {
    name: "Mrs. Lakshmi Rao",
    role: "RWA Head, KR Puram",
    reason: "25th Wedding Anniversary",
    tier: "Important",
    icon: Gift,
    cta: "Send via Office",
  },
  {
    name: "A. Prakash",
    role: "Senior Correspondent, Prajavani",
    reason: "Follow-up due (12 days)",
    tier: "Press",
    icon: MessageCircle,
    cta: "Log Touchpoint",
  },
];

function DailyBriefing() {
  const [queue, setQueue] = useState([
    {
      id: "stmt-1",
      title: "Press statement: Whitefield flooding response",
      meta: "Drafted by Comms • 220 words",
      type: "approve",
    },
    {
      id: "post-1",
      title: "Social post: Borewell inauguration, KR Puram",
      meta: "Instagram + X • image attached",
      type: "approve",
    },
    {
      id: "letters",
      title: "5 recommendation letters pending",
      meta: "Education quota, medical aid, MSME",
      type: "open",
    },
  ]);

  const { cases, letters } = useData();
  const liveOpen = cases.filter((c) => ["New","Assigned","In Progress","Action Taken","Reopened"].includes(c.status)).length;
  const liveResolved = cases.filter((c) => c.status === "Resolved").length;
  const liveBreached = cases.filter((c) => ["New","Assigned","In Progress","Action Taken","Reopened"].includes(c.status) && new Date(c.slaDue).getTime() < Date.now()).length;
  const liveLettersAwaiting = letters.filter((l) => l.status === "Draft" || l.status === "Approved").length;

  const [pulse, setPulse] = useState({
    visitors: 42,
    grievOpen: liveOpen,
    grievClosed: liveResolved,
    sla: liveBreached,
    letters: liveLettersAwaiting,
    touchpoints: 4,
    funds: "₹6.3 Cr",
  });

  const approve = (id: string, title: string) => {
    setQueue((q) => q.filter((x) => x.id !== id));
    setPulse((p) => ({
      ...p,
      letters: id === "letters" ? Math.max(0, p.letters - 5) : p.letters,
    }));
    toast.success("Approved", { description: title });
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Good morning, Hon'ble MP
          </h1>
          <p className="text-sm text-muted-foreground">{today} • Bengaluru</p>
          <div className="flex items-start gap-2 max-w-2xl rounded-xl border border-saffron/30 bg-saffron/8 px-4 py-3">
            <Sparkles className="h-4 w-4 text-saffron mt-0.5 shrink-0" />
            <p className="text-sm text-foreground leading-relaxed">
              <span className="font-semibold">3 events today, 2 need briefs.</span>{" "}
              18 new grievances overnight.{" "}
              <span className="font-semibold">#BengaluruWater</span> is accelerating —
              consider a statement.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Headphones className="h-4 w-4" />
            Listen to Briefing
          </Button>
          <Button size="sm" className="h-9 bg-navy text-navy-foreground hover:bg-navy/90">
            <Printer className="h-4 w-4" />
            Print Day Sheet
          </Button>
        </div>
      </div>

      {/* Row 1: Schedule + Top 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Schedule */}
        <Card className="lg:col-span-3 p-5 shadow-soft border-border/70">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Today's Schedule</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                5 events • 1 travel conflict flagged
              </p>
            </div>
            <Link to="/calendar">
              <Button variant="ghost" size="sm" className="text-xs h-7 text-navy">
                Full calendar
                <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          <div className="relative">
            {/* timeline line */}
            <div className="absolute left-[34px] top-2 bottom-2 w-px bg-border" />

            <div className="space-y-3">
              {schedule.map((ev, i) => (
                <div key={i}>
                  <div className="flex gap-4 items-start">
                    {/* time dot */}
                    <div className="relative shrink-0 w-[68px]">
                      <div className="text-xs font-semibold text-foreground tabular-nums">
                        {ev.time}
                      </div>
                      <div className="absolute left-[30px] top-1 h-2.5 w-2.5 rounded-full bg-saffron ring-4 ring-background" />
                    </div>

                    <div className="flex-1 rounded-xl border border-border/70 bg-card p-4 hover:shadow-card transition-shadow">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-foreground">
                              {ev.title}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-[10px] uppercase tracking-wider ${typeStyles[ev.type]}`}
                            >
                              {ev.type}
                            </Badge>
                          </div>
                          <div className="mt-1.5 flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {ev.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {ev.travel}
                            </span>
                          </div>
                        </div>
                        {ev.hasBrief && (
                          <Link to="/briefings-speeches">
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              View Brief
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* travel conflict between 2 and 3 */}
                  {i === 1 && (
                    <div className="ml-[84px] mt-2 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />
                      <span className="text-xs text-amber-800">
                        <span className="font-semibold">Travel conflict:</span> tight 12 min
                        gap, 18 min drive expected.
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Top 3 things to know */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold text-foreground">Top 3 Things to Know</h2>
            <Badge className="bg-navy/10 text-navy border-0 text-[10px]">Overnight</Badge>
          </div>
          {topThree.map((t, i) => {
            const tones = toneMap[t.tone];
            return (
              <Card
                key={i}
                className={`p-4 shadow-soft border ${tones.border} ${tones.bg}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${tones.icon}`}
                  >
                    <t.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge
                      className={`mb-1.5 text-[10px] uppercase tracking-wider border-0 ${tones.tag}`}
                    >
                      {t.tag}
                    </Badge>
                    <div className="text-sm font-semibold text-foreground leading-snug">
                      {t.title}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {t.body}
                    </p>
                    <Link to={t.href}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-7 px-2 text-xs text-navy hover:bg-navy/5"
                      >
                        {t.cta}
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Row 2: Office Pulse */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Office Pulse</h2>
          <span className="text-xs text-muted-foreground">vs. yesterday</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <PulseCard
            icon={Users}
            label="Visitors today"
            value={String(pulse.visitors)}
            trend="+8"
            up
          />
          <PulseCard
            icon={ClipboardList}
            label="Grievances"
            value={`${pulse.grievOpen} / ${pulse.grievClosed}`}
            sub="opened / closed"
            trend="+4"
            up
          />
          <PulseCard
            icon={AlertTriangle}
            label="SLA breaches"
            value={String(pulse.sla)}
            danger
            trend="+1"
            up={false}
          />
          <PulseCard
            icon={FileSignature}
            label="Letters awaiting"
            value={String(pulse.letters)}
            trend="-2"
            up={false}
          />
          <PulseCard
            icon={Contact}
            label="Touchpoints due"
            value={String(pulse.touchpoints)}
            trend="0"
          />
          <PulseCard
            icon={Landmark}
            label="Funds pending"
            value={pulse.funds}
            trend="-₹0.4Cr"
            up={false}
          />
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Relationships */}
        <Card className="p-5 shadow-soft border-border/70">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Relationships to Attend</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Stay top-of-mind with key people today
              </p>
            </div>
            <Link to="/stakeholder-crm">
              <Button variant="ghost" size="sm" className="text-xs h-7 text-navy">
                CRM <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {relationships.map((r, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-border/70 p-3 hover:bg-muted/40 transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-saffron/15 text-saffron shrink-0">
                  <r.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{r.name}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] uppercase tracking-wider border-0 ${
                        r.tier === "Very Important"
                          ? "bg-red-50 text-red-700"
                          : r.tier === "Important"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-navy/10 text-navy"
                      }`}
                    >
                      {r.tier}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.role}</p>
                  <p className="text-xs text-foreground mt-1">{r.reason}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs shrink-0"
                  onClick={() => toast.success(r.cta, { description: r.name })}
                >
                  {r.cta}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Queue */}
        <Card className="p-5 shadow-soft border-border/70">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Action Queue</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {queue.length} item{queue.length === 1 ? "" : "s"} awaiting your approval
              </p>
            </div>
            <Badge className="bg-saffron/15 text-saffron border-0">{queue.length}</Badge>
          </div>
          <div className="space-y-3">
            {queue.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mb-2" />
                <p className="text-sm font-medium text-foreground">All caught up</p>
                <p className="text-xs text-muted-foreground">No approvals pending.</p>
              </div>
            )}
            {queue.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-xl border border-border/70 p-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground">{item.title}</div>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.meta}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {item.type === "approve" ? (
                    <>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Review
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-saffron text-white hover:bg-saffron/90"
                        onClick={() => approve(item.id, item.title)}
                      >
                        Approve
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => approve(item.id, item.title)}
                    >
                      Open
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function PulseCard({
  icon: Icon,
  label,
  value,
  sub,
  trend,
  up,
  danger,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  trend?: string;
  up?: boolean;
  danger?: boolean;
}) {
  return (
    <Card className="p-4 shadow-soft border-border/70">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            danger ? "bg-red-50 text-red-700" : "bg-navy/5 text-navy"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${
              up === undefined
                ? "text-muted-foreground"
                : up
                ? "text-emerald-700"
                : "text-red-700"
            }`}
          >
            {up === true && <ArrowUpRight className="h-3 w-3" />}
            {up === false && <ArrowDownRight className="h-3 w-3" />}
            {trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        <div
          className={`text-xl font-bold tracking-tight tabular-nums ${
            danger ? "text-red-700" : "text-foreground"
          }`}
        >
          {value}
        </div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mt-0.5">
          {label}
        </div>
        {sub && <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>}
      </div>
    </Card>
  );
}
