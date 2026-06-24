import { createFileRoute } from "@tanstack/react-router";
import {
  Download,
  CalendarClock,
  FileText,
  TrendingUp,
  TrendingDown,
  Smile,
  Megaphone,
  Target,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — MP Pulse" },
      {
        name: "description",
        content:
          "Weekly Intelligence Report — a premium, shareable briefing for the MP's office.",
      },
    ],
  }),
  component: ReportsPage,
});

const reachWeeks = [
  { label: "W-3", value: 1.6 },
  { label: "W-2", value: 1.9 },
  { label: "W-1", value: 2.1 },
  { label: "This week", value: 2.4 },
];

const sentimentSplit = [
  { label: "Positive", value: 68, color: "bg-emerald-500" },
  { label: "Neutral", value: 22, color: "bg-slate-400" },
  { label: "Negative", value: 10, color: "bg-rose-500" },
];

const topIssues = [
  { name: "Mahadevapura Stormwater Drains", mentions: "8.4K", trend: "+22%", tone: "neg" as const },
  { name: "Namma Metro Phase 3", mentions: "6.1K", trend: "+38%", tone: "pos" as const },
  { name: "Cauvery Water Supply", mentions: "5.7K", trend: "+14%", tone: "neg" as const },
  { name: "Lake Rejuvenation", mentions: "3.2K", trend: "+12%", tone: "pos" as const },
  { name: "Power Tariff Hike", mentions: "2.9K", trend: "+19%", tone: "neg" as const },
];

const actions = [
  {
    action: "ENGAGE",
    text: "Visit Mahadevapura with BBMP engineers; publish 12-month drain restoration timeline.",
  },
  {
    action: "AMPLIFY",
    text: "Lead celebratory framing on Namma Metro Phase 3 in constituency languages.",
  },
  {
    action: "ENGAGE",
    text: "Convene citizens' roundtable on Bellandur–Varthur lake revival — first-mover whitespace.",
  },
  {
    action: "AVOID",
    text: "Hold position on Local Hiring Bill until Nasscom consultation outcomes are clearer.",
  },
];

function ReportsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Premium briefings tailored for the MP's office. Auto-generated, manually editable.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <CalendarClock className="h-4 w-4" />
            Schedule Report
          </Button>
          <Button className="gap-2 bg-saffron text-saffron-foreground hover:bg-saffron/90">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Report document */}
      <Card className="overflow-hidden border-border/60 shadow-sm">
        {/* Header band */}
        <div className="relative overflow-hidden bg-gradient-to-br from-navy via-navy to-[#152d5e] p-8 text-white">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-saffron/15 to-transparent" />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-saffron">
                <FileText className="h-3.5 w-3.5" />
                Weekly Intelligence Report
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Hon'ble MP — Bengaluru
              </h2>
              <p className="mt-1 text-sm text-white/70">
                Reporting week: 16 – 22 June 2026 · Prepared by MP Pulse Intelligence
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <Badge className="bg-saffron text-saffron-foreground hover:bg-saffron">
                Confidential · Internal
              </Badge>
              <div className="text-[11px] text-white/60">Report ID · MPP-2026-W25</div>
            </div>
          </div>
          <div className="relative mt-6 grid grid-cols-4 gap-4">
            {[
              { l: "Reach", v: "2.4M", d: "+12%" },
              { l: "Follower Growth", v: "+18.3K", d: "this week" },
              { l: "Engagement", v: "4.8%", d: "+0.3 pts" },
              { l: "Sentiment", v: "68%", d: "positive" },
            ].map((k) => (
              <div key={k.l} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                <div className="text-[10px] uppercase tracking-wider text-white/60">{k.l}</div>
                <div className="mt-1 text-xl font-semibold tabular-nums">{k.v}</div>
                <div className="text-[11px] text-white/60">{k.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="divide-y divide-border">
          {/* Executive Summary */}
          <Section title="01 · Executive Summary">
            <p className="text-sm leading-relaxed text-foreground">
              A net-positive week. Constituency reach grew{" "}
              <span className="font-semibold text-navy">12%</span> on the back of the Namma Metro
              Phase 3 cabinet approval and BBMP's ₹240 cr stormwater drain announcement for
              Mahadevapura. Overall sentiment held steady at{" "}
              <span className="font-semibold text-emerald-700">68% positive</span>, but a
              sharp negative spike around <em>#BengaluruTraffic</em> (-14% in 24h) requires
              attention. Whitespace opportunity confirmed on lake rejuvenation — no peer MP has
              claimed this agenda yet.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {[
                { k: "Top win", v: "Namma Metro Phase 3 framing", tone: "pos" },
                { k: "Top risk", v: "Traffic & potholes backlash", tone: "neg" },
                { k: "Top opportunity", v: "Lake revival leadership", tone: "neu" },
              ].map((s) => (
                <div key={s.k} className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.k}</div>
                  <div className="mt-1 text-sm font-medium text-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* Reach & Growth */}
          <Section title="02 · Reach & Growth" icon={TrendingUp}>
            <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex h-32 items-end gap-3">
                  {reachWeeks.map((w, i) => {
                    const max = Math.max(...reachWeeks.map((x) => x.value));
                    const h = (w.value / max) * 100;
                    const last = i === reachWeeks.length - 1;
                    return (
                      <div key={w.label} className="flex flex-1 flex-col items-center gap-2">
                        <div className="w-full overflow-hidden rounded-t-md bg-muted">
                          <div
                            className={`w-full rounded-t-md ${last ? "bg-saffron" : "bg-navy/70"}`}
                            style={{ height: `${h * 1.1}px` }}
                          />
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {w.label}
                        </div>
                        <div className="text-xs font-semibold text-foreground tabular-nums">
                          {w.value}M
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4 text-xs">
                <div className="font-semibold text-foreground">+18.3K followers</div>
                <div className="mt-1 text-muted-foreground">across X, Instagram, Facebook</div>
                <div className="mt-3 font-semibold text-emerald-700">+14% vs prior week</div>
                <div className="mt-1 text-muted-foreground">Driven by Metro coverage</div>
              </div>
            </div>
          </Section>

          {/* Sentiment Highlights */}
          <Section title="03 · Sentiment Highlights" icon={Smile}>
            <div className="flex h-3 w-full overflow-hidden rounded-full">
              {sentimentSplit.map((s) => (
                <div key={s.label} className={s.color} style={{ width: `${s.value}%` }} />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-xs">
              {sentimentSplit.map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${s.color}`} />
                  <span className="font-medium text-foreground">{s.label}</span>
                  <span className="text-muted-foreground tabular-nums">{s.value}%</span>
                </div>
              ))}
            </div>
            <ul className="mt-4 space-y-2 text-sm text-foreground">
              <li className="flex gap-2">
                <span className="text-emerald-600">▲</span>
                Strongest positive driver: Namma Metro Phase 3 (62% positive of 18.9K mentions).
              </li>
              <li className="flex gap-2">
                <span className="text-rose-600">▼</span>
                Sharpest negative spike: <em>#BengaluruTraffic</em> — sentiment dropped 14% in 24h
                following Outer Ring Road gridlock on Tuesday.
              </li>
              <li className="flex gap-2">
                <span className="text-saffron">●</span>
                Bot/troll comments flagged at 8.4% — within normal range, one cluster under review.
              </li>
            </ul>
          </Section>

          {/* Top Issues */}
          <Section title="04 · Top Issues" icon={Megaphone}>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 text-left">Issue</th>
                    <th className="px-4 py-2 text-left">Mentions</th>
                    <th className="px-4 py-2 text-left">7d trend</th>
                    <th className="px-4 py-2 text-left">Tone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topIssues.map((it) => (
                    <tr key={it.name}>
                      <td className="px-4 py-2.5 font-medium text-foreground">{it.name}</td>
                      <td className="px-4 py-2.5 text-muted-foreground tabular-nums">{it.mentions}</td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center gap-1 text-emerald-600">
                          <TrendingUp className="h-3 w-3" />
                          {it.trend}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        {it.tone === "pos" ? (
                          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                            Positive
                          </span>
                        ) : it.tone === "neg" ? (
                          <span className="rounded-md bg-rose-50 px-2 py-0.5 text-xs text-rose-700">
                            Negative
                          </span>
                        ) : (
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                            Neutral
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Recommended Actions */}
          <Section title="05 · Recommended Actions" icon={Target}>
            <div className="space-y-2">
              {actions.map((a, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card p-3"
                >
                  <span
                    className={`mt-0.5 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      a.action === "ENGAGE"
                        ? "bg-saffron text-saffron-foreground"
                        : a.action === "AMPLIFY"
                          ? "bg-emerald-600 text-white"
                          : "bg-rose-600 text-white"
                    }`}
                  >
                    {a.action}
                  </span>
                  <p className="text-sm leading-relaxed text-foreground">{a.text}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Footer */}
          <div className="flex items-center justify-between bg-muted/30 px-8 py-5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-saffron text-[10px] font-bold text-saffron-foreground">
                MP
              </div>
              MP Pulse Intelligence · Generated 24 June 2026
            </div>
            <div>Page 1 of 1 · Next report: 1 July 2026</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="px-8 py-7">
      <div className="mb-4 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-saffron" />}
        <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-navy">{title}</h3>
      </div>
      {children}
    </section>
  );
}

// Silence unused import warning for TrendingDown — kept available for future deltas.
void TrendingDown;
