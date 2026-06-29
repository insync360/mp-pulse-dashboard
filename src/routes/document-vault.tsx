import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  FolderOpen, Search, FileText, ImageIcon, FileArchive, FileType,
  ShieldAlert, Paperclip,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/data/store";
import type { AttachableRecord } from "@/data/types";
import { formatDate } from "@/data/selectors";

export const Route = createFileRoute("/document-vault")({
  head: () => ({ meta: [{ title: "Document Vault — Citizen Pulse" }] }),
  component: DocumentVaultPage,
});

const KIND_ICON = {
  PDF: FileText, Image: ImageIcon, DOCX: FileType, ZIP: FileArchive, Other: Paperclip,
} as const;

const recordRoute: Record<AttachableRecord, string> = {
  Case: "/cases",
  Citizen: "/citizen-database",
  Officer: "/officer-directory",
  Letter: "/recommendation-letters",
  Commitment: "/commitment-tracker",
  Event: "/event-lifecycle",
  Project: "/funds-and-projects",
  Demand: "/development-demand-bank",
  DeptFile: "/department-files",
  Organisation: "/stakeholder-crm",
};

function DocumentVaultPage() {
  const { attachments, getCitizen, getOfficer, getCase, letters } = useData();
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<string>("all");
  const [scope, setScope] = useState<string>("all");

  const visible = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return attachments.filter((a) => {
      if (kind !== "all" && a.kind !== kind) return false;
      if (scope !== "all" && a.recordType !== scope) return false;
      if (!ql) return true;
      return [a.name, a.uploadedBy, a.recordId].join(" ").toLowerCase().includes(ql);
    });
  }, [attachments, q, kind, scope]);

  const labelFor = (a: typeof attachments[number]) => {
    switch (a.recordType) {
      case "Citizen": return getCitizen(a.recordId)?.name ?? a.recordId;
      case "Officer": return getOfficer(a.recordId)?.name ?? a.recordId;
      case "Case": return getCase(a.recordId)?.description?.slice(0, 60) ?? a.recordId;
      case "Letter": return letters.find((l) => l.id === a.recordId)?.subject ?? a.recordId;
      default: return a.recordId;
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1300px] mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <FolderOpen className="h-5 w-5 text-saffron" />
        <h1 className="text-2xl font-bold text-navy">Document Vault</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Global search across every attachment uploaded on a Case, Citizen, Officer, Letter or Project.
      </p>

      <Card className="p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9 h-9" placeholder="Search filename, uploader, record id…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={kind} onValueChange={setKind}>
          <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {["PDF", "Image", "DOCX", "ZIP", "Other"].map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={scope} onValueChange={setScope}>
          <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Attached to" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All record types</SelectItem>
            {Object.keys(recordRoute).map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="text-xs text-muted-foreground ml-auto">{visible.length} of {attachments.length} files</div>
      </Card>

      <Card>
        <div className="divide-y">
          {visible.map((a) => {
            const Icon = KIND_ICON[a.kind] ?? Paperclip;
            return (
              <div key={a.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40">
                <div className="h-9 w-9 rounded bg-muted flex items-center justify-center text-navy">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-navy truncate">{a.name}</span>
                    {a.sensitive && (
                      <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px] gap-1">
                        <ShieldAlert className="h-2.5 w-2.5" /> sensitive
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {a.kind} · {a.size} · uploaded by {a.uploadedBy} · {formatDate(a.uploadedAt)}
                  </div>
                </div>
                <Link to={recordRoute[a.recordType]}>
                  <Badge variant="outline" className="text-[10px] cursor-pointer hover:bg-saffron/10">
                    {a.recordType}: {labelFor(a).toString().slice(0, 36)}
                  </Badge>
                </Link>
              </div>
            );
          })}
          {visible.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">No matching files.</div>
          )}
        </div>
      </Card>
    </div>
  );
}
