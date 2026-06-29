import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Inbox as InboxIcon, MessageCircle, Phone, Mail, Users, Globe, Sparkles,
  ClipboardList, HandHelping, Siren, FileSignature, ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/data/store";
import type { Case, Channel } from "@/data/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inbox")({
  head: () => ({
    meta: [
      { title: "Inbox — Citizen Pulse" },
      { name: "description", content: "Incoming items by channel — AI-classified, one click to route into a Case." },
    ],
  }),
  component: InboxPage,
});

const CHANNELS: { key: Channel; icon: typeof MessageCircle; tone: string }[] = [
  { key: "Walk-in",  icon: Users,         tone: "bg-amber-50 text-amber-700 border-amber-200" },
  { key: "WhatsApp", icon: MessageCircle, tone: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { key: "Call",     icon: Phone,         tone: "bg-blue-50 text-blue-700 border-blue-200" },
  { key: "Email",    icon: Mail,          tone: "bg-violet-50 text-violet-700 border-violet-200" },
  { key: "Social",   icon: Globe,         tone: "bg-rose-50 text-rose-700 border-rose-200" },
];

const suggestedAction = (c: Case) => {
  switch (c.recordType) {
    case "Grievance": return { label: "Create Grievance Case", icon: ClipboardList, to: "/grievances" };
    case "SchemeRequest": return { label: "Open Scheme Request", icon: HandHelping, to: "/scheme-assistance" };
    case "RecommendationRequest": return { label: "Draft Recommendation", icon: FileSignature, to: "/recommendation-letters" };
    case "Emergency": return { label: "Escalate as Emergency", icon: Siren, to: "/emergency-desk" };
    default: return { label: "Open Case", icon: ArrowRight, to: "/cases" };
  }
};

function InboxPage() {
  const { cases, getCitizen, updateCase } = useData();
  const inbox = useMemo(() => cases.filter((c) => c.status === "New"), [cases]);
  const [filter, setFilter] = useState<Channel | "all">("all");

  const byChannel = useMemo(() => {
    const map = new Map<Channel, Case[]>();
    CHANNELS.forEach(({ key }) => map.set(key, []));
    inbox.forEach((c) => map.get(c.channel)?.push(c));
    return map;
  }, [inbox]);

  const channelsToShow = filter === "all" ? CHANNELS : CHANNELS.filter((c) => c.key === filter);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1300px] mx-auto">
      <div className="rounded-xl bg-navy text-white p-5 mb-6 shadow-md">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-lg bg-saffron/20 flex items-center justify-center">
              <InboxIcon className="h-5 w-5 text-saffron" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
              <p className="text-sm text-white/75 mt-0.5">
                {inbox.length} new items waiting to be routed · AI-classified by channel.
              </p>
            </div>
          </div>
          <Link to="/cases">
            <Button variant="secondary" size="sm">Go to Cases</Button>
          </Link>
        </div>
      </div>

      {/* Channel filter pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setFilter("all")}
          className={cn("px-3 py-1.5 rounded-full border text-xs font-medium",
            filter === "all" ? "bg-navy text-white border-navy" : "bg-card text-muted-foreground hover:bg-muted")}
        >
          All channels · {inbox.length}
        </button>
        {CHANNELS.map(({ key, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn("px-3 py-1.5 rounded-full border text-xs font-medium inline-flex items-center gap-1.5",
              filter === key ? "bg-navy text-white border-navy" : "bg-card text-muted-foreground hover:bg-muted")}
          >
            <Icon className="h-3 w-3" /> {key} · {byChannel.get(key)?.length ?? 0}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {channelsToShow.map(({ key, icon: Icon, tone }) => {
          const items = byChannel.get(key) ?? [];
          return (
            <div key={key}>
              <div className="flex items-center gap-2 mb-3">
                <div className={cn("h-7 w-7 rounded-md flex items-center justify-center border", tone)}>
                  <Icon className="h-4 w-4" />
                </div>
                <h2 className="font-semibold text-navy">{key}</h2>
                <Badge variant="outline" className="text-xs">{items.length}</Badge>
              </div>
              <div className="space-y-2">
                {items.length === 0 && (
                  <Card className="p-4 text-xs text-muted-foreground text-center border-dashed">
                    No new items in this channel.
                  </Card>
                )}
                {items.map((c) => {
                  const citizen = getCitizen(c.citizenId);
                  const action = suggestedAction(c);
                  const ActionIcon = action.icon;
                  return (
                    <Card key={c.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-navy">{citizen?.name ?? "Unknown"}</span>
                            <span className="text-[11px] text-muted-foreground">· {c.wardId}</span>
                            <Badge variant="outline" className="text-[10px] capitalize">{c.recordType}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                          {c.classification && (
                            <div className="mt-2 flex items-center gap-1 flex-wrap">
                              <Sparkles className="h-3 w-3 text-saffron" />
                              {c.classification.map((t) => (
                                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-saffron/10 text-saffron">{t}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                        <Link to={action.to} className="flex-1">
                          <Button size="sm" className="w-full bg-navy hover:bg-navy/90">
                            <ActionIcon className="h-3.5 w-3.5" /> {action.label}
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            updateCase(c.id, { status: "Assigned" });
                            toast.success(`${c.id} accepted into queue`);
                          }}
                        >
                          Accept
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
