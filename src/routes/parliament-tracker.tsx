import { createFileRoute } from "@tanstack/react-router";
import { Building2, MessageSquare, FileText, Mic, Sparkles, Calendar, Droplets, Cpu, Trees } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/parliament-tracker")({
  head: () => ({ meta: [{ title: "Parliament Tracker — MP Pulse" }] }),
  component: ParliamentPage,
});

const STATS = [
  { label: "Attendance", val: "89%", icon: Calendar, sub: "Lok Sabha · this session" },
  { label: "Questions Asked", val: "47", icon: MessageSquare, sub: "Starred 12 · Unstarred 35" },
  { label: "Debates Participated", val: "23", icon: Mic, sub: "Across 14 sittings" },
  { label: "Private Member Bills", val: "2", icon: FileText, sub: "1 listed · 1 drafted" },
];

const TODAY_HOUSE = [
  { time: "11:00", title: "Question Hour — Urban Development", note: "Your starred Q listed at S.No. 14" },
  { time: "12:00", title: "Papers to be Laid", note: "Ministry of Jal Shakti report" },
  { time: "14:00", title: "Discussion: Water Resources Bill, 2026", note: "Speaking list open · key for your signature issue" },
  { time: "15:00", title: "Standing Committee on Urban Affairs", note: "Committee Room 62 · in person" },
  { time: "17:00", title: "Private Members' Business", note: "5 bills listed (you are not listed today)" },
];

type ActivityType = "Question" | "Bill" | "Debate";
type Status = "Listed" | "Answered" | "Pending" | "Replied";

const ACTIVITY: { title: string; type: ActivityType; date: string; status: Status; topic: string }[] = [
  { title: "Cauvery Stage-V tap connection rollout in Bengaluru East", type: "Question", date: "26 Jun 2026", status: "Listed", topic: "Urban Water" },
  { title: "Discussion on Whitefield monsoon flooding (Zero Hour)", type: "Debate", date: "24 Jun 2026", status: "Replied", topic: "Urban Water" },
  { title: "Urban Local Bodies (Lake Conservation) Bill, 2026", type: "Bill", date: "18 Jun 2026", status: "Listed", topic: "Lake Rejuvenation" },
  { title: "Last-mile public transport in IT corridors", type: "Question", date: "12 Jun 2026", status: "Answered", topic: "IT Corridor Infrastructure" },
  { title: "Women safety CCTV mandate at tech parks", type: "Question", date: "08 Jun 2026", status: "Answered", topic: "IT Corridor Infrastructure" },
  { title: "Bellandur lake — NGT compliance status", type: "Question", date: "04 Jun 2026", status: "Answered", topic: "Lake Rejuvenation" },
  { title: "Metro Phase-3 funding for Bengaluru East", type: "Debate", date: "29 May 2026", status: "Replied", topic: "IT Corridor Infrastructure" },
  { title: "Smart Cities Mission — Bengaluru utilisation", type: "Question", date: "22 May 2026", status: "Answered", topic: "Urban Water" },
  { title: "Citizen Grievance Redressal Standards Bill, 2026", type: "Bill", date: "14 May 2026", status: "Pending", topic: "Governance" },
  { title: "Cauvery water sharing — recent SC observations", type: "Debate", date: "07 May 2026", status: "Replied", topic: "Urban Water" },
];

const SESSIONS = [
  { s: "Budget '25", v: 28 },
  { s: "Monsoon '25", v: 34 },
  { s: "Winter '25", v: 22 },
  { s: "Budget '26", v: 41 },
  { s: "Monsoon '26", v: 47 },
];

const SIGNATURE = [
  { name: "Urban Water", count: 18, icon: Droplets, color: "text-blue-600" },
  { name: "IT Corridor Infrastructure", count: 12, icon: Cpu, color: "text-[#0A1F44]" },
  { name: "Lake Rejuvenation", count: 9, icon: Trees, color: "text-green-600" },
];

const STATUS_BADGE: Record<Status, string> = {
  Listed: "bg-blue-100 text-blue-700 border-blue-200",
  Answered: "bg-green-100 text-green-700 border-green-200",
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Replied: "bg-slate-100 text-slate-700 border-slate-200",
};

const TYPE_BADGE: Record<ActivityType, string> = {
  Question: "bg-[#0A1F44]/10 text-[#0A1F44] border-[#0A1F44]/20",
  Bill: "bg-[#FF9933]/10 text-[#FF9933] border-[#FF9933]/30",
  Debate: "bg-purple-100 text-purple-700 border-purple-200",
};

function ParliamentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="w-8 h-8 text-[#FF9933]" />
        <div>
          <h1 className="text-3xl font-bold text-[#0A1F44]">Parliament Tracker</h1>
          <p className="text-slate-500 mt-0.5">17th Lok Sabha · Monsoon Session 2026</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(s => (
          <Card key={s.label} className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">{s.label}</p>
                <s.icon className="w-5 h-5 text-[#FF9933] opacity-80" />
              </div>
              <p className="text-2xl font-bold text-[#0A1F44] mt-1">{s.val}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today in the House */}
        <Card className="border-slate-200 lg:col-span-2">
          <CardHeader><CardTitle className="text-[#0A1F44] text-base">Today in the House — 26 June 2026</CardTitle></CardHeader>
          <CardContent className="p-0 divide-y divide-slate-100">
            {TODAY_HOUSE.map((it, i) => (
              <div key={i} className="p-3 flex items-start gap-4 hover:bg-slate-50">
                <div className="text-sm font-semibold text-[#FF9933] tabular-nums w-14 shrink-0">{it.time}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0A1F44]">{it.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{it.note}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Nudge + Signature */}
        <div className="space-y-4">
          <Card className="border-l-4 border-l-[#FF9933] border-slate-200 bg-[#FF9933]/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-[#FF9933] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#0A1F44] text-sm">Speaking Opportunity</p>
                  <p className="text-sm text-slate-700 mt-1">You have spoken <span className="font-semibold">0 times</span> this session on your signature issue: <span className="font-semibold">Urban Water</span>.</p>
                  <p className="text-xs text-slate-600 mt-2">Next opportunity: <span className="font-semibold">Water Resources Bill, today 2 PM.</span></p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader><CardTitle className="text-[#0A1F44] text-base">Signature Issues</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {SIGNATURE.map(s => (
                <div key={s.name} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                    <p className="text-sm font-medium text-[#0A1F44]">{s.name}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#FF9933] tabular-nums">{s.count}<span className="text-[10px] font-normal text-slate-500 ml-0.5">raised</span></p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity Table */}
      <Card className="border-slate-200">
        <CardHeader><CardTitle className="text-[#0A1F44] text-base">My Activity — Questions, Bills & Debates</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Topic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ACTIVITY.map((a, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-3 font-medium text-[#0A1F44]">{a.title}</td>
                  <td className="p-3"><Badge variant="outline" className={TYPE_BADGE[a.type]}>{a.type}</Badge></td>
                  <td className="p-3 text-slate-600 text-xs">{a.date}</td>
                  <td className="p-3"><Badge variant="outline" className={STATUS_BADGE[a.status]}>{a.status}</Badge></td>
                  <td className="p-3 text-xs text-slate-600">{a.topic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Participation chart */}
      <Card className="border-slate-200">
        <CardHeader><CardTitle className="text-[#0A1F44] text-base">Interventions by Session</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={SESSIONS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="s" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="v" fill="#FF9933" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
