import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ListTodo,
  User,
  Phone,
  FileText,
  Calendar,
  Building2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/staff-tasks")({
  head: () => ({ meta: [{ title: "Staff Tasks — Citizen Pulse" }] }),
  component: StaffTasksPage,
});

interface Staff {
  name: string;
  role: string;
  assigned: number;
  cases: number;
  calls: number;
  letters: number;
  events: number;
  followups: number;
  overdue: number;
  doneToday: number;
  capacity: number; // percent
}

const STAFF: Staff[] = [
  { name: "Ramya Krishnan", role: "Personal Assistant", assigned: 24, cases: 6, calls: 9, letters: 4, events: 3, followups: 2, overdue: 1, doneToday: 11, capacity: 78 },
  { name: "Mohan Rao", role: "Office Secretary", assigned: 31, cases: 8, calls: 4, letters: 12, events: 2, followups: 5, overdue: 3, doneToday: 9, capacity: 92 },
  { name: "Deepa Nair", role: "Constituency Coordinator", assigned: 28, cases: 14, calls: 6, letters: 2, events: 4, followups: 2, overdue: 2, doneToday: 8, capacity: 85 },
  { name: "Karthik R.", role: "Social Media Lead", assigned: 17, cases: 0, calls: 1, letters: 0, events: 5, followups: 11, overdue: 0, doneToday: 14, capacity: 65 },
  { name: "Adv. Vinay", role: "Legal & Docs", assigned: 12, cases: 7, calls: 0, letters: 4, events: 0, followups: 1, overdue: 2, doneToday: 3, capacity: 70 },
  { name: "Suresh Patil", role: "Field Coordinator — North", assigned: 22, cases: 12, calls: 4, letters: 1, events: 2, followups: 3, overdue: 4, doneToday: 6, capacity: 88 },
  { name: "Mahesh Gowda", role: "Field Coordinator — South", assigned: 19, cases: 10, calls: 3, letters: 1, events: 3, followups: 2, overdue: 1, doneToday: 7, capacity: 72 },
  { name: "Booth Volunteer Team", role: "Booth Volunteers (47 active)", assigned: 64, cases: 22, calls: 18, letters: 0, events: 9, followups: 15, overdue: 6, doneToday: 28, capacity: 55 },
  { name: "Anjali S.", role: "Research", assigned: 9, cases: 0, calls: 0, letters: 3, events: 0, followups: 6, overdue: 0, doneToday: 4, capacity: 50 },
  { name: "Prashant J.", role: "Parliament Assistant", assigned: 14, cases: 0, calls: 0, letters: 6, events: 0, followups: 8, overdue: 1, doneToday: 5, capacity: 60 },
];

const PRIORITY = [
  { label: "Must attend personally", count: 4, tone: "bg-red-50 text-red-700 border-red-200" },
  { label: "Send representative", count: 7, tone: "bg-amber-50 text-amber-800 border-amber-200" },
  { label: "Phone call enough", count: 12, tone: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { label: "Letter enough", count: 9, tone: "bg-blue-50 text-blue-700 border-blue-200" },
  { label: "Staff can handle", count: 38, tone: "bg-slate-100 text-slate-700 border-slate-200" },
  { label: "Politically sensitive", count: 3, tone: "bg-purple-50 text-purple-700 border-purple-200" },
  { label: "Development priority", count: 6, tone: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { label: "Media-sensitive", count: 2, tone: "bg-red-50 text-red-700 border-red-200" },
  { label: "Community-sensitive", count: 4, tone: "bg-orange-50 text-orange-700 border-orange-200" },
];

function StaffTasksPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-saffron" />
          <h1 className="text-2xl font-bold tracking-tight text-navy">Staff Tasks</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Office work register — who is doing what, how loaded, and what's slipping.
        </p>
      </div>

      {/* Time Priority */}
      <Card className="p-5 mb-6 bg-gradient-to-br from-navy to-navy/90 text-white border-navy">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-saffron" />
          <h3 className="font-semibold">Time Priority helper</h3>
          <span className="text-xs text-white/70">— how today's 85 active requests classify</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRIORITY.map((p) => (
            <span key={p.label} className={cn("text-xs font-medium px-2.5 py-1 rounded-md border", p.tone)}>
              {p.label} · <span className="font-bold">{p.count}</span>
            </span>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {STAFF.map((s) => (
          <Card
            key={s.name}
            className={cn(
              "p-5 cursor-pointer transition-all hover:shadow-md",
              selected === s.name && "ring-2 ring-saffron",
            )}
            onClick={() => setSelected(s.name === selected ? null : s.name)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-saffron/15 text-saffron flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-navy">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.role}</div>
                </div>
              </div>
              {s.overdue > 0 && (
                <Badge className="bg-red-50 text-red-700 border border-red-200">
                  <AlertCircle className="h-3 w-3 mr-1" /> {s.overdue} overdue
                </Badge>
              )}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <Stat icon={FileText} label="Cases" value={s.cases} />
              <Stat icon={Phone} label="Calls" value={s.calls} />
              <Stat icon={FileText} label="Letters" value={s.letters} />
              <Stat icon={Calendar} label="Events" value={s.events} />
              <Stat icon={Building2} label="Dept f-up" value={s.followups} />
              <Stat icon={CheckCircle2} label="Done today" value={s.doneToday} tone="text-emerald-600" />
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Workload</span>
                <span className={cn("font-semibold", s.capacity >= 85 ? "text-red-600" : s.capacity >= 70 ? "text-saffron" : "text-emerald-600")}>
                  {s.capacity}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    s.capacity >= 85 ? "bg-red-500" : s.capacity >= 70 ? "bg-saffron" : "bg-emerald-500",
                  )}
                  style={{ width: `${s.capacity}%` }}
                />
              </div>
            </div>

            {selected === s.name && (
              <div className="mt-4 pt-4 border-t flex gap-2">
                <Button size="sm" variant="outline">Reassign</Button>
                <Button size="sm" variant="outline">View all tasks</Button>
                <Button size="sm" className="bg-navy text-white hover:bg-navy/90">+ New task</Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone }: { icon: typeof FileText; label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-md bg-slate-50 px-2 py-1.5">
      <div className="flex items-center gap-1 text-muted-foreground">
        <Icon className="h-3 w-3" />
        <span>{label}</span>
      </div>
      <div className={cn("font-bold text-navy", tone)}>{value}</div>
    </div>
  );
}
