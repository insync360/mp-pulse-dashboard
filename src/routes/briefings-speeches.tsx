import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Mic, Edit, RefreshCw, Save, Download, BookOpen, Users, MapPin, AlertTriangle, Newspaper, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/briefings-speeches")({
  head: () => ({ meta: [{ title: "Briefings & Speeches — MP Pulse" }] }),
  component: BriefingsPage,
});

type EventRow = {
  id: string; title: string; audience: string; date: string;
  brief: {
    overview: string;
    issues: { name: string; sentiment: "pos" | "neu" | "neg" }[];
    commitments: string[];
    sensitive: string[];
    news: string[];
  };
};

const EVENTS: EventRow[] = [
  {
    id: "e1", title: "RWA Federation Meeting", audience: "Whitefield RWA Federation (280 associations)", date: "Thu 26 Jun · 09:00",
    brief: {
      overview: "Whitefield RWA Federation — 280 member associations, affluent IT corridor, key issues: water, lake encroachment, traffic.",
      issues: [{ name: "Water supply (Cauvery V)", sentiment: "neg" }, { name: "Lake encroachment", sentiment: "neg" }, { name: "ITPL junction traffic", sentiment: "neu" }],
      commitments: ["Promised lake rejuvenation funds — March 2026", "Ward 84 road resurfacing — May 2026 (delivered)", "Pedestrian skywalk feasibility study — Feb 2026"],
      sensitive: ["Ongoing court case on Varthur lake — avoid specifics", "Borewell drilling depth dispute — neighbouring ward"],
      news: ["Deccan Herald: 'Whitefield flooding — civic apathy' (High traction)", "TOI: 'IT corridor demands metro Phase-3 update'"],
    },
  },
  {
    id: "e2", title: "Borewell Inauguration", audience: "KR Puram Ward 84 residents + media", date: "Thu 26 Jun · 11:30",
    brief: {
      overview: "Inauguration of a community borewell in KR Puram Ward 84 — context: Cauvery Stage-V tap connections delayed, summer scarcity.",
      issues: [{ name: "Water tanker dependency", sentiment: "neg" }, { name: "BWSSB billing complaints", sentiment: "neu" }, { name: "Local employment", sentiment: "pos" }],
      commitments: ["3 borewells sanctioned — 2 delivered", "Tanker subsidy scheme extended through Sep 2026"],
      sensitive: ["Groundwater table concerns — environmentalist pushback", "Contractor selection RTI pending"],
      news: ["Prajavani: 'KR Puram welcomes new borewell'", "Vijaya Karnataka: 'Summer water crisis eases in pockets'"],
    },
  },
  {
    id: "e3", title: "Industry Lunch", audience: "IT industry delegation (12 firms)", date: "Thu 26 Jun · 13:30",
    brief: {
      overview: "Closed lunch with VP-level reps from Wipro, Infosys, TCS, Mphasis, Mindtree, others — agenda: last-mile connectivity, security, CSR alignment.",
      issues: [{ name: "Last-mile connectivity", sentiment: "neg" }, { name: "Women safety in transit", sentiment: "neg" }, { name: "Skill development partnerships", sentiment: "pos" }],
      commitments: ["BMTC feeder bus route proposal — under MoUD review", "CSR-funded skill centres in Hoodi"],
      sensitive: ["Avoid commitments on land conversion near Outer Ring Road"],
      news: ["ET: 'Bengaluru IT corridor losing talent to Hyderabad'", "Mint: 'Karnataka FDI inflows up 14%'"],
    },
  },
  {
    id: "e4", title: "Condolence Visit", audience: "Bereaved family — Mahadevapura", date: "Thu 26 Jun · 16:00",
    brief: { overview: "Personal condolence — no public briefing required.", issues: [], commitments: [], sensitive: ["Strictly personal — no media, no photos"], news: [] },
  },
  {
    id: "e5", title: "Party Cadre Review", audience: "Mandal presidents (8) + booth in-charges", date: "Thu 26 Jun · 18:30",
    brief: {
      overview: "Quarterly review with mandal/booth leadership across Whitefield, KR Puram, Mahadevapura, Marathahalli.",
      issues: [{ name: "Booth committee restructuring", sentiment: "neu" }, { name: "Youth wing engagement", sentiment: "pos" }, { name: "OBC vote consolidation", sentiment: "neu" }],
      commitments: ["100 new booth committees by Aug 2026", "Cadre training camp — Hoodi"],
      sensitive: ["Internal: avoid factional names in open forum"],
      news: ["The Hindu: 'Karnataka party preps for 2026 local body polls'"],
    },
  },
];

