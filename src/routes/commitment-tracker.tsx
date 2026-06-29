import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CheckCircle2, Clock, AlertTriangle, TrendingUp, Plus, Paperclip, Search,
  FileSignature, X, MessageSquare, Calendar as CalIcon, MapPin, User, Building2,
  ArrowRight, History, Megaphone, Mic, PhoneCall, Landmark, ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const Route = createFileRoute("/commitment-tracker")({
  head: () => ({ meta: [{ title: "Commitment & Assurance Tracker — Citizen Pulse" }] }),
  component: CommitmentsPage,
});

// ──────────────────────────────────────────────────────────────────────────
type CType = "Verbal (public)" | "Verbal (private)" | "Public announcement" | "Official letter promised" | "Parliament assurance" | "Minister/Official assurance";
type Maker = "MP" | "Staff" | "Minister" | "Official";
type Status = "Open" | "In Progress" | "Fulfilled" | "Could-not-fulfil";

type Commitment = {
  id: string;
  text: string;
  type: CType;
  madeBy: Maker;
  madeByName?: string;
  toWhom: string;
  toWhomKind: "Person" | "Community" | "Organisation";
  location: string;
  context: string;
  madeOn: string;
  assignee: string;
  department: string;
  dueOn: string;
  status: Status;
  proof?: string;
  notes: { date: string; actor: string; text: string }[];
};

const STAFF = ["Suresh K. (Water Desk)", "Anita R. (Civic Desk)", "Ravi M. (Infra Desk)", "Priya S. (PA)", "Vikram T. (Office Mgr)", "Lakshmi N. (Comms)"];
const DEPTS = ["BBMP", "BWSSB", "BESCOM", "PWD", "Police", "BMTC", "Health Dept", "Education Dept", "Revenue (Tahsil)", "NHAI", "Railway (SWR)"];

const TYPE_META: Record<CType, { icon: any; color: string }> = {
  "Verbal (public)": { icon: Megaphone, color: "bg-blue-100 text-blue-800" },
  "Verbal (private)": { icon: MessageSquare, color: "bg-slate-100 text-slate-700" },
  "Public announcement": { icon: Mic, color: "bg-[#FF9933]/15 text-[#FF9933]" },
  "Official letter promised": { icon: FileSignature, color: "bg-indigo-100 text-indigo-800" },
  "Parliament assurance": { icon: Landmark, color: "bg-purple-100 text-purple-800" },
  "Minister/Official assurance": { icon: ShieldCheck, color: "bg-emerald-100 text-emerald-800" },
};

const STATUS_META: Record<Status, string> = {
  "Open": "bg-amber-100 text-amber-800",
  "In Progress": "bg-blue-100 text-blue-800",
  "Fulfilled": "bg-green-100 text-green-800",
  "Could-not-fulfil": "bg-red-100 text-red-700",
};

const today = new Date("2026-06-26");
const daysFromToday = (d: string) => Math.round((new Date(d).getTime() - today.getTime()) / 86400000);
const isOverdue = (c: Commitment) => (c.status === "Open" || c.status === "In Progress") && daysFromToday(c.dueOn) < 0;
const isDueThisWeek = (c: Commitment) => (c.status === "Open" || c.status === "In Progress") && daysFromToday(c.dueOn) >= 0 && daysFromToday(c.dueOn) <= 7;

