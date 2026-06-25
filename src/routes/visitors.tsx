import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Users, Clock, AlertTriangle, FileWarning, Plus, UserCheck, FileText, Hourglass } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";

export const Route = createFileRoute("/visitors")({
  head: () => ({ meta: [{ title: "Visitors & Appointments — MP Pulse" }] }),
  component: VisitorsPage,
});

const LOCALITIES = ["Mahadevapura", "Whitefield", "KR Puram", "Marathahalli", "HSR Layout", "Bellandur", "Hoodi", "Varthur"];
const PURPOSES = ["Administrative help", "Recommendation letter", "Personal meeting", "Grievance", "Party work", "Job/transfer request", "Other"];

type Visitor = { token: string; name: string; locality: string; purpose: string; checkedInAt: number };

const INITIAL: Visitor[] = [
  { token: "T-038", name: "Ramesh Gowda", locality: "KR Puram", purpose: "Grievance", checkedInAt: Date.now() - 42 * 60000 },
  { token: "T-039", name: "Lakshmi Narayan", locality: "Whitefield", purpose: "Recommendation letter", checkedInAt: Date.now() - 36 * 60000 },
  { token: "T-040", name: "Anita Sharma", locality: "Mahadevapura", purpose: "Administrative help", checkedInAt: Date.now() - 28 * 60000 },
  { token: "T-041", name: "Mohammed Faizal", locality: "Hoodi", purpose: "Job/transfer request", checkedInAt: Date.now() - 21 * 60000 },
  { token: "T-042", name: "Suresh Kumar", locality: "Bellandur", purpose: "Party work", checkedInAt: Date.now() - 14 * 60000 },
  { token: "T-043", name: "Deepa Rao", locality: "HSR Layout", purpose: "Personal meeting", checkedInAt: Date.now() - 9 * 60000 },
  { token: "T-044", name: "Vijay Patil", locality: "Marathahalli", purpose: "Grievance", checkedInAt: Date.now() - 3 * 60000 },
];

const FOOTFALL = [
  { day: "Mon", count: 38 }, { day: "Tue", count: 52 }, { day: "Wed", count: 47 },
  { day: "Thu", count: 61 }, { day: "Fri", count: 44 }, { day: "Sat", count: 33 },
];

const PURPOSE_MIX = [
  { name: "Administrative", value: 34, color: "#0A1F44" },
  { name: "Recommendation", value: 22, color: "#FF9933" },
  { name: "Grievance", value: 18, color: "#DC2626" },
  { name: "Personal", value: 12, color: "#2563EB" },
  { name: "Party", value: 9, color: "#7C3AED" },
  { name: "Other", value: 5, color: "#94A3B8" },
];

const APPOINTMENTS = [
  { time: "10:00 AM", name: "Karnataka Industries Federation", purpose: "Tech park infra request", status: "Done" },
  { time: "11:30 AM", name: "Mahadevapura RWA Council", purpose: "Lake rejuvenation update", status: "Done" },
  { time: "01:15 PM", name: "Dr. Anil Bhat (BMRCL)", purpose: "Metro phase 3 alignment", status: "Confirmed" },
  { time: "03:00 PM", name: "Whitefield Traders Assn.", purpose: "GST representation", status: "Waiting" },
  { time: "04:45 PM", name: "Sri B. Rajeev (Party Karyakarta)", purpose: "Booth-level review", status: "Confirmed" },
];

