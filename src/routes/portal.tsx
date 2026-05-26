import { createFileRoute, Outlet, redirect, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { getCurrentUser } from "@/lib/auth-store";
import { LayoutDashboard, PlusCircle, ListChecks } from "lucide-react";

export const Route = createFileRoute("/portal")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    if (!getCurrentUser()) throw redirect({ to: "/login" });
  },
  component: PortalLayout,
});

function PortalLayout() {
  const { t } = useTranslation();
  const items = [
    { to: "/portal/dashboard", label: t("portal.dashboardTitle"), Icon: LayoutDashboard },
    { to: "/portal/book", label: t("portal.bookService"), Icon: PlusCircle },
    { to: "/portal/bookings", label: t("portal.myBookings"), Icon: ListChecks },
  ] as const;
  return (
    <section className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {items.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-primary/10 text-primary" }}
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div><Outlet /></div>
    </section>
  );
}
