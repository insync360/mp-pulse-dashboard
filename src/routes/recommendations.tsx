import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Megaphone,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  Clock,
  Copy,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/recommendations")({
  head: () => ({
    meta: [
      { title: "Recommendations — MP Pulse" },
      {
        name: "description",
        content:
          "AI-driven action recommendations: which issues to engage, amplify or avoid, with ready-to-post drafts.",
      },
    ],
  }),
  component: RecommendationsPage,
});

type Action = "ENGAGE" | "AMPLIFY" | "AVOID";

type Rec = {
  issue: string;
  sentiment: string;
  sentimentTone: "pos" | "neu" | "neg";
  action: Action;
  rationale: string;
  bestTime: string;
  drafts: { en: string; hi: string; kn: string };
};

const RECS: Rec[] = [
  {
    issue: "Mahadevapura Stormwater Drains",
    sentiment: "Negative · 64%",
    sentimentTone: "neg",
    action: "ENGAGE",
    rationale:
      "BBMP tender announcement is fresh — a personal site visit + statement converts anger into credit.",
    bestTime: "Tomorrow, 8:30 AM IST (Tue)",
    drafts: {
      en: "Visited Mahadevapura today with BBMP engineers to review the ₹240 cr stormwater drain plan. Work begins February. Residents of Whitefield & KR Puram — your years of patience will not go unanswered. #FixOurDrains #Mahadevapura",
      hi: "आज BBMP इंजीनियरों के साथ महादेवपुरा का दौरा किया। ₹240 करोड़ की स्टॉर्मवाटर ड्रेन योजना फरवरी से शुरू होगी। व्हाइटफील्ड और KR पुरम के निवासियों का धैर्य व्यर्थ नहीं जाएगा। #FixOurDrains",
      kn: "ಇಂದು BBMP ಎಂಜಿನಿಯರ್‌ಗಳೊಂದಿಗೆ ಮಹದೇವಪುರ ಭೇಟಿ ನೀಡಿದೆ. ₹240 ಕೋಟಿ ಮಳೆನೀರು ಚರಂಡಿ ಯೋಜನೆ ಫೆಬ್ರವರಿಯಿಂದ ಆರಂಭ. ವೈಟ್‌ಫೀಲ್ಡ್ ಮತ್ತು KR ಪುರಂ ನಿವಾಸಿಗಳೇ, ನಿಮ್ಮ ತಾಳ್ಮೆ ವ್ಯರ್ಥವಾಗದು. #ನಮ್ಮಬೆಂಗಳೂರು",
    },
  },
  {
    issue: "Namma Metro Phase 3 Approval",
    sentiment: "Positive · 72%",
    sentimentTone: "pos",
    action: "AMPLIFY",
    rationale:
      "Strong organic sentiment + party-priority alignment. Amplify with constituency-specific framing.",
    bestTime: "Today, 6:45 PM IST",
    drafts: {
      en: "A historic day for Bengaluru. Phase 3 of Namma Metro — 44 km of new lines including ORR-Hebbal-Sarjapur — will be a lifeline for our tech corridor. Grateful to the Centre & state cabinet. Bengaluru moves forward. 🚇 #NammaMetro",
      hi: "बेंगलुरु के लिए ऐतिहासिक दिन। नम्म मेट्रो फेज 3 — ORR-हेब्बल-सरजापुर सहित 44 किमी की नई लाइनें — हमारे टेक कॉरिडोर के लिए जीवनरेखा होंगी। केंद्र और राज्य कैबिनेट का आभार। #NammaMetro",
      kn: "ಬೆಂಗಳೂರಿಗೆ ಐತಿಹಾಸಿಕ ದಿನ. ನಮ್ಮ ಮೆಟ್ರೋ ಫೇಸ್ 3 — ORR-ಹೆಬ್ಬಾಳ-ಸರ್ಜಾಪುರ ಸೇರಿ 44 ಕಿಮೀ ಹೊಸ ಮಾರ್ಗಗಳು — ನಮ್ಮ ಟೆಕ್ ಕಾರಿಡಾರ್‌ಗೆ ಜೀವನಾಡಿ. ಕೇಂದ್ರ ಮತ್ತು ರಾಜ್ಯ ಸಂಪುಟಕ್ಕೆ ಧನ್ಯವಾದಗಳು. #ನಮ್ಮಮೆಟ್ರೋ",
    },
  },
  {
    issue: "Lake Rejuvenation (Whitespace)",
    sentiment: "Positive · 58%",
    sentimentTone: "pos",
    action: "ENGAGE",
    rationale:
      "High citizen interest, no MP has anchored this. First-mover advantage on a feel-good civic agenda.",
    bestTime: "Saturday, 9:00 AM IST",
    drafts: {
      en: "Bellandur and Varthur lakes deserve more than tweets. Convening a citizens' roundtable next Saturday with lake activists, IISc researchers, and BBMP to publish a 12-month revival roadmap. Join us. #SaveOurLakes",
      hi: "बेल्लंदुर और वर्थुर झीलें केवल ट्वीट्स की हकदार नहीं हैं। अगले शनिवार IISc, झील कार्यकर्ताओं और BBMP के साथ नागरिक गोलमेज सम्मेलन — 12 महीने का पुनरुद्धार रोडमैप जारी होगा। #SaveOurLakes",
      kn: "ಬೆಲ್ಲಂದೂರು ಮತ್ತು ವರ್ತೂರು ಕೆರೆಗಳಿಗೆ ಕೇವಲ ಟ್ವೀಟ್‌ಗಳಲ್ಲ. ಮುಂದಿನ ಶನಿವಾರ IISc, ಕೆರೆ ಕಾರ್ಯಕರ್ತರು ಮತ್ತು BBMP ಜೊತೆ ನಾಗರಿಕ ಸಭೆ — 12 ತಿಂಗಳ ಪುನರುಜ್ಜೀವನ ರೋಡ್‌ಮ್ಯಾಪ್. #ನಮ್ಮಕೆರೆ",
    },
  },
  {
    issue: "Power Tariff Hike Proposal",
    sentiment: "Negative · 58%",
    sentimentTone: "neg",
    action: "ENGAGE",
    rationale:
      "Cross-cutting middle-class anger. Speak before KERC hearing Friday to lead the opposition narrative.",
    bestTime: "Thursday, 7:30 PM IST",
    drafts: {
      en: "BESCOM's proposed 35 paise/unit hike will hit Bengaluru's middle-class hardest at a time of rising costs. I will formally object at Friday's KERC hearing on behalf of our constituents. Your voice matters — share your concerns below.",
      hi: "BESCOM का प्रस्तावित 35 पैसे/यूनिट बढ़ोतरी बढ़ती लागत के समय बेंगलुरु के मध्यम वर्ग पर सबसे ज़्यादा बोझ डालेगा। शुक्रवार की KERC सुनवाई में अपने मतदाताओं की ओर से औपचारिक आपत्ति दर्ज करूंगा।",
      kn: "BESCOM ಪ್ರಸ್ತಾವಿತ 35 ಪೈಸೆ/ಯೂನಿಟ್ ಏರಿಕೆ ಬೆಂಗಳೂರಿನ ಮಧ್ಯಮ ವರ್ಗಕ್ಕೆ ತೀವ್ರ ಹೊಡೆತ. ಶುಕ್ರವಾರದ KERC ವಿಚಾರಣೆಯಲ್ಲಿ ನಮ್ಮ ಮತದಾರರ ಪರವಾಗಿ ಔಪಚಾರಿಕ ಆಕ್ಷೇಪ ದಾಖಲಿಸುತ್ತೇನೆ.",
    },
  },
  {
    issue: "Local Hiring Bill Controversy",
    sentiment: "Polarised · 46/30",
    sentimentTone: "neu",
    action: "AVOID",
    rationale:
      "Nasscom and IT industry pushback. High risk of alienating Bengaluru's tech employer base. Stay measured.",
    bestTime: "Hold position for 48-72h",
    drafts: {
      en: "(No public post recommended. Suggested internal stance: support local opportunity, request industry consultation before implementation, avoid hashtag participation.)",
      hi: "(कोई सार्वजनिक पोस्ट अनुशंसित नहीं। सुझाई गई स्थिति: स्थानीय अवसर का समर्थन, कार्यान्वयन से पहले उद्योग परामर्श का अनुरोध।)",
      kn: "(ಯಾವುದೇ ಸಾರ್ವಜನಿಕ ಪೋಸ್ಟ್ ಶಿಫಾರಸು ಇಲ್ಲ. ಸೂಚಿತ ನಿಲುವು: ಸ್ಥಳೀಯ ಅವಕಾಶ ಬೆಂಬಲ, ಅನುಷ್ಠಾನ ಮೊದಲು ಉದ್ಯಮ ಸಮಾಲೋಚನೆ.)",
    },
  },
  {
    issue: "Gig Worker Welfare Rules",
    sentiment: "Positive · 64%",
    sentimentTone: "pos",
    action: "AMPLIFY",
    rationale:
      "Centre-led policy with Karnataka first-mover status. High alignment with both national narrative and constituency.",
    bestTime: "Wednesday, 12:30 PM IST",
    drafts: {
      en: "Every Bengaluru rider and delivery partner powers our city. The new Gig Workers Social Security Rules — and Karnataka being first to implement — is a long-overdue recognition. Proud to have advocated for this. #GigWorkers",
      hi: "बेंगलुरु का हर राइडर और डिलीवरी पार्टनर हमारे शहर को चलाता है। नए गिग वर्कर्स सोशल सिक्योरिटी नियम — और कर्नाटक का पहला लागू करने वाला राज्य होना — एक लंबे समय से ज़रूरी मान्यता है। #GigWorkers",
      kn: "ಬೆಂಗಳೂರಿನ ಪ್ರತಿ ರೈಡರ್ ಮತ್ತು ಡೆಲಿವರಿ ಪಾರ್ಟ್ನರ್ ನಮ್ಮ ನಗರವನ್ನು ಮುನ್ನಡೆಸುತ್ತಾರೆ. ಹೊಸ ಗಿಗ್ ವರ್ಕರ್ಸ್ ಸಾಮಾಜಿಕ ಸುರಕ್ಷತಾ ನಿಯಮಗಳು — ಮತ್ತು ಕರ್ನಾಟಕ ಮೊದಲು ಜಾರಿಗೊಳಿಸುವುದು — ಮಹತ್ವದ ಮನ್ನಣೆ. #GigWorkers",
    },
  },
];

