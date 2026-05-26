import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { useCustomers, useRequests, useStaffList, usePayments } from "@/lib/staff-store";
import { Users, CheckCircle2, Clock, XCircle, ClipboardList, IndianRupee, UserCog } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({ component: AdminDashboard });

function AdminDashboard() {
  const customers = useCustomers();
  const requests = useRequests();
  const staff = useStaffList();
  const payments = usePayments();
  const approved = customers.filter(c => c.status === "Approved").length;
  const pending = customers.filter(c => c.status === "Pending").length;
  const rejected = customers.filter(c => c.status === "Rejected").length;
  const revenue = payments.reduce((s, p) => s + p.amount, 0);
  const employees = staff.filter(s => s.role === "employee").length;

  const stats = [
    { label: "Total Revenue", value: "₹" + revenue.toLocaleString("en-IN"), Icon: IndianRupee, tone: "bg-primary/10 text-primary" },
    { label: "Total Customers", value: customers.length, Icon: Users, tone: "bg-primary/10 text-primary" },
    { label: "Employees", value: employees, Icon: UserCog, tone: "bg-accent/20 text-[oklch(0.45_0.15_75)]" },
    { label: "Approved", value: approved, Icon: CheckCircle2, tone: "bg-[oklch(0.93_0.08_145)] text-[oklch(0.40_0.13_150)]" },
    { label: "Pending", value: pending, Icon: Clock, tone: "bg-accent/20 text-[oklch(0.45_0.15_75)]" },
    { label: "Rejected", value: rejected, Icon: XCircle, tone: "bg-destructive/10 text-destructive" },
    { label: "Service Requests", value: requests.length, Icon: ClipboardList, tone: "bg-primary/10 text-primary" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Overview of all customers and service requests across employees.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, Icon, tone }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className={`grid h-10 w-10 place-items-center rounded-lg ${tone}`}><Icon className="h-5 w-5" /></div>
              <p className="mt-3 text-2xl font-bold">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Pending approvals</h2>
            <Link to="/admin/customers" className="text-sm font-semibold text-primary hover:underline">View all →</Link>
          </div>
          {pending === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No pending customers right now.</p>
          ) : (
            <ul className="mt-3 divide-y">
              {customers.filter(c => c.status === "Pending").slice(0, 6).map(c => (
                <li key={c.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <Link to="/admin/customers/$id" params={{ id: c.id }} className="font-medium hover:text-primary">{c.farmerName}</Link>
                    <p className="text-xs text-muted-foreground">{c.village}, {c.district} · by {c.employeeName}</p>
                  </div>
                  <Link to="/admin/customers/$id" params={{ id: c.id }} className="text-xs font-semibold text-primary hover:underline">Review →</Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
