import { createFileRoute } from "@tanstack/react-router";
import { CheckSquare } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/approvals")({
  head: () => ({ meta: [{ title: "Approvals — MP Pulse" }] }),
  component: () => <PlaceholderPage title="Approvals" icon={CheckSquare} />,
});
