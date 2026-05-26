import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { usePayments, refundPayment, type Payment, type PaymentStatus } from "@/lib/staff-store";
import { IndianRupee, TrendingUp, RotateCcw, Wallet, Search, Download, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/revenue")({ component: AdminRevenue });

const fmt = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const tabs: Array<{ key: "All" | PaymentStatus; label: string }> = [
  { key: "All", label: "All" },
  { key: "Succeeded", label: "Succeeded" },
  { key: "Refunded", label: "Refunded" },
  { key: "Failed", label: "Failed" },
];

function AdminRevenue() {
  const payments = usePayments();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"All" | PaymentStatus>("All");
  const [refunding, setRefunding] = useState<Payment | null>(null);
  const [reason, setReason] = useState("");

  const stats = useMemo(() => {
    const succ = payments.filter(p => p.status === "Succeeded");
    const refunded = payments.filter(p => p.status === "Refunded");
    const total = succ.reduce((s, p) => s + p.amount, 0);
    const refundsTotal = refunded.reduce((s, p) => s + p.amount, 0);
    const joining = succ.filter(p => p.kind === "joining").reduce((s, p) => s + p.amount, 0);
    const renewal = succ.filter(p => p.kind === "renewal").reduce((s, p) => s + p.amount, 0);
    return { total, refundsTotal, joining, renewal, net: total - refundsTotal };
  }, [payments]);

  const filtered = useMemo(() => {
    let r = payments;
    if (tab !== "All") r = r.filter(p => p.status === tab);
    if (q) {
      const s = q.toLowerCase();
      r = r.filter(p =>
        p.id.toLowerCase().includes(s) ||
        p.farmerId.toLowerCase().includes(s) ||
        (p.farmerName ?? "").toLowerCase().includes(s) ||
        (p.mobile ?? "").includes(q)
      );
    }
    return r;
  }, [payments, tab, q]);

  const submitRefund = () => {
    if (!refunding) return;
    if (!reason.trim()) return toast.error("Please enter a refund reason");
    refundPayment(refunding.id, reason.trim());
    toast.success(`Refunded ${fmt(refunding.amount)} to ${refunding.farmerName ?? refunding.farmerId}`);
    setRefunding(null);
    setReason("");
  };

  const exportCSV = () => {
    const rows = [
      ["Txn ID", "Date", "Farmer ID", "Farmer", "Mobile", "Type", "Method", "Amount", "Status", "Refund Reason"],
      ...filtered.map(p => [
        p.id, new Date(p.createdAt).toISOString(), p.farmerId,
        p.farmerName ?? "", p.mobile ?? "", p.kind, p.method ?? "",
        String(p.amount), p.status, p.refundReason ?? "",
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `agrikart-payments-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revenue & Payments</h1>
          <p className="mt-1 text-sm text-muted-foreground">All transactions, refunds, and ledger activity.</p>
        </div>
        <Button onClick={exportCSV} variant="outline" size="sm"><Download className="h-4 w-4" /> Export CSV</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Net Revenue" value={fmt(stats.net)} sub="Succeeded − Refunded" Icon={Wallet} tone="bg-primary/10 text-primary" />
        <Stat label="Gross Revenue" value={fmt(stats.total)} sub="All succeeded txns" Icon={IndianRupee} tone="bg-[oklch(0.93_0.08_145)] text-[oklch(0.40_0.13_150)]" />
        <Stat label="Refunds" value={fmt(stats.refundsTotal)} sub={`${payments.filter(p => p.status === "Refunded").length} txns`} Icon={RotateCcw} tone="bg-destructive/10 text-destructive" />
        <Stat label="Joining / Renewal" value={`${fmt(stats.joining)} / ${fmt(stats.renewal)}`} Icon={TrendingUp} tone="bg-accent/20 text-[oklch(0.45_0.15_75)]" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search txn id, farmer id, name, mobile…" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-1 rounded-md border border-border bg-card p-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="p-10 text-center text-sm text-muted-foreground">No transactions match the current filter.</CardContent></Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Txn ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Farmer</th>
                  <th className="px-4 py-3 hidden md:table-cell">Type</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Method</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                    <td className="px-4 py-3 font-mono text-[11px]">{p.id}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{p.farmerName ?? "—"}</p>
                      <p className="text-[11px] text-muted-foreground">{p.farmerId} {p.mobile && `· ${p.mobile}`}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell capitalize">{p.kind}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">{p.method}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${p.status === "Refunded" ? "line-through text-muted-foreground" : ""}`}>{fmt(p.amount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 text-right">
                      {p.status === "Succeeded" ? (
                        <Button size="sm" variant="ghost" onClick={() => setRefunding(p)}>
                          <RotateCcw className="h-3.5 w-3.5" /> Refund
                        </Button>
                      ) : p.status === "Refunded" && p.refundReason ? (
                        <span className="text-[11px] text-muted-foreground" title={p.refundReason}>
                          {new Date(p.refundedAt!).toLocaleDateString()}
                        </span>
                      ) : (
                        <MoreHorizontal className="ml-auto h-4 w-4 text-muted-foreground" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Dialog open={!!refunding} onOpenChange={(o) => { if (!o) { setRefunding(null); setReason(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue refund</DialogTitle>
            <DialogDescription>
              Refunding {refunding && fmt(refunding.amount)} to {refunding?.farmerName ?? refunding?.farmerId}. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea id="reason" rows={3} maxLength={500} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Duplicate payment, customer request, service not delivered…" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRefunding(null); setReason(""); }}>Cancel</Button>
            <Button variant="destructive" onClick={submitRefund}>Confirm Refund</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({ label, value, sub, Icon, tone }: { label: string; value: string; sub?: string; Icon: typeof IndianRupee; tone: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className={`grid h-10 w-10 place-items-center rounded-lg ${tone}`}><Icon className="h-5 w-5" /></div>
        <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
        {sub && <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const cls = status === "Succeeded" ? "bg-[oklch(0.93_0.08_145)] text-[oklch(0.40_0.13_150)]" :
              status === "Refunded" ? "bg-destructive/10 text-destructive" :
              "bg-muted text-muted-foreground";
  return <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${cls}`}>{status}</span>;
}
