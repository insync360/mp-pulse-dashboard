import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Users, MessageCircle, Mail, CheckCircle2, XCircle, Search, Save, Bookmark, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export const Route = createFileRoute("/citizen-database")({
  head: () => ({ meta: [{ title: "Citizen Database — MP Pulse" }] }),
  component: CitizenDatabasePage,
});

const LOCALITIES = ["Mahadevapura", "Whitefield", "KR Puram", "Marathahalli", "HSR Layout", "Bellandur", "Hoodi", "Varthur"];
const ISSUES = ["Water", "Roads", "Electricity", "Sanitation", "Police", "Health", "Education", "Traffic", "Civic/BBMP"];
const CONSENT = ["Opted-in", "Opted-out", "Unknown"] as const;

type Consent = typeof CONSENT[number];
type Citizen = {
  id: string; name: string; locality: string; phone: string; email: string;
  issues: string[]; last: string; consent: Consent;
};

const mask = (p: string) => p.replace(/(\+91 \d{2})\d{6}(\d{2})/, "$1••••••$2");

const CITIZENS: Citizen[] = [
  { id: "C-1041", name: "Ramesh Gowda", locality: "KR Puram", phone: "+91 98 86452310", email: "ramesh.g@gmail.com", issues: ["Water", "Sanitation"], last: "2 days ago", consent: "Opted-in" },
  { id: "C-1042", name: "Lakshmi Narayan", locality: "Whitefield", phone: "+91 97 41203398", email: "lakshmi.n@yahoo.in", issues: ["Roads"], last: "5 days ago", consent: "Opted-in" },
  { id: "C-1043", name: "Anita Sharma", locality: "Mahadevapura", phone: "+91 99 02345671", email: "", issues: ["Water"], last: "1 day ago", consent: "Opted-in" },
  { id: "C-1044", name: "Mohammed Faizal", locality: "Hoodi", phone: "+91 96 11458820", email: "faizal.m@outlook.com", issues: ["Police", "Civic/BBMP"], last: "Today", consent: "Opted-in" },
  { id: "C-1045", name: "Suresh Kumar", locality: "Bellandur", phone: "+91 98 45109832", email: "sureshk@gmail.com", issues: ["Traffic"], last: "1 week ago", consent: "Unknown" },
  { id: "C-1046", name: "Deepa Rao", locality: "HSR Layout", phone: "+91 90 19023487", email: "deeparao@gmail.com", issues: ["Health"], last: "3 days ago", consent: "Opted-in" },
  { id: "C-1047", name: "Vijay Patil", locality: "Marathahalli", phone: "+91 95 38201145", email: "vpatil@rediffmail.com", issues: ["Water", "Roads"], last: "2 weeks ago", consent: "Opted-out" },
  { id: "C-1048", name: "Sunita Reddy", locality: "KR Puram", phone: "+91 98 99230841", email: "", issues: ["Water"], last: "Today", consent: "Opted-in" },
  { id: "C-1049", name: "Arjun Menon", locality: "Whitefield", phone: "+91 99 71045528", email: "arjun.m@gmail.com", issues: ["Education"], last: "4 days ago", consent: "Opted-in" },
  { id: "C-1050", name: "Pooja Singh", locality: "Varthur", phone: "+91 97 02319984", email: "pooja.s@gmail.com", issues: ["Sanitation", "Water"], last: "6 days ago", consent: "Opted-in" },
  { id: "C-1051", name: "Hari Prasad", locality: "Mahadevapura", phone: "+91 98 41902237", email: "", issues: ["Electricity"], last: "1 day ago", consent: "Unknown" },
  { id: "C-1052", name: "Geetha Iyer", locality: "KR Puram", phone: "+91 99 87231045", email: "geetha.i@gmail.com", issues: ["Water"], last: "3 days ago", consent: "Opted-in" },
  { id: "C-1053", name: "Naveen Shetty", locality: "Bellandur", phone: "+91 96 70128834", email: "nshetty@gmail.com", issues: ["Roads", "Traffic"], last: "1 week ago", consent: "Opted-in" },
  { id: "C-1054", name: "Farida Khan", locality: "Hoodi", phone: "+91 98 12937745", email: "farida.k@yahoo.com", issues: ["Health"], last: "Today", consent: "Opted-out" },
  { id: "C-1055", name: "Kiran Bhat", locality: "Marathahalli", phone: "+91 99 03457721", email: "kiran.b@gmail.com", issues: ["Civic/BBMP"], last: "2 days ago", consent: "Opted-in" },
  { id: "C-1056", name: "Mahesh Reddy", locality: "KR Puram", phone: "+91 97 88210945", email: "", issues: ["Water", "Sanitation"], last: "5 days ago", consent: "Opted-in" },
];

const SAVED_SEGMENTS = [
  { name: "KR Puram — Water complainants", count: 412 },
  { name: "Whitefield — All opted-in", count: 1180 },
  { name: "Mahadevapura — Sanitation", count: 287 },
];

function StatCard({ icon: Icon, label, value, accent }: any) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="mt-1.5 text-2xl font-bold text-navy">{value}</div>
          </div>
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ConsentBadge({ c }: { c: Consent }) {
  const styles = c === "Opted-in"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : c === "Opted-out"
    ? "bg-red-50 text-red-700 border-red-200"
    : "bg-slate-100 text-slate-600 border-slate-200";
  return <Badge variant="outline" className={`${styles} font-medium`}>{c}</Badge>;
}

