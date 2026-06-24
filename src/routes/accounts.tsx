import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  CheckCircle2,
  Plus,
  Users,
  FileText,
  Clock,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { title: "Connected Accounts — MP Pulse" },
      {
        name: "description",
        content:
          "Manage connected social media accounts feeding the MP Pulse intelligence dashboard.",
      },
    ],
  }),
  component: AccountsPage,
});

// Re-export so other placeholder routes keep working
export function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <Card className="p-12 flex flex-col items-center justify-center text-center shadow-soft border-border/70 border-dashed">
        <div className="h-12 w-12 rounded-xl bg-saffron/15 text-saffron flex items-center justify-center mb-4">
          <FileText className="h-5 w-5" />
        </div>
        <h2 className="text-base font-semibold text-foreground">Coming soon</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          This module is part of the upcoming MP Pulse release. Explore the Command Center, Accounts, and Post Analytics in this preview.
        </p>
      </Card>
    </div>
  );
}

type Account = {
  id: string;
  platform: "X" | "Instagram" | "Facebook" | "YouTube";
  handle: string;
  connected: boolean;
  followers: string;
  lastSync: string;
  posts: number;
  growth: string;
};

const accounts: Account[] = [
  {
    id: "x",
    platform: "X",
    handle: "@MPBengaluru",
    connected: true,
    followers: "428.2K",
    lastSync: "4 min ago",
    posts: 612,
    growth: "+2.1%",
  },
  {
    id: "ig",
    platform: "Instagram",
    handle: "@mp.bengaluru",
    connected: true,
    followers: "186.4K",
    lastSync: "6 min ago",
    posts: 384,
    growth: "+4.8%",
  },
  {
    id: "fb",
    platform: "Facebook",
    handle: "Hon'ble MP Bengaluru",
    connected: false,
    followers: "92.1K",
    lastSync: "—",
    posts: 0,
    growth: "—",
  },
  {
    id: "yt",
    platform: "YouTube",
    handle: "MP Bengaluru Official",
    connected: false,
    followers: "21.3K",
    lastSync: "—",
    posts: 0,
    growth: "—",
  },
];

function PlatformIcon({ platform }: { platform: Account["platform"] }) {
  const styles: Record<string, string> = {
    X: "bg-foreground text-background",
    Instagram: "bg-gradient-to-br from-fuchsia-500 via-pink-500 to-amber-400 text-white",
    Facebook: "bg-[#1877F2] text-white",
    YouTube: "bg-[#FF0000] text-white",
  };
  const label: Record<string, string> = {
    X: "𝕏",
    Instagram: "Ig",
    Facebook: "f",
    YouTube: "▶",
  };
  return (
    <div
      className={`h-12 w-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-soft ${styles[platform]}`}
    >
      {label[platform]}
    </div>
  );
}

function AccountCard({ account }: { account: Account }) {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(account.lastSync);

  const handleSync = () => {
    if (!account.connected) return;
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSync("just now");
    }, 1400);
  };

  return (
    <Card className="p-5 shadow-soft border-border/70 hover:shadow-card transition-shadow flex flex-col">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <PlatformIcon platform={account.platform} />
          <div>
            <div className="text-sm font-semibold text-foreground">{account.platform}</div>
            <div className="text-xs text-muted-foreground">{account.handle}</div>
          </div>
        </div>
        {account.connected ? (
          <Badge className="bg-emerald-50 text-emerald-700 border-0 gap-1 text-[10px] uppercase tracking-wider">
            <CheckCircle2 className="h-3 w-3" /> Connected
          </Badge>
        ) : (
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Not connected
          </Badge>
        )}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-muted/50 p-2.5">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Followers</div>
          <div className="mt-0.5 text-sm font-bold text-foreground tabular-nums">
            {account.followers}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium">{account.growth}</div>
        </div>
        <div className="rounded-lg bg-muted/50 p-2.5">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Posts</div>
          <div className="mt-0.5 text-sm font-bold text-foreground tabular-nums">{account.posts}</div>
          <div className="text-[10px] text-muted-foreground">scraped</div>
        </div>
        <div className="rounded-lg bg-muted/50 p-2.5">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Last sync</div>
          <div className="mt-0.5 text-sm font-bold text-foreground">{lastSync}</div>
          <div className="text-[10px] text-muted-foreground">auto / 5min</div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        {account.connected ? (
          <>
            <Button
              size="sm"
              onClick={handleSync}
              disabled={syncing}
              className="flex-1 gap-2 bg-navy text-navy-foreground hover:bg-navy/90"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing…" : "Sync Now"}
            </Button>
            <Button size="sm" variant="outline" className="gap-1">
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="ghost" className="px-2">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            className="flex-1 gap-2 bg-saffron text-saffron-foreground hover:bg-saffron/90"
          >
            <Plus className="h-3.5 w-3.5" />
            Connect {account.platform}
          </Button>
        )}
      </div>
    </Card>
  );
}

function AccountsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Connected Accounts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage the social channels feeding your MP Pulse intelligence stream.
          </p>
        </div>
        <Button className="gap-2 bg-saffron text-saffron-foreground hover:bg-saffron/90">
          <Plus className="h-4 w-4" /> Add Account
        </Button>
      </div>

      {/* Summary bar */}
      <Card className="p-4 shadow-soft border-border/70 bg-gradient-to-r from-navy to-navy/90 text-navy-foreground">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-saffron/20 text-saffron flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-navy-foreground/60">
                  Accounts
                </div>
                <div className="text-base font-bold">4 connected</div>
              </div>
            </div>
            <div className="h-8 w-px bg-navy-foreground/15 hidden sm:block" />
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-saffron/20 text-saffron flex items-center justify-center">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-navy-foreground/60">
                  Posts analyzed
                </div>
                <div className="text-base font-bold tabular-nums">1,284</div>
              </div>
            </div>
            <div className="h-8 w-px bg-navy-foreground/15 hidden sm:block" />
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-saffron/20 text-saffron flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-navy-foreground/60">
                  Last sync
                </div>
                <div className="text-base font-bold">4 min ago</div>
              </div>
            </div>
          </div>
          <Button
            size="sm"
            className="gap-2 bg-saffron text-saffron-foreground hover:bg-saffron/90"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Sync All
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {accounts.map((a) => (
          <AccountCard key={a.id} account={a} />
        ))}
      </div>

      <Card className="p-5 shadow-soft border-border/70">
        <h3 className="text-sm font-semibold text-foreground">Sync settings</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Posts and engagement metrics refresh every 5 minutes. Sentiment analysis runs on each new batch within 90 seconds. Historical backfill covers the last 24 months.
        </p>
      </Card>
    </div>
  );
}
