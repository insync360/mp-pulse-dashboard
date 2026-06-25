import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function PlaceholderPage({
  title,
  subtitle = "Built in this release",
  emptyTitle = "Module ready",
  emptyBody = "This workspace is wired up and ready. Detailed views and live data will populate as your team configures inputs for this module.",
  icon: Icon = Sparkles,
}: {
  title: string;
  subtitle?: string;
  emptyTitle?: string;
  emptyBody?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-navy">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
      <Card className="p-14 flex flex-col items-center justify-center text-center border-dashed border-border/70">
        <div className="h-14 w-14 rounded-2xl bg-saffron/15 text-saffron flex items-center justify-center mb-4">
          <Icon className="h-6 w-6" />
        </div>
        <h2 className="text-base font-semibold text-foreground">{emptyTitle}</h2>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-md">{emptyBody}</p>
      </Card>
    </div>
  );
}
