import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useCustomers, useRequests, useStaffList, usePayments, refundPayment, type Payment } from "@/lib/staff-store";
import {
  Users, CheckCircle2, Clock, XCircle, ClipboardList, IndianRupee, UserCog,
  TrendingUp, TrendingDown, RotateCcw, Activity, ArrowUpRight, Eye, Mail, Phone, Hash, Receipt,
} from "lucide-react";
import { toast } from "sonner";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";

export const Route = createFileRoute("/admin/dashboard")({ component: AdminDashboard });

const fmt = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const dayKey = (ts: number) => new Date(ts).toISOString().slice(0, 10);

function AdminDashboard() {
  const customers = useCustomers();
  const requests = useRequests();
  const staff = useStaffList();
  const payments = usePayments();
  const [viewing, setViewing] = useState<Payment | null>(null);
  const [refunding, setRefunding] = useState<Payment | null>(null);
  const [reason, setReason] = useState("");

  const submitRefund = () => {
    if (!refunding) return;
    if (!reason.trim()) return toast.error("Refund reason is required");
    refundPayment(refunding.id, reason.trim());
    toast.success(`Refunded ${fmt(refunding.amount)} · ${refunding.id}`);
    setRefunding(null);
    setReason("");
  };

  const m = useMemo(() => {
    const now = Date.now();
    const ms30 = 30 * 86400000;
    const succ = payments.filter(p => p.status === "Succeeded");
    const refunded = payments.filter(p => p.status === "Refunded");
    const gross = payments.filter(p => p.status !== "Failed").reduce((s, p) => s + p.amount, 0);
    const refundsTotal = refunded.reduce((s, p) => s + p.amount, 0);
    const net = succ.reduce((s, p) => s + p.amount, 0);
    const last30 = succ.filter(p => p.createdAt > now - ms30).reduce((s, p) => s + p.amount, 0);
    const prev30 = succ.filter(p => p.createdAt > now - 2 * ms30 && p.createdAt <= now - ms30).reduce((s, p) => s + p.amount, 0);
    const delta = prev30 === 0 ? (last30 > 0 ? 100 : 0) : ((last30 - prev30) / prev30) * 100;

    // 14-day series
    const series: { date: string; revenue: number; refunds: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      const dayRev = succ.filter(p => dayKey(p.createdAt) === key).reduce((s, p) => s + p.amount, 0);
      const dayRef = refunded.filter(p => dayKey(p.refundedAt ?? p.createdAt) === key).reduce((s, p) => s + p.amount, 0);
      series.push({ date: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }), revenue: dayRev, refunds: dayRef });
    }

    // Service mix
    const cats = ["Drone", "Seeds", "Fertilizers", "Pesticides", "Loan", "Insurance", "Cold Storage"] as const;
    const serviceMix = cats.map(c => ({ name: c, value: requests.filter(r => r.category === c).length })).filter(x => x.value > 0);

    // Payment kind split
    const joining = succ.filter(p => p.kind === "joining").reduce((s, p) => s + p.amount, 0);
    const renewal = succ.filter(p => p.kind === "renewal").reduce((s, p) => s + p.amount, 0);
    const kindMix = [
      { name: "Joining", value: joining },
      { name: "Renewal", value: renewal },
    ].filter(x => x.value > 0);

    return {
      gross, net, refundsTotal, last30, delta,
      refundRate: gross > 0 ? (refundsTotal / gross) * 100 : 0,
      txCount: payments.length,
      succCount: succ.length,
      refundCount: refunded.length,
      avgTicket: succ.length ? net / succ.length : 0,
      series, serviceMix, kindMix,
    };
  }, [payments, requests]);

  const approved = customers.filter(c => c.status === "Approved").length;
  const pending = customers.filter(c => c.status === "Pending").length;
  const rejected = customers.filter(c => c.status === "Rejected").length;
  const employees = staff.filter(s => s.role === "employee").length;

  const recentPayments = payments.slice(0, 6);
  const pendingCustomers = customers.filter(c => c.status === "Pending").slice(0, 5);

  const PIE_COLORS = ["oklch(0.55_0.18_145)", "oklch(0.70_0.16_75)", "oklch(0.55_0.20_25)", "oklch(0.60_0.15_240)", "oklch(0.65_0.14_300)", "oklch(0.55_0.12_180)", "oklch(0.60_0.13_50)"];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">Real-time view of revenue, operations, staff, and customer activity.</p>
        </div>
        <Badge variant="secondary" className="gap-1.5"><Activity className="h-3 w-3" /> Live</Badge>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Net Revenue" value={fmt(m.net)} sub={`${m.succCount} successful · ATV ${fmt(m.avgTicket)}`}
          Icon={IndianRupee} delta={m.delta} tone="bg-primary/10 text-primary" />
        <Kpi label="Last 30 Days" value={fmt(m.last30)} sub="vs previous 30 days"
          Icon={TrendingUp} delta={m.delta} tone="bg-[oklch(0.93_0.08_145)] text-[oklch(0.40_0.13_150)]" />
        <Kpi label="Refunds" value={fmt(m.refundsTotal)} sub={`${m.refundCount} txns · ${m.refundRate.toFixed(1)}% rate`}
          Icon={RotateCcw} tone="bg-destructive/10 text-destructive" />
        <Kpi label="Active Customers" value={String(customers.length)} sub={`${approved} approved · ${pending} pending`}
          Icon={Users} tone="bg-accent/20 text-[oklch(0.45_0.15_75)]" />
      </div>

      {/* Secondary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat label="Employees" value={employees} Icon={UserCog} />
        <MiniStat label="Service Requests" value={requests.length} Icon={ClipboardList} />
        <MiniStat label="Pending Reviews" value={pending} Icon={Clock} />
        <MiniStat label="Rejected" value={rejected} Icon={XCircle} />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">Revenue vs Refunds</h2>
                <p className="text-xs text-muted-foreground">Last 14 days</p>
              </div>
              <Link to="/admin/revenue" className="inline-flex items-center text-xs font-semibold text-primary hover:underline">
                Open ledger <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={m.series}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.55 0.18 145)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="oklch(0.55 0.18 145)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ref" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.55 0.20 25)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="oklch(0.55 0.20 25)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => "₹" + v} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v: number) => fmt(v)} />
                  <Area type="monotone" dataKey="revenue" stroke="oklch(0.55 0.18 145)" fill="url(#rev)" strokeWidth={2} />
                  <Area type="monotone" dataKey="refunds" stroke="oklch(0.55 0.20 25)" fill="url(#ref)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-base font-semibold">Revenue Mix</h2>
            {m.kindMix.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">No revenue yet.</p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={m.kindMix} dataKey="value" nameKey="name" outerRadius={80} innerRadius={50}>
                      {m.kindMix.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Service categories + customer funnel */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="mb-4 text-base font-semibold">Service Requests by Category</h2>
            {m.serviceMix.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">No service requests yet.</p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={m.serviceMix}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="value" fill="oklch(0.55 0.18 145)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-base font-semibold">Customer Funnel</h2>
            <FunnelRow label="Pending" value={pending} total={customers.length || 1} color="bg-[oklch(0.70_0.16_75)]" />
            <FunnelRow label="Approved" value={approved} total={customers.length || 1} color="bg-primary" />
            <FunnelRow label="Rejected" value={rejected} total={customers.length || 1} color="bg-destructive" />
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold">Recent Payments</h2>
              <Link to="/admin/revenue" className="text-xs font-semibold text-primary hover:underline">View all →</Link>
            </div>
            {recentPayments.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No payments recorded yet.</p>
            ) : (
              <ul className="divide-y">
                {recentPayments.map(p => (
                  <PaymentRow key={p.id} p={p}
                    onView={() => setViewing(p)}
                    onRefund={() => { setRefunding(p); setReason(""); }} />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold">Pending Approvals</h2>
              <Link to="/admin/customers" className="text-xs font-semibold text-primary hover:underline">View all →</Link>
            </div>
            {pendingCustomers.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No pending customers.</p>
            ) : (
              <ul className="divide-y">
                {pendingCustomers.map(c => (
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
    </div>
  );
}

function Kpi({ label, value, sub, Icon, delta, tone }: { label: string; value: string; sub?: string; Icon: typeof IndianRupee; delta?: number; tone: string }) {
  const up = (delta ?? 0) >= 0;
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className={`grid h-10 w-10 place-items-center rounded-lg ${tone}`}><Icon className="h-5 w-5" /></div>
          {delta !== undefined && (
            <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${up ? "bg-[oklch(0.93_0.08_145)] text-[oklch(0.40_0.13_150)]" : "bg-destructive/10 text-destructive"}`}>
              {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(delta).toFixed(1)}%
            </span>
          )}
        </div>
        <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
        {sub && <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, value, Icon }: { label: string; value: number | string; Icon: typeof Users }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-muted text-foreground"><Icon className="h-4 w-4" /></div>
        <div>
          <p className="text-lg font-semibold leading-tight">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function FunnelRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = Math.round((value / total) * 100);
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value} ({pct}%)</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className={`h-full ${color}`} style={{ width: pct + "%" }} />
      </div>
    </div>
  );
}

function PaymentRow({ p, onView, onRefund }: { p: Payment; onView: () => void; onRefund: () => void }) {
  return (
    <li className="flex items-center justify-between gap-2 py-2.5 text-sm">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{p.farmerName ?? p.farmerId} <span className="ml-1 text-[11px] font-normal text-muted-foreground">· {p.kind}</span></p>
        <p className="truncate text-[11px] text-muted-foreground font-mono">{p.id}</p>
        <p className="text-[11px] text-muted-foreground">{new Date(p.createdAt).toLocaleString()} · {p.method}</p>
      </div>
      <div className="text-right">
        <p className={`font-semibold ${p.status === "Refunded" ? "text-destructive line-through" : ""}`}>{fmt(p.amount)}</p>
        <StatusBadge status={p.status} />
      </div>
      <div className="flex flex-col gap-1">
        <Button size="sm" variant="ghost" className="h-7 px-2" onClick={onView}><Eye className="h-3.5 w-3.5" /></Button>
        {p.status === "Succeeded" && (
          <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive hover:text-destructive" onClick={onRefund}>
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </li>
  );
}

function StatusBadge({ status }: { status: Payment["status"] }) {
  const cls = status === "Succeeded" ? "bg-[oklch(0.93_0.08_145)] text-[oklch(0.40_0.13_150)]" :
              status === "Refunded" ? "bg-destructive/10 text-destructive" :
              "bg-muted text-muted-foreground";
  return <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${cls}`}>{status}</span>;
}
