import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertTriangle, ExternalLink, Flame, TrendingUp, X, Hash, Shield, Rss,
  RefreshCw, Pause, Play, Trash2, Wrench, CheckCircle2, Clock, Users,
  Repeat, Newspaper, MessageSquare, Send, ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { PressDeskPanel, MediaOutreachPanel, DraftMediaResponseDialog, LinkedRecordBadges, type DraftSeed } from "@/components/press-desk-workflow";
import { addLinked, useLinkedForArticle, type ResponseType, type Tone, type Position } from "@/lib/press-desk-store";

export const Route = createFileRoute("/media-watch")({
  head: () => ({
    meta: [
      { title: "Media Watch — MP Pulse" },
      { name: "description", content: "Track relevant media coverage, detect emerging issues, and coordinate official response." },
    ],
  }),
  component: MediaWatchPage,
});

// ─────────── Types ───────────
type Level = "city" | "state" | "national";
type Sentiment = "Positive" | "Neutral" | "Negative";
type Traction = "Low" | "Medium" | "High" | "Viral";
type Relevance = "Critical" | "High" | "Medium" | "Low";
type RepeatState = "Fresh" | "Repeated" | "Escalating" | "Resolved";
type SourceType = "Newspaper" | "TV" | "Digital" | "Blog" | "RSS";
type ArticleStatus =
  | "New" | "Watched" | "Action Needed" | "Assigned" | "Response Drafted"
  | "Awaiting Approval" | "Responded" | "Escalated" | "Closed" | "Ignored" | "Archived";
type RoleRel = "Constituency" | "Ministry" | "Party" | "Governance" | "Personal";

type Article = {
  id: string;
  source: string;
  tier: 1 | 2 | 3;
  sourceType: SourceType;
  language: "English" | "Kannada" | "Hindi";
  time: string;
  headline: string;
  summary: string;
  whyRelevant: string;
  suggestedAction: string;
  topic: string;
  sentiment: Sentiment;
  traction: Traction;
  relevance: Relevance;
  repeat: RepeatState;
  repeatCount?: number;
  level: Level;
  roleRel: RoleRel;
  actionNeeded?: boolean;
  journalistQuery?: boolean;
  ministryRelated?: boolean;
  owner?: string;
  status: ArticleStatus;
  issueKey?: string; // for grouping repeats
};

// ─────────── Seed ───────────
const SEED: Article[] = [
  {
    id: "a1", source: "Times of India", tier: 1, sourceType: "Newspaper", language: "English",
    time: "42 min ago",
    headline: "Civic body slammed over Whitefield flooding as monsoon exposes drain neglect",
    summary: "Residents blame BBMP after 200mm rain leaves Varthur, Panathur underwater for 4th time this monsoon; SWD works pending since 2023.",
    whyRelevant: "Negative + constituency issue + repeated flooding + Tier 1 source",
    suggestedAction: "Draft response and send to civic liaison",
    topic: "Infrastructure", sentiment: "Negative", traction: "Viral", relevance: "Critical",
    repeat: "Escalating", repeatCount: 4, level: "city", roleRel: "Constituency",
    actionNeeded: true, status: "Action Needed", issueKey: "whitefield-flooding",
  },
  {
    id: "a3", source: "The Hindu", tier: 1, sourceType: "Newspaper", language: "English",
    time: "2 hrs ago",
    headline: "Cauvery water rationing extended in 110 villages; residents protest in KR Puram",
    summary: "BWSSB extends alternate-day rationing; KR Puram RWAs protest at ward office demanding tanker deployment.",
    whyRelevant: "Constituency ward + citizen protest + water portfolio",
    suggestedAction: "Draft response and convene BWSSB meeting",
    topic: "Water Supply", sentiment: "Negative", traction: "High", relevance: "Critical",
    repeat: "Repeated", repeatCount: 3, level: "city", roleRel: "Constituency",
    actionNeeded: true, status: "Action Needed", issueKey: "kr-puram-water",
  },
  {
    id: "a2", source: "Deccan Herald", tier: 1, sourceType: "Newspaper", language: "English",
    time: "1 hr ago",
    headline: "Bengaluru MP pushes Centre on Namma Metro Phase 3 funding clearance",
    summary: "MP writes to Union Housing minister citing 4.2L daily commuters; Cabinet note awaited.",
    whyRelevant: "Positive constituency coverage — amplify",
    suggestedAction: "Amplify and draft social post",
    topic: "Transport", sentiment: "Positive", traction: "High", relevance: "High",
    repeat: "Fresh", level: "city", roleRel: "Constituency", status: "New",
  },
  {
    id: "a4", source: "Indian Express", tier: 1, sourceType: "Newspaper", language: "English",
    time: "3 hrs ago",
    headline: "Tech parks demand last-mile shuttle relief as ORR commute times hit new high",
    summary: "Nasscom letter to CM cites 90-min average commute; industry seeks BMTC feeder tie-ups.",
    whyRelevant: "Constituency employers + transport portfolio",
    suggestedAction: "Send to Transport dept for response",
    topic: "Transport", sentiment: "Neutral", traction: "Medium", relevance: "High",
    repeat: "Repeated", repeatCount: 2, level: "city", roleRel: "Constituency",
    ministryRelated: true, status: "New", issueKey: "orr-commute",
  },
  {
    id: "a5", source: "Prajavani", tier: 2, sourceType: "Newspaper", language: "Kannada",
    time: "5 hrs ago",
    headline: "Mahadevapura lake rejuvenation drive draws 1,200 volunteers over weekend",
    summary: "Weekend shramadaan clears 3.2 tonnes of debris from Kaggadasapura lake.",
    whyRelevant: "Positive constituency win — thank stakeholders",
    suggestedAction: "Amplify and thank organisers",
    topic: "Environment", sentiment: "Positive", traction: "Medium", relevance: "Medium",
    repeat: "Fresh", level: "city", roleRel: "Constituency", status: "New",
  },
  {
    id: "a6", source: "Vijaya Karnataka", tier: 2, sourceType: "Newspaper", language: "Kannada",
    time: "6 hrs ago",
    headline: "Auto unions threaten strike over app aggregator fare cap dispute",
    summary: "Auto unions demand ₹35 minimum fare across aggregators; transport dept in mediation.",
    whyRelevant: "Livelihood issue + could disrupt commute",
    suggestedAction: "Watch — brief transport secretariat",
    topic: "Jobs", sentiment: "Negative", traction: "Medium", relevance: "Medium",
    repeat: "Fresh", level: "city", roleRel: "Governance", status: "New",
  },
  {
    id: "a7", source: "Deccan Herald", tier: 1, sourceType: "Newspaper", language: "English",
    time: "8 hrs ago",
    headline: "BBMP awards ₹420 cr white-topping tender; opposition flags single-bidder concern",
    summary: "Opposition alleges tender was tailored; BBMP defends process citing L1 discovery.",
    whyRelevant: "Corruption/tender allegation — brief position",
    suggestedAction: "Request report from BBMP",
    topic: "Governance", sentiment: "Negative", traction: "Medium", relevance: "High",
    repeat: "Fresh", level: "city", roleRel: "Governance",
    ministryRelated: true, status: "New",
  },
  {
    id: "a8", source: "The Hindu", tier: 1, sourceType: "Newspaper", language: "English",
    time: "9 hrs ago",
    headline: "Dengue cases in Bengaluru cross 4,200 mark; BBMP intensifies fogging",
    summary: "Health dept reports 4,213 cases YTD; hospitals report bed shortage in tier-2 facilities.",
    whyRelevant: "Public health issue + constituency wards affected",
    suggestedAction: "Draft departmental response",
    topic: "Health", sentiment: "Negative", traction: "High", relevance: "Critical",
    repeat: "Escalating", repeatCount: 5, level: "city", roleRel: "Ministry",
    actionNeeded: true, ministryRelated: true, status: "Action Needed", issueKey: "dengue",
  },
  {
    id: "a9", source: "Bangalore Mirror", tier: 2, sourceType: "Digital", language: "English",
    time: "11 hrs ago",
    headline: "Govt school in Ramamurthy Nagar without functioning toilets, parents petition MP",
    summary: "Parents' delegation submits memorandum citing 4 non-functional toilet blocks.",
    whyRelevant: "Direct petition to MP — respond",
    suggestedAction: "Create case + inspection order",
    topic: "Education", sentiment: "Negative", traction: "Medium", relevance: "High",
    repeat: "Fresh", level: "city", roleRel: "Constituency",
    actionNeeded: true, status: "Action Needed",
  },
  {
    id: "a10", source: "TV9 Kannada", tier: 2, sourceType: "TV", language: "Kannada",
    time: "45 min ago",
    headline: "Journalist seeks MP quote on Kannada signage compliance in tech parks",
    summary: "Rohit Kumar (TV9) requesting 60-sec on-camera by 6 PM.",
    whyRelevant: "Journalist query — deadline today",
    suggestedAction: "Draft quote and assign to Press Desk",
    topic: "Culture", sentiment: "Neutral", traction: "Low", relevance: "Medium",
    repeat: "Fresh", level: "city", roleRel: "Party",
    journalistQuery: true, actionNeeded: true, status: "Action Needed",
  },
  // State / National
  {
    id: "s1", source: "The Hindu", tier: 1, sourceType: "Newspaper", language: "English",
    time: "1 hr ago",
    headline: "Karnataka cabinet clears ₹2,800 cr Upper Bhadra phase-II irrigation outlay",
    summary: "Cabinet nod for phase-II; state to press Centre for national project status.",
    whyRelevant: "State win — amplify",
    suggestedAction: "Amplify + weekly digest",
    topic: "Agriculture", sentiment: "Positive", traction: "High", relevance: "Medium",
    repeat: "Fresh", level: "state", roleRel: "Governance", status: "New",
  },
  {
    id: "n1", source: "Indian Express", tier: 1, sourceType: "Newspaper", language: "English",
    time: "2 hrs ago",
    headline: "Centre clears ₹15,000 cr semiconductor incentive; Karnataka among frontrunners",
    summary: "Two Karnataka clusters shortlisted under revised ISM 2.0.",
    whyRelevant: "National + state benefit — amplify",
    suggestedAction: "Draft social post",
    topic: "Industry", sentiment: "Positive", traction: "High", relevance: "Medium",
    repeat: "Fresh", level: "national", roleRel: "Governance", status: "New",
  },
];

