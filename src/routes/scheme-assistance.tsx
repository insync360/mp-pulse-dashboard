import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  FileCheck, Gift, Clock, XCircle, Search, X, CheckCircle2, Circle, AlertCircle,
  ExternalLink, MessageSquare, ArrowUpRight, User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const Route = createFileRoute("/scheme-assistance")({
  head: () => ({ meta: [{ title: "Scheme Assistance — Citizen Pulse" }] }),
  component: SchemeAssistancePage,
});

type Eligibility = "Eligible" | "Check" | "Ineligible";
type AppStatus = "Not started" | "Submitted" | "Under review" | "Approved" | "Rejected";
type Benefit = "Received" | "Pending" | "—";

const SCHEMES = [
  { key: "PMAY", name: "PMAY (Housing)", portal: "pmaymis.gov.in", dept: "MoHUA / Slum Board" },
  { key: "Ayushman", name: "Ayushman Bharat", portal: "pmjay.gov.in", dept: "NHA / Health Dept" },
  { key: "Pension", name: "Old-Age / Widow / Disability Pension", portal: "sevasindhu.karnataka.gov.in", dept: "Revenue Dept" },
  { key: "Scholarship", name: "Scholarship", portal: "ssp.postmatric.karnataka.gov.in", dept: "Backward Classes / Edu" },
  { key: "Ration", name: "Ration Card", portal: "ahara.kar.nic.in", dept: "Food & Civil Supplies" },
  { key: "Ujjwala", name: "Ujjwala (LPG)", portal: "pmuy.gov.in", dept: "MoP&NG" },
  { key: "Mudra", name: "Mudra Loan", portal: "mudra.org.in", dept: "Bank / DFS" },
  { key: "Caste", name: "Caste / Income Certificate", portal: "nadakacheri.karnataka.gov.in", dept: "Revenue (Tahsil)" },
  { key: "Vendor", name: "Street Vendor Scheme", portal: "pmsvanidhi.mohua.gov.in", dept: "BBMP / MoHUA" },
  { key: "Farmer", name: "Farmer Schemes (PM-Kisan, Raitha)", portal: "fruits.karnataka.gov.in", dept: "Agriculture" },
  { key: "Skill", name: "Skill Development (PMKVY / KSDC)", portal: "skillindiadigital.gov.in", dept: "MSDE / KSDC" },
];

const DOC_TEMPLATES: Record<string, string[]> = {
  PMAY: ["Aadhaar", "Income certificate", "Khata / land doc", "Bank passbook", "Caste certificate", "Photo"],
  Ayushman: ["Aadhaar", "Ration card", "Mobile no.", "Family details"],
  Pension: ["Aadhaar", "Age proof", "Bank passbook", "Income certificate", "Photo"],
  Scholarship: ["Aadhaar", "Bank passbook", "Income cert", "Caste cert", "Marks card", "School bonafide"],
  Ration: ["Aadhaar (all members)", "Address proof", "Income cert", "Photo"],
  Ujjwala: ["Aadhaar", "Ration card", "Bank passbook"],
  Mudra: ["Aadhaar", "Business plan", "Bank statement", "Photo"],
  Caste: ["Aadhaar", "Parents' caste cert", "Address proof"],
  Vendor: ["Aadhaar", "Vendor ID / BBMP", "Bank passbook"],
  Farmer: ["Aadhaar", "RTC / Pahani", "Bank passbook"],
  Skill: ["Aadhaar", "Education cert", "Bank passbook"],
};

type App = {
  id: string;
  citizen: string;
  phone: string;
  ward: string;
  scheme: string;
  eligibility: Eligibility;
  docsHave: number; docsNeed: number;
  status: AppStatus;
  staff: string;
  followUp: string;
  benefit: Benefit;
  rejectionReason?: string;
  appealStage?: string;
  timeline: { date: string; text: string }[];
};

