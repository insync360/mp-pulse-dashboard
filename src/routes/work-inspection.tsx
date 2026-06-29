import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  HardHat, MapPin, Camera, AlertTriangle, CheckCircle2, RefreshCw,
  Plus, FileBadge, Construction, Navigation,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/work-inspection")({
  head: () => ({ meta: [{ title: "Work Inspection — Citizen Pulse" }] }),
  component: WorkInspectionPage,
});

type WStatus = "In Progress" | "Completed" | "Quality Issue" | "Rework";
type WType = "Road" | "Drain" | "Streetlight" | "Water" | "School repair" | "PHC upgrade";

type Work = {
  id: string; name: string; type: WType; ward: string; gps: string;
  contractor: string; department: string; status: WStatus;
  before: boolean; during: boolean; after: boolean;
  feedback: string; cert: boolean; rework: boolean; flag: boolean;
  cost: string; inspected: string;
};

const SEED: Work[] = [
  { id: "WI-301", name: "KR Puram Main Rd resurfacing", type: "Road", ward: "Ward 58 KR Puram", gps: "12.998,77.696", contractor: "M/s Sai Constructions", department: "BBMP Roads", status: "Completed", before: true, during: true, after: true, feedback: "Residents satisfied. Surface smooth.", cert: true, rework: false, flag: false, cost: "₹1.4 Cr", inspected: "2026-06-22" },
  { id: "WI-302", name: "Mahadevapura SWD Phase 2", type: "Drain", ward: "Ward 84 Mahadevapura", gps: "12.989,77.694", contractor: "Karnataka Infra Ltd", department: "BBMP SWD", status: "Quality Issue", before: true, during: true, after: false, feedback: "Slope incorrect, water stagnates near junction.", cert: false, rework: true, flag: true, cost: "₹2.1 Cr", inspected: "2026-06-25" },
  { id: "WI-303", name: "Whitefield streetlight retrofit (LED)", type: "Streetlight", ward: "Ward 84", gps: "12.969,77.749", contractor: "BESCOM", department: "BESCOM", status: "In Progress", before: true, during: true, after: false, feedback: "—", cert: false, rework: false, flag: false, cost: "₹62 L", inspected: "2026-06-26" },
  { id: "WI-304", name: "Hoodi PHC modernization", type: "PHC upgrade", ward: "Ward 84", gps: "12.997,77.713", contractor: "PWD Buildings", department: "Health", status: "Completed", before: true, during: true, after: true, feedback: "OPD reopened. Citizens happy.", cert: true, rework: false, flag: false, cost: "₹78 L", inspected: "2026-06-20" },
  { id: "WI-305", name: "BTM Govt School roof repair", type: "School repair", ward: "Ward 176 BTM", gps: "12.916,77.610", contractor: "Local PWD", department: "Education", status: "Rework", before: true, during: true, after: true, feedback: "Leak still visible during last rain.", cert: false, rework: true, flag: true, cost: "₹18 L", inspected: "2026-06-24" },
  { id: "WI-306", name: "Indiranagar water pipeline laying", type: "Water", ward: "Ward 80 Indiranagar", gps: "12.978,77.640", contractor: "BWSSB", department: "BWSSB", status: "In Progress", before: true, during: true, after: false, feedback: "—", cert: false, rework: false, flag: false, cost: "₹3.6 Cr", inspected: "2026-06-27" },
  { id: "WI-307", name: "Bellandur Lake bund repair", type: "Drain", ward: "Ward 150", gps: "12.937,77.678", contractor: "MNC EPC", department: "BBMP Lakes", status: "Quality Issue", before: true, during: true, after: true, feedback: "Bund cracked at 2 spots within 2 weeks.", cert: false, rework: true, flag: true, cost: "₹4.2 Cr", inspected: "2026-06-23" },
  { id: "WI-308", name: "Jayanagar Park walking path", type: "Road", ward: "Ward 169 Jayanagar", gps: "12.928,77.583", contractor: "BBMP Hort.", department: "BBMP", status: "Completed", before: true, during: true, after: true, feedback: "Walkers' association thanked office.", cert: true, rework: false, flag: false, cost: "₹22 L", inspected: "2026-06-19" },
];

const STATUS_TONE: Record<WStatus, string> = {
  "In Progress": "bg-amber-100 text-amber-700 border-amber-200",
  "Completed": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Quality Issue": "bg-red-100 text-red-700 border-red-200",
  "Rework": "bg-orange-100 text-orange-700 border-orange-200",
};

