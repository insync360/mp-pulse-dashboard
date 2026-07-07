// Module-scoped store for Press Desk / Media Outreach / Letterhead.
// Uses useSyncExternalStore so any component in Media Watch or Settings
// stays in sync when responses, journalists, lists or the letterhead change.
import { useSyncExternalStore } from "react";

export type ResponseStatus =
  | "Draft Generated"
  | "Under Review"
  | "Approved by PA"
  | "Approved by MP"
  | "Sent to Media"
  | "Published"
  | "Archived"
  | "Rejected";

export type ResponseType =
  | "Official Statement" | "Press Release" | "Media Response" | "Clarification"
  | "Rebuttal" | "Condolence Statement" | "Appreciation Note" | "Development Update"
  | "Public Advisory" | "Departmental Response" | "Quote for Media"
  | "Social Media Response" | "Assembly / Parliament Talking Point";

export type Tone =
  | "Neutral" | "Empathetic" | "Firm" | "Reassuring" | "Administrative"
  | "Political" | "Urgent" | "Celebratory" | "Defensive" | "Corrective";

export type Position =
  | "Acknowledge issue" | "Seek report from department" | "Announce inspection"
  | "Share action already taken" | "Clarify misinformation" | "Ask officials to act"
  | "Commit to follow-up" | "Appreciate public participation"
  | "Escalate to state/central authority";

export type LanguageOpt =
  | "English" | "Kannada" | "Hindi" | "English + Kannada" | "Kannada + Hindi";

export type OutputFormat =
  | "Full Press Release" | "Short Media Quote" | "Social Media Post" | "WhatsApp Forward"
  | "Talking Points" | "Letter to Department" | "Citizen-Facing Explanation"
  | "Internal Briefing Note";

export const RESPONSE_TYPES: ResponseType[] = [
  "Official Statement","Press Release","Media Response","Clarification","Rebuttal",
  "Condolence Statement","Appreciation Note","Development Update","Public Advisory",
  "Departmental Response","Quote for Media","Social Media Response","Assembly / Parliament Talking Point",
];
export const TONES: Tone[] = ["Neutral","Empathetic","Firm","Reassuring","Administrative","Political","Urgent","Celebratory","Defensive","Corrective"];
export const POSITIONS: Position[] = ["Acknowledge issue","Seek report from department","Announce inspection","Share action already taken","Clarify misinformation","Ask officials to act","Commit to follow-up","Appreciate public participation","Escalate to state/central authority"];
export const LANGUAGES: LanguageOpt[] = ["English","Kannada","Hindi","English + Kannada","Kannada + Hindi"];
export const OUTPUT_FORMATS: OutputFormat[] = ["Full Press Release","Short Media Quote","Social Media Post","WhatsApp Forward","Talking Points","Letter to Department","Citizen-Facing Explanation","Internal Briefing Note"];

export type MediaResponse = {
  id: string;
  title: string;
  sourceArticleId?: string;
  sourceHeadline?: string;
  responseType: ResponseType;
  tone: Tone;
  position: Position;
  language: LanguageOpt;
  outputFormat: OutputFormat;
  letterheadTemplate: string;
  approvalRequired: "PA + MP" | "PA only" | "None";
  targetMediaContacts: string[]; // journalist ids
  targetListId?: string;
  internalOwner: string;
  createdBy: string;
  currentApprover: string;
  status: ResponseStatus;
  body: string;
  createdAt: string;
  updatedAt: string;
  dueAt: string;
  history: { at: string; by: string; note: string }[];
  reviewerComments?: string;
};

export type Journalist = {
  id: string; name: string; publication: string; beat: string; geography: string;
  email: string; phone: string; whatsapp: string; language: string;
  relationshipOwner: string; influenceLevel: "Tier 1" | "Tier 2" | "Tier 3";
  lastContacted: string; notes: string; tags: string[];
};

export type MediaList = { id: string; name: string; journalistIds: string[] };

export type Letterhead = {
  officeName: string; address: string; email: string; phone: string;
  logoName: string; signatureName: string; footer: string; signatory: string;
  defaultLanguage: LanguageOpt; disclaimer: string;
  letterheadFile?: string;
};

export type LinkedRecord = {
  id: string; articleId: string;
  kind: "case" | "commitment" | "inspection" | "followup" | "event" | "briefing" | "social" | "response" | "journalist" | "broadcast";
  label: string; createdAt: string;
};

