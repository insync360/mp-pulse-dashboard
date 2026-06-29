import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/unified-inbox")({
  beforeLoad: () => {
    throw redirect({ to: "/inbox" });
  },
});
