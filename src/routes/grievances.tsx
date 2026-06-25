import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import {
  ClipboardList,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Search,
  Plus,
  Download,
  MessageCircle,
  Phone,
  Users,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  FileSignature,
  Send,
  Inbox,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/grievances")({
  head: () => ({
    meta: [
      { title: "Grievances — MP Pulse" },
      {
        name: "description",
        content:
          "Constituent grievance CRM: intake, routing, SLA tracking, case worker assignment, and resolution.",
      },
    ],
  }),
  component: GrievancesPage,
});

// ---------- Mock data ----------
type Status = "Open" | "In Progress" | "Resolved";
type Priority = "High" | "Med" | "Low";
type Channel = "WhatsApp" | "IVR/Phone" | "Walk-in" | "Web/Social";

type Grievance = {
  id: string;
  citizen: string;
  phone: string;
  locality: string;
  category: string;
  channel: Channel;
  assignee: string;
  priority: Priority;
  status: Status;
  slaBreached?: number; // days breached
  slaDue?: string; // due text if on-track
  created: string;
  updated: string;
  description: string;
  hasLetter?: boolean;
};

const GRIEVANCES: Grievance[] = [
  {
    id: "GRV-2026-0418",
    citizen: "Manjunath Reddy",
    phone: "+91 98•••• 4521",
    locality: "KR Puram",
    category: "Water",
    channel: "WhatsApp",
    assignee: "Suresh G.",
    priority: "High",
    status: "In Progress",
    slaDue: "On-track • 1d left",
    created: "22 Jun 2026",
    updated: "2h ago",
    description:
      "Contaminated water supply for the last 5 days in Ward 84, KR Puram. Multiple households affected, complaints raised with BWSSB but no response. Children falling sick.",
    hasLetter: true,
  },
  {
    id: "GRV-2026-0417",
    citizen: "Lakshmi Narayanan",
    phone: "+91 90•••• 8812",
    locality: "Whitefield",
    category: "Roads",
    channel: "WhatsApp",
    assignee: "Priya M.",
    priority: "High",
    status: "Open",
    slaBreached: 2,
    created: "20 Jun 2026",
    updated: "1d ago",
    description:
      "Large pothole on Whitefield Main Road near ITPL gate causing two-wheeler accidents. Reported to BBMP twice; no action taken.",
  },
  {
    id: "GRV-2026-0416",
    citizen: "Mohammed Iqbal",
    phone: "+91 98•••• 3399",
    locality: "Mahadevapura",
    category: "Civic",
    channel: "Walk-in",
    assignee: "Suresh G.",
    priority: "Med",
    status: "In Progress",
    slaDue: "On-track • 3d left",
    created: "21 Jun 2026",
    updated: "5h ago",
    description:
      "Garbage not collected from sector 7 for 9 days. Stray dog menace increasing. Requested BBMP solid-waste team intervention.",
  },
  {
    id: "GRV-2026-0415",
    citizen: "Anitha Krishnan",
    phone: "+91 99•••• 1208",
    locality: "Marathahalli",
    category: "Electricity",
    channel: "IVR/Phone",
    assignee: "Rakesh N.",
    priority: "High",
    status: "Resolved",
    slaDue: "Resolved in 4d",
    created: "16 Jun 2026",
    updated: "3d ago",
    description:
      "Frequent power outages in HAL 3rd Stage — 6-8 hours daily. BESCOM transformer needs replacement.",
  },
  {
    id: "GRV-2026-0414",
    citizen: "Prakash Hegde",
    phone: "+91 80•••• 5567",
    locality: "Bellandur",
    category: "Health",
    channel: "WhatsApp",
    assignee: "Deepa S.",
    priority: "Med",
    status: "In Progress",
    slaDue: "On-track • 2d left",
    created: "22 Jun 2026",
    updated: "8h ago",
    description:
      "PHC at Bellandur out of essential medicines for diabetes patients. Senior citizens being turned away.",
  },
  {
    id: "GRV-2026-0413",
    citizen: "Geetha Sharma",
    phone: "+91 96•••• 7723",
    locality: "Varthur",
    category: "Pension/Ration",
    channel: "Walk-in",
    assignee: "Priya M.",
    priority: "Low",
    status: "Open",
    slaBreached: 5,
    created: "17 Jun 2026",
    updated: "2d ago",
    description:
      "Widow pension not credited for 3 months. Bank says no transfer from Social Welfare Dept. Needs MP office follow-up.",
    hasLetter: true,
  },
  {
    id: "GRV-2026-0412",
    citizen: "Ramesh Kumar",
    phone: "+91 98•••• 0091",
    locality: "Hoodi",
    category: "Police",
    channel: "WhatsApp",
    assignee: "Rakesh N.",
    priority: "High",
    status: "In Progress",
    slaDue: "On-track • Today",
    created: "23 Jun 2026",
    updated: "1h ago",
    description:
      "Repeated chain-snatching incidents near Hoodi metro station. Requesting increased patrolling, especially during evening hours.",
  },
  {
    id: "GRV-2026-0411",
    citizen: "Sushma Bhat",
    phone: "+91 90•••• 3344",
    locality: "Whitefield",
    category: "Education",
    channel: "Web/Social",
    assignee: "Deepa S.",
    priority: "Med",
    status: "Resolved",
    slaDue: "Resolved in 5d",
    created: "14 Jun 2026",
    updated: "5d ago",
    description:
      "Govt high school Whitefield needs additional Kannada-medium teacher. Recommendation letter required.",
    hasLetter: true,
  },
  {
    id: "GRV-2026-0410",
    citizen: "Venkatesh M.",
    phone: "+91 80•••• 1145",
    locality: "KR Puram",
    category: "Land Records",
    channel: "Walk-in",
    assignee: "Suresh G.",
    priority: "Low",
    status: "Open",
    slaBreached: 1,
    created: "19 Jun 2026",
    updated: "1d ago",
    description:
      "Khata transfer stuck at sub-registrar for 7 months despite all documents submitted. Bribery alleged.",
  },
  {
    id: "GRV-2026-0409",
    citizen: "Fathima Banu",
    phone: "+91 99•••• 6612",
    locality: "Mahadevapura",
    category: "Water",
    channel: "WhatsApp",
    assignee: "Suresh G.",
    priority: "High",
    status: "In Progress",
    slaDue: "On-track • 1d left",
    created: "21 Jun 2026",
    updated: "4h ago",
    description:
      "Cauvery water not supplied to AECS Layout for 8 days. Tanker prices doubled. Urgent intervention needed.",
  },
  {
    id: "GRV-2026-0408",
    citizen: "Krishnamurthy R.",
    phone: "+91 98•••• 4499",
    locality: "Bellandur",
    category: "Civic",
    channel: "IVR/Phone",
    assignee: "Rakesh N.",
    priority: "Med",
    status: "Resolved",
    slaDue: "Resolved in 3d",
    created: "13 Jun 2026",
    updated: "6d ago",
    description:
      "Stormwater drain blocked near Bellandur signal causing waterlogging during rains.",
  },
  {
    id: "GRV-2026-0407",
    citizen: "Shilpa Gowda",
    phone: "+91 90•••• 7780",
    locality: "Marathahalli",
    category: "Roads",
    channel: "WhatsApp",
    assignee: "Priya M.",
    priority: "Med",
    status: "Open",
    slaBreached: 3,
    created: "18 Jun 2026",
    updated: "2d ago",
    description:
      "Footpath dug up for cable work near Marathahalli bridge — left unrepaired for 2 weeks. Pedestrian hazard.",
  },
  {
    id: "GRV-2026-0406",
    citizen: "Naveen Joshi",
    phone: "+91 96•••• 2231",
    locality: "Varthur",
    category: "Electricity",
    channel: "WhatsApp",
    assignee: "Rakesh N.",
    priority: "Low",
    status: "Resolved",
    slaDue: "Resolved in 2d",
    created: "15 Jun 2026",
    updated: "4d ago",
    description:
      "Streetlights non-functional along Varthur Lake road for 3 weeks. Safety concern at night.",
  },
  {
    id: "GRV-2026-0405",
    citizen: "Bhagya Lakshmi",
    phone: "+91 98•••• 5520",
    locality: "Hoodi",
    category: "Health",
    channel: "Walk-in",
    assignee: "Deepa S.",
    priority: "High",
    status: "In Progress",
    slaDue: "On-track • 2d left",
    created: "22 Jun 2026",
    updated: "6h ago",
    description:
      "Request to set up dialysis unit at govt hospital. Currently 200+ patients travel 18km for treatment.",
    hasLetter: true,
  },
  {
    id: "GRV-2026-0404",
    citizen: "Imran Pasha",
    phone: "+91 80•••• 9931",
    locality: "KR Puram",
    category: "Pension/Ration",
    channel: "WhatsApp",
    assignee: "Priya M.",
    priority: "Med",
    status: "Open",
    slaBreached: 4,
    created: "18 Jun 2026",
    updated: "3d ago",
    description:
      "BPL ration card application pending for 11 months despite repeated visits to Tahsildar office.",
  },
  {
    id: "GRV-2026-0403",
    citizen: "Savitha Rao",
    phone: "+91 99•••• 8845",
    locality: "Whitefield",
    category: "Water",
    channel: "WhatsApp",
    assignee: "Suresh G.",
    priority: "High",
    status: "Resolved",
    slaDue: "Resolved in 5d",
    created: "12 Jun 2026",
    updated: "7d ago",
    description:
      "Borewell motor burnout in apartment complex of 120 families. Required BBMP coordination for emergency tanker supply.",
  },
];

