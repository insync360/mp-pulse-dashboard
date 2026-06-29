import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Archive,
  Search,
  Upload,
  FileText,
  Image as ImageIcon,
  Link2,
  Lock,
  AlertTriangle,
  Grid3x3,
  List as ListIcon,
  History,
  ScanLine,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/document-vault")({
  head: () => ({ meta: [{ title: "Document Vault — Citizen Pulse" }] }),
  component: DocumentVaultPage,
});

interface Doc {
  id: string;
  name: string;
  type: string;
  linkedTo: string;
  uploadedBy: string;
  date: string;
  size: string;
  expiry?: string;
  sensitive?: boolean;
  versions: number;
}

const DOC_TYPES = [
  "All", "Application", "ID Proof", "Medical", "Land", "Estimate",
  "Tender", "Work Order", "Completion Cert.", "Dept Reply", "Letter", "RTI Reply", "Court/Police",
];

const DOCS: Doc[] = [
  { id: "D-4210", name: "Aadhaar — Lakshmi N (widow pension).pdf", type: "ID Proof", linkedTo: "Citizen #C-1872", uploadedBy: "Ramya", date: "Today", size: "412 KB", versions: 1, sensitive: true },
  { id: "D-4209", name: "KR Puram drainage estimate — PWD.pdf", type: "Estimate", linkedTo: "File #PWD-2289", uploadedBy: "Suresh", date: "Today", size: "2.1 MB", versions: 2 },
  { id: "D-4208", name: "BBMP letter — Hebbal flyover repairs.pdf", type: "Dept Reply", linkedTo: "Grievance #G-1124", uploadedBy: "Mohan", date: "Yesterday", size: "318 KB", versions: 1 },
  { id: "D-4207", name: "Site photos — Mahadevapura drains.zip", type: "Application", linkedTo: "Demand #DM-204", uploadedBy: "Field Vol.", date: "Yesterday", size: "8.4 MB", versions: 1 },
  { id: "D-4206", name: "Recommendation — St Mary's CBSE.docx", type: "Letter", linkedTo: "Letter #L-2207", uploadedBy: "Ramya", date: "2 d ago", size: "94 KB", versions: 3 },
  { id: "D-4205", name: "RTI reply — Mahadayi project.pdf", type: "RTI Reply", linkedTo: "Research", uploadedBy: "Anjali", date: "3 d ago", size: "1.8 MB", versions: 1, expiry: "Reply window 12 d" },
  { id: "D-4204", name: "Work order — Yelahanka borewell.pdf", type: "Work Order", linkedTo: "Project #MPL-0419", uploadedBy: "Mohan", date: "4 d ago", size: "640 KB", versions: 1 },
  { id: "D-4203", name: "Medical bills — Praveen K.pdf", type: "Medical", linkedTo: "Case #G-1089", uploadedBy: "Deepa", date: "5 d ago", size: "1.2 MB", versions: 1, sensitive: true },
  { id: "D-4202", name: "Khata extract — Bommanahalli plot.pdf", type: "Land", linkedTo: "Citizen #C-1654", uploadedBy: "Adv. Vinay", date: "6 d ago", size: "780 KB", versions: 2 },
  { id: "D-4201", name: "Completion cert — Smart City lights.pdf", type: "Completion Cert.", linkedTo: "Project #SC-118", uploadedBy: "Suresh", date: "1 wk ago", size: "510 KB", versions: 1 },
  { id: "D-4200", name: "Police case copy — Shivajinagar.pdf", type: "Court/Police", linkedTo: "Case #G-1066", uploadedBy: "Adv. Vinay", date: "1 wk ago", size: "920 KB", versions: 1, sensitive: true },
  { id: "D-4199", name: "Tender notice — Lake rejuvenation.pdf", type: "Tender", linkedTo: "Project #LK-008", uploadedBy: "Mohan", date: "2 wk ago", size: "1.5 MB", versions: 1, expiry: "Closes in 6 d" },
];

