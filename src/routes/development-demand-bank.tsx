import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  PiggyBank, Plus, MapPin, Users, Filter, ArrowRight, Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell,
} from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/development-demand-bank")({
  head: () => ({ meta: [{ title: "Development Demand Bank — Citizen Pulse" }] }),
  component: DemandBankPage,
});

type DType = "Road" | "Drain" | "Water" | "Streetlight" | "School" | "Health centre" | "Community hall" | "Anganwadi" | "Bus stop" | "Public toilet" | "Lake" | "Park" | "Sports ground";
type DStatus = "New" | "Pipeline" | "Sanctioned" | "Deferred" | "Duplicate";
type Funding = "MPLADS" | "Local body" | "State budget" | "Central scheme" | "—";
type Chip = "Urgent" | "High citizen impact" | "Low-cost high-visibility" | "Requires state budget" | "MPLADS-fundable" | "Local-body fundable" | "Needs land clearance" | "Needs technical estimate" | "Politically sensitive" | "Already sanctioned" | "Duplicate";

type Demand = {
  id: string; title: string; type: DType; ward: string; requestedBy: string;
  impact: number; cost: number; status: DStatus; funding: Funding; chips: Chip[]; notes: string;
};

const SEED: Demand[] = [
  { id: "DM-1101", title: "KR Puram Main Rd potholes fix", type: "Road", ward: "Ward 58", requestedBy: "RWA Federation", impact: 9, cost: 3, status: "Sanctioned", funding: "MPLADS", chips: ["Urgent", "High citizen impact", "MPLADS-fundable", "Already sanctioned"], notes: "₹65 L sanctioned under MPLADS-2025." },
  { id: "DM-1102", title: "Mahadevapura SWD link drain", type: "Drain", ward: "Ward 84", requestedBy: "Ward Committee", impact: 9, cost: 8, status: "Pipeline", funding: "State budget", chips: ["Urgent", "Requires state budget", "Needs technical estimate"], notes: "Estimate pending from BBMP SWD." },
  { id: "DM-1103", title: "Whitefield bus stop shelters (12)", type: "Bus stop", ward: "Ward 84", requestedBy: "Citizen petition (840)", impact: 7, cost: 2, status: "Pipeline", funding: "MPLADS", chips: ["Low-cost high-visibility", "MPLADS-fundable"], notes: "" },
  { id: "DM-1104", title: "Hoodi Anganwadi building", type: "Anganwadi", ward: "Ward 84", requestedBy: "WCD officer", impact: 8, cost: 5, status: "Pipeline", funding: "Central scheme", chips: ["High citizen impact", "Needs land clearance"], notes: "Land identification pending." },
  { id: "DM-1105", title: "Bellandur Lake fencing", type: "Lake", ward: "Ward 150", requestedBy: "Lake group", impact: 6, cost: 4, status: "Deferred", funding: "—", chips: ["Politically sensitive"], notes: "NGT case pending — deferred." },
  { id: "DM-1106", title: "BTM PHC equipment upgrade", type: "Health centre", ward: "Ward 176", requestedBy: "Medical officer", impact: 9, cost: 6, status: "Sanctioned", funding: "MPLADS", chips: ["High citizen impact", "MPLADS-fundable", "Already sanctioned"], notes: "" },
  { id: "DM-1107", title: "Jayanagar park play equipment", type: "Park", ward: "Ward 169", requestedBy: "Walkers' assn", impact: 5, cost: 2, status: "Pipeline", funding: "Local body", chips: ["Low-cost high-visibility", "Local-body fundable"], notes: "" },
  { id: "DM-1108", title: "Indiranagar streetlights (LED conv.)", type: "Streetlight", ward: "Ward 80", requestedBy: "RWA", impact: 7, cost: 4, status: "Pipeline", funding: "Local body", chips: ["Local-body fundable"], notes: "" },
  { id: "DM-1109", title: "KR Puram public toilet block", type: "Public toilet", ward: "Ward 58", requestedBy: "Vendors' assn", impact: 7, cost: 3, status: "New", funding: "—", chips: ["High citizen impact", "Needs land clearance"], notes: "" },
  { id: "DM-1110", title: "Hoodi community hall", type: "Community hall", ward: "Ward 84", requestedBy: "Resident group", impact: 6, cost: 7, status: "Deferred", funding: "—", chips: ["Duplicate"], notes: "Already exists 600m away." },
  { id: "DM-1111", title: "Mahadevapura sports ground", type: "Sports ground", ward: "Ward 84", requestedBy: "Youth club", impact: 6, cost: 8, status: "Pipeline", funding: "State budget", chips: ["Requires state budget", "Needs land clearance"], notes: "" },
  { id: "DM-1112", title: "KR Puram Govt School toilets", type: "School", ward: "Ward 58", requestedBy: "PTA", impact: 8, cost: 2, status: "Sanctioned", funding: "MPLADS", chips: ["Urgent", "Low-cost high-visibility", "Already sanctioned"], notes: "" },
];