const LIBRARY = [
  { date: "12 Jun 2026", event: "Whitefield Lake Cleanup Drive", language: "Kannada" },
  { date: "05 Jun 2026", event: "Environment Day Address", language: "English" },
  { date: "28 May 2026", event: "Bharat Mata Vandana — Cadre Meet", language: "Hindi" },
  { date: "14 May 2026", event: "Mahadevapura Industrial Estate Visit", language: "English" },
  { date: "02 May 2026", event: "Labour Day Address", language: "Kannada" },
];

const SENTIMENT_CHIP = {
  pos: "bg-green-100 text-green-700 border-green-200",
  neu: "bg-slate-100 text-slate-600 border-slate-200",
  neg: "bg-red-100 text-red-700 border-red-200",
};

const SPEECH_TEMPLATES: Record<string, string> = {
  Kannada: `ನಮಸ್ಕಾರ! ವೈಟ್‌ಫೀಲ್ಡ್‌ನ ನನ್ನ ಪ್ರೀತಿಯ ಸಹೋದರ-ಸಹೋದರಿಯರೇ, ಇಂದು ನಿಮ್ಮ ನಡುವೆ ನಿಲ್ಲಲು ನನಗೆ ಬಹಳ ಸಂತೋಷವಾಗಿದೆ.\n\nಕಳೆದ ವರ್ಷ ನಾವು ಜೊತೆಗೂಡಿ ಸಾಧಿಸಿದ ಕಾರ್ಯಗಳು — ರಸ್ತೆ ದುರಸ್ತಿ, ಬೋರ್‌ವೆಲ್ ಸೌಲಭ್ಯ, ಮತ್ತು ಶಾಲಾ ಸುಧಾರಣೆಗಳು — ನಮ್ಮ ಸಾಮೂಹಿಕ ಶಕ್ತಿಯ ಸಾಕ್ಷಿಯಾಗಿವೆ. ಆದರೆ ಇನ್ನೂ ಮಾಡಬೇಕಾದ ಕೆಲಸ ಸಾಕಷ್ಟು ಇದೆ.\n\nಕೆರೆಗಳ ಪುನರುಜ್ಜೀವನ, ಸಂಚಾರ ದಟ್ಟಣೆ ಕಡಿಮೆ ಮಾಡುವುದು, ಮತ್ತು ಕಾವೇರಿ ಐದನೇ ಹಂತದ ನೀರಿನ ಸಂಪರ್ಕ — ಇವು ನಮ್ಮ ಮುಂದಿನ ಆದ್ಯತೆಗಳು.\n\nನಿಮ್ಮ ನಂಬಿಕೆಯೇ ನನ್ನ ಶಕ್ತಿ. ಧನ್ಯವಾದಗಳು, ಜೈ ಕರ್ನಾಟಕ, ಜೈ ಹಿಂದ್!`,
  English: `Friends, residents of Whitefield, esteemed RWA leaders — namaskara.\n\nIt is a privilege to stand before the federation that represents 280 associations and the daily aspirations of lakhs of families in this constituency. The work we have done together over the last year — road resurfacing in Ward 84, the new community borewell, the school infrastructure upgrades — belongs to all of us.\n\nBut I am not here today to celebrate. I am here to acknowledge that water security, lake rejuvenation, and last-mile traffic remain unfinished business. I have personally taken up Cauvery Stage-V coordination with BWSSB, and we expect the first tranche of tap connections to be operational by September.\n\nOn the lakes — Whitefield's identity is its water bodies. I commit to a transparent, time-bound rejuvenation programme, with quarterly public reviews open to this federation.\n\nYour trust is my mandate. Thank you. Jai Karnataka, Jai Hind.`,
  Hindi: `मेरे प्यारे व्हाइटफील्ड के निवासियों, आरडब्ल्यूए परिसंघ के सम्मानित प्रतिनिधियों — नमस्कार।\n\nपिछले एक वर्ष में हमने मिलकर जो काम किया है — सड़कों की मरम्मत, बोरवेल की सुविधा, स्कूलों का नवीनीकरण — वह आप सब के सहयोग का परिणाम है।\n\nलेकिन मैं जानता हूँ कि अभी भी पानी की समस्या, झीलों का संरक्षण, और यातायात की चुनौतियाँ हमारे सामने हैं। मैं आपको विश्वास दिलाता हूँ कि कावेरी पाँचवें चरण का पानी सितंबर तक आपके घरों तक पहुँचेगा।\n\nआपका विश्वास ही मेरी ताकत है। धन्यवाद, जय कर्नाटक, जय हिंद!`,
};

