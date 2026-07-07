import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  RefreshCw, CheckCircle2, Plus, Users, FileText, Clock, ExternalLink, MoreHorizontal,
  Shield, Bell, Phone, MessageSquare, ArrowRight, Trash2, Globe, Lock, FileSearch, Edit,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { MediaSourcesTab } from "@/components/media-sources-tab";
import { TemplatesLetterheadsTab } from "@/components/templates-letterheads-tab";

export const Route = createFileRoute("/settings-team")({
  head: () => ({ meta: [{ title: "Settings & Team — MP Pulse" }] }),
  component: SettingsTeamPage,
});

type Account = {
  id: string; platform: "X" | "Instagram" | "Facebook" | "YouTube";
  handle: string; connected: boolean; followers: string; lastSync: string; posts: number; growth: string;
};

const accounts: Account[] = [
  { id: "x", platform: "X", handle: "@MPBengaluru", connected: true, followers: "428.2K", lastSync: "4 min ago", posts: 612, growth: "+2.1%" },
  { id: "ig", platform: "Instagram", handle: "@mp.bengaluru", connected: true, followers: "186.4K", lastSync: "6 min ago", posts: 384, growth: "+4.8%" },
  { id: "fb", platform: "Facebook", handle: "Hon'ble MP Bengaluru", connected: false, followers: "92.1K", lastSync: "—", posts: 0, growth: "—" },
  { id: "yt", platform: "YouTube", handle: "MP Bengaluru Official", connected: false, followers: "21.3K", lastSync: "—", posts: 0, growth: "—" },
];

const TEAM = [
  { name: "Anjali Rao", role: "Chief of Staff", desks: "All", status: "Active", perms: "Admin · Full access" },
  { name: "Suresh Patil", role: "Office Manager", desks: "Grievances · Visitors", status: "Active", perms: "Editor · Cases, Letters, Visitors" },
  { name: "Pooja Hegde", role: "PA to MP", desks: "Calendar · Briefings", status: "Active", perms: "Editor · Calendar, CRM" },
  { name: "Rohan Iyer", role: "Comms Lead", desks: "Social · Media Watch", status: "Active", perms: "Editor · Posts, Statements" },
  { name: "Kavya Shetty", role: "Case Worker", desks: "Whitefield · KR Puram", status: "Active", perms: "Editor · Grievances (own desk)" },
  { name: "Imran Khan", role: "Case Worker", desks: "Mahadevapura · Hoodi", status: "Active", perms: "Editor · Grievances (own desk)" },
  { name: "Lakshmi Devi", role: "Front Desk", desks: "Reception", status: "Active", perms: "Limited · Visitor check-in" },
  { name: "Mahesh Gowda", role: "Field Worker", desks: "Bellandur · Varthur", status: "Active", perms: "Mobile · Field updates" },
];

const IVR_MENU = [
  { key: "1", label: "Water / BWSSB", desk: "Civic Desk" },
  { key: "2", label: "Police / Safety", desk: "Law Desk" },
  { key: "3", label: "Electricity / BESCOM", desk: "Civic Desk" },
  { key: "4", label: "Health / PHC", desk: "Welfare Desk" },
  { key: "5", label: "Recommendation letter request", desk: "Letters Desk" },
  { key: "9", label: "Speak to operator", desk: "Front Desk" },
];

const ROUTING = [
  { cat: "Water", desk: "Civic Desk", sla: "48h" },
  { cat: "Electricity", desk: "Civic Desk", sla: "48h" },
  { cat: "Police / Safety", desk: "Law Desk", sla: "24h" },
  { cat: "Health", desk: "Welfare Desk", sla: "72h" },
  { cat: "Education", desk: "Welfare Desk", sla: "5d" },
  { cat: "Roads / Infra", desk: "Civic Desk", sla: "5d" },
  { cat: "Land Records", desk: "Admin Desk", sla: "10d" },
  { cat: "Pension / Ration", desk: "Welfare Desk", sla: "7d" },
];