const APPS: App[] = [
  { id: "SCH-2026-218", citizen: "Smt. Lakshmi N.", phone: "98452 11***", ward: "Whitefield W-149", scheme: "PMAY", eligibility: "Eligible", docsHave: 4, docsNeed: 6, status: "Under review", staff: "Vikram T.", followUp: "30 Jun 2026", benefit: "Pending",
    timeline: [{ date: "12 May", text: "Application received at MP office" }, { date: "20 May", text: "Submitted to Slum Board" }, { date: "10 Jun", text: "Survey scheduled" }],
  },
  { id: "SCH-2026-217", citizen: "Sri Manjunath B.", phone: "94483 22***", ward: "KR Puram W-84", scheme: "Pension", eligibility: "Eligible", docsHave: 5, docsNeed: 5, status: "Approved", staff: "Priya S.", followUp: "—", benefit: "Received",
    timeline: [{ date: "08 May", text: "Eligibility verified" }, { date: "15 May", text: "Submitted via Seva Sindhu" }, { date: "06 Jun", text: "First credit received" }],
  },
  { id: "SCH-2026-216", citizen: "Smt. Sunitha B.", phone: "99024 55***", ward: "KR Puram W-84", scheme: "Pension", eligibility: "Eligible", docsHave: 5, docsNeed: 5, status: "Approved", staff: "Priya S.", followUp: "—", benefit: "Received", timeline: [{ date: "06 Jun", text: "Pension credited" }] },
  { id: "SCH-2026-215", citizen: "Sri Ramesh K.", phone: "98765 12***", ward: "Hoodi W-85", scheme: "Ration", eligibility: "Check", docsHave: 2, docsNeed: 4, status: "Not started", staff: "Anita R.", followUp: "29 Jun 2026", benefit: "—", timeline: [{ date: "20 Jun", text: "Walked in; needs income certificate first" }] },
  { id: "SCH-2026-214", citizen: "Smt. Sridevi", phone: "97412 33***", ward: "Mahadevapura W-150", scheme: "Ayushman", eligibility: "Eligible", docsHave: 4, docsNeed: 4, status: "Submitted", staff: "Anita R.", followUp: "02 Jul 2026", benefit: "Pending", timeline: [{ date: "22 Jun", text: "Submitted at CSC" }] },
  { id: "SCH-2026-213", citizen: "Sri Imran Pasha", phone: "95385 88***", ward: "Bellandur W-150", scheme: "Vendor", eligibility: "Eligible", docsHave: 3, docsNeed: 3, status: "Approved", staff: "Vikram T.", followUp: "—", benefit: "Received", timeline: [{ date: "10 Jun", text: "PM SVANidhi loan disbursed ₹10,000" }] },
  { id: "SCH-2026-212", citizen: "Smt. Kavitha R.", phone: "94823 91***", ward: "Whitefield W-149", scheme: "Scholarship", eligibility: "Eligible", docsHave: 6, docsNeed: 6, status: "Approved", staff: "Priya S.", followUp: "—", benefit: "Received", timeline: [{ date: "15 May", text: "SSP application approved" }] },
  { id: "SCH-2026-211", citizen: "Sri Naveen Kumar", phone: "90080 22***", ward: "Varthur W-150", scheme: "Mudra", eligibility: "Eligible", docsHave: 3, docsNeed: 4, status: "Under review", staff: "Vikram T.", followUp: "01 Jul 2026", benefit: "Pending", timeline: [{ date: "18 Jun", text: "Submitted at Canara Bank Varthur" }] },
  { id: "SCH-2026-210", citizen: "Smt. Pushpa", phone: "98456 71***", ward: "KR Puram W-84", scheme: "Ujjwala", eligibility: "Eligible", docsHave: 3, docsNeed: 3, status: "Approved", staff: "Anita R.", followUp: "—", benefit: "Received", timeline: [{ date: "22 May", text: "Connection delivered" }] },
  { id: "SCH-2026-209", citizen: "Sri Hanumantha", phone: "94482 11***", ward: "Avalahalli (GP)", scheme: "Farmer", eligibility: "Eligible", docsHave: 3, docsNeed: 3, status: "Approved", staff: "Suresh K.", followUp: "—", benefit: "Received", timeline: [{ date: "12 Jun", text: "PM-Kisan instalment credited" }] },
  { id: "SCH-2026-208", citizen: "Smt. Roopa M.", phone: "98453 22***", ward: "Mahadevapura W-150", scheme: "PMAY", eligibility: "Ineligible", docsHave: 6, docsNeed: 6, status: "Rejected", staff: "Vikram T.", followUp: "28 Jun 2026", benefit: "—", rejectionReason: "Already owns pucca house in same district", appealStage: "Appeal under review by DC", timeline: [{ date: "05 May", text: "Application rejected by Slum Board" }, { date: "20 May", text: "Appeal filed by MP office" }] },
  { id: "SCH-2026-207", citizen: "Sri Mahesh", phone: "98765 99***", ward: "Hoodi W-85", scheme: "Skill", eligibility: "Eligible", docsHave: 3, docsNeed: 3, status: "Approved", staff: "Lakshmi N.", followUp: "—", benefit: "Received", timeline: [{ date: "01 Jun", text: "PMKVY batch enrolled" }] },
  { id: "SCH-2026-206", citizen: "Smt. Geetha", phone: "95385 41***", ward: "Marathahalli W-84", scheme: "Caste", eligibility: "Eligible", docsHave: 3, docsNeed: 3, status: "Approved", staff: "Anita R.", followUp: "—", benefit: "Received", timeline: [{ date: "12 Jun", text: "Issued at Nadakacheri" }] },
  { id: "SCH-2026-205", citizen: "Sri Yusuf Khan", phone: "98456 11***", ward: "Bellandur W-150", scheme: "Pension", eligibility: "Check", docsHave: 3, docsNeed: 5, status: "Not started", staff: "Priya S.", followUp: "30 Jun 2026", benefit: "—", timeline: [] },
  { id: "SCH-2026-204", citizen: "Smt. Anitha", phone: "98452 89***", ward: "Whitefield W-149", scheme: "Ayushman", eligibility: "Eligible", docsHave: 4, docsNeed: 4, status: "Approved", staff: "Anita R.", followUp: "—", benefit: "Received", timeline: [] },
  { id: "SCH-2026-203", citizen: "Sri Krishna", phone: "94821 11***", ward: "KR Puram W-84", scheme: "Ration", eligibility: "Eligible", docsHave: 4, docsNeed: 4, status: "Submitted", staff: "Anita R.", followUp: "05 Jul 2026", benefit: "Pending", timeline: [{ date: "20 Jun", text: "Submitted via Ahara portal" }] },
];