const CATEGORIES = [
  "Water",
  "Electricity",
  "Police",
  "Civic",
  "Health",
  "Education",
  "Roads",
  "Land Records",
  "Pension/Ration",
];
const LOCALITIES = ["Whitefield", "KR Puram", "Mahadevapura", "Marathahalli", "Bellandur", "Varthur", "Hoodi"];
const ASSIGNEES = ["Suresh G.", "Priya M.", "Rakesh N.", "Deepa S."];
const CHANNELS: Channel[] = ["WhatsApp", "IVR/Phone", "Walk-in", "Web/Social"];

const INTAKE = [
  { label: "WhatsApp", pct: 54, icon: MessageCircle, color: "bg-emerald-500" },
  { label: "IVR/Phone", pct: 21, icon: Phone, color: "bg-navy" },
  { label: "Walk-in", pct: 15, icon: Users, color: "bg-saffron" },
  { label: "Web/Social", pct: 10, icon: Globe, color: "bg-blue-500" },
];

const BY_LOCALITY = [
  { name: "KR Puram", count: 287 },
  { name: "Whitefield", count: 241 },
  { name: "Mahadevapura", count: 198 },
  { name: "Marathahalli", count: 163 },
  { name: "Bellandur", count: 142 },
  { name: "Varthur", count: 121 },
  { name: "Hoodi", count: 95 },
];
const MAX_LOC = Math.max(...BY_LOCALITY.map((l) => l.count));