function CitizenDatabasePage() {
  const [search, setSearch] = useState("");
  const [segLocalities, setSegLocalities] = useState<string[]>([]);
  const [segIssue, setSegIssue] = useState<string>("any");
  const [segConsent, setSegConsent] = useState<string>("any");
  const [savedSegments, setSavedSegments] = useState(SAVED_SEGMENTS);

  const toggleLoc = (l: string) =>
    setSegLocalities(s => s.includes(l) ? s.filter(x => x !== l) : [...s, l]);

  const matching = useMemo(() => {
    return CITIZENS.filter(c => {
      if (segLocalities.length && !segLocalities.includes(c.locality)) return false;
      if (segIssue !== "any" && !c.issues.includes(segIssue)) return false;
      if (segConsent !== "any" && c.consent !== segConsent) return false;
      return true;
    });
  }, [segLocalities, segIssue, segConsent]);

  const filteredTable = useMemo(() => {
    const q = search.toLowerCase();
    return CITIZENS.filter(c =>
      !q || c.name.toLowerCase().includes(q) || c.locality.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
    );
  }, [search]);

  const liveCount = matching.length;
  // simulate scaled count
  const scaledLive = Math.round(liveCount * 78 + 240);

  const saveSegment = () => {
    const name = `Custom — ${segLocalities[0] || "All"}${segIssue !== "any" ? ` / ${segIssue}` : ""}`;
    setSavedSegments(s => [{ name, count: scaledLive }, ...s]);
    toast.success("Segment saved", { description: `${name} (${scaledLive.toLocaleString()} citizens)` });
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-navy">Citizen Database</h1>
        <p className="text-sm text-muted-foreground mt-1">Unified, consent-aware constituent contact registry.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard icon={Users} label="Total citizens" value="8,420" accent="bg-navy/10 text-navy" />
        <StatCard icon={MessageCircle} label="With WhatsApp" value="7,180" accent="bg-emerald-100 text-emerald-700" />
        <StatCard icon={Mail} label="With Email" value="3,260" accent="bg-blue-100 text-blue-700" />
        <StatCard icon={CheckCircle2} label="Opted-in" value="6,540" accent="bg-saffron/15 text-saffron" />
        <StatCard icon={XCircle} label="Opted-out" value="410" accent="bg-red-100 text-red-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Segment Builder */}
        <Card className="lg:col-span-1 border-saffron/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-navy">
              <Filter className="h-4 w-4 text-saffron" /> Segment Builder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Locality (multi)</Label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {LOCALITIES.map(l => (
                  <button
                    key={l}
                    onClick={() => toggleLoc(l)}
                    className={`px-2.5 py-1 rounded-full text-xs border transition ${
                      segLocalities.includes(l)
                        ? "bg-navy text-white border-navy"
                        : "bg-white text-slate-600 border-slate-200 hover:border-navy/40"
                    }`}
                  >{l}</button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Issue / Case type</Label>
              <Select value={segIssue} onValueChange={setSegIssue}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any issue</SelectItem>
                  {ISSUES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Consent</Label>
              <Select value={segConsent} onValueChange={setSegConsent}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any status</SelectItem>
                  {CONSENT.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Date range</Label>
              <Select defaultValue="90">
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-saffron/10 border border-saffron/30 p-3">
              <div className="text-[11px] uppercase tracking-wider text-saffron font-semibold">Live match</div>
              <div className="mt-0.5 text-2xl font-bold text-navy">{scaledLive.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">citizens</span></div>
            </div>

            <Button onClick={saveSegment} className="w-full bg-navy hover:bg-navy/90">
              <Save className="h-4 w-4 mr-1.5" /> Save Segment
            </Button>

            <div className="pt-2 border-t">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Saved Segments</div>
              <div className="space-y-1.5">
                {savedSegments.map(s => (
                  <div key={s.name} className="flex items-center justify-between text-xs p-2 rounded-md hover:bg-slate-50 border border-slate-100">
                    <span className="flex items-center gap-1.5 text-navy"><Bookmark className="h-3 w-3 text-saffron" />{s.name}</span>
                    <span className="text-muted-foreground">{s.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-navy">Citizens</CardTitle>
            <div className="relative w-64">
              <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
              <Input placeholder="Search name, locality, ID" className="pl-8 h-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[560px] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Locality</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Issues</TableHead>
                    <TableHead>Last interaction</TableHead>
                    <TableHead>Consent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTable.map(c => (
                    <TableRow key={c.id} className={c.consent === "Opted-out" ? "opacity-50 bg-slate-50/60" : ""}>
                      <TableCell>
                        <div className="font-medium text-navy">{c.name}</div>
                        <div className="text-[11px] text-muted-foreground">{c.id}</div>
                      </TableCell>
                      <TableCell className="text-sm">{c.locality}</TableCell>
                      <TableCell className="text-xs font-mono">{mask(c.phone)}</TableCell>
                      <TableCell className="text-xs">{c.email || <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {c.issues.map(i => <Badge key={i} variant="secondary" className="text-[10px] py-0">{i}</Badge>)}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{c.last}</TableCell>
                      <TableCell><ConsentBadge c={c.consent} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-xs text-muted-foreground border-t pt-3">
        Opted-out citizens are visually muted and automatically excluded from any broadcast. Database is DPDP-compliant; consent is captured at every intake channel.
      </div>
    </div>
  );
}
