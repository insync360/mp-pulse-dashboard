import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CalendarCheck, MapPin, Users, Camera, MessageSquare, FileText,
  CheckCircle2, Clock, Sparkles, Image as ImageIcon, Send, Plus, ArrowRight,
  School, Church, Building2, Scissors, HeartCrack, PartyPopper, HandHeart,
  Factory, Newspaper, Flag, Hammer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/event-lifecycle")({
  head: () => ({ meta: [{ title: "Event Lifecycle — Citizen Pulse" }] }),
  component: EventLifecyclePage,
});

type Stage =
  | "Invitation Received" | "Accepted/Declined" | "Brief Prepared" | "Attended"
  | "Photos Uploaded" | "Social Post Drafted" | "Commitments Captured" | "Follow-up Closed";

type EType =
  | "School" | "Religious" | "RWA" | "Inauguration" | "Condolence" | "Wedding"
  | "Party" | "NGO" | "Industry" | "Press" | "Govt launch" | "Foundation stone";

type Ev = {
  id: string; name: string; type: EType; date: string; location: string;
  organiser: string; stage: Stage; decision?: "Attend" | "Decline" | "Send representative";
  brief?: string; photos: number; commitments: number; followUp?: string;
};

const STAGES: Stage[] = [
  "Invitation Received", "Accepted/Declined", "Brief Prepared", "Attended",
  "Photos Uploaded", "Social Post Drafted", "Commitments Captured", "Follow-up Closed",
];

