import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, MapPin, Users, FileText, Plus, Route as RouteIcon, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar & Visits — MP Pulse" }] }),
  component: CalendarPage,
});

type EventType = "Parliament" | "Constituency" | "Political" | "Personal";
type Event = {
  id: string; title: string; type: EventType; day: number; start: string; end: string;
  location: string; attendees: string; brief?: string;
};

const TYPE_COLORS: Record<EventType, { bg: string; bar: string; text: string }> = {
  Parliament: { bg: "bg-[#0A1F44]/10", bar: "border-l-[#0A1F44]", text: "text-[#0A1F44]" },
  Constituency: { bg: "bg-[#FF9933]/10", bar: "border-l-[#FF9933]", text: "text-[#FF9933]" },
  Political: { bg: "bg-green-100", bar: "border-l-green-600", text: "text-green-700" },
  Personal: { bg: "bg-slate-200", bar: "border-l-slate-400", text: "text-slate-600" },
};

const DAYS = ["Mon 23", "Tue 24", "Wed 25", "Thu 26", "Fri 27", "Sat 28", "Sun 29"];
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

const EVENTS: Event[] = [
  { id: "e1", title: "Parliament Question Hour Prep", type: "Parliament", day: 0, start: "10:00", end: "11:30", location: "MP Office", attendees: "Research team (4)", brief: "Q on metro Phase-3 funding" },
  { id: "e2", title: "BBMP Coordination Meet", type: "Constituency", day: 1, start: "09:00", end: "10:30", location: "BBMP HQ", attendees: "Commissioner + 3 CEs", brief: "Whitefield flooding action plan" },
  { id: "e3", title: "Party State Executive", type: "Political", day: 1, start: "15:00", end: "17:00", location: "State Party Office", attendees: "State Pres. + 22", brief: "2026 strategy" },
  { id: "e4", title: "Family Dinner", type: "Personal", day: 2, start: "19:00", end: "20:30", location: "Residence", attendees: "Family" },
  { id: "e5", title: "RWA Federation Meeting", type: "Constituency", day: 3, start: "09:00", end: "10:00", location: "Whitefield Community Hall", attendees: "280 RWA reps", brief: "Lake & traffic concerns" },
  { id: "e6", title: "Borewell Inauguration", type: "Constituency", day: 3, start: "11:30", end: "12:30", location: "KR Puram Ward 84", attendees: "Corporator + media", brief: "Cauvery Stage-V context" },
  { id: "e7", title: "Industry Lunch", type: "Political", day: 3, start: "13:30", end: "15:00", location: "Marathahalli", attendees: "12 IT firm reps", brief: "Last-mile connectivity" },
  { id: "e8", title: "Standing Committee", type: "Parliament", day: 4, start: "11:00", end: "13:00", location: "Video conf.", attendees: "Committee members", brief: "Urban dev report" },
  { id: "e9", title: "Booth Cadre Review", type: "Political", day: 4, start: "17:00", end: "18:30", location: "MP Office", attendees: "Mandal presidents (8)" },
  { id: "e10", title: "Sri Ramesh Kumar — Birthday Visit", type: "Personal", day: 5, start: "10:00", end: "11:00", location: "Whitefield", attendees: "Personal" },
];

const CONFLICTS = [
  "26 Jun: 12-min gap between KR Puram and Marathahalli — needs 18 min travel.",
  "24 Jun: BBMP Coordination Meet overlaps prep window for Party Executive — leave by 14:15.",
];

const AREA_PLAN: Record<string, { events: string[]; grievances: string[]; brief: string[] }> = {
  Whitefield: {
    events: ["RWA Federation Meeting (Thu)", "Sri Ramesh Kumar birthday visit (Sat)"],
    grievances: ["32 flooding complaints — Ward 84", "Lake encroachment petitions (12)", "Traffic at ITPL junction"],
    brief: ["Whitefield monsoon flooding — TOI traction High", "Lake rejuvenation funds promised Mar 2026", "Avoid Varthur lake court case specifics"],
  },
  "KR Puram": {
    events: ["Borewell Inauguration (Thu)", "Lakshmi Rao anniversary (Sun)"],
    grievances: ["18 water-supply complaints overnight", "Pedestrian crossing near station", "BBMP road resurfacing"],
    brief: ["Cauvery Stage-V tap connections in delivery", "Pending sewage line — Ward 80", "Local school sanction approved"],
  },
  Mahadevapura: {
    events: ["MLA joint review (Wed)", "Math festival (mid-Jul)"],
    grievances: ["Water supply — multiple SLAs breached", "Garbage collection — Ward 150", "Encroachment on storm-water drains"],
    brief: ["Joint lake rejuvenation with MLA Hegde", "Sentiment turning negative on #BengaluruWater", "Avoid old quarry land controversy"],
  },
};

