import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Landmark, IndianRupee, CheckCircle2, Loader2, AlertTriangle, MapPin,
  Download, Image as ImageIcon, Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend,
  LineChart, Line, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/funds-projects")({
  head: () => ({ meta: [{ title: "Funds & Projects — MP Pulse" }] }),
  component: FundsPage,
});

const STATS = [
  { label: "Total Sanctioned", val: "₹17.5 Cr", icon: IndianRupee, color: "text-[#0A1F44]" },
  { label: "Spent", val: "₹11.2 Cr", icon: CheckCircle2, color: "text-green-600" },
  { label: "Pending Utilisation", val: "₹6.3 Cr", icon: AlertTriangle, color: "text-amber-600" },
  { label: "Completed", val: "38", icon: CheckCircle2, color: "text-[#0A1F44]" },
  { label: "Ongoing", val: "14", icon: Loader2, color: "text-blue-600" },
];

const AREA_DATA = [
  { area: "Whitefield", sanctioned: 420, spent: 310 },
  { area: "KR Puram", sanctioned: 380, spent: 240 },
  { area: "Mahadevapura", sanctioned: 360, spent: 210 },
  { area: "Marathahalli", sanctioned: 300, spent: 180 },
  { area: "Bellandur", sanctioned: 290, spent: 180 },
];

const SPEND_TS = [
  { m: "Jul", v: 80 }, { m: "Aug", v: 175 }, { m: "Sep", v: 260 }, { m: "Oct", v: 380 },
  { m: "Nov", v: 480 }, { m: "Dec", v: 590 }, { m: "Jan", v: 700 }, { m: "Feb", v: 830 },
  { m: "Mar", v: 920 }, { m: "Apr", v: 990 }, { m: "May", v: 1060 }, { m: "Jun", v: 1120 },
];

type Status = "Completed" | "Ongoing" | "Delayed";
type Project = {
  id: string; name: string; location: string; sanctioned: string; spent: string;
  status: Status; beneficiaries: string; pct: number; desc: string;
  milestones: { date: string; label: string; done: boolean }[];
  breakdown: { head: string; amt: string }[];
};

