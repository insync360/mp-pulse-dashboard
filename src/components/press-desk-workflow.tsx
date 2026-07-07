import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  FileText, Send, Sparkles, Download, Eye, RefreshCw, Trash2, Edit, CheckCircle2,
  XCircle, ArrowRight, Users, Newspaper, Phone, Mail, MessageSquare, Plus, Radio, ClipboardList,
} from "lucide-react";
import {
  useResponses, useJournalists, useLists, useLetterhead, useOutreach,
  createResponse, updateResponse, deleteResponse, generateDraftBody, advanceApproval,
  addJournalist, addList, logOutreach, addLinked, fmtRel,
  RESPONSE_TYPES, TONES, POSITIONS, LANGUAGES, OUTPUT_FORMATS, BEAT_OPTIONS, MEDIA_LIST_OPTIONS,
  type ResponseStatus, type MediaResponse, type ResponseType, type Tone, type Position,
  type LanguageOpt, type OutputFormat, type Journalist,
} from "@/lib/press-desk-store";

const statusTone: Record<ResponseStatus, string> = {
  "Draft Generated": "bg-slate-100 text-slate-700 border-slate-200",
  "Under Review": "bg-amber-50 text-amber-800 border-amber-200",
  "Approved by PA": "bg-blue-50 text-blue-700 border-blue-200",
  "Approved by MP": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Sent to Media": "bg-navy/5 text-navy border-navy/20",
  "Published": "bg-saffron/15 text-saffron border-saffron/40",
  "Archived": "bg-slate-50 text-slate-500 border-slate-200",
  "Rejected": "bg-rose-50 text-rose-700 border-rose-200",
};

const STATUS_FILTERS: (ResponseStatus | "All")[] = ["All","Draft Generated","Under Review","Approved by PA","Approved by MP","Sent to Media","Published","Archived"];

// ═══════════════════════════════════════════════════════
// DRAFT MEDIA RESPONSE MODAL
// ═══════════════════════════════════════════════════════
export type DraftSeed = {
  sourceArticleId?: string;
  sourceHeadline?: string;
  issueSummary?: string;
  suggestedResponseType?: ResponseType;
  suggestedTone?: Tone;
  suggestedPosition?: Position;
};

