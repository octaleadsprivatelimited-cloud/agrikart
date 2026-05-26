import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCurrentStaff, useCustomers } from "@/lib/staff-store";
import { Users, Calendar, CheckCircle2, Clock, UserPlus } from "lucide-react";


export default function Dashboard() {
  const staff = useCurrentStaff();
  const customers = useCustomers({ employeeId: staff?.id });
  const today = new Date(); today.setHours(0,0,0,0);
  const todayCount = customers.filter(c => c.createdAt >= today.getTime()).length;
  const approved = customers.filter(c => c.status === "Approved").length;
  const pending = customers.filter(c => c.status === "Pending").length;

  const stats = [
    { label: "Total Customers", value: customers.length, Icon: Users, tone: "bg-primary/10 text-primary" },
    { label: "Today's Entries", value: todayCount, Icon: Calendar, tone: "bg-accent/20 text-[oklch(0.55_0.15_75)]" },
    { label: "Approved", value: approved, Icon: CheckCircle2, tone: "bg-[oklch(0.93_0.08_145)] text-[oklch(0.40_0.13_150)]" },
    { label: "Pending", value: pending, Icon: Clock, tone: "bg-accent/20 text-[oklch(0.45_0.15_75)]" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your assigned farmers and service requests.</p>
        </div>
        <Button asChild><Link to="/staff/add-customer"><UserPlus className="h-4 w-4" /> Add Customer</Link></Button>
      </div>

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
          <h2 className="text-lg font-semibold">Recent customers</h2>
          {customers.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No customers added yet. Click "Add Customer" to get started.</p>
          ) : (
            <ul className="mt-3 divide-y">
              {customers.slice(0, 6).map(c => (
                <li key={c.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <Link to="/staff/customers/$id" params={{ id: c.id }} className="font-medium hover:text-primary">{c.farmerName}</Link>
                    <p className="text-xs text-muted-foreground">{c.village}, {c.district}</p>
                  </div>
                  <StatusPill status={c.status} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function StatusPill({ status }: { status: "Pending" | "Approved" | "Rejected" }) {
  const tone = status === "Approved"
    ? "bg-[oklch(0.93_0.08_145)] text-[oklch(0.35_0.13_150)]"
    : status === "Rejected"
    ? "bg-destructive/10 text-destructive"
    : "bg-accent/20 text-[oklch(0.45_0.15_75)]";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{status}</span>;
}
