import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  FileText, AlertTriangle, CheckCircle2, Search, X, Paperclip,
  ArrowUpRight, Clock, Building2, FileSignature,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/department-files")({
  head: () => ({ meta: [{ title: "Department Files — Citizen Pulse" }] }),
  component: DepartmentFilesPage,
});

type EscLevel = "None" | "L1" | "L2" | "L3";
type FileStatus = "In Progress" | "Awaiting Reply" | "Stuck" | "Closed";

type GovFile = {
  id: string; subject: string; department: string; officer: string;
  submitted: string; lastFu: string; nextFu: string;
  bottleneck: string; escalation: EscLevel; status: FileStatus;
  documents: string[];
  timeline: { date: string; actor: string; text: string; kind: "submit" | "reply" | "escalate" | "follow" }[];
};

const FILES: GovFile[] = [
  { id: "BWSSB/2026/1184", subject: "KR Puram drainage estimate revision", department: "BWSSB", officer: "Sri R. Manjunath (EE, East)", submitted: "12 Apr 2026", lastFu: "18 Jun 2026", nextFu: "01 Jul 2026", bottleneck: "Awaiting Chief Engineer sign-off", escalation: "L2", status: "Stuck", documents: ["Estimate-rev2.pdf", "Site-photos.zip"], timeline: [
    { date: "12 Apr", actor: "MP Office", text: "File submitted with revised estimate of ₹2.4 Cr", kind: "submit" },
    { date: "20 Apr", actor: "EE BWSSB", text: "Returned with query on alignment", kind: "reply" },
    { date: "10 May", actor: "MP Office", text: "Re-submitted with clarification note", kind: "follow" },
    { date: "02 Jun", actor: "MP Office", text: "Escalated to Chief Engineer (L1)", kind: "escalate" },
    { date: "18 Jun", actor: "MP Office", text: "L2 escalation to Chairman, BWSSB", kind: "escalate" },
  ]},
  { id: "BBMP/EE/2026/0892", subject: "Whitefield service-road resurfacing tender", department: "BBMP", officer: "Smt. K. Sharadha (JC, East Zone)", submitted: "02 May 2026", lastFu: "22 Jun 2026", nextFu: "30 Jun 2026", bottleneck: "Technical sanction pending", escalation: "L1", status: "Awaiting Reply", documents: ["Tender-doc.pdf"], timeline: [
    { date: "02 May", actor: "MP Office", text: "Tender file forwarded", kind: "submit" },
    { date: "22 Jun", actor: "MP Office", text: "Reminder sent to JC", kind: "follow" },
  ]},
  { id: "PWD/NH/2026/0231", subject: "Service road on NH-75 KR Puram (NHAI coordination)", department: "PWD", officer: "Sri Hanumantharayappa (SE, PWD)", submitted: "15 Mar 2026", lastFu: "20 Jun 2026", nextFu: "05 Jul 2026", bottleneck: "Inter-dept reference to NHAI pending", escalation: "L2", status: "Stuck", documents: ["Joint-inspection-report.pdf"], timeline: [
    { date: "15 Mar", actor: "MP Office", text: "File initiated for joint inspection", kind: "submit" },
    { date: "12 Apr", actor: "PWD", text: "Joint inspection completed", kind: "reply" },
    { date: "30 May", actor: "MP Office", text: "Escalated — NHAI reference not initiated", kind: "escalate" },
  ]},
  { id: "REV/EAST/2026/0455", subject: "Khata transfer for Smt. Lakshmi N. (PMAY)", department: "Revenue", officer: "Tahsildar, Bengaluru East", submitted: "08 May 2026", lastFu: "15 Jun 2026", nextFu: "28 Jun 2026", bottleneck: "Survey sketch pending", escalation: "L1", status: "In Progress", documents: ["Application.pdf", "ID-proof.pdf"], timeline: [
    { date: "08 May", actor: "MP Office", text: "Application forwarded with MP recommendation", kind: "submit" },
    { date: "15 Jun", actor: "Tahsil", text: "Survey sketch under preparation", kind: "reply" },
  ]},
  { id: "EDU/DDPI/2026/0119", subject: "Guest faculty sanction Govt PU College KR Puram", department: "Education", officer: "DDPI, Bengaluru South", submitted: "12 May 2026", lastFu: "23 Jun 2026", nextFu: "—", bottleneck: "—", escalation: "None", status: "Closed", documents: ["Sanction-order.pdf"], timeline: [
    { date: "12 May", actor: "MP Office", text: "Recommendation letter sent", kind: "submit" },
    { date: "20 Jun", actor: "DDPI", text: "Sanction issued for 2 guest faculty", kind: "reply" },
    { date: "23 Jun", actor: "MP Office", text: "File closed", kind: "follow" },
  ]},
  { id: "SWR/CPRO/2026/0078", subject: "Vande Bharat halt at Whitefield Station", department: "Railways", officer: "Sri V. Krishnamurthy (Sr DCM, SWR)", submitted: "05 Apr 2026", lastFu: "10 Jun 2026", nextFu: "10 Jul 2026", bottleneck: "Awaiting Railway Board decision", escalation: "L3", status: "Stuck", documents: ["Proposal-note.pdf", "Footfall-data.xlsx"], timeline: [
    { date: "05 Apr", actor: "MP Office", text: "Proposal forwarded to SWR HQ", kind: "submit" },
    { date: "01 May", actor: "MP Office", text: "L1 escalation to GM SWR", kind: "escalate" },
    { date: "25 May", actor: "MP Office", text: "L2 escalation to Member Operations", kind: "escalate" },
    { date: "10 Jun", actor: "MP Office", text: "L3 escalation to Hon'ble Minister of Railways", kind: "escalate" },
  ]},
  { id: "BESCOM/EE/2026/0341", subject: "Hoodi feeder load augmentation", department: "BESCOM", officer: "Sri P. Nagaraj (EE)", submitted: "20 Apr 2026", lastFu: "18 Jun 2026", nextFu: "02 Jul 2026", bottleneck: "Transformer procurement pending", escalation: "L1", status: "In Progress", documents: ["Load-survey.pdf"], timeline: [
    { date: "20 Apr", actor: "MP Office", text: "Load augmentation requested", kind: "submit" },
    { date: "18 Jun", actor: "BESCOM", text: "Tender floated for transformer", kind: "reply" },
  ]},
  { id: "BBMP/HEALTH/2026/0512", subject: "Mosquito fogging schedule — Mahadevapura", department: "BBMP", officer: "JC Health, BBMP East", submitted: "10 Jun 2026", lastFu: "22 Jun 2026", nextFu: "29 Jun 2026", bottleneck: "Vehicle availability", escalation: "None", status: "In Progress", documents: [], timeline: [
    { date: "10 Jun", actor: "MP Office", text: "Request forwarded", kind: "submit" },
  ]},
  { id: "BBMP/SWD/2026/0210", subject: "Varthur SWD encroachment removal", department: "BBMP", officer: "EE, SWD Division", submitted: "01 Apr 2026", lastFu: "20 Jun 2026", nextFu: "30 Jun 2026", bottleneck: "Land-records verification at Tahsil", escalation: "L2", status: "Stuck", documents: ["Sketch.pdf"], timeline: [
    { date: "01 Apr", actor: "MP Office", text: "Inspection report submitted", kind: "submit" },
    { date: "15 May", actor: "MP Office", text: "L1 to EE", kind: "escalate" },
    { date: "20 Jun", actor: "MP Office", text: "L2 to Chief Engineer SWD", kind: "escalate" },
  ]},
  { id: "POL/DCP-E/2026/0067", subject: "Traffic deployment near Mahadevapura market", department: "Police", officer: "DCP (Traffic) East", submitted: "12 May 2026", lastFu: "22 Jun 2026", nextFu: "06 Jul 2026", bottleneck: "Manpower shortage", escalation: "L1", status: "Awaiting Reply", documents: [], timeline: [
    { date: "12 May", actor: "MP Office", text: "Letter sent", kind: "submit" },
    { date: "22 Jun", actor: "MP Office", text: "Reminder sent", kind: "follow" },
  ]},
];

