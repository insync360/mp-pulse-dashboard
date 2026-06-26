import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Send, Plus, MessageCircle, Mail, Smartphone, Shield, AlertTriangle, CheckCircle2,
  Sparkles, Clock, TrendingUp, Calendar, BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/broadcasts")({
  head: () => ({ meta: [{ title: "Broadcasts — MP Pulse" }] }),
  component: BroadcastsPage,
});

const SEGMENTS = [
  { id: "s1", name: "KR Puram — Water complainants", count: 412 },
  { id: "s2", name: "Whitefield — All opted-in", count: 1180 },
  { id: "s3", name: "Mahadevapura — Sanitation", count: 287 },
  { id: "s4", name: "Constituency-wide opted-in", count: 6540 },
];

const CLOSE_LOOP_PRESETS = [
  { id: "cl1", label: "Water issues — KR Puram (resolved last month)", count: 147 },
  { id: "cl2", label: "Road repair — Whitefield (project complete)", count: 312 },
  { id: "cl3", label: "Borewell project beneficiaries — Mahadevapura", count: 89 },
  { id: "cl4", label: "Streetlight grievances — Marathahalli (closed)", count: 64 },
];

const MSG_TYPES = ["Development Update", "New Scheme", "Initiative", "Event Invite", "Parliament Question (constituency)", "General Update"];
const POLITICAL_TYPES = new Set(["Initiative", "Event Invite", "Parliament Question (constituency)"]);

type Broadcast = {
  id: string; name: string; audience: string; size: number; channel: string;
  type: string; sent: string; delivered: number; read: number; optouts: number; status: string;
};

const HISTORY: Broadcast[] = [
  { id: "BC-2026-061", name: "Borewell project — KR Puram thank-you", audience: "Water complainants — KR Puram", size: 412, channel: "WhatsApp", type: "Development Update", sent: "24 Jun, 10:30", delivered: 98.3, read: 81.2, optouts: 4, status: "Delivered" },
  { id: "BC-2026-060", name: "Health camp at Mahadevapura", audience: "Mahadevapura opted-in", size: 870, channel: "WhatsApp + SMS", type: "Event Invite", sent: "22 Jun, 09:00", delivered: 97.1, read: 73.4, optouts: 6, status: "Delivered" },
  { id: "BC-2026-059", name: "Lake rejuvenation Q&A in parliament", audience: "Constituency-wide", size: 6540, channel: "WhatsApp", type: "Parliament Question (constituency)", sent: "19 Jun, 18:00", delivered: 96.4, read: 64.8, optouts: 18, status: "Delivered" },
  { id: "BC-2026-058", name: "Pothole reporting helpline", audience: "Whitefield opted-in", size: 1180, channel: "SMS", type: "Initiative", sent: "15 Jun, 12:00", delivered: 99.1, read: 0, optouts: 3, status: "Delivered" },
  { id: "BC-2026-057", name: "Road repair completion — Whitefield", audience: "Road complainants — Whitefield", size: 312, channel: "WhatsApp", type: "Development Update", sent: "12 Jun, 11:00", delivered: 98.7, read: 88.1, optouts: 1, status: "Delivered" },
  { id: "BC-2026-056", name: "Monsoon preparedness advisory", audience: "Constituency-wide", size: 6540, channel: "SMS + Email", type: "General Update", sent: "08 Jun, 08:30", delivered: 96.8, read: 0, optouts: 12, status: "Delivered" },
];

const REACH_TREND = [
  { w: "W1", reach: 4200 }, { w: "W2", reach: 5400 }, { w: "W3", reach: 6100 },
  { w: "W4", reach: 7820 }, { w: "W5", reach: 8400 }, { w: "W6", reach: 9180 },
];

const TYPE_PERF = [
  { type: "Dev Update", rate: 84 }, { type: "New Scheme", rate: 71 },
  { type: "Initiative", rate: 62 }, { type: "Event Invite", rate: 68 },
  { type: "Parl. Q", rate: 58 }, { type: "General", rate: 49 },
];