export type OutreachLog = {
  id: string; journalistId: string; note: string; channel: "Call" | "WhatsApp" | "Email" | "In-Person";
  outcome: "Pending" | "Responded" | "Declined" | "Published"; at: string;
};

type State = {
  responses: MediaResponse[];
  journalists: Journalist[];
  lists: MediaList[];
  letterhead: Letterhead;
  linked: LinkedRecord[];
  outreach: OutreachLog[];
};

const BEATS = ["Politics","Civic","Health","Education","Transport","Environment","Crime","Business","Parliament","State Assembly","Local Bengaluru","Kannada Media","National Media"];
export const BEAT_OPTIONS = BEATS;
export const MEDIA_LIST_OPTIONS = [
  "All Bengaluru Civic Journalists","All Kannada Media","Health Reporters",
  "Tier 1 National Media","Transport Beat Reporters","Custom Media List",
];

const now = () => new Date().toISOString();
const iso = (d: Date) => d.toISOString();
const inHours = (h: number) => iso(new Date(Date.now() + h * 3600_000));

const seedJournalists: Journalist[] = [
  { id: "j1", name: "A. Prakash", publication: "Prajavani", beat: "Politics", geography: "Bengaluru", email: "a.prakash@prajavani.co.in", phone: "+91 98800 77881", whatsapp: "+91 98800 77881", language: "Kannada", relationshipOwner: "Rohan Iyer", influenceLevel: "Tier 2", lastContacted: "4 d ago", notes: "Prefers Kannada quotes.", tags: ["Kannada Media","Local Bengaluru"] },
  { id: "j2", name: "R. Iyer", publication: "Deccan Herald", beat: "Civic", geography: "Bengaluru", email: "r.iyer@deccanherald.com", phone: "+91 98452 33001", whatsapp: "+91 98452 33001", language: "English", relationshipOwner: "Rohan Iyer", influenceLevel: "Tier 1", lastContacted: "12 d ago", notes: "Deep on BBMP.", tags: ["Civic","Local Bengaluru"] },
  { id: "j3", name: "S. Murthy", publication: "Times of India", beat: "Transport", geography: "Bengaluru", email: "s.murthy@toi.in", phone: "+91 98452 99110", whatsapp: "+91 98452 99110", language: "English", relationshipOwner: "Anjali Rao", influenceLevel: "Tier 1", lastContacted: "8 d ago", notes: "Covers ORR beat.", tags: ["Transport","Tier 1 National Media"] },
  { id: "j4", name: "Anjali Pinto", publication: "The Hindu", beat: "Parliament", geography: "National", email: "a.pinto@thehindu.com", phone: "+91 98860 21134", whatsapp: "+91 98860 21134", language: "English", relationshipOwner: "Anjali Rao", influenceLevel: "Tier 1", lastContacted: "2 d ago", notes: "Policy angle preferred.", tags: ["Parliament","National Media"] },
  { id: "j5", name: "K. Hegde", publication: "Vijaya Karnataka", beat: "State Assembly", geography: "Karnataka", email: "k.hegde@vk.com", phone: "+91 99004 19087", whatsapp: "+91 99004 19087", language: "Kannada", relationshipOwner: "Rohan Iyer", influenceLevel: "Tier 2", lastContacted: "42 d ago", notes: "Cold lately — re-warm.", tags: ["Kannada Media","State Assembly"] },
  { id: "j6", name: "Rohit Kumar", publication: "TV9 Kannada", beat: "Local Bengaluru", geography: "Bengaluru", email: "rohit@tv9.com", phone: "+91 99000 33491", whatsapp: "+91 99000 33491", language: "Kannada", relationshipOwner: "Rohan Iyer", influenceLevel: "Tier 2", lastContacted: "6 d ago", notes: "Breaking city desk.", tags: ["Kannada Media","Local Bengaluru"] },
  { id: "j7", name: "M. Rao", publication: "Bangalore Mirror", beat: "Health", geography: "Bengaluru", email: "m.rao@bmirror.com", phone: "+91 98455 22110", whatsapp: "+91 98455 22110", language: "English", relationshipOwner: "Rohan Iyer", influenceLevel: "Tier 2", lastContacted: "18 d ago", notes: "Dengue coverage.", tags: ["Health","Local Bengaluru"] },
];

