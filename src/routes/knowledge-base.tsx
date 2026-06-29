import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BookOpen,
  Search,
  Sparkles,
  HandCoins,
  FileText,
  Building2,
  ListChecks,
  TrendingUp,
  MessageSquare,
  Trophy,
  Star,
  Lightbulb,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/knowledge-base")({
  head: () => ({ meta: [{ title: "Knowledge Base — Citizen Pulse" }] }),
  component: KnowledgeBasePage,
});

interface Article {
  title: string;
  summary: string;
  category: string;
  icon: typeof FileText;
  reads: number;
  starred?: boolean;
}

const CATEGORIES = ["All", "How-to", "Schemes", "Departments", "Templates", "Escalations", "Case studies"];

const ARTICLES: Article[] = [
  { title: "How to handle a widow / old-age pension request", category: "Schemes", icon: HandCoins, summary: "Eligibility, documents (Aadhaar + bank + age proof + spouse death cert.), Tahsildar route, typical timeline (28–45 days), follow-up cadence.", reads: 412, starred: true },
  { title: "How to write a formal letter to the Deputy Commissioner", category: "Templates", icon: FileText, summary: "Salutation, subject line, citing previous correspondence, escalation phrasing, CC list (ADC, AC, Tahsildar), enclosure block.", reads: 387 },
  { title: "Which officer handles which ward (Bengaluru East)", category: "Departments", icon: Building2, summary: "Ward-officer map across BBMP, BWSSB, BESCOM, Police (Law & Order vs Traffic), Health (PHCs).", reads: 356, starred: true },
  { title: "Documents required per scheme (PMAY / Ayushman / Ujjwala / Pension)", category: "Schemes", icon: ListChecks, summary: "Master checklist per scheme — including the doc most-rejected-for.", reads: 298 },
  { title: "Department escalation matrix (L1 → L3)", category: "Escalations", icon: TrendingUp, summary: "PWD/BBMP/BWSSB/BESCOM/Revenue: L1 zonal → L2 chief engineer → L3 secretary. Typical days at each tier.", reads: 271 },
  { title: "Standard response templates (WhatsApp / Letter / Press)", category: "Templates", icon: MessageSquare, summary: "Acknowledgement, in-progress, resolved, condolence, festival greetings — in Kannada + English.", reads: 254 },
  { title: "Past successful case — KR Puram drainage 2023", category: "Case studies", icon: Trophy, summary: "How a 90-day BBMP file was closed in 18 days using DC + Chief Engineer simultaneous escalation. Lessons.", reads: 198 },
  { title: "Handling sensitive cases (communal / land / police)", category: "How-to", icon: BookOpen, summary: "Triage, legal opinion first, MP-informed protocol, media containment, when to involve Adv. Vinay.", reads: 176 },
  { title: "Booth volunteer onboarding (in 30 minutes)", category: "How-to", icon: BookOpen, summary: "Account, beat allocation, intake script, escalation contacts, weekly reporting format.", reads: 162 },
  { title: "Quick guide: scheme eligibility (caste, income, age)", category: "Schemes", icon: HandCoins, summary: "Common income & caste thresholds for Karnataka + Central schemes. Updated quarterly.", reads: 144 },
  { title: "How to handle a media query under 30 minutes", category: "How-to", icon: MessageSquare, summary: "Verify reporter, get the question, find precedent statements, two-line + three-line draft, MP sign-off.", reads: 131 },
  { title: "BBMP file movement — who actually moves it", category: "Departments", icon: Building2, summary: "AE → EE → CE → Commissioner. Where files get stuck (usually EE level) and why.", reads: 119 },
];

const catIcon: Record<string, typeof FileText> = {
  "How-to": Lightbulb,
  Schemes: HandCoins,
  Departments: Building2,
  Templates: FileText,
  Escalations: TrendingUp,
  "Case studies": Trophy,
};

function KnowledgeBasePage() {
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");

  const items = useMemo(
    () =>
      ARTICLES.filter((a) => cat === "All" || a.category === cat).filter((a) =>
        query
          ? a.title.toLowerCase().includes(query.toLowerCase()) ||
            a.summary.toLowerCase().includes(query.toLowerCase())
          : true,
      ),
    [cat, query],
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1300px] mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-saffron" />
          <h1 className="text-2xl font-bold tracking-tight text-navy">Knowledge Base</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          The office how-to library. Also surfaces contextually inside Grievances, Letters, Schemes
          and Department Files.
        </p>
      </div>

      <Card className="p-5 mb-6 bg-gradient-to-br from-navy to-navy/90 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-saffron" />
          <h3 className="font-semibold">Ask the office brain</h3>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-white/70" />
          <Input
            className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            placeholder="e.g. 'how to file PMAY for tenant in KR Puram'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="text-xs text-white/70 mt-2">
          Tries the KB first, then surfaces past cases and standard templates.
        </div>
      </Card>

      <div className="flex flex-wrap gap-2 mb-5">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "text-sm px-3 py-1.5 rounded-full border transition-colors",
              cat === c ? "bg-navy text-white border-navy" : "bg-white text-navy border-border hover:bg-slate-50",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((a) => {
          const Cat = catIcon[a.category] ?? BookOpen;
          return (
            <Card key={a.title} className="p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-lg bg-saffron/15 text-saffron flex items-center justify-center">
                  <a.icon className="h-5 w-5" />
                </div>
                {a.starred && <Star className="h-4 w-4 text-saffron fill-saffron" />}
              </div>
              <h3 className="font-semibold text-navy mt-3 leading-snug">{a.title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5 line-clamp-3">{a.summary}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <Badge variant="outline" className="inline-flex items-center gap-1">
                  <Cat className="h-3 w-3" /> {a.category}
                </Badge>
                <span className="text-muted-foreground">{a.reads} reads</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