const SEED: Commitment[] = [
  { id: "COM-2026-184", text: "Speak to the Deputy Commissioner about the KR Puram water supply issue and request emergency tanker deployment for Ward 84.", type: "Verbal (public)", madeBy: "MP", toWhom: "RWA Federation, KR Puram", toWhomKind: "Community", location: "KR Puram", context: "Public meeting, 22 Jun 2026", madeOn: "22 Jun 2026", assignee: "Suresh K. (Water Desk)", department: "BWSSB", dueOn: "29 Jun 2026", status: "In Progress", notes: [{ date: "23 Jun", actor: "Suresh K.", text: "DC office contacted; meeting fixed for 28 Jun." }] },
  { id: "COM-2026-183", text: "Write to NHAI Project Director to expedite the KR Puram service road on NH-75.", type: "Official letter promised", madeBy: "MP", toWhom: "Hoodi RWA Confederation", toWhomKind: "Organisation", location: "KR Puram", context: "RWA Federation meet, 20 Jun", madeOn: "20 Jun 2026", assignee: "Vikram T. (Office Mgr)", department: "NHAI", dueOn: "25 Jun 2026", status: "Fulfilled", proof: "CP/LTR/2026/0237.pdf", notes: [{ date: "24 Jun", actor: "Vikram T.", text: "Letter CP/LTR/2026/0237 dispatched via Speed Post." }] },
  { id: "COM-2026-182", text: "Take up Whitefield flooding in the next Parliament session under Rule 377.", type: "Parliament assurance", madeBy: "MP", toWhom: "Whitefield Rising (citizen forum)", toWhomKind: "Organisation", location: "Whitefield", context: "Town hall, 18 Jun", madeOn: "18 Jun 2026", assignee: "Priya S. (PA)", department: "—", dueOn: "15 Jul 2026", status: "Open", notes: [] },
  { id: "COM-2026-181", text: "Sanction borewell project for Mahadevapura Ward 56 under MPLADS within this quarter.", type: "Public announcement", madeBy: "MP", toWhom: "Residents, Ward 56", toWhomKind: "Community", location: "Mahadevapura", context: "Borewell inauguration", madeOn: "15 Jun 2026", assignee: "Ravi M. (Infra Desk)", department: "BBMP", dueOn: "30 Sep 2026", status: "In Progress", notes: [{ date: "20 Jun", actor: "Ravi M.", text: "Proposal drafted; awaiting DC approval." }] },
  { id: "COM-2026-180", text: "Personally meet the family of Sri Krishnamurthy to offer condolences and ex-gratia assistance support.", type: "Verbal (private)", madeBy: "MP", toWhom: "Krishnamurthy family", toWhomKind: "Person", location: "Mahadevapura", context: "Condolence call", madeOn: "21 Jun 2026", assignee: "Priya S. (PA)", department: "—", dueOn: "26 Jun 2026", status: "Open", notes: [] },
  { id: "COM-2026-179", text: "Coordinate with BESCOM EE to resolve unscheduled load-shedding in Hoodi apartments.", type: "Verbal (public)", madeBy: "MP", toWhom: "Apartment Federation, Hoodi", toWhomKind: "Organisation", location: "Hoodi", context: "WhatsApp group voice note", madeOn: "10 Jun 2026", assignee: "Anita R. (Civic Desk)", department: "BESCOM", dueOn: "20 Jun 2026", status: "In Progress", notes: [{ date: "18 Jun", actor: "Anita R.", text: "Feeder maintenance scheduled by BESCOM." }] },
  { id: "COM-2026-178", text: "Push Karnataka Urban Development Minister to release Phase-II funds for Bellandur Lake rejuvenation.", type: "Minister/Official assurance", madeBy: "Minister", madeByName: "Hon'ble Minister, UDD", toWhom: "MP — Bengaluru", toWhomKind: "Person", location: "Bengaluru", context: "Vidhana Soudha meeting", madeOn: "12 Jun 2026", assignee: "Vikram T. (Office Mgr)", department: "UDD (GoK)", dueOn: "31 Jul 2026", status: "Open", notes: [] },
  { id: "COM-2026-177", text: "Recommend Smt. Lakshmi N. for PMAY housing eligibility with district authority.", type: "Official letter promised", madeBy: "MP", toWhom: "Smt. Lakshmi N.", toWhomKind: "Person", location: "Whitefield", context: "Visitor meeting", madeOn: "08 Jun 2026", assignee: "Vikram T. (Office Mgr)", department: "Karnataka Slum Dev Board", dueOn: "18 Jun 2026", status: "Open", notes: [{ date: "20 Jun", actor: "Vikram T.", text: "Documents pending verification from applicant." }] },
  { id: "COM-2026-176", text: "Arrange site visit by BBMP Joint Commissioner to encroached storm-water drain in Varthur.", type: "Verbal (public)", madeBy: "MP", toWhom: "Varthur RWA", toWhomKind: "Organisation", location: "Varthur", context: "Site visit by MP", madeOn: "05 Jun 2026", assignee: "Anita R. (Civic Desk)", department: "BBMP", dueOn: "15 Jun 2026", status: "Open", notes: [] },
  { id: "COM-2026-175", text: "Provide guest faculty sanction for Govt PU College KR Puram (Science).", type: "Verbal (public)", madeBy: "MP", toWhom: "PTA, Govt PU College", toWhomKind: "Organisation", location: "KR Puram", context: "Parent-Teacher Meet", madeOn: "01 Jun 2026", assignee: "Priya S. (PA)", department: "Education Dept", dueOn: "25 Jun 2026", status: "Fulfilled", proof: "Sanction-Order-DDPI.pdf", notes: [{ date: "23 Jun", actor: "Priya S.", text: "BEO sanctioned 2 guest faculty for the term." }] },
  { id: "COM-2026-174", text: "Take up issue of Vande Bharat halt at Whitefield with Union Railway Ministry.", type: "Parliament assurance", madeBy: "MP", toWhom: "IT Corridor commuters", toWhomKind: "Community", location: "Whitefield", context: "Pre-poll commitment", madeOn: "28 May 2026", assignee: "Vikram T. (Office Mgr)", department: "Railway (SWR)", dueOn: "30 Jun 2026", status: "In Progress", notes: [{ date: "25 Jun", actor: "Vikram T.", text: "Draft letter to Hon'ble Union Minister under preparation (CP/LTR/2026/0244)." }] },
  { id: "COM-2026-173", text: "Sponsor street-lighting upgrade for 4 lanes in Marathahalli under MPLADS.", type: "Public announcement", madeBy: "MP", toWhom: "Marathahalli RWA", toWhomKind: "Organisation", location: "Marathahalli", context: "Inauguration of community hall", madeOn: "22 May 2026", assignee: "Ravi M. (Infra Desk)", department: "BBMP", dueOn: "31 Aug 2026", status: "In Progress", notes: [] },
  { id: "COM-2026-172", text: "Arrange medical camp in Bellandur slum cluster in coordination with PHC.", type: "Verbal (public)", madeBy: "Staff", madeByName: "Anita R.", toWhom: "Bellandur slum residents", toWhomKind: "Community", location: "Bellandur", context: "Field visit", madeOn: "18 May 2026", assignee: "Anita R. (Civic Desk)", department: "Health Dept", dueOn: "10 Jun 2026", status: "Could-not-fulfil", notes: [{ date: "11 Jun", actor: "Anita R.", text: "PHC could not allocate staff; rescheduling to July." }] },
  { id: "COM-2026-171", text: "Follow up with DCP East on chain-snatching incidents in Mahadevapura market.", type: "Verbal (public)", madeBy: "MP", toWhom: "Mahadevapura traders' association", toWhomKind: "Organisation", location: "Mahadevapura", context: "Public grievance day", madeOn: "12 May 2026", assignee: "Anita R. (Civic Desk)", department: "Police", dueOn: "12 Jun 2026", status: "Open", notes: [] },
  { id: "COM-2026-170", text: "Provide assurance on widow pension expedited release for Smt. Sunitha B.", type: "Minister/Official assurance", madeBy: "Official", madeByName: "Tahsildar, Bengaluru East", toWhom: "Smt. Sunitha B.", toWhomKind: "Person", location: "KR Puram", context: "Tahsil office visit by MP", madeOn: "08 May 2026", assignee: "Vikram T. (Office Mgr)", department: "Revenue (Tahsil)", dueOn: "08 Jun 2026", status: "Fulfilled", proof: "Pension-credit-receipt.pdf", notes: [{ date: "06 Jun", actor: "Vikram T.", text: "First credit received by beneficiary." }] },
  { id: "COM-2026-169", text: "Inaugurate proposed park in Whitefield Ward 150 once tender is finalised.", type: "Public announcement", madeBy: "MP", toWhom: "Whitefield residents", toWhomKind: "Community", location: "Whitefield", context: "Press release", madeOn: "01 May 2026", assignee: "Priya S. (PA)", department: "BBMP", dueOn: "31 Jul 2026", status: "Open", notes: [] },
];

