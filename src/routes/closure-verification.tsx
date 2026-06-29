import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Clock, CheckCircle2, RotateCcw, Star, Search, X, Phone, MessageSquare,
  AlertTriangle, ThumbsUp, ThumbsDown, Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export const Route = createFileRoute("/closure-verification")({
  head: () => ({ meta: [{ title: "Closure Verification — Citizen Pulse" }] }),
  component: ClosureVerificationPage,
});

type VStatus = "Pending" | "Confirmed" | "Reopened";

type Item = {
  id: string; citizen: string; phone: string; ward: string; issue: string;
  resolvedBy: string; resolvedDate: string;
  status: VStatus; score?: number; risk?: "Low" | "Medium" | "High";
  resolvedFlag?: boolean; officialHelpful?: boolean; proofSeen?: boolean; satisfied?: boolean;
  reopenReason?: string;
};

const ITEMS: Item[] = [
  { id: "GR-4488", citizen: "Smt. Sunitha B.", phone: "99024 55***", ward: "KR Puram W-84", issue: "Widow pension delay", resolvedBy: "Vikram T. / Tahsildar", resolvedDate: "22 Jun 2026", status: "Confirmed", score: 5, risk: "Low", resolvedFlag: true, officialHelpful: true, proofSeen: true, satisfied: true },
  { id: "GR-4501", citizen: "Sri Manjunath B.", phone: "94483 22***", ward: "KR Puram W-84", issue: "Water tanker delivery delay", resolvedBy: "Suresh K. / BWSSB", resolvedDate: "24 Jun 2026", status: "Pending" },
  { id: "GR-4507", citizen: "Hoodi Apartment Federation", phone: "98452 11***", ward: "Hoodi W-85", issue: "BESCOM load-shedding", resolvedBy: "Anita R. / BESCOM EE", resolvedDate: "23 Jun 2026", status: "Pending" },
  { id: "GR-4498", citizen: "Sri Krishnamurthy", phone: "98452 33***", ward: "Hoodi W-85", issue: "Pothole on main road", resolvedBy: "Ravi M. / BBMP", resolvedDate: "20 Jun 2026", status: "Reopened", score: 2, risk: "Medium", resolvedFlag: false, officialHelpful: true, satisfied: false, reopenReason: "Patchwork failed in first rain" },
  { id: "GR-4492", citizen: "Smt. Lakshmi N.", phone: "98452 12***", ward: "Whitefield W-149", issue: "PMAY application stuck", resolvedBy: "Vikram T. / Slum Board", resolvedDate: "18 Jun 2026", status: "Confirmed", score: 4, risk: "Low", resolvedFlag: true, officialHelpful: true, satisfied: true },
  { id: "GR-4485", citizen: "Smt. Roopa M.", phone: "98453 22***", ward: "Mahadevapura W-150", issue: "Garbage black spot near park", resolvedBy: "Anita R. / BBMP SWM", resolvedDate: "17 Jun 2026", status: "Confirmed", score: 4, risk: "Low", resolvedFlag: true, officialHelpful: true, satisfied: true },
  { id: "GR-4474", citizen: "Varthur RWA", phone: "—", ward: "Varthur W-150", issue: "SWD encroachment removal", resolvedBy: "Ravi M. / BBMP SWD", resolvedDate: "15 Jun 2026", status: "Reopened", score: 1, risk: "High", resolvedFlag: false, officialHelpful: false, satisfied: false, reopenReason: "Encroachment returned within 1 week — viral video on Twitter" },
  { id: "GR-4469", citizen: "Sri Imran Pasha", phone: "95385 88***", ward: "Bellandur W-150", issue: "Street vendor harassment", resolvedBy: "Anita R. / BBMP", resolvedDate: "14 Jun 2026", status: "Confirmed", score: 5, risk: "Low", resolvedFlag: true, officialHelpful: true, satisfied: true },
  { id: "GR-4463", citizen: "Sri Naveen Kumar", phone: "90080 22***", ward: "Varthur W-150", issue: "Storm-water clogging", resolvedBy: "Ravi M. / BBMP SWD", resolvedDate: "12 Jun 2026", status: "Pending" },
  { id: "GR-4458", citizen: "Smt. Geetha", phone: "95385 41***", ward: "Marathahalli W-84", issue: "Street light not working", resolvedBy: "Anita R. / BBMP", resolvedDate: "10 Jun 2026", status: "Confirmed", score: 5, risk: "Low", resolvedFlag: true, officialHelpful: true, satisfied: true },
  { id: "GR-4452", citizen: "Sri Yusuf Khan", phone: "98456 11***", ward: "Bellandur W-150", issue: "Ration shop overcharging", resolvedBy: "Anita R. / Food Dept", resolvedDate: "09 Jun 2026", status: "Pending" },
  { id: "GR-4445", citizen: "Smt. Kavitha R.", phone: "94823 91***", ward: "Whitefield W-149", issue: "Scholarship pending", resolvedBy: "Priya S. / DDPI", resolvedDate: "07 Jun 2026", status: "Confirmed", score: 4, risk: "Low", resolvedFlag: true, officialHelpful: true, satisfied: true },
];

