import { Outlet, Link, useNavigate, NavLink } from "react-router-dom";
import { getCurrentStaff, staffLogout, useCurrentStaff } from "@/lib/staff-store";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  LogOut,
  ShieldCheck,
  UserCog,
  IndianRupee,
  Package,
  Boxes,
  ShoppingCart,
  Truck,
  CreditCard,
  LifeBuoy,
  FileBarChart,
  Settings,
  Inbox,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/admin/submissions", label: "Submissions", Icon: Inbox },
  { to: "/admin/products", label: "Products", Icon: Package },
  { to: "/admin/inventory", label: "Inventory", Icon: Boxes },
  { to: "/admin/orders", label: "Orders", Icon: ShoppingCart },
  { to: "/admin/deliveries", label: "Deliveries", Icon: Truck },
  { to: "/admin/payments", label: "Payments", Icon: CreditCard },
  { to: "/admin/tickets", label: "Support", Icon: LifeBuoy },
  { to: "/admin/reports", label: "Reports", Icon: FileBarChart },
  { to: "/admin/customers", label: "Customers", Icon: Users },
  { to: "/admin/requests", label: "Service Requests", Icon: ClipboardList },
  { to: "/admin/staff", label: "Staff", Icon: UserCog },
  { to: "/admin/revenue", label: "Revenue", Icon: IndianRupee },
  { to: "/admin/content", label: "Site Content", Icon: Sparkles },
  { to: "/admin/settings", label: "Settings", Icon: Settings },
] as const;

export default function AdminLayout() {
  const staff = useCurrentStaff();
  const navigate = useNavigate();
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
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground ${isActive ? "bg-primary/10 text-primary" : ""}`
              }
            >
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 justify-start"
            onClick={() => {
              staffLogout();
              navigate("/");
            }}
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </nav>
      </aside>
      <div>
        <Outlet />
      </div>
    </section>
  );
}
