import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckSquare,
  FileText,
  Calendar,
  AlertTriangle,
  Megaphone,
  Users,
  TrendingUp,
  Mic,
  CheckCircle2,
  XCircle,
  UserPlus,
  Smartphone,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/approvals")({
  head: () => ({ meta: [{ title: "Approvals — Citizen Pulse" }] }),
  component: ApprovalsPage,
});

type ApprovalType =
  | "Letter"
  | "Event"
  | "Sensitive Case"
  | "Social Post"
  | "Meeting"
  | "Escalation"
  | "Announcement"
  | "Appointment";

interface ApprovalItem {
  id: string;
  type: ApprovalType;
  summary: string;
  context: string;
  requestedBy: string;
  waiting: string;
  priority: "High" | "Medium" | "Low";
}

const ITEMS: ApprovalItem[] = [
  { id: "AP-118", type: "Letter", summary: "Letter to BBMP Commissioner — Mahadevapura stormwater drains", context: "Drafted by Office Sec. Cites RWA memorandum, 14 wards affected. Draft attached.", requestedBy: "Ramya (Office Sec.)", waiting: "2 h", priority: "High" },
  { id: "AP-117", type: "Event", summary: "Inauguration — Rotary blood donation drive, Indiranagar", context: "8 July, 10:30 AM. Organiser hosted MP twice in 2024. Travel conflict with Yelahanka school visit.", requestedBy: "PA Office", waiting: "4 h", priority: "Medium" },
  { id: "AP-116", type: "Sensitive Case", summary: "Temple land dispute — Rajajinagar (Sangha)", context: "Community sensitive. Two factions, media interest. Legal opinion attached.", requestedBy: "Legal/Docs", waiting: "1 d", priority: "High" },
  { id: "AP-115", type: "Social Post", summary: "X post on Hebbal flyover pothole repair completion", context: "Includes before/after photos. Drafted in Kannada + English. Awaiting approval to publish.", requestedBy: "Social Media", waiting: "3 h", priority: "Medium" },
  { id: "AP-114", type: "Meeting", summary: "Meeting request — Karnataka Industries Federation", context: "Delegation of 6 industry heads, MSME policy concerns. Proposed: Friday 4 PM.", requestedBy: "PA Office", waiting: "6 h", priority: "Medium" },
  { id: "AP-113", type: "Escalation", summary: "Escalate KR Puram water file to BWSSB Chairman", context: "File pending 47 days at zonal office. L2 reminder sent twice. Now L3.", requestedBy: "Field Coordinator", waiting: "8 h", priority: "High" },
  { id: "AP-112", type: "Announcement", summary: "Public statement on Mahadayi water sharing", context: "Deccan Herald + TV9 requesting quote. Draft prepared by Research.", requestedBy: "Research", waiting: "2 h", priority: "High" },
  { id: "AP-111", type: "Appointment", summary: "Personal meeting — Mrs. Lakshmi (widow pension case)", context: "Walked in twice this week. Case stuck at Tahsildar. 15 min slot suggested.", requestedBy: "Constituency Coord.", waiting: "1 d", priority: "Low" },
];

const typeMeta: Record<ApprovalType, { icon: typeof FileText; color: string }> = {
  Letter: { icon: FileText, color: "bg-blue-50 text-blue-700 border-blue-200" },
  Event: { icon: Calendar, color: "bg-amber-50 text-amber-800 border-amber-200" },
  "Sensitive Case": { icon: AlertTriangle, color: "bg-red-50 text-red-700 border-red-200" },
  "Social Post": { icon: Megaphone, color: "bg-purple-50 text-purple-700 border-purple-200" },
  Meeting: { icon: Users, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  Escalation: { icon: TrendingUp, color: "bg-orange-50 text-orange-700 border-orange-200" },
  Announcement: { icon: Mic, color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  Appointment: { icon: Users, color: "bg-slate-100 text-slate-700 border-slate-200" },
};

function ApprovalsPage() {
  const [done, setDone] = useState<Set<string>>(new Set());

  const decide = (id: string, action: "Approved" | "Rejected" | "Delegated") => {
    setDone((s) => new Set(s).add(id));
    const variant = action === "Rejected" ? "error" : "success";
    toast[variant === "error" ? "error" : "success"](`${id} — ${action}`);
  };

  const items = ITEMS.filter((i) => !done.has(i.id));

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1100px] mx-auto">
      <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-saffron" />
            <h1 className="text-2xl font-bold tracking-tight text-navy">Approvals</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Stay in control from anywhere — every decision the MP must make, in one queue.
          </p>
        </div>
        <Badge className="bg-saffron/15 text-saffron border border-saffron/40">
          <Smartphone className="h-3 w-3 mr-1" /> Mobile-optimised
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Pending", value: "18", color: "text-saffron" },
          { label: "Approved Today", value: "12", color: "text-emerald-600" },
          { label: "Delegated", value: "5", color: "text-navy" },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className={cn("text-3xl font-bold mt-1", s.color)}>{s.value}</div>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        {items.map((i) => {
          const meta = typeMeta[i.type];
          const Icon = meta.icon;
          return (
            <Card key={i.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center border", meta.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-md border", meta.color)}>
                      {i.type}
                    </span>
                    {i.priority === "High" && (
                      <Badge className="bg-red-600 text-white text-[10px]">HIGH PRIORITY</Badge>
                    )}
                    <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> waiting {i.waiting}
                    </span>
                    <span className="text-xs text-muted-foreground">· {i.id}</span>
                  </div>
                  <h3 className="font-semibold text-navy mt-1">{i.summary}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{i.context}</p>
                  <div className="text-xs text-muted-foreground mt-1">Requested by {i.requestedBy}</div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 justify-end">
                <Button size="sm" variant="outline" onClick={() => decide(i.id, "Delegated")}>
                  <UserPlus className="h-3.5 w-3.5" /> Delegate
                </Button>
                <Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50" onClick={() => decide(i.id, "Rejected")}>
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </Button>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => decide(i.id, "Approved")}>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                </Button>
              </div>
            </Card>
          );
        })}
        {items.length === 0 && (
          <Card className="p-10 text-center text-muted-foreground border-dashed">
            All caught up — no decisions pending.
          </Card>
        )}
      </div>
    </div>
  );
}
