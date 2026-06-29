import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Phone, Mail, X, FileSignature, MessageSquarePlus, Star, ArrowRightLeft, Calendar, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/officer-directory")({
  head: () => ({ meta: [{ title: "Officer Directory — Citizen Pulse" }] }),
  component: OfficerDirectoryPage,
});

type Officer = {
  id: string; name: string; designation: string; department: string; jurisdiction: string;
  phone: string; email: string; since: string; score: number; pending: number;
  history: { date: string; text: string }[];
  pendingMatters: { id: string; subject: string; days: number }[];
  transfers: { date: string; from: string; to: string }[];
  replacement?: string;
};

const OFFICERS: Officer[] = [
  { id: "O-001", name: "Sri R. Manjunath", designation: "Executive Engineer", department: "BWSSB", jurisdiction: "East Division", phone: "+91 98452 11234", email: "ee.east@bwssb.gov.in", since: "Mar 2024", score: 4, pending: 6,
    history: [{ date: "18 Jun 2026", text: "Reviewed KR Puram drainage estimate; sign-off pending CE." }, { date: "02 Jun 2026", text: "Joint site visit at Hoodi." }],
    pendingMatters: [{ id: "BWSSB/2026/1184", subject: "KR Puram drainage estimate", days: 75 }, { id: "BWSSB/2026/1201", subject: "Hoodi water pressure complaint", days: 22 }],
    transfers: [{ date: "Mar 2024", from: "West Division", to: "East Division" }],
    replacement: "—",
  },
  { id: "O-002", name: "Smt. K. Sharadha, IAS", designation: "Joint Commissioner", department: "BBMP", jurisdiction: "Mahadevapura Zone", phone: "+91 80 2297 5400", email: "jc.east@bbmp.gov.in", since: "Aug 2025", score: 5, pending: 9,
    history: [{ date: "22 Jun 2026", text: "Inspected Whitefield service-road works." }],
    pendingMatters: [{ id: "BBMP/EE/2026/0892", subject: "Whitefield resurfacing tender", days: 55 }, { id: "BBMP/SWD/2026/0210", subject: "Varthur SWD encroachment", days: 86 }],
    transfers: [{ date: "Aug 2025", from: "South Zone", to: "Mahadevapura Zone" }],
  },
  { id: "O-003", name: "Sri Hanumantharayappa", designation: "Superintending Engineer", department: "PWD", jurisdiction: "Bengaluru Urban", phone: "+91 99024 55781", email: "se.bnglr@pwd.kar.gov.in", since: "Jan 2023", score: 3, pending: 4,
    history: [{ date: "12 Apr 2026", text: "Completed joint inspection NH-75 service road." }],
    pendingMatters: [{ id: "PWD/NH/2026/0231", subject: "NH-75 service road KR Puram", days: 103 }],
    transfers: [],
  },
  { id: "O-004", name: "Tahsildar (Bengaluru East)", designation: "Tahsildar", department: "Revenue", jurisdiction: "Bengaluru East Taluk", phone: "+91 80 2536 1144", email: "tah.east@karrev.gov.in", since: "Nov 2025", score: 3, pending: 12,
    history: [{ date: "15 Jun 2026", text: "Survey sketch for PMAY case in preparation." }],
    pendingMatters: [{ id: "REV/EAST/2026/0455", subject: "Khata transfer — Smt. Lakshmi", days: 49 }],
    transfers: [{ date: "Nov 2025", from: "Yelahanka", to: "Bengaluru East" }],
  },
  { id: "O-005", name: "Sri P. Nagaraj", designation: "Executive Engineer", department: "BESCOM", jurisdiction: "Whitefield O&M", phone: "+91 94483 22119", email: "ee.whitefield@bescom.co.in", since: "Jun 2024", score: 4, pending: 3,
    history: [{ date: "18 Jun 2026", text: "Tender floated for Hoodi transformer." }],
    pendingMatters: [{ id: "BESCOM/EE/2026/0341", subject: "Hoodi feeder augmentation", days: 67 }],
    transfers: [],
  },
  { id: "O-006", name: "Sri V. Krishnamurthy", designation: "Sr DCM", department: "Railways (SWR)", jurisdiction: "Bengaluru Division", phone: "+91 80 2287 6500", email: "srdcm.sbc@swr.railnet.gov.in", since: "Sep 2024", score: 2, pending: 5,
    history: [{ date: "10 Jun 2026", text: "Vande Bharat halt proposal forwarded to Board." }],
    pendingMatters: [{ id: "SWR/CPRO/2026/0078", subject: "Vande Bharat halt Whitefield", days: 82 }],
    transfers: [],
  },
  { id: "O-007", name: "DCP (East Division)", designation: "Deputy Commissioner of Police", department: "Police", jurisdiction: "East Division", phone: "+91 80 2294 2400", email: "dcp.east@ksp.gov.in", since: "Apr 2025", score: 4, pending: 7,
    history: [{ date: "20 Jun 2026", text: "Discussed chain-snatching deployment plan." }],
    pendingMatters: [{ id: "POL/DCP-E/2026/0067", subject: "Mahadevapura market traffic", days: 45 }],
    transfers: [{ date: "Apr 2025", from: "North", to: "East" }],
    replacement: "Awaiting orders (rumoured Aug 2026)",
  },
  { id: "O-008", name: "DDPI (Bengaluru South)", designation: "Deputy Director", department: "Education", jurisdiction: "Bengaluru South", phone: "+91 80 2222 1133", email: "ddpi.south@karedu.gov.in", since: "Feb 2024", score: 5, pending: 1,
    history: [{ date: "20 Jun 2026", text: "Sanctioned 2 guest faculty for Govt PU KR Puram." }],
    pendingMatters: [],
    transfers: [],
  },
  { id: "O-009", name: "Deputy Commissioner", designation: "DC, Bengaluru Urban", department: "Revenue", jurisdiction: "Bengaluru Urban District", phone: "+91 80 2222 5703", email: "dc.bnglru@karrev.gov.in", since: "Jul 2025", score: 4, pending: 11,
    history: [{ date: "18 Jun 2026", text: "Chaired DISHA meeting." }],
    pendingMatters: [{ id: "REV/DC/2026/0091", subject: "Multiple khata cases", days: 35 }],
    transfers: [{ date: "Jul 2025", from: "Chitradurga DC", to: "Bengaluru Urban DC" }],
  },
  { id: "O-010", name: "Sri G. Lokesh", designation: "EE, SWD Division", department: "BBMP", jurisdiction: "East Zone SWD", phone: "+91 94823 91100", email: "ee.swd.east@bbmp.gov.in", since: "Dec 2024", score: 3, pending: 5,
    history: [{ date: "20 Jun 2026", text: "Site visit for Varthur encroachment." }],
    pendingMatters: [{ id: "BBMP/SWD/2026/0210", subject: "Varthur SWD encroachment", days: 86 }],
    transfers: [],
  },
  { id: "O-011", name: "JC Health, BBMP East", designation: "Joint Commissioner (Health)", department: "BBMP", jurisdiction: "East Zone Health", phone: "+91 80 2297 5455", email: "jc.health.east@bbmp.gov.in", since: "May 2025", score: 4, pending: 2,
    history: [{ date: "22 Jun 2026", text: "Fogging schedule shared." }],
    pendingMatters: [{ id: "BBMP/HEALTH/2026/0512", subject: "Mosquito fogging Mahadevapura", days: 16 }],
    transfers: [],
  },
  { id: "O-012", name: "Project Director, NHAI", designation: "Project Director", department: "NHAI", jurisdiction: "Bengaluru PIU", phone: "+91 80 2503 7700", email: "pd.bnglr@nhai.gov.in", since: "Oct 2024", score: 2, pending: 4,
    history: [{ date: "24 Jun 2026", text: "Letter received re: KR Puram service road." }],
    pendingMatters: [{ id: "NHAI/2026/045", subject: "KR Puram service road on NH-75", days: 28 }],
    transfers: [],
  },
];