const CHIP_TONE: Record<Chip, string> = {
  "Urgent": "bg-red-100 text-red-700 border-red-200",
  "High citizen impact": "bg-[#FF9933]/15 text-[#FF9933] border-[#FF9933]/30",
  "Low-cost high-visibility": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Requires state budget": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "MPLADS-fundable": "bg-[#0A1F44]/10 text-[#0A1F44] border-[#0A1F44]/30",
  "Local-body fundable": "bg-blue-100 text-blue-700 border-blue-200",
  "Needs land clearance": "bg-amber-100 text-amber-700 border-amber-200",
  "Needs technical estimate": "bg-purple-100 text-purple-700 border-purple-200",
  "Politically sensitive": "bg-rose-100 text-rose-700 border-rose-200",
  "Already sanctioned": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Duplicate": "bg-slate-200 text-slate-600 border-slate-300",
};

const STATUS_TONE: Record<DStatus, string> = {
  "New": "bg-slate-100 text-slate-700 border-slate-200",
  "Pipeline": "bg-amber-100 text-amber-700 border-amber-200",
  "Sanctioned": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Deferred": "bg-slate-200 text-slate-500 border-slate-300",
  "Duplicate": "bg-slate-200 text-slate-500 border-slate-300",
};

function DemandBankPage() {
  const [items, setItems] = useState<Demand[]>(SEED);
  const [open, setOpen] = useState<Demand | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [fWard, setFWard] = useState("All"); const [fType, setFType] = useState("All"); const [fFund, setFFund] = useState("All"); const [fStatus, setFStatus] = useState("All");

  const stats = { total: 312, sanctioned: 88, pipeline: 140, deferred: 84 };

  const filtered = useMemo(() => items.filter(d =>
    (fWard === "All" || d.ward === fWard) &&
    (fType === "All" || d.type === fType) &&
    (fFund === "All" || d.funding === fFund) &&
    (fStatus === "All" || d.status === fStatus)
  ), [items, fWard, fType, fFund, fStatus]);

  const wards = Array.from(new Set(items.map(i => i.ward)));

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Development Demand Bank</h1>
          <p className="text-sm text-slate-600">A constituency-wide pipeline — not a list of one-off projects. Sanctioned items flow into <Link to="/funds-projects" className="text-[#FF9933] underline">Funds & Projects</Link>.</p>
        </div>
        <Button className="bg-[#FF9933] hover:bg-[#e68a2e] text-white" onClick={() => setNewOpen(true)}><Plus className="w-4 h-4" /> Log Demand</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Demands" value={stats.total} tone="text-[#0A1F44]" />
        <StatCard label="Sanctioned" value={stats.sanctioned} tone="text-emerald-600" />
        <StatCard label="In Pipeline" value={stats.pipeline} tone="text-amber-600" />
        <StatCard label="Deferred" value={stats.deferred} tone="text-slate-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Layers className="w-4 h-4 text-[#FF9933]" />Priority Matrix — Citizen Impact vs Cost/Effort</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" dataKey="cost" name="Cost / effort" domain={[0, 10]} label={{ value: "Cost / Effort →", position: "insideBottom", offset: -10, fontSize: 12 }} />
                <YAxis type="number" dataKey="impact" name="Citizen impact" domain={[0, 10]} label={{ value: "Citizen Impact →", angle: -90, position: "insideLeft", fontSize: 12 }} />
                <ZAxis range={[100, 100]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload as Demand;
                  return <div className="bg-white border rounded p-2 shadow text-xs"><div className="font-semibold text-[#0A1F44]">{d.title}</div><div className="text-slate-500">{d.ward} · {d.type}</div></div>;
                }} />
                <Scatter data={filtered}>
                  {filtered.map((d, i) => <Cell key={i} fill={d.status === "Sanctioned" ? "#16a34a" : d.status === "Deferred" || d.status === "Duplicate" ? "#94a3b8" : "#FF9933"} />)}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div className="text-[11px] text-slate-500 flex gap-4 mt-2 px-2">
              <span>Top-left = quick wins · Top-right = flagship projects · Bottom-right = avoid</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Filter className="w-4 h-4 text-[#FF9933]" />Filters</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <FilterRow label="Ward" value={fWard} onChange={setFWard} options={["All", ...wards]} />
            <FilterRow label="Type" value={fType} onChange={setFType} options={["All", "Road", "Drain", "Water", "Streetlight", "School", "Health centre", "Community hall", "Anganwadi", "Bus stop", "Public toilet", "Lake", "Park", "Sports ground"]} />
            <FilterRow label="Funding route" value={fFund} onChange={setFFund} options={["All", "MPLADS", "Local body", "State budget", "Central scheme", "—"]} />
            <FilterRow label="Status" value={fStatus} onChange={setFStatus} options={["All", "New", "Pipeline", "Sanctioned", "Deferred", "Duplicate"]} />
            <div className="text-xs text-slate-500 pt-2 border-t">Matching: <span className="font-semibold text-[#0A1F44]">{filtered.length}</span> demands</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-xs text-slate-600 uppercase">
              <tr>
                <th className="text-left p-3">ID</th><th className="text-left p-3">Demand</th><th className="text-left p-3">Ward</th>
                <th className="text-left p-3">Requested by</th><th className="text-left p-3">Tags</th>
                <th className="text-left p-3">Funding</th><th className="text-left p-3">Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} className="border-t hover:bg-slate-50 cursor-pointer" onClick={() => setOpen(d)}>
                  <td className="p-3 text-xs text-slate-500">{d.id}</td>
                  <td className="p-3"><div className="font-medium text-[#0A1F44]">{d.title}</div><div className="text-xs text-slate-500">{d.type}</div></td>
                  <td className="p-3 text-slate-600">{d.ward}</td>
                  <td className="p-3 text-slate-600">{d.requestedBy}</td>
                  <td className="p-3"><div className="flex gap-1 flex-wrap max-w-xs">{d.chips.slice(0, 2).map(c => <span key={c} className={`text-[10px] px-1.5 py-0.5 rounded border ${CHIP_TONE[c]}`}>{c}</span>)}{d.chips.length > 2 && <span className="text-[10px] text-slate-400">+{d.chips.length - 2}</span>}</div></td>
                  <td className="p-3 text-xs">{d.funding}</td>
                  <td className="p-3"><Badge variant="outline" className={STATUS_TONE[d.status]}>{d.status}</Badge></td>
                  <td className="p-3"><ArrowRight className="w-4 h-4 text-slate-400" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <DetailDrawer demand={open} onClose={() => setOpen(null)} />
      <NewDemand open={newOpen} onClose={() => setNewOpen(false)} onCreate={(d) => { setItems(arr => [d, ...arr]); toast.success("Demand added to bank"); }} />
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <Card><CardContent className="p-5">
      <div className="text-xs text-slate-500 uppercase font-semibold">{label}</div>
      <div className={`text-3xl font-bold mt-1 ${tone}`}>{value}</div>
    </CardContent></Card>
  );
}