const HASHTAGS = [
  { tag: "#BengaluruTraffic", volume: 48200, change: 22.4, level: "City" },
  { tag: "#CauveryWater", volume: 36100, change: 14.1, level: "City" },
  { tag: "#FixOurRoads", volume: 21800, change: 31.7, level: "City" },
  { tag: "#NammaMetro", volume: 18900, change: 8.2, level: "City" },
  { tag: "#SaveOurLakes", volume: 9800, change: 12.3, level: "City" },
  { tag: "#Mekedatu", volume: 33800, change: 12.9, level: "State" },
  { tag: "#Budget2026", volume: 412000, change: 28.4, level: "National" },
];

const SOURCES = [
  { id: "toi", name: "Times of India Bengaluru", type: "Newspaper", geography: "City", language: "English", status: "Connected", lastSync: "6 min ago", pulled: 48, error: "" },
  { id: "hindu", name: "The Hindu Bengaluru", type: "Newspaper", geography: "City", language: "English", status: "Connected", lastSync: "12 min ago", pulled: 39, error: "" },
  { id: "dh", name: "Deccan Herald", type: "Newspaper", geography: "State", language: "English", status: "Connected", lastSync: "3 min ago", pulled: 52, error: "" },
  { id: "praja", name: "Prajavani", type: "Newspaper", geography: "State", language: "Kannada", status: "Connected", lastSync: "9 min ago", pulled: 31, error: "" },
  { id: "vk", name: "Vijaya Karnataka", type: "Newspaper", geography: "State", language: "Kannada", status: "Error", lastSync: "3 hr ago", pulled: 0, error: "Feed returned HTTP 403" },
  { id: "bwssb", name: "BWSSB Updates", type: "RSS", geography: "City", language: "English", status: "Error", lastSync: "1 d ago", pulled: 0, error: "SSL handshake failed" },
  { id: "n18k", name: "News18 Kannada", type: "TV", geography: "State", language: "Kannada", status: "Paused", lastSync: "—", pulled: 0, error: "" },
  { id: "bbmp", name: "BBMP Updates", type: "RSS", geography: "City", language: "English", status: "Connected", lastSync: "18 min ago", pulled: 12, error: "" },
];

const fmtVol = (n: number) => n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : `${n}`;

// ─────────── Tone maps ───────────
const sentimentClass: Record<Sentiment, string> = {
  Positive: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Neutral: "bg-slate-100 text-slate-700 border-slate-200",
  Negative: "bg-rose-50 text-rose-700 border-rose-200",
};
const tractionClass: Record<Traction, string> = {
  Viral: "bg-saffron/15 text-saffron border-saffron/30",
  High: "bg-amber-50 text-amber-700 border-amber-200",
  Medium: "bg-blue-50 text-blue-700 border-blue-200",
  Low: "bg-slate-50 text-slate-600 border-slate-200",
};
const relevanceClass: Record<Relevance, string> = {
  Critical: "bg-rose-600 text-white border-rose-600",
  High: "bg-saffron text-white border-saffron",
  Medium: "bg-blue-100 text-blue-800 border-blue-200",
  Low: "bg-slate-100 text-slate-700 border-slate-200",
};
const statusTone: Record<ArticleStatus, string> = {
  "New": "bg-slate-100 text-slate-700 border-slate-200",
  "Watched": "bg-blue-50 text-blue-700 border-blue-200",
  "Action Needed": "bg-rose-50 text-rose-700 border-rose-200",
  "Assigned": "bg-amber-50 text-amber-800 border-amber-200",
  "Response Drafted": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Awaiting Approval": "bg-saffron/15 text-saffron border-saffron/40",
  "Responded": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Escalated": "bg-rose-100 text-rose-800 border-rose-300",
  "Closed": "bg-slate-100 text-slate-600 border-slate-200",
  "Ignored": "bg-slate-50 text-slate-500 border-slate-200",
  "Archived": "bg-slate-50 text-slate-500 border-slate-200",
};

const tractionWeight: Record<Traction, number> = { Viral: 4, High: 3, Medium: 2, Low: 1 };

// ─────────── Action modal registry ───────────
type ActionKey =
  | "draft-response" | "create-case" | "assign" | "send-department" | "escalate"
  | "link-issue" | "amplify" | "social-post" | "thank" | "request-report"
  | "draft-quote" | "send-response" | "add-journalist" | "add-briefing" | "weekly-digest";