const PROJECTS: Project[] = [
  { id: "p1", name: "Borewell & water tank — KR Puram Ward 84", location: "KR Puram", sanctioned: "₹38 L", spent: "₹38 L", status: "Completed", beneficiaries: "2,400 households", pct: 100, desc: "Construction of 60-ft borewell and 25,000-litre overhead water tank to address summer water scarcity in Ward 84.", milestones: [{ date: "Aug 2025", label: "Sanction", done: true }, { date: "Oct 2025", label: "Tender awarded", done: true }, { date: "Mar 2026", label: "Construction complete", done: true }, { date: "Apr 2026", label: "Commissioned", done: true }], breakdown: [{ head: "Civil work", amt: "₹22 L" }, { head: "Equipment", amt: "₹12 L" }, { head: "Connection", amt: "₹4 L" }] },
  { id: "p2", name: "Park renovation — Whitefield", location: "Whitefield", sanctioned: "₹62 L", spent: "₹44 L", status: "Ongoing", beneficiaries: "8,500 residents", pct: 71, desc: "Renovation of 3-acre community park with walking paths, children's play area, and rainwater harvesting.", milestones: [{ date: "Dec 2025", label: "Sanction", done: true }, { date: "Feb 2026", label: "Civil work", done: true }, { date: "Jun 2026", label: "Landscaping", done: false }, { date: "Aug 2026", label: "Inauguration", done: false }], breakdown: [{ head: "Civil", amt: "₹30 L" }, { head: "Play equipment", amt: "₹14 L" }, { head: "Landscaping", amt: "₹18 L" }] },
  { id: "p3", name: "Street lighting LED retrofit — Marathahalli", location: "Marathahalli", sanctioned: "₹48 L", spent: "₹48 L", status: "Completed", beneficiaries: "12,000 residents", pct: 100, desc: "Retrofit of 1,200 sodium-vapour street lights with LED fittings across 14 km road network.", milestones: [{ date: "Jun 2025", label: "Sanction", done: true }, { date: "Sep 2025", label: "Procurement", done: true }, { date: "Jan 2026", label: "Installation complete", done: true }], breakdown: [{ head: "LED units", amt: "₹32 L" }, { head: "Installation", amt: "₹12 L" }, { head: "Maintenance contract", amt: "₹4 L" }] },
  { id: "p4", name: "Storm-water drain — Bellandur", location: "Bellandur", sanctioned: "₹1.2 Cr", spent: "₹38 L", status: "Delayed", beneficiaries: "18,000 residents", pct: 32, desc: "Construction of 2.1 km storm-water drain to address recurring flooding in low-lying areas.", milestones: [{ date: "Apr 2025", label: "Sanction", done: true }, { date: "Jul 2025", label: "Tender", done: true }, { date: "Dec 2025", label: "Phase 1 (delayed 90 days)", done: false }, { date: "Mar 2026", label: "Phase 2", done: false }], breakdown: [{ head: "Civil", amt: "₹90 L" }, { head: "Land acquisition", amt: "₹22 L" }, { head: "Contingency", amt: "₹8 L" }] },
  { id: "p5", name: "Govt school computer lab — Mahadevapura", location: "Mahadevapura", sanctioned: "₹28 L", spent: "₹26 L", status: "Completed", beneficiaries: "640 students", pct: 100, desc: "Setup of 40-seat computer lab with networking and 2-year service contract.", milestones: [{ date: "Aug 2025", label: "Sanction", done: true }, { date: "Nov 2025", label: "Setup complete", done: true }, { date: "Dec 2025", label: "Inauguration", done: true }], breakdown: [{ head: "Hardware", amt: "₹18 L" }, { head: "Networking", amt: "₹4 L" }, { head: "Service", amt: "₹4 L" }] },
  { id: "p6", name: "Bus shelters (12) — IT corridor", location: "Whitefield", sanctioned: "₹42 L", spent: "₹28 L", status: "Ongoing", beneficiaries: "Daily 14,000 commuters", pct: 67, desc: "Construction of 12 modern bus shelters with seating, lighting, and digital information displays.", milestones: [{ date: "Jan 2026", label: "Sanction", done: true }, { date: "Mar 2026", label: "8 shelters complete", done: true }, { date: "Jul 2026", label: "Remaining 4", done: false }], breakdown: [{ head: "Structure", amt: "₹22 L" }, { head: "Electrical/Display", amt: "₹12 L" }, { head: "Installation", amt: "₹8 L" }] },
  { id: "p7", name: "Anganwadi upgrade (4 centres) — KR Puram", location: "KR Puram", sanctioned: "₹32 L", spent: "₹32 L", status: "Completed", beneficiaries: "320 children", pct: 100, desc: "Upgrade of 4 anganwadi centres with toilets, kitchen, and learning material.", milestones: [{ date: "Sep 2025", label: "Sanction", done: true }, { date: "Feb 2026", label: "All 4 complete", done: true }], breakdown: [{ head: "Civil", amt: "₹20 L" }, { head: "Equipment", amt: "₹8 L" }, { head: "Material", amt: "₹4 L" }] },
  { id: "p8", name: "Skill development centre — Hoodi", location: "Hoodi", sanctioned: "₹85 L", spent: "₹18 L", status: "Delayed", beneficiaries: "Est. 800/year", pct: 21, desc: "Setup of skill development centre for IT-adjacent vocational training in partnership with industry.", milestones: [{ date: "Feb 2026", label: "Sanction", done: true }, { date: "Apr 2026", label: "Site acquisition (delayed)", done: false }, { date: "Jul 2026", label: "Construction", done: false }], breakdown: [{ head: "Civil", amt: "₹55 L" }, { head: "Equipment", amt: "₹22 L" }, { head: "Operations Y1", amt: "₹8 L" }] },
  { id: "p9", name: "PHC equipment — Mahadevapura", location: "Mahadevapura", sanctioned: "₹35 L", spent: "₹35 L", status: "Completed", beneficiaries: "35,000 catchment", pct: 100, desc: "Procurement of diagnostic equipment for primary health centre.", milestones: [{ date: "Oct 2025", label: "Sanction", done: true }, { date: "Jan 2026", label: "Equipment delivered", done: true }], breakdown: [{ head: "Diagnostic", amt: "₹26 L" }, { head: "Furniture", amt: "₹5 L" }, { head: "Misc", amt: "₹4 L" }] },
  { id: "p10", name: "Road resurfacing — Varthur Main Road", location: "Varthur", sanctioned: "₹95 L", spent: "₹62 L", status: "Ongoing", beneficiaries: "Daily 22,000 vehicles", pct: 65, desc: "Resurfacing of 4.2 km of Varthur Main Road including drains and signage.", milestones: [{ date: "Dec 2025", label: "Sanction", done: true }, { date: "Mar 2026", label: "Phase 1 complete", done: true }, { date: "Jul 2026", label: "Phase 2", done: false }], breakdown: [{ head: "Bitumen", amt: "₹60 L" }, { head: "Drains", amt: "₹22 L" }, { head: "Signage", amt: "₹13 L" }] },
  { id: "p11", name: "Lake fencing & path — Bellandur Kere", location: "Bellandur", sanctioned: "₹72 L", spent: "₹14 L", status: "Delayed", beneficiaries: "Local + walkers", pct: 19, desc: "Perimeter fencing and walking path around Bellandur Lake (Phase 1).", milestones: [{ date: "Jan 2026", label: "Sanction", done: true }, { date: "Apr 2026", label: "Clearance (pending NGT)", done: false }], breakdown: [{ head: "Fencing", amt: "₹40 L" }, { head: "Path", amt: "₹24 L" }, { head: "Lighting", amt: "₹8 L" }] },
  { id: "p12", name: "Women's safety — CCTV at junctions", location: "Marathahalli", sanctioned: "₹52 L", spent: "₹40 L", status: "Ongoing", beneficiaries: "Constituency-wide", pct: 77, desc: "Installation of 48 CCTV cameras at high-footfall junctions, integrated with city command centre.", milestones: [{ date: "Nov 2025", label: "Sanction", done: true }, { date: "Mar 2026", label: "32 cameras live", done: true }, { date: "Jul 2026", label: "Remaining 16", done: false }], breakdown: [{ head: "Cameras", amt: "₹32 L" }, { head: "Network", amt: "₹14 L" }, { head: "Integration", amt: "₹6 L" }] },
];

