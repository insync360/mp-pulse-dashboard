import { createFileRoute } from "@tanstack/react-router";
import { HardHat } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/work-inspection")({
  head: () => ({ meta: [{ title: "Work Inspection — MP Pulse" }] }),
  component: () => <PlaceholderPage title="Work Inspection" icon={HardHat} />,
});
