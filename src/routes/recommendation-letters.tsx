import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FileText, Clock, CheckCircle2, Send, Inbox, Plus, Eye, Printer, Mail,
  MessageSquare, Truck, Sparkles, Shield, AlertTriangle, Search, Link2,
  Building2, Landmark, Users, Briefcase, FileSignature, ArrowRight, X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useData } from "@/data/store";
import { KbTips } from "@/components/kb-tips";
import type { LetterDraftPrefill } from "@/data/types";

export const Route = createFileRoute("/recommendation-letters")({
  head: () => ({ meta: [{ title: "Letters & Correspondence — Citizen Pulse" }] }),
  component: LettersPage,
});


// ──────────────────────────────────────────────────────────────────────────
// Template Library
// ──────────────────────────────────────────────────────────────────────────
type TemplateCategory = "officials" | "ministers" | "departments" | "citizens" | "internal";
type Template = {
  id: string;
  name: string;
  desc: string;
  category: TemplateCategory;
  recipientType: string;
  salutation: string;
  close: string;
  subject: string;
  body: string; // with {merge} fields
  riskClass?: "safe" | "verify" | "legal" | "conflict" | "mp";
};

const TEMPLATES: Template[] = [
  // Officials
  { id: "dc", category: "officials", name: "To Deputy Commissioner (DC)", desc: "Administrative request to district authority", recipientType: "Deputy Commissioner", salutation: "Respected Sir/Madam,", close: "With regards,", subject: "Request for {action} — {location}",
    body: "I am writing with reference to the matter concerning {subjectName}, resident of {location}. {issue}\n\nI request your good office to {request} at the earliest. The matter is of public importance and timely intervention will greatly help the residents.\n\nKindly intimate this office of the action taken." },
  { id: "mc", category: "officials", name: "To Municipal Commissioner", desc: "Civic body intervention", recipientType: "Municipal Commissioner, BBMP", salutation: "Respected Sir/Madam,", close: "With regards,", subject: "Civic intervention sought — {location}",
    body: "The residents of {location} have brought to my notice the following civic issue: {issue}\n\nI request BBMP to {request}. Kindly direct the concerned zonal officer to take prompt action.\n\nA report on action taken may please be sent to this office." },
  { id: "tahsildar", category: "officials", name: "To Tahsildar", desc: "Revenue / land record matters", recipientType: "Tahsildar", salutation: "Respected Sir/Madam,", close: "With regards,", subject: "Revenue matter — {subjectName}",
    body: "Sri/Smt. {subjectName}, resident of {location}, has approached this office regarding {issue}.\n\nI request you to examine the matter as per rules and {request}." },
  { id: "police", category: "officials", name: "To Police Commissioner / SP", desc: "Law & order representation", recipientType: "Commissioner of Police", salutation: "Respected Sir/Madam,", close: "With regards,", subject: "Law & order representation — {location}",
    body: "I have received representations from residents of {location} regarding {issue}.\n\nI request you to {request} and ensure adequate policing in the area. Kindly apprise this office of the action initiated." },
  { id: "sho", category: "officials", name: "To Station House Officer (SHO)", desc: "Local police station follow-up", recipientType: "Station House Officer", salutation: "Respected Sir/Madam,", close: "With regards,", subject: "Follow-up on complaint — {subjectName}",
    body: "With reference to complaint dated {date} filed by {subjectName} ({issue}), I request you to update on the progress of the investigation and ensure that lawful action is taken without delay." },
  { id: "pwd", category: "officials", name: "To PWD Executive Engineer", desc: "Roads / public works request", recipientType: "Executive Engineer, PWD", salutation: "Respected Sir/Madam,", close: "With regards,", subject: "Public works — {location}",
    body: "Several residents and RWAs of {location} have represented that {issue}. I request you to depute an engineer for inspection and {request}." },
  { id: "bbmp", category: "officials", name: "To BBMP Zonal Officer", desc: "Ward-level civic action", recipientType: "BBMP Zonal Joint Commissioner", salutation: "Respected Sir/Madam,", close: "With regards,", subject: "Ward-level civic matter — {location}",
    body: "The following civic complaint has been reported from {location}: {issue}.\n\nKindly direct the AEE/AE concerned to attend and {request}." },
  { id: "bescom", category: "officials", name: "To BESCOM Engineer", desc: "Electricity supply issues", recipientType: "Executive Engineer, BESCOM", salutation: "Respected Sir/Madam,", close: "With regards,", subject: "Electricity supply concern — {location}",
    body: "Residents of {location} are facing {issue}. I request BESCOM to {request} on priority and restore reliable supply." },
  { id: "bwssb", category: "officials", name: "To BWSSB Engineer", desc: "Water supply / sewerage", recipientType: "Executive Engineer, BWSSB", salutation: "Respected Sir/Madam,", close: "With regards,", subject: "Water supply representation — {location}",
    body: "I have received representations from {location} that {issue}. I request BWSSB to {request} and ensure equitable supply to the affected wards." },
  { id: "health", category: "officials", name: "To District Health Officer", desc: "Healthcare / PHC matters", recipientType: "District Health Officer", salutation: "Respected Sir/Madam,", close: "With regards,", subject: "Public health matter — {location}",
    body: "The following health-related concern has been raised by residents of {location}: {issue}. I request you to {request}." },
  { id: "edu", category: "officials", name: "To Education Officer (BEO/DDPI)", desc: "School / education issues", recipientType: "Block Education Officer", salutation: "Respected Sir/Madam,", close: "With regards,", subject: "Education matter — {location}",
    body: "Regarding {issue} at {location}, I request you to examine the matter and {request} so that students are not put to hardship." },
  { id: "railway", category: "officials", name: "To Divisional Railway Manager", desc: "Railway services / stations", recipientType: "Divisional Railway Manager, SWR Bengaluru", salutation: "Respected Sir/Madam,", close: "With regards,", subject: "Railway services representation",
    body: "Several commuters from my constituency have represented that {issue}. I request the Railways to {request} keeping public convenience in mind." },
  { id: "nhai", category: "officials", name: "To NHAI Project Director", desc: "National highway projects", recipientType: "Project Director, NHAI", salutation: "Respected Sir/Madam,", close: "With regards,", subject: "Highway project representation",
    body: "With reference to {issue} on the NH stretch near {location}, I request NHAI to {request} to ensure safety and minimise inconvenience." },

  // Ministers / Political
  { id: "state-min", category: "ministers", name: "To State Minister", desc: "Policy / state-level request", recipientType: "Hon'ble Minister, Government of Karnataka", salutation: "Respected Sir/Madam,", close: "With warm regards,", subject: "Representation — {action}",
    body: "I take this opportunity to bring to your kind notice {issue}.\n\nI request your kind intervention to {request}. This will greatly benefit the people of {location} and reaffirm the government's commitment to public welfare." },
  { id: "central-min", category: "ministers", name: "To Central Minister", desc: "Union ministry matter", recipientType: "Hon'ble Union Minister", salutation: "Respected Sir/Madam,", close: "With warm regards,", subject: "Representation from Bengaluru constituency",
    body: "I respectfully bring to your notice {issue} affecting residents of {location}. I request the Hon'ble Ministry to {request}. Your intervention would be deeply appreciated by the people of my constituency." },
  { id: "party", category: "ministers", name: "To Party Functionary", desc: "Internal party correspondence", recipientType: "Hon'ble Party Functionary", salutation: "Respected Sir/Madam,", close: "Yours sincerely,", subject: "Constituency matter — {location}",
    body: "I wish to apprise you of {issue} and the steps being taken at the constituency level. I request your guidance on {request}." },

  // Departments
  { id: "formal-req", category: "departments", name: "Formal Request", desc: "Standard departmental request", recipientType: "Concerned Department", salutation: "Respected Sir/Madam,", close: "With regards,", subject: "Formal request — {action}",
    body: "I am writing to formally request {request} in respect of {issue} pertaining to {location}. Kindly process the matter as per applicable rules." },
  { id: "followup", category: "departments", name: "Follow-up Reminder", desc: "Reminder on a pending request", recipientType: "Concerned Department", salutation: "Respected Sir/Madam,", close: "With regards,", subject: "Follow-up — Ref. {refNo}",
    body: "With reference to my letter dated {date} ({refNo}) regarding {issue}, I have not yet received a response. I request you to expedite the matter and update this office at the earliest." },
  { id: "escalation", category: "departments", name: "Escalation Letter", desc: "Escalate to senior authority", recipientType: "Senior Authority", salutation: "Respected Sir/Madam,", close: "With regards,", subject: "Escalation — {issue}",
    body: "Despite earlier correspondence (Ref: {refNo}, dated {date}) regarding {issue}, the matter remains unresolved. I am constrained to escalate it to your good office and request {request} on priority." },

  // Citizens / Institutions
  { id: "recommend", category: "citizens", name: "Recommendation Letter", desc: "Recommendation for scheme / opportunity", recipientType: "To Whom It May Concern", salutation: "To Whom It May Concern,", close: "Sincerely,", subject: "Recommendation — {subjectName}",
    body: "This is to recommend {subjectName}, resident of {location}, for {request}. The applicant is known to this office and the request is made in public interest, subject to due verification by the competent authority.",
    riskClass: "mp" },
  { id: "reference", category: "citizens", name: "Reference / Support Letter", desc: "Character or eligibility reference", recipientType: "Concerned Authority", salutation: "To Whom It May Concern,", close: "Sincerely,", subject: "Reference for {subjectName}",
    body: "I extend my reference for {subjectName} ({location}) in connection with {issue}. Kindly extend due consideration as per applicable rules and on merit.", riskClass: "verify" },
  { id: "condolence", category: "citizens", name: "Condolence Letter", desc: "Bereavement message", recipientType: "Family of the deceased", salutation: "Dear {subjectName},", close: "With heartfelt condolences,", subject: "Heartfelt Condolences",
    body: "I was deeply saddened to learn about the passing of your beloved family member. Please accept my sincere condolences. May you and your family find strength in this time of grief.\n\nMy thoughts and prayers are with you." },
  { id: "congrats", category: "citizens", name: "Congratulatory Letter", desc: "Honours / achievements", recipientType: "Recipient", salutation: "Dear {subjectName},", close: "With warm regards,", subject: "Hearty Congratulations",
    body: "It gives me immense pleasure to congratulate you on {issue}. This is a proud moment for {location} and the entire constituency. I wish you continued success in all your future endeavours." },
  { id: "invite-ack", category: "citizens", name: "Invitation Acknowledgement", desc: "Acceptance / regret of invitation", recipientType: "Inviting Organisation", salutation: "Respected Sir/Madam,", close: "With regards,", subject: "Acknowledgement of Invitation",
    body: "Thank you for the kind invitation to {issue} on {date}. I am pleased to confirm participation, subject to parliamentary commitments. Kindly share the detailed schedule." },
  { id: "appreciation", category: "citizens", name: "Appreciation Letter", desc: "Recognising service / contribution", recipientType: "Recipient", salutation: "Dear {subjectName},", close: "With warm regards,", subject: "Note of Appreciation",
    body: "I take this opportunity to place on record my appreciation for {issue}. Your contribution to {location} sets an inspiring example for our community." },

  // Internal
  { id: "covering", category: "internal", name: "Covering Letter", desc: "Forwarding documents", recipientType: "Concerned Authority", salutation: "Respected Sir/Madam,", close: "With regards,", subject: "Covering letter — {issue}",
    body: "Please find enclosed the documents pertaining to {issue} concerning {subjectName} ({location}). Kindly acknowledge receipt and proceed as per rules." },
  { id: "dispatch", category: "internal", name: "Dispatch Note", desc: "Office dispatch slip", recipientType: "Dispatch Section", salutation: "", close: "", subject: "Dispatch Note",
    body: "Dispatch of letter Ref. {refNo} dated {date} addressed to the concerned authority. Mode: as marked. Acknowledgement to be filed on receipt." },
];

