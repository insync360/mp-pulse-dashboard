import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, FileSignature, Building2, User, Camera, FileText, ArrowRight, Sparkles, GitBranch, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/authority-mapping")({
  head: () => ({ meta: [{ title: "Authority Mapping — Citizen Pulse" }] }),
  component: AuthorityMappingPage,
});

type Owner = {
  scenario: string;
  department: string;
  officer: string;
  documents: string[];
  template: string;
  escalation: string[];
  sla: string;
};

type IssueMap = { issue: string; owners: Owner[] };

const ISSUES: IssueMap[] = [
  { issue: "Road broken / pothole", owners: [
    { scenario: "Inside BBMP city limit (most Bengaluru wards)", department: "BBMP — Engineering", officer: "AEE / EE (Ward / Sub-division)", documents: ["Photo of pothole", "Geo-tagged location", "Ward number"], template: "Letter to JC (Roads), BBMP Zone", escalation: ["AEE Ward","EE Sub-division","JC Zone","Chief Commissioner BBMP"], sla: "7–15 days" },
    { scenario: "On State Highway / SH (PWD jurisdiction)", department: "PWD — Roads Wing", officer: "AEE / EE PWD Sub-division", documents: ["Photo", "Stretch name / chainage"], template: "Letter to SE, PWD Bengaluru Urban", escalation: ["AEE PWD","EE PWD","SE PWD","CE PWD"], sla: "15–30 days" },
    { scenario: "On National Highway (e.g. NH-75, NH-44)", department: "NHAI — Bengaluru PIU", officer: "Project Director, NHAI PIU", documents: ["Photo", "NH no. + km marker", "Concessionaire details if any"], template: "Letter to PD NHAI (cc: RO)", escalation: ["PD NHAI","Regional Officer NHAI","Member NHAI"], sla: "10–20 days (concessionaire)" },
    { scenario: "Inside Gram Panchayat area (peri-urban)", department: "RDPR — Gram Panchayat", officer: "PDO / Panchayat Engineer", documents: ["Photo", "GP name"], template: "Letter to CEO, ZP / EO Taluk Panchayat", escalation: ["PDO","EO Taluk Panchayat","CEO ZP"], sla: "30 days" },
    { scenario: "Inside Smart City project area", department: "Bengaluru Smart City Ltd", officer: "GM (Engineering), BSCL", documents: ["Photo", "BSCL package no."], template: "Letter to MD, BSCL", escalation: ["GM BSCL","CEO BSCL"], sla: "15 days" },
    { scenario: "Dug up by BWSSB/BESCOM/OFC and not restored", department: "Utility that dug it (BWSSB/BESCOM/OFC)", officer: "EE of that utility + JC Roads BBMP (joint)", documents: ["Photo", "Date dug", "Restoration deposit reference"], template: "Joint reminder to utility + BBMP", escalation: ["Utility EE","BBMP JC Roads","Chief Engineer (utility)"], sla: "Within restoration deposit terms" },
  ]},
  { issue: "Water supply (no water / low pressure)", owners: [
    { scenario: "BWSSB-served ward", department: "BWSSB", officer: "AEE Service Station (local)", documents: ["RR no.", "Address", "Days affected"], template: "Letter to EE, BWSSB Division", escalation: ["AEE","EE Division","Chief Engineer","Chairman BWSSB"], sla: "48 hours (acute) / 7 days" },
    { scenario: "Outside BWSSB / borewell-dependent area (110 villages, GP)", department: "Gram Panchayat / Mini Water Supply", officer: "PDO / Asst Engineer GP", documents: ["Habitation name", "Borewell ID"], template: "Letter to EO Taluk Panchayat", escalation: ["PDO","EO TP","CEO ZP"], sla: "7–15 days" },
  ]},
  { issue: "Drainage / SWD overflow", owners: [
    { scenario: "BBMP storm-water drain", department: "BBMP — SWD Division", officer: "EE SWD Zone", documents: ["Photo", "Location"], template: "Letter to Chief Engineer SWD", escalation: ["AEE SWD","EE SWD","CE SWD"], sla: "7 days" },
    { scenario: "Underground sewerage block", department: "BWSSB — Maintenance", officer: "AEE Service Station", documents: ["Manhole no.", "Address"], template: "Standard sewerage reminder", escalation: ["AEE","EE","CE Maint."], sla: "24–48 hours" },
  ]},
  { issue: "Power outage / transformer", owners: [
    { scenario: "Recurring outage / load issue", department: "BESCOM", officer: "AE / AEE Section Office", documents: ["RR no.", "Outage log"], template: "Letter to EE BESCOM O&M Division", escalation: ["AE","AEE","EE","SE","CE BESCOM"], sla: "Acute: 4 hrs · Permanent: 7 days" },
  ]},
  { issue: "Garbage / sanitation", owners: [
    { scenario: "Door-to-door collection missed / black spot", department: "BBMP — SWM", officer: "Health Inspector (Ward) / AEE SWM", documents: ["Photo", "Ward + location"], template: "Letter to JC (SWM), BBMP Zone", escalation: ["HI Ward","AEE SWM","JC SWM"], sla: "48 hours" },
  ]},
  { issue: "Police / law & order", owners: [
    { scenario: "Traffic deployment, chain-snatching, illegal parking", department: "Bengaluru City Police", officer: "Jurisdictional Inspector / DCP", documents: ["FIR no. if any", "Location"], template: "Letter to DCP (Division)", escalation: ["Inspector","ACP","DCP","Joint CP"], sla: "Case-dependent" },
  ]},
  { issue: "Land / khata / revenue", owners: [
    { scenario: "Khata / mutation / RTC", department: "Revenue — Tahsil Office", officer: "Tahsildar / RI / VA", documents: ["Original sale deed", "ID", "EC"], template: "Recommendation letter to Tahsildar", escalation: ["VA","RI","Tahsildar","Asst Commissioner","Deputy Commissioner"], sla: "30 days" },
  ]},
  { issue: "Health — PHC / dengue / fogging", owners: [
    { scenario: "Urban PHC issue / vector control", department: "BBMP Health / DHO", officer: "JC Health (BBMP) / DHO", documents: ["Location", "Cases reported"], template: "Letter to JC Health / DHO", escalation: ["MO PHC","JC Health","DHO","Commissioner H&FW"], sla: "7 days" },
  ]},
  { issue: "Education — school / college", owners: [
    { scenario: "Govt school / PU college", department: "Education Dept", officer: "BEO (school) / DDPI (PU)", documents: ["School DISE code", "Specific request"], template: "Recommendation letter to BEO / DDPI", escalation: ["HM","BEO","DDPI","Commissioner DPI"], sla: "30 days" },
  ]},
];

