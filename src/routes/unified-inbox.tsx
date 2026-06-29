import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Inbox,
  MessageSquare,
  Phone,
  Mail,
  Users,
  Instagram,
  PhoneMissed,
  AlertTriangle,
  Sparkles,
  Search,
  Archive,
  UserPlus,
  FileText,
  Calendar,
  HelpCircle,
  Siren,
  HandCoins,
  Repeat,
  Filter,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/unified-inbox")({
  head: () => ({ meta: [{ title: "Unified Inbox — Citizen Pulse" }] }),
  component: UnifiedInboxPage,
});

type Channel = "WhatsApp" | "Call" | "Email" | "Walk-in" | "Social DM";
type Classification =
  | "Grievance"
  | "Invitation"
  | "Scheme help"
  | "Emergency"
  | "Commitment"
  | "Media query"
  | "Development demand"
  | "Recommendation"
  | "Appreciation"
  | "Spam"
  | "Follow-up"
  | "Duplicate";

interface InboxItem {
  id: string;
  sender: string;
  ward: string;
  channel: Channel;
  snippet: string;
  time: string;
  classification: Classification;
  urgent?: boolean;
  repeat?: boolean;
  voice?: boolean;
}

const ITEMS: InboxItem[] = [
  { id: "M-2841", sender: "Suresh Gowda", ward: "Mahadevapura", channel: "WhatsApp", snippet: "Sir, water tanker has not come to our street for 6 days. KR Puram 4th cross.", time: "2 min", classification: "Grievance", urgent: true, repeat: true },
  { id: "M-2840", sender: "Rotary Club Indiranagar", ward: "CV Raman Nagar", channel: "Email", snippet: "Invitation to inaugurate our blood donation drive on 8 July at 10:30 AM.", time: "12 min", classification: "Invitation" },
  { id: "M-2839", sender: "Lakshmi N.", ward: "Bommanahalli", channel: "Call", snippet: "Voice note: requesting help with widow pension application — documents ready.", time: "21 min", classification: "Scheme help", voice: true },
  { id: "M-2838", sender: "Anonymous", ward: "Whitefield", channel: "WhatsApp", snippet: "Fire at scrap godown near ITPL gate 2. Smoke spreading. Please act.", time: "28 min", classification: "Emergency", urgent: true },
  { id: "M-2837", sender: "Deccan Herald — R. Iyer", ward: "—", channel: "Email", snippet: "Quote request: MP's position on Mahadayi water sharing in Belagavi belt?", time: "44 min", classification: "Media query" },
  { id: "M-2836", sender: "Mahadevapura RWA Federation", ward: "Mahadevapura", channel: "Walk-in", snippet: "Memorandum on stormwater drain encroachments — 14 wards affected.", time: "1 h", classification: "Development demand" },
  { id: "M-2835", sender: "Vikram Shetty", ward: "Hebbal", channel: "WhatsApp", snippet: "Following up sir — you had said you'd speak to BBMP Commissioner about Hebbal flyover potholes.", time: "1 h", classification: "Follow-up", repeat: true },
  { id: "M-2834", sender: "Father Joseph, St. Mary's", ward: "Shivajinagar", channel: "Email", snippet: "Requesting recommendation letter for school's CBSE affiliation renewal.", time: "2 h", classification: "Recommendation" },
  { id: "M-2833", sender: "Praveen K.", ward: "Yelahanka", channel: "Social DM", snippet: "Thank you sir, the streetlights on 5th main were fixed within 4 days. 🙏", time: "2 h", classification: "Appreciation" },
  { id: "M-2832", sender: "+91 98xxxx 4421", ward: "—", channel: "WhatsApp", snippet: "Forwarded chain message about freebies — no action needed.", time: "3 h", classification: "Spam" },
  { id: "M-2831", sender: "Mr. Rangaswamy", ward: "Rajajinagar", channel: "Call", snippet: "Call summary: assured by MP at Sangha meet to write to DC re: temple land dispute.", time: "3 h", classification: "Commitment" },
  { id: "M-2830", sender: "Geetha Bai", ward: "Bommanahalli", channel: "WhatsApp", snippet: "Same complaint as M-2825 — drainage overflow Hongasandra 9th cross.", time: "4 h", classification: "Duplicate" },
];

