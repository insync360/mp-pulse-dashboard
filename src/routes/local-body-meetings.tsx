import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calendar, CheckCircle2, AlertTriangle, Users, X, FileText, Paperclip, BellRing } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/local-body-meetings")({
  head: () => ({ meta: [{ title: "Local Body Meetings — Citizen Pulse" }] }),
  component: LocalBodyMeetingsPage,
});

type Status = "Pending" | "In Progress" | "Done" | "Overdue";
type Action = { id: string; meeting: string; item: string; owner: string; due: string; status: Status };
type Meeting = {
  id: string; name: string; type: string; date: string; upcoming?: boolean;
  agenda: string[]; attendees: string[];
  decisions: { issue: string; decision: string; owner: string; deadline: string; followUp: Status }[];
  documents: string[];
  nextMeeting?: string;
};

const MEETINGS: Meeting[] = [
  { id: "M-001", name: "DISHA Meeting — Bengaluru Urban", type: "DISHA", date: "18 Jun 2026", agenda: ["MPLADS utilisation review","PMAY-U progress","Jal Jeevan Mission rural component","Swachh Bharat U progress"], attendees: ["MP (Chair)", "DC Bengaluru Urban", "CEO ZP", "BBMP Commissioner (rep)", "EE PWD", "BWSSB Chief Engineer"],
    decisions: [
      { issue: "MPLADS utilisation 62% — push to 85%", decision: "10 pending works to be released by 15 Jul", owner: "DC + ZP", deadline: "15 Jul 2026", followUp: "In Progress" },
      { issue: "PMAY beneficiary verification backlog", decision: "Special drive in 4 wards", owner: "BBMP JC Welfare", deadline: "30 Jul 2026", followUp: "Pending" },
    ],
    documents: ["DISHA-Minutes-Jun26.pdf", "MPLADS-status.xlsx"], nextMeeting: "20 Sep 2026",
  },
  { id: "M-002", name: "Ward Committee — Ward 150 Mahadevapura", type: "Ward Committee", date: "22 Jun 2026", agenda: ["Storm-water drain Varthur","Garbage black spots","Street lights"], attendees: ["Corporator","BBMP AEE","Health Inspector","RWA reps"],
    decisions: [
      { issue: "Varthur SWD encroachment", decision: "Joint inspection in 10 days", owner: "EE SWD East", deadline: "02 Jul 2026", followUp: "In Progress" },
      { issue: "Black spot near Brookefield", decision: "Daily clearance + CCTV warning", owner: "Health Inspector", deadline: "28 Jun 2026", followUp: "Overdue" },
    ],
    documents: ["Ward150-Minutes.pdf"], nextMeeting: "20 Jul 2026",
  },
  { id: "M-003", name: "Zilla Panchayat — General Body", type: "Zilla Panchayat", date: "10 Jun 2026", agenda: ["JJM rural progress","NREGA wage payment delays","Sericulture support"], attendees: ["ZP President", "CEO ZP", "MP (Special invitee)", "Block Panchayat Presidents"],
    decisions: [
      { issue: "JJM coverage gap in 22 GPs", decision: "Tenders to be re-floated", owner: "EE RWS&S", deadline: "31 Jul 2026", followUp: "In Progress" },
      { issue: "NREGA payment delays", decision: "DBT issue to be escalated to State", owner: "CEO ZP", deadline: "30 Jun 2026", followUp: "Overdue" },
    ],
    documents: ["ZP-GB-Minutes.pdf"], nextMeeting: "15 Jul 2026",
  },
  { id: "M-004", name: "BBMP Council Session", type: "Corporation", date: "02 Jul 2026", upcoming: true, agenda: ["Budget review","SWM contract","White-topping Phase 4"], attendees: ["Mayor","Commissioner","Councillors","MP (invited)"], decisions: [], documents: [] },
  { id: "M-005", name: "Department Review — BWSSB East", type: "Department Review", date: "28 Jun 2026", upcoming: true, agenda: ["KR Puram supply schedule","Hoodi pressure issue","NRW reduction"], attendees: ["MP","Chairman BWSSB","CE East","EE Divisions"], decisions: [], documents: [] },
  { id: "M-006", name: "Gram Panchayat — Avalahalli", type: "Gram Panchayat", date: "30 Jun 2026", upcoming: true, agenda: ["Borewell repairs","Anganwadi building","NREGA works"], attendees: ["PDO","GP members","MP (Special invitee)"], decisions: [], documents: [] },
  { id: "M-007", name: "Taluk Panchayat — Bengaluru East", type: "Taluk Panchayat", date: "05 Jul 2026", upcoming: true, agenda: ["NRDWP","Mid-day meal","School infrastructure"], attendees: ["EO TP","TP President","MP (invited)"], decisions: [], documents: [] },
  { id: "M-008", name: "Ward Committee — Ward 84 KR Puram", type: "Ward Committee", date: "10 Jul 2026", upcoming: true, agenda: ["Water tanker schedule","Pothole repair","Park maintenance"], attendees: ["Corporator","BBMP AEE","RWA reps","MP (invited)"], decisions: [], documents: [] },
];

