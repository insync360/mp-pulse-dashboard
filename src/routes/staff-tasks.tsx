import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ListChecks, Plus, CheckCircle2, Clock, AlertOctagon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/data/store";
import type { AttachableRecord, Task } from "@/data/types";
import { formatDate } from "@/data/selectors";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/staff-tasks")({
  head: () => ({ meta: [{ title: "Staff Tasks — Citizen Pulse" }] }),
  component: StaffTasksPage,
});

const recordRoute: Record<AttachableRecord, string> = {
  Case: "/cases", Citizen: "/citizen-database", Officer: "/officer-directory",
  Letter: "/recommendation-letters", Commitment: "/commitment-tracker",
  Event: "/event-lifecycle", Project: "/funds-and-projects",
  Demand: "/development-demand-bank", DeptFile: "/department-files",
  Organisation: "/stakeholder-crm",
};

function StaffTasksPage() {
  const { tasks, staff, updateTask, addTask } = useData();
  const [ownerFilter, setOwnerFilter] = useState("all");

  const visible = useMemo(
    () => ownerFilter === "all" ? tasks : tasks.filter((t) => t.ownerId === ownerFilter),
    [tasks, ownerFilter],
  );

  const byOwner = useMemo(() => {
    const map = new Map<string, Task[]>();
    visible.forEach((t) => {
      const arr = map.get(t.ownerId) ?? [];
      arr.push(t);
      map.set(t.ownerId, arr);
    });
    return map;
  }, [visible]);

  const counts = {
    open: tasks.filter((t) => t.status === "Open").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    overdue: tasks.filter((t) => t.status === "Overdue").length,
    done: tasks.filter((t) => t.status === "Done").length,
  };

  const quickAdd = () => {
    const owner = staff[0];
    const t: Task = {
      id: `T-${Date.now()}`,
      title: "Follow up with BBMP zonal commissioner",
      ownerId: owner.id,
      due: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
      status: "Open",
      priority: "Medium",
    };
    addTask(t);
    toast.success("Task added");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1300px] mx-auto">
      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-saffron" />
            <h1 className="text-2xl font-bold text-navy">Staff Tasks</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Every task across the office — grouped by owner. Tasks can attach to any record (Case, Letter, Project…).
          </p>
        </div>
        <Button size="sm" className="bg-saffron hover:bg-saffron/90 text-navy" onClick={quickAdd}>
          <Plus className="h-3.5 w-3.5" /> Quick task
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-5">
        <Kpi label="Open" value={counts.open} icon={Clock} />
        <Kpi label="In Progress" value={counts.inProgress} icon={Clock} tone="text-saffron" />
        <Kpi label="Overdue" value={counts.overdue} icon={AlertOctagon} tone="text-red-600" />
        <Kpi label="Done" value={counts.done} icon={CheckCircle2} tone="text-emerald-600" />
      </div>

      <Card className="p-3 mb-4 flex items-center gap-3">
        <span className="text-xs text-muted-foreground">Filter owner</span>
        <Select value={ownerFilter} onValueChange={setOwnerFilter}>
          <SelectTrigger className="h-9 w-[220px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All staff</SelectItem>
            {staff.map((s) => <SelectItem key={s.id} value={s.id}>{s.name} · {s.role}</SelectItem>)}
          </SelectContent>
        </Select>
      </Card>

      <div className="space-y-5">
        {Array.from(byOwner.entries()).map(([ownerId, items]) => {
          const owner = staff.find((s) => s.id === ownerId);
          return (
            <Card key={ownerId} className="p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b">
                <div>
                  <div className="font-semibold text-navy">{owner?.name ?? ownerId}</div>
                  <div className="text-[11px] text-muted-foreground">{owner?.role} · {owner?.desk} desk</div>
                </div>
                <Badge variant="outline" className="text-[10px]">{items.length} task(s)</Badge>
              </div>
              <div className="space-y-2">
                {items.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 px-3 py-2 rounded-md border bg-card">
                    <button
                      onClick={() => {
                        const next: Task["status"] = t.status === "Done" ? "Open" : "Done";
                        updateTask(t.id, { status: next });
                        toast.success(next === "Done" ? "Marked done" : "Re-opened");
                      }}
                      className={cn(
                        "h-5 w-5 rounded border flex items-center justify-center flex-shrink-0",
                        t.status === "Done" ? "bg-emerald-500 border-emerald-500 text-white" : "border-muted-foreground/40",
                      )}
                    >
                      {t.status === "Done" && <CheckCircle2 className="h-3 w-3" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className={cn("text-sm font-medium text-navy", t.status === "Done" && "line-through text-muted-foreground")}>
                        {t.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground flex flex-wrap items-center gap-1.5">
                        <span>due {formatDate(t.due)}</span>
                        <span>·</span>
                        <Badge variant="outline" className="text-[10px]">{t.priority}</Badge>
                        {t.recordType && t.recordId && (
                          <>
                            <span>·</span>
                            <Link to={recordRoute[t.recordType]}>
                              <Badge variant="outline" className="text-[10px] hover:bg-saffron/10">
                                attached to {t.recordType} {t.recordId}
                              </Badge>
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge className={cn(
                      "text-[10px]",
                      t.status === "Overdue" && "bg-red-100 text-red-700 border-red-200",
                      t.status === "In Progress" && "bg-saffron/15 text-saffron border-saffron/30",
                      t.status === "Open" && "bg-muted text-muted-foreground",
                      t.status === "Done" && "bg-emerald-100 text-emerald-700 border-emerald-200",
                    )}>{t.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
        {byOwner.size === 0 && (
          <Card className="p-8 text-center text-sm text-muted-foreground border-dashed">No tasks match this filter.</Card>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value, icon: Icon, tone = "text-navy" }: { label: string; value: number; icon: typeof Clock; tone?: string }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <div className={cn("h-9 w-9 rounded-md bg-muted flex items-center justify-center", tone)}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className={cn("text-2xl font-bold tabular-nums", tone)}>{value}</div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
    </Card>
  );
}
