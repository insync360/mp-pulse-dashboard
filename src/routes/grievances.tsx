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
  LayoutGrid,
  Table as TableIcon,
  Camera,
  XCircle,
  RefreshCw,
  Star,
  Lock,
  TrendingUp,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
          "Constituent grievance case management: intake, routing, SLA tracking, agent assignment, stages, and feedback-gated closure.",
      },
    ],
  }),
  component: GrievancesPage,
});

// ---------- Types ----------
type Stage =
  | "New"
  | "Assigned"
  | "In Progress"
  | "Action Taken"
  | "Pending Citizen Confirmation"
  | "Resolved/Closed"
  | "Reopened"
  | "Auto-Closed";

type Priority = "High" | "Med" | "Low";
type Channel = "WhatsApp" | "IVR/Phone" | "Walk-in" | "Web/Social";

type CaseType =
  | "Police"
  | "Water"
  | "Infrastructure"
  | "Traffic"
  | "Electricity"
  | "Health"
  | "Education"
  | "Sanitation"
  | "Land/Revenue"
  | "Pension/Ration"
  | "Civic/BBMP"
  | "Other";

type Grievance = {
  id: string;
  citizen: string;
  phone: string;
  locality: string;
  caseType: CaseType;
  channel: Channel;
  assignee: string;
  priority: Priority;
  stage: Stage;
  created: string; // display
  createdDays: number; // days ago
  updated: string;
  description: string;
  hasLetter?: boolean;
  resolutionAction?: string;
  resolutionNote?: string;
  remindersSent?: number;
  closedByOverride?: boolean;
  closureReason?: string;
  reopenedCount?: number;
};

// ---------- SLA per case type (days) ----------
const SLA: Record<CaseType, number> = {
  Water: 3,
  Police: 5,
  Infrastructure: 10,
  Traffic: 4,
  Electricity: 3,
  Health: 4,
  Education: 7,
  Sanitation: 4,
  "Land/Revenue": 14,
  "Pension/Ration": 10,
  "Civic/BBMP": 7,
  Other: 7,
};

// ---------- Agents (10) ----------
const AGENTS: { name: string; desk: CaseType | "General" }[] = [
  { name: "Suresh Gowda", desk: "Water" },
  { name: "Anita Reddy", desk: "Police" },
  { name: "Ravi Kumar", desk: "Infrastructure" },
  { name: "Priya Menon", desk: "Traffic" },
  { name: "Rakesh Nair", desk: "Electricity" },
  { name: "Deepa Shetty", desk: "Health" },
  { name: "Manjula Iyer", desk: "Education" },
  { name: "Vinod Patil", desk: "Sanitation" },
  { name: "Lakshmi Rao", desk: "Land/Revenue" },
  { name: "Harish Bhat", desk: "General" }, // handles Pension/Ration, Civic/BBMP, Other
];

const agentForType = (t: CaseType): string => {
  const direct = AGENTS.find((a) => a.desk === t);
  if (direct) return direct.name;
  return "Harish Bhat";
};

// ---------- Case type chip colors ----------
const typeColor: Record<CaseType, string> = {
  Water: "bg-sky-50 text-sky-700 border-sky-200",
  Police: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Infrastructure: "bg-orange-50 text-orange-700 border-orange-200",
  Traffic: "bg-yellow-50 text-yellow-800 border-yellow-200",
  Electricity: "bg-amber-50 text-amber-800 border-amber-200",
  Health: "bg-rose-50 text-rose-700 border-rose-200",
  Education: "bg-violet-50 text-violet-700 border-violet-200",
  Sanitation: "bg-lime-50 text-lime-800 border-lime-200",
  "Land/Revenue": "bg-stone-100 text-stone-700 border-stone-200",
  "Pension/Ration": "bg-teal-50 text-teal-700 border-teal-200",
  "Civic/BBMP": "bg-blue-50 text-blue-700 border-blue-200",
  Other: "bg-slate-100 text-slate-700 border-slate-200",
};

// ---------- Stage styles ----------
const STAGES: Stage[] = [
  "New",
  "Assigned",
  "In Progress",
  "Action Taken",
  "Pending Citizen Confirmation",
  "Resolved/Closed",
];

const stageStyles: Record<Stage, string> = {
  New: "bg-slate-100 text-slate-700 border-slate-200",
  Assigned: "bg-indigo-50 text-indigo-700 border-indigo-200",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  "Action Taken": "bg-violet-50 text-violet-700 border-violet-200",
  "Pending Citizen Confirmation": "bg-amber-50 text-amber-800 border-amber-200",
  "Resolved/Closed": "bg-emerald-50 text-emerald-700 border-emerald-200",
  Reopened: "bg-orange-50 text-orange-700 border-orange-200",
  "Auto-Closed": "bg-zinc-100 text-zinc-700 border-zinc-200",
};

const stageDotColor: Record<Stage, string> = {
  New: "bg-slate-400",
  Assigned: "bg-indigo-500",
  "In Progress": "bg-blue-500",
  "Action Taken": "bg-violet-500",
  "Pending Citizen Confirmation": "bg-amber-500",
  "Resolved/Closed": "bg-emerald-500",
  Reopened: "bg-orange-500",
  "Auto-Closed": "bg-zinc-500",
};

const priorityStyles: Record<Priority, string> = {
  High: "bg-red-50 text-red-700",
  Med: "bg-amber-50 text-amber-700",
  Low: "bg-slate-100 text-slate-700",
};

const RESOLUTION_ACTIONS = [
  "Recommendation letter issued",
  "Referred to department",
  "Police station coordinated",
  "Site visit conducted",
  "Scheme/benefit facilitated",
  "Information provided",
  "Other",
];

const CHANNELS: Channel[] = ["WhatsApp", "IVR/Phone", "Walk-in", "Web/Social"];
const LOCALITIES = [
  "Whitefield",
  "KR Puram",
  "Mahadevapura",
  "Marathahalli",
  "Bellandur",
  "Varthur",
  "Hoodi",
];
const CASE_TYPES: CaseType[] = [
  "Police",
  "Water",
  "Infrastructure",
  "Traffic",
  "Electricity",
  "Health",
  "Education",
  "Sanitation",
  "Land/Revenue",
  "Pension/Ration",
  "Civic/BBMP",
  "Other",
];