const CATEGORY_META: Record<TemplateCategory, { label: string; icon: any; color: string }> = {
  officials: { label: "To Officials", icon: Building2, color: "text-[#0A1F44]" },
  ministers: { label: "To Ministers / Political", icon: Landmark, color: "text-[#FF9933]" },
  departments: { label: "To Departments", icon: Briefcase, color: "text-blue-700" },
  citizens: { label: "To Citizens / Institutions", icon: Users, color: "text-emerald-700" },
  internal: { label: "Internal", icon: FileSignature, color: "text-slate-700" },
};

// ──────────────────────────────────────────────────────────────────────────
// Register data
// ──────────────────────────────────────────────────────────────────────────
type LetterStatus = "Draft" | "Pending Approval" | "Approved" | "Dispatched" | "Acknowledged" | "Declined";
type Letter = {
  id: string;
  recipient: string;
  category: TemplateCategory;
  subject: string;
  linkedTo?: string;
  status: LetterStatus;
  mode?: "Email" | "Post" | "WhatsApp" | "Physical" | "—";
  date: string;
  templateId: string;
  fields: Record<string, string>;
};

const SEED: Letter[] = [
  { id: "CP/LTR/2026/0247", recipient: "Commissioner, BBMP", category: "officials", subject: "Whitefield flooding — civic intervention sought", linkedTo: "GRV-2026-0418", status: "Pending Approval", mode: "—", date: "26 Jun 2026", templateId: "mc", fields: { subjectName: "RWA Federation", location: "Whitefield", issue: "Repeated flooding of arterial roads during pre-monsoon showers", request: "carry out emergency desilting and audit of stormwater drains" } },
  { id: "CP/LTR/2026/0246", recipient: "EE, BWSSB East Sub-Division", category: "officials", subject: "Water supply representation — KR Puram Ward 84", linkedTo: "GRV-2026-0411", status: "Pending Approval", mode: "—", date: "26 Jun 2026", templateId: "bwssb", fields: { location: "KR Puram Ward 84", issue: "intermittent and contaminated supply for the last 5 days", request: "depute a team for immediate inspection and restoration" } },
  { id: "CP/LTR/2026/0245", recipient: "DCP East, Bengaluru City", category: "officials", subject: "Law & order representation — Mahadevapura", status: "Pending Approval", mode: "—", date: "25 Jun 2026", templateId: "police", fields: { location: "Mahadevapura", issue: "rising incidents of chain-snatching during late evening hours", request: "intensify patrolling and deploy women constables in market areas" } },
  { id: "CP/LTR/2026/0244", recipient: "Hon'ble Union Minister of Railways", category: "ministers", subject: "Halt of Vande Bharat at Whitefield", linkedTo: "Commitment #C-119", status: "Pending Approval", mode: "—", date: "25 Jun 2026", templateId: "central-min", fields: { location: "Whitefield", issue: "the long-standing demand of IT corridor commuters for a Vande Bharat halt", request: "kindly consider sanctioning a halt at Whitefield (KJM) station" } },
  { id: "CP/LTR/2026/0243", recipient: "Smt. Lakshmi N.", category: "citizens", subject: "Recommendation — PMAY housing eligibility", status: "Pending Approval", mode: "—", date: "25 Jun 2026", templateId: "recommend", fields: { subjectName: "Smt. Lakshmi N.", location: "Whitefield", request: "consideration under PM Awas Yojana, subject to verification" } },
  { id: "CP/LTR/2026/0242", recipient: "Hon'ble Minister, Urban Development (GoK)", category: "ministers", subject: "Bellandur Lake rejuvenation — funds release", status: "Approved", mode: "—", date: "24 Jun 2026", templateId: "state-min", fields: { location: "Bellandur", issue: "delay in release of sanctioned funds for Phase-II of lake rejuvenation", request: "kindly direct release of pending tranche" } },
  { id: "CP/LTR/2026/0241", recipient: "Tahsildar, Bengaluru East", category: "officials", subject: "Khata transfer — Sri Ramesh Gowda", linkedTo: "Citizen: R. Gowda", status: "Dispatched", mode: "Post", date: "24 Jun 2026", templateId: "tahsildar", fields: { subjectName: "Sri Ramesh Gowda", location: "Mahadevapura", issue: "pending khata transfer for property bearing PID 84-12-209", request: "examine and dispose of as per rules" } },
  { id: "CP/LTR/2026/0240", recipient: "EE, BESCOM Whitefield Division", category: "officials", subject: "Frequent power cuts — Hoodi", status: "Dispatched", mode: "Email", date: "23 Jun 2026", templateId: "bescom", fields: { location: "Hoodi", issue: "unscheduled load-shedding affecting residential apartments", request: "restore the 11kV feeder and publish a maintenance schedule" } },
  { id: "CP/LTR/2026/0239", recipient: "Family of Late Sri Krishnamurthy", category: "citizens", subject: "Heartfelt Condolences", status: "Dispatched", mode: "Physical", date: "23 Jun 2026", templateId: "condolence", fields: { subjectName: "Sri Suresh Krishnamurthy" } },
  { id: "CP/LTR/2026/0238", recipient: "Smt. Anita Sharma", category: "citizens", subject: "Hearty Congratulations — National Bravery Award", status: "Dispatched", mode: "Post", date: "22 Jun 2026", templateId: "congrats", fields: { subjectName: "Smt. Anita Sharma", location: "KR Puram", issue: "being conferred the National Bravery Award" } },
  { id: "CP/LTR/2026/0237", recipient: "Project Director, NHAI Bengaluru", category: "officials", subject: "Service road — KR Puram NH-75 stretch", status: "Acknowledged", mode: "Post", date: "20 Jun 2026", templateId: "nhai", fields: { location: "KR Puram", issue: "absence of service road causing dangerous merging", request: "expedite construction of the proposed service road" } },
  { id: "CP/LTR/2026/0236", recipient: "BEO, Bengaluru South-3", category: "officials", subject: "Govt PU College, KR Puram — teacher shortage", linkedTo: "GRV-2026-0394", status: "Acknowledged", mode: "Email", date: "19 Jun 2026", templateId: "edu", fields: { location: "KR Puram", issue: "shortage of Science faculty affecting II PU students", request: "sanction guest faculty for the current academic year" } },
  { id: "CP/LTR/2026/0235", recipient: "Commissioner, BBMP", category: "officials", subject: "Follow-up — Marathahalli road resurfacing (Ref: 0198)", status: "Acknowledged", mode: "Email", date: "18 Jun 2026", templateId: "followup", fields: { refNo: "CP/LTR/2026/0198", date: "02 Jun 2026", issue: "resurfacing of Marathahalli ORR service road" } },
  { id: "CP/LTR/2026/0234", recipient: "DC, Bengaluru Urban District", category: "officials", subject: "Encroachment removal — Varthur lake bund", status: "Declined", mode: "—", date: "17 Jun 2026", templateId: "dc", fields: { subjectName: "RWA Varthur", location: "Varthur", issue: "encroachment along the lake bund affecting flow", request: "constitute a joint inspection and initiate removal" } },
];

