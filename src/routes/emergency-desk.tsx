import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Siren,
  Flame,
  Droplets,
  CarFront,
  Shield,
  HeartPulse,
  Skull,
  CloudRain,
  Building,
  Megaphone,
  Users,
  MapPin,
  Phone,
  AlertTriangle,
  Plus,
  Clock,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/emergency-desk")({
  head: () => ({ meta: [{ title: "Emergency Desk — Citizen Pulse" }] }),
  component: EmergencyDeskPage,
});

interface Incident {
  id: string;
  type: string;
  icon: typeof Flame;
  location: string;
  caller: string;
  affected: string;
  authority: string;
  status: { police?: boolean; ambulance?: boolean; fire?: boolean; health?: boolean };
  mpInformed: boolean;
  mediaSensitive: boolean;
  update: string;
  loggedAgo: string;
  resolved?: boolean;
}

const INCIDENTS: Incident[] = [
  {
    id: "E-0094",
    type: "Fire",
    icon: Flame,
    location: "Scrap godown, ITPL Gate 2, Whitefield",
    caller: "Anonymous — WhatsApp",
    affected: "~30 shop workers evacuated, no casualties reported",
    authority: "Fire Stn. Whitefield (4 tenders dispatched 09:14)",
    status: { fire: true, police: true, ambulance: true },
    mpInformed: true,
    mediaSensitive: true,
    update: "09:42 — Fire 60% contained. Traffic diverted via Hope Farm jn.",
    loggedAgo: "28 min",
  },
  {
    id: "E-0093",
    type: "Medical / Hospital bed",
    icon: HeartPulse,
    location: "Bowring Hospital, Shivajinagar",
    caller: "Mr. Imran (family) — Call",
    affected: "1 patient — cardiac, ICU bed needed",
    authority: "Sup. Dr. Shankar; cross-referral to Jayadeva initiated",
    status: { ambulance: true, health: true },
    mpInformed: true,
    mediaSensitive: false,
    update: "09:38 — Jayadeva confirmed bed. Ambulance ETA 12 min.",
    loggedAgo: "44 min",
  },
  {
    id: "E-0092",
    type: "Flooding",
    icon: Droplets,
    location: "Hongasandra underpass, Bommanahalli",
    caller: "Suresh (RWA) — WhatsApp",
    affected: "4 ft water, 2 stranded vehicles, 6 households cut off",
    authority: "BBMP zonal + Fire dewatering team",
    status: { fire: true, police: true },
    mpInformed: true,
    mediaSensitive: true,
    update: "09:30 — Dewatering pumps engaged. ETA clear: 90 min.",
    loggedAgo: "1 h",
  },
  {
    id: "E-0091",
    type: "Accident",
    icon: CarFront,
    location: "NH-44, Yelahanka flyover ramp",
    caller: "Traffic Police control",
    affected: "2 vehicles, 3 injured (stable)",
    authority: "Traffic + 108 ambulance",
    status: { police: true, ambulance: true },
    mpInformed: false,
    mediaSensitive: false,
    update: "08:52 — Cleared. All 3 admitted to Columbia Asia.",
    loggedAgo: "2 h",
    resolved: true,
  },
  {
    id: "E-0090",
    type: "Death / condolence",
    icon: Skull,
    location: "Rajajinagar 5th block",
    caller: "Local party karyakarta",
    affected: "Elderly community leader — funeral 16:00",
    authority: "Office Sec. coordinating wreath + MP visit slot",
    status: {},
    mpInformed: true,
    mediaSensitive: false,
    update: "MP visit confirmed 15:30. Statement drafted.",
    loggedAgo: "3 h",
  },
];

const TYPES = [
  { label: "Flooding", icon: Droplets },
  { label: "Fire", icon: Flame },
  { label: "Accident", icon: CarFront },
  { label: "Law & order", icon: Shield },
  { label: "Medical bed", icon: HeartPulse },
  { label: "Death", icon: Skull },
  { label: "Natural disaster", icon: CloudRain },
  { label: "Building collapse", icon: Building },
  { label: "Water crisis", icon: Droplets },
  { label: "Protest", icon: Megaphone },
  { label: "Communal tension", icon: Users },
  { label: "Citizen stuck", icon: Users },
];

