import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOrders, useProducts, fmt } from "@/lib/shop-store";
import { Download } from "lucide-react";
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line,
} from "recharts";

export const Route = createFileRoute("/admin/reports")({ component: AdminReports });

function AdminReports() {
  const orders = useOrders();
  const products = useProducts();

  const data = useMemo(() => {
    const now = Date.now();
    const days: { date: string; revenue: number; orders: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const k = d.toISOString().slice(0, 10);
      const dayOrders = orders.filter(o => new Date(o.createdAt).toISOString().slice(0, 10) === k && o.status !== "Cancelled");
      days.push({ date: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }), revenue: dayOrders.reduce((s, o) => s + o.total, 0), orders: dayOrders.length });
    }
    const months: Record<string, { revenue: number; orders: number }> = {};
    orders.filter(o => o.status !== "Cancelled").forEach(o => {
      const k = new Date(o.createdAt).toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
      months[k] = months[k] ?? { revenue: 0, orders: 0 };
      months[k].revenue += o.total; months[k].orders += 1;
    });
    const monthly = Object.entries(months).map(([date, v]) => ({ date, ...v }));
    const topProducts = products.map(p => {
      const sold = orders.flatMap(o => o.lines).filter(l => l.productId === p.id).reduce((s, l) => s + l.qty, 0);
      const rev = orders.flatMap(o => o.lines).filter(l => l.productId === p.id).reduce((s, l) => s + l.price * l.qty, 0);
      return { name: p.name, sold, revenue: rev };
    }).filter(x => x.sold > 0).sort((a, b) => b.revenue - a.revenue).slice(0, 8);
    return { days, monthly, topProducts };
  }, [orders, products]);

  const exportCsv = (rows: Record<string, string | number>[], filename: string) => {
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(","), ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? "")).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">Daily & monthly sales, top products, exports.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportCsv(data.days, "daily-sales.csv")}><Download className="h-4 w-4" /> Daily CSV</Button>
          <Button variant="outline" onClick={() => exportCsv(data.monthly, "monthly-sales.csv")}><Download className="h-4 w-4" /> Monthly CSV</Button>
          <Button variant="outline" onClick={() => exportCsv(orders.map(o => ({ id: o.id, customer: o.userName, mobile: o.mobile, status: o.status, payment: o.paymentState, mode: o.paymentMode, total: o.total, date: new Date(o.createdAt).toISOString() })), "orders.csv")}><Download className="h-4 w-4" /> Orders CSV</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-3 text-base font-semibold">Daily revenue (30 days)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.days}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => "₹" + v} />
                <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="revenue" fill="oklch(0.55 0.18 145)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-3 text-base font-semibold">Monthly trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthly}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => "₹" + v} />
                <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="revenue" stroke="oklch(0.55 0.18 145)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="border-b p-4"><h2 className="text-base font-semibold">Top products</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Units sold</th><th className="px-4 py-3">Revenue</th></tr>
              </thead>
              <tbody className="divide-y">
                {data.topProducts.length === 0 ? (
                  <tr><td colSpan={3} className="px-4 py-8 text-center text-sm text-muted-foreground">No sales data yet.</td></tr>
                ) : data.topProducts.map(p => (
                  <tr key={p.name}>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3"><Badge variant="outline">{p.sold}</Badge></td>
                    <td className="px-4 py-3 font-medium">{fmt(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
