import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, FileText, PenLine, Eye, Save, CheckCircle2 } from "lucide-react";
import { useLetterhead, setLetterhead, LANGUAGES } from "@/lib/press-desk-store";
import { LetterheadPreviewDialog } from "@/components/press-desk-workflow";

export function TemplatesLetterheadsTab() {
  const lh = useLetterhead();
  const [form, setForm] = useState(lh);
  const [preview, setPreview] = useState(false);
  const upd = (k: keyof typeof form) => (v: string) => setForm({ ...form, [k]: v });

  const simulateUpload = (field: "letterheadFile" | "logoName" | "signatureName", label: string) => {
    const name = `${label.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString(36)}.png`;
    setForm(f => ({ ...f, [field]: name }));
    toast.success(`${label} uploaded: ${name}`);
  };

  return (
    <div className="space-y-5">
      <Card className="border-slate-200 bg-gradient-to-r from-[#0A1F44] to-[#0A1F44]/90 text-white">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#FF9933]/20 text-[#FF9933] flex items-center justify-center"><FileText className="h-5 w-5" /></div>
            <div>
              <div className="text-sm font-semibold">Templates & Letterheads</div>
              <div className="text-xs opacity-75">Manage the official letterhead and signature used by Press Desk drafts.</div>
            </div>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-100 border-0 gap-1"><CheckCircle2 className="h-3 w-3" /> Active template: {lh.letterheadFile}</Badge>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-5">
        {/* File uploads */}
        <Card className="border-slate-200">
          <CardHeader><CardTitle className="text-[#0A1F44] text-base flex items-center gap-2"><Upload className="w-4 h-4 text-[#FF9933]" /> Uploads</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <UploadRow label="Official Letterhead" file={form.letterheadFile} onUpload={() => simulateUpload("letterheadFile", "Letterhead")} />
            <UploadRow label="Signature" file={form.signatureName} onUpload={() => simulateUpload("signatureName", "Signature")} />
            <UploadRow label="Logo / Party Symbol" file={form.logoName} onUpload={() => simulateUpload("logoName", "Logo")} />
          </CardContent>
        </Card>

        {/* Office details */}
        <Card className="border-slate-200">
          <CardHeader><CardTitle className="text-[#0A1F44] text-base flex items-center gap-2"><PenLine className="w-4 h-4 text-[#FF9933]" /> Office Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><Label className="text-xs uppercase text-slate-500">Office name</Label><Input value={form.officeName} onChange={e => upd("officeName")(e.target.value)} className="mt-1.5" /></div>
            <div><Label className="text-xs uppercase text-slate-500">Address</Label><Textarea rows={2} value={form.address} onChange={e => upd("address")(e.target.value)} className="mt-1.5" /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label className="text-xs uppercase text-slate-500">Email</Label><Input value={form.email} onChange={e => upd("email")(e.target.value)} className="mt-1.5" /></div>
              <div><Label className="text-xs uppercase text-slate-500">Phone</Label><Input value={form.phone} onChange={e => upd("phone")(e.target.value)} className="mt-1.5" /></div>
            </div>
            <div><Label className="text-xs uppercase text-slate-500">Authorized Signatory</Label><Input value={form.signatory} onChange={e => upd("signatory")(e.target.value)} className="mt-1.5" /></div>
            <div>
              <Label className="text-xs uppercase text-slate-500">Default Language</Label>
              <Select value={form.defaultLanguage} onValueChange={(v) => setForm({ ...form, defaultLanguage: v as any })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>{LANGUAGES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardHeader><CardTitle className="text-[#0A1F44] text-base">Footer & Disclaimer</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label className="text-xs uppercase text-slate-500">Footer text</Label><Textarea rows={2} value={form.footer} onChange={e => upd("footer")(e.target.value)} className="mt-1.5" /></div>
          <div><Label className="text-xs uppercase text-slate-500">Default disclaimer</Label><Textarea rows={2} value={form.disclaimer} onChange={e => upd("disclaimer")(e.target.value)} className="mt-1.5" /></div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 justify-end">
        <Button variant="outline" onClick={() => setPreview(true)}><Eye className="h-3.5 w-3.5 mr-1" /> Preview Template</Button>
        <Button className="bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white" onClick={() => { setLetterhead(form); toast.success("Letterhead template saved"); }}><Save className="h-3.5 w-3.5 mr-1" /> Save Template</Button>
      </div>

      <LetterheadPreviewDialog
        open={preview} onClose={() => setPreview(false)}
        title="Sample: Office Statement"
        body={`This is a preview of your saved letterhead template with all configured office details.\n\nAny draft prepared in Press Desk that selects this template will be rendered inside this frame — including tri-lingual content, signatory line, and disclaimer footer.\n\n"Every citizen deserves a responsive office." — MP`}
        letterhead={form}
      />
    </div>
  );
}

function UploadRow({ label, file, onUpload }: { label: string; file?: string; onUpload: () => void }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/60">
      <div className="h-10 w-10 rounded-md bg-white border border-slate-200 flex items-center justify-center"><FileText className="h-4 w-4 text-slate-400" /></div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[#0A1F44]">{label}</div>
        <div className="text-[11px] text-slate-500 truncate">{file || "No file uploaded"}</div>
      </div>
      <Button size="sm" variant="outline" onClick={onUpload}><Upload className="h-3.5 w-3.5 mr-1" /> Upload</Button>
    </div>
  );
}
