import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/knowledge-base")({
  head: () => ({ meta: [{ title: "Knowledge Base — MP Pulse" }] }),
  component: () => <PlaceholderPage title="Knowledge Base" icon={BookOpen} />,
});
