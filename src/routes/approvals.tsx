import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ShieldCheck, FileSignature, ClipboardList, Calendar, Megaphone,
  CheckCircle2, XCircle, UserCheck, Filter,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/data/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/approvals")({
  head: () => ({ meta: [{ title: "Approvals — Citizen Pulse" }] }),
  component: ApprovalsPage,
});

type QItem = {
  id: string;
  kind: "Letter" | "Case" | "Event" | "Social Post";
  title: string;
  subtitle: string;
  meta?: string;
  to: string;
  sensitivity?: "Standard" | "Sensitive" | "Political";
  onApprove: () => void;
  onReject: () => void;
};

function ApprovalsPage() {
  const { letters, cases, events, updateLetter, updateCase } = useData();
  const [filter, setFilter] = useState<"all" | QItem["kind"]>("all");

  const queue = useMemo<QItem[]>(() => {
    const items: QItem[] = [];

    letters.filter((l) => l.status === "Pending Approval").forEach((l) => {
      items.push({
        id: l.id,
        kind: "Letter",
        title: l.subject,
        subtitle: `Recipient · ${l.recipientType} · ${l.templateType}`,
        meta: l.date,
        to: "/recommendation-letters",
        sensitivity: l.templateType === "recommend" ? "Political" : "Standard",
        onApprove: () => { updateLetter(l.id, { status: "Approved" }); toast.success(`Letter ${l.id} approved`); },
        onReject: () => { updateLetter(l.id, { status: "Declined" }); toast.error(`Letter ${l.id} declined`); },
      });
    });

    cases.filter((c) => c.priority === "High" && (c.status === "New" || c.status === "Assigned")).slice(0, 5).forEach((c) => {
      items.push({
        id: c.id,
        kind: "Case",
        title: c.description,
        subtitle: `${c.recordType} · ${c.category} · ${c.wardId}`,
        meta: `SLA ${c.slaDue}`,
        to: "/cases",
        sensitivity: c.recordType === "Emergency" ? "Sensitive" : "Standard",
        onApprove: () => { updateCase(c.id, { status: "In Progress" }); toast.success(`${c.id} cleared for action`); },
        onReject: () => { updateCase(c.id, { status: "Auto-Closed" }); toast.error(`${c.id} closed without action`); },
      });
    });

    events.filter((e) => e.stage === "Planned").slice(0, 3).forEach((e) => {
      items.push({
        id: e.id,
        kind: "Event",
        title: e.name,
        subtitle: `${e.type} · ${e.location}`,
        meta: e.date,
        to: "/event-lifecycle",
        sensitivity: "Standard",
        onApprove: () => toast.success(`${e.name} confirmed on the MP's calendar`),
        onReject: () => toast.error(`${e.name} declined`),
      });
    });

    // Mock social posts pending
    ["SP-2026-118", "SP-2026-119"].forEach((id, i) => {
      const drafts = [
        "Glad to share the sanction of ₹2.4 Cr for Whitefield stormwater desilting — phase-I begins next week.",
        "On Yoga Day, will join the morning camp at KR Puram Ground. All residents welcome.",
      ];
      items.push({
        id, kind: "Social Post", title: drafts[i],
        subtitle: "Drafted by Comms Desk · for MP X / Instagram",
        meta: "scheduled today",
        to: "/recommendations",
        sensitivity: i === 0 ? "Political" : "Standard",
        onApprove: () => toast.success(`${id} approved for posting`),
        onReject: () => toast.error(`${id} sent back to comms`),
      });
    });

    return items;
  }, [letters, cases, events, updateLetter, updateCase]);

  const visible = filter === "all" ? queue : queue.filter((q) => q.kind === filter);

  const counts = {
    Letter: queue.filter((q) => q.kind === "Letter").length,
    Case: queue.filter((q) => q.kind === "Case").length,
    Event: queue.filter((q) => q.kind === "Event").length,
    "Social Post": queue.filter((q) => q.kind === "Social Post").length,
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1100px] mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="h-5 w-5 text-saffron" />
        <h1 className="text-2xl font-bold text-navy">Approvals</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Cross-object queue — every record awaiting the MP's nod. Approve / Reject / Delegate.
      </p>

      <div className="flex flex-wrap gap-2 mb-5 items-center">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        <Pill active={filter === "all"} onClick={() => setFilter("all")} label={`All · ${queue.length}`} />
        <Pill active={filter === "Letter"} onClick={() => setFilter("Letter")} label={`Letters · ${counts.Letter}`} icon={FileSignature} />
        <Pill active={filter === "Case"} onClick={() => setFilter("Case")} label={`Sensitive Cases · ${counts.Case}`} icon={ClipboardList} />
        <Pill active={filter === "Event"} onClick={() => setFilter("Event")} label={`Events · ${counts.Event}`} icon={Calendar} />
        <Pill active={filter === "Social Post"} onClick={() => setFilter("Social Post")} label={`Social Posts · ${counts["Social Post"]}`} icon={Megaphone} />
      </div>

      <div className="space-y-3">
        {visible.length === 0 && (
          <Card className="p-8 text-center text-sm text-muted-foreground border-dashed">
            Inbox zero — nothing waiting on the MP right now.
          </Card>
        )}
        {visible.map((q) => (
          <Card key={`${q.kind}-${q.id}`} className="p-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge variant="outline" className="text-[10px]">{q.kind}</Badge>
                  <span className="text-xs font-mono text-muted-foreground">{q.id}</span>
                  {q.sensitivity && q.sensitivity !== "Standard" && (
                    <Badge className={cn("text-[10px]", q.sensitivity === "Political" ? "bg-saffron/15 text-saffron border-saffron/30" : "bg-red-100 text-red-700 border-red-200")}>
                      {q.sensitivity}
                    </Badge>
                  )}
                  {q.meta && <span className="text-[11px] text-muted-foreground">· {q.meta}</span>}
                </div>
                <Link to={q.to}>
                  <div className="font-medium text-navy hover:underline line-clamp-2">{q.title}</div>
                </Link>
                <div className="text-xs text-muted-foreground mt-0.5">{q.subtitle}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button size="sm" variant="outline" onClick={q.onReject}><XCircle className="h-3.5 w-3.5" /> Reject</Button>
                <Button size="sm" variant="outline" onClick={() => toast.info(`${q.id} delegated to PA`)}><UserCheck className="h-3.5 w-3.5" /> Delegate</Button>
                <Button size="sm" className="bg-saffron hover:bg-saffron/90 text-navy" onClick={q.onApprove}>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Pill({ active, onClick, label, icon: Icon }: { active: boolean; onClick: () => void; label: string; icon?: typeof FileSignature }) {
  return (
    <button onClick={onClick} className={cn(
      "px-3 py-1.5 rounded-full border text-xs font-medium inline-flex items-center gap-1.5",
      active ? "bg-navy text-white border-navy" : "bg-card text-muted-foreground hover:bg-muted",
    )}>
      {Icon && <Icon className="h-3 w-3" />} {label}
    </button>
  );
}