function fmtMerged(body: string, fields: Record<string, string>) {
  return body.replace(/\{(\w+)\}/g, (_m, k) => fields[k] ? fields[k] : `[${k}]`);
}

const statusColor: Record<LetterStatus, string> = {
  "Draft": "bg-slate-100 text-slate-700",
  "Pending Approval": "bg-amber-100 text-amber-800",
  "Approved": "bg-blue-100 text-blue-800",
  "Dispatched": "bg-indigo-100 text-indigo-800",
  "Acknowledged": "bg-green-100 text-green-800",
  "Declined": "bg-red-100 text-red-700",
};

// ──────────────────────────────────────────────────────────────────────────
// Letterhead component
// ──────────────────────────────────────────────────────────────────────────
function Letterhead({ tmpl, fields, recipient, refNo, date, subject }: {
  tmpl: Template; fields: Record<string, string>; recipient: { name: string; designation: string; office: string; address: string };
  refNo: string; date: string; subject: string;
}) {
  const body = fmtMerged(tmpl.body, { ...fields, refNo, date });
  const salutation = fmtMerged(tmpl.salutation, fields);
  return (
    <div className="bg-white border border-slate-200 shadow-sm" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      {/* Header */}
      <div className="relative">
        <div className="h-2 bg-[#FF9933]" />
        <div className="px-10 pt-6 pb-4 border-b-2 border-[#0A1F44]/80 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-[#0A1F44] text-white flex items-center justify-center border-4 border-[#FF9933]">
            <div className="text-center leading-tight"><div className="text-[10px]">भारत</div><div className="text-[9px]">सरकार</div></div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-[11px] tracking-[0.3em] text-slate-500">कार्यालय / OFFICE OF</div>
            <div className="text-2xl font-bold text-[#0A1F44] tracking-wide">Hon'ble Member of Parliament</div>
            <div className="text-sm text-slate-700">Bengaluru Constituency · 18th Lok Sabha</div>
          </div>
          <div className="h-16 w-16 rounded bg-[#0A1F44]/5 border border-[#0A1F44]/20 flex items-center justify-center text-[10px] text-[#0A1F44] text-center px-1">
            Lion<br/>Capital
          </div>
        </div>
        <div className="px-10 py-1.5 bg-[#0A1F44] text-white text-[11px] flex justify-between">
          <span>MP Office, Vidhana Soudha Annexe, Dr. Ambedkar Veedhi, Bengaluru — 560001</span>
          <span>Tel: 080-2225-XXXX  ·  mp.bengaluru@sansad.nic.in</span>
        </div>
      </div>

      {/* Ref / Date */}
      <div className="px-10 pt-5 flex justify-between text-[13px] text-slate-800">
        <div><span className="font-semibold">Ref. No.:</span> {refNo}</div>
        <div><span className="font-semibold">Date:</span> {date}</div>
      </div>

      {/* Recipient block */}
      <div className="px-10 pt-5 text-[13px] text-slate-900 leading-relaxed">
        <div>To,</div>
        <div className="font-semibold">{recipient.name || "[Recipient Name]"}</div>
        <div>{recipient.designation || tmpl.recipientType}</div>
        {recipient.office && <div>{recipient.office}</div>}
        <div className="whitespace-pre-line">{recipient.address || "[Office Address]"}</div>
      </div>

      {/* Subject */}
      <div className="px-10 pt-5 text-[13px]">
        <span className="font-semibold">Subject:</span> <span className="underline underline-offset-2">{fmtMerged(subject || tmpl.subject, fields)}</span>
      </div>

      {/* Salutation + Body */}
      {salutation && <div className="px-10 pt-4 text-[13px]">{salutation}</div>}
      <div className="px-10 pt-3 pb-2 text-[13px] leading-7 whitespace-pre-line text-slate-900">{body}</div>

      {/* Close + signature */}
      <div className="px-10 pt-6 text-[13px]">{tmpl.close}</div>
      <div className="px-10 pt-12 pb-3 text-[13px]">
        <div className="border-t border-slate-400 w-56 pt-1">
          <div className="font-semibold text-[#0A1F44]">Hon'ble MP — Bengaluru</div>
          <div className="text-xs text-slate-600">Member of Parliament, Lok Sabha</div>
        </div>
      </div>

      {/* Enclosures footer */}
      {fields.enclosures && (
        <div className="px-10 pb-4 text-[12px] text-slate-700">
          <span className="font-semibold">Encl.:</span> {fields.enclosures}
        </div>
      )}
      <div className="px-10 py-2 bg-slate-50 border-t text-[10px] text-slate-500 flex justify-between">
        <span>Citizen Pulse · Letter generated via official template ({tmpl.id})</span>
        <span>Page 1 of 1</span>
      </div>
    </div>
  );
}