const ACTION_STYLES: Record<Action, { bg: string; text: string; ring: string; icon: typeof Megaphone }> = {
  ENGAGE: {
    bg: "bg-saffron text-saffron-foreground",
    text: "text-saffron",
    ring: "ring-saffron/30",
    icon: Megaphone,
  },
  AMPLIFY: {
    bg: "bg-emerald-600 text-white",
    text: "text-emerald-700",
    ring: "ring-emerald-300",
    icon: TrendingUp,
  },
  AVOID: {
    bg: "bg-rose-600 text-white",
    text: "text-rose-700",
    ring: "ring-rose-300",
    icon: AlertTriangle,
  },
};

const TONE: Record<Rec["sentimentTone"], string> = {
  pos: "bg-emerald-50 text-emerald-700",
  neu: "bg-slate-100 text-slate-700",
  neg: "bg-rose-50 text-rose-700",
};

function RecCard({ rec }: { rec: Rec }) {
  const [open, setOpen] = useState(false);
  const s = ACTION_STYLES[rec.action];
  const Icon = s.icon;
  return (
    <Card className={`overflow-hidden ring-1 ${s.ring}`}>
      <div className="flex flex-col gap-3 p-5 lg:flex-row lg:items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${TONE[rec.sentimentTone]}`}>
              {rec.sentiment}
            </span>
            <span className="text-[11px] text-muted-foreground">
              <Clock className="mr-1 inline h-3 w-3" />
              Best: {rec.bestTime}
            </span>
          </div>
          <h3 className="mt-1.5 text-base font-semibold text-foreground">{rec.issue}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{rec.rationale}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${s.bg}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {rec.action}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpen((o) => !o)}
            className="gap-1"
          >
            <Sparkles className="h-3.5 w-3.5 text-saffron" />
            Generate Post
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </Button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-muted/30 p-5">
          <Tabs defaultValue="en">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="hi">हिंदी</TabsTrigger>
                <TabsTrigger value="kn">ಕನ್ನಡ</TabsTrigger>
              </TabsList>
              <Button size="sm" variant="ghost" className="gap-1 text-xs text-muted-foreground">
                <Copy className="h-3.5 w-3.5" /> Copy
              </Button>
            </div>
            {(["en", "hi", "kn"] as const).map((lang) => (
              <TabsContent key={lang} value={lang} className="mt-3">
                <div className="rounded-lg border border-border bg-background p-4 text-sm leading-relaxed text-foreground">
                  {rec.drafts[lang]}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </Card>
  );
}

function RecommendationsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Recommendations</h1>
          <p className="text-sm text-muted-foreground">
            Prioritised actions across this week's surfacing issues — engage, amplify, or hold.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Badge variant="outline" className="border-saffron/30 text-saffron">
            6 active recommendations
          </Badge>
          <span>Updated 4 min ago</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-saffron/30 bg-saffron/5 p-3 text-xs">
          <div className="font-semibold text-saffron">3 · ENGAGE</div>
          <div className="text-muted-foreground">Active citizen attention windows</div>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs">
          <div className="font-semibold text-emerald-700">2 · AMPLIFY</div>
          <div className="text-muted-foreground">Tailwind moments to ride</div>
        </div>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs">
          <div className="font-semibold text-rose-700">1 · AVOID</div>
          <div className="text-muted-foreground">Polarised topics — stay measured</div>
        </div>
      </div>

      <div className="space-y-3">
        {RECS.map((r) => (
          <RecCard key={r.issue} rec={r} />
        ))}
      </div>
    </div>
  );
}
