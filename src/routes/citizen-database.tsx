import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Users, Search, Phone, Mail, MapPin, ClipboardList, FileSignature,
  HandHelping, Calendar, Star, Paperclip, X, ArrowUpRight, MessageCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/data/store";
import { WARDS, type Citizen } from "@/data/types";
import { formatDate } from "@/data/selectors";
import { suggestedTemplateFor } from "@/components/authority-hint";
import { toast } from "sonner";

export const Route = createFileRoute("/citizen-database")({
  head: () => ({ meta: [{ title: "Citizens — Citizen Pulse" }] }),
  component: CitizenDatabasePage,
});

function CitizenDatabasePage() {
  const { citizens, cases } = useData();
  const [q, setQ] = useState("");
  const [ward, setWard] = useState<string>("all");
  const [active, setActive] = useState<Citizen | null>(null);

  const stats = useMemo(() => {
    const open = cases.filter((c) => c.status !== "Resolved" && c.status !== "Auto-Closed").length;
    return {
      total: citizens.length,
      withMobile: citizens.filter((c) => c.mobiles.length).length,
      withFamily: citizens.filter((c) => c.family.length).length,
      openCases: open,
    };
  }, [citizens, cases]);

  const visible = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return citizens.filter((c) => {
      if (ward !== "all" && c.ward !== ward) return false;
      if (!ql) return true;
      return [c.name, c.address, c.ward, c.id].join(" ").toLowerCase().includes(ql);
    });
  }, [citizens, q, ward]);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-saffron" />
          <h1 className="text-2xl font-bold tracking-tight text-navy">Citizens</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Click any citizen to open their 360 view — every case, letter, scheme, commitment and event linked back.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Kpi label="Registered citizens" value={stats.total} />
        <Kpi label="With mobile" value={stats.withMobile} />
        <Kpi label="With family on file" value={stats.withFamily} />
        <Kpi label="Open cases (constituency)" value={stats.openCases} tone="text-saffron" />
      </div>

      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 h-9" placeholder="Search by name, address, id…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={ward} onValueChange={setWard}>
            <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Ward" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All wards</SelectItem>
              {WARDS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="ml-auto text-xs text-muted-foreground">
            {visible.length} of {citizens.length} citizens
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {visible.map((c) => {
          const openForCitizen = cases.filter((x) => x.citizenId === c.id).length;
          return (
            <Card key={c.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActive(c)}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-navy">{c.name}</div>
                  <div className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" /> {c.address}
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">{c.ward}</Badge>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground inline-flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {c.mobiles[0] ?? "—"}
                </span>
                <Badge className="bg-saffron/15 text-saffron border border-saffron/30">{openForCitizen} records</Badge>
              </div>
            </Card>
          );
        })}
      </div>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full sm:max-w-[640px] overflow-y-auto">
          {active && <Citizen360 c={active} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Kpi({ label, value, tone = "text-navy" }: { label: string; value: number; tone?: string }) {
  return (
    <Card className="p-4">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-2xl font-bold mt-1 tabular-nums ${tone}`}>{value}</div>
    </Card>
  );
}

function Citizen360({ c }: { c: Citizen }) {
  const navigate = useNavigate();
  const {
    cases, letters, commitments, events, attachments, setLetterDraft, getOfficer, departments,
  } = useData();
  const myCases = cases.filter((x) => x.citizenId === c.id);
  const myLetters = letters.filter((l) => l.citizenId === c.id);
  const myCommitments = commitments.filter((cm) => cm.toWhomId === c.id || myCases.some((mc) => mc.id === cm.caseId));
  const mySchemes = myCases.filter((x) => x.recordType === "SchemeRequest");
  const myEvents = events.filter((e) => e.location.includes(c.ward));
  const myAttachments = attachments.filter((a) => a.recordType === "Citizen" && a.recordId === c.id);
  const satisfactions = myCases.filter((x) => typeof x.satisfaction === "number");
  const avgSat = satisfactions.length
    ? (satisfactions.reduce((s, x) => s + (x.satisfaction ?? 0), 0) / satisfactions.length).toFixed(1)
    : "—";

  const genRecommendation = () => {
    setLetterDraft({
      templateId: "recommend",
      citizenId: c.id,
      recipientName: "To Whom It May Concern",
      recipientDesignation: "Concerned Authority",
      subject: `Recommendation — ${c.name}`,
      fields: { subjectName: c.name, location: `${c.address}, ${c.ward}`, request: "kindly extend due consideration as per applicable rules" },
      linkedToLabel: `Citizen ${c.name}`,
    });
    toast.success("Recommendation prefilled — opening composer");
    navigate({ to: "/recommendation-letters" });
  };

  return (
    <div className="space-y-5">
      <SheetHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <SheetTitle className="text-navy">{c.name}</SheetTitle>
            <div className="text-xs text-muted-foreground mt-1">{c.id} · {c.ward}</div>
          </div>
          <Badge className="bg-saffron/15 text-saffron border border-saffron/30">Citizen 360</Badge>
        </div>
      </SheetHeader>

      {/* Profile block */}
      <Card className="p-4 space-y-2">
        <div className="text-xs text-muted-foreground"><MapPin className="h-3 w-3 inline mr-1" /> {c.address}</div>
        {c.mobiles.map((m, i) => (
          <div key={i} className="text-xs text-muted-foreground"><Phone className="h-3 w-3 inline mr-1" /> {m}</div>
        ))}
        {c.family.length > 0 && (
          <div className="pt-2 border-t">
            <div className="text-[10px] uppercase text-muted-foreground mb-1">Family on file</div>
            <div className="flex flex-wrap gap-1">
              {c.family.map((f) => (
                <Badge key={f.name} variant="outline" className="text-[10px]">{f.name} · {f.relation}</Badge>
              ))}
            </div>
          </div>
        )}
        {c.affiliationNote && (
          <div className="pt-2 border-t text-[11px] text-muted-foreground italic">
            Affiliation note: {c.affiliationNote}
          </div>
        )}
        <div className="pt-2 border-t flex items-center gap-3 text-xs">
          <Star className="h-3.5 w-3.5 text-saffron" />
          <span className="text-muted-foreground">Satisfaction:</span>
          <span className="font-semibold text-navy">{avgSat} {satisfactions.length > 0 && `(${satisfactions.length} resp.)`}</span>
        </div>
      </Card>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" className="bg-saffron hover:bg-saffron/90 text-navy" onClick={genRecommendation}>
          <FileSignature className="h-3.5 w-3.5" /> Generate Recommendation
        </Button>
        <Link to="/scheme-assistance">
          <Button size="sm" variant="outline"><HandHelping className="h-3.5 w-3.5" /> Open scheme request</Button>
        </Link>
        <Link to="/inbox">
          <Button size="sm" variant="outline"><MessageCircle className="h-3.5 w-3.5" /> Log new contact</Button>
        </Link>
      </div>

      {/* Cases */}
      <RelatedList title={`Cases (${myCases.length})`} icon={ClipboardList}>
        {myCases.map((x) => {
          const off = x.officerId ? getOfficer(x.officerId) : undefined;
          const dept = x.departmentId ? departments.find((d) => d.id === x.departmentId) : undefined;
          return (
            <Link to="/cases" key={x.id} className="block">
              <Card className="p-2.5 hover:bg-muted/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono">{x.id}</span>
                  <Badge variant="outline" className="text-[10px]">{x.recordType}</Badge>
                </div>
                <div className="text-sm text-navy line-clamp-1 mt-0.5">{x.description}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {x.status} · {dept?.short ?? "—"} · {off?.name ?? "—"}
                </div>
              </Card>
            </Link>
          );
        })}
      </RelatedList>

      {/* Letters */}
      <RelatedList title={`Letters (${myLetters.length})`} icon={FileSignature}>
        {myLetters.map((l) => (
          <Link to="/recommendation-letters" key={l.id} className="block">
            <Card className="p-2.5 hover:bg-muted/40">
              <div className="text-xs font-mono">{l.id}</div>
              <div className="text-sm text-navy">{l.subject}</div>
              <div className="text-[11px] text-muted-foreground">{l.status} · {formatDate(l.date)}</div>
            </Card>
          </Link>
        ))}
      </RelatedList>

      {/* Scheme requests */}
      <RelatedList title={`Scheme requests (${mySchemes.length})`} icon={HandHelping}>
        {mySchemes.map((s) => (
          <Card key={s.id} className="p-2.5">
            <div className="text-xs font-mono">{s.id}</div>
            <div className="text-sm">{s.description}</div>
            <div className="text-[11px] text-muted-foreground">{s.status}</div>
          </Card>
        ))}
      </RelatedList>

      {/* Commitments */}
      <RelatedList title={`Commitments (${myCommitments.length})`} icon={ArrowUpRight}>
        {myCommitments.map((cm) => (
          <Card key={cm.id} className="p-2.5">
            <div className="text-sm">{cm.text}</div>
            <div className="text-[11px] text-muted-foreground">{cm.status} · due {formatDate(cm.dueDate)}</div>
          </Card>
        ))}
      </RelatedList>

      {/* Events */}
      <RelatedList title={`Events in ward (${myEvents.length})`} icon={Calendar}>
        {myEvents.map((e) => (
          <Card key={e.id} className="p-2.5">
            <div className="text-sm font-medium text-navy">{e.name}</div>
            <div className="text-[11px] text-muted-foreground">{formatDate(e.date)} · {e.stage}</div>
          </Card>
        ))}
      </RelatedList>

      {/* Attachments */}
      <RelatedList title={`Attachments (${myAttachments.length})`} icon={Paperclip}>
        {myAttachments.map((a) => (
          <div key={a.id} className="text-xs flex items-center justify-between px-2 py-1.5 rounded border bg-card">
            <span className="truncate text-navy">{a.name}</span>
            <span className="text-muted-foreground ml-2">{a.kind} · {a.size}</span>
          </div>
        ))}
      </RelatedList>
    </div>
  );
}

function RelatedList({ title, icon: Icon, children }: {
  title: string; icon: typeof ClipboardList; children: React.ReactNode;
}) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground mb-2">
        <Icon className="h-3.5 w-3.5 text-saffron" /> {title}
      </div>
      {items.length === 0 || items.every((x) => x === null || x === false) ? (
        <div className="text-xs text-muted-foreground">None on file.</div>
      ) : (
        <div className="space-y-1.5">{children}</div>
      )}
    </div>
  );
}