const STATUS_COLOR: Record<VStatus, string> = {
  "Pending": "bg-amber-100 text-amber-800",
  "Confirmed": "bg-green-100 text-green-800",
  "Reopened": "bg-red-100 text-red-700",
};
const RISK_COLOR: Record<NonNullable<Item["risk"]>, string> = {
  "Low": "bg-slate-100 text-slate-700",
  "Medium": "bg-amber-100 text-amber-800",
  "High": "bg-red-100 text-red-700",
};

function StatCard({ icon: Icon, label, value, accent }: any) {
  return (
    <Card><CardContent className="p-5"><div className="flex items-center gap-3">
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${accent}`}><Icon className="h-5 w-5" /></div>
      <div><div className="text-2xl font-bold text-[#0A1F44]">{value}</div><div className="text-xs text-muted-foreground">{label}</div></div>
    </div></CardContent></Card>
  );
}

function StarRow({ n, onChange }: { n: number; onChange?: (v: number) => void }) {
  return <div className="flex gap-1">{[1,2,3,4,5].map(i => (
    <button key={i} disabled={!onChange} onClick={() => onChange && onChange(i)}>
      <Star className={`h-5 w-5 ${i <= n ? "fill-[#FF9933] text-[#FF9933]" : "text-slate-300"}`} />
    </button>
  ))}</div>;
}

function ClosureVerificationPage() {
  const [items, setItems] = useState<Item[]>(ITEMS);
  const [drawer, setDrawer] = useState<Item | null>(null);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("Pending");

  // Local capture state
  const [resolvedFlag, setResolvedFlag] = useState<boolean | null>(null);
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [proof, setProof] = useState<boolean>(false);
  const [satisfied, setSatisfied] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [risk, setRisk] = useState<Item["risk"]>("Low");
  const [reopenReason, setReopenReason] = useState("");

  const open = (i: Item) => {
    setDrawer(i);
    setResolvedFlag(i.resolvedFlag ?? null); setHelpful(i.officialHelpful ?? null);
    setProof(!!i.proofSeen); setSatisfied(i.satisfied ?? null); setScore(i.score ?? 0); setRisk(i.risk ?? "Low"); setReopenReason(i.reopenReason ?? "");
  };

  const filtered = items.filter(i =>
    (tab === "All" || i.status === tab) &&
    (!q || i.citizen.toLowerCase().includes(q.toLowerCase()) || i.id.toLowerCase().includes(q.toLowerCase()))
  );

  const stats = useMemo(() => {
    const pending = items.filter(i => i.status === "Pending").length;
    const confirmed = items.filter(i => i.status === "Confirmed").length;
    const reopened = items.filter(i => i.status === "Reopened").length;
    const scored = items.filter(i => i.score);
    const avg = scored.length ? (scored.reduce((a, b) => a + (b.score || 0), 0) / scored.length) : 0;
    return { pending: 34, confirmed: 212, reopened: 18, avg: 4.2, _pending: pending, _confirmed: confirmed, _reopened: reopened, _avg: avg };
  }, [items]);

  const confirmClose = () => {
    if (!drawer) return;
    setItems(arr => arr.map(x => x.id === drawer.id ? { ...x, status: "Confirmed", score, risk, resolvedFlag: !!resolvedFlag, officialHelpful: !!helpful, proofSeen: proof, satisfied: !!satisfied } : x));
    toast.success(`Closure confirmed for ${drawer.id}`);
    setDrawer(null);
  };
  const reopen = () => {
    if (!drawer) return;
    setItems(arr => arr.map(x => x.id === drawer.id ? { ...x, status: "Reopened", score, risk, satisfied: false, reopenReason } : x));
    toast.error(`${drawer.id} reopened — pushed back into Grievances queue`);
    setDrawer(null);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Closure Verification</h1>
          <p className="text-sm text-muted-foreground">Citizens confirm resolution — not officials. <span className="text-[#FF9933] font-medium">This is what makes Citizen Pulse different from ordinary grievance systems.</span></p>
        </div>
        <Badge className="bg-[#FF9933]/15 text-[#FF9933] hover:bg-[#FF9933]/15 gap-1"><Sparkles className="h-3 w-3" /> Closure is a citizen privilege, not a clerk's tick-box</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Clock} label="Awaiting Verification" value={stats.pending} accent="bg-amber-100 text-amber-700" />
        <StatCard icon={CheckCircle2} label="Confirmed Resolved" value={stats.confirmed} accent="bg-green-100 text-green-700" />
        <StatCard icon={RotateCcw} label="Reopened" value={stats.reopened} accent="bg-red-100 text-red-700" />
        <StatCard icon={Star} label="Avg Satisfaction" value={`${stats.avg}/5`} accent="bg-[#FF9933]/15 text-[#FF9933]" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base text-[#0A1F44]">Verification queue</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 rounded-md p-1">
                {(["Pending","Confirmed","Reopened","All"]).map(t => (
                  <button key={t} onClick={() => setTab(t)} className={`text-xs px-3 py-1 rounded ${tab === t ? "bg-white shadow-sm text-[#0A1F44] font-medium" : "text-slate-600"}`}>{t}</button>
                ))}
              </div>
              <div className="relative"><Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={e => setQ(e.target.value)} placeholder="Ticket / citizen" className="pl-8 h-9 w-52" /></div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Ticket</TableHead><TableHead>Citizen</TableHead><TableHead>Issue</TableHead>
              <TableHead>Resolved by</TableHead><TableHead>Resolved on</TableHead>
              <TableHead>Verification</TableHead><TableHead>Score</TableHead><TableHead>Risk</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(i => (
                <TableRow key={i.id} className="cursor-pointer hover:bg-slate-50" onClick={() => open(i)}>
                  <TableCell className="font-mono text-xs">{i.id}</TableCell>
                  <TableCell><div className="text-sm font-medium text-[#0A1F44]">{i.citizen}</div><div className="text-[10px] text-muted-foreground">{i.ward}</div></TableCell>
                  <TableCell className="text-xs max-w-[220px]"><div className="line-clamp-2">{i.issue}</div></TableCell>
                  <TableCell className="text-xs">{i.resolvedBy}</TableCell>
                  <TableCell className="text-xs">{i.resolvedDate}</TableCell>
                  <TableCell><Badge className={`${STATUS_COLOR[i.status]} hover:${STATUS_COLOR[i.status]}`}>{i.status}</Badge></TableCell>
                  <TableCell>{i.score ? <StarRow n={i.score} /> : <span className="text-xs text-slate-400">—</span>}</TableCell>
                  <TableCell>{i.risk ? <Badge className={`${RISK_COLOR[i.risk]} hover:${RISK_COLOR[i.risk]}`}>{i.risk}</Badge> : <span className="text-xs text-slate-400">—</span>}</TableCell>
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
                    <SheetTitle className="text-[#0A1F44]">{drawer.citizen}</SheetTitle>
                    <div className="text-sm text-slate-600">{drawer.phone} · {drawer.ward}</div>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => setDrawer(null)}><X className="h-4 w-4" /></Button>
                </div>
                <div className="mt-2"><Badge className={STATUS_COLOR[drawer.status]}>{drawer.status}</Badge></div>
              </SheetHeader>

              <div className="mt-4 p-3 rounded-md bg-slate-50 text-sm">
                <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Issue</div>
                <div>{drawer.issue}</div>
                <div className="text-xs text-slate-500 mt-2">Resolved by {drawer.resolvedBy} on {drawer.resolvedDate}</div>
              </div>

              {/* Templated outreach */}
              <div className="mt-5 p-3 rounded-md bg-[#0A1F44]/5 border border-[#0A1F44]/20">
                <div className="text-xs font-semibold uppercase text-[#0A1F44] mb-2">Reach out to citizen</div>
                <div className="text-xs bg-white border rounded p-2 mb-2 text-slate-700 italic">
                  "Namaskara {drawer.citizen.split(" ")[1] || drawer.citizen}, this is from the MP office. Regarding your complaint about <b>{drawer.issue}</b> — we have been informed it was resolved on {drawer.resolvedDate}. May I confirm whether the issue is actually fixed for you?"
                </div>
                <div className="flex gap-2"><Button size="sm" className="bg-green-600 text-white"><Phone className="h-3 w-3" /> Call</Button><Button size="sm" variant="outline"><MessageSquare className="h-3 w-3" /> WhatsApp</Button></div>
              </div>

              {/* Capture answers */}
              <div className="mt-5 space-y-3">
                <div className="text-xs font-semibold uppercase text-slate-500">Capture citizen's answers</div>

                <YesNo label="Was the issue actually resolved?" value={resolvedFlag} onChange={setResolvedFlag} />
                <YesNo label="Was the responsible official helpful?" value={helpful} onChange={setHelpful} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={proof} onChange={e => setProof(e.target.checked)} className="accent-[#FF9933]" /> Proof seen (photo / video / shared)</label>
                <YesNo label="Citizen satisfied overall?" value={satisfied} onChange={setSatisfied} />

                <div>
                  <div className="text-xs font-semibold text-slate-700 mb-1">Satisfaction score</div>
                  <StarRow n={score} onChange={setScore} />
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Political / social risk flag</div>
                  <Select value={risk} onValueChange={v => setRisk(v as Item["risk"])}><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{(["Low","Medium","High"] as const).map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                {satisfied === false && (
                  <div>
                    <div className="text-xs font-semibold text-slate-700 mb-1">Reason for reopening</div>
                    <Textarea rows={2} value={reopenReason} onChange={e => setReopenReason(e.target.value)} placeholder="e.g. Patchwork failed in first rain; encroachment returned…" />
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t grid grid-cols-2 gap-2">
                <Button variant="outline" className="border-red-300 text-red-700" onClick={reopen}><ThumbsDown className="h-4 w-4" /> Reopen</Button>
                <Button className="bg-green-600 text-white" onClick={confirmClose}><ThumbsUp className="h-4 w-4" /> Confirm Closed</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function YesNo({ label, value, onChange }: { label: string; value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div>
      <div className="text-xs font-semibold text-slate-700 mb-1">{label}</div>
      <div className="flex gap-2">
        <button onClick={() => onChange(true)} className={`text-xs px-3 py-1.5 rounded-md border ${value === true ? "border-green-500 bg-green-50 text-green-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>Yes</button>
        <button onClick={() => onChange(false)} className={`text-xs px-3 py-1.5 rounded-md border ${value === false ? "border-red-500 bg-red-50 text-red-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>No</button>
      </div>
    </div>
  );
}
