import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Users, Clock, CheckCircle2, TrendingUp, UserCheck, X, ArrowRight,
  FileText, FileSignature, Calendar as CalIcon, Heart, MinusCircle, Plus,
  MessageSquare, ClipboardCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/visitors")({
  head: () => ({ meta: [{ title: "Visitors & Outcomes — Citizen Pulse" }] }),
  component: VisitorsPage,
});

type Status = "Checked-in" | "Met" | "Outcome captured" | "Closed";
type Outcome = "Grievance" | "Letter" | "Recommendation" | "Appointment" | "Scheme request" | "No-action note" | "—";

type Visitor = {
  id: string; name: string; phone: string; ward: string; reason: string;
  checkIn: string; metWith: "MP" | "Staff" | "—";
  applicationReceived: boolean;
  status: Status; outcome: Outcome; linkedRef?: string;
  nextOwner: string; informed: boolean;
  notes?: string;
};

const SEED: Visitor[] = [
  { id: "VIS-2826", name: "Smt. Lakshmi N.", phone: "98452 11***", ward: "Whitefield W-149", reason: "PMAY application help", checkIn: "09:12", metWith: "Staff", applicationReceived: true, status: "Outcome captured", outcome: "Scheme request", linkedRef: "SCH-2026-218", nextOwner: "Vikram T.", informed: true },
  { id: "VIS-2827", name: "Sri Manjunath B.", phone: "94483 22***", ward: "KR Puram W-84", reason: "Water tanker not delivered for 3 days", checkIn: "09:30", metWith: "MP", applicationReceived: true, status: "Outcome captured", outcome: "Grievance", linkedRef: "GR-4521", nextOwner: "Suresh K.", informed: true },
  { id: "VIS-2828", name: "Whitefield Rising delegation (4)", phone: "—", ward: "Whitefield W-149", reason: "Flooding & service road on NH-75", checkIn: "10:05", metWith: "MP", applicationReceived: true, status: "Outcome captured", outcome: "Letter", linkedRef: "CP/LTR/2026/0244", nextOwner: "Vikram T.", informed: true },
  { id: "VIS-2829", name: "Smt. Roopa M.", phone: "98453 22***", ward: "Mahadevapura W-150", reason: "PMAY rejection appeal", checkIn: "10:45", metWith: "Staff", applicationReceived: true, status: "Outcome captured", outcome: "Recommendation", linkedRef: "LTR-2026-411", nextOwner: "Vikram T.", informed: true },
  { id: "VIS-2830", name: "Sri Imran Pasha", phone: "95385 88***", ward: "Bellandur W-150", reason: "Wants to invite MP for shop inauguration", checkIn: "11:10", metWith: "Staff", applicationReceived: false, status: "Outcome captured", outcome: "Appointment", linkedRef: "APT-228", nextOwner: "Priya S.", informed: true },
  { id: "VIS-2831", name: "Sri Krishnamurthy", phone: "98452 33***", ward: "Hoodi W-85", reason: "Khata transfer issue at Tahsil", checkIn: "11:35", metWith: "MP", applicationReceived: true, status: "Outcome captured", outcome: "Letter", linkedRef: "CP/LTR/2026/0245", nextOwner: "Vikram T.", informed: true },
  { id: "VIS-2832", name: "Smt. Sunitha B.", phone: "99024 55***", ward: "KR Puram W-84", reason: "Thank-you for pension follow-up", checkIn: "11:55", metWith: "MP", applicationReceived: false, status: "Outcome captured", outcome: "No-action note", nextOwner: "—", informed: false, notes: "Goodwill visit; logged for CRM." },
  { id: "VIS-2833", name: "Sri Ramesh K.", phone: "98765 12***", ward: "Hoodi W-85", reason: "Ration card update", checkIn: "12:20", metWith: "Staff", applicationReceived: true, status: "Met", outcome: "—", nextOwner: "Anita R.", informed: false },
  { id: "VIS-2834", name: "Apartment Federation (3)", phone: "—", ward: "Hoodi W-85", reason: "BESCOM load-shedding meeting request", checkIn: "12:50", metWith: "—", applicationReceived: false, status: "Checked-in", outcome: "—", nextOwner: "Priya S.", informed: false },
  { id: "VIS-2835", name: "Sri Vijay (journalist)", phone: "98456 77***", ward: "—", reason: "Press query on parliament question", checkIn: "13:05", metWith: "Staff", applicationReceived: false, status: "Met", outcome: "—", nextOwner: "Lakshmi N. (Comms)", informed: false },
  { id: "VIS-2836", name: "Sri Naveen Kumar", phone: "90080 22***", ward: "Varthur W-150", reason: "Mudra loan follow-up", checkIn: "13:30", metWith: "—", applicationReceived: false, status: "Checked-in", outcome: "—", nextOwner: "—", informed: false },
];

