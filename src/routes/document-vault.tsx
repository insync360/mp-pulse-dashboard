import { createFileRoute } from "@tanstack/react-router";
import { Archive } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/document-vault")({
  head: () => ({ meta: [{ title: "Document Vault — MP Pulse" }] }),
  component: () => <PlaceholderPage title="Document Vault" icon={Archive} />,
});