function Envelope({ recipient, refNo }: { recipient: { name: string; designation: string; office: string; address: string }; refNo: string }) {
  return (
    <div className="bg-white border-2 border-slate-300 rounded-md shadow-sm p-6 aspect-[2.3/1] flex flex-col justify-between" style={{ fontFamily: "Georgia, serif" }}>
      <div className="flex justify-between items-start">
        <div className="text-[10px] text-slate-700 max-w-[40%] leading-tight">
          <div className="font-bold text-[#0A1F44]">FROM:</div>
          <div className="font-semibold">Hon'ble MP — Bengaluru</div>
          <div>MP Office, Vidhana Soudha Annexe,</div>
          <div>Dr. Ambedkar Veedhi, Bengaluru — 560001</div>
          <div className="mt-1 text-slate-500">Ref: {refNo}</div>
        </div>
        <div className="border border-slate-400 px-2 py-1 text-[9px] text-slate-500">POSTAGE</div>
      </div>
      <div className="self-center text-center max-w-[70%] text-[13px] leading-relaxed">
        <div className="text-[10px] text-slate-500 mb-1">TO:</div>
        <div className="font-bold">{recipient.name || "[Recipient Name]"}</div>
        <div>{recipient.designation}</div>
        {recipient.office && <div>{recipient.office}</div>}
        <div className="whitespace-pre-line">{recipient.address || "[Office Address]"}</div>
      </div>
      <div className="text-[9px] text-slate-400 text-right">★ OFFICIAL CORRESPONDENCE ★</div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Main page
// ──────────────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent }: any) {
  return (
    <Card><CardContent className="p-5"><div className="flex items-center gap-3">
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${accent}`}><Icon className="h-5 w-5" /></div>
      <div><div className="text-2xl font-bold text-[#0A1F44]">{value}</div><div className="text-xs text-muted-foreground">{label}</div></div>
    </div></CardContent></Card>
  );
}

function riskMeta(r?: Template["riskClass"]) {
  switch (r) {
    case "safe": return { label: "Safe public-service request", color: "bg-green-100 text-green-800", icon: CheckCircle2 };
    case "verify": return { label: "Needs document verification", color: "bg-amber-100 text-amber-800", icon: AlertTriangle };
    case "legal": return { label: "Needs legal caution", color: "bg-orange-100 text-orange-800", icon: AlertTriangle };
    case "conflict": return { label: "Possible conflict-of-interest", color: "bg-red-100 text-red-700", icon: AlertTriangle };
    case "mp": return { label: "Requires MP sign-off", color: "bg-[#FF9933]/15 text-[#FF9933]", icon: Shield };
    default: return null;
  }
}

function LettersPage() {
  const [letters, setLetters] = useState<Letter[]>(SEED);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [composer, setComposer] = useState<{ tmpl: Template; letter?: Letter } | null>(null);
  const [envelopeFor, setEnvelopeFor] = useState<Letter | null>(null);
  const [viewPdf, setViewPdf] = useState<Letter | null>(null);
  const [filter, setFilter] = useState({ q: "", category: "all", status: "all" });

  const counts = useMemo(() => ({
    drafts: letters.filter(l => l.status === "Draft").length + 7,
    pending: letters.filter(l => l.status === "Pending Approval").length,
    issued: 61,
    dispatched: letters.filter(l => l.status === "Dispatched" || l.status === "Acknowledged").length + 47,
    ack: 12,
  }), [letters]);

  const filtered = letters.filter(l =>
    (filter.category === "all" || l.category === filter.category) &&
    (filter.status === "all" || l.status === filter.status) &&
    (!filter.q || l.id.toLowerCase().includes(filter.q.toLowerCase()) || l.recipient.toLowerCase().includes(filter.q.toLowerCase()) || l.subject.toLowerCase().includes(filter.q.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Letters & Correspondence</h1>
          <p className="text-sm text-muted-foreground">Compose, approve, dispatch and track official letters from the MP's office</p>
        </div>
        <Button className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white" onClick={() => setPickerOpen(true)}>
          <Plus className="h-4 w-4" /> New Letter
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard icon={FileText} label="Drafts" value={counts.drafts} accent="bg-slate-200 text-slate-700" />
        <StatCard icon={Clock} label="Pending MP Approval" value={counts.pending} accent="bg-amber-100 text-amber-700" />
        <StatCard icon={CheckCircle2} label="Issued This Month" value={counts.issued} accent="bg-green-100 text-green-700" />
        <StatCard icon={Send} label="Dispatched" value={counts.dispatched} accent="bg-indigo-100 text-indigo-700" />
        <StatCard icon={Inbox} label="Awaiting Acknowledgement" value={counts.ack} accent="bg-[#FF9933]/15 text-[#FF9933]" />
      </div>

      {/* Cross-link affordance */}
      <Card className="border-l-4 border-l-[#FF9933]">
        <CardContent className="p-4 flex flex-wrap items-center gap-3 text-sm">
          <Link2 className="h-4 w-4 text-[#FF9933]" />
          <span className="font-medium text-[#0A1F44]">Generate Letter from:</span>
          <Badge variant="outline" className="gap-1"><Users className="h-3 w-3" /> Grievances</Badge>
          <Badge variant="outline" className="gap-1"><Building2 className="h-3 w-3" /> Officer Directory</Badge>
          <Badge variant="outline" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Commitment Tracker</Badge>
          <Badge variant="outline" className="gap-1"><FileSignature className="h-3 w-3" /> Events & Speeches</Badge>
          <span className="text-xs text-muted-foreground ml-2">— each can launch a pre-filled letter here.</span>
        </CardContent>
      </Card>

      {/* Letter Register */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base text-[#0A1F44]">Letter Register</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search letter, recipient…" className="pl-8 h-9 w-56" value={filter.q} onChange={e => setFilter({ ...filter, q: e.target.value })} />
              </div>
              <Select value={filter.category} onValueChange={v => setFilter({ ...filter, category: v })}>
                <SelectTrigger className="h-9 w-44"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {Object.entries(CATEGORY_META).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filter.status} onValueChange={v => setFilter({ ...filter, status: v })}>
                <SelectTrigger className="h-9 w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {(["Draft","Pending Approval","Approved","Dispatched","Acknowledged","Declined"] as LetterStatus[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Letter ID</TableHead><TableHead>Recipient</TableHead><TableHead>Category</TableHead>
              <TableHead>Subject</TableHead><TableHead>Linked to</TableHead><TableHead>Status</TableHead>
              <TableHead>Mode</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Action</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(l => {
                const tmpl = TEMPLATES.find(t => t.id === l.templateId)!;
                return (
                  <TableRow key={l.id} className="hover:bg-slate-50">
                    <TableCell className="font-mono text-xs text-[#0A1F44] font-semibold">{l.id}</TableCell>
                    <TableCell className="text-sm font-medium">{l.recipient}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{CATEGORY_META[l.category].label}</Badge></TableCell>
                    <TableCell className="text-sm max-w-xs truncate">{l.subject}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{l.linkedTo || "—"}</TableCell>
                    <TableCell><Badge className={`${statusColor[l.status]} hover:${statusColor[l.status]}`}>{l.status}</Badge></TableCell>
                    <TableCell className="text-xs">{l.mode}</TableCell>
                    <TableCell className="text-xs">{l.date}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="sm" variant="ghost" className="h-7" onClick={() => setComposer({ tmpl, letter: l })}><Eye className="h-3 w-3" /></Button>
                      {(l.status === "Dispatched" || l.status === "Acknowledged" || l.status === "Approved") && (
                        <Button size="sm" variant="outline" className="h-7" onClick={() => setEnvelopeFor(l)}><Printer className="h-3 w-3" /></Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Template Picker */}
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-w-5xl max-h-[88vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-[#0A1F44]">Template Library — pick a letter to begin</DialogTitle></DialogHeader>
          <Tabs defaultValue="officials">
            <TabsList className="bg-slate-100">
              {Object.entries(CATEGORY_META).map(([k, v]) => <TabsTrigger key={k} value={k}>{v.label}</TabsTrigger>)}
            </TabsList>
            {Object.entries(CATEGORY_META).map(([key, meta]) => {
              const Icon = meta.icon;
              const items = TEMPLATES.filter(t => t.category === key);
              return (
                <TabsContent key={key} value={key} className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map(t => (
                      <button key={t.id} onClick={() => { setComposer({ tmpl: t }); setPickerOpen(false); }}
                        className="text-left border border-slate-200 rounded-lg p-4 hover:border-[#FF9933] hover:shadow-md transition-all bg-white group">
                        <div className="flex items-start gap-3">
                          <div className={`h-9 w-9 rounded-md bg-slate-100 flex items-center justify-center ${meta.color} group-hover:bg-[#FF9933]/10`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-[#0A1F44]">{t.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">{t.desc}</div>
                            {t.riskClass && <Badge className={`mt-2 text-[10px] ${riskMeta(t.riskClass)!.color}`}>{riskMeta(t.riskClass)!.label}</Badge>}
                          </div>
                          <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#FF9933]" />
                        </div>
                      </button>
                    ))}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </DialogContent>
      </Dialog>

      {composer && (
        <ComposerDialog
          key={composer.letter?.id || composer.tmpl.id}
          tmpl={composer.tmpl}
          existing={composer.letter}
          onClose={() => setComposer(null)}
          onSave={(l) => { setLetters(arr => { const idx = arr.findIndex(x => x.id === l.id); if (idx >= 0) { const cp = [...arr]; cp[idx] = l; return cp; } return [l, ...arr]; }); }}
          onPrintEnvelope={(l) => setEnvelopeFor(l)}
        />
      )}

      {envelopeFor && <EnvelopeDialog letter={envelopeFor} onClose={() => setEnvelopeFor(null)} />}

      {viewPdf && (
        <Dialog open onOpenChange={() => setViewPdf(null)}>
          <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto p-0">
            <div className="p-6"><Letterhead
              tmpl={TEMPLATES.find(t => t.id === viewPdf.templateId)!}
              fields={viewPdf.fields}
              recipient={{ name: viewPdf.recipient, designation: "", office: "", address: "" }}
              refNo={viewPdf.id} date={viewPdf.date} subject={viewPdf.subject}
            /></div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Composer Dialog
// ──────────────────────────────────────────────────────────────────────────
function genRef() { return `CP/LTR/2026/0${Math.floor(Math.random() * 90) + 248}`; }

function ComposerDialog({ tmpl, existing, onClose, onSave, onPrintEnvelope }: {
  tmpl: Template; existing?: Letter; onClose: () => void; onSave: (l: Letter) => void; onPrintEnvelope: (l: Letter) => void;
}) {
  const [recipient, setRecipient] = useState({
    name: existing?.recipient || "",
    designation: tmpl.recipientType,
    office: "",
    address: "",
  });
  const [subject, setSubject] = useState(existing?.subject || tmpl.subject);
  const [fields, setFields] = useState<Record<string, string>>(existing?.fields || {});
  const [refNo] = useState(existing?.id || genRef());
  const [date] = useState(existing?.date || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }));
  const [status, setStatus] = useState<LetterStatus>(existing?.status || "Draft");
  const [mode, setMode] = useState<Letter["mode"]>(existing?.mode || "—");
  const [aiOn, setAiOn] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiBody, setAiBody] = useState("");
  const [enclosures, setEnclosures] = useState<string[]>(existing?.fields?.enclosures ? existing.fields.enclosures.split(",").map(s => s.trim()) : []);
  const [newEncl, setNewEncl] = useState("");

  const setField = (k: string, v: string) => setFields(f => ({ ...f, [k]: v }));

  const usingTmpl: Template = aiOn && aiBody ? { ...tmpl, body: aiBody } : tmpl;
  const previewFields = { ...fields, enclosures: enclosures.join(", ") };

  const runAi = () => {
    if (!aiPrompt) return;
    setAiBody(`With reference to the matter brought to the notice of this office regarding "${aiPrompt}", and after due consideration of the representations received from residents of ${fields.location || "the area"}, I deem it appropriate to formally bring this issue to your attention.\n\nThe situation requires prompt administrative intervention. I request your good office to examine the matter under applicable rules and initiate suitable action without further delay. The residents have been awaiting resolution for some time, and timely action will reinforce the public's confidence in our institutions.\n\nKindly intimate this office of the action taken so that the same may be conveyed to the concerned citizens. Should any additional information or representation be required, this office will be glad to provide the same.`);
    toast.success("AI draft generated — edit freely on the right");
  };

  const persist = (override?: Partial<Letter>) => {
    const merged: Letter = {
      id: refNo,
      recipient: recipient.name || "[Recipient]",
      category: tmpl.category,
      subject: fmtMerged(subject, fields),
      linkedTo: existing?.linkedTo,
      status, mode, date,
      templateId: tmpl.id,
      fields: previewFields,
      ...override,
    };
    onSave(merged);
    return merged;
  };

  const sendForApproval = () => { setStatus("Pending Approval"); persist({ status: "Pending Approval" }); toast.success("Sent to MP for approval"); };
  const approve = () => { setStatus("Approved"); persist({ status: "Approved" }); toast.success("Letter approved"); };
  const reject = () => { setStatus("Declined"); persist({ status: "Declined" }); toast.error("Letter declined"); };
  const dispatchNow = () => {
    if (mode === "—") { toast.error("Pick a dispatch mode"); return; }
    setStatus("Dispatched"); persist({ status: "Dispatched" });
    toast.success(`Dispatched via ${mode} · DSP-${Math.floor(Math.random()*9000)+1000}`);
  };
  const markAck = () => { setStatus("Acknowledged"); persist({ status: "Acknowledged" }); toast.success("Marked as acknowledged"); };

  const risk = riskMeta(tmpl.riskClass);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-[1400px] w-[96vw] max-h-[94vh] overflow-hidden p-0 flex flex-col">
        <DialogHeader className="px-6 py-3 border-b bg-[#0A1F44] text-white flex flex-row items-center justify-between space-y-0">
          <div>
            <DialogTitle className="text-white">{tmpl.name}</DialogTitle>
            <div className="text-xs text-white/70 mt-0.5">{refNo} · {date} · <span className="capitalize">{CATEGORY_META[tmpl.category].label}</span></div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${statusColor[status]} hover:${statusColor[status]}`}>{status}</Badge>
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/10 h-8 w-8" onClick={onClose}><X className="h-4 w-4" /></Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] flex-1 overflow-hidden">
          {/* LEFT: Form */}
          <div className="border-r overflow-y-auto p-5 space-y-5 bg-slate-50">
            {risk && (
              <div className={`p-3 rounded-md border ${risk.color.replace("text-", "border-").replace("bg-", "border-")} ${risk.color} flex items-start gap-2`}>
                <risk.icon className="h-4 w-4 mt-0.5" />
                <div className="text-xs"><div className="font-semibold">Governance check: {risk.label}</div>
                <div className="opacity-80 mt-0.5">Audit trail: requester, documents verified, template used, approval authority — all recorded.</div></div>
              </div>
            )}

            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Recipient</div>
              <div className="space-y-2">
                <div><Label className="text-xs">Name</Label><Input value={recipient.name} onChange={e => setRecipient({ ...recipient, name: e.target.value })} placeholder="e.g. Sri Tushar Giri Nath, IAS" /></div>
                <div><Label className="text-xs">Designation</Label><Input value={recipient.designation} onChange={e => setRecipient({ ...recipient, designation: e.target.value })} /></div>
                <div><Label className="text-xs">Department / Office</Label><Input value={recipient.office} onChange={e => setRecipient({ ...recipient, office: e.target.value })} placeholder="e.g. BBMP Head Office" /></div>
                <div><Label className="text-xs">Office Address</Label><Textarea rows={3} value={recipient.address} onChange={e => setRecipient({ ...recipient, address: e.target.value })} placeholder="N. R. Square, Bengaluru — 560002" /></div>
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Subject</div>
              <Input value={subject} onChange={e => setSubject(e.target.value)} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Merge Fields</div>
                <div className="flex items-center gap-2"><Sparkles className="h-3 w-3 text-[#FF9933]" /><span className="text-xs">AI Draft</span><Switch checked={aiOn} onCheckedChange={setAiOn} /></div>
              </div>
              {aiOn ? (
                <div className="space-y-2 p-3 bg-white border border-[#FF9933]/30 rounded-md">
                  <Label className="text-xs">Describe the issue</Label>
                  <Textarea rows={3} value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="e.g. flooding of Whitefield main road during pre-monsoon, RWA requesting drain audit…" />
                  <Button size="sm" className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white w-full" onClick={runAi}><Sparkles className="h-3 w-3" /> Generate Draft</Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {["subjectName","location","issue","request","date","refNo"].map(k => (
                    <div key={k}>
                      <Label className="text-xs capitalize">{k === "refNo" ? "Ref no." : k === "subjectName" ? "Citizen / subject name" : k}</Label>
                      {k === "issue" || k === "request"
                        ? <Textarea rows={2} value={fields[k] || ""} onChange={e => setField(k, e.target.value)} />
                        : <Input value={fields[k] || ""} onChange={e => setField(k, e.target.value)} />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Enclosures</div>
              <div className="space-y-1.5">
                {enclosures.map((e, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs bg-white px-2 py-1 rounded border">
                    <span className="flex-1">{i+1}. {e}</span>
                    <button onClick={() => setEnclosures(arr => arr.filter((_, j) => j !== i))}><X className="h-3 w-3 text-slate-400 hover:text-red-500" /></button>
                  </div>
                ))}
                <div className="flex gap-2"><Input className="h-8 text-xs" placeholder="Add enclosure (e.g. Aadhaar copy)" value={newEncl} onChange={e => setNewEncl(e.target.value)} /><Button size="sm" variant="outline" className="h-8" onClick={() => { if (newEncl) { setEnclosures([...enclosures, newEncl]); setNewEncl(""); } }}>Add</Button></div>
              </div>
            </div>

            {/* Dispatch panel */}
            {(status === "Approved" || status === "Dispatched" || status === "Acknowledged") && (
              <div className="p-3 rounded-md border border-indigo-200 bg-indigo-50/50">
                <div className="text-[11px] uppercase tracking-wider text-indigo-900 font-semibold mb-2 flex items-center gap-1"><Truck className="h-3 w-3" /> Dispatch</div>
                <Label className="text-xs">Mode</Label>
                <Select value={mode || "—"} onValueChange={(v) => setMode(v as any)}>
                  <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="—">Select…</SelectItem>
                    <SelectItem value="Email"><Mail className="inline h-3 w-3 mr-1" /> Email</SelectItem>
                    <SelectItem value="Post"><Truck className="inline h-3 w-3 mr-1" /> Post (Speed Post)</SelectItem>
                    <SelectItem value="WhatsApp"><MessageSquare className="inline h-3 w-3 mr-1" /> WhatsApp</SelectItem>
                    <SelectItem value="Physical"><Send className="inline h-3 w-3 mr-1" /> Physical (Hand)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* RIGHT: Preview + Actions */}
          <div className="flex flex-col overflow-hidden">
            <div className="px-5 py-2 border-b bg-white flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs text-slate-500">Live preview · updates as you type</div>
              <div className="flex flex-wrap items-center gap-1.5">
                {status === "Draft" && <Button size="sm" className="bg-[#0A1F44] text-white" onClick={sendForApproval}><Send className="h-3 w-3" /> Send for Approval</Button>}
                {status === "Pending Approval" && <>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={approve}><CheckCircle2 className="h-3 w-3" /> Approve</Button>
                  <Button size="sm" variant="outline" className="border-red-300 text-red-700" onClick={reject}>Reject</Button>
                </>}
                {status === "Approved" && <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={dispatchNow}><Truck className="h-3 w-3" /> Dispatch</Button>}
                {status === "Dispatched" && <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={markAck}><CheckCircle2 className="h-3 w-3" /> Mark Acknowledged</Button>}
                <Button size="sm" variant="outline" onClick={() => { const l = persist(); toast.success("Letter saved"); window.print?.(); void l; }}><Printer className="h-3 w-3" /> Print Letter</Button>
                <Button size="sm" variant="outline" onClick={() => { const l = persist(); onPrintEnvelope(l); }}><Mail className="h-3 w-3" /> Print Envelope</Button>
                <Button size="sm" variant="outline" onClick={() => { const l = persist(); onPrintEnvelope(l); toast.success("Print Both queued"); }}>Print Both</Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-slate-100">
              <div className="max-w-3xl mx-auto">
                <Letterhead tmpl={usingTmpl} fields={previewFields} recipient={recipient} refNo={refNo} date={date} subject={subject} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Envelope Dialog
// ──────────────────────────────────────────────────────────────────────────
function EnvelopeDialog({ letter, onClose }: { letter: Letter; onClose: () => void }) {
  const tmpl = TEMPLATES.find(t => t.id === letter.templateId)!;
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader><DialogTitle className="text-[#0A1F44]">Envelope / Address Label — {letter.id}</DialogTitle></DialogHeader>
        <Envelope
          recipient={{ name: letter.recipient, designation: tmpl.recipientType, office: "", address: letter.fields.address || "Office Address, Bengaluru" }}
          refNo={letter.id}
        />
        <div className="text-xs text-muted-foreground">Window-envelope friendly · address positioned for standard DL envelopes and Avery L7165 labels.</div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button className="bg-[#0A1F44] text-white" onClick={() => { toast.success("Sent to printer"); onClose(); }}><Printer className="h-4 w-4" /> Print Envelope</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