const STATUS_COLOR: Record<Status, string> = {
  "Checked-in": "bg-slate-100 text-slate-700",
  "Met": "bg-blue-100 text-blue-800",
  "Outcome captured": "bg-amber-100 text-amber-800",
  "Closed": "bg-green-100 text-green-800",
};

const OUTCOME_META: Record<Exclude<Outcome, "—">, { icon: any; color: string; route: string; refPrefix: string }> = {
  "Grievance":      { icon: FileText,      color: "bg-red-100 text-red-700",       route: "/grievances",              refPrefix: "GR-" },
  "Letter":         { icon: FileSignature, color: "bg-indigo-100 text-indigo-800", route: "/recommendation-letters",  refPrefix: "CP/LTR/" },
  "Recommendation": { icon: FileSignature, color: "bg-purple-100 text-purple-800", route: "/recommendation-letters",  refPrefix: "LTR-" },
  "Appointment":    { icon: CalIcon,       color: "bg-blue-100 text-blue-800",     route: "/calendar-visits",         refPrefix: "APT-" },
  "Scheme request": { icon: Heart,         color: "bg-emerald-100 text-emerald-800", route: "/scheme-assistance",     refPrefix: "SCH-" },
  "No-action note": { icon: MinusCircle,   color: "bg-slate-100 text-slate-600",   route: "/crm",                     refPrefix: "NOTE-" },
};

