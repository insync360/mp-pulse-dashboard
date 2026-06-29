import { createFileRoute } from "@tanstack/react-router";
import { FolderOpen } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/department-files")({
  head: () => ({ meta: [{ title: "Department Files — MP Pulse" }] }),
  component: () => <PlaceholderPage title="Department Files" icon={FolderOpen} />,
});