function EmergencyDeskPage() {
  const [newOpen, setNewOpen] = useState(false);
  const active = INCIDENTS.filter((i) => !i.resolved);
  const resolved = INCIDENTS.filter((i) => i.resolved);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Urgent banner */}
      <div className="mb-6 rounded-xl border-2 border-red-500 bg-gradient-to-r from-red-600 to-red-700 text-white p-5 shadow-lg">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-white/15 flex items-center justify-center animate-pulse">
              <Siren className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Emergency Desk</h1>
              <p className="text-sm text-white/85 mt-0.5">
                Speed-first urgent workflow — separate from grievances. Every minute counts.
              </p>
            </div>
          </div>
          <Button
            onClick={() => setNewOpen((v) => !v)}
            className="bg-white text-red-700 hover:bg-white/90 font-semibold"
            size="lg"
          >
            <Plus className="h-4 w-4" /> Log incident
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4 border-red-200">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Active incidents</div>
          <div className="text-3xl font-bold mt-1 text-red-600">3</div>
          <div className="text-xs text-muted-foreground mt-1">2 high-severity</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Resolved today</div>
          <div className="text-3xl font-bold mt-1 text-emerald-600">5</div>
          <div className="text-xs text-muted-foreground mt-1">Avg response 22 min</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Media-sensitive</div>
          <div className="text-3xl font-bold mt-1 text-saffron">2</div>
          <div className="text-xs text-muted-foreground mt-1">Press team alerted</div>
        </Card>
      </div>

      {/* Quick log form */}
      {newOpen && (
        <Card className="p-5 mb-6 border-2 border-red-300 bg-red-50/40">
          <h3 className="font-semibold text-navy mb-3">Quick log — incident type</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {TYPES.map((t) => (
              <button
                key={t.label}
                onClick={() => setNewOpen(false)}
                className="rounded-lg border bg-white p-3 text-center hover:border-red-400 hover:bg-red-50 transition-colors"
              >
                <t.icon className="h-5 w-5 mx-auto text-red-600" />
                <div className="text-xs font-medium mt-1.5 text-navy">{t.label}</div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Active incidents */}
      <h2 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">Active</h2>
      <div className="space-y-3 mb-8">
        {active.map((i) => (
          <IncidentCard key={i.id} i={i} />
        ))}
      </div>

      <h2 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">Resolved today</h2>
      <div className="space-y-3">
        {resolved.map((i) => (
          <IncidentCard key={i.id} i={i} />
        ))}
      </div>
    </div>
  );
}

function IncidentCard({ i }: { i: Incident }) {
  return (
    <Card className={cn("p-5 border-l-4", i.resolved ? "border-l-emerald-500 opacity-80" : "border-l-red-500")}>
      <div className="flex items-start gap-4">
        <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0", i.resolved ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
          <i.icon className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-navy">{i.type}</h3>
            <span className="text-xs text-muted-foreground">{i.id}</span>
            {i.resolved ? (
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="h-3 w-3 mr-1" /> Resolved</Badge>
            ) : (
              <Badge className="bg-red-600 text-white">LIVE</Badge>
            )}
            {i.mediaSensitive && (
              <Badge className="bg-saffron/15 text-saffron border border-saffron/40"><Eye className="h-3 w-3 mr-1" /> Media-sensitive</Badge>
            )}
            {i.mpInformed && (
              <Badge variant="outline" className="text-emerald-700 border-emerald-300">MP informed</Badge>
            )}
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1 ml-auto">
              <Clock className="h-3 w-3" /> {i.loggedAgo} ago
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <Field icon={MapPin} label="Location" value={i.location} />
            <Field icon={Phone} label="Caller" value={i.caller} />
            <Field icon={Users} label="People affected" value={i.affected} />
            <Field icon={Shield} label="Authority contacted" value={i.authority} />
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {i.status.police && <StatusPill label="Police" />}
            {i.status.ambulance && <StatusPill label="Ambulance" />}
            {i.status.fire && <StatusPill label="Fire" />}
            {i.status.health && <StatusPill label="Health" />}
          </div>

          <div className="mt-3 rounded-md bg-slate-50 p-3 text-sm">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Latest update</div>
            <div className="text-navy">{i.update}</div>
          </div>

          {!i.resolved && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                <AlertTriangle className="h-3.5 w-3.5" /> Add update
              </Button>
              <Button size="sm" variant="outline">Inform MP</Button>
              <Button size="sm" variant="outline">Brief press</Button>
              <Button size="sm" variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                <CheckCircle2 className="h-3.5 w-3.5" /> Mark resolved
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function Field({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-3.5 w-3.5 text-saffron mt-0.5 shrink-0" />
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm text-foreground">{value}</div>
      </div>
    </div>
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> {label} engaged
    </span>
  );
}