// ---------- Mock cases (~18) ----------
const MOCK: Grievance[] = [
  {
    id: "GRV-2026-0418",
    citizen: "Manjunath Reddy",
    phone: "+91 98•••• 4521",
    locality: "KR Puram",
    caseType: "Water",
    channel: "WhatsApp",
    assignee: agentForType("Water"),
    priority: "High",
    stage: "In Progress",
    created: "22 Jun 2026",
    createdDays: 4,
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
    caseType: "Infrastructure",
    channel: "WhatsApp",
    assignee: agentForType("Infrastructure"),
    priority: "High",
    stage: "Assigned",
    created: "20 Jun 2026",
    createdDays: 6,
    updated: "1d ago",
    description:
      "Large pothole on Whitefield Main Road near ITPL gate causing two-wheeler accidents. Reported to BBMP twice; no action taken.",
  },
  {
    id: "GRV-2026-0416",
    citizen: "Mohammed Iqbal",
    phone: "+91 98•••• 3399",
    locality: "Mahadevapura",
    caseType: "Sanitation",
    channel: "Walk-in",
    assignee: agentForType("Sanitation"),
    priority: "Med",
    stage: "In Progress",
    created: "21 Jun 2026",
    createdDays: 5,
    updated: "5h ago",
    description:
      "Garbage not collected from sector 7 for 9 days. Stray dog menace increasing. Requested BBMP solid-waste team intervention.",
  },
  {
    id: "GRV-2026-0415",
    citizen: "Anitha Krishnan",
    phone: "+91 99•••• 1208",
    locality: "Marathahalli",
    caseType: "Electricity",
    channel: "IVR/Phone",
    assignee: agentForType("Electricity"),
    priority: "High",
    stage: "Resolved/Closed",
    created: "16 Jun 2026",
    createdDays: 10,
    updated: "3d ago",
    description:
      "Frequent power outages in HAL 3rd Stage — 6-8 hours daily. BESCOM transformer needs replacement.",
    resolutionAction: "Referred to department",
    resolutionNote: "BESCOM replaced transformer on 19 Jun, citizen confirmed via feedback form.",
  },
  {
    id: "GRV-2026-0414",
    citizen: "Prakash Hegde",
    phone: "+91 80•••• 5567",
    locality: "Bellandur",
    caseType: "Health",
    channel: "WhatsApp",
    assignee: agentForType("Health"),
    priority: "Med",
    stage: "Action Taken",
    created: "22 Jun 2026",
    createdDays: 4,
    updated: "8h ago",
    description:
      "PHC at Bellandur out of essential medicines for diabetes patients. Senior citizens being turned away.",
    resolutionAction: "Site visit conducted",
    resolutionNote: "DHO instructed to restock; supply expected within 48 hours.",
  },
  {
    id: "GRV-2026-0413",
    citizen: "Geetha Sharma",
    phone: "+91 96•••• 7723",
    locality: "Varthur",
    caseType: "Pension/Ration",
    channel: "Walk-in",
    assignee: agentForType("Pension/Ration"),
    priority: "Low",
    stage: "Pending Citizen Confirmation",
    created: "17 Jun 2026",
    createdDays: 9,
    updated: "2d ago",
    description:
      "Widow pension not credited for 3 months. Bank says no transfer from Social Welfare Dept. Needs MP office follow-up.",
    hasLetter: true,
    resolutionAction: "Scheme/benefit facilitated",
    resolutionNote: "Social Welfare Dept confirmed pension release for July payout.",
    remindersSent: 2,
  },
  {
    id: "GRV-2026-0412",
    citizen: "Ramesh Kumar",
    phone: "+91 98•••• 0091",
    locality: "Hoodi",
    caseType: "Police",
    channel: "WhatsApp",
    assignee: agentForType("Police"),
    priority: "High",
    stage: "In Progress",
    created: "23 Jun 2026",
    createdDays: 3,
    updated: "1h ago",
    description:
      "Repeated chain-snatching incidents near Hoodi metro station. Requesting increased patrolling, especially during evening hours.",
  },
  {
    id: "GRV-2026-0411",
    citizen: "Sushma Bhat",
    phone: "+91 90•••• 3344",
    locality: "Whitefield",
    caseType: "Education",
    channel: "Web/Social",
    assignee: agentForType("Education"),
    priority: "Med",
    stage: "Resolved/Closed",
    created: "14 Jun 2026",
    createdDays: 12,
    updated: "5d ago",
    description:
      "Govt high school Whitefield needs additional Kannada-medium teacher. Recommendation letter required.",
    hasLetter: true,
    resolutionAction: "Recommendation letter issued",
    resolutionNote: "DDPI confirmed teacher posting w.e.f. 1 July.",
  },
  {
    id: "GRV-2026-0410",
    citizen: "Venkatesh M.",
    phone: "+91 80•••• 1145",
    locality: "KR Puram",
    caseType: "Land/Revenue",
    channel: "Walk-in",
    assignee: agentForType("Land/Revenue"),
    priority: "Low",
    stage: "New",
    created: "25 Jun 2026",
    createdDays: 1,
    updated: "5h ago",
    description:
      "Khata transfer stuck at sub-registrar for 7 months despite all documents submitted. Bribery alleged.",
  },
  {
    id: "GRV-2026-0409",
    citizen: "Fathima Banu",
    phone: "+91 99•••• 6612",
    locality: "Mahadevapura",
    caseType: "Water",
    channel: "WhatsApp",
    assignee: agentForType("Water"),
    priority: "High",
    stage: "Action Taken",
    created: "21 Jun 2026",
    createdDays: 5,
    updated: "4h ago",
    description:
      "Cauvery water not supplied to AECS Layout for 8 days. Tanker prices doubled. Urgent intervention needed.",
    resolutionAction: "Referred to department",
    resolutionNote: "BWSSB dispatched 3 emergency tankers; pipeline repair scheduled.",
  },
  {
    id: "GRV-2026-0408",
    citizen: "Krishnamurthy R.",
    phone: "+91 98•••• 4499",
    locality: "Bellandur",
    caseType: "Civic/BBMP",
    channel: "IVR/Phone",
    assignee: agentForType("Civic/BBMP"),
    priority: "Med",
    stage: "Resolved/Closed",
    created: "13 Jun 2026",
    createdDays: 13,
    updated: "6d ago",
    description:
      "Stormwater drain blocked near Bellandur signal causing waterlogging during rains.",
    resolutionAction: "Site visit conducted",
    resolutionNote: "BBMP cleared drain; citizen confirmed resolution.",
  },
  {
    id: "GRV-2026-0407",
    citizen: "Shilpa Gowda",
    phone: "+91 90•••• 7780",
    locality: "Marathahalli",
    caseType: "Traffic",
    channel: "WhatsApp",
    assignee: agentForType("Traffic"),
    priority: "Med",
    stage: "Reopened",
    created: "18 Jun 2026",
    createdDays: 8,
    updated: "1d ago",
    reopenedCount: 1,
    description:
      "Footpath dug up for cable work near Marathahalli bridge — left unrepaired for 2 weeks. Pedestrian hazard.",
    resolutionAction: "Referred to department",
    resolutionNote: "Initial fix incomplete — citizen rejected feedback.",
  },
  {
    id: "GRV-2026-0406",
    citizen: "Naveen Joshi",
    phone: "+91 96•••• 2231",
    locality: "Varthur",
    caseType: "Electricity",
    channel: "WhatsApp",
    assignee: agentForType("Electricity"),
    priority: "Low",
    stage: "Auto-Closed",
    created: "10 Jun 2026",
    createdDays: 16,
    updated: "1d ago",
    description:
      "Streetlights non-functional along Varthur Lake road for 3 weeks. Safety concern at night.",
    resolutionAction: "Referred to department",
    resolutionNote: "BESCOM confirmed repair. No citizen response after 3 reminders.",
    remindersSent: 3,
  },
  {
    id: "GRV-2026-0405",
    citizen: "Bhagya Lakshmi",
    phone: "+91 98•••• 5520",
    locality: "Hoodi",
    caseType: "Health",
    channel: "Walk-in",
    assignee: agentForType("Health"),
    priority: "High",
    stage: "Pending Citizen Confirmation",
    created: "20 Jun 2026",
    createdDays: 6,
    updated: "6h ago",
    description:
      "Request to set up dialysis unit at govt hospital. Currently 200+ patients travel 18km for treatment.",
    hasLetter: true,
    resolutionAction: "Recommendation letter issued",
    resolutionNote: "Letter forwarded to Health Minister's office.",
    remindersSent: 1,
  },
  {
    id: "GRV-2026-0404",
    citizen: "Imran Pasha",
    phone: "+91 80•••• 9931",
    locality: "KR Puram",
    caseType: "Pension/Ration",
    channel: "WhatsApp",
    assignee: agentForType("Pension/Ration"),
    priority: "Med",
    stage: "Assigned",
    created: "24 Jun 2026",
    createdDays: 2,
    updated: "3h ago",
    description:
      "BPL ration card application pending for 11 months despite repeated visits to Tahsildar office.",
  },
  {
    id: "GRV-2026-0403",
    citizen: "Savitha Rao",
    phone: "+91 99•••• 8845",
    locality: "Whitefield",
    caseType: "Water",
    channel: "WhatsApp",
    assignee: agentForType("Water"),
    priority: "High",
    stage: "Resolved/Closed",
    created: "12 Jun 2026",
    createdDays: 14,
    updated: "7d ago",
    description:
      "Borewell motor burnout in apartment complex of 120 families. Required BBMP coordination for emergency tanker supply.",
    resolutionAction: "Scheme/benefit facilitated",
    resolutionNote: "BBMP supplied tankers for 5 days while motor replaced.",
    closedByOverride: true,
    closureReason: "Citizen unreachable; verified resolution with RWA secretary.",
  },
  {
    id: "GRV-2026-0402",
    citizen: "Ashok Bhandari",
    phone: "+91 97•••• 4421",
    locality: "Mahadevapura",
    caseType: "Traffic",
    channel: "Web/Social",
    assignee: agentForType("Traffic"),
    priority: "Med",
    stage: "New",
    created: "26 Jun 2026",
    createdDays: 0,
    updated: "1h ago",
    description:
      "Signal at Mahadevapura junction non-functional during peak hours, causing 40-min jams.",
  },
  {
    id: "GRV-2026-0401",
    citizen: "Rekha Pandit",
    phone: "+91 98•••• 7711",
    locality: "Bellandur",
    caseType: "Police",
    channel: "IVR/Phone",
    assignee: agentForType("Police"),
    priority: "High",
    stage: "In Progress",
    created: "22 Jun 2026",
    createdDays: 4,
    updated: "4h ago",
    description:
      "Domestic violence complaint — needs urgent intervention by women's helpdesk at Bellandur PS.",
  },
];

