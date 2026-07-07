import { useMemo, useState } from "react";
import {
  Rss, Radio, Newspaper, Globe2, MapPin, Building2, Languages, Target,
  Plus, RefreshCw, Pause, Play, Edit, Trash2, AlertTriangle, CheckCircle2,
  X, Sparkles, Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

type SourceStatus = "Connected" | "Not Connected" | "Error" | "Paused";
type Bucket = "Local" | "State" | "National" | "Department" | "Hyperlocal";

interface MediaSource {
  id: string;
  name: string;
  type: "Newspaper" | "TV" | "Digital" | "Hyperlocal" | "Blog" | "Government";
  geography: "City" | "State" | "National";
  language: string;
  rss: string;
  tier: "Tier 1" | "Tier 2" | "Tier 3" | "Watchlist";
  relevance: "High" | "Medium" | "Low";
  recommendedFor: string[];
  lastSync: string;
  status: SourceStatus;
  bucket: Bucket;
}

const INITIAL_SOURCES: MediaSource[] = [
  { id: "toi-blr", name: "Times of India Bengaluru", type: "Newspaper", geography: "City", language: "English", rss: "https://timesofindia.indiatimes.com/rssfeeds/-2128833038.cms", tier: "Tier 1", relevance: "High", recommendedFor: ["Civic", "Traffic", "Water"], lastSync: "6 min ago", status: "Connected", bucket: "Local" },
  { id: "hindu-blr", name: "The Hindu Bengaluru", type: "Newspaper", geography: "City", language: "English", rss: "https://www.thehindu.com/news/cities/bangalore/feeder/default.rss", tier: "Tier 1", relevance: "High", recommendedFor: ["Governance", "Civic"], lastSync: "12 min ago", status: "Connected", bucket: "Local" },
  { id: "ie-blr", name: "Indian Express Bengaluru", type: "Newspaper", geography: "City", language: "English", rss: "https://indianexpress.com/section/cities/bangalore/feed/", tier: "Tier 1", relevance: "High", recommendedFor: ["Politics", "Civic"], lastSync: "—", status: "Not Connected", bucket: "Local" },
  { id: "bm", name: "Bangalore Mirror", type: "Digital", geography: "City", language: "English", rss: "https://bangaloremirror.indiatimes.com/rss.cms", tier: "Tier 2", relevance: "Medium", recommendedFor: ["Civic", "Hyperlocal"], lastSync: "—", status: "Not Connected", bucket: "Local" },
  { id: "dh", name: "Deccan Herald", type: "Newspaper", geography: "State", language: "English", rss: "https://www.deccanherald.com/rss-feeds/karnataka-news-rss-feed", tier: "Tier 1", relevance: "High", recommendedFor: ["State", "Politics"], lastSync: "3 min ago", status: "Connected", bucket: "State" },
  { id: "praja", name: "Prajavani", type: "Newspaper", geography: "State", language: "Kannada", rss: "https://www.prajavani.net/rss.xml", tier: "Tier 1", relevance: "High", recommendedFor: ["State", "Party"], lastSync: "9 min ago", status: "Connected", bucket: "State" },
  { id: "vk", name: "Vijay Karnataka", type: "Newspaper", geography: "State", language: "Kannada", rss: "https://vijaykarnataka.com/rssfeedsdefault.cms", tier: "Tier 1", relevance: "High", recommendedFor: ["State", "Regional"], lastSync: "—", status: "Error", bucket: "State" },
  { id: "ptv", name: "Public TV Karnataka", type: "TV", geography: "State", language: "Kannada", rss: "https://publictv.in/feed/", tier: "Tier 2", relevance: "Medium", recommendedFor: ["Crisis", "Regional TV"], lastSync: "—", status: "Not Connected", bucket: "State" },
  { id: "n18k", name: "News18 Kannada", type: "TV", geography: "State", language: "Kannada", rss: "https://kannada.news18.com/rss/karnataka.xml", tier: "Tier 2", relevance: "Medium", recommendedFor: ["Regional TV"], lastSync: "—", status: "Paused", bucket: "State" },
  { id: "etgov", name: "Economic Times Government", type: "Digital", geography: "National", language: "English", rss: "https://government.economictimes.indiatimes.com/rss/topstories", tier: "Tier 1", relevance: "Medium", recommendedFor: ["Governance", "Budget"], lastSync: "1 hr ago", status: "Connected", bucket: "National" },
  { id: "pib", name: "PIB India", type: "Government", geography: "National", language: "English", rss: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3", tier: "Tier 1", relevance: "High", recommendedFor: ["Parliament", "Policy"], lastSync: "22 min ago", status: "Connected", bucket: "National" },
  { id: "kgov", name: "Karnataka Government News", type: "Government", geography: "State", language: "English", rss: "https://karnataka.gov.in/rss", tier: "Tier 1", relevance: "High", recommendedFor: ["Governance", "Schemes"], lastSync: "—", status: "Not Connected", bucket: "Department" },
  { id: "bbmp", name: "BBMP Updates", type: "Government", geography: "City", language: "English", rss: "https://bbmp.gov.in/rss", tier: "Tier 1", relevance: "High", recommendedFor: ["Civic", "Garbage", "Roads"], lastSync: "18 min ago", status: "Connected", bucket: "Department" },
  { id: "bwssb", name: "BWSSB Updates", type: "Government", geography: "City", language: "English", rss: "https://bwssb.karnataka.gov.in/rss", tier: "Tier 1", relevance: "High", recommendedFor: ["Water"], lastSync: "—", status: "Error", bucket: "Department" },
  { id: "bmrcl", name: "BMRCL Updates", type: "Government", geography: "City", language: "English", rss: "https://bmrc.co.in/rss", tier: "Tier 1", relevance: "High", recommendedFor: ["Metro", "Transport"], lastSync: "34 min ago", status: "Connected", bucket: "Department" },
  { id: "citizen-matters", name: "Citizen Matters Bengaluru", type: "Hyperlocal", geography: "City", language: "English", rss: "https://bengaluru.citizenmatters.in/feed", tier: "Tier 2", relevance: "High", recommendedFor: ["Hyperlocal", "Civic"], lastSync: "—", status: "Not Connected", bucket: "Hyperlocal" },
  { id: "whitefield-rising", name: "Whitefield Rising Blog", type: "Blog", geography: "City", language: "English", rss: "https://whitefieldrising.org/feed", tier: "Tier 3", relevance: "Medium", recommendedFor: ["Whitefield", "RWA"], lastSync: "—", status: "Not Connected", bucket: "Hyperlocal" },
];

const ASPIRATIONS = [
  "Constituency First", "City Focus", "State Leadership", "National Visibility",
  "Ministerial Governance", "Party Positioning", "Crisis Response",
  "Development Showcase", "Public Grievance Monitoring",
];

const TOPICS = [
  "Water Supply", "Drainage & Flooding", "Roads & Potholes", "Traffic & Transport",
  "Metro / Rail / Bus", "Health & Hospitals", "Education", "Jobs & Employment",
  "Law & Order", "Women Safety", "Environment & Lakes", "Garbage & Sanitation",
  "Housing", "Slums & Urban Poor", "Farmer Issues", "Industry & Startups",
  "Civic Administration", "Government Schemes", "Budget & Funds",
  "Corruption / Tender Issues", "Opposition Statements", "Party News",
  "Parliament / Assembly Matters",
];

const DEFAULT_KEYWORDS: Record<string, string[]> = {
  "Water Supply": ["Cauvery", "BWSSB", "tanker", "water rationing", "borewell", "water contamination"],
  "Traffic & Transport": ["ORR", "Silk Board", "BMTC", "metro delay", "last-mile shuttle", "flyover", "congestion"],
  "Roads & Potholes": ["pothole", "BBMP road", "asphalting", "road caving"],
  "Metro / Rail / Bus": ["Namma Metro", "BMRCL", "Purple Line", "Yellow Line", "suburban rail"],
  "Garbage & Sanitation": ["BBMP garbage", "landfill", "Mavallipura", "waste segregation"],
  "Health & Hospitals": ["Bowring", "Victoria", "PHC", "Ayushman"],
  "Law & Order": ["Bengaluru Police", "commissioner", "FIR"],
  "Environment & Lakes": ["Bellandur lake", "Varthur", "encroachment", "STP"],
};

const LANGS = ["English", "Kannada", "Hindi", "Other"];

function tierClass(t: MediaSource["tier"]) {
  if (t === "Tier 1") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (t === "Tier 2") return "bg-blue-50 text-blue-700 border-blue-200";
  if (t === "Tier 3") return "bg-slate-100 text-slate-700 border-slate-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}
function statusClass(s: SourceStatus) {
  return s === "Connected" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : s === "Not Connected" ? "bg-slate-100 text-slate-600 border-slate-200"
    : s === "Error" ? "bg-rose-50 text-rose-700 border-rose-200"
    : "bg-amber-50 text-amber-700 border-amber-200";
}

export function MediaSourcesTab() {
  // Profile
  const [profile, setProfile] = useState({
    repType: "MP", role: "Lok Sabha MP", constituency: "Bengaluru Central",
    state: "Karnataka", city: "Bengaluru", portfolio: "", partyRole: "",
    aspirationLevel: ["City", "State"] as string[],
    priorityGeography: "Bengaluru Urban + Karnataka",
    languages: ["English", "Kannada", "Hindi"] as string[],
  });

  const [aspirations, setAspirations] = useState<string[]>([
    "City Focus", "State Leadership", "Public Grievance Monitoring", "Development Showcase",
  ]);
  const [topics, setTopics] = useState<string[]>([
    "Water Supply", "Traffic & Transport", "Garbage & Sanitation", "Metro / Rail / Bus", "Civic Administration",
  ]);
  const [keywords, setKeywords] = useState<Record<string, string[]>>(() => {
    const seeded: Record<string, string[]> = {};
    ["Water Supply", "Traffic & Transport", "Garbage & Sanitation", "Metro / Rail / Bus"].forEach((t) => {
      seeded[t] = DEFAULT_KEYWORDS[t] ?? [];
    });
    return seeded;
  });
  const [newKw, setNewKw] = useState<Record<string, string>>({});

  const [sources, setSources] = useState<MediaSource[]>(INITIAL_SOURCES);
  const [ignored, setIgnored] = useState<string[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<MediaSource | null>(null);

  // Derived stats
  const stats = useMemo(() => {
    const connected = sources.filter(s => s.status === "Connected").length;
    const recommended = sources.filter(s => s.status === "Not Connected" && !ignored.includes(s.id)).length;
    const errors = sources.filter(s => s.status === "Error").length;
    const last = sources.filter(s => s.status === "Connected").map(s => s.lastSync)[0] ?? "—";
    return { connected, recommended, errors, last, topics: topics.length };
  }, [sources, ignored, topics]);

  // Handlers
  const toggleAspiration = (a: string) => {
    setAspirations(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a]);
    toast.success("Media priority updated.");
  };
  const toggleTopic = (t: string) => {
    setTopics(p => {
      const on = p.includes(t);
      if (on) {
        const cp = { ...keywords }; delete cp[t]; setKeywords(cp);
        return p.filter(x => x !== t);
      }
      setKeywords(k => ({ ...k, [t]: k[t] ?? DEFAULT_KEYWORDS[t] ?? [] }));
      return [...p, t];
    });
  };
  const addKw = (t: string) => {
    const v = (newKw[t] ?? "").trim();
    if (!v) return;
    setKeywords(k => ({ ...k, [t]: [...(k[t] ?? []), v] }));
    setNewKw(n => ({ ...n, [t]: "" }));
  };
  const removeKw = (t: string, w: string) => {
    setKeywords(k => ({ ...k, [t]: (k[t] ?? []).filter(x => x !== w) }));
  };

  const updateStatus = (id: string, status: SourceStatus, lastSync?: string) => {
    setSources(list => list.map(s => s.id === id ? { ...s, status, ...(lastSync ? { lastSync } : {}) } : s));
  };

  const buckets: { key: Bucket; label: string; icon: React.ReactNode }[] = [
    { key: "Local", label: "Local / City", icon: <MapPin className="h-3.5 w-3.5" /> },
    { key: "State", label: "State", icon: <Globe2 className="h-3.5 w-3.5" /> },
    { key: "National", label: "National", icon: <Radio className="h-3.5 w-3.5" /> },
    { key: "Department", label: "Department-Specific", icon: <Building2 className="h-3.5 w-3.5" /> },
    { key: "Hyperlocal", label: "Hyperlocal", icon: <Target className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="space-y-5">
      {/* Summary bar */}
      <Card className="border-slate-200 bg-gradient-to-r from-[#0A1F44] to-[#0A1F44]/90 text-white">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <Stat icon={<Rss className="h-4 w-4" />} label="Sources Connected" value={String(stats.connected)} />
            <Stat icon={<Sparkles className="h-4 w-4" />} label="Recommended" value={String(stats.recommended)} />
            <Stat icon={<AlertTriangle className="h-4 w-4" />} label="Feed Errors" value={String(stats.errors)} />
            <Stat icon={<RefreshCw className="h-4 w-4" />} label="Last Sync" value={stats.last} />
            <Stat icon={<Target className="h-4 w-4" />} label="Topics Monitored" value={String(stats.topics)} />
          </div>
          <Button size="sm" className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white gap-2" onClick={() => setAddOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> Add Media Source
          </Button>
        </CardContent>
      </Card>

      {/* 1. Profile */}
      <Card className="border-slate-200">
        <CardHeader><CardTitle className="text-[#0A1F44] text-base">Public Representative Profile</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Representative Type">
            <Select value={profile.repType} onValueChange={(v) => setProfile(p => ({ ...p, repType: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["MP", "MLA", "Minister", "Mayor", "Party Office Bearer"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Current Role">
            <Select value={profile.role} onValueChange={(v) => setProfile(p => ({ ...p, role: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Lok Sabha MP", "Rajya Sabha MP", "MLA", "Minister", "Party Leader"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Constituency / Jurisdiction">
            <Input value={profile.constituency} onChange={e => setProfile(p => ({ ...p, constituency: e.target.value }))} />
          </Field>
          <Field label="State"><Input value={profile.state} onChange={e => setProfile(p => ({ ...p, state: e.target.value }))} /></Field>
          <Field label="City"><Input value={profile.city} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} /></Field>
          <Field label="Ministerial Portfolio"><Input placeholder="e.g. Urban Development" value={profile.portfolio} onChange={e => setProfile(p => ({ ...p, portfolio: e.target.value }))} /></Field>
          <Field label="Party Role"><Input placeholder="e.g. State Vice-President" value={profile.partyRole} onChange={e => setProfile(p => ({ ...p, partyRole: e.target.value }))} /></Field>
          <Field label="Priority Geography"><Input value={profile.priorityGeography} onChange={e => setProfile(p => ({ ...p, priorityGeography: e.target.value }))} /></Field>
          <Field label="Aspiration Level">
            <ChipGroup options={["Constituency", "City", "State", "National"]}
              selected={profile.aspirationLevel}
              onToggle={(x) => setProfile(p => ({ ...p, aspirationLevel: p.aspirationLevel.includes(x) ? p.aspirationLevel.filter(y => y !== x) : [...p.aspirationLevel, x] }))} />
          </Field>
          <Field label="Preferred Languages">
            <ChipGroup options={LANGS} selected={profile.languages}
              onToggle={(x) => setProfile(p => ({ ...p, languages: p.languages.includes(x) ? p.languages.filter(y => y !== x) : [...p.languages, x] }))} />
          </Field>
          <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
            <Button className="bg-[#0A1F44] hover:bg-[#0A1F44]/90" onClick={() => toast.success("Profile saved")}>Save Profile</Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. Aspirations */}
      <Card className="border-slate-200">
        <CardHeader><CardTitle className="text-[#0A1F44] text-base">Political Aspiration & Media Priority</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {ASPIRATIONS.map(a => {
              const on = aspirations.includes(a);
              return (
                <button key={a} onClick={() => toggleAspiration(a)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${on ? "bg-[#FF9933] text-white border-[#FF9933]" : "bg-white text-slate-700 border-slate-200 hover:border-[#FF9933]/50"}`}>
                  {a}
                </button>
              );
            })}
          </div>
          <div className="flex items-start gap-2 rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600">
            <Info className="h-4 w-4 text-[#0A1F44] shrink-0 mt-0.5" />
            <p>Citizen Pulse uses these priorities to recommend news sources, rank media coverage, detect action-needed items, and decide which stories should appear in Daily Briefing.</p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Areas of Interest */}
      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[#0A1F44] text-base">Areas of Interest</CardTitle>
          <Button size="sm" variant="outline" onClick={() => toast.success("Interests saved")}>Save Interests</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {TOPICS.map(t => {
              const on = topics.includes(t);
              return (
                <button key={t} onClick={() => toggleTopic(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${on ? "bg-[#0A1F44] text-white border-[#0A1F44]" : "bg-white text-slate-700 border-slate-200 hover:border-[#0A1F44]/40"}`}>
                  {t}
                </button>
              );
            })}
          </div>
          {topics.length > 0 && (
            <div className="space-y-3">
              {topics.map(t => (
                <div key={t} className="rounded-lg border border-slate-200 p-3 bg-slate-50/40">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-[#0A1F44]">{t}</p>
                    <span className="text-[10px] uppercase text-slate-500">{(keywords[t] ?? []).length} keywords</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(keywords[t] ?? []).map(w => (
                      <span key={w} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-slate-200 text-xs text-slate-700">
                        {w}
                        <button onClick={() => removeKw(t, w)} className="text-slate-400 hover:text-rose-600"><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                    {(keywords[t] ?? []).length === 0 && <span className="text-xs text-slate-400">No keywords yet</span>}
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Add keyword…" value={newKw[t] ?? ""}
                      onChange={e => setNewKw(n => ({ ...n, [t]: e.target.value }))}
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addKw(t); } }}
                      className="h-8 text-sm" />
                    <Button size="sm" variant="outline" onClick={() => addKw(t)}><Plus className="h-3.5 w-3.5 mr-1" /> Add Keyword</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Recommended Sources */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-[#0A1F44] text-base flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-[#FF9933]" /> Recommended Media Sources
          </CardTitle>
          <p className="text-xs text-slate-500 mt-1">Ranked from your profile, aspirations, languages and areas of interest.</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Local">
            <TabsList className="flex-wrap">
              {buckets.map(b => (
                <TabsTrigger key={b.key} value={b.key} className="gap-1.5">{b.icon}{b.label}</TabsTrigger>
              ))}
            </TabsList>
            {buckets.map(b => (
              <TabsContent key={b.key} value={b.key} className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {sources.filter(s => s.bucket === b.key && !ignored.includes(s.id)).map(s => (
                    <SourceCard key={s.id} src={s}
                      onConnect={() => { updateStatus(s.id, "Connected", "Just now"); toast.success(`${s.name} connected`); }}
                      onIgnore={() => { setIgnored(x => [...x, s.id]); toast(`${s.name} ignored`); }}
                      onSync={() => { updateStatus(s.id, "Connected", "Just now"); toast.success(`${s.name} synced`); }}
                      onPause={() => { updateStatus(s.id, "Paused"); toast(`${s.name} paused`); }}
                      onResume={() => { updateStatus(s.id, "Connected", "Just now"); toast.success(`${s.name} resumed`); }}
                      onRemove={() => { setSources(l => l.filter(x => x.id !== s.id)); toast(`${s.name} removed`); }}
                      onEdit={() => setEditing(s)}
                      onFix={() => setEditing(s)}
                      onRetry={() => { updateStatus(s.id, "Connected", "Just now"); toast.success(`${s.name} sync recovered`); }}
                    />
                  ))}
                  {sources.filter(s => s.bucket === b.key && !ignored.includes(s.id)).length === 0 && (
                    <div className="col-span-full text-center text-sm text-slate-500 py-8">No sources in this bucket.</div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddSourceDialog open={addOpen} onOpenChange={setAddOpen} onAdd={(src) => {
        setSources(list => [src, ...list]);
        toast.success("Media source added successfully.");
      }} />
      <EditSourceDialog source={editing} onOpenChange={() => setEditing(null)} onSave={(patch) => {
        if (!editing) return;
        setSources(list => list.map(s => s.id === editing.id ? { ...s, ...patch, status: s.status === "Error" ? "Connected" : s.status, lastSync: s.status === "Error" ? "Just now" : s.lastSync } : s));
        setEditing(null);
        toast.success("Source updated");
      }} />
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-9 w-9 rounded-lg bg-[#FF9933]/20 text-[#FF9933] flex items-center justify-center">{icon}</div>
      <div><div className="text-[10px] uppercase opacity-60">{label}</div><div className="text-base font-bold">{value}</div></div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase text-slate-500 tracking-wide">{label}</Label>
      {children}
    </div>
  );
}

function ChipGroup({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(o => {
        const on = selected.includes(o);
        return (
          <button key={o} type="button" onClick={() => onToggle(o)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${on ? "bg-[#0A1F44] text-white border-[#0A1F44]" : "bg-white text-slate-700 border-slate-200 hover:border-[#0A1F44]/40"}`}>
            {o}
          </button>
        );
      })}
    </div>
  );
}

function SourceCard({ src, onConnect, onIgnore, onSync, onPause, onResume, onRemove, onEdit, onFix, onRetry }: {
  src: MediaSource;
  onConnect: () => void; onIgnore: () => void; onSync: () => void; onPause: () => void; onResume: () => void;
  onRemove: () => void; onEdit: () => void; onFix: () => void; onRetry: () => void;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-3 bg-white flex flex-col gap-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-[#0A1F44] truncate">{src.name}</p>
            <Badge variant="outline" className={`text-[10px] ${tierClass(src.tier)}`}>{src.tier}</Badge>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
            <span>{src.type}</span> · <span>{src.geography}</span> · <span className="flex items-center gap-0.5"><Languages className="h-3 w-3" />{src.language}</span>
          </p>
        </div>
        <Badge variant="outline" className={`text-[10px] shrink-0 ${statusClass(src.status)}`}>
          {src.status === "Connected" && <CheckCircle2 className="h-3 w-3 mr-1" />}
          {src.status === "Error" && <AlertTriangle className="h-3 w-3 mr-1" />}
          {src.status}
        </Badge>
      </div>
      <div className="text-[11px] font-mono text-slate-500 truncate bg-slate-50 rounded px-2 py-1">{src.rss}</div>
      <div className="flex flex-wrap gap-1">
        {src.recommendedFor.map(r => <span key={r} className="text-[10px] px-1.5 py-0.5 rounded bg-[#0A1F44]/5 text-[#0A1F44]">{r}</span>)}
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Relevance: {src.relevance}</span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span>Last sync: <span className="text-slate-700 font-medium">{src.lastSync}</span></span>
      </div>
      <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
        {src.status === "Not Connected" && (<>
          <Button size="sm" className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white h-7" onClick={onConnect}><Plus className="h-3 w-3 mr-1" />Connect RSS Feed</Button>
          <Button size="sm" variant="ghost" className="h-7" onClick={onIgnore}>Ignore</Button>
        </>)}
        {src.status === "Connected" && (<>
          <Button size="sm" variant="outline" className="h-7" onClick={onSync}><RefreshCw className="h-3 w-3 mr-1" />Sync Now</Button>
          <Button size="sm" variant="outline" className="h-7" onClick={onPause}><Pause className="h-3 w-3 mr-1" />Pause</Button>
          <Button size="sm" variant="outline" className="h-7" onClick={onEdit}><Edit className="h-3 w-3 mr-1" />Edit</Button>
          <Button size="sm" variant="ghost" className="h-7 text-rose-600" onClick={onRemove}><Trash2 className="h-3 w-3" /></Button>
        </>)}
        {src.status === "Error" && (<>
          <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white h-7" onClick={onFix}>Fix Feed</Button>
          <Button size="sm" variant="outline" className="h-7" onClick={onRetry}><RefreshCw className="h-3 w-3 mr-1" />Retry</Button>
          <Button size="sm" variant="ghost" className="h-7 text-rose-600" onClick={onRemove}><Trash2 className="h-3 w-3" /></Button>
        </>)}
        {src.status === "Paused" && (<>
          <Button size="sm" className="bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white h-7" onClick={onResume}><Play className="h-3 w-3 mr-1" />Resume</Button>
          <Button size="sm" variant="outline" className="h-7" onClick={onEdit}><Edit className="h-3 w-3 mr-1" />Edit</Button>
          <Button size="sm" variant="ghost" className="h-7 text-rose-600" onClick={onRemove}><Trash2 className="h-3 w-3" /></Button>
        </>)}
      </div>
    </div>
  );
}

function AddSourceDialog({ open, onOpenChange, onAdd }: { open: boolean; onOpenChange: (v: boolean) => void; onAdd: (s: MediaSource) => void }) {
  const [form, setForm] = useState({
    name: "", website: "", rss: "", type: "Digital", geography: "City",
    language: "English", priority: "Medium", topics: "", tier: "Tier 2",
    frequency: "Every 15 min", notes: "",
  });
  const submit = () => {
    if (!form.name.trim() || !form.rss.trim()) { toast.error("Name and RSS URL are required"); return; }
    onAdd({
      id: `custom-${Date.now()}`, name: form.name, type: form.type as MediaSource["type"],
      geography: form.geography as MediaSource["geography"], language: form.language,
      rss: form.rss, tier: form.tier as MediaSource["tier"],
      relevance: form.priority as MediaSource["relevance"],
      recommendedFor: form.topics.split(",").map(s => s.trim()).filter(Boolean),
      lastSync: "Just now", status: "Connected", bucket: "Local",
    });
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Add Media Source</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Source Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div><Label>Website URL</Label><Input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} /></div>
          <div className="col-span-2"><Label>RSS Feed URL</Label><Input value={form.rss} onChange={e => setForm(f => ({ ...f, rss: e.target.value }))} /></div>
          <div><Label>Source Type</Label>
            <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Newspaper", "TV", "Digital", "Hyperlocal", "Blog", "Government"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Geography</Label>
            <Select value={form.geography} onValueChange={v => setForm(f => ({ ...f, geography: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["City", "State", "National"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Language</Label>
            <Select value={form.language} onValueChange={v => setForm(f => ({ ...f, language: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{LANGS.map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Priority</Label>
            <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["High", "Medium", "Low"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="col-span-2"><Label>Topic Mapping (comma-separated)</Label><Input placeholder="Water, Traffic, Civic" value={form.topics} onChange={e => setForm(f => ({ ...f, topics: e.target.value }))} /></div>
          <div><Label>Credibility Tier</Label>
            <Select value={form.tier} onValueChange={v => setForm(f => ({ ...f, tier: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Tier 1", "Tier 2", "Tier 3", "Watchlist"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Monitoring Frequency</Label>
            <Select value={form.frequency} onValueChange={v => setForm(f => ({ ...f, frequency: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Every 5 min", "Every 15 min", "Hourly", "Every 6 hours", "Daily"].map(x => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="col-span-2"><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} className="bg-[#0A1F44] hover:bg-[#0A1F44]/90">Add Source</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditSourceDialog({ source, onOpenChange, onSave }: { source: MediaSource | null; onOpenChange: () => void; onSave: (patch: Partial<MediaSource>) => void }) {
  const [name, setName] = useState(source?.name ?? "");
  const [rss, setRss] = useState(source?.rss ?? "");
  // Sync when source changes
  if (source && (name !== source.name && rss === "" )) { /* noop */ }
  return (
    <Dialog open={!!source} onOpenChange={(v) => !v && onOpenChange()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Media Source</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Source Name</Label><Input defaultValue={source?.name} onChange={e => setName(e.target.value)} /></div>
          <div><Label>RSS Feed URL</Label><Input defaultValue={source?.rss} onChange={e => setRss(e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onOpenChange}>Cancel</Button>
          <Button className="bg-[#0A1F44] hover:bg-[#0A1F44]/90" onClick={() => onSave({ name: name || source?.name, rss: rss || source?.rss })}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