const TYPE_META: Record<EType, { icon: any; tone: string }> = {
  School: { icon: School, tone: "bg-blue-50 text-blue-700 border-blue-200" },
  Religious: { icon: Church, tone: "bg-amber-50 text-amber-700 border-amber-200" },
  RWA: { icon: Building2, tone: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  Inauguration: { icon: Scissors, tone: "bg-[#FF9933]/10 text-[#FF9933] border-[#FF9933]/30" },
  Condolence: { icon: HeartCrack, tone: "bg-slate-100 text-slate-700 border-slate-200" },
  Wedding: { icon: HandHeart, tone: "bg-pink-50 text-pink-700 border-pink-200" },
  Party: { icon: PartyPopper, tone: "bg-purple-50 text-purple-700 border-purple-200" },
  NGO: { icon: HandHeart, tone: "bg-teal-50 text-teal-700 border-teal-200" },
  Industry: { icon: Factory, tone: "bg-zinc-100 text-zinc-700 border-zinc-200" },
  Press: { icon: Newspaper, tone: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  "Govt launch": { icon: Flag, tone: "bg-[#0A1F44]/10 text-[#0A1F44] border-[#0A1F44]/30" },
  "Foundation stone": { icon: Hammer, tone: "bg-orange-50 text-orange-700 border-orange-200" },
};

const SEED: Ev[] = [
  { id: "EV-2041", name: "KR Puram Govt School Annual Day", type: "School", date: "2026-07-02", location: "KR Puram", organiser: "Headmaster S. Reddy", stage: "Invitation Received", photos: 0, commitments: 0 },
  { id: "EV-2042", name: "Sri Someshwara Temple Brahmotsava", type: "Religious", date: "2026-07-04", location: "Halasuru", organiser: "Temple Committee", stage: "Accepted/Declined", decision: "Attend", photos: 0, commitments: 0 },
  { id: "EV-2043", name: "Whitefield RWA Federation Meet", type: "RWA", date: "2026-07-05", location: "Whitefield", organiser: "WRRDA", stage: "Brief Prepared", decision: "Attend", brief: "200+ residents. Top issues: garbage SWM lapse, lake encroachment.", photos: 0, commitments: 0 },
  { id: "EV-2044", name: "Mahadevapura Flyover Inauguration", type: "Inauguration", date: "2026-06-28", location: "Mahadevapura", organiser: "BBMP / PWD", stage: "Attended", decision: "Attend", brief: "₹84 Cr project. Joint event with MLA.", photos: 0, commitments: 0 },
  { id: "EV-2045", name: "Condolence — Sri Ramaiah", type: "Condolence", date: "2026-06-27", location: "Indiranagar", organiser: "Family", stage: "Photos Uploaded", decision: "Attend", photos: 6, commitments: 0 },
  { id: "EV-2046", name: "BTM Layout Ganesh Utsav 2026", type: "Religious", date: "2026-06-26", location: "BTM Layout", organiser: "Yuvaka Sangha", stage: "Social Post Drafted", decision: "Attend", photos: 12, commitments: 0 },
  { id: "EV-2047", name: "ITPL Industry Roundtable", type: "Industry", date: "2026-06-25", location: "Whitefield", organiser: "NASSCOM Karnataka", stage: "Commitments Captured", decision: "Attend", photos: 8, commitments: 3 },
  { id: "EV-2048", name: "Anganwadi Foundation — Hoodi", type: "Foundation stone", date: "2026-06-20", location: "Hoodi", organiser: "WCD Dept", stage: "Follow-up Closed", decision: "Attend", photos: 10, commitments: 2, followUp: "Thank-you card sent. Photos shared with organiser." },
  { id: "EV-2049", name: "Press Meet — Monsoon Readiness", type: "Press", date: "2026-07-08", location: "Constituency Office", organiser: "Press Office", stage: "Invitation Received", photos: 0, commitments: 0 },
  { id: "EV-2050", name: "Wedding — Sri H. Kumar's daughter", type: "Wedding", date: "2026-07-10", location: "Jayanagar", organiser: "Family", stage: "Accepted/Declined", decision: "Send representative", photos: 0, commitments: 0 },
  { id: "EV-2051", name: "Mahadevapura Lake Cleanup Drive", type: "NGO", date: "2026-07-12", location: "Mahadevapura Lake", organiser: "United Way Bengaluru", stage: "Brief Prepared", decision: "Attend", brief: "Volunteer-led. 300 expected. Photo opportunity.", photos: 0, commitments: 0 },
  { id: "EV-2052", name: "Namma Metro Phase-3 Launch", type: "Govt launch", date: "2026-07-15", location: "KR Puram Station", organiser: "BMRCL", stage: "Invitation Received", photos: 0, commitments: 0 },
];

function EventLifecyclePage() {
  const [items, setItems] = useState<Ev[]>(SEED);
  const [open, setOpen] = useState<Ev | null>(null);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [logOpen, setLogOpen] = useState(false);
  const [draft, setDraft] = useState<{ name: string; type: EType; date: string; location: string; organiser: string }>({
    name: "", type: "RWA", date: new Date().toISOString().slice(0, 10), location: "", organiser: "",
  });

  const stats = useMemo(() => ({
    upcoming: items.filter(e => new Date(e.date) >= new Date("2026-06-29")).length,
    awaitingBrief: items.filter(e => e.stage === "Accepted/Declined" && e.decision === "Attend").length,
    followUps: items.filter(e => ["Attended", "Photos Uploaded", "Social Post Drafted", "Commitments Captured"].includes(e.stage)).length,
  }), [items]);

  const advance = (id: string) => {
    setItems(arr => arr.map(e => {
      if (e.id !== id) return e;
      const idx = STAGES.indexOf(e.stage);
      const next = STAGES[Math.min(idx + 1, STAGES.length - 1)];
      return { ...e, stage: next };
    }));
    toast.success("Moved to next stage");
  };

  const logEvent = () => {
    if (!draft.name.trim()) { toast.error("Event name required"); return; }
    const id = `EV-${2100 + items.length}`;
    const ev: Ev = { id, ...draft, stage: "Invitation Received", photos: 0, commitments: 0 };
    setItems(arr => [ev, ...arr]);
    setLogOpen(false);
    setDraft({ name: "", type: "RWA", date: new Date().toISOString().slice(0, 10), location: "", organiser: "" });
    toast.success(`${id} logged`);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Event Lifecycle Manager</h1>
          <p className="text-sm text-slate-600">Every invite tracked from arrival to follow-up closure.</p>
        </div>
        <div className="flex gap-2">
          <div className="inline-flex rounded-lg border bg-white p-1">
            <button onClick={() => setView("kanban")} className={`px-3 py-1 text-xs font-medium rounded ${view === "kanban" ? "bg-[#0A1F44] text-white" : "text-slate-600"}`}>Kanban</button>
            <button onClick={() => setView("list")} className={`px-3 py-1 text-xs font-medium rounded ${view === "list" ? "bg-[#0A1F44] text-white" : "text-slate-600"}`}>List</button>
          </div>
          <Button className="bg-[#FF9933] hover:bg-[#e68a2e] text-white" onClick={() => setLogOpen(true)}><Plus className="w-4 h-4" /> Log Event</Button>
        </div>
      </div>

      <Dialog open={logOpen} onOpenChange={setLogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Log Event / Invitation</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Event name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Select value={draft.type} onValueChange={(v) => setDraft({ ...draft, type: v as EType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(Object.keys(TYPE_META) as EType[]).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
              <Input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
            </div>
            <Input placeholder="Location" value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} />
            <Input placeholder="Organiser" value={draft.organiser} onChange={(e) => setDraft({ ...draft, organiser: e.target.value })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogOpen(false)}>Cancel</Button>
            <Button className="bg-[#FF9933] text-white" onClick={logEvent}>Log Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Upcoming Events" value={stats.upcoming} icon={CalendarCheck} tone="text-[#0A1F44]" />
        <StatCard label="Awaiting Brief" value={stats.awaitingBrief} icon={FileText} tone="text-[#FF9933]" />
        <StatCard label="Follow-ups Pending" value={stats.followUps} icon={Clock} tone="text-amber-600" />
      </div>

      {view === "kanban" ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max">
            {STAGES.map(s => {
              const col = items.filter(e => e.stage === s);
              return (
                <div key={s} className="w-72 shrink-0">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-xs font-semibold text-[#0A1F44] uppercase tracking-wide">{s}</span>
                    <Badge variant="secondary" className="text-xs">{col.length}</Badge>
                  </div>
                  <div className="space-y-2 bg-white/60 rounded-lg p-2 min-h-32 border border-slate-200">
                    {col.map(e => <KCard key={e.id} ev={e} onOpen={() => setOpen(e)} />)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-xs text-slate-600 uppercase">
                <tr><th className="text-left p-3">Event</th><th className="text-left p-3">Type</th><th className="text-left p-3">Date</th><th className="text-left p-3">Location</th><th className="text-left p-3">Stage</th><th></th></tr>
              </thead>
              <tbody>
                {items.map(e => (
                  <tr key={e.id} className="border-t hover:bg-slate-50 cursor-pointer" onClick={() => setOpen(e)}>
                    <td className="p-3 font-medium text-[#0A1F44]">{e.name}</td>
                    <td className="p-3"><TypeChip t={e.type} /></td>
                    <td className="p-3">{e.date}</td>
                    <td className="p-3 text-slate-600">{e.location}</td>
                    <td className="p-3"><Badge variant="outline">{e.stage}</Badge></td>
                    <td className="p-3"><ArrowRight className="w-4 h-4 text-slate-400" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <DetailDrawer ev={open} onClose={() => setOpen(null)} onAdvance={advance} />
    </div>
  );
}

function StatCard({ label, value, icon: Icon, tone }: { label: string; value: number; icon: any; tone: string }) {
  return (
    <Card><CardContent className="p-5 flex items-center justify-between">
      <div><div className="text-xs text-slate-500 uppercase font-semibold">{label}</div><div className="text-3xl font-bold mt-1 text-[#0A1F44]">{value}</div></div>
      <Icon className={`w-8 h-8 ${tone}`} />
    </CardContent></Card>
  );
}

function TypeChip({ t }: { t: EType }) {
  const meta = TYPE_META[t]; const Icon = meta.icon;
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium ${meta.tone}`}><Icon className="w-3 h-3" />{t}</span>;
}

function KCard({ ev, onOpen }: { ev: Ev; onOpen: () => void }) {
  return (
    <div onClick={onOpen} className="bg-white rounded-md border border-slate-200 p-3 shadow-sm hover:shadow-md cursor-pointer transition">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="font-semibold text-sm text-[#0A1F44] leading-tight">{ev.name}</div>
      </div>
      <TypeChip t={ev.type} />
      <div className="mt-2 text-xs text-slate-500 space-y-0.5">
        <div className="flex items-center gap-1"><CalendarCheck className="w-3 h-3" />{ev.date}</div>
        <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location}</div>
        <div className="flex items-center gap-1"><Users className="w-3 h-3" />{ev.organiser}</div>
      </div>
      {(ev.photos > 0 || ev.commitments > 0) && (
        <div className="mt-2 flex gap-2 text-xs text-slate-600">
          {ev.photos > 0 && <span className="flex items-center gap-1"><Camera className="w-3 h-3" />{ev.photos}</span>}
          {ev.commitments > 0 && <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />{ev.commitments} promises</span>}
        </div>
      )}
    </div>
  );
}

function DetailDrawer({ ev, onClose, onAdvance }: { ev: Ev | null; onClose: () => void; onAdvance: (id: string) => void }) {
  if (!ev) return null;
  return (
    <Sheet open={!!ev} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-[#0A1F44]">{ev.name}</SheetTitle>
          <div className="flex items-center gap-2 mt-1"><TypeChip t={ev.type} /><Badge variant="outline">{ev.stage}</Badge></div>
        </SheetHeader>

        <div className="mt-5 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <Info label="Date" value={ev.date} />
            <Info label="Location" value={ev.location} />
            <Info label="Organiser" value={ev.organiser} />
            <Info label="Decision" value={ev.decision || "Pending"} />
          </div>

          <Tabs defaultValue="brief">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="brief">Brief</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="post">Social</TabsTrigger>
              <TabsTrigger value="followup">Follow-up</TabsTrigger>
            </TabsList>
            <TabsContent value="brief" className="space-y-3 mt-3">
              <div className="rounded-lg border border-[#FF9933]/30 bg-[#FF9933]/5 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#FF9933] mb-2"><Sparkles className="w-4 h-4" />AI EVENT BRIEF</div>
                <ul className="text-sm space-y-1 text-slate-700">
                  <li>• <b>Audience:</b> ~250 residents, mixed age, predominantly Kannada-speaking.</li>
                  <li>• <b>Area issues:</b> Storm-water drain works pending (₹2.1 Cr), 14 open grievances on streetlights.</li>
                  <li>• <b>Organiser history:</b> 3rd event hosted; previously raised library funding request.</li>
                  <li>• <b>Past work:</b> MPLADS-funded community hall (₹45 L, 2024).</li>
                </ul>
              </div>
              <Textarea defaultValue={ev.brief || ""} placeholder="Add custom notes for the MP…" rows={3} />
            </TabsContent>
            <TabsContent value="photos" className="mt-3">
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: Math.max(ev.photos, 6) }).map((_, i) => (
                  <div key={i} className={`aspect-square rounded-md border flex items-center justify-center ${i < ev.photos ? "bg-slate-200" : "bg-slate-50 border-dashed"}`}>
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-3"><Camera className="w-4 h-4" /> Upload Photos</Button>
            </TabsContent>
            <TabsContent value="post" className="mt-3 space-y-3">
              <Textarea rows={4} defaultValue={`Honoured to attend ${ev.name} at ${ev.location}. Inspiring to see ${ev.organiser} drive community impact. #Bengaluru`} />
              <Button asChild className="bg-[#0A1F44] hover:bg-[#0A1F44]/90"><Link to="/broadcasts"><Send className="w-4 h-4" /> Send to Outreach</Link></Button>
            </TabsContent>
            <TabsContent value="followup" className="mt-3 space-y-3">
              <div className="rounded-lg border bg-slate-50 p-3 text-sm">
                <div className="font-semibold text-[#0A1F44] mb-1">Commitments captured at this event</div>
                <p className="text-slate-600">{ev.commitments} promise(s) logged.</p>
                <Button asChild size="sm" variant="outline" className="mt-2"><Link to="/commitment-tracker"><CheckCircle2 className="w-4 h-4" /> Open Commitment Tracker</Link></Button>
              </div>
              <div className="rounded-lg border bg-slate-50 p-3 text-sm">
                <div className="font-semibold text-[#0A1F44] mb-1">Thank-you to organiser</div>
                <Button asChild size="sm" variant="outline"><Link to="/recommendation-letters"><MessageSquare className="w-4 h-4" /> Draft Thank-you Letter</Link></Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-3 border-t">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button className="bg-[#FF9933] hover:bg-[#e68a2e] text-white" onClick={() => onAdvance(ev.id)}>Advance Stage <ArrowRight className="w-4 h-4" /></Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><div className="text-xs uppercase text-slate-500 font-semibold">{label}</div><div className="text-sm text-[#0A1F44] mt-0.5">{value}</div></div>;
}