const seedLists: MediaList[] = [
  { id: "l1", name: "All Bengaluru Civic Journalists", journalistIds: ["j1","j2","j3","j6"] },
  { id: "l2", name: "All Kannada Media", journalistIds: ["j1","j5","j6"] },
  { id: "l3", name: "Health Reporters", journalistIds: ["j7"] },
  { id: "l4", name: "Tier 1 National Media", journalistIds: ["j3","j4"] },
  { id: "l5", name: "Transport Beat Reporters", journalistIds: ["j3"] },
];

const seedResponses: MediaResponse[] = [
  {
    id: "R-102", title: "Whitefield flooding — official response",
    sourceArticleId: "a1", sourceHeadline: "Civic body slammed over Whitefield flooding as monsoon exposes drain neglect",
    responseType: "Official Statement", tone: "Firm", position: "Share action already taken",
    language: "English + Kannada", outputFormat: "Full Press Release", letterheadTemplate: "Default MP Letterhead",
    approvalRequired: "PA + MP", targetMediaContacts: ["j2","j3"], targetListId: "l1",
    internalOwner: "Rohan Iyer", createdBy: "Anjali Rao", currentApprover: "PA — Pooja Hegde",
    status: "Under Review", body: DEFAULT_DRAFT("Whitefield flooding"), createdAt: iso(new Date(Date.now()-3600_000)), updatedAt: iso(new Date(Date.now()-1200_000)), dueAt: inHours(4),
    history: [{ at: iso(new Date(Date.now()-3600_000)), by: "Anjali Rao", note: "Draft generated" }, { at: iso(new Date(Date.now()-1200_000)), by: "Anjali Rao", note: "Sent for PA review" }],
  },
  {
    id: "R-101", title: "Mahadevapura lake shramadaan — appreciation",
    sourceHeadline: "Mahadevapura lake rejuvenation drive draws 1,200 volunteers over weekend",
    responseType: "Appreciation Note", tone: "Celebratory", position: "Appreciate public participation",
    language: "English", outputFormat: "Short Media Quote", letterheadTemplate: "Default MP Letterhead",
    approvalRequired: "PA only", targetMediaContacts: ["j1","j2"],
    internalOwner: "Rohan Iyer", createdBy: "Rohan Iyer", currentApprover: "MP",
    status: "Approved by MP", body: DEFAULT_DRAFT("Mahadevapura lake volunteers"), createdAt: iso(new Date(Date.now()-7*3600_000)), updatedAt: iso(new Date(Date.now()-2*3600_000)), dueAt: inHours(24),
    history: [{ at: iso(new Date(Date.now()-7*3600_000)), by: "Rohan Iyer", note: "Draft generated" }, { at: iso(new Date(Date.now()-3*3600_000)), by: "Pooja Hegde", note: "PA approved" }, { at: iso(new Date(Date.now()-2*3600_000)), by: "MP Office", note: "MP approved" }],
  },
  {
    id: "R-100", title: "Metro Phase 3 — social amplification",
    sourceHeadline: "Bengaluru MP pushes Centre on Namma Metro Phase 3 funding clearance",
    responseType: "Social Media Response", tone: "Reassuring", position: "Share action already taken",
    language: "English", outputFormat: "Social Media Post", letterheadTemplate: "—",
    approvalRequired: "PA only", targetMediaContacts: ["j4","j3"],
    internalOwner: "Rohan Iyer", createdBy: "Rohan Iyer", currentApprover: "—",
    status: "Sent to Media", body: DEFAULT_DRAFT("Metro Phase 3"), createdAt: iso(new Date(Date.now()-26*3600_000)), updatedAt: iso(new Date(Date.now()-20*3600_000)), dueAt: inHours(-2),
    history: [{ at: iso(new Date(Date.now()-26*3600_000)), by: "Rohan Iyer", note: "Draft generated" }, { at: iso(new Date(Date.now()-24*3600_000)), by: "MP Office", note: "MP approved" }, { at: iso(new Date(Date.now()-20*3600_000)), by: "Rohan Iyer", note: "Sent to media list" }],
  },
];

function DEFAULT_DRAFT(topic: string) {
  return `HEADLINE: Statement on ${topic}\n\nDate: ${new Date().toDateString()}\nOffice of the Hon'ble MP, Bengaluru\n\nWe have taken note of the concerns raised by residents and media on the matter of ${topic}. Our office is in active coordination with the concerned departments to ensure a time-bound resolution.\n\n"${topic} is a priority for this office. We have already directed the relevant department to file an action-taken report within 72 hours, and I will personally review progress on site." — MP\n\nOur office commits to a public update within a week and requests all stakeholders to continue reporting on-ground observations through our grievance channels.\n\n— Issued by: Office of the MP\nContact: press@mpoffice.in · +91 80 4567 8900`;
}