// ---------- Helpers ----------
const channelIconFor = (c: Channel) =>
  c === "WhatsApp" ? MessageCircle : c === "IVR/Phone" ? Phone : c === "Walk-in" ? Users : Globe;

const statusStyles: Record<Status, string> = {
  Open: "bg-amber-50 text-amber-700 border-amber-200",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const priorityStyles: Record<Priority, string> = {
  High: "bg-red-50 text-red-700",
  Med: "bg-amber-50 text-amber-700",
  Low: "bg-slate-100 text-slate-700",
};

// ---------- Page ----------
function GrievancesPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Grievance[]>(GRIEVANCES);
  const [selected, setSelected] = useState<Grievance | null>(null);

  // filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [channel, setChannel] = useState("all");
  const [locality, setLocality] = useState("all");
  const [assignee, setAssignee] = useState("all");
  const [sla, setSla] = useState("all");

  // sort
  const [sortKey, setSortKey] = useState<keyof Grievance>("created");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const out = rows.filter((g) => {
      if (q && !`${g.id} ${g.citizen}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (status !== "all" && g.status !== status) return false;
      if (category !== "all" && g.category !== category) return false;
      if (channel !== "all" && g.channel !== channel) return false;
      if (locality !== "all" && g.locality !== locality) return false;
      if (assignee !== "all" && g.assignee !== assignee) return false;
      if (sla === "breached" && !g.slaBreached) return false;
      if (sla === "ontrack" && g.slaBreached) return false;
      return true;
    });
    out.sort((a, b) => {
      const av = String(a[sortKey] ?? "");
      const bv = String(b[sortKey] ?? "");
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return out;
  }, [rows, q, status, category, channel, locality, assignee, sla, sortKey, sortDir]);

  const toggleSort = (k: keyof Grievance) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir("asc");
    }
  };

  const resetFilters = () => {
    setQ("");
    setStatus("all");
    setCategory("all");
    setChannel("all");
    setLocality("all");
    setAssignee("all");
    setSla("all");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Grievances</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Constituent intake, routing, SLA tracking and resolution across all channels.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live • 1,247 lifetime tickets
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Kpi icon={ClipboardList} label="Total Grievances" value="1,247" trend="+86" up />
        <Kpi icon={Inbox} label="Open" value="312" tone="amber" trend="+12" up={false} />
        <Kpi icon={Activity} label="In Progress" value="188" tone="blue" trend="+4" up />
        <Kpi icon={CheckCircle2} label="Resolved" value="747" tone="green" trend="+70" up />
        <Kpi icon={Clock} label="Avg Resolution" value="6.2d" trend="-0.4d" up />
        <Kpi icon={ShieldAlert} label="SLA Breaches" value="24" tone="red" trend="+3" up={false} />
      </div>

      {/* Row 2 — Intake by Channel + By Locality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5 shadow-soft border-border/70">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">Intake by Channel</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              How constituents reach the MP office
            </p>
          </div>
          <div className="space-y-4">
            {INTAKE.map((c) => (
              <div key={c.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-2 text-sm text-foreground">
                    <c.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    {c.label}
                  </span>
                  <span className="text-sm font-semibold text-foreground tabular-nums">
                    {c.pct}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full ${c.color} rounded-full transition-all`}
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 shadow-soft border-border/70">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">Grievances by Locality</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Last 90 days</p>
          </div>
          <div className="space-y-2.5">
            {BY_LOCALITY.map((l) => (
              <div key={l.name} className="grid grid-cols-12 items-center gap-3">
                <span className="col-span-3 text-xs text-foreground truncate">{l.name}</span>
                <div className="col-span-7 h-5 rounded-md bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-navy to-navy/70 rounded-md"
                    style={{ width: `${(l.count / MAX_LOC) * 100}%` }}
                  />
                </div>
                <span className="col-span-2 text-xs font-semibold text-foreground tabular-nums text-right">
                  {l.count}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* MP Oversight strip */}
      <Card className="border-l-4 border-l-saffron shadow-soft border-border/70 p-5">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-saffron font-semibold">
              MP Oversight
            </div>
            <div className="text-sm font-semibold text-foreground mt-0.5">
              At a glance, while you were away
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1 min-w-[320px]">
            <Stat big="268" label="Citizens helped this week" />
            <Stat big="96" label="Forwarded to department" />
            <Stat big="142" label="Resolved & closed" tone="emerald" />
            <Stat big="74" label="Still pending action" tone="amber" />
          </div>
        </div>
      </Card>

      {/* Filter bar */}
      <Card className="p-4 shadow-soft border-border/70">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by name or ticket ID..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>

          <FilterSelect value={status} onChange={setStatus} label="Status"
            options={["Open", "In Progress", "Resolved"]} />
          <FilterSelect value={category} onChange={setCategory} label="Category" options={CATEGORIES} />
          <FilterSelect value={channel} onChange={setChannel} label="Channel" options={CHANNELS} />
          <FilterSelect value={locality} onChange={setLocality} label="Locality" options={LOCALITIES} />
          <FilterSelect value={assignee} onChange={setAssignee} label="Case Worker" options={ASSIGNEES} />
          <Select value={sla} onValueChange={setSla}>
            <SelectTrigger className="h-9 w-[130px] text-xs">
              <SelectValue placeholder="SLA" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">SLA: All</SelectItem>
              <SelectItem value="ontrack">On-track</SelectItem>
              <SelectItem value="breached">Breached</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-9 text-xs">
            Reset
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 text-xs">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
            <Button
              size="sm"
              className="h-9 text-xs bg-saffron text-white hover:bg-saffron/90"
              onClick={() => toast.success("New grievance form opened")}
            >
              <Plus className="h-3.5 w-3.5" /> New Grievance
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="shadow-soft border-border/70 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <Th onClick={() => toggleSort("id")}>Ticket</Th>
                <Th onClick={() => toggleSort("citizen")}>Citizen</Th>
                <Th onClick={() => toggleSort("locality")}>Locality</Th>
                <Th onClick={() => toggleSort("category")}>Category</Th>
                <Th>Channel</Th>
                <Th onClick={() => toggleSort("assignee")}>Case Worker</Th>
                <Th>Priority</Th>
                <Th>Status</Th>
                <Th>SLA</Th>
                <Th onClick={() => toggleSort("created")}>Created</Th>
                <Th>Updated</Th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading &&
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 11 }).map((__, j) => (
                      <TableCell key={j} className="py-3">
                        <Skeleton className="h-3 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} className="py-16">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-3">
                        <Inbox className="h-7 w-7 text-muted-foreground" />
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        No grievances match these filters
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                        Try clearing a filter, broadening your date range, or searching by ticket ID.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 h-8 text-xs"
                        onClick={resetFilters}
                      >
                        Reset filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                filtered.map((g) => {
                  const ChIcon = channelIconFor(g.channel);
                  return (
                    <TableRow
                      key={g.id}
                      onClick={() => setSelected(g)}
                      className="cursor-pointer hover:bg-muted/40 transition-colors"
                    >
                      <TableCell className="font-mono text-xs text-navy font-semibold">
                        {g.id}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-foreground">
                        {g.citizen}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{g.locality}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] bg-navy/5 text-navy border-navy/20">
                          {g.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <ChIcon className="h-3.5 w-3.5" />
                          <span className="hidden xl:inline">{g.channel}</span>
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-foreground">{g.assignee}</TableCell>
                      <TableCell>
                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${priorityStyles[g.priority]}`}>
                          {g.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] ${statusStyles[g.status]}`}>
                          {g.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {g.slaBreached ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-700">
                            <AlertTriangle className="h-3 w-3" />
                            Breached {g.slaBreached}d
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" />
                            {g.slaDue}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {g.created}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {g.updated}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
            <span>
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {rows.length} tickets
            </span>
            <span>Page 1 of 1</span>
          </div>
        )}
      </Card>

      {/* Detail Drawer */}
      <DetailDrawer
        grievance={selected}
        onClose={() => setSelected(null)}
        onStatusChange={(id, s) => {
          setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: s, updated: "just now" } : r)));
          setSelected((sel) => (sel ? { ...sel, status: s } : sel));
          toast.success(`Status updated to ${s}`);
        }}
      />
    </div>
  );
}

// ---------- Subcomponents ----------
function Th({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <TableHead
      onClick={onClick}
      className={`text-[10px] uppercase tracking-wider font-semibold text-muted-foreground ${
        onClick ? "cursor-pointer hover:text-foreground" : ""
      }`}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {onClick && <ChevronDown className="h-3 w-3 opacity-50" />}
      </span>
    </TableHead>
  );
}

function FilterSelect({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  options: string[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-[140px] text-xs">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{label}: All</SelectItem>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  tone,
  trend,
  up,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone?: "amber" | "blue" | "green" | "red";
  trend?: string;
  up?: boolean;
}) {
  const toneClass =
    tone === "amber"
      ? "text-amber-700 bg-amber-50"
      : tone === "blue"
      ? "text-blue-700 bg-blue-50"
      : tone === "green"
      ? "text-emerald-700 bg-emerald-50"
      : tone === "red"
      ? "text-red-700 bg-red-50"
      : "text-navy bg-navy/5";
  return (
    <Card className="p-4 shadow-soft border-border/70">
      <div className="flex items-start justify-between">
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${toneClass}`}>
          <Icon className="h-4 w-4" />
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${
              up ? "text-emerald-700" : "text-red-700"
            }`}
          >
            {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight text-foreground tabular-nums">{value}</div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mt-0.5">
          {label}
        </div>
      </div>
    </Card>
  );
}

function Stat({ big, label, tone }: { big: string; label: string; tone?: "emerald" | "amber" }) {
  const c =
    tone === "emerald" ? "text-emerald-700" : tone === "amber" ? "text-amber-700" : "text-foreground";
  return (
    <div>
      <div className={`text-2xl font-bold tabular-nums ${c}`}>{big}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

// ---------- Detail Drawer ----------
function DetailDrawer({
  grievance,
  onClose,
  onStatusChange,
}: {
  grievance: Grievance | null;
  onClose: () => void;
  onStatusChange: (id: string, s: Status) => void;
}) {
  const [note, setNote] = useState("");
  const [showWa, setShowWa] = useState(false);

  useEffect(() => {
    setNote("");
    setShowWa(false);
  }, [grievance?.id]);

  if (!grievance) return null;
  const ChIcon = channelIconFor(grievance.channel);

  const timeline = [
    { actor: "System", label: `Logged via ${grievance.channel}`, time: grievance.created + " • 09:14" },
    { actor: "Router", label: "Auto-routed to Civic Desk", time: grievance.created + " • 09:14" },
    { actor: "MP Office", label: `Case worker assigned: ${grievance.assignee}`, time: grievance.created + " • 10:02" },
    { actor: grievance.assignee, label: `Forwarded to ${grievance.category} department`, time: "21 Jun • 14:30" },
    { actor: "Department", label: "Awaiting response from BWSSB", time: "22 Jun • 11:00" },
  ];

  const waTemplate = `Namaste ${grievance.citizen} ji,\n\nThis is from the office of your Hon'ble MP regarding your complaint (${grievance.id}). We have escalated the matter to the concerned department. We will update you within 48 hours.\n\n— MP Office, Bengaluru`;

  return (
    <Sheet open={!!grievance} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0">
        <SheetHeader className="p-5 border-b sticky top-0 bg-card z-10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle className="font-mono text-sm text-navy">{grievance.id}</SheetTitle>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={`text-[10px] ${statusStyles[grievance.status]}`}>
                  {grievance.status}
                </Badge>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priorityStyles[grievance.priority]}`}>
                  {grievance.priority} priority
                </span>
                {grievance.slaBreached ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700">
                    <AlertTriangle className="h-3 w-3" /> SLA Breached {grievance.slaBreached}d
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" /> {grievance.slaDue}
                  </span>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="p-5 space-y-5">
          {/* Citizen block */}
          <div className="rounded-xl border border-border/70 p-4 bg-muted/20">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
              Citizen
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground text-xs">Name</div>
                <div className="font-semibold text-foreground">{grievance.citizen}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Phone</div>
                <div className="font-mono text-foreground">{grievance.phone}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Locality</div>
                <div className="text-foreground">{grievance.locality}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">Channel</div>
                <div className="inline-flex items-center gap-1.5 text-foreground">
                  <ChIcon className="h-3.5 w-3.5" /> {grievance.channel}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
              Issue
            </div>
            <p className="text-sm text-foreground leading-relaxed">{grievance.description}</p>
            {grievance.hasLetter && (
              <a className="mt-3 inline-flex items-center gap-1.5 text-xs text-navy hover:underline cursor-pointer">
                <FileSignature className="h-3.5 w-3.5" />
                Linked recommendation letter • REC-2026-0091
              </a>
            )}
          </div>

          {/* Timeline */}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">
              Activity Timeline
            </div>
            <div className="relative pl-6">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
              {timeline.map((t, i) => (
                <div key={i} className="relative pb-4 last:pb-0">
                  <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-saffron ring-4 ring-background" />
                  <div className="text-sm font-medium text-foreground">{t.label}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {t.actor} • {t.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-xl border border-border/70 p-4 space-y-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Actions
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={grievance.status}
                onValueChange={(v) => onStatusChange(grievance.id, v as Status)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select
                defaultValue={grievance.assignee}
                onValueChange={(v) => toast.success(`Reassigned to ${v}`)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Reassign" />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNEES.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Textarea
                placeholder="Add an internal note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="text-sm min-h-[70px]"
              />
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs"
                  disabled={!note.trim()}
                  onClick={() => {
                    toast.success("Note added");
                    setNote("");
                  }}
                >
                  Add Note
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                className="h-9 text-xs bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={() => setShowWa((v) => !v)}
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Notify Citizen on WhatsApp
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-9 text-xs border-saffron text-saffron hover:bg-saffron/10"
                onClick={() => toast.success("Escalated to MP", { description: grievance.id })}
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                Escalate to MP
              </Button>
            </div>

            {showWa && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
                <div className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold mb-2">
                  WhatsApp template preview
                </div>
                <pre className="text-xs text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                  {waTemplate}
                </pre>
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => {
                      toast.success("WhatsApp sent", { description: grievance.phone });
                      setShowWa(false);
                    }}
                  >
                    <Send className="h-3.5 w-3.5" /> Send
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
