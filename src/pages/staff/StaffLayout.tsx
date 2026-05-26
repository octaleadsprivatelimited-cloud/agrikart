import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { staffLogout, useCurrentStaff } from "@/lib/staff-store";
import { LayoutDashboard, UserPlus, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/staff/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/staff/add-customer", label: "Add Customer", Icon: UserPlus },
  { to: "/staff/customers", label: "Customers", Icon: Users },
] as const;

export default function StaffLayout() {
  const staff = useCurrentStaff();
  const navigate = useNavigate();
  return (
    <section className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="mb-4 rounded-lg border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground">Employee</p>
          <p className="text-sm font-semibold">{staff?.name}</p>
        </div>
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {items.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground ${isActive ? "bg-primary/10 text-primary" : ""}`
              }>
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
          <Button variant="ghost" size="sm" className="mt-2 justify-start" onClick={() => { staffLogout(); navigate("/"); }}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </nav>
      </aside>
      <div><Outlet /></div>
    </section>
  );
}
