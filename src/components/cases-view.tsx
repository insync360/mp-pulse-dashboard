import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Search, AlertTriangle, Clock, CheckCircle2, ClipboardList, HandHelping,
  Siren, FileSignature, ShieldCheck, Inbox as InboxIcon, MessageCircle, Phone,
  Mail, Users, Globe, ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useData } from "@/data/store";
import { WARDS, type Case, type CaseStatus, type Channel, type RecordType } from "@/data/types";
import { isAwaitingClosure, isOpen, slaBreached, formatDate, daysAgo } from "@/data/selectors";
import { cn } from "@/lib/utils";

const recordTypeMeta: Record<RecordType, { label: string; icon: typeof ClipboardList; tone: string }> = {
  Grievance: { label: "Grievance", icon: ClipboardList, tone: "bg-blue-50 text-blue-700 border-blue-200" },
  SchemeRequest: { label: "Scheme Request", icon: HandHelping, tone: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  RecommendationRequest: { label: "Recommendation", icon: FileSignature, tone: "bg-violet-50 text-violet-700 border-violet-200" },
  Emergency: { label: "Emergency", icon: Siren, tone: "bg-red-50 text-red-700 border-red-200" },
  GeneralEnquiry: { label: "Enquiry", icon: InboxIcon, tone: "bg-slate-100 text-slate-700 border-slate-200" },
};

const statusStyles: Record<CaseStatus, string> = {
  New: "bg-slate-100 text-slate-700 border-slate-200",
  Assigned: "bg-indigo-50 text-indigo-700 border-indigo-200",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  "Action Taken": "bg-violet-50 text-violet-700 border-violet-200",
  "Pending Citizen Confirmation": "bg-amber-50 text-amber-800 border-amber-200",
  Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Reopened: "bg-orange-50 text-orange-700 border-orange-200",
  "Auto-Closed": "bg-zinc-100 text-zinc-700 border-zinc-200",
};

const priorityStyles = {
  High: "bg-red-50 text-red-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-slate-100 text-slate-700",
};

const channelIcon: Record<Channel, typeof MessageCircle> = {
  WhatsApp: MessageCircle,
  Call: Phone,
  Email: Mail,
  "Walk-in": Users,
  Social: Globe,
};

export interface CasesViewProps {
  /** When set, the tab filter is locked to a single recordType (used by wrappers). */
  lockedType?: RecordType | "AwaitingClosure";
  title?: string;
  description?: string;
  /** Emergency skin (red header). */
  urgent?: boolean;
}

type TabKey = "all" | "grievance" | "scheme" | "emergency" | "awaiting" | "mine";

export function CasesView({ lockedType, title, description, urgent }: CasesViewProps) {
  const { cases, getCitizen, getOfficer, staff } = useData();
  const [tab, setTab] = useState<TabKey>(
    lockedType === "Emergency" ? "emergency"
    : lockedType === "Grievance" ? "grievance"
    : lockedType === "SchemeRequest" ? "scheme"
    : lockedType === "AwaitingClosure" ? "awaiting"
    : "all",
  );
  const [q, setQ] = useState("");
  const [wardFilter, setWardFilter] = useState<string>("all");
  const [active, setActive] = useState<Case | null>(null);

  // Apply locked / tab filter
  const tabFiltered = useMemo(() => {
    if (lockedType === "Emergency") return cases.filter((c) => c.recordType === "Emergency");
    if (lockedType === "Grievance") return cases.filter((c) => c.recordType === "Grievance");
    if (lockedType === "SchemeRequest") return cases.filter((c) => c.recordType === "SchemeRequest");
    if (lockedType === "AwaitingClosure") return cases.filter(isAwaitingClosure);
    switch (tab) {
      case "grievance": return cases.filter((c) => c.recordType === "Grievance" && isOpen(c));
      case "scheme":    return cases.filter((c) => c.recordType === "SchemeRequest" && isOpen(c));
      case "emergency": return cases.filter((c) => c.recordType === "Emergency");
      case "awaiting":  return cases.filter(isAwaitingClosure);
      case "mine":      return cases.filter((c) => c.ownerId === "STF-9" && isOpen(c)); // demo "me"
      case "all":
      default:          return cases.filter(isOpen);
    }
  }, [cases, tab, lockedType]);

  const visible = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return tabFiltered.filter((c) => {
      if (wardFilter !== "all" && c.wardId !== wardFilter) return false;
      if (!ql) return true;
      const citizen = getCitizen(c.citizenId);
      return [c.id, c.description, c.category, citizen?.name ?? ""]
        .join(" ").toLowerCase().includes(ql);
    });
  }, [tabFiltered, q, wardFilter, getCitizen]);

  // KPI counts (always from full dataset for context)
  const kpis = useMemo(() => ({
    open: cases.filter(isOpen).length,
    breached: cases.filter(slaBreached).length,
    awaiting: cases.filter(isAwaitingClosure).length,
    resolvedThisMonth: cases.filter((c) => c.status === "Resolved").length,
  }), [cases]);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className={cn(
        "rounded-xl p-5 mb-6 border",
        urgent ? "bg-gradient-to-r from-red-600 to-red-700 text-white border-red-700 shadow-lg" : "bg-card border-border",
      )}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className={cn("text-2xl font-bold tracking-tight", urgent ? "text-white" : "text-navy")}>
              {title ?? "Cases"}
            </h1>
            <p className={cn("text-sm mt-0.5", urgent ? "text-white/85" : "text-muted-foreground")}>
              {description ?? "Unified intake — grievances, scheme requests, recommendations, emergencies and enquiries on one record."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/inbox">
              <Button variant={urgent ? "secondary" : "outline"} size="sm">
                <InboxIcon className="h-4 w-4" /> Open Inbox
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Kpi label="Open cases" value={kpis.open} icon={ClipboardList} tone="text-navy" />
        <Kpi label="SLA breached" value={kpis.breached} icon={AlertTriangle} tone="text-red-600" />
        <Kpi label="Awaiting closure" value={kpis.awaiting} icon={Clock} tone="text-amber-600" />
        <Kpi label="Resolved" value={kpis.resolvedThisMonth} icon={CheckCircle2} tone="text-emerald-600" />
      </div>

      {/* Filter bar */}
      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by citizen, case id, category…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Select value={wardFilter} onValueChange={setWardFilter}>
            <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Ward" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All wards</SelectItem>
              {WARDS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="ml-auto text-xs text-muted-foreground">
            {visible.length} of {cases.length} records
          </div>
        </div>
      </Card>

      {!lockedType && (
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="mb-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="all">All Open</TabsTrigger>
            <TabsTrigger value="grievance">Grievances</TabsTrigger>
            <TabsTrigger value="scheme">Scheme Requests</TabsTrigger>
            <TabsTrigger value="emergency" className="data-[state=active]:text-red-600 data-[state=active]:bg-red-50">
              Emergencies
            </TabsTrigger>
            <TabsTrigger value="awaiting">Awaiting Closure</TabsTrigger>
            <TabsTrigger value="mine">My Cases</TabsTrigger>
          </TabsList>
          <TabsContent value={tab} />
        </Tabs>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-[120px]">Case</TableHead>
              <TableHead>Citizen / Subject</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Ward</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead>Owner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((c) => {
              const citizen = getCitizen(c.citizenId);
              const meta = recordTypeMeta[c.recordType];
              const Icon = meta.icon;
              const ChannelIcon = channelIcon[c.channel];
              const breached = slaBreached(c);
              const owner = staff.find((s) => s.id === c.ownerId);
              return (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => setActive(c)}>
                  <TableCell className="font-mono text-xs">{c.id}</TableCell>
                  <TableCell className="max-w-[280px]">
                    <div className="font-medium text-navy truncate">{citizen?.name ?? "—"}</div>
                    <div className="text-xs text-muted-foreground truncate">{c.description}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("gap-1", meta.tone)}>
                      <Icon className="h-3 w-3" />{meta.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{c.wardId}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <ChannelIcon className="h-3 w-3" /> {c.channel}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusStyles[c.status]}>{c.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {breached ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
                        <AlertTriangle className="h-3 w-3" /> Breached
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">due {formatDate(c.slaDue)}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">{owner?.name ?? "—"}</TableCell>
                </TableRow>
              );
            })}
            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-sm text-muted-foreground">
                  No cases match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Detail drawer */}
      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full sm:max-w-[560px] overflow-y-auto">
          {active && <CaseDetail c={active} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Kpi({ label, value, icon: Icon, tone }: { label: string; value: number; icon: typeof ClipboardList; tone: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className={cn("text-2xl font-bold mt-1 tabular-nums", tone)}>{value}</div>
        </div>
        <Icon className={cn("h-4 w-4", tone)} />
      </div>
    </Card>
  );
}

function CaseDetail({ c }: { c: Case }) {
  const {
    getCitizen, getOfficer, letters, commitments, departments, deptFiles,
    attachments, tasks, updateCase, staff, setLetterDraft,
  } = useData();
  const citizen = getCitizen(c.citizenId);
  const officer = c.officerId ? getOfficer(c.officerId) : undefined;
  const dept = c.departmentId ? departments.find((d) => d.id === c.departmentId) : undefined;
  const owner = staff.find((s) => s.id === c.ownerId);
  const meta = recordTypeMeta[c.recordType];
  const Icon = meta.icon;
  const relatedLetters = letters.filter((l) => l.caseId === c.id);
  const relatedCommitments = commitments.filter((cm) => cm.caseId === c.id);
  const relatedFiles = deptFiles.filter((f) => f.caseId === c.id);
  const relatedAttachments = attachments.filter((a) => a.recordType === "Case" && a.recordId === c.id);
  const relatedTasks = tasks.filter((t) => t.recordType === "Case" && t.recordId === c.id);

  const generateLetter = () => {
    setLetterDraft({
      templateId: suggestedTemplateFor(c),
      caseId: c.id,
      citizenId: c.citizenId,
      officerId: c.officerId,
      recipientName: officer?.name,
      recipientDesignation: officer?.designation,
      recipientOffice: dept?.name,
      subject: `Representation — ${c.category}, ${c.wardId}`,
      fields: {
        subjectName: citizen?.name ?? "",
        location: `${citizen?.address ?? ""}, ${c.wardId}`,
        issue: c.description,
        request: "examine and resolve as per rules",
      },
      linkedToLabel: `Case ${c.id}`,
    });
    toast.success("Letter prefilled — opening composer");
    navigate({ to: "/recommendation-letters" });
  };

  return (
    <div className="space-y-5">
      <SheetHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("gap-1", meta.tone)}>
            <Icon className="h-3 w-3" /> {meta.label}
          </Badge>
          <Badge variant="outline" className={statusStyles[c.status]}>{c.status}</Badge>
          <Badge variant="outline" className={priorityStyles[c.priority]}>{c.priority}</Badge>
        </div>
        <SheetTitle className="text-navy">{c.id}</SheetTitle>
        <p className="text-sm text-muted-foreground">{c.description}</p>
      </SheetHeader>

      {/* Stages */}
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Stage</div>
        <div className="flex flex-wrap gap-1">
          {(["New","Assigned","In Progress","Action Taken","Pending Citizen Confirmation","Resolved"] as CaseStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => updateCase(c.id, { status: s, resolvedAt: s === "Resolved" ? new Date().toISOString() : c.resolvedAt })}
              className={cn(
                "px-2 py-1 rounded border text-xs",
                c.status === s ? statusStyles[s] : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Citizen */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Citizen</div>
            <div className="font-semibold text-navy">{citizen?.name}</div>
            <div className="text-xs text-muted-foreground">{citizen?.address} · {citizen?.ward}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{citizen?.mobiles?.[0]}</div>
          </div>
          <Link to="/citizen-database" className="text-xs text-saffron inline-flex items-center gap-0.5">
            Citizen 360 <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </Card>

      {/* Officer / Owner / Dept */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Officer</div>
          <div className="text-sm font-medium text-navy">{officer?.name ?? "—"}</div>
          <div className="text-xs text-muted-foreground">{officer?.designation}</div>
          {officer && (
            <Link to="/officer-directory" className="text-[11px] text-saffron mt-1 inline-flex">View profile</Link>
          )}
        </Card>
        <Card className="p-3">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Department</div>
          <div className="text-sm font-medium text-navy">{dept?.short ?? "—"}</div>
          <div className="text-xs text-muted-foreground line-clamp-2">{dept?.name}</div>
        </Card>
        <Card className="p-3">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Owner</div>
          <div className="text-sm font-medium text-navy">{owner?.name ?? "—"}</div>
          <div className="text-xs text-muted-foreground">{owner?.role}</div>
        </Card>
      </div>

      {/* Embedded Authority Mapping engine */}
      <AuthorityHintPanel c={c} onGenerateLetter={generateLetter} />

      {/* KB tips */}
      <KbTips category={c.category} compact />

      {/* Resolution */}
      <Card className="p-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Resolution action</div>
        <div className="text-sm">{c.resolutionAction ?? "—"}</div>
        {c.resolvedAt && (
          <div className="text-xs text-emerald-700 mt-1">Resolved {formatDate(c.resolvedAt)}</div>
        )}
      </Card>

      {/* Related letters */}
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Related letters ({relatedLetters.length})</div>
        <div className="space-y-1.5">
          {relatedLetters.length === 0 && <div className="text-xs text-muted-foreground">None</div>}
          {relatedLetters.map((l) => (
            <Link to="/recommendation-letters" key={l.id} className="block">
              <Card className="p-2.5 hover:bg-muted/40">
                <div className="text-xs font-mono">{l.id}</div>
                <div className="text-sm">{l.subject}</div>
                <div className="text-[11px] text-muted-foreground">{l.status} · {formatDate(l.date)}</div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Related commitments */}
      {relatedCommitments.length > 0 && (
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Linked commitments</div>
          <div className="space-y-1.5">
            {relatedCommitments.map((cm) => (
              <Card key={cm.id} className="p-2.5">
                <div className="text-sm">{cm.text}</div>
                <div className="text-[11px] text-muted-foreground">{cm.status} · due {formatDate(cm.dueDate)}</div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Dept file */}
      {relatedFiles.length > 0 && (
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Department file</div>
          <div className="space-y-1.5">
            {relatedFiles.map((f) => (
              <Link to="/department-files" key={f.id} className="block">
                <Card className="p-2.5 hover:bg-muted/40">
                  <div className="text-xs font-mono">{f.refNo}</div>
                  <div className="text-sm">{f.subject}</div>
                  <div className="text-[11px] text-muted-foreground">
                    L{f.escalationLevel} · {f.status}{f.bottleneck ? ` · ${f.bottleneck}` : ""}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Attachments */}
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          Attachments ({relatedAttachments.length})
        </div>
        {relatedAttachments.length === 0 ? (
          <div className="text-xs text-muted-foreground">No files attached.</div>
        ) : (
          <div className="space-y-1">
            {relatedAttachments.map((a) => (
              <div key={a.id} className="text-xs flex items-center justify-between px-2 py-1.5 rounded border">
                <span className="truncate text-navy">{a.name}</span>
                <span className="text-muted-foreground ml-2">{a.kind} · {a.size}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tasks */}
      {relatedTasks.length > 0 && (
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Tasks</div>
          <div className="space-y-1">
            {relatedTasks.map((t) => {
              const tOwner = staff.find((s) => s.id === t.ownerId);
              return (
                <div key={t.id} className="text-xs flex items-center justify-between px-2 py-1.5 rounded border">
                  <span className="text-navy">{t.title}</span>
                  <span className="text-muted-foreground">{tOwner?.name} · {t.status}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Timeline</div>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>· Created {daysAgo(c.createdAt)}d ago via {c.channel}</li>
          <li>· Assigned to {owner?.name}</li>
          {c.resolutionAction && <li>· Action — {c.resolutionAction}</li>}
          {c.resolvedAt && <li>· Resolved on {formatDate(c.resolvedAt)}</li>}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t">
        <Button size="sm" className="bg-saffron hover:bg-saffron/90 text-navy" onClick={generateLetter}>
          <FileSignature className="h-3.5 w-3.5" /> Generate Letter
        </Button>
        <Link to="/authority-mapping">
          <Button variant="outline" size="sm"><ShieldCheck className="h-3.5 w-3.5" /> Authority map</Button>
        </Link>
      </div>
    </div>
  );
}