function FilterRow({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <div className="text-xs uppercase text-slate-500 font-semibold mb-1">{label}</div>
      <Select value={value} onValueChange={onChange}><SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
        <SelectContent>{options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}

function DetailDrawer({ demand, onClose }: { demand: Demand | null; onClose: () => void }) {
  if (!demand) return null;
  return (
    <Sheet open={!!demand} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-[#0A1F44]">{demand.title}</SheetTitle>
          <div className="flex items-center gap-2 mt-1"><Badge variant="outline" className={STATUS_TONE[demand.status]}>{demand.status}</Badge><span className="text-xs text-slate-500">{demand.id}</span></div>
        </SheetHeader>
        <div className="mt-5 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <Info label="Type" value={demand.type} />
            <Info label="Ward" value={demand.ward} />
            <Info label="Requested by" value={demand.requestedBy} />
            <Info label="Funding route" value={demand.funding} />
            <Info label="Citizen impact" value={`${demand.impact}/10`} />
            <Info label="Cost / effort" value={`${demand.cost}/10`} />
          </div>
          <div>
            <div className="text-xs uppercase font-semibold text-slate-500 mb-1">Classification</div>
            <div className="flex gap-1 flex-wrap">{demand.chips.map(c => <span key={c} className={`text-xs px-2 py-0.5 rounded border ${CHIP_TONE[c]}`}>{c}</span>)}</div>
          </div>
          <div>
            <div className="text-xs uppercase font-semibold text-slate-500 mb-1">Notes</div>
            <Textarea defaultValue={demand.notes} rows={3} />
          </div>
          <div className="flex justify-between pt-3 border-t">
            <Button variant="outline" onClick={onClose}>Close</Button>
            {demand.status === "Sanctioned" ? (
              <Button asChild className="bg-[#0A1F44] hover:bg-[#0A1F44]/90"><Link to="/funds-projects">Open in Funds & Projects</Link></Button>
            ) : (
              <Button className="bg-[#FF9933] hover:bg-[#e68a2e] text-white">Move to Pipeline</Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><div className="text-xs uppercase text-slate-500 font-semibold">{label}</div><div className="text-sm text-[#0A1F44] mt-0.5">{value}</div></div>;
}

function NewDemand({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (d: Demand) => void }) {
  const [title, setTitle] = useState(""); const [type, setType] = useState<DType>("Road"); const [ward, setWard] = useState("");
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Log Development Demand</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Demand title" value={title} onChange={e => setTitle(e.target.value)} />
          <Select value={type} onValueChange={(v) => setType(v as DType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{(["Road", "Drain", "Water", "Streetlight", "School", "Health centre", "Community hall", "Anganwadi", "Bus stop", "Public toilet", "Lake", "Park", "Sports ground"] as DType[]).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
          <Input placeholder="Ward / Location" value={ward} onChange={e => setWard(e.target.value)} />
          <Input placeholder="Requested by" />
          <Textarea placeholder="Citizen-impact note" rows={3} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-[#FF9933] hover:bg-[#e68a2e] text-white" onClick={() => {
            onCreate({ id: `DM-${Math.floor(Math.random() * 900) + 1200}`, title: title || "Untitled", type, ward: ward || "—", requestedBy: "—", impact: 5, cost: 5, status: "New", funding: "—", chips: ["High citizen impact"], notes: "" });
            onClose();
          }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