const initial: State = {
  responses: seedResponses,
  journalists: seedJournalists,
  lists: seedLists,
  letterhead: {
    officeName: "Office of the Hon'ble MP, Bengaluru",
    address: "Parliamentary Constituency Office, MG Road, Bengaluru — 560001",
    email: "press@mpoffice.in", phone: "+91 80 4567 8900",
    logoName: "party-symbol.png", signatureName: "mp-signature.png",
    footer: "Issued by the Office of the MP · Not for circulation without attribution.",
    signatory: "Hon'ble Member of Parliament — Bengaluru",
    defaultLanguage: "English + Kannada",
    disclaimer: "This communication is issued in an official capacity and represents the position of the MP's office at the time of release.",
    letterheadFile: "mp-letterhead-official.png",
  },
  linked: [
    { id: "L1", articleId: "a1", kind: "case", label: "CASE-4088 · Varthur outfall", createdAt: iso(new Date(Date.now()-2*3600_000)) },
    { id: "L2", articleId: "a1", kind: "response", label: "R-102 · Under Review", createdAt: iso(new Date(Date.now()-3600_000)) },
    { id: "L3", articleId: "a5", kind: "response", label: "R-101 · Approved by MP", createdAt: iso(new Date(Date.now()-7*3600_000)) },
    { id: "L4", articleId: "a2", kind: "social", label: "Social post drafted", createdAt: iso(new Date(Date.now()-2*3600_000)) },
  ],
  outreach: [],
};

let state: State = initial;
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
const emit = () => { listeners.forEach(l => l()); };
const setState = (patch: Partial<State> | ((s: State) => Partial<State>)) => {
  const p = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...p }; emit();
};

// Selectors
export const useResponses = () => useSyncExternalStore(subscribe, () => state.responses, () => state.responses);
export const useJournalists = () => useSyncExternalStore(subscribe, () => state.journalists, () => state.journalists);
export const useLists = () => useSyncExternalStore(subscribe, () => state.lists, () => state.lists);
export const useLetterhead = () => useSyncExternalStore(subscribe, () => state.letterhead, () => state.letterhead);
export const useLinkedForArticle = (articleId?: string) => {
  const linked = useSyncExternalStore(subscribe, () => state.linked, () => state.linked);
  return articleId ? linked.filter(l => l.articleId === articleId) : linked;
};
export const useOutreach = () => useSyncExternalStore(subscribe, () => state.outreach, () => state.outreach);

