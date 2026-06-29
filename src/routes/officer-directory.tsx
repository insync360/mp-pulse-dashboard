import { createFileRoute } from "@tanstack/react-router";
import { BookUser } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/officer-directory")({
  head: () => ({ meta: [{ title: "Officer Directory — MP Pulse" }] }),
  component: () => <PlaceholderPage title="Officer Directory" icon={BookUser} />,
});