function StatCard({ icon: Icon, label, value, accent, sub }: any) {
  return (
    <Card><CardContent className="p-5"><div className="flex items-center gap-3">
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${accent}`}><Icon className="h-5 w-5" /></div>
      <div><div className="text-2xl font-bold text-[#0A1F44]">{value}</div><div className="text-xs text-muted-foreground">{label}</div>{sub && <div className="text-[10px] text-[#FF9933] font-medium">{sub}</div>}</div>
    </div></CardContent></Card>
  );
}

function VisitorsPage() {
  const [items, setItems] = useState<Visitor[]>(SEED);
  const [drawer, setDrawer] = useState<Visitor | null>(null);
  const [convertOpen, setConvertOpen] = useState(false);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = items.filter(v =>
    (statusFilter === "all" || v.status === statusFilter) &&
    (!q || v.name.toLowerCase().includes(q.toLowerCase()) || v.reason.toLowerCase().includes(q.toLowerCase()))
  );

  const stats = useMemo(() => {
    const total = items.length;
    const withOutcome = items.filter(v => v.outcome !== "—").length;
    const queue = items.filter(v => v.status === "Checked-in" || v.status === "Met").length;
    const conversion = total ? Math.round((withOutcome / total) * 100) : 0;
    return { total, withOutcome, queue, conversion };
  }, [items]);

  const convert = (v: Visitor, outcome: Exclude<Outcome, "—">, nextOwner: string, note: string) => {
    const meta = OUTCOME_META[outcome];
    const ref = `${meta.refPrefix}${Math.floor(Math.random() * 9000) + 1000}`;
    setItems(arr => arr.map(x => x.id === v.id ? { ...x, status: "Outcome captured", outcome, linkedRef: ref, nextOwner, informed: true, notes: note } : x));
    setDrawer(d => d && d.id === v.id ? { ...d, status: "Outcome captured", outcome, linkedRef: ref, nextOwner, informed: true, notes: note } : d);
    setConvertOpen(false);
    toast.success(`Converted to ${outcome} · ${ref}`, { description: "Citizen notified via WhatsApp" });
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Visitors & Outcomes</h1>
          <p className="text-sm text-muted-foreground">Today's check-in queue + the outcome of every visit. <span className="text-[#FF9933] font-medium">No visitor leaves without a tracked outcome.</span></p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Today's visitors" value={stats.total} accent="bg-blue-100 text-blue-700" />
        <StatCard icon={Clock} label="In queue" value={stats.queue} accent="bg-amber-100 text-amber-700" />
        <StatCard icon={CheckCircle2} label="Outcomes captured" value={stats.withOutcome} accent="bg-green-100 text-green-700" />
        <StatCard icon={TrendingUp} label="Conversion rate" value={`${stats.conversion}%`} accent="bg-[#FF9933]/15 text-[#FF9933]" sub="visitor → tracked action" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base text-[#0A1F44]">Check-in queue · 26 Jun 2026</CardTitle>
            <div className="flex items-center gap-2">
              <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search…" className="h-9 w-48" />
              <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="h-9 w-44"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All statuses</SelectItem>{(["Checked-in","Met","Outcome captured","Closed"] as Status[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Check-in</TableHead><TableHead>Visitor</TableHead><TableHead>Ward</TableHead>
              <TableHead>Reason</TableHead><TableHead>Met</TableHead><TableHead>Application?</TableHead>
              <TableHead>Status</TableHead><TableHead>Outcome</TableHead><TableHead>Next owner</TableHead><TableHead>Informed?</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(v => (
                <TableRow key={v.id} className="cursor-pointer hover:bg-slate-50" onClick={() => setDrawer(v)}>
                  <TableCell className="text-xs">{v.checkIn}</TableCell>
                  <TableCell><div className="text-sm font-medium text-[#0A1F44]">{v.name}</div><div className="text-[10px] text-muted-foreground">{v.phone}</div></TableCell>
                  <TableCell className="text-xs">{v.ward}</TableCell>
                  <TableCell className="text-xs max-w-[220px]"><div className="line-clamp-2">{v.reason}</div></TableCell>
                  <TableCell className="text-xs"><Badge variant="outline">{v.metWith}</Badge></TableCell>
                  <TableCell className="text-xs">{v.applicationReceived ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <MinusCircle className="h-4 w-4 text-slate-300" />}</TableCell>
                  <TableCell><Badge className={`${STATUS_COLOR[v.status]} hover:${STATUS_COLOR[v.status]}`}>{v.status}</Badge></TableCell>
                  <TableCell>
                    {v.outcome === "—" ? <Badge variant="outline" className="text-slate-400">Pending</Badge> :
                      (() => { const m = OUTCOME_META[v.outcome]; const I = m.icon;
                        return <Link to={m.route} onClick={e => e.stopPropagation()}><Badge className={`${m.color} hover:${m.color} gap-1`}><I className="h-3 w-3" />{v.outcome}{v.linkedRef && <span className="font-mono">· {v.linkedRef}</span>}</Badge></Link>;
                      })()}
                  </TableCell>
                  <TableCell className="text-xs">{v.nextOwner}</TableCell>
                  <TableCell>{v.informed ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Yes</Badge> : <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Not yet</Badge>}</TableCell>
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
                    <div className="text-xs font-mono text-muted-foreground">{drawer.id} · arrived {drawer.checkIn}</div>
                    <SheetTitle className="text-[#0A1F44]">{drawer.name}</SheetTitle>
                    <div className="text-sm text-slate-600">{drawer.phone} · {drawer.ward}</div>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => setDrawer(null)}><X className="h-4 w-4" /></Button>
                </div>
                <div className="flex gap-2 flex-wrap mt-2"><Badge className={STATUS_COLOR[drawer.status]}>{drawer.status}</Badge><Badge variant="outline">Met: {drawer.metWith}</Badge>{drawer.applicationReceived && <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Application received</Badge>}</div>
              </SheetHeader>

              <div className="mt-5">
                <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Why they came</div>
                <div className="text-sm">{drawer.reason}</div>
              </div>

              {drawer.notes && <div className="mt-4 text-xs bg-slate-50 border-l-2 border-[#FF9933] px-3 py-2 rounded-r">{drawer.notes}</div>}

              {/* Outcome */}
              <div className="mt-5">
                <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Outcome</div>
                {drawer.outcome === "—" ? (
                  <div className="p-3 rounded-md bg-amber-50 border border-amber-200">
                    <div className="text-sm text-amber-900 mb-2">No outcome captured yet. Convert this visit into a tracked action.</div>
                    <Button size="sm" className="bg-[#FF9933] text-white" onClick={() => setConvertOpen(true)}><ArrowRight className="h-3 w-3" /> Convert to action</Button>
                  </div>
                ) : (
                  (() => { const m = OUTCOME_META[drawer.outcome]; const I = m.icon;
                    return (
                      <div className="p-3 rounded-md border bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-md flex items-center justify-center ${m.color}`}><I className="h-4 w-4" /></div>
                          <div><div className="text-sm font-medium text-[#0A1F44]">{drawer.outcome}</div>{drawer.linkedRef && <div className="text-xs font-mono text-slate-500">{drawer.linkedRef}</div>}</div>
                        </div>
                        <Link to={m.route}><Button size="sm" variant="outline">Open record <ArrowRight className="h-3 w-3" /></Button></Link>
                      </div>
                    );
                  })()
                )}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div><div className="text-[10px] uppercase text-slate-500">Next-step owner</div><div className="font-medium">{drawer.nextOwner}</div></div>
                <div><div className="text-[10px] uppercase text-slate-500">Citizen informed?</div><div className="font-medium">{drawer.informed ? "Yes — WhatsApp" : "Not yet"}</div></div>
              </div>

              <div className="mt-5 pt-4 border-t grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => { setItems(arr => arr.map(x => x.id === drawer.id ? { ...x, informed: true } : x)); toast.success("Citizen notified"); }}><MessageSquare className="h-4 w-4" /> Notify Citizen</Button>
                <Button className="bg-[#0A1F44] text-white" onClick={() => { setItems(arr => arr.map(x => x.id === drawer.id ? { ...x, status: "Closed" } : x)); setDrawer(null); toast.success("Visit closed"); }}><ClipboardCheck className="h-4 w-4" /> Mark Closed</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <ConvertDialog open={convertOpen} onClose={() => setConvertOpen(false)} onConvert={(o, owner, n) => drawer && convert(drawer, o, owner, n)} />
    </div>
  );
}

