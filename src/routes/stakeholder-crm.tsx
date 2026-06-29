import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search, Plus, Phone, Mail, MapPin, Cake, Heart, Shield, MessageSquare,
  CalendarPlus, ClipboardList, Users, Star, Clock, AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/stakeholder-crm")({
  head: () => ({ meta: [{ title: "Stakeholder CRM — MP Pulse" }] }),
  component: CRMPage,
});

const CATEGORIES = [
  "Corporators", "MLAs", "Officials", "Journalists", "RWA Heads",
  "Industry/Tech", "Community Leaders", "Religious Leaders", "Donors",
  "Party Workers", "Key Supporters",
];

type Tier = "VIP" | "Important" | "Casual" | "Functional";

const TIER_META: Record<Tier, { label: string; dot: string; chip: string }> = {
  VIP: { label: "Very Important", dot: "bg-[#FF9933]", chip: "bg-[#FF9933]/10 text-[#FF9933] border-[#FF9933]/30" },
  Important: { label: "Important", dot: "bg-blue-500", chip: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
  Casual: { label: "Casual", dot: "bg-slate-400", chip: "bg-slate-400/10 text-slate-600 border-slate-400/30" },
  Functional: { label: "Functional", dot: "bg-slate-300", chip: "bg-slate-300/20 text-slate-500 border-slate-300/40" },
};

type Contact = {
  id: string; name: string; role: string; category: string; tier: Tier;
  phone: string; email: string; locality: string; spouse?: string; children?: string;
  birthday: string; anniversary?: string; lastInteraction: string; next: string;
  promises: { text: string; status: "open" | "done" }[];
  log: { date: string; type: string; note: string }[];
};

const CONTACTS: Contact[] = [
  { id: "c1", name: "Sri Ramesh Kumar", role: "Corporator, Ward 84", category: "Corporators", tier: "VIP", phone: "+91 98450 11223", email: "ramesh.k@bbmp.gov.in", locality: "Whitefield", spouse: "Smt. Geetha", children: "Arjun, Divya", birthday: "28 Jun", anniversary: "14 Feb", lastInteraction: "5 days ago", next: "Birthday 28 Jun", promises: [{ text: "Support for ward park funding", status: "open" }, { text: "BBMP road resurfacing approval", status: "done" }], log: [{ date: "21 Jun 2026", type: "Meeting", note: "Joint visit to Whitefield lake site" }, { date: "12 Jun 2026", type: "Call", note: "Briefed on water tanker deployment" }, { date: "01 Jun 2026", type: "Event", note: "Attended ward sabha" }] },
  { id: "c2", name: "Smt. Lakshmi Rao", role: "RWA Federation Head, KR Puram", category: "RWA Heads", tier: "Important", phone: "+91 98860 44556", email: "lakshmi.rao@krpuramrwa.in", locality: "KR Puram", spouse: "Sri Venkatesh Rao", birthday: "07 Sep", anniversary: "22 Jun", lastInteraction: "18 days ago", next: "Anniversary 22 Jun", promises: [{ text: "Pedestrian crossing near KR Puram station", status: "open" }], log: [{ date: "07 Jun 2026", type: "Meeting", note: "RWA federation grievance briefing" }, { date: "18 May 2026", type: "Event", note: "Inaugurated borewell project" }] },
  { id: "c3", name: "Sri A. Prakash", role: "Senior Reporter, Prajavani", category: "Journalists", tier: "VIP", phone: "+91 98800 77881", email: "prakash@prajavani.co.in", locality: "Jayanagar", birthday: "11 Aug", lastInteraction: "12 days ago", next: "Follow-up overdue", promises: [{ text: "Exclusive interview on lake rejuvenation", status: "open" }], log: [{ date: "13 Jun 2026", type: "Call", note: "Background on Whitefield flooding" }] },
  { id: "c4", name: "Sri D. Manjunath", role: "BWSSB Chief Engineer (East)", category: "Officials", tier: "Important", phone: "+91 80 2245 0011", email: "ce.east@bwssb.gov.in", locality: "Cauvery Bhavan", birthday: "03 Mar", lastInteraction: "9 days ago", next: "Review meeting 30 Jun", promises: [{ text: "Cauvery Stage V tap connections — Mahadevapura", status: "open" }], log: [{ date: "16 Jun 2026", type: "Meeting", note: "Water supply review" }] },
  { id: "c5", name: "Smt. Pratibha Hegde", role: "MLA, Mahadevapura", category: "MLAs", tier: "VIP", phone: "+91 94480 22110", email: "pratibha.h@karnataka.gov.in", locality: "Mahadevapura", spouse: "Sri R. Hegde", children: "Kiran", birthday: "19 Oct", anniversary: "05 Dec", lastInteraction: "3 days ago", next: "Joint event 02 Jul", promises: [{ text: "Joint lake rejuvenation initiative", status: "open" }], log: [{ date: "22 Jun 2026", type: "Meeting", note: "Coordination on Mahadevapura flooding response" }] },
  { id: "c6", name: "Sri Vivek Murthy", role: "VP Govt Affairs, Wipro", category: "Industry/Tech", tier: "Important", phone: "+91 99860 33445", email: "vivek.m@wipro.com", locality: "Sarjapur", birthday: "26 Nov", lastInteraction: "21 days ago", next: "IT corridor lunch 26 Jun", promises: [{ text: "Last-mile connectivity CSR proposal", status: "open" }], log: [{ date: "04 Jun 2026", type: "Email", note: "Shared draft CSR MoU" }] },
  { id: "c7", name: "Swamiji Shantamurthy", role: "Math Head, Mahadevapura", category: "Religious Leaders", tier: "VIP", phone: "+91 98801 66770", email: "office@shantamath.org", locality: "Mahadevapura", birthday: "12 Jan", lastInteraction: "31 days ago", next: "Festival 14 Jul", promises: [], log: [{ date: "25 May 2026", type: "Visit", note: "Darshan and community blessing" }] },
  { id: "c8", name: "Sri Karthik Reddy", role: "Donor / Real Estate", category: "Donors", tier: "Important", phone: "+91 98455 99001", email: "karthik@reddybuilders.in", locality: "Whitefield", birthday: "08 Apr", anniversary: "29 Sep", lastInteraction: "44 days ago", next: "Follow-up overdue", promises: [{ text: "Apartment association event funding", status: "done" }], log: [{ date: "12 May 2026", type: "Gift", note: "Festival hamper sent" }] },
  { id: "c9", name: "Sri Mahesh Gowda", role: "Mandal President — Whitefield", category: "Party Workers", tier: "Important", phone: "+91 99720 11445", email: "", locality: "Whitefield", birthday: "30 Jun", lastInteraction: "2 days ago", next: "Birthday 30 Jun", promises: [{ text: "Booth committee restructuring", status: "open" }], log: [{ date: "24 Jun 2026", type: "Meeting", note: "Cadre review" }] },
  { id: "c10", name: "Smt. Reshma Khan", role: "Community Leader, Hoodi", category: "Community Leaders", tier: "Casual", phone: "+91 98863 55001", email: "", locality: "Hoodi", birthday: "16 Feb", lastInteraction: "60 days ago", next: "—", promises: [{ text: "Skill training for women SHGs", status: "open" }], log: [] },
  { id: "c11", name: "Sri Anil Joshi", role: "DCP East Division", category: "Officials", tier: "Functional", phone: "+91 80 2294 0080", email: "dcp.east@ksp.gov.in", locality: "Indiranagar", birthday: "21 May", lastInteraction: "15 days ago", next: "Quarterly meet", promises: [], log: [{ date: "10 Jun 2026", type: "Meeting", note: "Law & order briefing" }] },
  { id: "c12", name: "Sri T. Narayanaswamy", role: "Key Supporter — IT Voter Network", category: "Key Supporters", tier: "VIP", phone: "+91 98452 11119", email: "narayan@techvoters.in", locality: "Bellandur", birthday: "02 Jul", anniversary: "11 Mar", lastInteraction: "8 days ago", next: "Birthday 02 Jul", promises: [{ text: "Town hall in Bellandur", status: "open" }], log: [{ date: "17 Jun 2026", type: "Call", note: "Discussed town hall logistics" }] },
];

const UPCOMING_GREETINGS = [
  { id: "g1", name: "Sri Ramesh Kumar", occasion: "Birthday", date: "28 Jun", channel: "MP WhatsApp", sender: "MP Personal", tier: "VIP" as Tier },
  { id: "g2", name: "Smt. Lakshmi Rao", occasion: "Anniversary", date: "22 Jun", channel: "Office WhatsApp + Card", sender: "MP Office", tier: "Important" as Tier },
  { id: "g3", name: "Sri Mahesh Gowda", occasion: "Birthday", date: "30 Jun", channel: "Office WhatsApp", sender: "MP Office", tier: "Important" as Tier },
  { id: "g4", name: "Sri T. Narayanaswamy", occasion: "Birthday", date: "02 Jul", channel: "MP WhatsApp", sender: "MP Personal", tier: "VIP" as Tier },
  { id: "g5", name: "Swamiji Shantamurthy", occasion: "Festival Greeting", date: "14 Jul", channel: "MP WhatsApp + In-person", sender: "MP Personal", tier: "VIP" as Tier },
];

function PeopleTab() {
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<Contact | null>(null);
  const [rules, setRules] = useState({ vipBday: true, impBday: true, anniv: true, casual: false });
  const [greetings, setGreetings] = useState(UPCOMING_GREETINGS);

  const filtered = useMemo(() => CONTACTS.filter(c =>
    (selectedCats.length === 0 || selectedCats.includes(c.category)) &&
    (search === "" || c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase()))
  ), [selectedCats, search]);

  const toggleCat = (c: string) => setSelectedCats(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const initials = (name: string) => name.replace(/^(Sri|Smt\.|Swamiji)\s+/, "").split(" ").map(w => w[0]).slice(0, 2).join("");

  const approveGreeting = (id: string) => {
    setGreetings(g => g.filter(x => x.id !== id));
    toast.success("Greeting approved and queued for send");
  };

  return (
    <div className="space-y-6">


      {/* Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => toggleCat(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${selectedCats.includes(c) ? "bg-[#0A1F44] text-white border-[#0A1F44]" : "bg-white text-slate-600 border-slate-200 hover:border-[#0A1F44]"}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              {(Object.keys(TIER_META) as Tier[]).map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${TIER_META[t].dot}`} />
                  <span className="text-slate-600">{TIER_META[t].label}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or role" className="pl-8 w-64 h-9" />
              </div>
              <Button className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white h-9">
                <Plus className="w-4 h-4 mr-1" /> Add Contact
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stat strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total contacts", val: "1,860", icon: Users, color: "text-[#0A1F44]" },
          { label: "VIP", val: "84", icon: Star, color: "text-[#FF9933]" },
          { label: "Greetings due this week", val: "11", icon: Cake, color: "text-pink-500" },
          { label: "Touchpoints overdue", val: "23", icon: AlertCircle, color: "text-red-500" },
        ].map(s => (
          <Card key={s.label} className="border-slate-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-2xl font-bold text-[#0A1F44] mt-1">{s.val}</p>
              </div>
              <s.icon className={`w-8 h-8 ${s.color} opacity-70`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(c => (
          <Card key={c.id} onClick={() => setActive(c)}
            className="border-slate-200 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0A1F44] to-[#1e3a6f] text-white flex items-center justify-center font-semibold text-sm shrink-0">
                  {initials(c.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-[#0A1F44] truncate">{c.name}</p>
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${TIER_META[c.tier].dot}`} title={TIER_META[c.tier].label} />
                  </div>
                  <p className="text-xs text-slate-500 truncate">{c.role}</p>
                  <Badge variant="outline" className="mt-2 text-[10px] font-normal">{c.category}</Badge>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-3 h-3" /> Last: {c.lastInteraction}
                </div>
                <div className="flex items-center gap-1.5 text-[#0A1F44] font-medium">
                  <CalendarPlus className="w-3 h-3" /> Next: {c.next}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Greetings automation */}
      <Card className="border-l-4 border-l-[#FF9933] border-slate-200">
        <CardHeader>
          <CardTitle className="text-[#0A1F44] flex items-center gap-2">
            <Cake className="w-5 h-5 text-[#FF9933]" /> Greetings Automation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { k: "vipBday", label: "VIP birthdays → Personal WhatsApp from MP's number", v: rules.vipBday },
              { k: "impBday", label: "Important birthdays → Message from MP Office", v: rules.impBday },
              { k: "anniv", label: "Anniversaries (VIP/Important) → Office WhatsApp + card", v: rules.anniv },
              { k: "casual", label: "Casual/Functional → no auto-greeting", v: rules.casual },
            ].map(r => (
              <div key={r.k} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <p className="text-sm text-slate-700 pr-3">{r.label}</p>
                <Switch checked={r.v} onCheckedChange={(checked) => setRules(prev => ({ ...prev, [r.k]: checked }))} />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[#FF9933]/10 border border-[#FF9933]/30 text-sm text-[#0A1F44]">
            <Shield className="w-4 h-4 text-[#FF9933] shrink-0" />
            VIP messages require one-tap MP confirmation before sending.
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#0A1F44] mb-3">Upcoming Greetings</h4>
            <div className="space-y-2">
              {greetings.map(g => (
                <div key={g.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full ${TIER_META[g.tier].dot}`} />
                    <div className="min-w-0 flex-1 grid grid-cols-1 md:grid-cols-5 gap-2 md:items-center">
                      <p className="font-medium text-[#0A1F44] text-sm truncate">{g.name}</p>
                      <p className="text-xs text-slate-500">{g.occasion} · {g.date}</p>
                      <p className="text-xs text-slate-500 md:col-span-2">{g.channel} · {g.sender}</p>
                      <div className="flex gap-2 md:justify-end">
                        {g.tier === "VIP" ? (
                          <>
                            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast("Preview opened")}>Preview</Button>
                            <Button size="sm" className="h-7 text-xs bg-[#0A1F44] hover:bg-[#0A1F44]/90" onClick={() => approveGreeting(g.id)}>Approve</Button>
                          </>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">Auto-scheduled</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile drawer */}
      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {active && (
            <>
              <SheetHeader>
                <SheetTitle className="text-[#0A1F44]">{active.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <p className="text-sm text-slate-500">{active.role}</p>
                <Badge variant="outline">{active.category}</Badge>
                <Select value={active.tier} onValueChange={(v) => setActive({ ...active, tier: v as Tier })}>
                  <SelectTrigger className="h-7 w-36 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(TIER_META) as Tier[]).map(t => (
                      <SelectItem key={t} value={t}>{TIER_META[t].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600"><Phone className="w-4 h-4 text-[#0A1F44]" /> {active.phone}</div>
                <div className="flex items-center gap-2 text-slate-600 truncate"><Mail className="w-4 h-4 text-[#0A1F44]" /> {active.email || "—"}</div>
                <div className="flex items-center gap-2 text-slate-600"><MapPin className="w-4 h-4 text-[#0A1F44]" /> {active.locality}</div>
                <div className="flex items-center gap-2 text-slate-600"><Cake className="w-4 h-4 text-[#0A1F44]" /> Birthday: {active.birthday}</div>
                {active.anniversary && <div className="flex items-center gap-2 text-slate-600"><Heart className="w-4 h-4 text-pink-500" /> Anniversary: {active.anniversary}</div>}
              </div>

              {(active.spouse || active.children) && (
                <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm">
                  <p className="font-semibold text-[#0A1F44] mb-1 text-xs uppercase tracking-wide">Family</p>
                  {active.spouse && <p className="text-slate-600">Spouse: {active.spouse}</p>}
                  {active.children && <p className="text-slate-600">Children: {active.children}</p>}
                </div>
              )}

              <div className="mt-5">
                <h4 className="text-sm font-semibold text-[#0A1F44] mb-2 flex items-center gap-1.5"><ClipboardList className="w-4 h-4" /> Promises / Asks</h4>
                {active.promises.length === 0 ? <p className="text-xs text-slate-400">No open asks</p> : (
                  <div className="space-y-2">
                    {active.promises.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 text-sm">
                        <span className="text-slate-700">{p.text}</span>
                        <Badge className={p.status === "open" ? "bg-amber-100 text-amber-700 hover:bg-amber-100" : "bg-green-100 text-green-700 hover:bg-green-100"}>{p.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5">
                <h4 className="text-sm font-semibold text-[#0A1F44] mb-3">Interaction Log</h4>
                <div className="relative pl-5 space-y-3 border-l-2 border-slate-200">
                  {active.log.map((l, i) => (
                    <div key={i} className="relative">
                      <span className="absolute -left-[26px] top-1 w-3 h-3 rounded-full bg-[#FF9933] border-2 border-white" />
                      <p className="text-xs text-slate-400">{l.date} · {l.type}</p>
                      <p className="text-sm text-slate-700">{l.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <Textarea placeholder="Add a note about this contact…" className="text-sm" rows={2} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button className="bg-[#0A1F44] hover:bg-[#0A1F44]/90" onClick={() => toast.success("Interaction logged")}><ClipboardList className="w-4 h-4 mr-1.5" /> Log Interaction</Button>
                <Button variant="outline" onClick={() => toast.success("Touchpoint scheduled")}><CalendarPlus className="w-4 h-4 mr-1.5" /> Schedule Touchpoint</Button>
                <Button variant="outline" onClick={() => toast.success("Message sent via MP Office")}><MessageSquare className="w-4 h-4 mr-1.5" /> Send Message</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ─────────── Organisations ───────────
type Org = {
  id: string; name: string; type: string; area: string; bearers: string;
  influence: "High" | "Medium" | "Low"; lastMeeting: string; pending: string; events: number;
  support: string; health: "Strong" | "Steady" | "Cooling"; dates: string; notes: string;
};
const ORGS: Org[] = [
  { id: "o1", name: "Whitefield Rising RWA Federation", type: "RWA", area: "Whitefield", bearers: "Zibi Jamal, Clement Jayakumar", influence: "High", lastMeeting: "8 days ago", pending: "ORR last-mile shuttle, lake encroachment FIR", events: 6, support: "Endorsement for white-topping push", health: "Strong", dates: "Founding day 04 Aug", notes: "Most influential RWA in east BLR; press-savvy." },
  { id: "o2", name: "FKCCI — Karnataka Chamber", type: "Industry body", area: "Kasturba Rd", bearers: "President R. Shivakumar", influence: "High", lastMeeting: "21 days ago", pending: "MSME credit panel, labour code consultation", events: 3, support: "Industry signatories on letter to MoCI", health: "Steady", dates: "AGM 14 Sep", notes: "Convene at quarterly business breakfast." },
  { id: "o3", name: "Mahadevapura Math Trust", type: "Religious", area: "Mahadevapura", bearers: "Swamiji Shantamurthy + 7 trustees", influence: "High", lastMeeting: "31 days ago", pending: "Annadana hall expansion", events: 4, support: "Community blessing for school program", health: "Strong", dates: "Annual festival 14 Jul", notes: "MP personal darshan twice a year." },
  { id: "o4", name: "Karnataka Vokkaligara Sangha — East", type: "Community", area: "Indiranagar", bearers: "Sec. M. Krishnegowda", influence: "Medium", lastMeeting: "44 days ago", pending: "Hostel land allotment follow-up", events: 2, support: "Community youth meet attendance", health: "Steady", dates: "Founder day 22 Mar", notes: "Sensitive — keep cross-caste balance public." },
  { id: "o5", name: "Bengaluru Auto Drivers Union", type: "Trade assn.", area: "Multiple stands", bearers: "President C.N. Rudramurthy", influence: "Medium", lastMeeting: "12 days ago", pending: "App aggregator fare cap, traffic harassment", events: 1, support: "Quiet — protest-prone group", health: "Cooling", dates: "—", notes: "Volatile; route via Constituency Coord." },
  { id: "o6", name: "Akshaya Mahila SHG Federation", type: "Women SHG", area: "Bommanahalli", bearers: "Convener Smt. Pushpa", influence: "Medium", lastMeeting: "9 days ago", pending: "Skill training centre, Mudra loan facilitation", events: 5, support: "300+ active members; reliable mobilisers", health: "Strong", dates: "Federation day 08 Mar", notes: "Strong on-ground voter mobilisation." },
  { id: "o7", name: "Indus International School Trust", type: "Education", area: "Sarjapur", bearers: "Chair Sarojini Rao", influence: "Medium", lastMeeting: "60 days ago", pending: "CBSE affiliation renewal letter", events: 1, support: "Hosting MP youth town hall", health: "Steady", dates: "Annual day 12 Dec", notes: "Influential parent body." },
  { id: "o8", name: "Manipal Hospital — Old Airport Rd", type: "Hospital", area: "Indiranagar", bearers: "MD Dr. Sudarshan Ballal", influence: "High", lastMeeting: "18 days ago", pending: "CSR health camp coordination", events: 2, support: "Free OPD camps in 4 wards", health: "Strong", dates: "Foundation day 03 Oct", notes: "Excellent partner for medical emergencies." },
  { id: "o9", name: "Prajavani Press Club", type: "Media house", area: "MG Road", bearers: "Bureau chief A. Prakash", influence: "High", lastMeeting: "4 days ago", pending: "Exclusive on Cauvery V allocation", events: 0, support: "Coverage of constituency work", health: "Steady", dates: "Anniversary 19 Apr", notes: "Maintain weekly press-coffee cadence." },
  { id: "o10", name: "BJP Mandal — Whitefield", type: "Party unit", area: "Whitefield", bearers: "President Mahesh Gowda", influence: "High", lastMeeting: "2 days ago", pending: "Booth committee restructuring", events: 9, support: "Cadre mobilisation, booth-level GOTV", health: "Strong", dates: "Mandal day 06 Apr", notes: "Direct line to state org." },
];

function OrganisationsTab() {
  const [active, setActive] = useState<Org | null>(null);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ORGS.map(o => (
          <Card key={o.id} onClick={() => setActive(o)} className="cursor-pointer hover:shadow-md transition-all border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-[#0A1F44] truncate">{o.name}</p>
                  <p className="text-xs text-slate-500">{o.type} · {o.area}</p>
                </div>
                <Badge className={
                  o.influence === "High" ? "bg-[#FF9933]/15 text-[#FF9933] border border-[#FF9933]/40" :
                  o.influence === "Medium" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                  "bg-slate-100 text-slate-600"
                }>{o.influence}</Badge>
              </div>
              <p className="text-xs text-slate-600 mt-3 line-clamp-2">{o.bearers}</p>
              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                <div><span className="text-slate-400">Last meet</span><div className="font-medium text-[#0A1F44]">{o.lastMeeting}</div></div>
                <div><span className="text-slate-400">Health</span><div className={
                  o.health === "Strong" ? "font-medium text-emerald-600" :
                  o.health === "Cooling" ? "font-medium text-rose-600" : "font-medium text-amber-600"
                }>{o.health}</div></div>
              </div>
              <p className="text-xs text-slate-500 mt-2 line-clamp-1"><span className="text-slate-400">Pending:</span> {o.pending}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Sheet open={!!active} onOpenChange={o => !o && setActive(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {active && (
            <>
              <SheetHeader><SheetTitle className="text-[#0A1F44]">{active.name}</SheetTitle></SheetHeader>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <Badge variant="outline">{active.type}</Badge>
                <Badge variant="outline">{active.area}</Badge>
                <Badge className="bg-[#FF9933]/15 text-[#FF9933] border border-[#FF9933]/40">{active.influence} influence</Badge>
              </div>
              <div className="mt-5 space-y-4 text-sm">
                <Field label="Key office bearers" value={active.bearers} />
                <Field label="Pending issues" value={active.pending} />
                <Field label="Support requested" value={active.support} />
                <Field label="Events attended" value={`${active.events} in last 12 months`} />
                <Field label="Relationship health" value={active.health} />
                <Field label="Important dates" value={active.dates} />
                <Field label="Internal notes" value={active.notes} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button className="bg-[#0A1F44] hover:bg-[#0A1F44]/90" onClick={() => toast.success("Meeting scheduled")}><CalendarPlus className="w-4 h-4 mr-1.5" /> Schedule meeting</Button>
                <Button variant="outline" onClick={() => toast.success("Note saved")}><ClipboardList className="w-4 h-4 mr-1.5" /> Log interaction</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ─────────── Citizens (Citizen 360) ───────────
type Citizen = {
  id: string; name: string; ward: string; address: string; mobile: string;
  family: string; grievances: number; schemes: string[]; meetings: number;
  letters: number; events: number; satisfaction: number; affiliation?: string;
};
const CITIZENS: Citizen[] = [
  { id: "z1", name: "Suresh Gowda", ward: "Mahadevapura W-84", address: "KR Puram 4th cross", mobile: "+91 98453 11290", family: "Spouse + 2 children", grievances: 3, schemes: ["Ration", "Ujjwala"], meetings: 2, letters: 1, events: 4, satisfaction: 4.4, affiliation: "Self-declared supporter" },
  { id: "z2", name: "Lakshmi N.", ward: "Bommanahalli W-186", address: "Hongasandra 9th cross", mobile: "+91 99000 47731", family: "Widow, 1 daughter", grievances: 2, schemes: ["Widow pension", "Ayushman"], meetings: 3, letters: 2, events: 1, satisfaction: 4.8 },
  { id: "z3", name: "Praveen K.", ward: "Yelahanka W-6", address: "5th main, 3rd block", mobile: "+91 80505 11876", family: "Spouse + parents", grievances: 1, schemes: [], meetings: 1, letters: 0, events: 6, satisfaction: 4.9, affiliation: "Active volunteer" },
  { id: "z4", name: "Anitha S.", ward: "CV Raman Nagar W-90", address: "DRDO layout", mobile: "+91 98801 22340", family: "Single parent + 1 child", grievances: 4, schemes: ["PMAY", "Scholarship"], meetings: 1, letters: 3, events: 2, satisfaction: 3.6 },
  { id: "z5", name: "Imran Pasha", ward: "Shivajinagar W-92", address: "Tannery Rd", mobile: "+91 96860 55712", family: "Spouse + 3 children", grievances: 5, schemes: ["Ration", "Mudra"], meetings: 4, letters: 2, events: 3, satisfaction: 4.1 },
  { id: "z6", name: "Geetha Bai", ward: "Bommanahalli W-188", address: "Hongasandra 9th cross", mobile: "+91 99453 00118", family: "Spouse + 2 children", grievances: 1, schemes: ["Ujjwala"], meetings: 0, letters: 0, events: 1, satisfaction: 4.2 },
  { id: "z7", name: "Vikram Shetty", ward: "Hebbal W-19", address: "Sahakar Nagar", mobile: "+91 98860 77001", family: "Spouse + 1 child", grievances: 2, schemes: [], meetings: 1, letters: 1, events: 5, satisfaction: 4.5, affiliation: "Donor" },
  { id: "z8", name: "Mr. Rangaswamy", ward: "Rajajinagar W-101", address: "5th block", mobile: "+91 98455 19920", family: "Spouse + 4 children", grievances: 3, schemes: ["Senior citizen pension"], meetings: 5, letters: 4, events: 2, satisfaction: 4.7 },
];

function CitizensTab() {
  const [active, setActive] = useState<Citizen | null>(null);
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs text-amber-900 flex items-start gap-2">
        <Shield className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <span>Citizen 360 — affiliation notes shown only when voluntarily declared. Sensitive contact details are masked for non-authorised users.</span>
      </div>
      <Card>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="text-left px-4 py-2.5">Citizen</th>
              <th className="text-left px-4 py-2.5">Ward</th>
              <th className="text-left px-4 py-2.5">Mobile</th>
              <th className="text-center px-4 py-2.5">Grievances</th>
              <th className="text-center px-4 py-2.5">Schemes</th>
              <th className="text-center px-4 py-2.5">Meetings</th>
              <th className="text-center px-4 py-2.5">Letters</th>
              <th className="text-center px-4 py-2.5">Satisfaction</th>
            </tr>
          </thead>
          <tbody>
            {CITIZENS.map(c => (
              <tr key={c.id} onClick={() => setActive(c)} className="border-t hover:bg-slate-50/50 cursor-pointer">
                <td className="px-4 py-3 font-medium text-[#0A1F44]">{c.name}</td>
                <td className="px-4 py-3 text-xs">{c.ward}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{c.mobile.slice(0, 8)}•••••</td>
                <td className="px-4 py-3 text-center">{c.grievances}</td>
                <td className="px-4 py-3 text-center">{c.schemes.length}</td>
                <td className="px-4 py-3 text-center">{c.meetings}</td>
                <td className="px-4 py-3 text-center">{c.letters}</td>
                <td className="px-4 py-3 text-center"><span className={c.satisfaction >= 4.5 ? "text-emerald-600 font-semibold" : c.satisfaction >= 4 ? "text-amber-600 font-semibold" : "text-rose-600 font-semibold"}>{c.satisfaction.toFixed(1)} ★</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Sheet open={!!active} onOpenChange={o => !o && setActive(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {active && (
            <>
              <SheetHeader><SheetTitle className="text-[#0A1F44]">{active.name}</SheetTitle></SheetHeader>
              <p className="text-sm text-slate-500 mt-1">{active.ward} · {active.address}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Field label="Mobile" value={active.mobile} />
                <Field label="Family" value={active.family} />
                <Field label="Past grievances" value={`${active.grievances} (2 open)`} />
                <Field label="Schemes requested" value={active.schemes.join(", ") || "None"} />
                <Field label="Meetings with MP" value={`${active.meetings}`} />
                <Field label="Letters issued" value={`${active.letters}`} />
                <Field label="Events attended" value={`${active.events}`} />
                <Field label="Satisfaction history" value={`${active.satisfaction.toFixed(1)} ★ avg`} />
              </div>
              {active.affiliation && (
                <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <span className="font-semibold text-[#0A1F44]">Voluntary affiliation note:</span> {active.affiliation}
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button className="bg-[#0A1F44] hover:bg-[#0A1F44]/90" onClick={() => toast.success("Routed to Grievances")}>Create grievance</Button>
                <Button variant="outline" onClick={() => toast.success("Routed to Letters")}>Generate letter</Button>
                <Button variant="outline" onClick={() => toast.success("Routed to Scheme Assistance")}>Scheme assist</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function OfficialsTab() {
  return (
    <Card className="p-10 text-center border-dashed">
      <Users className="w-10 h-10 text-[#FF9933] mx-auto mb-3" />
      <h3 className="font-semibold text-[#0A1F44]">Officials directory</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
        Officials are managed as the single source of truth in the Officer Directory module.
        All interaction history, transfers, and pending matters surface there.
      </p>
      <a href="/officer-directory" className="inline-block mt-4">
        <Button className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white">Open Officer Directory →</Button>
      </a>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className="text-sm text-slate-700 mt-0.5">{value}</div>
    </div>
  );
}

function CRMPage() {
  const [type, setType] = useState<"people" | "orgs" | "citizens" | "officials">("people");
  const [globalSearch, setGlobalSearch] = useState("");
  return (
    <div className="p-6 space-y-5 max-w-[1500px] mx-auto">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0A1F44]">Relationships</h1>
          <p className="text-sm text-slate-500 mt-1">
            Unified CRM — people, organisations, citizens and officials in one searchable graph.
          </p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
          <Input value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} placeholder="Search across all record types…" className="pl-8" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { k: "people", label: "People", count: CONTACTS.length },
          { k: "orgs", label: "Organisations", count: ORGS.length },
          { k: "citizens", label: "Citizens", count: 18420 },
          { k: "officials", label: "Officials", count: 124 },
        ].map(t => (
          <button
            key={t.k}
            onClick={() => setType(t.k as typeof type)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              type === t.k ? "bg-[#0A1F44] text-white border-[#0A1F44]" : "bg-white text-[#0A1F44] border-slate-200 hover:bg-slate-50"
            }`}
          >
            {t.label} <span className={`ml-1.5 text-[10px] ${type === t.k ? "text-white/70" : "text-slate-400"}`}>{t.count.toLocaleString()}</span>
          </button>
        ))}
      </div>

      {type === "people" && <PeopleTab />}
      {type === "orgs" && <OrganisationsTab />}
      {type === "citizens" && <CitizensTab />}
      {type === "officials" && <OfficialsTab />}
    </div>
  );
}

