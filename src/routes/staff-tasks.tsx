import { createFileRoute } from "@tanstack/react-router";
import { ListTodo } from "lucide-react";
import { PlaceholderPage } from "@/components/placeholder-page";

export const Route = createFileRoute("/staff-tasks")({
  head: () => ({ meta: [{ title: "Staff Tasks — MP Pulse" }] }),
  component: () => <PlaceholderPage title="Staff Tasks" icon={ListTodo} />,
});