const MISSED = [
  { number: "+91 98453 11290", name: "Anitha (PHC Hebbal)", attempts: 3, last: "08:42", urgent: true },
  { number: "+91 99000 47731", name: "Unknown — Yelahanka", attempts: 2, last: "08:11" },
  { number: "+91 80505 11876", name: "Ramesh contractor", attempts: 1, last: "07:55" },
];

const channelIcon: Record<Channel, typeof MessageSquare> = {
  WhatsApp: MessageSquare,
  Call: Phone,
  Email: Mail,
  "Walk-in": Users,
  "Social DM": Instagram,
};

const classColor: Record<Classification, string> = {
  Grievance: "bg-red-50 text-red-700 border-red-200",
  Invitation: "bg-amber-50 text-amber-800 border-amber-200",
  "Scheme help": "bg-emerald-50 text-emerald-700 border-emerald-200",
  Emergency: "bg-red-600 text-white border-red-700",
  Commitment: "bg-saffron/15 text-saffron border-saffron/40",
  "Media query": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Development demand": "bg-blue-50 text-blue-700 border-blue-200",
  Recommendation: "bg-purple-50 text-purple-700 border-purple-200",
  Appreciation: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Spam: "bg-slate-100 text-slate-500 border-slate-200",
  "Follow-up": "bg-yellow-50 text-yellow-800 border-yellow-200",
  Duplicate: "bg-slate-100 text-slate-600 border-slate-200",
};

const ACTIONS: Record<Classification, { label: string; icon: typeof FileText }[]> = {
  Grievance: [{ label: "Create Case", icon: FileText }, { label: "Assign Staff", icon: UserPlus }],
  Invitation: [{ label: "Create Event", icon: Calendar }, { label: "Delegate", icon: UserPlus }],
  "Scheme help": [{ label: "Scheme Assist", icon: HandCoins }, { label: "Assign Staff", icon: UserPlus }],
  Emergency: [{ label: "Escalate", icon: Siren }, { label: "Create Case", icon: FileText }],
  Commitment: [{ label: "Log Commitment", icon: FileText }],
  "Media query": [{ label: "Create Letter", icon: FileText }, { label: "Assign Staff", icon: UserPlus }],
  "Development demand": [{ label: "Add to Demand Bank", icon: FileText }],
  Recommendation: [{ label: "Create Letter", icon: FileText }],
  Appreciation: [{ label: "Archive", icon: Archive }],
  Spam: [{ label: "Archive", icon: Archive }],
  "Follow-up": [{ label: "Ask for details", icon: HelpCircle }, { label: "Assign Staff", icon: UserPlus }],
  Duplicate: [{ label: "Archive", icon: Archive }],
};

const CHANNELS: Channel[] = ["WhatsApp", "Call", "Email", "Walk-in", "Social DM"];