function StatusBadge({ s }: { s: string }) {
  const map: Record<string, string> = {
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Scheduled: "bg-blue-50 text-blue-700 border-blue-200",
    Paused: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return <Badge variant="outline" className={`${map[s] || ""} font-medium`}>{s}</Badge>;
}

function BroadcastsPage() {
  const [electionMode, setElectionMode] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);

  // composer state
  const [segmentId, setSegmentId] = useState<string>(SEGMENTS[0].id);
  const [channels, setChannels] = useState<string[]>(["WhatsApp"]);
  const [msgType, setMsgType] = useState<string>("Development Update");
  const [body, setBody] = useState("Namaskara {name}, glad to share that the borewell project in {locality} is now complete and water supply has resumed. Thank you for raising this — your voice drove this work.\n\n— Hon'ble MP, Bengaluru");
  const [closeLoop, setCloseLoop] = useState<string>("");
  const [consentConfirm, setConsentConfirm] = useState(false);
  const [scheduleLater, setScheduleLater] = useState(false);

  const seg = SEGMENTS.find(s => s.id === segmentId)!;
  const loop = CLOSE_LOOP_PRESETS.find(c => c.id === closeLoop);
  const recipientCount = loop ? loop.count : seg.count;
  const audienceLabel = loop ? loop.label : seg.name;

  const toggleChannel = (c: string) =>
    setChannels(s => s.includes(c) ? s.filter(x => x !== c) : [...s, c]);

  const typeBlocked = electionMode && POLITICAL_TYPES.has(msgType);

  const send = () => {
    if (!consentConfirm) {
      toast.error("Please confirm consent compliance before sending.");
      return;
    }
    if (typeBlocked) {
      toast.error("This message type is disabled in Election Mode.");
      return;
    }
    toast.success(scheduleLater ? "Broadcast scheduled" : "Broadcast queued for delivery", {
      description: `${recipientCount.toLocaleString()} recipients • ${channels.join(", ")} • opted-out auto-excluded`,
    });
    setComposerOpen(false);
    setConsentConfirm(false);
  };

  const preview = useMemo(() =>
    body.replace(/\{name\}/g, "Ramesh").replace(/\{locality\}/g, "KR Puram"),
    [body]
  );

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header + election mode */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Broadcasts</h1>
          <p className="text-sm text-muted-foreground mt-1">Reach constituents on consented channels — and close the loop on grievances you've solved.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-3 rounded-lg border px-4 py-2 ${electionMode ? "bg-red-50 border-red-200" : "bg-white border-slate-200"}`}>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-navy">Election Mode</div>
              <div className="text-[11px] text-muted-foreground">Model Code of Conduct</div>
            </div>
            <Switch checked={electionMode} onCheckedChange={setElectionMode} />
          </div>
          <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
            <DialogTrigger asChild>
              <Button className="bg-saffron hover:bg-saffron/90 text-saffron-foreground"><Plus className="h-4 w-4 mr-1.5" /> New Broadcast</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle className="text-navy">Compose Broadcast</DialogTitle></DialogHeader>

              {/* Featured: Close the loop */}
              <div className="rounded-lg border-2 border-saffron/40 bg-gradient-to-br from-saffron/10 to-transparent p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-saffron" />
                  <span className="text-sm font-semibold text-navy">Close the loop</span>
                  <Badge className="bg-saffron text-saffron-foreground text-[10px]">Featured</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Notify the exact citizens whose grievances you've addressed. Turns service work into trust.
                </p>
                <Select value={closeLoop} onValueChange={setCloseLoop}>
                  <SelectTrigger><SelectValue placeholder="Select a resolved cluster…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">— None (use segment below) —</SelectItem>
                    {CLOSE_LOOP_PRESETS.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.label} • {c.count} citizens</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Audience segment</Label>
                  <Select value={segmentId} onValueChange={setSegmentId} disabled={!!loop}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SEGMENTS.map(s => <SelectItem key={s.id} value={s.id}>{s.name} • {s.count.toLocaleString()}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Message type</Label>
                  <Select value={msgType} onValueChange={setMsgType}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MSG_TYPES.map(t => (
                        <SelectItem key={t} value={t} disabled={electionMode && POLITICAL_TYPES.has(t)}>
                          {t}{electionMode && POLITICAL_TYPES.has(t) ? " (blocked)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs">Channels</Label>
                <div className="mt-1.5 flex gap-2">
                  {[{ id: "WhatsApp", icon: MessageCircle }, { id: "SMS", icon: Smartphone }, { id: "Email", icon: Mail }].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleChannel(c.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm ${
                        channels.includes(c.id) ? "bg-navy text-white border-navy" : "bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      <c.icon className="h-3.5 w-3.5" />{c.id}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Message (merge: {"{name}, {locality}"})</Label>
                  <Textarea className="mt-1 h-40 font-mono text-xs" value={body} onChange={e => setBody(e.target.value)} />
                  <div className="mt-1 text-[10px] text-muted-foreground">Auto-appended: "Reply STOP to opt out."</div>
                </div>
                <div>
                  <Label className="text-xs">Live preview</Label>
                  <div className="mt-1 rounded-lg bg-emerald-50 border border-emerald-100 p-3 h-40 overflow-auto">
                    <div className="text-[11px] text-emerald-700 font-semibold mb-1">WhatsApp · Hon'ble MP Office</div>
                    <div className="text-xs whitespace-pre-wrap text-slate-800">{preview}</div>
                    <div className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-emerald-100">Reply STOP to opt out.</div>
                  </div>
                </div>
              </div>

              {/* Compliance */}
              <div className="rounded-lg border bg-slate-50 p-3 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-navy">
                  <Shield className="h-3.5 w-3.5 text-saffron" /> Compliance guardrails
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• Recipients: <span className="font-semibold text-navy">{recipientCount.toLocaleString()}</span> ({audienceLabel}) — opted-out auto-excluded</div>
                  <div>• Opt-out footer automatically appended</div>
                  <div>• DLT-approved template required for SMS / WhatsApp</div>
                </div>
                <label className="flex items-center gap-2 text-xs pt-1">
                  <Checkbox checked={consentConfirm} onCheckedChange={(v) => setConsentConfirm(!!v)} />
                  <span>I confirm only opted-in contacts are targeted and this complies with DPDP rules.</span>
                </label>
                {typeBlocked && (
                  <div className="flex items-center gap-1.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2">
                    <AlertTriangle className="h-3.5 w-3.5" /> This message type is paused during Election Mode (MCC).
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 text-xs">
                <Checkbox checked={scheduleLater} onCheckedChange={(v) => setScheduleLater(!!v)} />
                <span>Schedule for later</span>
                {scheduleLater && <Input type="datetime-local" className="h-8 ml-2 w-56" />}
              </label>

              <DialogFooter>
                <Button variant="outline" onClick={() => setComposerOpen(false)}>Cancel</Button>
                <Button onClick={send} className="bg-saffron hover:bg-saffron/90 text-saffron-foreground">
                  <Send className="h-4 w-4 mr-1.5" />{scheduleLater ? "Schedule" : "Send now"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {electionMode && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-center gap-2 text-sm text-red-800">
          <AlertTriangle className="h-4 w-4" />
          <span><strong>Campaigns paused</strong> — Model Code of Conduct in effect. Only non-political general updates can be sent.</span>
        </div>
      )}

      {/* Featured close-the-loop hero */}
      <Card className="border-saffron/40 bg-gradient-to-br from-saffron/10 via-white to-white">
        <CardContent className="p-5 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-saffron/20 text-saffron shrink-0">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="text-[11px] uppercase tracking-wider text-saffron font-semibold">Hero capability</div>
            <h3 className="text-lg font-bold text-navy">"We heard you → here's what we did."</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Target the exact citizens whose grievances you've resolved. 4 closed clusters are ready to acknowledge — including <span className="font-semibold text-navy">147 KR Puram water complainants</span>.
            </p>
          </div>
          <Button onClick={() => { setCloseLoop("cl1"); setComposerOpen(true); }} className="bg-navy hover:bg-navy/90">
            Notify resolved citizens
          </Button>
        </CardContent>
      </Card>

      {/* Analytics row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-navy flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-saffron" /> Reach over time</CardTitle></CardHeader>
          <CardContent className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REACH_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="w" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="reach" stroke="#FF9933" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-navy flex items-center gap-1.5"><BarChart3 className="h-4 w-4 text-saffron" /> Best-performing types (read %)</CardTitle></CardHeader>
          <CardContent className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TYPE_PERF}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="type" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="rate" fill="#0A1F44" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-navy">Opt-out trend (30d)</CardTitle></CardHeader>
          <CardContent className="h-44">
            <div className="text-3xl font-bold text-navy">0.21%</div>
            <div className="text-xs text-emerald-700 mt-0.5">↓ 0.08 vs prior period</div>
            <div className="mt-3 space-y-1.5">
              {[{ l: "Wk 1", v: 24 }, { l: "Wk 2", v: 18 }, { l: "Wk 3", v: 14 }, { l: "Wk 4", v: 9 }].map(r => (
                <div key={r.l} className="flex items-center gap-2 text-xs">
                  <span className="w-10 text-muted-foreground">{r.l}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400" style={{ width: `${r.v * 3}%` }} />
                  </div>
                  <span className="w-6 text-right text-muted-foreground">{r.v}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <Card>
        <CardHeader><CardTitle className="text-navy">Broadcast History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Sent</TableHead>
                <TableHead className="text-right">Delivered</TableHead>
                <TableHead className="text-right">Read</TableHead>
                <TableHead className="text-right">Opt-outs</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {HISTORY.map(b => (
                <TableRow key={b.id}>
                  <TableCell>
                    <div className="font-medium text-navy text-sm">{b.name}</div>
                    <div className="text-[11px] text-muted-foreground">{b.id}</div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div>{b.audience}</div>
                    <div className="text-muted-foreground">{b.size.toLocaleString()} citizens</div>
                  </TableCell>
                  <TableCell className="text-xs">{b.channel}</TableCell>
                  <TableCell className="text-xs">{b.type}</TableCell>
                  <TableCell className="text-xs text-right text-muted-foreground"><Clock className="h-3 w-3 inline mr-0.5" />{b.sent}</TableCell>
                  <TableCell className="text-xs text-right font-medium text-emerald-700">{b.delivered}%</TableCell>
                  <TableCell className="text-xs text-right">{b.read ? `${b.read}%` : "—"}</TableCell>
                  <TableCell className="text-xs text-right">{b.optouts}</TableCell>
                  <TableCell><StatusBadge s={b.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Compliance footer */}
      <Card className="border-navy/10 bg-navy/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-navy shrink-0 mt-0.5" />
          <div className="text-xs text-navy/80">
            <div className="font-semibold text-navy mb-1">Compliance</div>
            All broadcasts target opted-in contacts only and respect the citizen's DPDP consent. Every message carries an opt-out footer.
            WhatsApp and SMS sends use DLT-approved templates (UI representation only). During <strong>Election Mode</strong>, political-message types are automatically disabled in line with the Model Code of Conduct.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