function StatCard({ icon: Icon, label, value, accent }: any) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${accent}`}><Icon className="h-5 w-5" /></div>
          <div>
            <div className="text-2xl font-bold text-[#0A1F44]">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function waitMin(checkedInAt: number) { return Math.max(1, Math.floor((Date.now() - checkedInAt) / 60000)); }

function VisitorsPage() {
  const [queue, setQueue] = useState<Visitor[]>(INITIAL);
  const [, setTick] = useState(0);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", locality: "", purpose: "", referredBy: "", notes: "" });
  const [nextToken, setNextToken] = useState(45);

  useEffect(() => { const i = setInterval(() => setTick(t => t + 1), 30000); return () => clearInterval(i); }, []);

  const checkIn = () => {
    if (!form.name || !form.phone || !form.locality || !form.purpose) { toast.error("Please fill required fields"); return; }
    const token = `T-0${nextToken}`;
    setQueue(q => [...q, { token, name: form.name, locality: form.locality, purpose: form.purpose, checkedInAt: Date.now() }]);
    setNextToken(n => n + 1);
    toast.success(`Visitor checked in — token ${token}`);
    setForm({ name: "", phone: "", locality: "", purpose: "", referredBy: "", notes: "" });
    setOpen(false);
  };

  const triage = (v: Visitor, action: string) => {
    setQueue(q => q.filter(x => x.token !== v.token));
    if (action === "grievance") {
      const id = `GRV-2026-04${Math.floor(Math.random() * 90) + 10}`;
      toast.success(`Grievance ${id} created and routed`);
    } else if (action === "mp") toast.success(`${v.name} routed to MP chamber`);
    else toast.success(`${v.name} assigned to staff desk`);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-[#0A1F44]">Visitors & Appointments</h1>
        <p className="text-sm text-muted-foreground">Front-office queue · Constituency office, Bengaluru</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Visitors today" value="42" accent="bg-[#0A1F44]/10 text-[#0A1F44]" />
        <StatCard icon={Hourglass} label="Waiting now" value={queue.length} accent="bg-[#FF9933]/15 text-[#FF9933]" />
        <StatCard icon={Clock} label="Avg wait time" value="23 min" accent="bg-blue-100 text-blue-700" />
        <StatCard icon={FileWarning} label="Converted to grievance" value="15" accent="bg-red-100 text-red-700" />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Live queue · auto-refreshing</div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white"><Plus className="h-4 w-4" /> Check In Visitor</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Check in new visitor</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><Label>Full name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Phone *</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              <div>
                <Label>Locality *</Label>
                <Select value={form.locality} onValueChange={v => setForm({ ...form, locality: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{LOCALITIES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Purpose *</Label>
                <Select value={form.purpose} onValueChange={v => setForm({ ...form, purpose: v })}>
                  <SelectTrigger><SelectValue placeholder="Select purpose" /></SelectTrigger>
                  <SelectContent>{PURPOSES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="col-span-2"><Label>Referred by</Label><Input value={form.referredBy} onChange={e => setForm({ ...form, referredBy: e.target.value })} /></div>
              <div className="col-span-2"><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
            </div>
            <DialogFooter><Button onClick={checkIn} className="bg-[#0A1F44] text-white">Check in</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base text-[#0A1F44]">Live Queue</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Token</TableHead><TableHead>Name</TableHead><TableHead>Locality</TableHead>
              <TableHead>Purpose</TableHead><TableHead>Wait</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {queue.map(v => {
                const w = waitMin(v.checkedInAt);
                return (
                  <TableRow key={v.token}>
                    <TableCell className="font-mono font-semibold text-[#0A1F44]">{v.token}</TableCell>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell>{v.locality}</TableCell>
                    <TableCell><Badge variant="outline">{v.purpose}</Badge></TableCell>
                    <TableCell className={w > 30 ? "text-red-600 font-medium" : ""}>{w} min</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="sm" className="bg-[#0A1F44] text-white h-7" onClick={() => triage(v, "mp")}>Meet MP</Button>
                      <Button size="sm" variant="outline" className="h-7" onClick={() => triage(v, "staff")}>Staff</Button>
                      <Button size="sm" variant="outline" className="h-7 border-[#FF9933] text-[#FF9933]" onClick={() => triage(v, "grievance")}>Create Grievance</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {queue.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Queue empty</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base text-[#0A1F44]">Footfall by Day</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={FOOTFALL}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#0A1F44" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base text-[#0A1F44]">Purpose Mix</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={PURPOSE_MIX} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {PURPOSE_MIX.map(e => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base text-[#0A1F44]">Appointments Today</CardTitle></CardHeader>
        <CardContent className="divide-y">
          {APPOINTMENTS.map((a, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-4">
                <div className="font-mono text-sm text-[#FF9933] font-semibold w-20">{a.time}</div>
                <div>
                  <div className="font-medium text-[#0A1F44]">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.purpose}</div>
                </div>
              </div>
              <Badge variant={a.status === "Done" ? "secondary" : a.status === "Waiting" ? "outline" : "default"}
                className={a.status === "Confirmed" ? "bg-[#0A1F44] text-white" : a.status === "Waiting" ? "border-[#FF9933] text-[#FF9933]" : ""}>
                {a.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