function BriefingsPage() {
  const [briefEvent, setBriefEvent] = useState<EventRow | null>(null);
  const [speechEvent, setSpeechEvent] = useState<EventRow | null>(null);
  const [lang, setLang] = useState<"Kannada" | "English" | "Hindi">("English");
  const [length, setLength] = useState<"Short" | "Medium" | "Long">("Medium");
  const [tone, setTone] = useState<"Formal" | "Warm" | "Rousing">("Warm");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0A1F44]">Briefings & Speeches</h1>
        <p className="text-slate-500 mt-1">Pre-event intelligence and AI-drafted addresses</p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="library">Speech Library</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          <Card className="border-slate-200">
            <CardContent className="p-0 divide-y divide-slate-100">
              {EVENTS.map(ev => (
                <div key={ev.id} className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#0A1F44]">{ev.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5"><Users className="w-3 h-3" /> {ev.audience}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{ev.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setBriefEvent(ev)}><FileText className="w-3.5 h-3.5 mr-1.5" /> Generate Brief</Button>
                    <Button size="sm" className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white" onClick={() => setSpeechEvent(ev)}><Mic className="w-3.5 h-3.5 mr-1.5" /> Generate Speech</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="mt-4">
          <Card className="border-slate-200">
            <CardHeader><CardTitle className="text-[#0A1F44] text-base flex items-center gap-2"><BookOpen className="w-4 h-4" /> Past Speeches</CardTitle></CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {LIBRARY.map((s, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <p className="font-medium text-[#0A1F44]">{s.event}</p>
                    <p className="text-xs text-slate-500">{s.date} · {s.language}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm"><FileText className="w-3.5 h-3.5 mr-1.5" /> View</Button>
                    <Button variant="ghost" size="sm"><Download className="w-3.5 h-3.5 mr-1.5" /> Export</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Brief Panel */}
      <Sheet open={!!briefEvent} onOpenChange={(o) => !o && setBriefEvent(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {briefEvent && (
            <>
              <SheetHeader><SheetTitle className="text-[#0A1F44]">{briefEvent.title} — Brief</SheetTitle></SheetHeader>
              <p className="text-xs text-slate-500 mt-1">{briefEvent.date}</p>

              <div className="mt-5 space-y-5">
                <section>
                  <h4 className="text-xs uppercase tracking-wide text-[#FF9933] font-semibold mb-2 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Audience & Locality</h4>
                  <p className="text-sm text-slate-700">{briefEvent.brief.overview}</p>
                </section>

                {briefEvent.brief.issues.length > 0 && (
                  <section>
                    <h4 className="text-xs uppercase tracking-wide text-[#FF9933] font-semibold mb-2">Top 3 Local Issues</h4>
                    <div className="space-y-2">
                      {briefEvent.brief.issues.map((it, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 text-sm">
                          <span className="text-slate-700">{it.name}</span>
                          <Badge variant="outline" className={`text-[10px] ${SENTIMENT_CHIP[it.sentiment]}`}>{it.sentiment === "pos" ? "Positive" : it.sentiment === "neu" ? "Neutral" : "Negative"}</Badge>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {briefEvent.brief.commitments.length > 0 && (
                  <section>
                    <h4 className="text-xs uppercase tracking-wide text-[#FF9933] font-semibold mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Your Past Commitments Here</h4>
                    <ul className="space-y-1.5 text-sm text-slate-700">
                      {briefEvent.brief.commitments.map((c, i) => <li key={i} className="flex gap-2"><span className="text-[#0A1F44]">•</span>{c}</li>)}
                    </ul>
                  </section>
                )}

                {briefEvent.brief.sensitive.length > 0 && (
                  <section className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <h4 className="text-xs uppercase tracking-wide text-red-700 font-semibold mb-2 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Sensitive Points to Avoid</h4>
                    <ul className="space-y-1 text-sm text-red-900">
                      {briefEvent.brief.sensitive.map((s, i) => <li key={i} className="flex gap-2"><span>•</span>{s}</li>)}
                    </ul>
                  </section>
                )}

                {briefEvent.brief.news.length > 0 && (
                  <section>
                    <h4 className="text-xs uppercase tracking-wide text-[#FF9933] font-semibold mb-2 flex items-center gap-1.5"><Newspaper className="w-3.5 h-3.5" /> Recent Local News</h4>
                    <ul className="space-y-1.5 text-sm text-slate-700">
                      {briefEvent.brief.news.map((n, i) => <li key={i} className="flex gap-2"><span className="text-[#0A1F44]">•</span>{n}</li>)}
                    </ul>
                  </section>
                )}

                <Button className="w-full bg-[#0A1F44] hover:bg-[#0A1F44]/90" onClick={() => { toast.success("Brief exported as PDF"); }}>
                  <Download className="w-4 h-4 mr-1.5" /> Export Brief
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Speech Panel */}
      <Sheet open={!!speechEvent} onOpenChange={(o) => !o && setSpeechEvent(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {speechEvent && (
            <>
              <SheetHeader><SheetTitle className="text-[#0A1F44]">{speechEvent.title} — Speech Draft</SheetTitle></SheetHeader>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1.5">Language</p>
                  <div className="flex flex-col gap-1">
                    {(["Kannada", "English", "Hindi"] as const).map(l => (
                      <button key={l} onClick={() => setLang(l)} className={`px-2 py-1.5 rounded text-xs border ${lang === l ? "bg-[#0A1F44] text-white border-[#0A1F44]" : "bg-white text-slate-600 border-slate-200"}`}>{l}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1.5">Length</p>
                  <div className="flex flex-col gap-1">
                    {(["Short", "Medium", "Long"] as const).map(l => (
                      <button key={l} onClick={() => setLength(l)} className={`px-2 py-1.5 rounded text-xs border ${length === l ? "bg-[#0A1F44] text-white border-[#0A1F44]" : "bg-white text-slate-600 border-slate-200"}`}>{l} {l === "Short" ? "(2 min)" : l === "Medium" ? "(5 min)" : "(10 min)"}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1.5">Tone</p>
                  <div className="flex flex-col gap-1">
                    {(["Formal", "Warm", "Rousing"] as const).map(l => (
                      <button key={l} onClick={() => setTone(l)} className={`px-2 py-1.5 rounded text-xs border ${tone === l ? "bg-[#FF9933] text-white border-[#FF9933]" : "bg-white text-slate-600 border-slate-200"}`}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-lg border border-slate-200 bg-slate-50">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-2">Generated draft · {lang} · {length} · {tone}</p>
                <Textarea value={SPEECH_TEMPLATES[lang]} readOnly rows={14} className="bg-white text-sm font-serif leading-relaxed" />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm"><Edit className="w-3.5 h-3.5 mr-1.5" /> Edit</Button>
                <Button variant="outline" size="sm" onClick={() => toast("Regenerating draft…")}><RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Regenerate</Button>
                <Button size="sm" className="bg-[#0A1F44] hover:bg-[#0A1F44]/90" onClick={() => toast.success("Saved to Speech Library")}><Save className="w-3.5 h-3.5 mr-1.5" /> Save to Library</Button>
                <Button size="sm" className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white" onClick={() => toast.success("Exported")}><Download className="w-3.5 h-3.5 mr-1.5" /> Export</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