const EL_COLOR: Record<Eligibility, string> = { "Eligible": "bg-green-100 text-green-800", "Check": "bg-amber-100 text-amber-800", "Ineligible": "bg-red-100 text-red-700" };
const STATUS_COLOR: Record<AppStatus, string> = { "Not started": "bg-slate-100 text-slate-700", "Submitted": "bg-blue-100 text-blue-800", "Under review": "bg-indigo-100 text-indigo-800", "Approved": "bg-green-100 text-green-800", "Rejected": "bg-red-100 text-red-700" };
const BEN_COLOR: Record<Benefit, string> = { "Received": "bg-green-100 text-green-800", "Pending": "bg-amber-100 text-amber-800", "—": "bg-slate-100 text-slate-500" };

function StatCard({ icon: Icon, label, value, accent, danger }: any) {
  return (
    <Card className={danger ? "border-red-200" : ""}>
      <CardContent className="p-5"><div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${accent}`}><Icon className="h-5 w-5" /></div>
        <div><div className={`text-2xl font-bold ${danger ? "text-red-600" : "text-[#0A1F44]"}`}>{value}</div><div className="text-xs text-muted-foreground">{label}</div></div>
      </div></CardContent>
    </Card>
  );
}

function SchemeAssistancePage() {
  const [q, setQ] = useState("");
  const [scheme, setScheme] = useState("all");
  const [status, setStatus] = useState("all");
  const [drawer, setDrawer] = useState<App | null>(null);
  const [docState, setDocState] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => APPS.filter(a =>
    (scheme === "all" || a.scheme === scheme) &&
    (status === "all" || a.status === status) &&
    (!q || a.citizen.toLowerCase().includes(q.toLowerCase()) || a.id.toLowerCase().includes(q.toLowerCase()))
  ), [q, scheme, status]);

  const openDrawer = (a: App) => {
    setDrawer(a);
    const initial: Record<string, boolean> = {};
    (DOC_TEMPLATES[a.scheme] || []).forEach((d, i) => { initial[d] = i < a.docsHave; });
    setDocState(initial);
  };

  const docsCount = Object.values(docState).filter(Boolean).length;
  const docsTotal = Object.keys(docState).length;

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-[#0A1F44]">Scheme Assistance</h1>
        <p className="text-sm text-muted-foreground">Help every eligible citizen access central & state welfare schemes — end-to-end.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={FileCheck} label="Active Applications" value="218" accent="bg-blue-100 text-blue-700" />
        <StatCard icon={Gift} label="Benefits Delivered" value="1,140" accent="bg-green-100 text-green-700" />
        <StatCard icon={Clock} label="Pending Verification" value="46" accent="bg-amber-100 text-amber-700" />
        <StatCard icon={XCircle} label="Rejected / Appeal" value="19" accent="bg-red-100 text-red-700" danger />
      </div>

      {/* Catalog */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm text-[#0A1F44]">Scheme catalog</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {SCHEMES.map(s => (
              <button key={s.key} onClick={() => setScheme(s.key)}
                className={`text-xs px-3 py-2 rounded-lg border text-left ${scheme === s.key ? "border-[#FF9933] bg-[#FF9933]/10 text-[#FF9933]" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                <div className="font-medium">{s.name}</div>
                <div className="text-[10px] text-slate-500">{s.dept}</div>
              </button>
            ))}
            {scheme !== "all" && <button onClick={() => setScheme("all")} className="text-xs text-slate-500 underline ml-1">Clear</button>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base text-[#0A1F44]">Applications</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative"><Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={e => setQ(e.target.value)} placeholder="Citizen / app ID" className="pl-8 h-9 w-56" /></div>
              <Select value={status} onValueChange={setStatus}><SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All statuses</SelectItem>{(["Not started","Submitted","Under review","Approved","Rejected"] as AppStatus[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Citizen</TableHead><TableHead>Scheme</TableHead><TableHead>Ward</TableHead>
              <TableHead>Eligibility</TableHead><TableHead>Docs</TableHead><TableHead>Status</TableHead>
              <TableHead>Staff</TableHead><TableHead>Follow-up</TableHead><TableHead>Benefit</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(a => (
                <TableRow key={a.id} className="cursor-pointer hover:bg-slate-50" onClick={() => openDrawer(a)}>
                  <TableCell><div className="text-sm font-medium text-[#0A1F44]">{a.citizen}</div><div className="text-[10px] font-mono text-muted-foreground">{a.id}</div></TableCell>
                  <TableCell className="text-xs">{SCHEMES.find(s => s.key === a.scheme)?.name || a.scheme}</TableCell>
                  <TableCell className="text-xs">{a.ward}</TableCell>
                  <TableCell><Badge className={`${EL_COLOR[a.eligibility]} hover:${EL_COLOR[a.eligibility]}`}>{a.eligibility}</Badge></TableCell>
                  <TableCell className="text-xs"><div className="flex items-center gap-2"><span>{a.docsHave}/{a.docsNeed}</span><Progress value={(a.docsHave/a.docsNeed)*100} className="w-12 h-1.5" /></div></TableCell>
                  <TableCell><Badge className={`${STATUS_COLOR[a.status]} hover:${STATUS_COLOR[a.status]}`}>{a.status}</Badge></TableCell>
                  <TableCell className="text-xs">{a.staff}</TableCell>
                  <TableCell className="text-xs">{a.followUp}</TableCell>
                  <TableCell><Badge className={`${BEN_COLOR[a.benefit]} hover:${BEN_COLOR[a.benefit]}`}>{a.benefit}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!drawer} onOpenChange={(o) => !o && setDrawer(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {drawer && (() => {
            const sch = SCHEMES.find(s => s.key === drawer.scheme)!;
            return (
              <>
                <SheetHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-mono text-muted-foreground">{drawer.id}</div>
                      <SheetTitle className="text-[#0A1F44]">{drawer.citizen}</SheetTitle>
                      <div className="text-sm text-slate-600 flex items-center gap-2"><User className="h-3 w-3" />{drawer.phone} · {drawer.ward}</div>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => setDrawer(null)}><X className="h-4 w-4" /></Button>
                  </div>
                  <div className="flex gap-2 flex-wrap mt-2">
                    <Badge className={STATUS_COLOR[drawer.status]}>{drawer.status}</Badge>
                    <Badge className={EL_COLOR[drawer.eligibility]}>{drawer.eligibility}</Badge>
                    <Badge variant="outline">{sch.name}</Badge>
                  </div>
                </SheetHeader>

                {/* Eligibility checker */}
                <div className="mt-5 p-3 rounded-md bg-[#FF9933]/5 border border-[#FF9933]/30">
                  <div className="text-xs font-semibold uppercase text-[#FF9933] mb-2">Eligibility checker</div>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2"><Check ok={drawer.eligibility === "Eligible"} /> Resident of constituency for &gt; 1 year</div>
                    <div className="flex items-center gap-2"><Check ok={drawer.eligibility !== "Ineligible"} /> Income within scheme limit (₹{drawer.scheme === "PMAY" ? "3 L" : "1 L"} p.a.)</div>
                    <div className="flex items-center gap-2"><Check ok={drawer.scheme !== "PMAY" || drawer.eligibility !== "Ineligible"} /> Does not already own a pucca house (PMAY only)</div>
                    <div className="flex items-center gap-2"><Check ok /> Valid Aadhaar + bank account</div>
                  </div>
                </div>

                {/* Document checklist */}
                <div className="mt-5">
                  <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Document checklist ({docsCount}/{docsTotal})</div>
                  <div className="space-y-1">
                    {Object.keys(docState).map(d => (
                      <label key={d} className="flex items-center gap-2 text-sm cursor-pointer">
                        <button onClick={() => setDocState(s => ({ ...s, [d]: !s[d] }))}>
                          {docState[d] ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Circle className="h-4 w-4 text-slate-300" />}
                        </button>
                        <span className={docState[d] ? "text-slate-700" : "text-slate-500"}>{d}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-5">
                  <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Application status timeline</div>
                  {drawer.timeline.length === 0 && <div className="text-xs text-muted-foreground italic">Not started</div>}
                  <div className="relative pl-6">
                    <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />
                    {drawer.timeline.map((t, i) => (
                      <div key={i} className="relative pb-3">
                        <div className="absolute -left-6 top-0.5 h-3.5 w-3.5 rounded-full bg-[#FF9933] border-2 border-[#FF9933]" />
                        <div className="text-sm">{t.text}</div>
                        <div className="text-[10px] text-muted-foreground">{t.date}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rejection / appeal */}
                {drawer.status === "Rejected" && (
                  <div className="mt-5 p-3 rounded-md bg-red-50 border border-red-200">
                    <div className="text-xs font-semibold uppercase text-red-700 mb-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />Rejection reason</div>
                    <div className="text-sm text-red-900">{drawer.rejectionReason}</div>
                    <div className="text-xs text-red-700 mt-2"><span className="font-semibold">Appeal:</span> {drawer.appealStage}</div>
                  </div>
                )}

                {/* Department + portal */}
                <div className="mt-5 p-3 rounded-md bg-slate-50 border text-sm">
                  <div className="text-xs font-semibold uppercase text-slate-500 mb-1">Department & portal</div>
                  <div className="text-slate-700">{sch.dept}</div>
                  <a className="text-[#FF9933] text-xs flex items-center gap-1 mt-1" href={`https://${sch.portal}`} target="_blank" rel="noreferrer">{sch.portal} <ExternalLink className="h-3 w-3" /></a>
                </div>

                <div className="mt-5 pt-4 border-t grid grid-cols-2 gap-2">
                  <Button className="bg-[#0A1F44] text-white" onClick={() => toast.success("Citizen notified via WhatsApp")}><MessageSquare className="h-4 w-4" /> Notify Citizen</Button>
                  <Button className="bg-[#FF9933] text-white" onClick={() => toast.success("Escalated to district authority")}><ArrowUpRight className="h-4 w-4" /> Escalate / Appeal</Button>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Check({ ok }: { ok: boolean }) {
  return ok ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-500" />;
}
