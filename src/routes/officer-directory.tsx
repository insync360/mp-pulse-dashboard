import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search, Phone, Mail, X, FileSignature, Star, ArrowRightLeft, Calendar, Building2,
  ClipboardList, Folder,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useData } from "@/data/store";
import type { Officer } from "@/data/types";
import { formatDate } from "@/data/selectors";
import { toast } from "sonner";

export const Route = createFileRoute("/officer-directory")({
  head: () => ({ meta: [{ title: "Officer Directory — Citizen Pulse" }] }),
  component: OfficerDirectoryPage,
});

const Stars = ({ n }: { n: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} className={`h-3.5 w-3.5 ${i <= n ? "fill-saffron text-saffron" : "text-slate-300"}`} />
    ))}
  </div>
);

function OfficerDirectoryPage() {
  const { officers, departments, cases, letters, deptFiles } = useData();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");
  const [juris, setJuris] = useState("all");
  const [drawer, setDrawer] = useState<Officer | null>(null);

  const jurs = Array.from(new Set(officers.map((o) => o.jurisdiction)));

  const filtered = useMemo(
    () =>
      officers.filter(
        (o) =>
          (dept === "all" || o.departmentId === dept) &&
          (juris === "all" || o.jurisdiction === juris) &&
          (!q ||
            o.name.toLowerCase().includes(q.toLowerCase()) ||
            o.designation.toLowerCase().includes(q.toLowerCase())),
      ),
    [officers, dept, juris, q],
  );

  const deptShort = (id: string) => departments.find((d) => d.id === id)?.short ?? "—";
  const pendingFor = (oid: string) =>
    cases.filter((c) => c.officerId === oid && c.status !== "Resolved" && c.status !== "Auto-Closed").length;

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-navy">Officer Directory</h1>
        <p className="text-sm text-muted-foreground">
          Every official the MP office works with — wired to live case load, letters and pending files.
        </p>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or designation…" className="pl-8" />
          </div>
          <Select value={dept} onValueChange={setDept}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All departments</SelectItem>
              {departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.short}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={juris} onValueChange={setJuris}>
            <SelectTrigger className="w-52"><SelectValue placeholder="Jurisdiction" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All jurisdictions</SelectItem>
              {jurs.map((j) => <SelectItem key={j} value={j}>{j}</SelectItem>)}
            </SelectContent>
          </Select>
          <Badge variant="outline">{filtered.length} officers</Badge>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((o) => {
          const pending = pendingFor(o.id);
          return (
            <Card key={o.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setDrawer(o)}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-navy">{o.name}</div>
                    <div className="text-xs text-slate-600">{o.designation}</div>
                  </div>
                  {pending > 0 && <Badge className="bg-saffron/15 text-saffron hover:bg-saffron/15">{pending} open</Badge>}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="gap-1"><Building2 className="h-3 w-3" />{deptShort(o.departmentId)}</Badge>
                  <span className="text-slate-500">{o.jurisdiction}</span>
                </div>
                <div className="text-xs text-slate-600 flex flex-col gap-1">
                  <div className="flex items-center gap-2"><Phone className="h-3 w-3" />{o.phone}</div>
                  <div className="flex items-center gap-2 truncate"><Mail className="h-3 w-3" />{o.email}</div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-[10px] uppercase text-slate-500">{o.tenure}</span>
                  <Stars n={o.responsiveness} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Sheet open={!!drawer} onOpenChange={(o) => !o && setDrawer(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {drawer && <OfficerDetail o={drawer} onClose={() => setDrawer(null)} cases={cases} letters={letters} deptFiles={deptFiles} deptShort={deptShort} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function OfficerDetail({ o, onClose, cases, letters, deptFiles, deptShort }: {
  o: Officer; onClose: () => void;
  cases: ReturnType<typeof useData>["cases"];
  letters: ReturnType<typeof useData>["letters"];
  deptFiles: ReturnType<typeof useData>["deptFiles"];
  deptShort: (id: string) => string;
}) {
  const navigate = useNavigate();
  const { setLetterDraft } = useData();
  const relatedCases = cases.filter((c) => c.officerId === o.id);
  const relatedLetters = letters.filter((l) => l.officerId === o.id);
  const relatedFiles = deptFiles.filter((f) => f.officerId === o.id);

  const generateLetter = () => {
    setLetterDraft({
      templateId: "formal-req",
      officerId: o.id,
      recipientName: o.name,
      recipientDesignation: o.designation,
      recipientOffice: deptShort(o.departmentId),
      subject: `Representation to ${o.designation}`,
      fields: { location: typeof o.jurisdiction === "string" ? o.jurisdiction : "Constituency", request: "kindly examine the matter on priority" },
      linkedToLabel: `Officer ${o.name}`,
    });
    toast.success("Letter prefilled with officer details");
    navigate({ to: "/recommendation-letters" });
  };

  return (
    <>
      <SheetHeader>
        <div className="flex items-start justify-between">
          <div>
            <SheetTitle className="text-navy">{o.name}</SheetTitle>
            <div className="text-sm text-slate-600">{o.designation} · {deptShort(o.departmentId)}</div>
            <div className="text-xs text-slate-500">{o.jurisdiction}</div>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="flex gap-3 mt-2 items-center"><Stars n={o.responsiveness} /><span className="text-xs text-slate-500">Responsiveness</span></div>
      </SheetHeader>

      <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
        <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" />{o.phone}</div>
        <div className="flex items-center gap-2 truncate"><Mail className="h-4 w-4 text-slate-400" />{o.email}</div>
        <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" />{o.tenure}</div>
        <div className="flex items-center gap-2"><ArrowRightLeft className="h-4 w-4 text-slate-400" />{o.transferHistory.length} transfer(s)</div>
      </div>

      <div className="mt-5">
        <div className="text-xs font-semibold uppercase text-slate-500 mb-2 flex items-center gap-1">
          <ClipboardList className="h-3 w-3 text-saffron" /> Assigned cases ({relatedCases.length})
        </div>
        <div className="space-y-2">
          {relatedCases.map((c) => (
            <Link to="/cases" key={c.id}>
              <div className="border rounded-md p-2 bg-slate-50 hover:bg-slate-100 cursor-pointer">
                <div className="text-xs font-mono text-slate-500">{c.id}</div>
                <div className="text-sm font-medium text-navy line-clamp-1">{c.description}</div>
                <div className="text-xs text-muted-foreground">{c.status} · {c.priority}</div>
              </div>
            </Link>
          ))}
          {relatedCases.length === 0 && <div className="text-xs italic text-muted-foreground">No cases assigned</div>}
        </div>
      </div>

      <div className="mt-5">
        <div className="text-xs font-semibold uppercase text-slate-500 mb-2 flex items-center gap-1">
          <FileSignature className="h-3 w-3 text-saffron" /> Letters sent to officer ({relatedLetters.length})
        </div>
        <div className="space-y-2">
          {relatedLetters.map((l) => (
            <Link to="/recommendation-letters" key={l.id}>
              <div className="border rounded-md p-2 bg-slate-50 hover:bg-slate-100 cursor-pointer">
                <div className="text-xs font-mono text-slate-500">{l.id}</div>
                <div className="text-sm font-medium text-navy line-clamp-1">{l.subject}</div>
                <div className="text-xs text-muted-foreground">{l.status} · {formatDate(l.date)}</div>
              </div>
            </Link>
          ))}
          {relatedLetters.length === 0 && <div className="text-xs italic text-muted-foreground">None</div>}
        </div>
      </div>

      <div className="mt-5">
        <div className="text-xs font-semibold uppercase text-slate-500 mb-2 flex items-center gap-1">
          <Folder className="h-3 w-3 text-saffron" /> Department files ({relatedFiles.length})
        </div>
        <div className="space-y-2">
          {relatedFiles.map((f) => (
            <Link to="/department-files" key={f.id}>
              <div className="border rounded-md p-2 bg-slate-50 hover:bg-slate-100 cursor-pointer">
                <div className="text-xs font-mono text-slate-500">{f.refNo}</div>
                <div className="text-sm font-medium text-navy line-clamp-1">{f.subject}</div>
                <div className="text-xs text-muted-foreground">L{f.escalationLevel} · {f.status}{f.bottleneck ? ` · ${f.bottleneck}` : ""}</div>
              </div>
            </Link>
          ))}
          {relatedFiles.length === 0 && <div className="text-xs italic text-muted-foreground">None</div>}
        </div>
      </div>

      <div className="mt-5">
        <div className="text-xs font-semibold uppercase text-slate-500 mb-2">Transfer history</div>
        {o.transferHistory.length === 0 && <div className="text-xs text-muted-foreground italic">No transfers logged</div>}
        {o.transferHistory.map((t, i) => (
          <div key={i} className="text-xs flex items-center gap-2 py-1">
            <Badge variant="outline">{t.date}</Badge>
            <span>{t.from}</span><ArrowRightLeft className="h-3 w-3" /><span className="font-medium">{t.to}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t">
        <Button className="w-full bg-saffron hover:bg-saffron/90 text-navy" onClick={generateLetter}>
          <FileSignature className="h-4 w-4" /> Generate Letter (pre-filled)
        </Button>
      </div>
    </>
  );
}
