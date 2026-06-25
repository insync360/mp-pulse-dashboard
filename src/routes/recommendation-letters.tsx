import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileSignature, Clock, CheckCircle2, XCircle, Plus, Eye, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export const Route = createFileRoute("/recommendation-letters")({
  head: () => ({ meta: [{ title: "Recommendation Letters — MP Pulse" }] }),
  component: LettersPage,
});

const TEMPLATES: Record<string, { title: string; body: (f: any) => string; authority: string }> = {
  "district-officer": {
    title: "Recommendation to District Officer",
    authority: "The Deputy Commissioner, Bengaluru Urban District",
    body: (f) => `Respected Sir/Madam,\n\nI am writing to recommend ${f.recipient || "[Recipient Name]"}, a resident of my constituency, for ${f.purpose || "[Purpose]"}. I have known the applicant and find them to be of sound character and merit.\n\nI request your office to give due consideration to their representation as per applicable rules.\n\nWith regards,`,
  },
  "employment": {
    title: "Reference for Employment",
    authority: "To Whom It May Concern",
    body: (f) => `To Whom It May Concern,\n\nThis is to recommend ${f.recipient || "[Recipient Name]"} for ${f.purpose || "the position under consideration"}. The candidate hails from my constituency and is known to be diligent and committed.\n\nKindly evaluate their candidature on merit.\n\nSincerely,`,
  },
  "scheme": {
    title: "Support for Scheme Eligibility",
    authority: "The Concerned Department, Government of Karnataka",
    body: (f) => `Respected Sir/Madam,\n\nI recommend ${f.recipient || "[Recipient Name]"} for eligibility under ${f.purpose || "[Scheme Name]"}. The applicant satisfies the prescribed criteria and the recommendation is made in public interest.\n\nWith regards,`,
  },
  "introduction": {
    title: "Introduction Letter",
    authority: ((f: any) => f.authority || "[Addressed Authority]") as any,
    body: (f) => `Dear Sir/Madam,\n\nI take pleasure in introducing ${f.recipient || "[Recipient Name]"}, who wishes to meet you regarding ${f.purpose || "[Subject]"}. Kindly extend the necessary courtesies.\n\nRegards,`,
  } as any,
  "general": {
    title: "General Reference",
    authority: "To Whom It May Concern",
    body: (f) => `To Whom It May Concern,\n\nThis is to certify that ${f.recipient || "[Recipient Name]"} is known to me in connection with ${f.purpose || "[Purpose]"} and is recommended for due consideration.\n\nSincerely,`,
  },
};

type Letter = { id: string; recipient: string; purpose: string; authority: string; referredBy: string; status: "Draft" | "Pending Approval" | "Issued" | "Declined"; date: string };

const INITIAL: Letter[] = [
  { id: "REC-2026-061", recipient: "Ramesh Gowda", purpose: "Khata transfer assistance", authority: "BBMP Revenue Officer, Mahadevapura", referredBy: "Sri K. Patil", status: "Pending Approval", date: "26 Jun 2026" },
  { id: "REC-2026-060", recipient: "Lakshmi N.", purpose: "PMAY housing eligibility", authority: "Karnataka Slum Dev Board", referredBy: "RWA Whitefield", status: "Pending Approval", date: "26 Jun 2026" },
  { id: "REC-2026-059", recipient: "Mohammed Faizal", purpose: "Driver post recommendation", authority: "BMTC Depot Manager", referredBy: "Sri B. Rajeev", status: "Pending Approval", date: "25 Jun 2026" },
  { id: "REC-2026-058", recipient: "Anita Sharma", purpose: "Scholarship under SC/ST scheme", authority: "Dept of Social Welfare, GoK", referredBy: "Self", status: "Pending Approval", date: "25 Jun 2026" },
  { id: "REC-2026-057", recipient: "Suresh Kumar", purpose: "Trade license renewal", authority: "BBMP Health Officer", referredBy: "Sri K. Patil", status: "Pending Approval", date: "25 Jun 2026" },
  { id: "REC-2026-056", recipient: "Deepa Rao", purpose: "Introduction to Principal", authority: "Govt. PU College, KR Puram", referredBy: "PTA HSR", status: "Issued", date: "24 Jun 2026" },
  { id: "REC-2026-055", recipient: "Vijay Patil", purpose: "MSME loan reference", authority: "Canara Bank, Marathahalli", referredBy: "FKCCI", status: "Issued", date: "24 Jun 2026" },
  { id: "REC-2026-054", recipient: "Pooja Iyer", purpose: "Ayushman Bharat enrolment", authority: "PHC Bellandur", referredBy: "ASHA Worker", status: "Issued", date: "23 Jun 2026" },
  { id: "REC-2026-053", recipient: "Rajiv Menon", purpose: "BWSSB water connection", authority: "BWSSB Sub-Division East", referredBy: "RWA Hoodi", status: "Issued", date: "23 Jun 2026" },
  { id: "REC-2026-052", recipient: "Sunitha B.", purpose: "Widow pension follow-up", authority: "Tahsildar, Bengaluru East", referredBy: "Anganwadi worker", status: "Issued", date: "22 Jun 2026" },
  { id: "REC-2026-051", recipient: "Imran Khan", purpose: "Police verification expedite", authority: "DCP East, Bengaluru City", referredBy: "Sri B. Rajeev", status: "Declined", date: "22 Jun 2026" },
  { id: "REC-2026-050", recipient: "Geeta Reddy", purpose: "Admission reference", authority: "Bangalore University", referredBy: "Self", status: "Draft", date: "21 Jun 2026" },
];