function PlatformIcon({ platform }: { platform: Account["platform"] }) {
  const styles: Record<string, string> = {
    X: "bg-foreground text-background",
    Instagram: "bg-gradient-to-br from-fuchsia-500 via-pink-500 to-amber-400 text-white",
    Facebook: "bg-[#1877F2] text-white",
    YouTube: "bg-[#FF0000] text-white",
  };
  const label: Record<string, string> = { X: "𝕏", Instagram: "Ig", Facebook: "f", YouTube: "▶" };
  return <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-lg font-bold ${styles[platform]}`}>{label[platform]}</div>;
}

function AccountCard({ account }: { account: Account }) {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(account.lastSync);
  const handleSync = () => {
    if (!account.connected) return;
    setSyncing(true);
    setTimeout(() => { setSyncing(false); setLastSync("just now"); toast.success(`${account.platform} synced`); }, 1200);
  };
  return (
    <Card className="border-slate-200">
      <CardContent className="p-5 flex flex-col">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <PlatformIcon platform={account.platform} />
            <div>
              <div className="text-sm font-semibold text-[#0A1F44]">{account.platform}</div>
              <div className="text-xs text-slate-500">{account.handle}</div>
            </div>
          </div>
          {account.connected
            ? <Badge className="bg-emerald-50 text-emerald-700 border-0 gap-1 text-[10px] uppercase"><CheckCircle2 className="h-3 w-3" /> Connected</Badge>
            : <Badge variant="outline" className="text-[10px] uppercase text-slate-500">Not connected</Badge>}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-slate-50 p-2">
            <div className="text-[10px] uppercase text-slate-500">Followers</div>
            <div className="text-sm font-bold text-[#0A1F44] tabular-nums">{account.followers}</div>
            <div className="text-[10px] text-emerald-600 font-medium">{account.growth}</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-2">
            <div className="text-[10px] uppercase text-slate-500">Posts</div>
            <div className="text-sm font-bold text-[#0A1F44] tabular-nums">{account.posts}</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-2">
            <div className="text-[10px] uppercase text-slate-500">Last sync</div>
            <div className="text-sm font-bold text-[#0A1F44]">{lastSync}</div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          {account.connected ? (
            <>
              <Button size="sm" onClick={handleSync} disabled={syncing} className="flex-1 gap-2 bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white">
                <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} /> {syncing ? "Syncing…" : "Sync Now"}
              </Button>
              <Button size="sm" variant="outline"><ExternalLink className="h-3.5 w-3.5" /></Button>
              <Button size="sm" variant="ghost" className="px-2"><MoreHorizontal className="h-4 w-4" /></Button>
            </>
          ) : (
            <Button size="sm" className="flex-1 gap-2 bg-[#FF9933] hover:bg-[#FF9933]/90 text-white">
              <Plus className="h-3.5 w-3.5" /> Connect {account.platform}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SettingsTeamPage() {
  const [autoReply, setAutoReply] = useState("Namaste! Thank you for contacting MP Office. Your message has been logged. A case worker will respond within 24 hours. For emergencies, please dial 112.");
  const [ivr, setIvr] = useState(IVR_MENU);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0A1F44]">Settings & Team</h1>
        <p className="text-slate-500 mt-1">Manage your workspace, intake channels, and access controls</p>
      </div>

      <Tabs defaultValue="accounts">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="accounts">Connected Accounts</TabsTrigger>
          <TabsTrigger value="team">Team & Roles</TabsTrigger>
          <TabsTrigger value="intake">Intake Configuration</TabsTrigger>
          <TabsTrigger value="prefs">Preferences</TabsTrigger>
          <TabsTrigger value="media">Media Sources & Watch Rules</TabsTrigger>
          <TabsTrigger value="letterheads">Templates & Letterheads</TabsTrigger>
        </TabsList>

        {/* ACCOUNTS */}
        <TabsContent value="accounts" className="mt-5 space-y-5">
          <Card className="border-slate-200 bg-gradient-to-r from-[#0A1F44] to-[#0A1F44]/90 text-white">
            <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-[#FF9933]/20 text-[#FF9933] flex items-center justify-center"><Users className="h-4 w-4" /></div>
                  <div><div className="text-[10px] uppercase opacity-60">Accounts</div><div className="text-base font-bold">4 connected</div></div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-[#FF9933]/20 text-[#FF9933] flex items-center justify-center"><FileText className="h-4 w-4" /></div>
                  <div><div className="text-[10px] uppercase opacity-60">Posts analyzed</div><div className="text-base font-bold tabular-nums">1,284</div></div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-[#FF9933]/20 text-[#FF9933] flex items-center justify-center"><Clock className="h-4 w-4" /></div>
                  <div><div className="text-[10px] uppercase opacity-60">Last sync</div><div className="text-base font-bold">4 min ago</div></div>
                </div>
              </div>
              <Button size="sm" className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white gap-2"><RefreshCw className="h-3.5 w-3.5" /> Sync All</Button>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {accounts.map(a => <AccountCard key={a.id} account={a} />)}
          </div>
        </TabsContent>

        {/* TEAM */}
        <TabsContent value="team" className="mt-5">
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-[#0A1F44] text-base">Team & Roles</CardTitle>
                <p className="text-xs text-slate-500 mt-1">{TEAM.length} active members · role-based permissions</p>
              </div>
              <AddMemberDialog />
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Role</th>
                    <th className="text-left p-3">Desks / Localities</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Permissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {TEAM.map(m => (
                    <tr key={m.name} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-[#0A1F44] text-white flex items-center justify-center text-xs font-semibold">
                            {m.name.split(" ").map(p => p[0]).join("")}
                          </div>
                          <span className="font-medium text-[#0A1F44]">{m.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-700">{m.role}</td>
                      <td className="p-3 text-xs text-slate-600">{m.desks}</td>
                      <td className="p-3"><Badge className="bg-emerald-50 text-emerald-700 border-0">{m.status}</Badge></td>
                      <td className="p-3 text-xs text-slate-600"><Shield className="w-3 h-3 inline mr-1 text-[#FF9933]" /> {m.perms}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* INTAKE */}
        <TabsContent value="intake" className="mt-5 space-y-5">
          {/* WhatsApp */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-[#0A1F44] text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-600" /> WhatsApp Business Number
                <Badge className="ml-2 bg-emerald-50 text-emerald-700 border-0 text-[10px]">Connected</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <span className="font-mono">+91 80 4567 8900</span>
                <Badge variant="outline" className="text-[10px]">Verified · Meta Business</Badge>
              </div>
              <div>
                <Label className="text-xs uppercase text-slate-500 tracking-wide">Auto-reply template</Label>
                <Textarea value={autoReply} onChange={e => setAutoReply(e.target.value)} rows={3} className="mt-1.5" />
                <Button size="sm" className="mt-2 bg-[#0A1F44] hover:bg-[#0A1F44]/90" onClick={() => toast.success("Auto-reply saved")}>Save</Button>
              </div>
            </CardContent>
          </Card>

          {/* IVR */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-[#0A1F44] text-base flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF9933]" /> IVR / Call-in
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <span className="font-mono">+91 80 4567 8911</span>
                <Badge variant="outline" className="text-[10px]">Toll-free routed</Badge>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500 tracking-wide mb-2">IVR Menu Builder</p>
                <div className="space-y-2">
                  {ivr.map((it, i) => (
                    <div key={it.key} className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50/50">
                      <div className="w-9 h-9 rounded-md bg-[#0A1F44] text-white flex items-center justify-center font-semibold text-sm shrink-0">{it.key}</div>
                      <Input value={it.label} onChange={e => { const c = [...ivr]; c[i] = { ...c[i], label: e.target.value }; setIvr(c); }} className="flex-1 h-8 text-sm" />
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                      <Input value={it.desk} onChange={e => { const c = [...ivr]; c[i] = { ...c[i], desk: e.target.value }; setIvr(c); }} className="w-44 h-8 text-sm" />
                      <Button size="sm" variant="ghost" onClick={() => setIvr(ivr.filter((_, j) => j !== i))}><Trash2 className="w-3.5 h-3.5 text-slate-400" /></Button>
                    </div>
                  ))}
                </div>
                <Button size="sm" variant="outline" className="mt-3" onClick={() => setIvr([...ivr, { key: String(ivr.length + 1), label: "New option", desk: "Front Desk" }])}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Option
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Routing */}
          <Card className="border-slate-200">
            <CardHeader><CardTitle className="text-[#0A1F44] text-base">Routing Rules — Category → Desk</CardTitle></CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr><th className="text-left p-3">Category</th><th className="text-left p-3">Routed Desk</th><th className="text-left p-3">SLA</th><th className="text-right p-3 pr-4">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ROUTING.map(r => (
                    <tr key={r.cat} className="hover:bg-slate-50">
                      <td className="p-3 font-medium text-[#0A1F44]">{r.cat}</td>
                      <td className="p-3 text-slate-700">{r.desk}</td>
                      <td className="p-3"><Badge variant="outline" className="text-[10px]">{r.sla}</Badge></td>
                      <td className="p-3 text-right pr-4"><Button size="sm" variant="ghost"><Edit className="w-3.5 h-3.5" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PREFS */}
        <TabsContent value="prefs" className="mt-5 space-y-5">
          <Card className="border-slate-200">
            <CardHeader><CardTitle className="text-[#0A1F44] text-base flex items-center gap-2"><Globe className="w-4 h-4" /> Language</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs uppercase text-slate-500">Default office language</Label>
                <Select defaultValue="Kannada">
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kannada">Kannada</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs uppercase text-slate-500">Communication languages</Label>
                <p className="mt-2 text-sm text-slate-700">Kannada · English · Hindi <Badge variant="outline" className="ml-2 text-[10px]">Tri-lingual</Badge></p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader><CardTitle className="text-[#0A1F44] text-base flex items-center gap-2"><Bell className="w-4 h-4 text-[#FF9933]" /> Notifications</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                ["Negative sentiment spikes", "Alert when negative mentions jump >10% in 24h"],
                ["High-urgency grievances", "Push instantly when an SOS / High-priority grievance lands"],
                ["Daily briefing email", "7:00 AM IST — delivered to your inbox"],
                ["Weekly intelligence report", "Every Monday — PDF + dashboard link"],
                ["VIP greeting approvals", "WhatsApp ping when a VIP greeting awaits your approval"],
              ].map(([label, desc]) => (
                <div key={label} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100">
                  <div>
                    <p className="text-sm font-medium text-[#0A1F44]">{label}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#0A1F44] border-slate-200">
            <CardHeader><CardTitle className="text-[#0A1F44] text-base flex items-center gap-2"><Lock className="w-4 h-4" /> Data & Privacy</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700">
              <p>
                MP Pulse operates in alignment with the <span className="font-semibold">Digital Personal Data Protection Act, 2023 (DPDP)</span>.
                Citizen data is collected with explicit consent, retained for the minimum operational period, and never shared with third parties without lawful basis.
              </p>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-[10px] uppercase text-slate-500">Consent capture</p>
                  <p className="text-sm font-semibold text-[#0A1F44] mt-0.5">At intake (WhatsApp/IVR/Walk-in)</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-[10px] uppercase text-slate-500">Retention</p>
                  <p className="text-sm font-semibold text-[#0A1F44] mt-0.5">5 years post-resolution</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-[10px] uppercase text-slate-500">Data Principal Rights</p>
                  <p className="text-sm font-semibold text-[#0A1F44] mt-0.5">Access · Correct · Erase</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-1"><FileSearch className="w-3.5 h-3.5 mr-1.5" /> View Audit Log</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MEDIA SOURCES & WATCH RULES */}
        <TabsContent value="media" className="mt-5">
          <MediaSourcesTab />
        </TabsContent>

        <TabsContent value="letterheads" className="mt-5">
          <TemplatesLetterheadsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AddMemberDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white"><Plus className="w-3.5 h-3.5 mr-1" /> Add Member</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Team Member</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Name</Label><Input placeholder="Full name" /></div>
            <div><Label>Phone / Email</Label><Input placeholder="Contact" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Role</Label>
              <Select defaultValue="Case Worker">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["PA to MP", "Office Manager", "Case Worker", "Front Desk", "Comms", "Field Worker", "Chief of Staff"].map(r =>
                    <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Permission</Label>
              <Select defaultValue="Editor">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Admin", "Editor", "Mobile (Field)", "Limited"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div><Label>Assigned desks / localities</Label><Input placeholder="e.g. Whitefield, KR Puram" /></div>
        </div>
        <DialogFooter>
          <Button onClick={() => { toast.success("Team member invited"); setOpen(false); }} className="bg-[#0A1F44] hover:bg-[#0A1F44]/90">Send Invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