const STAR = ({ n }: { n: number }) => (
  <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} className={`h-3.5 w-3.5 ${i <= n ? "fill-[#FF9933] text-[#FF9933]" : "text-slate-300"}`} />)}</div>
);

function OfficerDirectoryPage() {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");
  const [juris, setJuris] = useState("all");
  const [drawer, setDrawer] = useState<Officer | null>(null);

  const depts = Array.from(new Set(OFFICERS.map(o => o.department)));
  const jurs = Array.from(new Set(OFFICERS.map(o => o.jurisdiction)));

  const filtered = OFFICERS.filter(o =>
    (dept === "all" || o.department === dept) &&
    (juris === "all" || o.jurisdiction === juris) &&
    (!q || o.name.toLowerCase().includes(q.toLowerCase()) || o.designation.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-[#0A1F44]">Officer Directory</h1>
        <p className="text-sm text-muted-foreground">Every official the MP office works with. Transfers tracked, replacements logged.</p>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]"><Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or designation…" className="pl-8" /></div>
          <Select value={dept} onValueChange={setDept}><SelectTrigger className="w-44"><SelectValue placeholder="Department" /></SelectTrigger><SelectContent><SelectItem value="all">All departments</SelectItem>{depts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
          <Select value={juris} onValueChange={setJuris}><SelectTrigger className="w-52"><SelectValue placeholder="Jurisdiction" /></SelectTrigger><SelectContent><SelectItem value="all">All jurisdictions</SelectItem>{jurs.map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}</SelectContent></Select>
          <Badge variant="outline">{filtered.length} officers</Badge>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(o => (
          <Card key={o.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setDrawer(o)}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-[#0A1F44]">{o.name}</div>
                  <div className="text-xs text-slate-600">{o.designation}</div>
                </div>
                {o.pending > 0 && <Badge className="bg-[#FF9933]/15 text-[#FF9933] hover:bg-[#FF9933]/15">{o.pending} pending</Badge>}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Badge variant="outline" className="gap-1"><Building2 className="h-3 w-3" />{o.department}</Badge>
                <span className="text-slate-500">{o.jurisdiction}</span>
              </div>
              <div className="text-xs text-slate-600 flex flex-col gap-1">
                <div className="flex items-center gap-2"><Phone className="h-3 w-3" />{o.phone}</div>
                <div className="flex items-center gap-2 truncate"><Mail className="h-3 w-3" />{o.email}</div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-[10px] uppercase text-slate-500">Since {o.since}</span>
                <STAR n={o.score} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Sheet open={!!drawer} onOpenChange={(o) => !o && setDrawer(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {drawer && (
            <>
              <SheetHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <SheetTitle className="text-[#0A1F44]">{drawer.name}</SheetTitle>
                    <div className="text-sm text-slate-600">{drawer.designation} · {drawer.department}</div>
                    <div className="text-xs text-slate-500">{drawer.jurisdiction}</div>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => setDrawer(null)}><X className="h-4 w-4" /></Button>
                </div>
                <div className="flex gap-3 mt-2 items-center"><STAR n={drawer.score} /><span className="text-xs text-slate-500">Responsiveness</span></div>
              </SheetHeader>

              <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" />{drawer.phone}</div>
                <div className="flex items-center gap-2 truncate"><Mail className="h-4 w-4 text-slate-400" />{drawer.email}</div>
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" />In post since {drawer.since}</div>
                <div className="flex items-center gap-2"><ArrowRightLeft className="h-4 w-4 text-slate-400" />Replacement: {drawer.replacement || "—"}</div>
              </div>

              <div className="mt-5">
                <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Pending files & matters ({drawer.pendingMatters.length})</div>
                <div className="space-y-2">
                  {drawer.pendingMatters.map(p => (
                    <div key={p.id} className="border rounded-md p-2 bg-slate-50">
                      <div className="text-xs font-mono text-slate-500">{p.id}</div>
                      <div className="text-sm font-medium text-[#0A1F44]">{p.subject}</div>
                      <div className="text-xs text-red-600">Open {p.days} days</div>
                    </div>
                  ))}
                  {drawer.pendingMatters.length === 0 && <div className="text-xs text-muted-foreground italic">None</div>}
                </div>
              </div>

              <div className="mt-5">
                <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Interaction history</div>
                <div className="space-y-2">
                  {drawer.history.map((h, i) => (
                    <div key={i} className="text-xs bg-slate-50 border-l-2 border-[#FF9933] px-3 py-2 rounded-r">
                      <div className="text-slate-800">{h.text}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{h.date}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Transfer history</div>
                {drawer.transfers.length === 0 && <div className="text-xs text-muted-foreground italic">No transfers logged</div>}
                {drawer.transfers.map((t, i) => (
                  <div key={i} className="text-xs flex items-center gap-2 py-1">
                    <Badge variant="outline">{t.date}</Badge>
                    <span>{t.from}</span><ArrowRightLeft className="h-3 w-3" /><span className="font-medium">{t.to}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5"><div className="text-xs font-semibold text-slate-700 mb-1">Log interaction</div><Textarea rows={2} placeholder="Met / called / corresponded — short note." /></div>

              <div className="mt-5 pt-4 border-t grid grid-cols-2 gap-2">
                <Button className="bg-[#0A1F44] text-white" onClick={() => toast.success("Interaction logged")}><MessageSquarePlus className="h-4 w-4" /> Log Interaction</Button>
                <Link to="/recommendation-letters"><Button className="bg-[#FF9933] text-white w-full"><FileSignature className="h-4 w-4" /> Generate Letter</Button></Link>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