// ──────────────────────────────────────────────────────────────────────────
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

function TypeChip({ t }: { t: CType }) {
  const m = TYPE_META[t]; const Icon = m.icon;
  return <Badge className={`${m.color} hover:${m.color} gap-1 font-normal`}><Icon className="h-3 w-3" />{t}</Badge>;
}

function CommitmentsPage() {
  const [items, setItems] = useState<Commitment[]>(SEED);
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openCapture, setOpenCapture] = useState(false);
  const [drawer, setDrawer] = useState<Commitment | null>(null);

  const stats = useMemo(() => {
    const open = items.filter(i => i.status === "Open" || i.status === "In Progress").length;
    const dueWeek = items.filter(isDueThisWeek).length;
    const overdue = items.filter(isOverdue).length;
    const fulfilledMonth = items.filter(i => i.status === "Fulfilled").length;
    const closed = items.filter(i => i.status === "Fulfilled" || i.status === "Could-not-fulfil").length;
    const rate = closed ? Math.round((items.filter(i => i.status === "Fulfilled").length / closed) * 100) : 0;
    return { open, dueWeek, overdue, fulfilledMonth, rate };
  }, [items]);

  const filtered = useMemo(() => items.filter(c => {
    if (tab === "mp" && c.madeBy !== "MP") return false;
    if (tab === "public" && !["Verbal (public)","Public announcement"].includes(c.type)) return false;
    if (tab === "parliament" && c.type !== "Parliament assurance") return false;
    if (tab === "overdue" && !isOverdue(c)) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (q && !(c.text.toLowerCase().includes(q.toLowerCase()) || c.toWhom.toLowerCase().includes(q.toLowerCase()) || c.id.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [items, tab, statusFilter, q]);

  const byArea = useMemo(() => {
    const map: Record<string, number> = {};
    items.filter(i => i.status === "Open" || i.status === "In Progress").forEach(i => { map[i.location] = (map[i.location] || 0) + 1; });
    return Object.entries(map).sort((a,b) => b[1]-a[1]).slice(0, 6);
  }, [items]);
  const maxArea = Math.max(1, ...byArea.map(([,v]) => v));

  const ageingBuckets = useMemo(() => {
    const buckets = { "0–7d": 0, "8–30d": 0, "31–60d": 0, "60d+": 0 };
    items.filter(i => i.status === "Open" || i.status === "In Progress").forEach(i => {
      const age = -daysFromToday(i.madeOn);
      if (age <= 7) buckets["0–7d"]++;
      else if (age <= 30) buckets["8–30d"]++;
      else if (age <= 60) buckets["31–60d"]++;
      else buckets["60d+"]++;
    });
    return buckets;
  }, [items]);
  const maxAge = Math.max(1, ...Object.values(ageingBuckets));

  const updateStatus = (c: Commitment, s: Status) => {
    setItems(arr => arr.map(x => x.id === c.id ? { ...x, status: s, notes: [...x.notes, { date: "26 Jun", actor: "MP Office", text: `Status updated → ${s}` }] } : x));
    setDrawer(d => d && d.id === c.id ? { ...d, status: s } : d);
    toast.success(`Marked as ${s}`);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Commitment & Assurance Tracker</h1>
          <p className="text-sm text-muted-foreground">Every promise the MP or officials make — captured, assigned, tracked to closure. <span className="text-[#FF9933] font-medium">Promises, not complaints.</span></p>
        </div>
        <Button className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white" onClick={() => setOpenCapture(true)}>
          <Plus className="h-4 w-4" /> Log Commitment
        </Button>
      </div>

      {/* Quick capture context */}
      <Card className="border-l-4 border-l-[#FF9933]">
        <CardContent className="p-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="font-medium text-[#0A1F44]">Auto-capture from:</span>
          <Badge variant="outline" className="gap-1"><CalIcon className="h-3 w-3" /> Events & Visits</Badge>
          <Badge variant="outline" className="gap-1"><PhoneCall className="h-3 w-3" /> Phone calls</Badge>
          <Badge variant="outline" className="gap-1"><MessageSquare className="h-3 w-3" /> WhatsApp</Badge>
          <Badge variant="outline" className="gap-1"><Mic className="h-3 w-3" /> Public speeches</Badge>
          <Badge variant="outline" className="gap-1"><Landmark className="h-3 w-3" /> Parliament floor</Badge>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard icon={Clock} label="Open Commitments" value={stats.open} accent="bg-amber-100 text-amber-700" />
        <StatCard icon={CalIcon} label="Due This Week" value={stats.dueWeek} accent="bg-blue-100 text-blue-700" />
        <StatCard icon={AlertTriangle} label="Overdue" value={stats.overdue} accent="bg-red-100 text-red-700" danger />
        <StatCard icon={CheckCircle2} label="Fulfilled This Month" value={stats.fulfilledMonth} accent="bg-green-100 text-green-700" />
        <StatCard icon={TrendingUp} label="Fulfilment Rate" value={`${stats.rate}%`} accent="bg-[#FF9933]/15 text-[#FF9933]" />
      </div>

      {/* Insight strip */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-[#0A1F44] flex items-center gap-2"><MapPin className="h-4 w-4 text-[#FF9933]" /> Open commitments by area</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {byArea.map(([area, n]) => (
              <div key={area} className="flex items-center gap-3 text-sm">
                <div className="w-32 text-slate-700">{area}</div>
                <div className="flex-1 bg-slate-100 rounded h-4 overflow-hidden">
                  <div className="h-full bg-[#FF9933]" style={{ width: `${(n/maxArea)*100}%` }} />
                </div>
                <div className="w-8 text-right font-semibold text-[#0A1F44]">{n}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-[#0A1F44] flex items-center gap-2"><History className="h-4 w-4 text-[#FF9933]" /> Ageing — how long promises stay open</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(ageingBuckets).map(([k, v]) => (
              <div key={k} className="flex items-center gap-3 text-sm">
                <div className="w-20 text-slate-700">{k}</div>
                <div className="flex-1 bg-slate-100 rounded h-4 overflow-hidden">
                  <div className="h-full bg-[#0A1F44]" style={{ width: `${(v/maxAge)*100}%` }} />
                </div>
                <div className="w-8 text-right font-semibold text-[#0A1F44]">{v}</div>
              </div>
            ))}
            <div className="text-[11px] text-muted-foreground pt-2 italic">Political-credibility view: promises remembered and delivered.</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs + table */}
      <Card>
        <CardHeader className="pb-3">
          <Tabs value={tab} onValueChange={setTab}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <TabsList className="bg-slate-100">
                <TabsTrigger value="all">All ({items.length})</TabsTrigger>
                <TabsTrigger value="mp">By MP</TabsTrigger>
                <TabsTrigger value="public">Public / Political</TabsTrigger>
                <TabsTrigger value="parliament">Parliament</TabsTrigger>
                <TabsTrigger value="overdue" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700">Overdue ({stats.overdue})</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search commitment…" className="pl-8 h-9 w-56" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {(["Open","In Progress","Fulfilled","Could-not-fulfil"] as Status[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value={tab} className="mt-4">
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="w-[280px]">Commitment</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>To whom</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Made</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Responsible</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filtered.map(c => {
                    const overdue = isOverdue(c);
                    return (
                      <TableRow key={c.id} className={`cursor-pointer hover:bg-slate-50 ${overdue ? "bg-red-50/40" : ""}`} onClick={() => setDrawer(c)}>
                        <TableCell>
                          <div className="font-medium text-sm text-[#0A1F44] line-clamp-2 max-w-[280px]">{c.text}</div>
                          <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{c.id}</div>
                        </TableCell>
                        <TableCell><TypeChip t={c.type} /></TableCell>
                        <TableCell className="text-sm">{c.toWhom}</TableCell>
                        <TableCell className="text-sm">{c.location}</TableCell>
                        <TableCell className="text-xs">{c.madeOn}</TableCell>
                        <TableCell className={`text-xs ${overdue ? "text-red-700 font-semibold" : ""}`}>{c.dueOn}{overdue && <div className="text-[10px]">{Math.abs(daysFromToday(c.dueOn))}d overdue</div>}</TableCell>
                        <TableCell className="text-xs">{c.assignee}</TableCell>
                        <TableCell><Badge className={`${STATUS_META[c.status]} hover:${STATUS_META[c.status]}`}>{c.status}</Badge></TableCell>
                        <TableCell>{c.proof && <Paperclip className="h-4 w-4 text-[#0A1F44]" />}</TableCell>
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && <TableRow><TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-10">No commitments match your filters.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>

      {/* Capture dialog */}
      <CaptureDialog open={openCapture} onClose={() => setOpenCapture(false)} onSave={(c) => { setItems(arr => [c, ...arr]); toast.success(`Commitment ${c.id} logged`); }} />

      {/* Drawer */}
      <Sheet open={!!drawer} onOpenChange={(o) => !o && setDrawer(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {drawer && <DetailDrawer c={drawer} onStatus={(s) => updateStatus(drawer, s)} onClose={() => setDrawer(null)} onAddNote={(text) => {
            setItems(arr => arr.map(x => x.id === drawer.id ? { ...x, notes: [...x.notes, { date: "26 Jun", actor: "MP Office", text }] } : x));
            setDrawer(d => d ? { ...d, notes: [...d.notes, { date: "26 Jun", actor: "MP Office", text }] } : d);
          }} onAttachProof={() => {
            setItems(arr => arr.map(x => x.id === drawer.id ? { ...x, proof: "closure-proof.pdf" } : x));
            setDrawer(d => d ? { ...d, proof: "closure-proof.pdf" } : d);
            toast.success("Closure proof attached");
          }} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
function CaptureDialog({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (c: Commitment) => void }) {
  const [f, setF] = useState({
    text: "", type: "Verbal (public)" as CType, madeBy: "MP" as Maker, toWhom: "", toWhomKind: "Person" as Commitment["toWhomKind"],
    location: "", context: "", madeOn: "26 Jun 2026", assignee: STAFF[0], department: DEPTS[0], dueOn: "", status: "Open" as Status, note: "",
  });
  const set = <K extends keyof typeof f>(k: K, v: typeof f[K]) => setF(p => ({ ...p, [k]: v }));

  const submit = () => {
    if (!f.text || !f.toWhom || !f.dueOn) { toast.error("Commitment text, To whom, and Due date are required"); return; }
    const c: Commitment = {
      id: `COM-2026-${Math.floor(Math.random()*200)+185}`,
      text: f.text, type: f.type, madeBy: f.madeBy, toWhom: f.toWhom, toWhomKind: f.toWhomKind, location: f.location || "—",
      context: f.context, madeOn: f.madeOn, assignee: f.assignee, department: f.department, dueOn: f.dueOn, status: f.status,
      notes: f.note ? [{ date: "26 Jun", actor: "MP Office", text: f.note }] : [],
    };
    onSave(c); onClose();
    setF({ ...f, text: "", toWhom: "", location: "", context: "", dueOn: "", note: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-[#0A1F44]">Log a new commitment</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Commitment text *</Label>
            <Textarea rows={3} value={f.text} onChange={e => set("text", e.target.value)} placeholder='e.g. "I will speak to the DC about the KR Puram water issue."' />
          </div>

          <div>
            <Label>Type</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {(Object.keys(TYPE_META) as CType[]).map(t => (
                <button key={t} onClick={() => set("type", t)} className={`text-xs px-3 py-1.5 rounded-full border ${f.type === t ? "border-[#FF9933] bg-[#FF9933]/10 text-[#FF9933] font-medium" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{t}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Made by</Label>
              <Select value={f.madeBy} onValueChange={(v) => set("madeBy", v as Maker)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(["MP","Staff","Minister","Official"] as Maker[]).map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>To whom (kind)</Label>
              <Select value={f.toWhomKind} onValueChange={(v) => set("toWhomKind", v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Person">Person</SelectItem><SelectItem value="Community">Community</SelectItem><SelectItem value="Organisation">Organisation</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="col-span-2"><Label>To whom (name) *</Label><Input value={f.toWhom} onChange={e => set("toWhom", e.target.value)} placeholder="e.g. RWA Federation, KR Puram (links to CRM)" /></div>

            <div><Label>Location / Ward</Label><Input value={f.location} onChange={e => set("location", e.target.value)} placeholder="Whitefield / KR Puram / …" /></div>
            <div><Label>Context / Event</Label><Input value={f.context} onChange={e => set("context", e.target.value)} placeholder="Public meeting on 22 Jun" /></div>
            <div><Label>Date made</Label><Input value={f.madeOn} onChange={e => set("madeOn", e.target.value)} /></div>
            <div><Label>Due date *</Label><Input value={f.dueOn} onChange={e => set("dueOn", e.target.value)} placeholder="DD MMM YYYY" /></div>

            <div>
              <Label>Responsible staff</Label>
              <Select value={f.assignee} onValueChange={(v) => set("assignee", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STAFF.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Department involved</Label>
              <Select value={f.department} onValueChange={(v) => set("department", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DEPTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}{<SelectItem value="—">—</SelectItem>}</SelectContent>
              </Select>
            </div>
            <div className="col-span-2"><Label>Follow-up note</Label><Textarea rows={2} value={f.note} onChange={e => set("note", e.target.value)} /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-[#0A1F44] text-white" onClick={submit}><Plus className="h-4 w-4" /> Log Commitment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ──────────────────────────────────────────────────────────────────────────
function DetailDrawer({ c, onStatus, onClose, onAddNote, onAttachProof }: {
  c: Commitment; onStatus: (s: Status) => void; onClose: () => void; onAddNote: (t: string) => void; onAttachProof: () => void;
}) {
  const [note, setNote] = useState("");
  const overdue = isOverdue(c);
  const days = daysFromToday(c.dueOn);

  const timeline = [
    { stage: "Made", date: c.madeOn, actor: `${c.madeBy}${c.madeByName ? ` · ${c.madeByName}` : ""}`, done: true },
    { stage: "Assigned", date: c.madeOn, actor: c.assignee, done: true },
    { stage: "Action Taken", date: c.notes[0]?.date || "—", actor: c.notes[0]?.actor || "—", done: c.status !== "Open" },
    { stage: "Fulfilled", date: c.status === "Fulfilled" ? "26 Jun" : "—", actor: "MP Office", done: c.status === "Fulfilled" },
  ];

  return (
    <>
      <SheetHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-mono text-muted-foreground">{c.id}</div>
            <SheetTitle className="text-[#0A1F44] text-lg pr-6">{c.text}</SheetTitle>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <TypeChip t={c.type} />
          <Badge className={`${STATUS_META[c.status]} hover:${STATUS_META[c.status]}`}>{c.status}</Badge>
          {overdue && <Badge className="bg-red-100 text-red-700 hover:bg-red-100">{Math.abs(days)}d overdue</Badge>}
          {!overdue && (c.status === "Open" || c.status === "In Progress") && <Badge variant="outline">Due in {days}d</Badge>}
        </div>
      </SheetHeader>

      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <Field icon={User} label="Made by" value={`${c.madeBy}${c.madeByName ? ` · ${c.madeByName}` : ""}`} />
        <Field icon={User} label="To whom" value={`${c.toWhom} (${c.toWhomKind})`} />
        <Field icon={MapPin} label="Location" value={c.location} />
        <Field icon={CalIcon} label="Context" value={c.context} />
        <Field icon={CalIcon} label="Made on" value={c.madeOn} />
        <Field icon={CalIcon} label="Due" value={c.dueOn} />
        <Field icon={User} label="Responsible" value={c.assignee} />
        <Field icon={Building2} label="Department" value={c.department} />
      </div>

      {/* Timeline */}
      <div className="mt-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Timeline</div>
        <div className="relative pl-6">
          <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />
          {timeline.map((t, i) => (
            <div key={i} className="relative pb-4">
              <div className={`absolute -left-6 top-0.5 h-3.5 w-3.5 rounded-full border-2 ${t.done ? "bg-[#FF9933] border-[#FF9933]" : "bg-white border-slate-300"}`} />
              <div className="text-sm font-medium text-[#0A1F44]">{t.stage}</div>
              <div className="text-xs text-muted-foreground">{t.date} · {t.actor}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Follow-up notes</div>
        <div className="space-y-2">
          {c.notes.length === 0 && <div className="text-xs text-muted-foreground italic">No notes yet</div>}
          {c.notes.map((n, i) => (
            <div key={i} className="text-xs bg-slate-50 border-l-2 border-[#FF9933] px-3 py-2 rounded-r">
              <div className="text-slate-800">{n.text}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{n.date} · {n.actor}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <Input value={note} onChange={e => setNote(e.target.value)} placeholder="Add a follow-up note…" />
          <Button onClick={() => { if (note) { onAddNote(note); setNote(""); toast.success("Note added"); } }} className="bg-[#0A1F44] text-white">Add</Button>
        </div>
      </div>

      {/* Proof */}
      <div className="mt-4 p-3 rounded-md border bg-slate-50">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Closure proof</div>
        {c.proof ? (
          <div className="flex items-center gap-2 text-sm"><Paperclip className="h-4 w-4 text-[#0A1F44]" /><span className="font-medium">{c.proof}</span></div>
        ) : (
          <Button size="sm" variant="outline" onClick={onAttachProof}><Paperclip className="h-3 w-3" /> Attach proof of closure</Button>
        )}
      </div>

      {/* Progress visual */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-1"><span className="text-slate-600">Lifecycle progress</span><span className="font-semibold">{c.status === "Fulfilled" ? "100%" : c.status === "In Progress" ? "60%" : c.status === "Could-not-fulfil" ? "—" : "20%"}</span></div>
        <Progress value={c.status === "Fulfilled" ? 100 : c.status === "In Progress" ? 60 : c.status === "Could-not-fulfil" ? 0 : 20} />
      </div>

      {/* Actions */}
      <div className="mt-6 pt-4 border-t space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</div>
        <div className="grid grid-cols-2 gap-2">
          <Select value={c.status} onValueChange={(v) => onStatus(v as Status)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{(["Open","In Progress","Fulfilled","Could-not-fulfil"] as Status[]).map(s => <SelectItem key={s} value={s}>Update → {s}</SelectItem>)}</SelectContent>
          </Select>
          <Select defaultValue={c.assignee} onValueChange={(v) => toast.success(`Reassigned to ${v}`)}>
            <SelectTrigger><SelectValue placeholder="Reassign…" /></SelectTrigger>
            <SelectContent>{STAFF.map(s => <SelectItem key={s} value={s}>Reassign → {s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        {c.type === "Official letter promised" && (
          <Link to="/recommendation-letters" className="block">
            <Button className="w-full bg-[#FF9933] hover:bg-[#FF9933]/90 text-white"><FileSignature className="h-4 w-4" /> Generate Letter in Letters & Correspondence <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        )}
      </div>
    </>
  );
}

function Field({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
      <div>
        <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
        <div className="text-sm text-[#0A1F44] font-medium">{value}</div>
      </div>
    </div>
  );
}