function WorkInspectionPage() {
  const [items, setItems] = useState<Work[]>(SEED);
  const [open, setOpen] = useState<Work | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [newOpen, setNewOpen] = useState(false);

  const stats = useMemo(() => ({
    inspected: items.length + 68,
    progress: items.filter(i => i.status === "In Progress").length + 20,
    issues: items.filter(i => i.flag).length + 5,
    rework: items.filter(i => i.rework).length + 2,
  }), [items]);

  const list = filter === "All" ? items : items.filter(i => i.status === filter);

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Work Inspection</h1>
          <p className="text-sm text-slate-600">Field-photo evidence for every public-works project. Feeds <Link to="/funds-projects" className="text-[#FF9933] underline">Funds & Projects</Link>.</p>
        </div>
        <Button className="bg-[#FF9933] hover:bg-[#e68a2e] text-white" onClick={() => setNewOpen(true)}><Plus className="w-4 h-4" /> New Inspection</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Works Inspected" value={stats.inspected} icon={HardHat} tone="text-[#0A1F44]" />
        <StatCard label="In Progress" value={stats.progress} icon={Construction} tone="text-amber-600" />
        <StatCard label="Quality Issues" value={stats.issues} icon={AlertTriangle} tone="text-red-600" />
        <StatCard label="Rework Needed" value={stats.rework} icon={RefreshCw} tone="text-orange-600" />
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["All", "In Progress", "Completed", "Quality Issue", "Rework"] as const).map(s => (
          <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} className={filter === s ? "bg-[#0A1F44]" : ""} onClick={() => setFilter(s)}>{s}</Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map(w => (
          <Card key={w.id} className="overflow-hidden cursor-pointer hover:shadow-md transition" onClick={() => setOpen(w)}>
            <div className="grid grid-cols-3 gap-0.5">
              <PhotoTile label="Before" filled={w.before} />
              <PhotoTile label="During" filled={w.during} />
              <PhotoTile label="After" filled={w.after} />
            </div>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-[#0A1F44] leading-tight">{w.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{w.id} • {w.type} • {w.cost}</div>
                </div>
                <Badge variant="outline" className={STATUS_TONE[w.status]}>{w.status}</Badge>
              </div>
              <div className="text-xs text-slate-600 space-y-0.5">
                <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{w.ward}</div>
                <div className="flex items-center gap-1"><Navigation className="w-3 h-3" />{w.gps}</div>
                <div>Contractor: {w.contractor}</div>
              </div>
              {w.flag && <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2 flex gap-1"><AlertTriangle className="w-3 h-3 mt-0.5" />{w.feedback}</div>}
            </CardContent>
          </Card>
        ))}
      </div>

      <DetailDrawer work={open} onClose={() => setOpen(null)} />
      <NewInspection open={newOpen} onClose={() => setNewOpen(false)} onCreate={(w) => { setItems(arr => [w, ...arr]); toast.success("Inspection logged with GPS"); }} />
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

function PhotoTile({ label, filled }: { label: string; filled: boolean }) {
  return (
    <div className={`aspect-square relative flex items-center justify-center ${filled ? "bg-gradient-to-br from-slate-200 to-slate-300" : "bg-slate-100 border border-dashed border-slate-300"}`}>
      <Camera className={`w-6 h-6 ${filled ? "text-slate-500" : "text-slate-400"}`} />
      <span className="absolute bottom-1 left-1 text-[10px] font-semibold text-white bg-black/50 px-1.5 rounded">{label}</span>
    </div>
  );
}

function DetailDrawer({ work, onClose }: { work: Work | null; onClose: () => void }) {
  if (!work) return null;
  return (
    <Sheet open={!!work} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-[#0A1F44]">{work.name}</SheetTitle>
          <div className="flex items-center gap-2 mt-1"><Badge variant="outline" className={STATUS_TONE[work.status]}>{work.status}</Badge><span className="text-xs text-slate-500">{work.id}</span></div>
        </SheetHeader>
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <PhotoTile label="Before" filled={work.before} />
            <PhotoTile label="During" filled={work.during} />
            <PhotoTile label="After" filled={work.after} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label="Ward" value={work.ward} />
            <Info label="GPS" value={work.gps} />
            <Info label="Type" value={work.type} />
            <Info label="Cost" value={work.cost} />
            <Info label="Contractor" value={work.contractor} />
            <Info label="Department" value={work.department} />
          </div>
          <div>
            <div className="text-xs uppercase font-semibold text-slate-500 mb-1">Citizen feedback</div>
            <Textarea defaultValue={work.feedback} rows={3} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {work.cert && <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200" variant="outline"><FileBadge className="w-3 h-3" /> Completion certificate</Badge>}
            {work.flag && <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200"><AlertTriangle className="w-3 h-3" /> Quality issue flagged</Badge>}
            {work.rework && <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200"><RefreshCw className="w-3 h-3" /> Rework required</Badge>}
          </div>
          <div className="flex justify-between pt-3 border-t">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button asChild className="bg-[#0A1F44] hover:bg-[#0A1F44]/90"><Link to="/funds-projects">View in Funds & Projects</Link></Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><div className="text-xs uppercase text-slate-500 font-semibold">{label}</div><div className="text-sm text-[#0A1F44] mt-0.5">{value}</div></div>;
}

function NewInspection({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (w: Work) => void }) {
  const [name, setName] = useState(""); const [type, setType] = useState<WType>("Road"); const [ward, setWard] = useState("");
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>New Field Inspection</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="rounded-md border border-dashed bg-slate-50 p-6 text-center">
            <Camera className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-xs text-slate-500">Tap to upload Before / During / After photos</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded p-2">
            <Navigation className="w-3 h-3" /> GPS auto-captured: 12.992, 77.701
          </div>
          <Input placeholder="Project name" value={name} onChange={e => setName(e.target.value)} />
          <Select value={type} onValueChange={(v) => setType(v as WType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{(["Road", "Drain", "Streetlight", "Water", "School repair", "PHC upgrade"] as WType[]).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
          <Input placeholder="Ward / Location" value={ward} onChange={e => setWard(e.target.value)} />
          <Textarea placeholder="Field notes" rows={3} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-[#FF9933] hover:bg-[#e68a2e] text-white" onClick={() => {
            onCreate({ id: `WI-${Math.floor(Math.random() * 900) + 400}`, name: name || "Untitled inspection", type, ward: ward || "—", gps: "12.992,77.701", contractor: "—", department: "—", status: "In Progress", before: true, during: false, after: false, feedback: "", cert: false, rework: false, flag: false, cost: "—", inspected: "today" });
            onClose();
          }}>Save Inspection</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