const STATUS_BADGE: Record<Status, string> = {
  Completed: "bg-green-100 text-green-700 border-green-200",
  Ongoing: "bg-blue-100 text-blue-700 border-blue-200",
  Delayed: "bg-red-100 text-red-700 border-red-200",
};

function FundsPage() {
  const [active, setActive] = useState<Project | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1F44]">Funds & Projects (MPLADS)</h1>
          <p className="text-slate-500 mt-1">Sanction, utilisation, and delivery tracker</p>
        </div>
        <Button onClick={() => setSummaryOpen(true)} className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white">
          <Sparkles className="w-4 h-4 mr-1.5" /> Generate Work-Done Summary
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {STATS.map(s => (
          <Card key={s.label} className="border-slate-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-xl font-bold text-[#0A1F44] mt-1">{s.val}</p>
              </div>
              <s.icon className={`w-8 h-8 ${s.color} opacity-70`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-l-4 border-l-amber-500 border-slate-200 bg-amber-50/40">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#0A1F44] text-sm">Under-utilisation Alert</p>
              <p className="text-sm text-slate-700 mt-0.5">₹6.3 Cr unspent with 4 months to deadline. Push approvals on KR Puram & Whitefield project pipeline.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500 border-slate-200 bg-red-50/40">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#0A1F44] text-sm">Delivery Risk</p>
              <p className="text-sm text-slate-700 mt-0.5">3 projects delayed &gt; 60 days: Bellandur drain, Hoodi skill centre, Bellandur lake.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200">
          <CardHeader><CardTitle className="text-[#0A1F44] text-base">Utilisation by Area (₹ Lakhs)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={AREA_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="area" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="sanctioned" fill="#0A1F44" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" fill="#FF9933" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader><CardTitle className="text-[#0A1F44] text-base">Cumulative Spend (₹ Lakhs)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={SPEND_TS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="m" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="v" stroke="#FF9933" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Projects table */}
      <Card className="border-slate-200">
        <CardHeader><CardTitle className="text-[#0A1F44] text-base">Project Pipeline</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="text-left p-3">Project</th>
                <th className="text-left p-3">Location</th>
                <th className="text-right p-3">Sanctioned</th>
                <th className="text-right p-3">Spent</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Beneficiaries</th>
                <th className="text-left p-3 w-40">Completion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PROJECTS.map(p => (
                <tr key={p.id} onClick={() => setActive(p)}
                  className={`cursor-pointer hover:bg-slate-50 ${p.status === "Delayed" ? "bg-red-50/40" : ""}`}>
                  <td className="p-3 font-medium text-[#0A1F44]">{p.name}</td>
                  <td className="p-3 text-slate-600">{p.location}</td>
                  <td className="p-3 text-right tabular-nums text-slate-700">{p.sanctioned}</td>
                  <td className="p-3 text-right tabular-nums text-slate-700">{p.spent}</td>
                  <td className="p-3"><Badge variant="outline" className={STATUS_BADGE[p.status]}>{p.status}</Badge></td>
                  <td className="p-3 text-xs text-slate-600">{p.beneficiaries}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className={`h-full ${p.status === "Delayed" ? "bg-red-500" : p.status === "Completed" ? "bg-green-500" : "bg-[#FF9933]"}`} style={{ width: `${p.pct}%` }} />
                      </div>
                      <span className="text-xs text-slate-500 tabular-nums w-9">{p.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Detail drawer */}
      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {active && (
            <>
              <SheetHeader><SheetTitle className="text-[#0A1F44]">{active.name}</SheetTitle></SheetHeader>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className={STATUS_BADGE[active.status]}>{active.status}</Badge>
                <span className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {active.location}</span>
              </div>

              <p className="text-sm text-slate-700 mt-4">{active.desc}</p>

              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-500 uppercase">Sanctioned</p>
                  <p className="text-sm font-bold text-[#0A1F44]">{active.sanctioned}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-500 uppercase">Spent</p>
                  <p className="text-sm font-bold text-[#FF9933]">{active.spent}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-500 uppercase">Progress</p>
                  <p className="text-sm font-bold text-[#0A1F44]">{active.pct}%</p>
                </div>
              </div>

              <div className="mt-5">
                <h4 className="text-xs uppercase tracking-wide text-[#FF9933] font-semibold mb-2">Site Photos</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="aspect-video rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <h4 className="text-xs uppercase tracking-wide text-[#FF9933] font-semibold mb-3">Milestones</h4>
                <div className="relative pl-5 space-y-3 border-l-2 border-slate-200">
                  {active.milestones.map((m, i) => (
                    <div key={i} className="relative">
                      <span className={`absolute -left-[26px] top-1 w-3 h-3 rounded-full border-2 border-white ${m.done ? "bg-green-500" : "bg-slate-300"}`} />
                      <p className="text-xs text-slate-400">{m.date}</p>
                      <p className={`text-sm ${m.done ? "text-slate-700" : "text-slate-500"}`}>{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <h4 className="text-xs uppercase tracking-wide text-[#FF9933] font-semibold mb-2">Fund Breakdown</h4>
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-slate-100">
                    {active.breakdown.map((b, i) => (
                      <tr key={i}><td className="py-2 text-slate-600">{b.head}</td><td className="py-2 text-right font-medium text-[#0A1F44]">{b.amt}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Summary dialog */}
      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-[#0A1F44]">Work-Done Summary · Area-wise</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {AREA_DATA.map(a => (
              <Card key={a.area} className="border-l-4 border-l-[#FF9933] border-slate-200">
                <CardContent className="p-4">
                  <p className="font-semibold text-[#0A1F44]">{a.area}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Sanctioned ₹{(a.sanctioned / 100).toFixed(2)} Cr · Spent ₹{(a.spent / 100).toFixed(2)} Cr</p>
                  <ul className="mt-3 space-y-1 text-xs text-slate-700">
                    {PROJECTS.filter(p => p.location === a.area || (a.area === "Whitefield" && p.location === "Hoodi") || (a.area === "Marathahalli" && p.location === "Varthur")).slice(0, 3).map(p => (
                      <li key={p.id} className="flex gap-2"><span className="text-[#FF9933]">•</span>{p.name} — {p.status}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button className="mt-3 bg-[#0A1F44] hover:bg-[#0A1F44]/90"><Download className="w-4 h-4 mr-1.5" /> Export as PDF</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
