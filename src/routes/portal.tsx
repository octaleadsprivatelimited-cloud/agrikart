import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

// Customer portal removed per spec — redirect to registration.
export const Route = createFileRoute("/portal")({
  beforeLoad: () => {
    throw redirect({ to: "/signup" });
  },
  component: () => <Outlet />,
});