const STATUS_COLOR: Record<Status, string> = {
  "Pending": "bg-slate-100 text-slate-700",
  "In Progress": "bg-blue-100 text-blue-800",
  "Done": "bg-green-100 text-green-800",
  "Overdue": "bg-red-100 text-red-700",
};

function StatCard({ icon: Icon, label, value, accent, danger }: any) {
  return (
    <Card className={danger ? "border-red-200" : ""}>
      <CardContent className="p-5"><div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${accent}`}><Icon className="h-5 w-5" /></div>
        <div>
          <div className={`text-2xl font-bold ${danger ? "text-red-600" : "text-[#0A1F44]"}`}>{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </div></CardContent>
    </Card>
  );
}

function LocalBodyMeetingsPage() {
  const [tab, setTab] = useState("meetings");
  const [drawer, setDrawer] = useState<Meeting | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const allActions: Action[] = useMemo(() => {
    const arr: Action[] = [];
    MEETINGS.forEach(m => m.decisions.forEach((d, idx) => {
      arr.push({ id: `${m.id}-A${idx+1}`, meeting: m.name, item: d.decision, owner: d.owner, due: d.deadline, status: d.followUp });
    }));
    return arr;
  }, []);

  const filteredActions = allActions.filter(a => statusFilter === "all" || a.status === statusFilter);
  const upcoming = MEETINGS.filter(m => m.upcoming);
  const past = MEETINGS.filter(m => !m.upcoming);

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-[#0A1F44]">Local Body Meetings</h1>
        <p className="text-sm text-muted-foreground">DISHA, BBMP Council, Ward Committees, Panchayats, Department Reviews — every meeting and every action item tracked.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard icon={Calendar} label="Upcoming Meetings" value="6" accent="bg-blue-100 text-blue-700" />
        <StatCard icon={CheckCircle2} label="Action Items Open" value="23" accent="bg-amber-100 text-amber-700" />
        <StatCard icon={AlertTriangle} label="Overdue Actions" value="7" accent="bg-red-100 text-red-700" danger />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-slate-100">
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="actions">Action Items ({allActions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="meetings" className="mt-4 space-y-6">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">Upcoming</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {upcoming.map(m => (
                <Card key={m.id} className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-[#FF9933]" onClick={() => setDrawer(m)}>
                  <CardContent className="p-4 space-y-2">
                    <Badge variant="outline" className="text-[10px]">{m.type}</Badge>
                    <div className="font-semibold text-[#0A1F44]">{m.name}</div>
                    <div className="text-xs text-slate-600 flex items-center gap-1"><Calendar className="h-3 w-3" />{m.date}</div>
                    <div className="text-xs text-slate-500 line-clamp-1">{m.agenda.join(" · ")}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">Past meetings</h2>
            <div className="space-y-2">
              {past.map(m => (
                <Card key={m.id} className="cursor-pointer hover:bg-slate-50" onClick={() => setDrawer(m)}>
                  <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-[220px]">
                      <div className="flex items-center gap-2"><Badge variant="outline" className="text-[10px]">{m.type}</Badge><span className="text-xs text-slate-600">{m.date}</span></div>
                      <div className="font-semibold text-[#0A1F44] mt-1">{m.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{m.agenda.join(" · ")}</div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{m.decisions.length} decisions</Badge>
                      {m.documents.length > 0 && <Badge variant="outline" className="gap-1"><Paperclip className="h-3 w-3" />{m.documents.length}</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="mt-4">
          <Card>
            <CardHeader className="pb-2"><div className="flex items-center justify-between"><CardTitle className="text-base text-[#0A1F44]">All Action Items — across meetings</CardTitle>
              <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-40 h-9"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All statuses</SelectItem>{(["Pending","In Progress","Done","Overdue"] as Status[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select></div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Meeting</TableHead><TableHead>Action item</TableHead><TableHead>Owner</TableHead><TableHead>Due</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredActions.map(a => (
                    <TableRow key={a.id} className={a.status === "Overdue" ? "bg-red-50/40" : ""}>
                      <TableCell className="font-mono text-xs">{a.id}</TableCell>
                      <TableCell className="text-xs">{a.meeting}</TableCell>
                      <TableCell className="text-sm text-[#0A1F44] max-w-[300px]"><div className="line-clamp-2">{a.item}</div></TableCell>
                      <TableCell className="text-xs">{a.owner}</TableCell>
                      <TableCell className="text-xs">{a.due}</TableCell>
                      <TableCell><Badge className={`${STATUS_COLOR[a.status]} hover:${STATUS_COLOR[a.status]}`}>{a.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Sheet open={!!drawer} onOpenChange={(o) => !o && setDrawer(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {drawer && (
            <>
              <SheetHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="text-[10px] mb-1">{drawer.type}</Badge>
                    <SheetTitle className="text-[#0A1F44]">{drawer.name}</SheetTitle>
                    <div className="text-sm text-slate-600">{drawer.date}</div>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => setDrawer(null)}><X className="h-4 w-4" /></Button>
                </div>
              </SheetHeader>

              <div className="mt-5">
                <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Agenda</div>
                <ul className="text-sm list-disc pl-5 space-y-1">{drawer.agenda.map((a, i) => <li key={i}>{a}</li>)}</ul>
              </div>

              <div className="mt-5">
                <div className="text-xs font-semibold uppercase text-slate-500 mb-2 flex items-center gap-2"><Users className="h-3 w-3" />Attendees</div>
                <div className="flex flex-wrap gap-1">{drawer.attendees.map((a, i) => <Badge key={i} variant="outline" className="text-xs">{a}</Badge>)}</div>
              </div>

              {drawer.decisions.length > 0 && (
                <div className="mt-5">
                  <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Issues, decisions & follow-ups</div>
                  <div className="space-y-2">
                    {drawer.decisions.map((d, i) => (
                      <div key={i} className="border rounded-md p-3 bg-slate-50 space-y-1">
                        <div className="text-sm font-medium text-[#0A1F44]">{d.issue}</div>
                        <div className="text-xs text-slate-700">→ {d.decision}</div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">Owner: <span className="font-medium">{d.owner}</span> · Deadline: <span className="font-medium">{d.deadline}</span></span>
                          <Badge className={`${STATUS_COLOR[d.followUp]} hover:${STATUS_COLOR[d.followUp]}`}>{d.followUp}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {drawer.documents.length > 0 && (
                <div className="mt-5">
                  <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Documents</div>
                  <div className="flex flex-wrap gap-2">{drawer.documents.map(d => <Badge key={d} variant="outline" className="gap-1"><FileText className="h-3 w-3" />{d}</Badge>)}</div>
                </div>
              )}

              <div className="mt-5 pt-4 border-t flex items-center justify-between gap-2 flex-wrap">
                <div className="text-xs text-slate-600">{drawer.nextMeeting ? <>Next meeting: <span className="font-semibold text-[#0A1F44]">{drawer.nextMeeting}</span></> : "Next meeting not yet scheduled"}</div>
                <Button size="sm" className="bg-[#FF9933] text-white" onClick={() => toast.success("Reminder set for next meeting")}><BellRing className="h-3 w-3" /> Set Next-meeting Reminder</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
