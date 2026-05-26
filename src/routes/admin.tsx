import { createFileRoute, Outlet, redirect, Link, useNavigate } from "@tanstack/react-router";
import { getCurrentStaff, staffLogout, useCurrentStaff } from "@/lib/staff-store";
import { LayoutDashboard, Users, ClipboardList, LogOut, ShieldCheck, UserCog, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const s = getCurrentStaff();
    if (!s) throw redirect({ to: "/staff/login" });
    if (s.role !== "admin") throw redirect({ to: "/staff/dashboard" });
  },
  component: AdminLayout,
});

function AdminLayout() {
  const staff = useCurrentStaff();
  const navigate = useNavigate();
  const items = [
    { to: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { to: "/admin/customers", label: "Customers", Icon: Users },
    { to: "/admin/requests", label: "Service Requests", Icon: ClipboardList },
    { to: "/admin/staff", label: "Staff", Icon: UserCog },
    { to: "/admin/revenue", label: "Revenue", Icon: IndianRupee },
  ] as const;
  return (
    <section className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary">
          <ShieldCheck className="h-4 w-4" />
          <div>
            <p className="text-[10px] uppercase tracking-wide opacity-80">Admin</p>
            <p className="text-sm font-semibold">{staff?.name}</p>
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {items.map(({ to, label, Icon }) => (
            <Link key={to} to={to}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-primary/10 text-primary" }}>
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
          <Button variant="ghost" size="sm" className="mt-2 justify-start" onClick={() => { staffLogout(); void navigate({ to: "/" }); }}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </nav>
      </aside>
      <div><Outlet /></div>
    </section>
  );
}