const ACTION_META: Record<ActionKey, { title: string; desc: string; cta: string; fields: { key: string; label: string; type?: "text" | "textarea" | "select"; options?: string[]; placeholder?: string; def?: string }[]; toast: string; statusAfter?: ArticleStatus }> = {
  "draft-response": { title: "Draft Media Response", desc: "Compose an official response.", cta: "Send for approval", statusAfter: "Response Drafted",
    fields: [{ key: "channel", label: "Channel", type: "select", options: ["Press release", "WhatsApp", "X post", "Statement to journalist"] }, { key: "body", label: "Response draft", type: "textarea", placeholder: "Write the response..." }],
    toast: "Response drafted and queued for approval" },
  "create-case": { title: "Create Case", desc: "Log a case linked to this article.", cta: "Create case", statusAfter: "Assigned",
    fields: [{ key: "title", label: "Case title" }, { key: "category", label: "Category", type: "select", options: ["Water", "Roads", "Health", "Education", "Civic/BBMP", "Other"] }, { key: "owner", label: "Assign to", type: "select", options: ["Suresh Patil", "Kavya Shetty", "Imran Khan", "Rohan Iyer"] }],
    toast: "Case created and linked" },
  "assign": { title: "Assign Owner", desc: "Route this item to a team member.", cta: "Assign", statusAfter: "Assigned",
    fields: [{ key: "owner", label: "Owner", type: "select", options: ["Anjali Rao", "Rohan Iyer", "Suresh Patil", "Pooja Hegde"] }, { key: "note", label: "Note", type: "textarea" }],
    toast: "Owner assigned" },
  "send-department": { title: "Send to Department", desc: "Forward for departmental follow-up.", cta: "Send follow-up", statusAfter: "Escalated",
    fields: [{ key: "dept", label: "Department", type: "select", options: ["BBMP", "BWSSB", "BESCOM", "BMTC", "BMRCL", "Health Dept", "Education Dept"] }, { key: "brief", label: "Brief", type: "textarea" }],
    toast: "Department follow-up sent" },
  "escalate": { title: "Escalate", desc: "Escalate to higher authority.", cta: "Escalate", statusAfter: "Escalated",
    fields: [{ key: "to", label: "Escalate to", type: "select", options: ["Chief of Staff", "MP directly", "State Minister", "Party HQ"] }, { key: "reason", label: "Reason", type: "textarea" }],
    toast: "Escalated" },
  "link-issue": { title: "Link Existing Issue", desc: "Link this article to an ongoing issue.", cta: "Link",
    fields: [{ key: "issue", label: "Issue", type: "select", options: ["Whitefield flooding", "KR Puram water crisis", "ORR commute", "Dengue outbreak"] }],
    toast: "Article linked to issue" },
  "amplify": { title: "Amplify Coverage", desc: "Amplify this positive story.", cta: "Queue amplification", statusAfter: "Responded",
    fields: [{ key: "channels", label: "Channels", type: "select", options: ["All social", "X + Instagram", "WhatsApp broadcast only"] }, { key: "note", label: "Note for comms", type: "textarea" }],
    toast: "Queued for amplification" },
  "social-post": { title: "Draft Social Post", desc: "Compose a social post.", cta: "Save draft", statusAfter: "Response Drafted",
    fields: [{ key: "platform", label: "Platform", type: "select", options: ["X", "Instagram", "Facebook", "All"] }, { key: "copy", label: "Post copy", type: "textarea" }],
    toast: "Social post drafted" },
  "thank": { title: "Thank Stakeholders", desc: "Send an appreciation note.", cta: "Send note",
    fields: [{ key: "to", label: "Recipient", placeholder: "e.g. Mahadevapura RWA" }, { key: "body", label: "Message", type: "textarea" }],
    toast: "Appreciation note sent" },
  "request-report": { title: "Request Report", desc: "Request a briefing report from the department.", cta: "Send request", statusAfter: "Escalated",
    fields: [{ key: "dept", label: "Department", type: "select", options: ["BBMP", "BWSSB", "BESCOM", "Health Dept"] }, { key: "questions", label: "Questions", type: "textarea" }],
    toast: "Report requested" },
  "draft-quote": { title: "Draft Quote for Journalist", desc: "Draft a quote — requires MP approval.", cta: "Send to Press Desk", statusAfter: "Awaiting Approval",
    fields: [{ key: "journalist", label: "Journalist" }, { key: "quote", label: "Quote (must be MP-approved)", type: "textarea" }],
    toast: "Quote sent to Press Desk" },
  "send-response": { title: "Send Response to Journalist", desc: "Pick a media contact.", cta: "Send", statusAfter: "Responded",
    fields: [{ key: "contact", label: "Media contact", type: "select", options: ["R. Iyer — Deccan Herald", "S. Murthy — Times of India", "Anjali Pinto — The Hindu", "Rohit Kumar — TV9 Kannada"] }, { key: "body", label: "Response", type: "textarea" }],
    toast: "Response sent to journalist" },
  "add-journalist": { title: "Add Journalist to CRM", desc: "Save contact to Media CRM.", cta: "Add contact",
    fields: [{ key: "name", label: "Name" }, { key: "outlet", label: "Outlet" }, { key: "beat", label: "Beat" }, { key: "phone", label: "Phone" }],
    toast: "Journalist added to CRM" },
  "add-briefing": { title: "Add to Daily Briefing", desc: "", cta: "Add", fields: [{ key: "note", label: "Note for briefing", type: "textarea" }], toast: "Added to Daily Briefing" },
  "weekly-digest": { title: "Add to Weekly Digest", desc: "", cta: "Add", fields: [{ key: "note", label: "Digest note", type: "textarea" }], toast: "Added to Weekly Digest" },
};

// ─────────── Main page ───────────
type ActionRequest = { key: ActionKey; article?: Article; issueKey?: string };