function AuthorityMappingPage() {
  const [issue, setIssue] = useState(ISSUES[0].issue);
  const [ward, setWard] = useState("KR Puram (Ward 84)");

  const selected = useMemo(() => ISSUES.find(i => i.issue === issue)!, [issue]);

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Authority Mapping</h1>
          <p className="text-sm text-muted-foreground">Who should handle this? Disambiguates jurisdiction the moment a citizen complaint arrives.</p>
        </div>
        <Badge className="bg-[#FF9933]/15 text-[#FF9933] hover:bg-[#FF9933]/15 gap-1"><Sparkles className="h-3 w-3" /> Engine also powers Grievances & Letters</Badge>
      </div>

      <Card className="border-l-4 border-l-[#FF9933]">
        <CardContent className="p-5 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[260px]">
            <div className="text-xs font-semibold text-slate-700 mb-1">Issue type</div>
            <Select value={issue} onValueChange={setIssue}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ISSUES.map(i => <SelectItem key={i.issue} value={i.issue}>{i.issue}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[220px]">
            <div className="text-xs font-semibold text-slate-700 mb-1">Location / Ward</div>
            <Select value={ward} onValueChange={setWard}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["KR Puram (Ward 84)","Mahadevapura (Ward 150)","Whitefield (Ward 149)","Hoodi (Ward 85)","Varthur (Ward 150)","Bellandur (Ward 150)","Marathahalli (Ward 84)"].map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Badge variant="outline" className="h-9 px-3">{selected.owners.length} possible owners</Badge>
        </CardContent>
      </Card>

      {selected.issue === "Road broken / pothole" && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 text-sm text-amber-900">
            <span className="font-semibold">Why so many owners?</span> "Road broken near my house" is the single most-confused complaint in Bengaluru — the road could be BBMP, PWD, NHAI, GP, Smart City, or simply dug up by BWSSB/BESCOM and not restored. Pick the scenario that matches the location to route correctly.
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {selected.owners.map((o, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-start gap-2 text-[#0A1F44]"><GitBranch className="h-4 w-4 text-[#FF9933] mt-0.5" /> {o.scenario}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2"><Building2 className="h-4 w-4 text-slate-400 mt-0.5" /><div><div className="text-[10px] uppercase text-slate-500">Responsible department</div><div className="font-medium">{o.department}</div></div></div>
              <div className="flex items-start gap-2"><User className="h-4 w-4 text-slate-400 mt-0.5" /><div><div className="text-[10px] uppercase text-slate-500">Officer to write to</div><div className="font-medium">{o.officer}</div></div></div>
              <div className="flex items-start gap-2"><Camera className="h-4 w-4 text-slate-400 mt-0.5" /><div><div className="text-[10px] uppercase text-slate-500">Documents / photos required</div><div className="text-slate-700">{o.documents.join(" · ")}</div></div></div>
              <div className="flex items-start gap-2"><FileText className="h-4 w-4 text-slate-400 mt-0.5" /><div><div className="text-[10px] uppercase text-slate-500">Suggested template</div><div className="font-medium">{o.template}</div></div></div>

              <div>
                <div className="text-[10px] uppercase text-slate-500 mb-1">Escalation path</div>
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  {o.escalation.map((s, idx) => (
                    <span key={idx} className="flex items-center gap-1">
                      <Badge variant="outline" className="font-normal">{s}</Badge>
                      {idx < o.escalation.length - 1 && <ArrowRight className="h-3 w-3 text-slate-400" />}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t">
                <Clock className="h-4 w-4 text-slate-400" /><span className="text-xs text-slate-600">Expected resolution:</span>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{o.sla}</Badge>
              </div>

              <div className="flex gap-2 pt-2">
                <Link to="/recommendation-letters" className="flex-1"><Button size="sm" className="w-full bg-[#FF9933] text-white"><FileSignature className="h-3 w-3" /> Draft Letter</Button></Link>
                <Link to="/officer-directory" className="flex-1"><Button size="sm" variant="outline" className="w-full"><User className="h-3 w-3" /> Find Officer</Button></Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-[#0A1F44] text-white">
        <CardContent className="p-4 text-sm flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-[#FF9933]" /> This engine auto-suggests the right owner on every new grievance and inside the Letters composer.</div>
          <div className="flex gap-2"><Link to="/grievances"><Button size="sm" variant="outline" className="bg-transparent text-white border-white/30">Open Grievances</Button></Link><Link to="/recommendation-letters"><Button size="sm" className="bg-[#FF9933] text-white">Open Letters</Button></Link></div>
        </CardContent>
      </Card>
    </div>
  );
}
