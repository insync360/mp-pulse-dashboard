import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <Card className="p-12 flex flex-col items-center justify-center text-center shadow-soft border-border/70 border-dashed">
        <div className="h-12 w-12 rounded-xl bg-saffron/15 text-saffron flex items-center justify-center mb-4">
          <Construction className="h-5 w-5" />
        </div>
        <h2 className="text-base font-semibold text-foreground">Coming soon</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          This module is part of the upcoming MP Pulse release. The Command Center is fully wired up — preview the live demo on the home page.
        </p>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/accounts")({
  head: () => ({ meta: [{ title: "Accounts — MP Pulse" }] }),
  component: () => (
    <PlaceholderPage
      title="Connected Accounts"
      description="Manage X, Instagram, Facebook & YouTube accounts feeding the dashboard."
    />
  ),
});