function MediaWatchPage() {
  const [articles, setArticles] = useState<Article[]>(SEED);
  const [level, setLevel] = useState<string>("all");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [tractionFilter, setTractionFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [repeatFilter, setRepeatFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [langFilter, setLangFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const [action, setAction] = useState<ActionRequest | null>(null);
  const [timelineFor, setTimelineFor] = useState<string | null>(null);

  const [briefingCount, setBriefingCount] = useState(0);
  const [digestCount, setDigestCount] = useState(0);
  const [quotesSent, setQuotesSent] = useState(3);
  const [pendingApproval, setPendingApproval] = useState(2);

  const topics = useMemo(() => Array.from(new Set(articles.map(a => a.topic))).sort(), [articles]);

  const visible = useMemo(() => articles.filter(a =>
    (level === "all" || a.level === level) &&
    (sentimentFilter === "all" || a.sentiment === sentimentFilter) &&
    (tractionFilter === "all" || a.traction === tractionFilter) &&
    (tierFilter === "all" || String(a.tier) === tierFilter) &&
    (topicFilter === "all" || a.topic === topicFilter) &&
    (statusFilter === "all" || a.status === statusFilter) &&
    (repeatFilter === "all" || a.repeat === repeatFilter) &&
    (typeFilter === "all" || a.sourceType === typeFilter) &&
    (langFilter === "all" || a.language === langFilter) &&
    (roleFilter === "all" || a.roleRel === roleFilter)
  ).sort((a, b) => tractionWeight[b.traction] - tractionWeight[a.traction]), [
    articles, level, sentimentFilter, tractionFilter, tierFilter, topicFilter,
    statusFilter, repeatFilter, typeFilter, langFilter, roleFilter,
  ]);

  const actionItems = articles.filter(a => a.actionNeeded && a.status !== "Ignored" && a.status !== "Closed");
  const negativeCount = articles.filter(a => a.sentiment === "Negative").length;
  const positiveCount = articles.filter(a => a.sentiment === "Positive").length;
  const highTraction = articles.filter(a => a.traction === "Viral" || a.traction === "High").length;
  const repeatCount = articles.filter(a => a.repeat === "Repeated" || a.repeat === "Escalating").length;

  // Handlers
  const setStatus = (id: string, status: ArticleStatus, patch?: Partial<Article>) => {
    setArticles(list => list.map(a => a.id === id ? { ...a, status, actionNeeded: status === "Ignored" ? false : a.actionNeeded, ...patch } : a));
  };
  const runAction = (req: ActionRequest, payload: Record<string, string>) => {
    const meta = ACTION_META[req.key];
    if (req.article && meta.statusAfter) {
      setStatus(req.article.id, meta.statusAfter, req.key === "assign" ? { owner: payload.owner } : {});
    }
    if (req.key === "draft-response" || req.key === "draft-quote" || req.key === "social-post") setPendingApproval(n => n + 1);
    if (req.key === "send-response") setQuotesSent(n => n + 1);
    if (req.key === "add-briefing") { setBriefingCount(n => n + 1); if (req.article) setStatus(req.article.id, req.article.status); }
    if (req.key === "weekly-digest") setDigestCount(n => n + 1);
    toast.success(meta.toast);
    setAction(null);
  };
  const ignore = (id: string) => { setStatus(id, "Ignored"); toast(`Item marked ignored`); };
  const markWatched = (id: string) => { setStatus(id, "Watched"); toast.success("Marked as watched"); };

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-navy">Media Watch</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track relevant media coverage, detect emerging issues, and coordinate official response.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
        <Metric label="Action Needed" value={actionItems.length} tone="text-rose-600" />
        <Metric label="Coverage Tracked" value={articles.length} tone="text-navy" />
        <Metric label="Repeat Issues" value={repeatCount} tone="text-amber-600" />
        <Metric label="Pending Approval" value={pendingApproval} tone="text-saffron" />
        <Metric label="Quotes Sent Today" value={quotesSent} tone="text-emerald-600" />
        <Metric label="Negative Coverage" value={negativeCount} tone="text-rose-600" />
        <Metric label="Positive Coverage" value={positiveCount} tone="text-emerald-600" />
        <Metric label="High-Traction" value={highTraction} tone="text-saffron" />
      </div>

      {/* Top Action Needed panel */}
      {actionItems.length > 0 && (
        <Card className="border-l-4 border-l-saffron bg-gradient-to-r from-saffron/5 to-transparent p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-saffron" />
            <span className="text-xs font-semibold uppercase tracking-wider text-saffron">Action Needed</span>
            <Badge variant="outline" className="ml-auto text-[10px]">{actionItems.length} flagged</Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {actionItems.slice(0, 4).map(a => (
              <ActionNeededCard key={a.id} a={a} onAction={(k) => setAction({ key: k, article: a })} onIgnore={() => ignore(a.id)} onTimeline={() => a.issueKey && setTimelineFor(a.issueKey)} />
            ))}
          </div>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="feed">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="feed">News Feed</TabsTrigger>
          <TabsTrigger value="action">Action Needed</TabsTrigger>
          <TabsTrigger value="repeat">Repeat Issues</TabsTrigger>
          <TabsTrigger value="press">Press Desk</TabsTrigger>
          <TabsTrigger value="outreach">Media Outreach</TabsTrigger>
          <TabsTrigger value="hashtags">Trending Hashtags</TabsTrigger>
          <TabsTrigger value="health">Source Health</TabsTrigger>
        </TabsList>

        {/* NEWS FEED */}
        <TabsContent value="feed" className="mt-4 space-y-3">
          <FilterBar
            level={level} setLevel={setLevel}
            sentimentFilter={sentimentFilter} setSentimentFilter={setSentimentFilter}
            tractionFilter={tractionFilter} setTractionFilter={setTractionFilter}
            tierFilter={tierFilter} setTierFilter={setTierFilter}
            topicFilter={topicFilter} setTopicFilter={setTopicFilter}
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            repeatFilter={repeatFilter} setRepeatFilter={setRepeatFilter}
            typeFilter={typeFilter} setTypeFilter={setTypeFilter}
            langFilter={langFilter} setLangFilter={setLangFilter}
            roleFilter={roleFilter} setRoleFilter={setRoleFilter}
            topics={topics}
          />
          <div className="grid gap-3">
            {visible.map(a => (
              <NewsCard key={a.id} a={a}
                onAction={(k) => setAction({ key: k, article: a })}
                onWatch={() => markWatched(a.id)}
                onIgnore={() => ignore(a.id)}
                onTimeline={() => a.issueKey && setTimelineFor(a.issueKey)}
              />
            ))}
            {visible.length === 0 && <Card className="p-8 text-center text-sm text-slate-500">No articles match the current filters.</Card>}
          </div>
        </TabsContent>

        {/* ACTION NEEDED */}
        <TabsContent value="action" className="mt-4 space-y-3">
          <ActionNeededTab items={actionItems} onAction={(k, a) => setAction({ key: k, article: a })} onIgnore={ignore} onTimeline={(k) => setTimelineFor(k)} />
        </TabsContent>

        {/* REPEAT ISSUES */}
        <TabsContent value="repeat" className="mt-4 space-y-3">
          <RepeatIssuesTab articles={articles} onTimeline={setTimelineFor} onAction={(k, a) => setAction({ key: k, article: a })} onIssueAction={(k, key) => setAction({ key: k, issueKey: key })} />
        </TabsContent>

        {/* PRESS DESK */}
        <TabsContent value="press" className="mt-4 space-y-4"><PressDeskPanel /></TabsContent>

        {/* MEDIA OUTREACH */}
        <TabsContent value="outreach" className="mt-4"><MediaOutreachPanel onAction={(k) => setAction({ key: k })} /></TabsContent>

        {/* HASHTAGS */}
        <TabsContent value="hashtags" className="mt-4">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-saffron" /><h2 className="text-sm font-semibold text-navy">Trending Hashtags</h2></div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500">last 24h</span>
            </div>
            <div className="divide-y divide-border/60">
              {HASHTAGS.map((h, i) => (
                <div key={h.tag} className="flex items-center gap-4 py-3">
                  <span className="w-6 text-xs font-mono text-slate-400">{i + 1}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-saffron">{h.tag}</div>
                    <div className="text-[11px] text-slate-500 tabular-nums">{fmtVol(h.volume)} mentions · {h.level}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-emerald-600"><TrendingUp className="h-3 w-3" />+{h.change.toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* SOURCE HEALTH */}
        <TabsContent value="health" className="mt-4"><SourceHealthTab /></TabsContent>
      </Tabs>

      {/* Modals + Drawer */}
      <ActionDialog req={action} onClose={() => setAction(null)} onSubmit={runAction} />
      <IssueTimelineDrawer issueKey={timelineFor} articles={articles} onClose={() => setTimelineFor(null)} onAction={(k, a) => setAction({ key: k, article: a })} onIssueAction={(k, key) => { setTimelineFor(null); setAction({ key: k, issueKey: key }); }} />

      {(briefingCount > 0 || digestCount > 0) && (
        <div className="text-[11px] text-slate-400">{briefingCount} added to today's briefing · {digestCount} in weekly digest</div>
      )}
    </div>
  );
}

// ─────────── Metric ───────────
function Metric({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <Card className="p-3">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`text-xl font-bold mt-1 tabular-nums ${tone}`}>{value}</div>
    </Card>
  );
}

// ─────────── Filter Bar ───────────
function FilterBar(p: {
  level: string; setLevel: (v: string) => void;
  sentimentFilter: string; setSentimentFilter: (v: string) => void;
  tractionFilter: string; setTractionFilter: (v: string) => void;
  tierFilter: string; setTierFilter: (v: string) => void;
  topicFilter: string; setTopicFilter: (v: string) => void;
  statusFilter: string; setStatusFilter: (v: string) => void;
  repeatFilter: string; setRepeatFilter: (v: string) => void;
  typeFilter: string; setTypeFilter: (v: string) => void;
  langFilter: string; setLangFilter: (v: string) => void;
  roleFilter: string; setRoleFilter: (v: string) => void;
  topics: string[];
}) {
  const F = ({ v, on, opts, ph }: { v: string; on: (x: string) => void; opts: [string, string][]; ph: string }) => (
    <Select value={v} onValueChange={on}>
      <SelectTrigger className="h-8 w-[130px] text-xs"><SelectValue placeholder={ph} /></SelectTrigger>
      <SelectContent>{opts.map(([val, lab]) => <SelectItem key={val} value={val}>{lab}</SelectItem>)}</SelectContent>
    </Select>
  );
  return (
    <Card className="p-3 flex flex-wrap items-center gap-2">
      <F v={p.level} on={p.setLevel} ph="Geography" opts={[["all","All geographies"],["city","City · Bengaluru"],["state","State · Karnataka"],["national","National"]]} />
      <F v={p.sentimentFilter} on={p.setSentimentFilter} ph="Sentiment" opts={[["all","All sentiment"],["Positive","Positive"],["Neutral","Neutral"],["Negative","Negative"]]} />
      <F v={p.tractionFilter} on={p.setTractionFilter} ph="Traction" opts={[["all","All traction"],["Viral","Viral"],["High","High"],["Medium","Medium"],["Low","Low"]]} />
      <F v={p.tierFilter} on={p.setTierFilter} ph="Source Tier" opts={[["all","All tiers"],["1","Tier 1"],["2","Tier 2"],["3","Tier 3"]]} />
      <F v={p.topicFilter} on={p.setTopicFilter} ph="Topic" opts={[["all","All topics"], ...p.topics.map(t => [t, t] as [string, string])]} />
      <F v={p.statusFilter} on={p.setStatusFilter} ph="Status" opts={[["all","All status"],["New","New"],["Watched","Watched"],["Action Needed","Action Needed"],["Assigned","Assigned"],["Responded","Responded"],["Escalated","Escalated"],["Ignored","Ignored"]]} />
      <F v={p.repeatFilter} on={p.setRepeatFilter} ph="Repeat" opts={[["all","All repeat"],["Fresh","Fresh"],["Repeated","Repeated"],["Escalating","Escalating"],["Resolved","Resolved"]]} />
      <F v={p.typeFilter} on={p.setTypeFilter} ph="Source Type" opts={[["all","All types"],["Newspaper","Newspaper"],["TV","TV"],["Digital","Digital"],["Blog","Blog"],["RSS","RSS"]]} />
      <F v={p.langFilter} on={p.setLangFilter} ph="Language" opts={[["all","All lang"],["English","English"],["Kannada","Kannada"],["Hindi","Hindi"]]} />
      <F v={p.roleFilter} on={p.setRoleFilter} ph="Role Relevance" opts={[["all","All roles"],["Constituency","Constituency"],["Ministry","Ministry"],["Party","Party"],["Governance","Governance"],["Personal","Personal"]]} />
      <div className="ml-auto flex items-center gap-1 text-xs text-slate-500"><TrendingUp className="h-3.5 w-3.5" /> Sorted by traction</div>
    </Card>
  );
}

// ─────────── Cards ───────────
function ActionNeededCard({ a, onAction, onIgnore, onTimeline }: { a: Article; onAction: (k: ActionKey) => void; onIgnore: () => void; onTimeline: () => void }) {
  return (
    <div className="rounded-lg border border-saffron/30 bg-white p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
        <span className="font-semibold text-navy">{a.source}</span><span>•</span><span>{a.time}</span><span>•</span><span>{a.topic}</span>
      </div>
      <div className="text-sm font-medium text-slate-900 leading-snug">{a.headline}</div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <Badge variant="outline" className={sentimentClass[a.sentiment]}>{a.sentiment}</Badge>
        <Badge variant="outline" className={tractionClass[a.traction]}><Flame className="h-3 w-3 mr-1" />{a.traction}</Badge>
        <Badge variant="outline" className={relevanceClass[a.relevance]}>{a.relevance}</Badge>
        {a.repeatCount && <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200"><Repeat className="h-3 w-3 mr-1" />{a.repeatCount}× in 12d</Badge>}
      </div>
      <div className="rounded-md bg-slate-50 border border-slate-200 p-2 text-[11px] text-slate-700 leading-relaxed">
        <div className="font-semibold text-navy">Why flagged</div><p>{a.whyRelevant}</p>
        <div className="font-semibold text-navy mt-1.5">Suggested action</div><p>{a.suggestedAction}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Button size="sm" className="h-7 text-xs bg-navy hover:bg-navy/90 text-white" onClick={() => onAction("draft-response")}>Draft Response</Button>
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onAction("create-case")}>Create Case</Button>
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onAction("assign")}>Assign</Button>
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onAction("send-department")}>Send to Dept</Button>
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onAction("add-briefing")}>Add to Briefing</Button>
        {a.issueKey && <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={onTimeline}>View Timeline</Button>}
        <Button size="sm" variant="ghost" className="h-7 text-xs text-slate-500 ml-auto" onClick={onIgnore}><X className="h-3 w-3 mr-1" />Ignore</Button>
      </div>
    </div>
  );
}

function NewsCard({ a, onAction, onWatch, onIgnore, onTimeline }: { a: Article; onAction: (k: ActionKey) => void; onWatch: () => void; onIgnore: () => void; onTimeline: () => void }) {
  const isRepeated = a.repeat === "Repeated" || a.repeat === "Escalating";
  const buttons: { label: string; k?: ActionKey; onClick?: () => void; variant?: "primary" | "outline" | "ghost" }[] = [];

  if (a.journalistQuery) {
    buttons.push({ label: "Draft Quote", k: "draft-quote", variant: "primary" });
    buttons.push({ label: "Assign to Press Desk", k: "assign" });
    buttons.push({ label: "Send Response", k: "send-response" });
    buttons.push({ label: "Add Journalist to CRM", k: "add-journalist" });
  } else if (a.sentiment === "Negative" && (a.traction === "Viral" || a.traction === "High")) {
    buttons.push({ label: "Draft Response", k: "draft-response", variant: "primary" });
    buttons.push({ label: "Escalate", k: "escalate" });
    buttons.push({ label: "Create Case", k: "create-case" });
    buttons.push({ label: "Send to Department", k: "send-department" });
  } else if (a.sentiment === "Positive") {
    buttons.push({ label: "Amplify", k: "amplify", variant: "primary" });
    buttons.push({ label: "Draft Social Post", k: "social-post" });
    buttons.push({ label: "Thank Stakeholders", k: "thank" });
    buttons.push({ label: "Weekly Digest", k: "weekly-digest" });
  } else if (isRepeated) {
    buttons.push({ label: "View Timeline", onClick: onTimeline, variant: "primary" });
    buttons.push({ label: "Link Existing Issue", k: "link-issue" });
    buttons.push({ label: "Draft Follow-up", k: "draft-response" });
    buttons.push({ label: "Escalate", k: "escalate" });
  } else if (a.ministryRelated) {
    buttons.push({ label: "Send to Department", k: "send-department", variant: "primary" });
    buttons.push({ label: "Request Report", k: "request-report" });
    buttons.push({ label: "Draft Departmental Response", k: "draft-response" });
  } else if (a.status === "New") {
    buttons.push({ label: "Mark as Watched", onClick: onWatch, variant: "primary" });
    buttons.push({ label: "Draft Response", k: "draft-response" });
    buttons.push({ label: "Create Case", k: "create-case" });
    buttons.push({ label: "Assign", k: "assign" });
  } else {
    buttons.push({ label: "Draft Response", k: "draft-response" });
    buttons.push({ label: "Assign", k: "assign" });
  }
  buttons.push({ label: "Add to Briefing", k: "add-briefing" });

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1.5 flex-wrap">
            <span className="font-semibold text-navy">{a.source}</span>
            <Badge variant="outline" className={`text-[10px] ${a.tier === 1 ? "bg-navy/5 text-navy border-navy/20" : a.tier === 2 ? "bg-slate-50 text-slate-600 border-slate-200" : "bg-slate-50 text-slate-500 border-slate-200"}`}>Tier {a.tier}</Badge>
            <span>·</span><span>{a.time}</span><span>·</span>
            <span className="text-slate-600">{a.level === "city" ? "Bengaluru" : a.level === "state" ? "Karnataka" : "National"}</span>
            <span>·</span><span className="text-slate-600">{a.topic}</span>
            {a.owner && <><span>·</span><span className="text-slate-600 flex items-center gap-1"><Users className="h-3 w-3" />{a.owner}</span></>}
          </div>
          <div className="text-sm font-semibold text-slate-900 leading-snug">{a.headline}</div>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed"><span className="font-semibold text-navy">AI summary:</span> {a.summary}</p>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed"><span className="font-semibold text-navy">Why relevant:</span> {a.whyRelevant}</p>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed"><span className="font-semibold text-navy">Suggested:</span> {a.suggestedAction}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <Badge variant="outline" className={statusTone[a.status]}>{a.status}</Badge>
          <Badge variant="outline" className={sentimentClass[a.sentiment]}>{a.sentiment}</Badge>
          <Badge variant="outline" className={tractionClass[a.traction]}><Flame className="h-3 w-3 mr-1" />{a.traction}</Badge>
          <Badge variant="outline" className={relevanceClass[a.relevance]}>{a.relevance}</Badge>
          {isRepeated && <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200"><Repeat className="h-3 w-3 mr-1" />{a.repeat}{a.repeatCount ? ` ${a.repeatCount}×` : ""}</Badge>}
          <button className="text-[11px] text-slate-500 hover:text-navy flex items-center gap-1">Open <ExternalLink className="h-3 w-3" /></button>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
        {buttons.map((b, i) => (
          <Button key={i} size="sm"
            variant={b.variant === "primary" ? "default" : b.variant === "ghost" ? "ghost" : "outline"}
            className={`h-7 text-xs ${b.variant === "primary" ? "bg-navy hover:bg-navy/90 text-white" : ""}`}
            onClick={b.onClick ?? (() => b.k && onAction(b.k))}>
            {b.label}
          </Button>
        ))}
        <Button size="sm" variant="ghost" className="h-7 text-xs text-slate-500 ml-auto" onClick={onIgnore}><X className="h-3 w-3 mr-1" />Ignore</Button>
      </div>
    </Card>
  );
}

// ─────────── Action Needed Tab ───────────
function ActionNeededTab({ items, onAction, onIgnore, onTimeline }: { items: Article[]; onAction: (k: ActionKey, a: Article) => void; onIgnore: (id: string) => void; onTimeline: (key: string) => void }) {
  const [quick, setQuick] = useState<string>("all");
  const filtered = items.filter(a => {
    if (quick === "all") return true;
    if (quick === "Critical") return a.relevance === "Critical";
    if (quick === "Negative") return a.sentiment === "Negative";
    if (quick === "Viral") return a.traction === "Viral";
    if (quick === "Repeated") return a.repeat === "Repeated" || a.repeat === "Escalating";
    if (quick === "Ministry") return a.ministryRelated;
    if (quick === "Opposition") return /opposition/i.test(a.summary + a.headline);
    if (quick === "Journalist") return a.journalistQuery;
    return true;
  });
  const chips = ["all", "Critical", "Negative", "Viral", "Repeated", "Ministry", "Opposition", "Journalist"];
  return (
    <>
      <Card className="p-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 mr-1">Quick filters:</span>
        {chips.map(c => (
          <button key={c} onClick={() => setQuick(c)} className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${quick === c ? "bg-navy text-white border-navy" : "bg-white text-slate-700 border-slate-200 hover:border-navy/40"}`}>{c === "all" ? "All" : c}</button>
        ))}
      </Card>
      <div className="grid gap-3">
        {filtered.map(a => (
          <Card key={a.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                  <span className="font-semibold text-navy">{a.source}</span><span>·</span><span>{a.time}</span><span>·</span><span>{a.topic}</span>
                  {a.owner && <><span>·</span><span className="flex items-center gap-1"><Users className="h-3 w-3" />{a.owner}</span></>}
                  <span>·</span><span className="flex items-center gap-1 text-amber-700"><Clock className="h-3 w-3" />Due in 4h</span>
                </div>
                <div className="text-sm font-semibold text-slate-900 mt-1">{a.headline}</div>
                <p className="text-xs text-slate-600 mt-1">{a.summary}</p>
                <p className="text-xs text-slate-500 mt-1"><span className="font-semibold text-navy">Why flagged:</span> {a.whyRelevant}</p>
                <p className="text-xs text-slate-500"><span className="font-semibold text-navy">Suggested:</span> {a.suggestedAction}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <Badge variant="outline" className={statusTone[a.status]}>{a.status}</Badge>
                <Badge variant="outline" className={relevanceClass[a.relevance]}>{a.relevance}</Badge>
                <Badge variant="outline" className={sentimentClass[a.sentiment]}>{a.sentiment}</Badge>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
              <Button size="sm" className="h-7 text-xs bg-navy hover:bg-navy/90 text-white" onClick={() => onAction("draft-response", a)}>Draft Response</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onAction("create-case", a)}>Create Case</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onAction("assign", a)}>Assign</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onAction("send-department", a)}>Send to Dept</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onAction("escalate", a)}>Escalate</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onAction("add-briefing", a)}>Add to Briefing</Button>
              {a.issueKey && <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => onTimeline(a.issueKey!)}>Timeline</Button>}
              <Button size="sm" variant="ghost" className="h-7 text-xs text-slate-500 ml-auto" onClick={() => onIgnore(a.id)}><X className="h-3 w-3 mr-1" />Ignore</Button>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <Card className="p-8 text-center text-sm text-slate-500">No items match this filter.</Card>}
      </div>
    </>
  );
}

// ─────────── Repeat Issues Tab ───────────
const REPEAT_META: Record<string, { name: string; firstReported: string; geos: string[]; response: string; trend: "Rising" | "Stable" | "Reducing" | "Resurfacing"; label: string; cases: string[] }> = {
  "whitefield-flooding": { name: "Whitefield monsoon flooding", firstReported: "May 3, 2026", geos: ["Whitefield", "Varthur", "Panathur"], response: "SWD works ordered Aug 2024 — 62% complete", trend: "Escalating" as any, label: "Escalating", cases: ["CASE-4021 (Panathur underpass)", "CASE-4088 (Varthur outfall)"] },
  "kr-puram-water": { name: "KR Puram water rationing", firstReported: "Feb 12, 2026", geos: ["KR Puram", "Hoodi"], response: "40 tankers deployed; borewell rejuvenation drive on", trend: "Rising", label: "Repeated Issue", cases: ["CASE-3980"] },
  "orr-commute": { name: "ORR commute delays", firstReported: "Jan 8, 2026", geos: ["Bellandur", "Sarjapur"], response: "BMTC feeder pilot launched Sep 2025", trend: "Stable", label: "Follow-up Coverage", cases: [] },
  "dengue": { name: "Bengaluru dengue outbreak", firstReported: "Jun 1, 2026", geos: ["Mahadevapura", "KR Puram", "Bommanahalli"], response: "Fogging expanded; hospital bed audit ordered", trend: "Rising", label: "Multi-source Pickup", cases: ["CASE-4102"] },
};
const trendClass: Record<string, string> = {
  Rising: "bg-rose-50 text-rose-700 border-rose-200",
  Escalating: "bg-rose-100 text-rose-800 border-rose-300",
  Stable: "bg-slate-100 text-slate-700 border-slate-200",
  Reducing: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Resurfacing: "bg-amber-50 text-amber-800 border-amber-200",
};
function RepeatIssuesTab({ articles, onTimeline, onAction, onIssueAction }: { articles: Article[]; onTimeline: (k: string) => void; onAction: (k: ActionKey, a: Article) => void; onIssueAction: (k: ActionKey, key: string) => void }) {
  const grouped = useMemo(() => {
    const g: Record<string, Article[]> = {};
    articles.forEach(a => { if (a.issueKey) (g[a.issueKey] ??= []).push(a); });
    return g;
  }, [articles]);
  return (
    <div className="grid gap-3">
      {Object.entries(grouped).map(([key, list]) => {
        const meta = REPEAT_META[key];
        if (!meta) return null;
        const latest = list[0];
        return (
          <Card key={key} className="p-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-sm font-semibold text-navy">{meta.name}</div>
                  <Badge variant="outline" className={trendClass[meta.trend]}>{meta.trend}</Badge>
                  <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">{meta.label}</Badge>
                  <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">{list.length} mentions</Badge>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">First reported {meta.firstReported} · Latest: {latest.time} · Geographies: {meta.geos.join(", ")}</div>
                <div className="text-xs text-slate-600 mt-2"><span className="font-semibold text-navy">Previous office response:</span> {meta.response}</div>
                {meta.cases.length > 0 && <div className="text-xs text-slate-600 mt-1"><span className="font-semibold text-navy">Linked cases:</span> {meta.cases.join(" · ")}</div>}
                <div className="mt-3 space-y-1.5">
                  {list.slice(0, 3).map(a => (
                    <div key={a.id} className="flex items-center gap-2 text-xs text-slate-600">
                      <ChevronRight className="h-3 w-3 text-slate-400" />
                      <span className="font-medium text-navy">{a.source}</span>
                      <span className="text-slate-400">·</span>
                      <span className="truncate">{a.headline}</span>
                      <Badge variant="outline" className={`ml-auto shrink-0 text-[10px] ${sentimentClass[a.sentiment]}`}>{a.sentiment}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
              <Button size="sm" className="h-7 text-xs bg-navy hover:bg-navy/90 text-white" onClick={() => onTimeline(key)}>View Issue Timeline</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onIssueAction("link-issue", key)}>Link to Existing Case</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onIssueAction("escalate", key)}>Create Escalation</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onAction("draft-response", latest)}>Draft Follow-up Statement</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onAction("add-briefing", latest)}>Add to Daily Briefing</Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ─────────── Media Outreach ───────────
// (Media Outreach panel moved to press-desk-workflow.tsx)

// ─────────── Source Health ───────────
function SourceHealthTab() {
  const [sources, setSources] = useState(SOURCES);
  const connected = sources.filter(s => s.status === "Connected").length;
  const errors = sources.filter(s => s.status === "Error").length;
  const paused = sources.filter(s => s.status === "Paused").length;
  const total = sources.reduce((s, x) => s + x.pulled, 0);
  const set = (id: string, patch: Partial<typeof sources[number]>) => setSources(list => list.map(s => s.id === id ? { ...s, ...patch } : s));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Metric label="Connected Sources" value={connected} tone="text-emerald-600" />
        <Metric label="Feed Errors" value={errors} tone="text-rose-600" />
        <Metric label="Paused Sources" value={paused} tone="text-amber-600" />
        <Metric label="Articles Today" value={total} tone="text-navy" />
        <Card className="p-3"><div className="text-[10px] uppercase tracking-wider text-slate-500">Last Sync</div><div className="text-sm font-bold mt-1 text-navy">3 min ago</div></Card>
      </div>
      <Card className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="text-left p-3">Source</th><th className="text-left p-3">Type</th>
              <th className="text-left p-3">Geo</th><th className="text-left p-3">Lang</th>
              <th className="text-left p-3">Status</th><th className="text-left p-3">Last Sync</th>
              <th className="text-left p-3">Articles Today</th><th className="text-left p-3">Error</th>
              <th className="text-right p-3 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sources.map(s => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="p-3 font-medium text-navy">{s.name}</td>
                <td className="p-3 text-slate-700">{s.type}</td>
                <td className="p-3 text-slate-700">{s.geography}</td>
                <td className="p-3 text-slate-700">{s.language}</td>
                <td className="p-3">
                  <Badge variant="outline" className={
                    s.status === "Connected" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    s.status === "Error" ? "bg-rose-50 text-rose-700 border-rose-200" :
                    "bg-amber-50 text-amber-700 border-amber-200"}>
                    {s.status === "Connected" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {s.status === "Error" && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {s.status}
                  </Badge>
                </td>
                <td className="p-3 text-slate-700">{s.lastSync}</td>
                <td className="p-3 tabular-nums text-slate-700">{s.pulled}</td>
                <td className="p-3 text-[11px] text-rose-600">{s.error || "—"}</td>
                <td className="p-3 text-right pr-4">
                  <div className="inline-flex gap-1">
                    {s.status === "Connected" && <>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { set(s.id, { lastSync: "Just now", pulled: s.pulled + 3 }); toast.success(`${s.name} synced`); }}><RefreshCw className="h-3 w-3" /></Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { set(s.id, { status: "Paused" }); toast(`${s.name} paused`); }}><Pause className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-rose-600" onClick={() => { setSources(l => l.filter(x => x.id !== s.id)); toast(`Removed`); }}><Trash2 className="h-3 w-3" /></Button>
                    </>}
                    {s.status === "Error" && <>
                      <Button size="sm" className="h-7 text-xs bg-rose-600 hover:bg-rose-700 text-white" onClick={() => { set(s.id, { status: "Connected", error: "", lastSync: "Just now", pulled: 2 }); toast.success("Feed fixed"); }}><Wrench className="h-3 w-3 mr-1" />Fix</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { set(s.id, { status: "Connected", error: "", lastSync: "Just now", pulled: 1 }); toast.success("Retry succeeded"); }}><RefreshCw className="h-3 w-3" /></Button>
                    </>}
                    {s.status === "Paused" && <>
                      <Button size="sm" className="h-7 text-xs bg-navy hover:bg-navy/90 text-white" onClick={() => { set(s.id, { status: "Connected", lastSync: "Just now" }); toast.success(`${s.name} resumed`); }}><Play className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-rose-600" onClick={() => { setSources(l => l.filter(x => x.id !== s.id)); toast(`Removed`); }}><Trash2 className="h-3 w-3" /></Button>
                    </>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─────────── Action Dialog (generic) ───────────
function ActionDialog({ req, onClose, onSubmit }: { req: ActionRequest | null; onClose: () => void; onSubmit: (r: ActionRequest, payload: Record<string, string>) => void }) {
  const [values, setValues] = useState<Record<string, string>>({});
  if (!req) return null;
  const meta = ACTION_META[req.key];
  return (
    <Dialog open={!!req} onOpenChange={(o) => { if (!o) { setValues({}); onClose(); } }}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-navy">{meta.title}</DialogTitle>
          {(meta.desc || req.article) && (
            <DialogDescription>
              {meta.desc}
              {req.article && <div className="mt-1 text-slate-600">Article: <span className="font-medium">{req.article.headline}</span></div>}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="space-y-3">
          {meta.fields.map(f => (
            <div key={f.key} className="space-y-1.5">
              <Label className="text-xs uppercase text-slate-500 tracking-wide">{f.label}</Label>
              {f.type === "textarea" ? (
                <Textarea rows={4} placeholder={f.placeholder} value={values[f.key] ?? ""} onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))} />
              ) : f.type === "select" ? (
                <Select value={values[f.key] ?? ""} onValueChange={(v) => setValues(x => ({ ...x, [f.key]: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>{f.options!.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              ) : (
                <Input placeholder={f.placeholder} value={values[f.key] ?? ""} onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))} />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { setValues({}); onClose(); }}>Cancel</Button>
          <Button className="bg-navy hover:bg-navy/90 text-white" onClick={() => { onSubmit(req, values); setValues({}); }}>{meta.cta}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────── Issue Timeline Drawer ───────────
function IssueTimelineDrawer({ issueKey, articles, onClose, onAction, onIssueAction }: { issueKey: string | null; articles: Article[]; onClose: () => void; onAction: (k: ActionKey, a: Article) => void; onIssueAction: (k: ActionKey, key: string) => void }) {
  const list = articles.filter(a => a.issueKey === issueKey);
  const meta = issueKey ? REPEAT_META[issueKey] : null;
  const latest = list[0];
  return (
    <Sheet open={!!issueKey} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader><SheetTitle className="text-navy">Issue Timeline</SheetTitle></SheetHeader>
        {meta && (
          <div className="mt-4 space-y-4 text-sm">
            <Section title="Issue Summary"><p className="text-slate-700">{meta.name}</p></Section>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Kv k="First Reported" v={meta.firstReported} />
              <Kv k="Latest Coverage" v={latest?.time ?? "—"} />
              <Kv k="Geographies" v={meta.geos.join(", ")} />
              <Kv k="Trend" v={meta.trend} />
              <Kv k="Mentions" v={String(list.length)} />
              <Kv k="Public Sentiment" v="Mostly Negative" />
            </div>
            <Section title="Media Sources Covering">
              <div className="flex flex-wrap gap-1.5">
                {Array.from(new Set(list.map(a => a.source))).map(s => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
              </div>
            </Section>
            <Section title="Related Citizen Cases">
              <p className="text-xs text-slate-600">{meta.cases.length ? meta.cases.join(" · ") : "None linked yet."}</p>
            </Section>
            <Section title="Previous Office Response">
              <p className="text-xs text-slate-700">{meta.response}</p>
            </Section>
            <Section title="Coverage Timeline">
              <div className="space-y-2">
                {list.map(a => (
                  <div key={a.id} className="rounded border border-slate-200 p-2.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="font-medium text-navy">{a.source}</span><span>·</span><span>{a.time}</span>
                      <Badge variant="outline" className={`ml-auto text-[10px] ${sentimentClass[a.sentiment]}`}>{a.sentiment}</Badge>
                    </div>
                    <p className="text-slate-800 mt-1">{a.headline}</p>
                    {a.status !== "New" && <p className="text-[11px] text-slate-500 mt-1">Action taken: {a.status}</p>}
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Recommended Next Action">
              <p className="text-xs text-slate-700">Draft a consolidated follow-up statement and escalate to BBMP Commissioner with 72-hour deadline.</p>
            </Section>
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
              {latest && <Button size="sm" className="h-7 text-xs bg-navy hover:bg-navy/90 text-white" onClick={() => onAction("draft-response", latest)}>Draft Follow-up</Button>}
              {latest && <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onAction("create-case", latest)}>Create Case</Button>}
              {latest && <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onAction("assign", latest)}>Assign Owner</Button>}
              {latest && <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onAction("add-briefing", latest)}>Add to Briefing</Button>}
              {issueKey && <Button size="sm" variant="ghost" className="h-7 text-xs text-emerald-700" onClick={() => { toast.success("Issue marked closed"); onClose(); }}><CheckCircle2 className="h-3 w-3 mr-1" />Close Issue</Button>}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">{title}</div>
      {children}
    </div>
  );
}
function Kv({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded bg-slate-50 border border-slate-200 p-2">
      <div className="text-[10px] uppercase text-slate-500">{k}</div>
      <div className="text-xs font-semibold text-navy mt-0.5">{v}</div>
    </div>
  );
}

// ─────────── Press Desk (preserved) ───────────
type PressContact = { name: string; outlet: string; beat: string; phone: string; relationship: "Warm" | "Steady" | "Cold"; lastTouch: string };
const PRESS_CONTACTS: PressContact[] = [
  { name: "A. Prakash", outlet: "Prajavani", beat: "Politics — Bengaluru East", phone: "+91 98800 77881", relationship: "Warm", lastTouch: "4 d" },
  { name: "R. Iyer", outlet: "Deccan Herald", beat: "Civic / BBMP", phone: "+91 98452 33001", relationship: "Steady", lastTouch: "12 d" },
  { name: "S. Murthy", outlet: "Times of India", beat: "Infrastructure", phone: "+91 98452 99110", relationship: "Steady", lastTouch: "8 d" },
  { name: "Anjali Pinto", outlet: "The Hindu", beat: "Policy & Parliament", phone: "+91 98860 21134", relationship: "Warm", lastTouch: "2 d" },
  { name: "K. Hegde", outlet: "Vijaya Karnataka", beat: "State politics", phone: "+91 99004 19087", relationship: "Cold", lastTouch: "42 d" },
  { name: "Rohit Kumar", outlet: "TV9 Kannada", beat: "Breaking / city", phone: "+91 99000 33491", relationship: "Steady", lastTouch: "6 d" },
];
type PressQuery = { id: string; journalist: string; outlet: string; topic: string; deadline: string; sensitivity: "Low" | "Medium" | "High"; status: "Incoming" | "Drafting" | "Awaiting MP" | "Approved" | "Sent"; draft?: string; approvedQuote?: string; };
const PRESS_QUERIES: PressQuery[] = [
  { id: "PQ-041", journalist: "R. Iyer", outlet: "Deccan Herald", topic: "MP's position on Mahadayi water sharing in Belagavi belt", deadline: "Today 18:00", sensitivity: "High", status: "Awaiting MP", draft: "On Mahadayi, our position is clear: every drop allocated by the tribunal must reach Karnataka farmers without delay." },
  { id: "PQ-040", journalist: "S. Murthy", outlet: "Times of India", topic: "ORR last-mile shuttle progress", deadline: "Tomorrow 11:00", sensitivity: "Medium", status: "Drafting" },
  { id: "PQ-039", journalist: "Anjali Pinto", outlet: "The Hindu", topic: "Citizen Pulse — case management approach", deadline: "Fri 14:00", sensitivity: "Low", status: "Approved", approvedQuote: "Every grievance gets a ticket, an owner, and a deadline." },
];
const sensTone: Record<PressQuery["sensitivity"], string> = { Low: "bg-emerald-50 text-emerald-700 border-emerald-200", Medium: "bg-amber-50 text-amber-800 border-amber-200", High: "bg-red-50 text-red-700 border-red-200" };
const pqStatusTone: Record<PressQuery["status"], string> = { Incoming: "bg-slate-100 text-slate-700 border-slate-200", Drafting: "bg-blue-50 text-blue-700 border-blue-200", "Awaiting MP": "bg-saffron/15 text-saffron border-saffron/40", Approved: "bg-emerald-50 text-emerald-700 border-emerald-200", Sent: "bg-navy/5 text-navy border-navy/20" };

function PressDeskPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-3">
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-navy mb-3">Incoming press queries</h3>
          <div className="space-y-3">
            {PRESS_QUERIES.map(q => (
              <div key={q.id} className="rounded-lg border p-3">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-semibold text-navy">{q.journalist}</span>
                  <span className="text-slate-500">· {q.outlet}</span>
                  <Badge variant="outline" className={sensTone[q.sensitivity]}>{q.sensitivity} sensitivity</Badge>
                  <Badge variant="outline" className={pqStatusTone[q.status]}>{q.status}</Badge>
                  <span className="ml-auto text-slate-500">Deadline: <span className="font-medium text-navy">{q.deadline}</span></span>
                </div>
                <div className="text-sm text-slate-900 mt-1.5 font-medium">{q.topic}</div>
                {q.draft && <div className="mt-2 rounded-md bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-700"><span className="text-[10px] uppercase text-slate-500">Draft response</span><p className="mt-1">{q.draft}</p></div>}
                {q.approvedQuote && <div className="mt-2 rounded-md bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-900"><span className="text-[10px] uppercase text-emerald-700">✓ Approved quote</span><p className="mt-1 italic">"{q.approvedQuote}"</p></div>}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Button size="sm" className="h-7 text-xs bg-navy text-white hover:bg-navy/90" onClick={() => toast.success("Response drafted")}>Draft response</Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success("Sent to MP")}>Send to MP</Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success("Coverage logged")}>Log coverage</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-navy mb-3">Media contacts</h3>
        <div className="space-y-2.5">
          {PRESS_CONTACTS.map(c => (
            <div key={c.name} className="rounded-md border p-2.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium text-navy text-sm">{c.name}</div>
                  <div className="text-[11px] text-slate-500">{c.outlet} · {c.beat}</div>
                </div>
                <Badge variant="outline" className={
                  c.relationship === "Warm" ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]" :
                  c.relationship === "Steady" ? "bg-blue-50 text-blue-700 border-blue-200 text-[10px]" :
                  "bg-rose-50 text-rose-700 border-rose-200 text-[10px]"
                }>{c.relationship}</Badge>
              </div>
              <div className="text-[10px] text-slate-400 mt-1.5">{c.phone} · last touch {c.lastTouch}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