const STATUS_COLOR: Record<FileStatus, string> = {
  "In Progress": "bg-blue-100 text-blue-800",
  "Awaiting Reply": "bg-amber-100 text-amber-800",
  "Stuck": "bg-red-100 text-red-800",
  "Closed": "bg-green-100 text-green-800",
};
const ESC_COLOR: Record<EscLevel, string> = {
  "None": "bg-slate-100 text-slate-600",
  "L1": "bg-amber-100 text-amber-800",
  "L2": "bg-orange-100 text-orange-800",
  "L3": "bg-red-100 text-red-700",
};

function StatCard({ icon: Icon, label, value, accent, danger }: any) {
  return (
    <Card className={danger ? "border-red-200" : ""}>
      <CardContent className="p-5"><div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${accent}`}><Icon className="h-5 w-5" /></div>
        <div>
          <div className={`text-2xl font-bold ${danger ? "text-red-600" : "text-[#0A1F44]"}`}>{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </div></CardContent>
    </Card>
  );
}

function DepartmentFilesPage() {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");
  const [status, setStatus] = useState("all");
  const [drawer, setDrawer] = useState<GovFile | null>(null);
  const [files, setFiles] = useState(FILES);

  const filtered = useMemo(() => files.filter(f =>
    (dept === "all" || f.department === dept) &&
    (status === "all" || f.status === status) &&
    (!q || f.subject.toLowerCase().includes(q.toLowerCase()) || f.id.toLowerCase().includes(q.toLowerCase()))
  ), [files, q, dept, status]);

  const bottlenecks = useMemo(() => {
    const m: Record<string, number> = {};
    files.filter(f => f.status === "Stuck" || f.escalation !== "None").forEach(f => { m[f.department] = (m[f.department] || 0) + 1; });
    return Object.entries(m).sort((a,b) => b[1]-a[1]);
  }, [files]);
  const maxB = Math.max(1, ...bottlenecks.map(([,v]) => v));

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-[#0A1F44]">Department Files</h1>
        <p className="text-sm text-muted-foreground">Every file the MP office pushes through government — tracked end-to-end.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Active Files" value="142" accent="bg-blue-100 text-blue-700" />
        <StatCard icon={Clock} label="Pending >30 days" value="28" accent="bg-amber-100 text-amber-700" />
        <StatCard icon={AlertTriangle} label="Escalated" value="14" accent="bg-red-100 text-red-700" danger />
        <StatCard icon={CheckCircle2} label="Closed This Month" value="39" accent="bg-green-100 text-green-700" />
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm text-[#0A1F44] flex items-center gap-2"><Building2 className="h-4 w-4 text-[#FF9933]" /> Bottleneck view — departments holding stuck files</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {bottlenecks.map(([d, n]) => (
            <div key={d} className="flex items-center gap-3 text-sm">
              <div className="w-28 text-slate-700">{d}</div>
              <div className="flex-1 bg-slate-100 rounded h-4 overflow-hidden"><div className="h-full bg-red-500" style={{ width: `${(n/maxB)*100}%` }} /></div>
              <div className="w-10 text-right font-semibold text-red-700">{n}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base text-[#0A1F44]">File Register</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative"><Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search subject / file no." className="pl-8 h-9 w-56" /></div>
              <Select value={dept} onValueChange={setDept}><SelectTrigger className="h-9 w-32"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All depts</SelectItem>{["BWSSB","BBMP","PWD","Revenue","Education","Railways","BESCOM","Police"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}><SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All statuses</SelectItem>{(["In Progress","Awaiting Reply","Stuck","Closed"] as FileStatus[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>File / Ref No.</TableHead><TableHead>Subject</TableHead><TableHead>Dept</TableHead><TableHead>Officer</TableHead>
              <TableHead>Submitted</TableHead><TableHead>Last F/U</TableHead><TableHead>Next F/U</TableHead><TableHead>Bottleneck</TableHead>
              <TableHead>Esc</TableHead><TableHead>Status</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(f => (
                <TableRow key={f.id} className="cursor-pointer hover:bg-slate-50" onClick={() => setDrawer(f)}>
                  <TableCell className="font-mono text-xs">{f.id}</TableCell>
                  <TableCell className="text-sm font-medium text-[#0A1F44] max-w-[240px]"><div className="line-clamp-2">{f.subject}</div></TableCell>
                  <TableCell className="text-xs">{f.department}</TableCell>
                  <TableCell className="text-xs">{f.officer}</TableCell>
                  <TableCell className="text-xs">{f.submitted}</TableCell>
                  <TableCell className="text-xs">{f.lastFu}</TableCell>
                  <TableCell className="text-xs">{f.nextFu}</TableCell>
                  <TableCell className="text-xs text-slate-600 max-w-[180px]"><div className="line-clamp-2">{f.bottleneck}</div></TableCell>
                  <TableCell><Badge className={`${ESC_COLOR[f.escalation]} hover:${ESC_COLOR[f.escalation]}`}>{f.escalation}</Badge></TableCell>
                  <TableCell><Badge className={`${STATUS_COLOR[f.status]} hover:${STATUS_COLOR[f.status]}`}>{f.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!drawer} onOpenChange={(o) => !o && setDrawer(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {drawer && (
            <>
              <SheetHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-mono text-muted-foreground">{drawer.id}</div>
                    <SheetTitle className="text-[#0A1F44] pr-6">{drawer.subject}</SheetTitle>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => setDrawer(null)}><X className="h-4 w-4" /></Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge className={STATUS_COLOR[drawer.status]}>{drawer.status}</Badge>
                  <Badge className={ESC_COLOR[drawer.escalation]}>Escalation {drawer.escalation}</Badge>
                  <Badge variant="outline">{drawer.department}</Badge>
                </div>
              </SheetHeader>

              <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
                <div><div className="text-[10px] uppercase text-slate-500">Officer</div><div className="font-medium">{drawer.officer}</div></div>
                <div><div className="text-[10px] uppercase text-slate-500">Submitted</div><div className="font-medium">{drawer.submitted}</div></div>
                <div><div className="text-[10px] uppercase text-slate-500">Last follow-up</div><div className="font-medium">{drawer.lastFu}</div></div>
                <div><div className="text-[10px] uppercase text-slate-500">Next follow-up</div><div className="font-medium">{drawer.nextFu}</div></div>
                <div className="col-span-2"><div className="text-[10px] uppercase text-slate-500">Current bottleneck</div><div className="font-medium text-red-700">{drawer.bottleneck}</div></div>
              </div>

              <div className="mt-5">
                <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Documents</div>
                {drawer.documents.length === 0 && <div className="text-xs text-muted-foreground italic">None attached</div>}
                <div className="flex flex-wrap gap-2">{drawer.documents.map(d => <Badge key={d} variant="outline" className="gap-1"><Paperclip className="h-3 w-3" />{d}</Badge>)}</div>
              </div>

              <div className="mt-5">
                <div className="text-xs font-semibold uppercase text-slate-500 mb-3">Follow-up timeline</div>
                <div className="relative pl-6">
                  <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />
                  {drawer.timeline.map((t, i) => (
                    <div key={i} className="relative pb-3">
                      <div className={`absolute -left-6 top-0.5 h-3.5 w-3.5 rounded-full border-2 ${t.kind === "escalate" ? "bg-red-500 border-red-500" : t.kind === "reply" ? "bg-blue-500 border-blue-500" : "bg-[#FF9933] border-[#FF9933]"}`} />
                      <div className="text-sm">{t.text}</div>
                      <div className="text-[10px] text-muted-foreground">{t.date} · {t.actor}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4"><div className="text-xs font-semibold text-slate-700 mb-1">Log follow-up</div><Textarea rows={2} placeholder="e.g. Spoke to EE on phone; assured action by Friday." /></div>

              <div className="mt-5 pt-4 border-t grid grid-cols-3 gap-2">
                <Button className="bg-[#0A1F44] text-white" onClick={() => toast.success("Follow-up logged")}>Log F/U</Button>
                <Button variant="outline" className="border-red-300 text-red-700" onClick={() => { setFiles(arr => arr.map(x => x.id === drawer.id ? { ...x, escalation: drawer.escalation === "None" ? "L1" : drawer.escalation === "L1" ? "L2" : "L3" } : x)); toast.success("Escalated"); }}><ArrowUpRight className="h-4 w-4" /> Escalate</Button>
                <Link to="/recommendation-letters"><Button className="bg-[#FF9933] text-white w-full"><FileSignature className="h-4 w-4" /> Reminder Letter</Button></Link>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