function StatCard({ icon: Icon, label, value, accent }: any) {
  return (
    <Card><CardContent className="p-5"><div className="flex items-center gap-3">
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${accent}`}><Icon className="h-5 w-5" /></div>
      <div><div className="text-2xl font-bold text-[#0A1F44]">{value}</div><div className="text-xs text-muted-foreground">{label}</div></div>
    </div></CardContent></Card>
  );
}

function statusBadge(s: Letter["status"]) {
  const map = {
    "Draft": "bg-slate-100 text-slate-700",
    "Pending Approval": "bg-amber-100 text-amber-800",
    "Issued": "bg-green-100 text-green-800",
    "Declined": "bg-red-100 text-red-700",
  };
  return <Badge className={`${map[s]} hover:${map[s]}`}>{s}</Badge>;
}

function Letterhead({ letter }: { letter: { recipient: string; purpose: string; authority: string; body: string; date: string } }) {
  return (
    <div className="bg-white border-2 border-[#0A1F44]/20 p-8 font-serif text-sm leading-relaxed">
      <div className="border-b-4 border-[#FF9933] pb-3 mb-4 text-center">
        <div className="text-xl font-bold text-[#0A1F44]">Hon'ble Member of Parliament</div>
        <div className="text-xs text-muted-foreground">Bengaluru Constituency · Lok Sabha</div>
        <div className="text-xs text-muted-foreground">MP Office, Vidhana Soudha Annexe, Bengaluru — 560001</div>
      </div>
      <div className="flex justify-between text-xs mb-4"><span>Ref: REC/2026/{Math.floor(Math.random() * 900) + 100}</span><span>Date: {letter.date}</span></div>
      <div className="mb-3">To,<br /><strong>{letter.authority}</strong></div>
      <div className="mb-3"><strong>Subject:</strong> Recommendation for {letter.recipient || "[Recipient]"} — {letter.purpose || "[Purpose]"}</div>
      <div className="whitespace-pre-line mb-6">{letter.body}</div>
      <div className="mt-10"><div className="border-t border-slate-300 w-48 pt-1 text-xs">(Signature)<br /><strong>Hon'ble MP, Bengaluru</strong></div></div>
    </div>
  );
}

function LettersPage() {
  const [letters, setLetters] = useState<Letter[]>(INITIAL);
  const [open, setOpen] = useState(false);
  const [tmpl, setTmpl] = useState("district-officer");
  const [form, setForm] = useState({ recipient: "", purpose: "", authority: "", referredBy: "" });
  const [viewPdf, setViewPdf] = useState<Letter | null>(null);
  const [rejectFor, setRejectFor] = useState<Letter | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const pending = letters.filter(l => l.status === "Pending Approval").length;
  const t = TEMPLATES[tmpl];
  const previewAuthority = typeof t.authority === "function" ? (t.authority as any)(form) : (form.authority || t.authority);
  const previewBody = t.body(form);

  const createLetter = () => {
    if (!form.recipient || !form.purpose) { toast.error("Recipient and purpose required"); return; }
    const id = `REC-2026-0${Math.floor(Math.random() * 30) + 62}`;
    setLetters(l => [{ id, recipient: form.recipient, purpose: form.purpose, authority: previewAuthority, referredBy: form.referredBy || "Self", status: "Pending Approval", date: "26 Jun 2026" }, ...l]);
    toast.success(`Letter ${id} drafted and routed for MP approval`);
    setForm({ recipient: "", purpose: "", authority: "", referredBy: "" });
    setOpen(false);
  };

  const approve = (l: Letter) => {
    setLetters(arr => arr.map(x => x.id === l.id ? { ...x, status: "Issued" } : x));
    toast.success(`${l.id} approved and issued`);
  };
  const reject = () => {
    if (!rejectFor) return;
    setLetters(arr => arr.map(x => x.id === rejectFor.id ? { ...x, status: "Declined" } : x));
    toast.success(`${rejectFor.id} declined`);
    setRejectFor(null); setRejectReason("");
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-[#0A1F44]">Recommendation Letters</h1>
        <p className="text-sm text-muted-foreground">Draft, approve and issue official recommendations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={FileSignature} label="Requested" value="28" accent="bg-[#0A1F44]/10 text-[#0A1F44]" />
        <StatCard icon={Clock} label="Pending MP approval" value={pending} accent="bg-amber-100 text-amber-700" />
        <StatCard icon={CheckCircle2} label="Issued this month" value="61" accent="bg-green-100 text-green-700" />
        <StatCard icon={XCircle} label="Declined" value="4" accent="bg-red-100 text-red-700" />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{letters.length} letters in workflow</div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white"><Plus className="h-4 w-4" /> New Letter</Button></DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Draft a recommendation letter</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <Label>Template</Label>
                  <Select value={tmpl} onValueChange={setTmpl}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(TEMPLATES).map(([k, v]) => <SelectItem key={k} value={k}>{v.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Recipient name *</Label><Input value={form.recipient} onChange={e => setForm({ ...form, recipient: e.target.value })} /></div>
                <div><Label>Purpose *</Label><Input value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} /></div>
                <div><Label>Addressed authority</Label><Input value={form.authority} onChange={e => setForm({ ...form, authority: e.target.value })} placeholder={typeof t.authority === "string" ? t.authority : ""} /></div>
                <div><Label>Referred by</Label><Input value={form.referredBy} onChange={e => setForm({ ...form, referredBy: e.target.value })} /></div>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                <Letterhead letter={{ recipient: form.recipient, purpose: form.purpose, authority: previewAuthority, body: previewBody, date: "26 Jun 2026" }} />
              </div>
            </div>
            <DialogFooter><Button onClick={createLetter} className="bg-[#0A1F44] text-white">Send for MP Approval</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-amber-300 bg-amber-50/50">
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2 text-amber-900"><AlertTriangle className="h-4 w-4" /> Misuse / Duplicate Checks</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100">2 requests from Sri K. Patil this week</Badge>
          <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100">Repeat recommendation: Ramesh Gowda (3rd in 60 days)</Badge>
          <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100">Similar purpose pattern: 4 BBMP khata transfers via same referrer</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base text-[#0A1F44]">Letters</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Letter ID</TableHead><TableHead>Recipient</TableHead><TableHead>Purpose</TableHead>
              <TableHead>Addressed to</TableHead><TableHead>Referred by</TableHead>
              <TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Action</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {letters.map(l => (
                <TableRow key={l.id}>
                  <TableCell className="font-mono text-xs text-[#0A1F44] font-semibold">{l.id}</TableCell>
                  <TableCell className="font-medium">{l.recipient}</TableCell>
                  <TableCell className="text-sm">{l.purpose}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{l.authority}</TableCell>
                  <TableCell className="text-xs">{l.referredBy}</TableCell>
                  <TableCell>{statusBadge(l.status)}</TableCell>
                  <TableCell className="text-xs">{l.date}</TableCell>
                  <TableCell className="text-right space-x-1">
                    {l.status === "Pending Approval" && (<>
                      <Button size="sm" className="h-7 bg-green-600 hover:bg-green-700 text-white" onClick={() => approve(l)}>Approve</Button>
                      <Button size="sm" variant="outline" className="h-7 border-red-300 text-red-700" onClick={() => setRejectFor(l)}>Reject</Button>
                    </>)}
                    {l.status === "Issued" && (
                      <Button size="sm" variant="outline" className="h-7" onClick={() => setViewPdf(l)}><Eye className="h-3 w-3" /> View PDF</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!viewPdf} onOpenChange={(o) => !o && setViewPdf(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{viewPdf?.id}</DialogTitle></DialogHeader>
          {viewPdf && <Letterhead letter={{ recipient: viewPdf.recipient, purpose: viewPdf.purpose, authority: viewPdf.authority, body: TEMPLATES["general"].body({ recipient: viewPdf.recipient, purpose: viewPdf.purpose }), date: viewPdf.date }} />}
        </DialogContent>
      </Dialog>

      <Dialog open={!!rejectFor} onOpenChange={(o) => !o && setRejectFor(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject {rejectFor?.id}</DialogTitle></DialogHeader>
          <div><Label>Reason</Label><Textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Explain why this letter is being declined…" /></div>
          <DialogFooter><Button variant="destructive" onClick={reject}>Confirm Reject</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