// Mutations
let rSeq = 200;
export const createResponse = (r: Omit<MediaResponse, "id" | "createdAt" | "updatedAt" | "history" | "status"> & { status?: ResponseStatus; body?: string }) => {
  const id = `R-${++rSeq}`;
  const item: MediaResponse = {
    ...r, id, status: r.status ?? "Draft Generated",
    body: r.body ?? DEFAULT_DRAFT(r.title),
    createdAt: now(), updatedAt: now(),
    history: [{ at: now(), by: r.createdBy, note: "Draft generated" }],
  };
  setState(s => ({ responses: [item, ...s.responses] }));
  if (r.sourceArticleId) addLinked(r.sourceArticleId, "response", `${id} · ${item.status}`);
  return item;
};
export const updateResponse = (id: string, patch: Partial<MediaResponse>, historyNote?: string, actor = "Anjali Rao") => {
  setState(s => ({
    responses: s.responses.map(r => r.id === id ? {
      ...r, ...patch, updatedAt: now(),
      history: historyNote ? [...r.history, { at: now(), by: actor, note: historyNote }] : r.history,
    } : r),
  }));
};
export const deleteResponse = (id: string) => setState(s => ({ responses: s.responses.filter(r => r.id !== id) }));
export const generateDraftBody = (opts: { title: string; responseType: ResponseType; tone: Tone; position: Position; sourceHeadline?: string; variation?: number }) => {
  const v = opts.variation ?? 0;
  const openings = [
    `Statement on ${opts.title}`,
    `On the matter of ${opts.title} — an official update`,
    `Response from the Office of the MP: ${opts.title}`,
  ];
  const tones: Record<Tone, string> = {
    Neutral: "We have noted the matter and are examining the details.",
    Empathetic: "We deeply understand the anxiety this has caused to residents and stand with you.",
    Firm: "This office does not accept administrative delay as an excuse. Action will follow.",
    Reassuring: "Every step is being taken to ensure a time-bound and transparent resolution.",
    Administrative: "The concerned department has been formally directed to file an action-taken report.",
    Political: "This office remains committed to representing the voice of the constituency in Parliament.",
    Urgent: "This is a matter of urgent public interest. The following interim steps have been ordered.",
    Celebratory: "It is a moment of pride for the constituency, and we thank every stakeholder involved.",
    Defensive: "The record of this office on this issue is clear, documented, and in the public domain.",
    Corrective: "Certain factual inaccuracies have appeared in circulation; the correct position is set out below.",
  };
  const positions: Record<Position, string> = {
    "Acknowledge issue": "We acknowledge the concern raised and are actively examining the matter.",
    "Seek report from department": "A formal report has been sought from the concerned department within 72 hours.",
    "Announce inspection": "An on-site inspection by the office has been scheduled within the next 48 hours.",
    "Share action already taken": "Action has already been initiated by this office; a progress note is annexed below.",
    "Clarify misinformation": "Certain claims currently in circulation are inaccurate; the correct facts are set out below.",
    "Ask officials to act": "The concerned officials are hereby requested to move on this without further delay.",
    "Commit to follow-up": "This office will publish a follow-up update within one week and remains available for further clarification.",
    "Appreciate public participation": "We wholeheartedly appreciate every citizen and stakeholder who contributed to this effort.",
    "Escalate to state/central authority": "The matter has been escalated to the appropriate state / central authority for expeditious action.",
  };
  return `${openings[v % openings.length]}\nDate: ${new Date().toDateString()}\nOffice of the Hon'ble MP, Bengaluru\n\n${tones[opts.tone]}\n\n${positions[opts.position]}\n\n${opts.sourceHeadline ? `Reference report: "${opts.sourceHeadline}"\n\n` : ""}"${opts.title} matters to every family in this constituency. My office will not rest until a fair and time-bound outcome is delivered." — MP\n\n— Issued by: Office of the MP\nContact: press@mpoffice.in · +91 80 4567 8900`;
};

export const addJournalist = (j: Omit<Journalist, "id">) => {
  const id = `j-${Date.now()}`;
  setState(s => ({ journalists: [{ ...j, id }, ...s.journalists] }));
  return id;
};
export const addList = (name: string, journalistIds: string[]) => {
  const id = `l-${Date.now()}`;
  setState(s => ({ lists: [...s.lists, { id, name, journalistIds }] }));
  return id;
};
export const logOutreach = (o: Omit<OutreachLog, "id" | "at">) => {
  const id = `o-${Date.now()}`;
  setState(s => ({ outreach: [{ ...o, id, at: now() }, ...s.outreach] }));
  return id;
};
export const setLetterhead = (patch: Partial<Letterhead>) => setState(s => ({ letterhead: { ...s.letterhead, ...patch } }));

export const addLinked = (articleId: string, kind: LinkedRecord["kind"], label: string) => {
  const id = `L-${Date.now()}`;
  setState(s => ({ linked: [...s.linked, { id, articleId, kind, label, createdAt: now() }] }));
  return id;
};

// Status transitions
export const advanceApproval = (id: string, actor: string) => {
  const r = state.responses.find(x => x.id === id);
  if (!r) return;
  const order: ResponseStatus[] = ["Draft Generated","Under Review","Approved by PA","Approved by MP","Sent to Media","Published","Archived"];
  const idx = order.indexOf(r.status);
  const nextStatus = order[Math.min(idx + 1, order.length - 1)];
  updateResponse(id, { status: nextStatus, currentApprover: nextStatus === "Approved by PA" ? "MP" : nextStatus === "Approved by MP" ? "—" : r.currentApprover }, `${actor} → ${nextStatus}`, actor);
};

export const fmtRel = (iso: string) => {
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const mins = Math.round(diff / 60000);
  if (Math.abs(mins) < 60) return `${mins <= 0 ? "in " : ""}${Math.abs(mins)}m${mins > 0 ? " ago" : ""}`;
  const hrs = Math.round(mins / 60);
  if (Math.abs(hrs) < 24) return `${hrs <= 0 ? "in " : ""}${Math.abs(hrs)}h${hrs > 0 ? " ago" : ""}`;
  const days = Math.round(hrs / 24);
  return `${days <= 0 ? "in " : ""}${Math.abs(days)}d${days > 0 ? " ago" : ""}`;
};