function DocumentVaultPage() {
  const [view, setView] = useState<"grid" | "list">("list");
  const [type, setType] = useState("All");
  const [query, setQuery] = useState("");

  const docs = useMemo(
    () =>
      DOCS.filter((d) => type === "All" || d.type === type).filter((d) =>
        query
          ? d.name.toLowerCase().includes(query.toLowerCase()) ||
            d.linkedTo.toLowerCase().includes(query.toLowerCase())
          : true,
      ),
    [type, query],
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1500px] mx-auto">
      <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-saffron" />
            <h1 className="text-2xl font-bold tracking-tight text-navy">Document Vault</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            One source of truth — every doc linked to a citizen, case, project, event or officer.
          </p>
        </div>
        <Button className="bg-navy text-white hover:bg-navy/90">
          <Upload className="h-4 w-4" /> Upload / Scan
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Documents" value="4,210" icon={FileText} />
        <Stat label="Linked to records" value="88%" icon={Link2} tone="text-emerald-600" />
        <Stat label="Expiring soon" value="12" icon={AlertTriangle} tone="text-saffron" />
        <Stat label="Sensitive (restricted)" value="186" icon={Lock} tone="text-red-600" />
      </div>

      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search by name, mobile, doc type, citizen, file no…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm"><ScanLine className="h-4 w-4" /> OCR search</Button>
          <div className="flex rounded-md border">
            <button
              onClick={() => setView("list")}
              className={cn("px-2.5 py-1.5", view === "list" ? "bg-navy text-white" : "text-navy")}
            >
              <ListIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("grid")}
              className={cn("px-2.5 py-1.5", view === "grid" ? "bg-navy text-white" : "text-navy")}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {DOC_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                "text-xs px-2.5 py-1 rounded-full border",
                type === t ? "bg-saffron text-navy border-saffron font-semibold" : "bg-white text-navy border-border hover:bg-slate-50",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </Card>

      {view === "list" ? (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-2.5">Document</th>
                <th className="text-left px-4 py-2.5">Type</th>
                <th className="text-left px-4 py-2.5">Linked to</th>
                <th className="text-left px-4 py-2.5">Uploaded</th>
                <th className="text-left px-4 py-2.5">Flags</th>
                <th className="text-left px-4 py-2.5">Versions</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id} className="border-t hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-navy">{d.name}</div>
                    <div className="text-xs text-muted-foreground">{d.id} · {d.size}</div>
                  </td>
                  <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{d.type}</Badge></td>
                  <td className="px-4 py-3 text-xs"><Link2 className="h-3 w-3 inline mr-1 text-saffron" />{d.linkedTo}</td>
                  <td className="px-4 py-3 text-xs">
                    <div>{d.uploadedBy}</div>
                    <div className="text-muted-foreground">{d.date}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {d.sensitive && <Badge className="bg-red-50 text-red-700 border border-red-200 text-[10px]"><Lock className="h-3 w-3 mr-0.5" /> Sensitive</Badge>}
                      {d.expiry && <Badge className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px]">{d.expiry}</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground inline-flex items-center gap-1">
                    <History className="h-3 w-3" /> v{d.versions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {docs.map((d) => (
            <Card key={d.id} className="p-4">
              <div className="h-24 rounded bg-slate-100 flex items-center justify-center mb-3">
                {d.type === "Application" ? <ImageIcon className="h-8 w-8 text-slate-400" /> : <FileText className="h-8 w-8 text-slate-400" />}
              </div>
              <div className="text-sm font-medium text-navy line-clamp-2">{d.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{d.type} · {d.size}</div>
              <div className="text-xs text-muted-foreground mt-0.5"><Link2 className="h-3 w-3 inline" /> {d.linkedTo}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {d.sensitive && <Badge className="bg-red-50 text-red-700 border border-red-200 text-[10px]"><Lock className="h-3 w-3" /></Badge>}
                {d.expiry && <Badge className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px]">{d.expiry}</Badge>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, icon: Icon, tone = "text-navy" }: { label: string; value: string; icon: typeof FileText; tone?: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className={cn("text-2xl font-bold mt-1", tone)}>{value}</div>
        </div>
        <Icon className={cn("h-5 w-5", tone)} />
      </div>
    </Card>
  );
}