function ConvertDialog({ open, onClose, onConvert }: { open: boolean; onClose: () => void; onConvert: (o: Exclude<Outcome, "—">, owner: string, note: string) => void }) {
  const [outcome, setOutcome] = useState<Exclude<Outcome, "—">>("Grievance");
  const [owner, setOwner] = useState("Suresh K.");
  const [note, setNote] = useState("");
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle className="text-[#0A1F44]">Convert visit to action</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold text-slate-700 mb-1">Convert to</div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(OUTCOME_META) as Exclude<Outcome, "—">[]).map(o => {
                const m = OUTCOME_META[o]; const I = m.icon;
                return (
                  <button key={o} onClick={() => setOutcome(o)} className={`flex items-center gap-2 text-sm p-2 rounded-md border ${outcome === o ? "border-[#FF9933] bg-[#FF9933]/10" : "border-slate-200 hover:bg-slate-50"}`}>
                    <I className="h-4 w-4 text-[#FF9933]" />{o}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-700 mb-1">Assign next-step owner</div>
            <Select value={owner} onValueChange={setOwner}><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Suresh K. (Water Desk)","Anita R. (Civic Desk)","Ravi M. (Infra Desk)","Priya S. (PA)","Vikram T. (Office Mgr)","Lakshmi N. (Comms)"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><div className="text-xs font-semibold text-slate-700 mb-1">Note for record</div><Textarea rows={2} value={note} onChange={e => setNote(e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-[#FF9933] text-white" onClick={() => onConvert(outcome, owner, note)}><Plus className="h-4 w-4" /> Create linked record</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Suppress unused import warning safely
void UserCheck;
