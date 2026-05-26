import { createFileRoute, redirect } from "@tanstack/react-router";

// Customer login removed per spec — redirect to registration.
export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    throw redirect({ to: "/signup" });
  },
  component: () => null,
});
