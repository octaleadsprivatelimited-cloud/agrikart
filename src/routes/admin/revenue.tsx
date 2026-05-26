import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { usePayments } from "@/lib/staff-store";
import { IndianRupee, TrendingUp, Users } from "lucide-react";

export const Route = createFileRoute("/admin/revenue")({ component: AdminRevenue });

function AdminRevenue() {
  const payments = usePayments();

  const stats = useMemo(() => {
    const total = payments.reduce((s, p) => s + p.amount, 0);
    const joining = payments.filter(p => p.kind === "joining").reduce((s, p) => s + p.amount, 0);
    const renewal = payments.filter(p => p.kind === "renewal").reduce((s, p) => s + p.amount, 0);
    const last30 = payments.filter(p => p.createdAt > Date.now() - 30 * 86400000).reduce((s, p) => s + p.amount, 0);
    return { total, joining, renewal, last30, count: payments.length };
  }, [payments]);

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Revenue</h1>
        <p className="mt-1 text-sm text-muted-foreground">All farmer joining fees and renewals collected via Rojaripay.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total Revenue" value={fmt(stats.total)} Icon={IndianRupee} tone="bg-primary/10 text-primary" />
        <Stat label="Last 30 Days" value={fmt(stats.last30)} Icon={TrendingUp} tone="bg-[oklch(0.93_0.08_145)] text-[oklch(0.40_0.13_150)]" />
        <Stat label="Joining Fees" value={fmt(stats.joining)} Icon={IndianRupee} tone="bg-accent/20 text-[oklch(0.45_0.15_75)]" />
        <Stat label="Renewals" value={fmt(stats.renewal)} Icon={Users} tone="bg-primary/10 text-primary" />
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold">Transactions ({stats.count})</h2>
          {payments.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No payments recorded yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Farmer ID</th>
                    <th className="px-4 py-3 hidden md:table-cell">Farmer</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono text-xs">{p.farmerId}</td>
                      <td className="px-4 py-3 hidden md:table-cell">{p.farmerName ?? "—"} {p.mobile && <span className="text-xs text-muted-foreground">· {p.mobile}</span>}</td>
                      <td className="px-4 py-3 capitalize">{p.kind}</td>
                      <td className="px-4 py-3 text-right font-semibold">{fmt(p.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value, Icon, tone }: { label: string; value: string; Icon: typeof IndianRupee; tone: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className={`grid h-10 w-10 place-items-center rounded-lg ${tone}`}><Icon className="h-5 w-5" /></div>
        <p className="mt-3 text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