function CalendarPage() {
  const [selected, setSelected] = useState<Event | null>(null);
  const [area, setArea] = useState<string>("Whitefield");
  const [optimized, setOptimized] = useState(false);
  const [view, setView] = useState<"week" | "month">("week");

  const eventsByCell = (day: number, hour: string) => EVENTS.filter(e => e.day === day && e.start === hour);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1F44]">Calendar & Visits</h1>
          <p className="text-slate-500 mt-1">Week of 23–29 June 2026</p>
        </div>
        <div className="flex gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as "week" | "month")}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          <AddEventDialog />
        </div>
      </div>

      {/* Conflicts strip */}
      <Card className="border-l-4 border-l-amber-500 border-slate-200 bg-amber-50/40">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-[#0A1F44] text-sm">Conflicts & Travel</p>
              {CONFLICTS.map((c, i) => <p key={i} className="text-sm text-slate-700">• {c}</p>)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {(Object.keys(TYPE_COLORS) as EventType[]).map(t => (
          <div key={t} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm ${TYPE_COLORS[t].bg} border-l-2 ${TYPE_COLORS[t].bar}`} />
            <span className="text-slate-600">{t}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card className="border-slate-200 lg:col-span-3">
          <CardContent className="p-0 overflow-x-auto">
            {view === "week" ? (
              <div className="min-w-[900px]">
                <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-slate-200 bg-slate-50">
                  <div />
                  {DAYS.map(d => <div key={d} className="p-2 text-center text-xs font-semibold text-[#0A1F44] border-l border-slate-200">{d}</div>)}
                </div>
                {HOURS.map(h => (
                  <div key={h} className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-slate-100 min-h-[56px]">
                    <div className="p-1 text-[10px] text-slate-400 text-right pr-2">{h}</div>
                    {DAYS.map((_, d) => (
                      <div key={d} className="border-l border-slate-100 p-1 space-y-1">
                        {eventsByCell(d, h).map(ev => (
                          <Popover key={ev.id}>
                            <PopoverTrigger asChild>
                              <button onClick={() => setSelected(ev)}
                                className={`w-full text-left text-[11px] p-1.5 rounded border-l-2 ${TYPE_COLORS[ev.type].bg} ${TYPE_COLORS[ev.type].bar} hover:shadow-sm transition`}>
                                <p className={`font-semibold ${TYPE_COLORS[ev.type].text} truncate`}>{ev.title}</p>
                                <p className="text-slate-500 truncate">{ev.start}–{ev.end}</p>
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-72">
                              <p className="font-semibold text-[#0A1F44]">{ev.title}</p>
                              <Badge variant="outline" className="mt-1 text-[10px]">{ev.type}</Badge>
                              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                                <p>🕐 {ev.start}–{ev.end}</p>
                                <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {ev.location}</p>
                                <p className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {ev.attendees}</p>
                                {ev.brief && <p className="flex items-center gap-1.5"><FileText className="w-3 h-3" /> Brief: {ev.brief}</p>}
                              </div>
                              {ev.brief && <Button size="sm" className="mt-3 w-full bg-[#0A1F44] hover:bg-[#0A1F44]/90"
                                onClick={() => window.location.href = "/briefings-speeches"}>View Brief</Button>}
                            </PopoverContent>
                          </Popover>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <div key={d} className="text-center font-semibold text-[#0A1F44] py-2">{d}</div>)}
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(d => (
                    <div key={d} className="aspect-square border border-slate-200 rounded p-1.5 hover:bg-slate-50">
                      <p className="text-slate-700 font-medium">{d}</p>
                      {d >= 23 && d <= 28 && <div className="mt-1 h-1.5 rounded-full bg-[#FF9933]" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visit planner */}
        <Card className="border-slate-200 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-[#0A1F44] flex items-center gap-2 text-base">
              <Sparkles className="w-4 h-4 text-[#FF9933]" /> Plan a Constituency Tour
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={area} onValueChange={(v) => { setArea(v); setOptimized(false); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(AREA_PLAN).map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>

            <div>
              <p className="text-xs font-semibold text-[#0A1F44] uppercase tracking-wide mb-2">Pending events</p>
              <ul className="space-y-1 text-sm text-slate-700">
                {AREA_PLAN[area].events.map((e, i) => <li key={i} className="flex gap-2"><span className="text-[#FF9933]">•</span>{e}</li>)}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#0A1F44] uppercase tracking-wide mb-2">Grievance hotspots</p>
              <ul className="space-y-1 text-sm text-slate-700">
                {AREA_PLAN[area].grievances.map((e, i) => <li key={i} className="flex gap-2"><span className="text-red-500">•</span>{e}</li>)}
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-[#0A1F44] text-white">
              <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-[#FF9933]">Local Issue Brief — Top 3</p>
              <ul className="space-y-1 text-xs">
                {AREA_PLAN[area].brief.map((e, i) => <li key={i} className="flex gap-2 opacity-90"><span>•</span>{e}</li>)}
              </ul>
            </div>

            <Button className="w-full bg-[#FF9933] hover:bg-[#FF9933]/90 text-white" onClick={() => { setOptimized(true); toast.success("Route optimized · 1h 12m drive"); }}>
              <RouteIcon className="w-4 h-4 mr-1.5" /> Optimize Route
            </Button>
            {optimized && (
              <div className="text-xs text-slate-600 p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="font-semibold text-green-700 mb-1">Optimized order:</p>
                <ol className="list-decimal list-inside space-y-0.5">
                  {AREA_PLAN[area].events.map((e, i) => <li key={i}>{e}</li>)}
                </ol>
                <p className="mt-2 text-slate-500">Total drive: ~72 min</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selected && (
        <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>{selected.title}</DialogTitle></DialogHeader>
            <p className="text-sm text-slate-600">{selected.start}–{selected.end} · {selected.location}</p>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function AddEventDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#0A1F44] hover:bg-[#0A1F44]/90"><Plus className="w-4 h-4 mr-1" /> Add Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Event</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Title</Label><Input placeholder="Event title" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <Select defaultValue="Constituency"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(["Parliament", "Constituency", "Political", "Personal"] as EventType[]).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Date / Time</Label><Input type="datetime-local" /></div>
          </div>
          <div><Label>Location</Label><Input placeholder="Address or venue" /></div>
          <div><Label>Attendees</Label><Input placeholder="Names or groups" /></div>
          <div><Label>Notes</Label><Textarea rows={2} /></div>
        </div>
        <DialogFooter>
          <Button onClick={() => { toast.success("Event added"); setOpen(false); }} className="bg-[#FF9933] hover:bg-[#FF9933]/90">Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