export function DraftMediaResponseDialog({
  open, onClose, seed,
}: { open: boolean; onClose: () => void; seed?: DraftSeed }) {
  const journalists = useJournalists();
  const letterhead = useLetterhead();

  const [title, setTitle] = useState("");
  const [issueSummary, setIssueSummary] = useState("");
  const [responseType, setResponseType] = useState<ResponseType>("Official Statement");
  const [tone, setTone] = useState<Tone>("Firm");
  const [position, setPosition] = useState<Position>("Share action already taken");
  const [language, setLanguage] = useState<LanguageOpt>("English + Kannada");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("Full Press Release");
  const [letterheadTemplate, setLetterheadTemplate] = useState("Default MP Letterhead");
  const [approvalRequired, setApprovalRequired] = useState<"PA + MP" | "PA only" | "None">("PA + MP");
  const [contactIds, setContactIds] = useState<string[]>([]);
  const [owner, setOwner] = useState("Rohan Iyer");
  const [body, setBody] = useState("");
  const [editable, setEditable] = useState(false);
  const [variation, setVariation] = useState(0);
  const [showLetterhead, setShowLetterhead] = useState(false);

  // reset on open with seed
  useMemo(() => {
    if (open) {
      setTitle(seed?.sourceHeadline ? seed.sourceHeadline.slice(0, 80) : "");
      setIssueSummary(seed?.issueSummary ?? seed?.sourceHeadline ?? "");
      if (seed?.suggestedResponseType) setResponseType(seed.suggestedResponseType);
      if (seed?.suggestedTone) setTone(seed.suggestedTone);
      if (seed?.suggestedPosition) setPosition(seed.suggestedPosition);
      setBody("");
      setEditable(false);
      setVariation(0);
      setShowLetterhead(false);
      setContactIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const generate = (nextVar?: number) => {
    const v = nextVar ?? variation;
    const draft = generateDraftBody({
      title: title || issueSummary || "the matter",
      responseType, tone, position,
      sourceHeadline: seed?.sourceHeadline,
      variation: v,
    });
    setBody(draft);
    toast.success("Draft generated");
  };

  const persist = (status: "Draft Generated" | "Under Review") => {
    if (!body) { toast.error("Generate a draft first"); return; }
    const r = createResponse({
      title: title || issueSummary || "Untitled response",
      sourceArticleId: seed?.sourceArticleId,
      sourceHeadline: seed?.sourceHeadline,
      responseType, tone, position, language, outputFormat,
      letterheadTemplate, approvalRequired,
      targetMediaContacts: contactIds,
      internalOwner: owner, createdBy: "Anjali Rao",
      currentApprover: approvalRequired === "PA + MP" || approvalRequired === "PA only" ? "PA — Pooja Hegde" : "—",
      dueAt: new Date(Date.now() + 6 * 3600_000).toISOString(),
      status, body,
    });
    if (status === "Under Review") toast.success(`Sent for approval: ${r.id}`);
    else toast.success(`Saved as draft: ${r.id}`);
    onClose();
  };

  return (
    <>
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-navy flex items-center gap-2"><Sparkles className="h-4 w-4 text-saffron" />Draft Media Response</DialogTitle>
          <DialogDescription>Compose an official response. All fields are prototype; drafts are saved to Press Desk.</DialogDescription>
        </DialogHeader>

        {seed?.sourceHeadline && (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-2.5 text-xs">
            <div className="text-[10px] uppercase text-slate-500 tracking-wide">Source article</div>
            <div className="text-navy font-medium mt-0.5">{seed.sourceHeadline}</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Response Title"><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Short internal title" /></Field>
          <Field label="Response Type"><Sel value={responseType} onChange={v => setResponseType(v as ResponseType)} options={RESPONSE_TYPES} /></Field>
          <Field label="Tone"><Sel value={tone} onChange={v => setTone(v as Tone)} options={TONES} /></Field>
          <Field label="Position"><Sel value={position} onChange={v => setPosition(v as Position)} options={POSITIONS} /></Field>
          <Field label="Language"><Sel value={language} onChange={v => setLanguage(v as LanguageOpt)} options={LANGUAGES} /></Field>
          <Field label="Output Format"><Sel value={outputFormat} onChange={v => setOutputFormat(v as OutputFormat)} options={OUTPUT_FORMATS} /></Field>
          <Field label="Letterhead Template"><Sel value={letterheadTemplate} onChange={setLetterheadTemplate} options={["Default MP Letterhead","Party Letterhead","Parliamentary Letterhead","Plain (no letterhead)"]} /></Field>
          <Field label="Approval Required"><Sel value={approvalRequired} onChange={v => setApprovalRequired(v as any)} options={["PA + MP","PA only","None"]} /></Field>
          <Field label="Internal Owner"><Sel value={owner} onChange={setOwner} options={["Anjali Rao","Rohan Iyer","Pooja Hegde","Suresh Patil"]} /></Field>
          <Field label="Target Media Contacts">
            <div className="border border-slate-200 rounded-md max-h-24 overflow-y-auto p-2 space-y-1 text-xs">
              {journalists.map(j => (
                <label key={j.id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={contactIds.includes(j.id)} onCheckedChange={(c) => setContactIds(list => c ? [...list, j.id] : list.filter(x => x !== j.id))} />
                  <span className="text-slate-700">{j.name} <span className="text-slate-400">· {j.publication}</span></span>
                </label>
              ))}
            </div>
          </Field>
        </div>

        <Field label="Issue Summary"><Textarea rows={2} value={issueSummary} onChange={e => setIssueSummary(e.target.value)} placeholder="1–2 line summary of what the news is about" /></Field>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-xs uppercase text-slate-500 tracking-wide">Draft Preview</Label>
            <span className="text-[10px] text-slate-400">Variation {variation + 1}</span>
            <div className="ml-auto flex gap-1.5">
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => generate()}><Sparkles className="h-3 w-3 mr-1" />Generate Draft</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { const nv = variation + 1; setVariation(nv); generate(nv); }}><RefreshCw className="h-3 w-3 mr-1" />Regenerate</Button>
              <Button size="sm" variant={editable ? "default" : "outline"} className={`h-7 text-xs ${editable ? "bg-navy text-white" : ""}`} onClick={() => setEditable(v => !v)}><Edit className="h-3 w-3 mr-1" />{editable ? "Lock" : "Edit Draft"}</Button>
            </div>
          </div>
          <Textarea rows={10} readOnly={!editable} value={body} onChange={e => setBody(e.target.value)} placeholder="Click Generate Draft to produce a preview" className="font-mono text-xs" />
        </div>

        <DialogFooter className="gap-2 flex-wrap">
          <Button variant="outline" onClick={() => setShowLetterhead(true)} disabled={!body}><Eye className="h-3.5 w-3.5 mr-1" />Preview on Letterhead</Button>
          <Button variant="outline" onClick={() => { toast.success("PDF prepared for download."); }} disabled={!body}><Download className="h-3.5 w-3.5 mr-1" />Download PDF</Button>
          <Button variant="outline" onClick={() => persist("Draft Generated")}>Save as Draft</Button>
          <Button className="bg-navy hover:bg-navy/90 text-white" onClick={() => persist("Under Review")}><Send className="h-3.5 w-3.5 mr-1" />Send for Approval</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <LetterheadPreviewDialog open={showLetterhead} onClose={() => setShowLetterhead(false)} title={title || "Media Response"} body={body} letterhead={letterhead} />
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] uppercase text-slate-500 tracking-wide">{label}</Label>
      {children}
    </div>
  );
}
function Sel({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
      <SelectContent>{options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
    </Select>
  );
}

// ═══════════════════════════════════════════════════════
// LETTERHEAD PREVIEW
// ═══════════════════════════════════════════════════════
export function LetterheadPreviewDialog({ open, onClose, title, body, letterhead }: {
  open: boolean; onClose: () => void; title: string; body: string;
  letterhead: ReturnType<typeof useLetterhead>;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-navy">Letterhead Preview</DialogTitle></DialogHeader>
        <div className="bg-white border-2 border-navy/20 rounded-lg overflow-hidden shadow-xl">
          {/* Letterhead header */}
          <div className="bg-gradient-to-r from-navy to-navy/90 text-white p-6 flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-saffron flex items-center justify-center text-navy font-bold text-xl">🏛</div>
            <div className="flex-1">
              <div className="text-lg font-bold">{letterhead.officeName}</div>
              <div className="text-xs opacity-80 mt-0.5">{letterhead.address}</div>
              <div className="text-xs opacity-80">{letterhead.email} · {letterhead.phone}</div>
            </div>
          </div>
          {/* Body */}
          <div className="p-8 space-y-4">
            <div className="text-right text-xs text-slate-500">Ref: MP/{new Date().getFullYear()}/PRESS/{Math.floor(Math.random()*900+100)}</div>
            <div className="text-right text-xs text-slate-500">{new Date().toDateString()}</div>
            <h2 className="text-lg font-bold text-navy uppercase text-center border-b-2 border-saffron pb-2">{title}</h2>
            <div className="whitespace-pre-wrap text-sm text-slate-800 leading-relaxed font-serif">{body || "(Empty draft)"}</div>
            <div className="pt-8">
              <div className="text-xs text-slate-500 italic">[Signature]</div>
              <div className="mt-2 text-sm font-semibold text-navy">{letterhead.signatory}</div>
            </div>
          </div>
          <div className="bg-slate-50 border-t border-slate-200 p-3 text-[10px] text-slate-500 text-center">{letterhead.footer}</div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => toast.success("PDF prepared for download.")}><Download className="h-3.5 w-3.5 mr-1" />Download PDF</Button>
          <Button className="bg-navy text-white" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════════════
// PRESS DESK PANEL
// ═══════════════════════════════════════════════════════
export function PressDeskPanel({ onDraft }: { onDraft: () => void }) {
  const responses = useResponses();
  const letterhead = useLetterhead();
  const journalists = useJournalists();
  const [statusFilter, setStatusFilter] = useState<ResponseStatus | "All">("All");
  const [detail, setDetail] = useState<MediaResponse | null>(null);
  const [approval, setApproval] = useState<MediaResponse | null>(null);
  const [preview, setPreview] = useState<MediaResponse | null>(null);
  const [sendModal, setSendModal] = useState<MediaResponse | null>(null);
  const [editModal, setEditModal] = useState<MediaResponse | null>(null);

  const filtered = statusFilter === "All" ? responses : responses.filter(r => r.status === statusFilter);
  const counts = STATUS_FILTERS.map(s => s === "All" ? responses.length : responses.filter(r => r.status === s).length);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-saffron" />
            <h3 className="text-sm font-semibold text-navy">Press Desk — Media Responses</h3>
          </div>
          <Button size="sm" className="ml-auto bg-navy text-white h-8" onClick={onDraft}><Plus className="h-3.5 w-3.5 mr-1" />New Draft</Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((s, i) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${statusFilter === s ? "bg-navy text-white border-navy" : "bg-white text-slate-700 border-slate-200 hover:border-navy/40"}`}>
              {s} <span className="opacity-60 ml-1">{counts[i]}</span>
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-3">
        {filtered.map(r => (
          <ResponseCard key={r.id} r={r} journalists={journalists}
            onDetail={() => setDetail(r)}
            onEdit={() => setEditModal(r)}
            onApproval={() => setApproval(r)}
            onPreview={() => setPreview(r)}
            onSend={() => setSendModal(r)}
          />
        ))}
        {filtered.length === 0 && <Card className="p-8 text-center text-sm text-slate-500">No responses in this bucket.</Card>}
      </div>

      {/* Detail drawer */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader><SheetTitle className="text-navy">{detail?.title}</SheetTitle></SheetHeader>
          {detail && (
            <div className="mt-4 space-y-4 text-sm">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline" className={statusTone[detail.status]}>{detail.status}</Badge>
                <Badge variant="outline" className="text-[10px]">{detail.responseType}</Badge>
                <Badge variant="outline" className="text-[10px]">{detail.language}</Badge>
              </div>
              {detail.sourceHeadline && (
                <div className="rounded border border-slate-200 bg-slate-50 p-2.5 text-xs">
                  <div className="text-[10px] uppercase text-slate-500">Source article</div>
                  <div className="text-navy font-medium mt-0.5">{detail.sourceHeadline}</div>
                </div>
              )}
              <div className="rounded border border-slate-200 p-3 whitespace-pre-wrap font-mono text-xs text-slate-800 max-h-64 overflow-y-auto">{detail.body}</div>
              <div>
                <div className="text-[10px] uppercase text-slate-500 mb-1.5">Activity</div>
                <div className="space-y-1.5">
                  {detail.history.map((h, i) => (
                    <div key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-saffron mt-1.5" />
                      <div><span className="font-medium text-navy">{h.by}</span> · {h.note} <span className="text-slate-400">· {fmtRel(h.at)}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {approval && <ApprovalDialog r={approval} onClose={() => setApproval(null)} />}
      {preview && <LetterheadPreviewDialog open={!!preview} onClose={() => setPreview(null)} title={preview.title} body={preview.body} letterhead={letterhead} />}
      {sendModal && <SendToMediaDialog r={sendModal} onClose={() => setSendModal(null)} />}
      {editModal && <EditDraftDialog r={editModal} onClose={() => setEditModal(null)} />}
    </div>
  );
}

function ResponseCard({ r, journalists, onDetail, onEdit, onApproval, onPreview, onSend }: {
  r: MediaResponse; journalists: Journalist[];
  onDetail: () => void; onEdit: () => void; onApproval: () => void; onPreview: () => void; onSend: () => void;
}) {
  const contactNames = r.targetMediaContacts.map(id => journalists.find(j => j.id === id)?.name).filter(Boolean).slice(0, 3).join(", ");
  const buttons: { label: string; icon?: React.ReactNode; primary?: boolean; onClick: () => void }[] = [];
  switch (r.status) {
    case "Draft Generated":
      buttons.push({ label: "Edit", icon: <Edit className="h-3 w-3" />, onClick: onEdit });
      buttons.push({ label: "Regenerate", icon: <RefreshCw className="h-3 w-3" />, onClick: () => { updateResponse(r.id, { body: generateDraftBody({ title: r.title, responseType: r.responseType, tone: r.tone, position: r.position, sourceHeadline: r.sourceHeadline, variation: Math.floor(Math.random()*3) }) }, "Regenerated"); toast.success("Draft regenerated"); } });
      buttons.push({ label: "Preview on Letterhead", icon: <Eye className="h-3 w-3" />, onClick: onPreview });
      buttons.push({ label: "Send for Review", icon: <Send className="h-3 w-3" />, primary: true, onClick: () => { updateResponse(r.id, { status: "Under Review", currentApprover: "PA — Pooja Hegde" }, "Sent for review"); toast.success("Sent for review"); } });
      buttons.push({ label: "Delete", icon: <Trash2 className="h-3 w-3" />, onClick: () => { if (confirm("Delete draft?")) { deleteResponse(r.id); toast("Draft deleted"); } } });
      break;
    case "Under Review":
    case "Approved by PA":
      buttons.push({ label: "Approve", icon: <CheckCircle2 className="h-3 w-3" />, primary: true, onClick: onApproval });
      buttons.push({ label: "Request Changes", icon: <Edit className="h-3 w-3" />, onClick: onApproval });
      buttons.push({ label: "Edit", icon: <Edit className="h-3 w-3" />, onClick: onEdit });
      buttons.push({ label: "Preview", icon: <Eye className="h-3 w-3" />, onClick: onPreview });
      break;
    case "Approved by MP":
      buttons.push({ label: "Send to Media", icon: <Send className="h-3 w-3" />, primary: true, onClick: onSend });
      buttons.push({ label: "Download PDF", icon: <Download className="h-3 w-3" />, onClick: () => toast.success("PDF prepared for download.") });
      buttons.push({ label: "Publish to Social", icon: <Radio className="h-3 w-3" />, onClick: () => { updateResponse(r.id, { status: "Published" }, "Published to social"); toast.success("Published to social"); } });
      buttons.push({ label: "Archive", onClick: () => { updateResponse(r.id, { status: "Archived" }, "Archived"); toast("Archived"); } });
      break;
    case "Sent to Media":
      buttons.push({ label: "Track Coverage", primary: true, onClick: () => toast.success("Coverage tracking opened") });
      buttons.push({ label: "Log Journalist Response", onClick: () => toast.success("Journalist response logged") });
      buttons.push({ label: "Mark Published", icon: <CheckCircle2 className="h-3 w-3" />, onClick: () => { updateResponse(r.id, { status: "Published" }, "Marked as published"); toast.success("Marked published"); } });
      buttons.push({ label: "Archive", onClick: () => { updateResponse(r.id, { status: "Archived" }, "Archived"); toast("Archived"); } });
      break;
    case "Published":
      buttons.push({ label: "View Distribution", primary: true, onClick: () => toast.success(`Distributed to ${r.targetMediaContacts.length} contacts`) });
      buttons.push({ label: "Add to Weekly Digest", onClick: () => toast.success("Added to weekly digest") });
      buttons.push({ label: "Archive", onClick: () => { updateResponse(r.id, { status: "Archived" }, "Archived"); toast("Archived"); } });
      break;
    case "Rejected":
    case "Archived":
      buttons.push({ label: "Restore as Draft", onClick: () => { updateResponse(r.id, { status: "Draft Generated" }, "Restored"); toast("Restored"); } });
      break;
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-500">
            <span className="font-mono text-navy">{r.id}</span><span>·</span>
            <Badge variant="outline" className={statusTone[r.status]}>{r.status}</Badge>
            <Badge variant="outline" className="text-[10px]">{r.responseType}</Badge>
            <Badge variant="outline" className="text-[10px]">{r.language}</Badge>
            {r.letterheadTemplate !== "—" && <Badge variant="outline" className="text-[10px] bg-saffron/10 text-saffron border-saffron/30">📄 {r.letterheadTemplate}</Badge>}
          </div>
          <div className="text-sm font-semibold text-navy mt-1.5 cursor-pointer hover:underline" onClick={onDetail}>{r.title}</div>
          {r.sourceHeadline && <div className="text-xs text-slate-500 mt-0.5">Source: {r.sourceHeadline}</div>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-600">
            <div><span className="text-slate-400">Owner:</span> {r.internalOwner}</div>
            <div><span className="text-slate-400">Approver:</span> {r.currentApprover}</div>
            <div><span className="text-slate-400">Updated:</span> {fmtRel(r.updatedAt)}</div>
            <div><span className="text-slate-400">Due:</span> {fmtRel(r.dueAt)}</div>
            <div className="col-span-2"><span className="text-slate-400">Targets:</span> {contactNames || <span className="italic text-slate-400">none selected</span>}</div>
            <div className="col-span-2"><span className="text-slate-400">Created by:</span> {r.createdBy}</div>
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
        {buttons.map((b, i) => (
          <Button key={i} size="sm" variant={b.primary ? "default" : "outline"} className={`h-7 text-xs ${b.primary ? "bg-navy hover:bg-navy/90 text-white" : ""}`} onClick={b.onClick}>
            {b.icon}{b.icon ? <span className="ml-1">{b.label}</span> : b.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════
// APPROVAL DIALOG
// ═══════════════════════════════════════════════════════
function ApprovalDialog({ r, onClose }: { r: MediaResponse; onClose: () => void }) {
  const [comments, setComments] = useState("");
  const [decision, setDecision] = useState<"Approve" | "Request Changes" | "Reject" | "Next">("Approve");
  const reviewer = r.status === "Under Review" ? "PA — Pooja Hegde" : "MP Office";
  const submit = () => {
    if (decision === "Approve") {
      advanceApproval(r.id, reviewer);
      toast.success("Approved");
    } else if (decision === "Next") {
      advanceApproval(r.id, reviewer);
      toast.success("Sent to next approver");
    } else if (decision === "Request Changes") {
      updateResponse(r.id, { status: "Draft Generated", reviewerComments: comments, currentApprover: r.internalOwner }, `Changes requested: ${comments || "(no comment)"}`, reviewer);
      toast("Changes requested");
    } else {
      updateResponse(r.id, { status: "Rejected", reviewerComments: comments }, `Rejected: ${comments || "(no comment)"}`, reviewer);
      toast.error("Response rejected");
    }
    onClose();
  };
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-navy">Review · {r.id}</DialogTitle>
          <DialogDescription>{r.title}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="rounded border border-slate-200 p-3 whitespace-pre-wrap font-mono text-xs text-slate-800 max-h-56 overflow-y-auto">{r.body}</div>
          <Field label="Reviewer"><Input value={reviewer} readOnly /></Field>
          <Field label="Decision">
            <div className="flex flex-wrap gap-1.5">
              {(["Approve","Request Changes","Reject","Next"] as const).map(d => (
                <button key={d} onClick={() => setDecision(d)} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${decision === d ? "bg-navy text-white border-navy" : "bg-white text-slate-700 border-slate-200"}`}>
                  {d === "Next" ? "Send to Next Approver" : d}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Comments"><Textarea rows={3} value={comments} onChange={e => setComments(e.target.value)} placeholder="Optional reviewer note" /></Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className={decision === "Reject" ? "bg-rose-600 hover:bg-rose-700 text-white" : "bg-navy hover:bg-navy/90 text-white"} onClick={submit}>Submit Decision</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════════════
// EDIT DRAFT DIALOG
// ═══════════════════════════════════════════════════════
function EditDraftDialog({ r, onClose }: { r: MediaResponse; onClose: () => void }) {
  const [body, setBody] = useState(r.body);
  const [title, setTitle] = useState(r.title);
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-navy">Edit Draft · {r.id}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Field label="Title"><Input value={title} onChange={e => setTitle(e.target.value)} /></Field>
          <Field label="Body"><Textarea rows={14} value={body} onChange={e => setBody(e.target.value)} className="font-mono text-xs" /></Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-navy hover:bg-navy/90 text-white" onClick={() => { updateResponse(r.id, { title, body }, "Draft edited"); toast.success("Draft updated"); onClose(); }}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════════════
// SEND TO MEDIA DIALOG
// ═══════════════════════════════════════════════════════
function SendToMediaDialog({ r, onClose }: { r: MediaResponse; onClose: () => void }) {
  const journalists = useJournalists();
  const lists = useLists();
  const [listId, setListId] = useState<string>(r.targetListId ?? lists[0]?.id ?? "");
  const [extraIds, setExtraIds] = useState<string[]>(r.targetMediaContacts);
  const selected = useMemo(() => {
    const fromList = lists.find(l => l.id === listId)?.journalistIds ?? [];
    return Array.from(new Set([...fromList, ...extraIds]));
  }, [listId, extraIds, lists]);
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-navy">Send to Media · {r.id}</DialogTitle>
          <DialogDescription>Confirm the media list and journalists that will receive this response.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Field label="Media List"><Sel value={listId} onChange={setListId} options={lists.map(l => l.id)} /></Field>
          <Field label="Additional journalists">
            <div className="border border-slate-200 rounded-md max-h-40 overflow-y-auto p-2 space-y-1 text-xs">
              {journalists.map(j => (
                <label key={j.id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={extraIds.includes(j.id)} onCheckedChange={(c) => setExtraIds(list => c ? [...list, j.id] : list.filter(x => x !== j.id))} />
                  <span className="text-slate-700">{j.name} <span className="text-slate-400">· {j.publication}</span></span>
                </label>
              ))}
            </div>
          </Field>
          <div className="text-xs text-slate-500">{selected.length} journalist(s) will receive this response.</div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-navy hover:bg-navy/90 text-white" onClick={() => {
            updateResponse(r.id, { status: "Sent to Media", targetMediaContacts: selected, targetListId: listId }, `Sent to ${selected.length} media contacts`);
            selected.forEach(jid => logOutreach({ journalistId: jid, note: `Sent response ${r.id}: ${r.title}`, channel: "Email", outcome: "Pending" }));
            toast.success(`Sent to ${selected.length} media contacts`);
            onClose();
          }}><Send className="h-3.5 w-3.5 mr-1" />Confirm Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════════════
// MEDIA OUTREACH PANEL
// ═══════════════════════════════════════════════════════
export function MediaOutreachPanel() {
  const journalists = useJournalists();
  const lists = useLists();
  const outreach = useOutreach();
  const responses = useResponses();
  const [addJourneyOpen, setAddJourneyOpen] = useState(false);
  const [addListOpen, setAddListOpen] = useState(false);
  const [logOpen, setLogOpen] = useState<Journalist | null>(null);
  const [track, setTrack] = useState(false);
  const [detail, setDetail] = useState<Journalist | null>(null);

  const sent = responses.filter(r => r.status === "Sent to Media" || r.status === "Published");

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Send className="h-4 w-4 text-saffron" />
          <h3 className="text-sm font-semibold text-navy">Media Outreach</h3>
          <div className="ml-auto flex gap-1.5 flex-wrap">
            <Button size="sm" variant="outline" className="h-8" onClick={() => setAddListOpen(true)}><Plus className="h-3.5 w-3.5 mr-1" />Create Media List</Button>
            <Button size="sm" variant="outline" className="h-8" onClick={() => setAddJourneyOpen(true)}><Plus className="h-3.5 w-3.5 mr-1" />Add Journalist</Button>
            <Button size="sm" variant="outline" className="h-8" onClick={() => setTrack(true)}><Eye className="h-3.5 w-3.5 mr-1" />Track Responses</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Metric label="Journalists" value={journalists.length} tone="text-navy" />
          <Metric label="Media Lists" value={lists.length} tone="text-saffron" />
          <Metric label="Responses Sent" value={sent.length} tone="text-emerald-600" />
          <Metric label="Outreach Logs" value={outreach.length} tone="text-blue-700" />
          <Metric label="Pending Responses" value={outreach.filter(o => o.outcome === "Pending").length} tone="text-amber-600" />
        </div>
      </Card>

      <Tabs defaultValue="journalists">
        <TabsList>
          <TabsTrigger value="journalists">Journalists ({journalists.length})</TabsTrigger>
          <TabsTrigger value="lists">Media Lists ({lists.length})</TabsTrigger>
          <TabsTrigger value="recent">Recent Outreach ({sent.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="journalists" className="mt-3">
          <Card className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="text-left p-3">Name</th><th className="text-left p-3">Publication</th>
                  <th className="text-left p-3">Beat</th><th className="text-left p-3">Geo</th>
                  <th className="text-left p-3">Tier</th><th className="text-left p-3">Last Contacted</th>
                  <th className="text-right p-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {journalists.map(j => (
                  <tr key={j.id} className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-navy">{j.name}</td>
                    <td className="p-3 text-slate-700">{j.publication}</td>
                    <td className="p-3"><Badge variant="outline" className="text-[10px]">{j.beat}</Badge></td>
                    <td className="p-3 text-slate-700">{j.geography}</td>
                    <td className="p-3"><Badge variant="outline" className={j.influenceLevel === "Tier 1" ? "text-[10px] bg-saffron/15 text-saffron border-saffron/30" : "text-[10px]"}>{j.influenceLevel}</Badge></td>
                    <td className="p-3 text-slate-700 text-xs">{j.lastContacted}</td>
                    <td className="p-3 text-right pr-4">
                      <div className="inline-flex gap-1">
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setDetail(j)}>Open CRM</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setLogOpen(j)}>Log Outreach</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="lists" className="mt-3">
          <div className="grid md:grid-cols-2 gap-3">
            {lists.map(l => (
              <Card key={l.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold text-navy">{l.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{l.journalistIds.length} journalists</div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{l.id}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {l.journalistIds.map(jid => {
                    const j = journalists.find(x => x.id === jid);
                    return j ? <Badge key={jid} variant="outline" className="text-[10px] bg-slate-50">{j.name}</Badge> : null;
                  })}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-3">
          <div className="space-y-2">
            {sent.length === 0 && <Card className="p-8 text-center text-sm text-slate-500">No responses sent yet.</Card>}
            {sent.map(r => (
              <Card key={r.id} className="p-3">
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <span className="font-mono text-navy">{r.id}</span>
                  <Badge variant="outline" className={statusTone[r.status]}>{r.status}</Badge>
                  <span className="text-slate-700">{r.title}</span>
                  <span className="ml-auto text-slate-500">{fmtRel(r.updatedAt)} · {r.targetMediaContacts.length} contacts</span>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {addJourneyOpen && <AddJournalistDialog onClose={() => setAddJourneyOpen(false)} />}
      {addListOpen && <CreateListDialog onClose={() => setAddListOpen(false)} />}
      {logOpen && <LogOutreachDialog j={logOpen} onClose={() => setLogOpen(null)} />}
      {detail && <CRMContactDrawer j={detail} onClose={() => setDetail(null)} />}
      <TrackResponsesDrawer open={track} onClose={() => setTrack(false)} />
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`text-xl font-bold mt-1 tabular-nums ${tone}`}>{value}</div>
    </div>
  );
}

function AddJournalistDialog({ onClose }: { onClose: () => void }) {
  const [f, setF] = useState({ name: "", publication: "", beat: BEAT_OPTIONS[0], geography: "Bengaluru", email: "", phone: "", whatsapp: "", language: "English", relationshipOwner: "Rohan Iyer", influenceLevel: "Tier 2" as "Tier 1" | "Tier 2" | "Tier 3", notes: "", tags: "" });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-navy">Add Journalist to CRM</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name"><Input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></Field>
          <Field label="Publication"><Input value={f.publication} onChange={e => setF({ ...f, publication: e.target.value })} /></Field>
          <Field label="Beat"><Sel value={f.beat} onChange={v => setF({ ...f, beat: v })} options={BEAT_OPTIONS} /></Field>
          <Field label="Geography"><Input value={f.geography} onChange={e => setF({ ...f, geography: e.target.value })} /></Field>
          <Field label="Email"><Input value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></Field>
          <Field label="Phone"><Input value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} /></Field>
          <Field label="WhatsApp"><Input value={f.whatsapp} onChange={e => setF({ ...f, whatsapp: e.target.value })} /></Field>
          <Field label="Language"><Sel value={f.language} onChange={v => setF({ ...f, language: v })} options={["English","Kannada","Hindi"]} /></Field>
          <Field label="Relationship Owner"><Sel value={f.relationshipOwner} onChange={v => setF({ ...f, relationshipOwner: v })} options={["Anjali Rao","Rohan Iyer","Pooja Hegde"]} /></Field>
          <Field label="Influence Level"><Sel value={f.influenceLevel} onChange={v => setF({ ...f, influenceLevel: v as any })} options={["Tier 1","Tier 2","Tier 3"]} /></Field>
          <Field label="Tags (comma-separated)"><Input value={f.tags} onChange={e => setF({ ...f, tags: e.target.value })} /></Field>
          <Field label="Notes"><Textarea rows={2} value={f.notes} onChange={e => setF({ ...f, notes: e.target.value })} /></Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-navy hover:bg-navy/90 text-white" onClick={() => {
            if (!f.name || !f.publication) { toast.error("Name and publication required"); return; }
            addJournalist({ ...f, lastContacted: "just now", tags: f.tags.split(",").map(t => t.trim()).filter(Boolean) });
            toast.success("Journalist added to CRM"); onClose();
          }}>Add to CRM</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CreateListDialog({ onClose }: { onClose: () => void }) {
  const journalists = useJournalists();
  const [name, setName] = useState(MEDIA_LIST_OPTIONS[0]);
  const [ids, setIds] = useState<string[]>([]);
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="text-navy">Create Media List</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Field label="List Name">
            <div className="flex gap-2">
              <Sel value={name} onChange={setName} options={MEDIA_LIST_OPTIONS} />
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Or type custom name" />
            </div>
          </Field>
          <Field label="Members">
            <div className="border border-slate-200 rounded-md max-h-48 overflow-y-auto p-2 space-y-1 text-xs">
              {journalists.map(j => (
                <label key={j.id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={ids.includes(j.id)} onCheckedChange={(c) => setIds(list => c ? [...list, j.id] : list.filter(x => x !== j.id))} />
                  <span>{j.name} <span className="text-slate-400">· {j.publication} · {j.beat}</span></span>
                </label>
              ))}
            </div>
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-navy hover:bg-navy/90 text-white" onClick={() => {
            if (!name || ids.length === 0) { toast.error("Name and members required"); return; }
            addList(name, ids); toast.success(`List "${name}" created`); onClose();
          }}>Create List</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function LogOutreachDialog({ j, onClose }: { j: Journalist; onClose: () => void }) {
  const [channel, setChannel] = useState<"Call" | "WhatsApp" | "Email" | "In-Person">("Call");
  const [note, setNote] = useState("");
  const [outcome, setOutcome] = useState<"Pending" | "Responded" | "Declined" | "Published">("Pending");
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-navy">Log Outreach · {j.name}</DialogTitle>
          <DialogDescription>{j.publication} · {j.beat}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Field label="Channel"><Sel value={channel} onChange={v => setChannel(v as any)} options={["Call","WhatsApp","Email","In-Person"]} /></Field>
          <Field label="Outcome"><Sel value={outcome} onChange={v => setOutcome(v as any)} options={["Pending","Responded","Declined","Published"]} /></Field>
          <Field label="Note"><Textarea rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="What was discussed?" /></Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-navy hover:bg-navy/90 text-white" onClick={() => {
            logOutreach({ journalistId: j.id, channel, note, outcome });
            toast.success("Outreach logged"); onClose();
          }}>Save Log</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CRMContactDrawer({ j, onClose }: { j: Journalist; onClose: () => void }) {
  const outreach = useOutreach().filter(o => o.journalistId === j.id);
  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader><SheetTitle className="text-navy">{j.name}</SheetTitle></SheetHeader>
        <div className="mt-4 space-y-3 text-sm">
          <div className="rounded border border-slate-200 p-3 space-y-1.5">
            <div className="flex items-center gap-2 text-xs"><Newspaper className="h-3 w-3 text-slate-400" />{j.publication}</div>
            <div className="flex items-center gap-2 text-xs"><Badge variant="outline" className="text-[10px]">{j.beat}</Badge><Badge variant="outline" className="text-[10px]">{j.geography}</Badge><Badge variant="outline" className="text-[10px] bg-saffron/15 text-saffron border-saffron/30">{j.influenceLevel}</Badge></div>
            <div className="flex items-center gap-2 text-xs text-slate-600"><Mail className="h-3 w-3" />{j.email}</div>
            <div className="flex items-center gap-2 text-xs text-slate-600"><Phone className="h-3 w-3" />{j.phone}</div>
            <div className="flex items-center gap-2 text-xs text-slate-600"><MessageSquare className="h-3 w-3" />{j.whatsapp}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-500 tracking-wide mb-1">Notes</div>
            <div className="text-xs text-slate-700">{j.notes}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-500 tracking-wide mb-1">Tags</div>
            <div className="flex flex-wrap gap-1">{j.tags.map(t => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-500 tracking-wide mb-1">Outreach Timeline</div>
            {outreach.length === 0 && <div className="text-xs text-slate-400 italic">No outreach logged yet.</div>}
            <div className="space-y-1.5">
              {outreach.map(o => (
                <div key={o.id} className="text-xs border border-slate-200 rounded p-2">
                  <div className="flex items-center gap-2"><Badge variant="outline" className="text-[10px]">{o.channel}</Badge><Badge variant="outline" className="text-[10px]">{o.outcome}</Badge><span className="ml-auto text-slate-400">{fmtRel(o.at)}</span></div>
                  <div className="text-slate-700 mt-1">{o.note || "—"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function TrackResponsesDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const outreach = useOutreach();
  const journalists = useJournalists();
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader><SheetTitle className="text-navy">Track Journalist Responses</SheetTitle></SheetHeader>
        <div className="mt-4 space-y-2 text-sm">
          {outreach.length === 0 && <div className="text-xs text-slate-400 italic">No outreach yet. Send a response or log outreach to start tracking.</div>}
          {outreach.map(o => {
            const j = journalists.find(x => x.id === o.journalistId);
            return (
              <div key={o.id} className="border border-slate-200 rounded p-2.5">
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <span className="font-medium text-navy">{j?.name ?? "Unknown"}</span>
                  <span className="text-slate-500">· {j?.publication}</span>
                  <Badge variant="outline" className="text-[10px]">{o.channel}</Badge>
                  <Badge variant="outline" className={`text-[10px] ${o.outcome === "Responded" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : o.outcome === "Published" ? "bg-saffron/15 text-saffron border-saffron/30" : o.outcome === "Declined" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-amber-50 text-amber-800 border-amber-200"}`}>{o.outcome}</Badge>
                  <span className="ml-auto text-slate-400">{fmtRel(o.at)}</span>
                </div>
                <div className="text-xs text-slate-700 mt-1">{o.note || "—"}</div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ═══════════════════════════════════════════════════════
// LINKED RECORDS BADGES (for NewsCard)
// ═══════════════════════════════════════════════════════
export function LinkedRecordBadges({ items }: { items: { kind: string; label: string }[] }) {
  if (items.length === 0) return null;
  const iconMap: Record<string, React.ReactNode> = {
    case: <ClipboardList className="h-3 w-3" />,
    response: <FileText className="h-3 w-3" />,
    social: <Radio className="h-3 w-3" />,
    briefing: <Newspaper className="h-3 w-3" />,
    journalist: <Users className="h-3 w-3" />,
    followup: <ArrowRight className="h-3 w-3" />,
    inspection: <Eye className="h-3 w-3" />,
    commitment: <CheckCircle2 className="h-3 w-3" />,
    event: <Users className="h-3 w-3" />,
    broadcast: <Radio className="h-3 w-3" />,
  };
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {items.map((l, i) => (
        <Badge key={i} variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
          {iconMap[l.kind] ?? <CheckCircle2 className="h-3 w-3" />} <span className="ml-1">{l.label}</span>
        </Badge>
      ))}
    </div>
  );
}