function UnifiedInboxPage() {
  const [filter, setFilter] = useState<Channel | "All">("All");
  const [query, setQuery] = useState("");
  const [archived, setArchived] = useState<Set<string>>(new Set());

  const items = useMemo(
    () =>
      ITEMS.filter((i) => !archived.has(i.id))
        .filter((i) => filter === "All" || i.channel === filter)
        .filter((i) =>
          query
            ? i.sender.toLowerCase().includes(query.toLowerCase()) ||
              i.snippet.toLowerCase().includes(query.toLowerCase())
            : true,
        ),
    [filter, query, archived],
  );

  const act = (id: string, label: string) => {
    setArchived((s) => new Set(s).add(id));
    toast.success(`${label} — routed`, { description: `Item ${id} moved to the right module.` });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1500px] mx-auto">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Inbox className="h-5 w-5 text-saffron" />
            <h1 className="text-2xl font-bold tracking-tight text-navy">Unified Inbox</h1>
            <Badge className="bg-saffron/15 text-saffron border border-saffron/40 ml-2">The spine</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Every signal across every channel — auto-classified, one action away from the right module.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sender or message…"
              className="pl-8 w-72"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm"><Filter className="h-4 w-4" /> Advanced</Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Unprocessed", value: "47", icon: Inbox, accent: "text-navy" },
          { label: "Auto-classified", value: "92%", icon: Sparkles, accent: "text-emerald-600" },
          { label: "Urgent flagged", value: "6", icon: AlertTriangle, accent: "text-red-600" },
          { label: "Repeat senders", value: "14", icon: Repeat, accent: "text-saffron" },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <div className={cn("text-2xl font-bold mt-1", s.accent)}>{s.value}</div>
              </div>
              <s.icon className={cn("h-5 w-5", s.accent)} />
            </div>
          </Card>
        ))}
      </div>

      {/* Channel chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(["All", ...CHANNELS] as const).map((c) => {
          const Icon = c === "All" ? Inbox : channelIcon[c];
          const active = filter === c;
          return (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors",
                active
                  ? "bg-navy text-white border-navy"
                  : "bg-white text-navy border-border hover:bg-slate-50",
              )}
            >
              <Icon className="h-3.5 w-3.5" /> {c}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stream */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((i) => {
            const Icon = channelIcon[i.channel];
            return (
              <Card key={i.id} className={cn("p-4", i.urgent && "border-l-4 border-l-red-500")}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Icon className="h-4 w-4 text-navy" />
                      <span className="font-semibold text-sm text-navy">{i.sender}</span>
                      {i.ward !== "—" && (
                        <span className="text-xs text-muted-foreground">· {i.ward}</span>
                      )}
                      <span className="text-xs text-muted-foreground">· {i.time} ago</span>
                      {i.repeat && (
                        <Badge variant="outline" className="text-[10px] h-5 border-saffron/40 text-saffron">
                          <Repeat className="h-3 w-3 mr-1" /> Repeat
                        </Badge>
                      )}
                      {i.urgent && (
                        <Badge className="text-[10px] h-5 bg-red-600 text-white border-red-700">
                          URGENT
                        </Badge>
                      )}
                      {i.voice && (
                        <Badge variant="outline" className="text-[10px] h-5">🎙 Voice note</Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground mt-1.5 line-clamp-2">{i.snippet}</p>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border",
                          classColor[i.classification],
                        )}
                      >
                        <Sparkles className="h-3 w-3" /> {i.classification}
                      </span>
                      <span className="text-[10px] text-muted-foreground">AI-classified · {i.id}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ACTIONS[i.classification].map((a) => (
                    <Button
                      key={a.label}
                      size="sm"
                      variant={a.label === "Escalate" ? "destructive" : "outline"}
                      onClick={() => act(i.id, a.label)}
                    >
                      <a.icon className="h-3.5 w-3.5" /> {a.label}
                    </Button>
                  ))}
                  <Button size="sm" variant="ghost" onClick={() => act(i.id, "Archived")}>
                    <Archive className="h-3.5 w-3.5" /> Archive
                  </Button>
                </div>
              </Card>
            );
          })}
          {items.length === 0 && (
            <Card className="p-10 text-center text-muted-foreground border-dashed">
              Inbox zero — every signal has been routed.
            </Card>
          )}
        </div>

        {/* Sidebar — Missed Calls */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <PhoneMissed className="h-4 w-4 text-red-600" />
                <h3 className="font-semibold text-sm text-navy">Missed Calls</h3>
              </div>
              <Badge className="bg-red-50 text-red-700 border border-red-200">9</Badge>
            </div>
            <ul className="space-y-3">
              {MISSED.map((m) => (
                <li key={m.number} className="text-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-navy">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.number}</div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          m.attempts >= 3 && "border-red-300 text-red-700 bg-red-50",
                        )}
                      >
                        {m.attempts}× tries
                      </Badge>
                      <div className="text-[10px] text-muted-foreground mt-1">{m.last}</div>
                    </div>
                  </div>
                  {m.urgent && (
                    <div className="mt-1.5 text-[11px] text-red-700 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Repeat caller — likely urgent
                    </div>
                  )}
                  <div className="mt-2 flex gap-1.5">
                    <Button size="sm" variant="outline" className="h-7 text-xs">Call back</Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">Assign PA</Button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-4 bg-navy text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-saffron" />
              <h3 className="font-semibold text-sm">AI suggestion</h3>
            </div>
            <p className="text-xs text-white/80">
              3 messages mention "KR Puram water" in 24 hours. Consider creating a cluster case and a
              broadcast update.
            </p>
            <Button size="sm" className="mt-3 bg-saffron text-navy hover:bg-saffron/90">
              Create cluster
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