// ---------- SLA helpers ----------
const slaInfo = (g: Grievance) => {
  const due = SLA[g.caseType];
  const remaining = due - g.createdDays;
  if (g.stage === "Resolved/Closed" || g.stage === "Auto-Closed") {
    return { breached: false, label: "Closed", days: 0 };
  }
  if (remaining < 0) return { breached: true, label: `Breached ${Math.abs(remaining)}d`, days: remaining };
  if (remaining === 0) return { breached: false, label: "Due today", days: 0 };
  return { breached: false, label: `${remaining}d left`, days: remaining };
};

const dueDateFor = (g: Grievance) => {
  const due = SLA[g.caseType];
  const remaining = due - g.createdDays;
  const d = new Date();
  d.setDate(d.getDate() + remaining);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

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

const channelIconFor = (c: Channel) =>
  c === "WhatsApp" ? MessageCircle : c === "IVR/Phone" ? Phone : c === "Walk-in" ? Users : Globe;

// ---------- Page ----------
function GrievancesPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Grievance[]>(MOCK);
  const [selected, setSelected] = useState<Grievance | null>(null);
  const [view, setView] = useState<"table" | "kanban">("table");
  const [autoCloseDays, setAutoCloseDays] = useState(15);
  const [feedbackFor, setFeedbackFor] = useState<Grievance | null>(null);
  const [forceCloseFor, setForceCloseFor] = useState<Grievance | null>(null);

  // filters
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("all");
  const [caseType, setCaseType] = useState("all");
  const [channel, setChannel] = useState("all");
  const [locality, setLocality] = useState("all");
  const [assignee, setAssignee] = useState("all");
  const [sla, setSla] = useState("all");

  const [sortKey, setSortKey] = useState<keyof Grievance>("createdDays");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const out = rows.filter((g) => {
      if (q && !`${g.id} ${g.citizen}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (stage !== "all" && g.stage !== stage) return false;
      if (caseType !== "all" && g.caseType !== caseType) return false;
      if (channel !== "all" && g.channel !== channel) return false;
      if (locality !== "all" && g.locality !== locality) return false;
      if (assignee !== "all" && g.assignee !== assignee) return false;
      const s = slaInfo(g);
      if (sla === "breached" && !s.breached) return false;
      if (sla === "ontrack" && s.breached) return false;
      return true;
    });
    out.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      const as = String(av ?? "");
      const bs = String(bv ?? "");
      return sortDir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
    });
    return out;
  }, [rows, q, stage, caseType, channel, locality, assignee, sla, sortKey, sortDir]);

  const toggleSort = (k: keyof Grievance) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir("asc");
    }
  };

  const resetFilters = () => {
    setQ("");
    setStage("all");
    setCaseType("all");
    setChannel("all");
    setLocality("all");
    setAssignee("all");
    setSla("all");
  };

  const updateCase = (id: string, patch: Partial<Grievance>) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch, updated: "just now" } : r)));
    setSelected((s) => (s && s.id === id ? { ...s, ...patch, updated: "just now" } : s));
  };

  // Analytics
  const funnel = useMemo(() => {
    return STAGES.map((s) => ({ stage: s, count: rows.filter((r) => r.stage === s).length }));
  }, [rows]);

  const workload = useMemo(() => {
    const map = new Map<string, number>();
    AGENTS.forEach((a) => map.set(a.name, 0));
    rows.forEach((r) => {
      if (!["Resolved/Closed", "Auto-Closed"].includes(r.stage)) {
        map.set(r.assignee, (map.get(r.assignee) || 0) + 1);
      }
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [rows]);
  const maxWorkload = Math.max(1, ...workload.map((w) => w.count));

  const slaPct = useMemo(() => {
    const active = rows.filter((r) => !["Resolved/Closed", "Auto-Closed"].includes(r.stage));
    if (!active.length) return 100;
    const ontrack = active.filter((r) => !slaInfo(r).breached).length;
    return Math.round((ontrack / active.length) * 100);
  }, [rows]);

  const reopenedPct = useMemo(() => {
    const total = rows.length;
    const reopened = rows.filter((r) => r.stage === "Reopened" || (r.reopenedCount ?? 0) > 0).length;
    return Math.round((reopened / total) * 100);
  }, [rows]);

  const closures = useMemo(() => {
    const closed = rows.filter((r) => r.stage === "Resolved/Closed");
    const auto = rows.filter((r) => r.stage === "Auto-Closed");
    const total = closed.length + auto.length;
    return {
      confirmed: closed.length,
      auto: auto.length,
      confirmedPct: total ? Math.round((closed.length / total) * 100) : 0,
    };
  }, [rows]);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Grievances</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Service-Cloud-style case management: intake, routing, SLA tracking, stage pipeline, and feedback-gated closure.
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

      {/* Intake + Locality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5 shadow-soft border-border/70">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">Intake by Channel</h3>
            <p className="text-xs text-muted-foreground mt-0.5">How constituents reach the MP office</p>
          </div>
          <div className="space-y-4">
            {INTAKE.map((c) => (
              <div key={c.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-2 text-sm text-foreground">
                    <c.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    {c.label}
                  </span>
                  <span className="text-sm font-semibold text-foreground tabular-nums">{c.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${c.color} rounded-full transition-all`} style={{ width: `${c.pct}%` }} />
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

      {/* Oversight strip */}
      <Card className="border-l-4 border-l-saffron shadow-soft border-border/70 p-5">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-saffron font-semibold">MP Oversight</div>
            <div className="text-sm font-semibold text-foreground mt-0.5">At a glance, while you were away</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1 min-w-[320px]">
            <Stat big="268" label="Citizens helped this week" />
            <Stat big="96" label="Forwarded to department" />
            <Stat big="142" label="Resolved & closed" tone="emerald" />
            <Stat big="74" label="Still pending action" tone="amber" />
          </div>
        </div>
      </Card>

      {/* Operations Analytics: funnel + workload + quality */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 shadow-soft border-border/70 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Pipeline Funnel</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Cases per stage (live, current view)</p>
            </div>
          </div>
          <div className="space-y-2">
            {(() => {
              const max = Math.max(1, ...funnel.map((f) => f.count));
              return funnel.map((f) => (
                <div key={f.stage} className="grid grid-cols-12 items-center gap-3">
                  <div className="col-span-4 flex items-center gap-2 text-xs text-foreground">
                    <span className={`h-2 w-2 rounded-full ${stageDotColor[f.stage as Stage]}`} />
                    {f.stage}
                  </div>
                  <div className="col-span-7 h-5 rounded-md bg-muted overflow-hidden">
                    <div
                      className={`h-full ${stageDotColor[f.stage as Stage]} opacity-80 rounded-md`}
                      style={{ width: `${(f.count / max) * 100}%` }}
                    />
                  </div>
                  <div className="col-span-1 text-xs font-semibold tabular-nums text-right">{f.count}</div>
                </div>
              ));
            })()}
          </div>
        </Card>

        <Card className="p-5 shadow-soft border-border/70">
          <h3 className="text-sm font-semibold text-foreground">Quality Signals</h3>
          <div className="mt-4 space-y-4">
            <Ring label="SLA Adherence" pct={slaPct} tone="emerald" />
            <Ring label="Reopened Rate" pct={reopenedPct} tone="amber" invert />
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-foreground">Closure mix</span>
                <span className="text-xs font-semibold text-foreground">
                  {closures.confirmedPct}% confirmed
                </span>
              </div>
              <div className="h-2 rounded-full bg-zinc-200 overflow-hidden flex">
                <div className="h-full bg-emerald-500" style={{ width: `${closures.confirmedPct}%` }} />
                <div className="h-full bg-zinc-400" style={{ width: `${100 - closures.confirmedPct}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>Confirmed {closures.confirmed}</span>
                <span>Auto-closed {closures.auto}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Workload + SLA panel side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 shadow-soft border-border/70 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground">Agent Workload (open cases)</h3>
          <div className="mt-4 space-y-2">
            {workload.map((w) => {
              const agent = AGENTS.find((a) => a.name === w.name);
              return (
                <div key={w.name} className="grid grid-cols-12 items-center gap-3">
                  <div className="col-span-5">
                    <div className="text-xs font-medium text-foreground">{w.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {agent?.desk === "General" ? "General Desk" : `${agent?.desk} Desk`}
                    </div>
                  </div>
                  <div className="col-span-6 h-4 rounded-md bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-navy to-saffron rounded-md"
                      style={{ width: `${(w.count / maxWorkload) * 100}%` }}
                    />
                  </div>
                  <div className="col-span-1 text-xs font-semibold tabular-nums text-right">{w.count}</div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5 shadow-soft border-border/70">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">SLA per Case Type</h3>
            <Badge variant="outline" className="text-[10px]">Days</Badge>
          </div>
          <div className="mt-3 divide-y divide-border/60">
            {CASE_TYPES.map((t) => (
              <div key={t} className="flex items-center justify-between py-1.5">
                <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-md border ${typeColor[t]}`}>
                  {t}
                </span>
                <span className="text-xs font-semibold tabular-nums text-foreground">{SLA[t]}d</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-border/70 p-3 bg-muted/30">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
              Auto-close rule
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-foreground">No-response for</span>
              <Input
                type="number"
                value={autoCloseDays}
                onChange={(e) => setAutoCloseDays(Number(e.target.value) || 0)}
                className="h-7 w-16 text-xs"
              />
              <span className="text-xs text-foreground">days → close after 3 reminders</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter bar + view toggle */}
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

          <FilterSelect value={stage} onChange={setStage} label="Stage"
            options={[...STAGES, "Reopened", "Auto-Closed"]} />
          <FilterSelect value={caseType} onChange={setCaseType} label="Case Type" options={CASE_TYPES} />
          <FilterSelect value={channel} onChange={setChannel} label="Channel" options={CHANNELS} />
          <FilterSelect value={locality} onChange={setLocality} label="Locality" options={LOCALITIES} />
          <FilterSelect value={assignee} onChange={setAssignee} label="Agent" options={AGENTS.map((a) => a.name)} />
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
            <div className="inline-flex rounded-md border border-border/70 overflow-hidden">
              <button
                onClick={() => setView("table")}
                className={`px-2.5 h-9 text-xs inline-flex items-center gap-1.5 ${
                  view === "table" ? "bg-navy text-white" : "bg-background text-foreground hover:bg-muted"
                }`}
              >
                <TableIcon className="h-3.5 w-3.5" /> Table
              </button>
              <button
                onClick={() => setView("kanban")}
                className={`px-2.5 h-9 text-xs inline-flex items-center gap-1.5 ${
                  view === "kanban" ? "bg-navy text-white" : "bg-background text-foreground hover:bg-muted"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Kanban
              </button>
            </div>
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

      {/* Main view */}
      {view === "table" ? (
        <Card className="shadow-soft border-border/70 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <Th onClick={() => toggleSort("id")}>Ticket</Th>
                  <Th onClick={() => toggleSort("citizen")}>Citizen</Th>
                  <Th onClick={() => toggleSort("locality")}>Locality</Th>
                  <Th onClick={() => toggleSort("caseType")}>Case Type</Th>
                  <Th>Channel</Th>
                  <Th onClick={() => toggleSort("assignee")}>Agent</Th>
                  <Th>Priority</Th>
                  <Th>Stage</Th>
                  <Th>Due / SLA</Th>
                  <Th onClick={() => toggleSort("createdDays")}>Created</Th>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading &&
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 10 }).map((__, j) => (
                        <TableCell key={j} className="py-3">
                          <Skeleton className="h-3 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                {!loading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="py-16">
                      <div className="flex flex-col items-center text-center">
                        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-3">
                          <Inbox className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <div className="text-sm font-semibold text-foreground">No cases match these filters</div>
                        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                          Try clearing a filter, broadening your date range, or searching by ticket ID.
                        </p>
                        <Button variant="outline" size="sm" className="mt-3 h-8 text-xs" onClick={resetFilters}>
                          Reset filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {!loading &&
                  filtered.map((g) => {
                    const ChIcon = channelIconFor(g.channel);
                    const s = slaInfo(g);
                    return (
                      <TableRow
                        key={g.id}
                        onClick={() => setSelected(g)}
                        className="cursor-pointer hover:bg-muted/40 transition-colors"
                      >
                        <TableCell className="font-mono text-xs text-navy font-semibold">{g.id}</TableCell>
                        <TableCell className="text-sm font-medium text-foreground">{g.citizen}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{g.locality}</TableCell>
                        <TableCell>
                          <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-md border ${typeColor[g.caseType]}`}>
                            {g.caseType}
                          </span>
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
                          <Badge variant="outline" className={`text-[10px] ${stageStyles[g.stage]}`}>
                            {g.stage}
                          </Badge>
                          {g.closedByOverride && (
                            <span title="Closed by override" className="ml-1 inline-flex items-center text-[10px] text-amber-700">
                              <Lock className="h-3 w-3" />
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {s.breached ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-700">
                              <AlertTriangle className="h-3 w-3" />
                              {s.label}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                              <CheckCircle2 className="h-3 w-3" />
                              {s.label}
                            </span>
                          )}
                          <div className="text-[10px] text-muted-foreground mt-0.5">Due {dueDateFor(g)}</div>
                          {g.stage === "Pending Citizen Confirmation" && (g.remindersSent ?? 0) > 0 && (
                            <div className="text-[10px] text-amber-700 mt-0.5">
                              Reminders {g.remindersSent}/3
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{g.created}</TableCell>
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
      ) : (
        <KanbanBoard
          rows={filtered}
          onSelect={setSelected}
          onMove={(id, to) => {
            updateCase(id, { stage: to });
            toast.success(`Moved to ${to}`);
          }}
        />
      )}

      {/* Detail Drawer */}
      <DetailDrawer
        grievance={selected}
        onClose={() => setSelected(null)}
        onUpdate={updateCase}
        onOpenFeedback={(g) => setFeedbackFor(g)}
        onForceClose={(g) => setForceCloseFor(g)}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        grievance={feedbackFor}
        onClose={() => setFeedbackFor(null)}
        onSubmit={(g, resolved) => {
          if (resolved) {
            updateCase(g.id, { stage: "Resolved/Closed" });
            toast.success("Case closed — citizen confirmed resolution", { description: g.id });
          } else {
            updateCase(g.id, { stage: "Reopened", reopenedCount: (g.reopenedCount ?? 0) + 1 });
            toast.error("Case reopened — citizen not satisfied", { description: g.id });
          }
          setFeedbackFor(null);
        }}
      />

      {/* Force Close Modal */}
      <ForceCloseModal
        grievance={forceCloseFor}
        onClose={() => setForceCloseFor(null)}
        onConfirm={(g, reason) => {
          updateCase(g.id, {
            stage: "Resolved/Closed",
            closedByOverride: true,
            closureReason: reason,
          });
          toast.success("Case force-closed", { description: `${g.id} • flagged as override` });
          setForceCloseFor(null);
        }}
      />
    </div>
  );
}

// ---------- Kanban ----------
function KanbanBoard({
  rows,
  onSelect,
  onMove,
}: {
  rows: Grievance[];
  onSelect: (g: Grievance) => void;
  onMove: (id: string, to: Stage) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-3 min-w-max">
        {STAGES.map((s) => {
          const items = rows.filter((r) => r.stage === s);
          return (
            <div
              key={s}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragId) onMove(dragId, s);
                setDragId(null);
              }}
              className="w-72 shrink-0 bg-muted/40 rounded-xl border border-border/70 p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${stageDotColor[s]}`} />
                  <span className="text-xs font-semibold text-foreground">{s}</span>
                </div>
                <span className="text-[10px] text-muted-foreground tabular-nums">{items.length}</span>
              </div>
              <div className="space-y-2 min-h-[100px]">
                {items.map((g) => {
                  const sla = slaInfo(g);
                  return (
                    <div
                      key={g.id}
                      draggable
                      onDragStart={() => setDragId(g.id)}
                      onClick={() => onSelect(g)}
                      className="bg-card rounded-lg border border-border/70 p-3 cursor-pointer hover:border-saffron/60 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[10px] text-navy font-semibold">{g.id}</span>
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${priorityStyles[g.priority]}`}>
                          {g.priority}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-foreground line-clamp-2">{g.description}</div>
                      <div className="mt-2 flex items-center justify-between gap-1">
                        <span className={`inline-block text-[9px] font-medium px-1.5 py-0.5 rounded-md border ${typeColor[g.caseType]}`}>
                          {g.caseType}
                        </span>
                        <span className={`text-[10px] ${sla.breached ? "text-red-700" : "text-emerald-700"}`}>
                          {sla.label}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>{g.assignee.split(" ")[0]}</span>
                        <span>{g.locality}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
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
      <SelectTrigger className="h-9 w-[150px] text-xs">
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
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mt-0.5">{label}</div>
      </div>
    </Card>
  );
}

function Stat({ big, label, tone }: { big: string; label: string; tone?: "emerald" | "amber" }) {
  const c = tone === "emerald" ? "text-emerald-700" : tone === "amber" ? "text-amber-700" : "text-foreground";
  return (
    <div>
      <div className={`text-2xl font-bold tabular-nums ${c}`}>{big}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function Ring({ label, pct, tone, invert }: { label: string; pct: number; tone: "emerald" | "amber"; invert?: boolean }) {
  const good = invert ? pct < 15 : pct >= 80;
  const color = good ? "text-emerald-700" : tone === "amber" ? "text-amber-700" : "text-red-700";
  const barColor = good ? "bg-emerald-500" : tone === "amber" ? "bg-amber-500" : "bg-red-500";
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-foreground">{label}</span>
        <span className={`text-xs font-semibold ${color}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full ${barColor} rounded-full`} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
    </div>
  );
}

// ---------- Stage Stepper ----------
function StageStepper({ current }: { current: Stage }) {
  const idx = STAGES.indexOf(current);
  const isSide = current === "Reopened" || current === "Auto-Closed";
  return (
    <div>
      <div className="flex items-center gap-0">
        {STAGES.map((s, i) => {
          const active = !isSide && i <= idx;
          const isCurrent = !isSide && i === idx;
          return (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center min-w-[40px]">
                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                    isCurrent
                      ? "bg-saffron text-white border-saffron"
                      : active
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-background text-muted-foreground border-border"
                  }`}
                >
                  {active && !isCurrent ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                </div>
              </div>
              {i < STAGES.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 ${active && i < idx ? "bg-emerald-500" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-6 gap-1 mt-1">
        {STAGES.map((s) => (
          <div key={s} className="text-[9px] text-center text-muted-foreground leading-tight">
            {s}
          </div>
        ))}
      </div>
      {isSide && (
        <div className="mt-2 text-center">
          <Badge variant="outline" className={`text-[10px] ${stageStyles[current]}`}>
            {current}
          </Badge>
        </div>
      )}
    </div>
  );
}

// ---------- Detail Drawer ----------
function DetailDrawer({
  grievance,
  onClose,
  onUpdate,
  onOpenFeedback,
  onForceClose,
}: {
  grievance: Grievance | null;
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<Grievance>) => void;
  onOpenFeedback: (g: Grievance) => void;
  onForceClose: (g: Grievance) => void;
}) {
  const [note, setNote] = useState("");
  const [showWa, setShowWa] = useState(false);
  const [resAction, setResAction] = useState<string>("");
  const [resNote, setResNote] = useState("");
  const [showFeedbackPreview, setShowFeedbackPreview] = useState(false);

  useEffect(() => {
    setNote("");
    setShowWa(false);
    setResAction(grievance?.resolutionAction ?? "");
    setResNote(grievance?.resolutionNote ?? "");
    setShowFeedbackPreview(false);
  }, [grievance?.id]);

  if (!grievance) return null;
  const ChIcon = channelIconFor(grievance.channel);
  const sla = slaInfo(grievance);

  const stageIdx = STAGES.indexOf(grievance.stage);
  const canAdvance = stageIdx >= 0 && stageIdx < STAGES.length - 1;
  const nextStage = canAdvance ? STAGES[stageIdx + 1] : null;
  const needsResolution = nextStage === "Pending Citizen Confirmation" || nextStage === "Resolved/Closed";

  const timeline: { actor: string; label: string; time: string }[] = [
    { actor: "System", label: `Logged via ${grievance.channel}`, time: `${grievance.created} • 09:14` },
    { actor: "Auto-Router", label: `Auto-assigned to ${grievance.assignee} (${grievance.caseType} Desk)`, time: `${grievance.created} • 09:14` },
    {
      actor: "SLA Engine",
      label: `Due date set: ${dueDateFor(grievance)} (${SLA[grievance.caseType]}-day SLA)`,
      time: `${grievance.created} • 09:15`,
    },
  ];
  if (stageIdx >= 2) timeline.push({ actor: grievance.assignee, label: `Moved to In Progress`, time: "24 Jun • 10:30" });
  if (grievance.resolutionAction) timeline.push({ actor: grievance.assignee, label: `Action taken: ${grievance.resolutionAction}`, time: "25 Jun • 14:00" });
  if (grievance.stage === "Pending Citizen Confirmation")
    timeline.push({ actor: "System", label: `Feedback form sent (reminders: ${grievance.remindersSent ?? 0}/3)`, time: "25 Jun • 16:00" });
  if (grievance.stage === "Resolved/Closed")
    timeline.push({
      actor: grievance.closedByOverride ? "Override" : "Citizen",
      label: grievance.closedByOverride ? `Force-closed: ${grievance.closureReason}` : "Citizen confirmed resolution",
      time: "26 Jun • 09:00",
    });
  if (grievance.stage === "Auto-Closed")
    timeline.push({ actor: "System", label: "Auto-closed — no citizen response after 3 reminders", time: "26 Jun • 00:00" });
  if (grievance.stage === "Reopened")
    timeline.push({ actor: "Citizen", label: "Reopened: not satisfied with resolution", time: "26 Jun • 11:00" });

  const waTemplate = `Namaste ${grievance.citizen} ji,\n\nThis is from the office of your Hon'ble MP regarding your complaint (${grievance.id}). We have escalated the matter to the concerned department. We will update you within 48 hours.\n\n— MP Office, Bengaluru`;

  const feedbackTemplate = `Namaste ${grievance.citizen} ji,\n\nYour complaint ${grievance.id} regarding ${grievance.caseType.toLowerCase()} has been actioned by our office.\n\nAction taken: ${resAction || grievance.resolutionAction || "—"}\n\nPlease confirm whether your issue is resolved by tapping below:\nhttps://mp-pulse.in/f/${grievance.id}\n\n— MP Office, Bengaluru`;

  const advance = () => {
    if (!nextStage) return;
    if (needsResolution && !resAction) {
      toast.error("Resolution Action required before closure");
      return;
    }
    const patch: Partial<Grievance> = { stage: nextStage };
    if (resAction) patch.resolutionAction = resAction;
    if (resNote) patch.resolutionNote = resNote;
    onUpdate(grievance.id, patch);
    toast.success(`Advanced to ${nextStage}`);
  };

  return (
    <Sheet open={!!grievance} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
        <SheetHeader className="p-5 border-b sticky top-0 bg-card z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <SheetTitle className="font-mono text-sm text-navy">{grievance.id}</SheetTitle>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={`text-[10px] ${stageStyles[grievance.stage]}`}>
                  {grievance.stage}
                </Badge>
                <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-md border ${typeColor[grievance.caseType]}`}>
                  {grievance.caseType}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priorityStyles[grievance.priority]}`}>
                  {grievance.priority} priority
                </span>
                {sla.breached ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700">
                    <AlertTriangle className="h-3 w-3" /> SLA {sla.label}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" /> {sla.label}
                  </span>
                )}
                {grievance.closedByOverride && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <Lock className="h-3 w-3" /> Closed by override
                  </span>
                )}
              </div>
              <div className="mt-2 text-[11px] text-muted-foreground">
                Assigned to <span className="font-semibold text-foreground">{grievance.assignee}</span> • Due{" "}
                <span className="font-semibold text-foreground">{dueDateFor(grievance)}</span>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="p-5 space-y-5">
          {/* Stage stepper */}
          <div className="rounded-xl border border-border/70 p-4 bg-muted/20">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">
              Pipeline
            </div>
            <StageStepper current={grievance.stage} />
            {canAdvance && (
              <div className="flex items-center justify-end mt-3">
                <Button size="sm" className="h-8 text-xs bg-navy text-white hover:bg-navy/90" onClick={advance}>
                  <TrendingUp className="h-3.5 w-3.5" /> Advance to {nextStage}
                </Button>
              </div>
            )}
          </div>

          {/* Citizen */}
          <div className="rounded-xl border border-border/70 p-4 bg-muted/20">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Citizen</div>
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
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Issue</div>
            <p className="text-sm text-foreground leading-relaxed">{grievance.description}</p>
            {grievance.hasLetter && (
              <a className="mt-3 inline-flex items-center gap-1.5 text-xs text-navy hover:underline cursor-pointer">
                <FileSignature className="h-3.5 w-3.5" />
                Linked recommendation letter • REC-2026-0091
              </a>
            )}
          </div>

          {/* Resolution Action */}
          <div className="rounded-xl border border-border/70 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Resolution Action
              </div>
              <span className="text-[10px] text-red-700">Required before closure</span>
            </div>
            <Select value={resAction} onValueChange={setResAction}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select resolution action..." />
              </SelectTrigger>
              <SelectContent>
                {RESOLUTION_ACTIONS.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Resolution note (what was done, who was contacted, outcome)..."
              value={resNote}
              onChange={(e) => setResNote(e.target.value)}
              className="text-sm min-h-[70px] mt-2"
            />
            <div className="flex items-center justify-between mt-2">
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => toast.success("Photo attached")}>
                <Camera className="h-3.5 w-3.5" /> Attach Photo
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                disabled={!resAction}
                onClick={() => {
                  onUpdate(grievance.id, { resolutionAction: resAction, resolutionNote: resNote });
                  toast.success("Resolution saved");
                }}
              >
                Save Resolution
              </Button>
            </div>
          </div>

          {/* Feedback gate when Action Taken */}
          {grievance.stage === "Action Taken" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
              <div className="text-[10px] uppercase tracking-wider text-amber-800 font-semibold mb-2">
                Feedback-Gated Closure
              </div>
              <p className="text-xs text-foreground mb-3">
                Send the citizen a WhatsApp feedback form. Case moves to <strong>Pending Citizen Confirmation</strong>.
              </p>
              <Button
                size="sm"
                className="h-9 text-xs bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={() => setShowFeedbackPreview((v) => !v)}
              >
                <MessageCircle className="h-3.5 w-3.5" /> Send Feedback Form (WhatsApp)
              </Button>
              {showFeedbackPreview && (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-white p-3">
                  <div className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold mb-2">
                    WhatsApp Preview
                  </div>
                  <pre className="text-xs text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                    {feedbackTemplate}
                  </pre>
                  <div className="flex justify-end mt-2">
                    <Button
                      size="sm"
                      className="h-8 text-xs bg-emerald-600 text-white hover:bg-emerald-700"
                      onClick={() => {
                        onUpdate(grievance.id, { stage: "Pending Citizen Confirmation", remindersSent: 0 });
                        toast.success("Feedback form sent", { description: grievance.phone });
                        setShowFeedbackPreview(false);
                      }}
                    >
                      <Send className="h-3.5 w-3.5" /> Send & Move
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {grievance.stage === "Pending Citizen Confirmation" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-amber-800 font-semibold">
                    Awaiting Citizen Confirmation
                  </div>
                  <div className="text-xs text-foreground mt-0.5">
                    Reminders sent: <strong>{grievance.remindersSent ?? 0}/3</strong>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => onOpenFeedback(grievance)}>
                  Simulate Citizen Feedback
                </Button>
              </div>
            </div>
          )}

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
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Actions</div>
            <div className="grid grid-cols-2 gap-2">
              <Select defaultValue={grievance.assignee} onValueChange={(v) => {
                onUpdate(grievance.id, { assignee: v });
                toast.success(`Reassigned to ${v}`);
              }}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Reassign" />
                </SelectTrigger>
                <SelectContent>
                  {AGENTS.map((a) => (
                    <SelectItem key={a.name} value={a.name}>
                      {a.name} — {a.desk === "General" ? "General" : `${a.desk} Desk`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs border-amber-300 text-amber-800 hover:bg-amber-50"
                onClick={() => onForceClose(grievance)}
              >
                <XCircle className="h-3.5 w-3.5" /> Force Close
              </Button>
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
              {grievance.stage === "Pending Citizen Confirmation" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 text-xs"
                  onClick={() => {
                    onUpdate(grievance.id, { remindersSent: Math.min(3, (grievance.remindersSent ?? 0) + 1) });
                    toast.success("Reminder sent to citizen");
                  }}
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Send Reminder
                </Button>
              )}
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
                <pre className="text-xs text-foreground whitespace-pre-wrap font-sans leading-relaxed">{waTemplate}</pre>
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

// ---------- Feedback Modal ----------
function FeedbackModal({
  grievance,
  onClose,
  onSubmit,
}: {
  grievance: Grievance | null;
  onClose: () => void;
  onSubmit: (g: Grievance, resolved: boolean) => void;
}) {
  const [resolved, setResolved] = useState<"yes" | "no" | "">("");
  const [rating, setRating] = useState(4);
  const [comments, setComments] = useState("");
  const [close, setClose] = useState<"yes" | "no" | "">("");

  useEffect(() => {
    if (grievance) {
      setResolved("");
      setRating(4);
      setComments("");
      setClose("");
    }
  }, [grievance?.id]);

  if (!grievance) return null;

  return (
    <Dialog open={!!grievance} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Citizen Feedback Form</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-xs text-muted-foreground">
            Simulating citizen response to feedback link for{" "}
            <span className="font-mono text-navy font-semibold">{grievance.id}</span>
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground mb-2">Was your issue resolved?</div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={resolved === "yes" ? "default" : "outline"}
                className={`h-8 text-xs ${resolved === "yes" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                onClick={() => setResolved("yes")}
              >
                Yes
              </Button>
              <Button
                size="sm"
                variant={resolved === "no" ? "default" : "outline"}
                className={`h-8 text-xs ${resolved === "no" ? "bg-red-600 hover:bg-red-700" : ""}`}
                onClick={() => setResolved("no")}
              >
                No
              </Button>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground mb-2">Satisfaction (1–5)</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`h-8 w-8 rounded-md border ${
                    n <= rating ? "bg-saffron/15 border-saffron text-saffron" : "border-border text-muted-foreground"
                  }`}
                >
                  <Star className={`h-4 w-4 mx-auto ${n <= rating ? "fill-saffron" : ""}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground mb-2">Comments</div>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Tell us more..."
              className="text-sm min-h-[60px]"
            />
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground mb-2">Should this case be closed?</div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={close === "yes" ? "default" : "outline"}
                className={`h-8 text-xs ${close === "yes" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                onClick={() => setClose("yes")}
              >
                Yes, close
              </Button>
              <Button
                size="sm"
                variant={close === "no" ? "default" : "outline"}
                className={`h-8 text-xs ${close === "no" ? "bg-red-600 hover:bg-red-700" : ""}`}
                onClick={() => setClose("no")}
              >
                No, keep open
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs bg-navy text-white hover:bg-navy/90"
            disabled={!resolved || !close}
            onClick={() => onSubmit(grievance, resolved === "yes" && close === "yes")}
          >
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Force Close Modal ----------
function ForceCloseModal({
  grievance,
  onClose,
  onConfirm,
}: {
  grievance: Grievance | null;
  onClose: () => void;
  onConfirm: (g: Grievance, reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  useEffect(() => {
    if (grievance) setReason("");
  }, [grievance?.id]);
  if (!grievance) return null;
  return (
    <Dialog open={!!grievance} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Force Close Case</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="text-xs text-muted-foreground">
            Force-closing <span className="font-mono text-navy font-semibold">{grievance.id}</span> bypasses citizen
            confirmation. The case will be flagged as <strong>Closed by override</strong> for audit.
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground mb-2">Reason (mandatory)</div>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Citizen unreachable for 30 days; resolution verified with RWA secretary."
              className="text-sm min-h-[80px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs bg-amber-600 text-white hover:bg-amber-700"
            disabled={!reason.trim()}
            onClick={() => onConfirm(grievance, reason.trim())}
          >
            <Lock className="h-3.5 w-3.5" /> Confirm Force Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
