import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useOrders, updateOrderStatus, setOrderPayment, fmt, type Order, type OrderStatus, type PaymentState,
} from "@/lib/shop-store";
import { Search, Eye } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({ component: AdminOrders });

const STATUSES: OrderStatus[] = ["New", "Approved", "Packed", "Shipped", "Delivered", "Cancelled", "Returned"];
const NEXT: Record<OrderStatus, OrderStatus[]> = {
  New: ["Approved", "Cancelled"],
  Approved: ["Packed", "Cancelled"],
  Packed: ["Shipped"],
  Shipped: ["Delivered"],
  Delivered: ["Returned"],
  Cancelled: [],
  Returned: [],
};

function AdminOrders() {
  const orders = useOrders();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<OrderStatus | "All">("All");
  const [view, setView] = useState<Order | null>(null);

  const filtered = useMemo(() => orders.filter(o =>
    (status === "All" || o.status === status) &&
    (q === "" || (o.id + o.userName + o.mobile).toLowerCase().includes(q.toLowerCase()))
  ), [orders, q, status]);

  const counts = useMemo(() => {
    const m: Record<OrderStatus, number> = { New: 0, Approved: 0, Packed: 0, Shipped: 0, Delivered: 0, Cancelled: 0, Returned: 0 };
    orders.forEach(o => { m[o.status]++; });
    return m;
  }, [orders]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">{orders.length} total orders</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className={`rounded-md border p-3 text-left transition ${status === s ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
            <p className="text-xs text-muted-foreground">{s}</p>
            <p className="text-xl font-bold">{counts[s]}</p>
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by order, customer, mobile…" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus | "All")}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All statuses</SelectItem>
              {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(o => (
                  <tr key={o.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                    <td className="px-4 py-3"><p className="font-medium">{o.userName}</p><p className="text-xs text-muted-foreground">{o.mobile}</p></td>
                    <td className="px-4 py-3 font-medium">{fmt(o.total)}</td>
                    <td className="px-4 py-3"><Badge variant="outline">{o.paymentMode}</Badge> <span className="text-xs text-muted-foreground">{o.paymentState}</span></td>
                    <td className="px-4 py-3"><StatusPill s={o.status} /></td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => setView(o)}><Eye className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">No orders match.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{view?.id}</DialogTitle></DialogHeader>
          {view && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <Info label="Customer" value={view.userName} />
                <Info label="Mobile" value={view.mobile} />
                <Info label="Payment" value={`${view.paymentMode} · ${view.paymentState}`} />
                <Info label="Total" value={fmt(view.total)} />
              </div>
              <div className="rounded-md border bg-muted/30 p-3">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Address</p>
                <p className="mt-1">{view.address.name}, {view.address.line1}, {view.address.village}, {view.address.mandal}, {view.address.district} - {view.address.pincode}</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Items</p>
                <ul className="divide-y rounded-md border">
                  {view.lines.map(l => (
                    <li key={l.productId} className="flex justify-between p-3"><span>{l.name} × {l.qty}</span><span className="font-medium">{fmt(l.price * l.qty)}</span></li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Move to:</span>
                {NEXT[view.status].map(ns => (
                  <Button key={ns} size="sm" variant="outline" onClick={() => { updateOrderStatus(view.id, ns); toast.success(`Order ${ns}`); setView({ ...view, status: ns }); }}>{ns}</Button>
                ))}
                {view.paymentState === "Pending" && view.paymentMode === "COD" && (
                  <Button size="sm" variant="secondary" onClick={() => { setOrderPayment(view.id, "Paid" as PaymentState); toast.success("Marked Paid"); setView({ ...view, paymentState: "Paid" }); }}>Mark Paid</Button>
                )}
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">History</p>
                <ul className="space-y-1 text-xs">
                  {view.history.map((h, i) => (
                    <li key={i} className="text-muted-foreground">{new Date(h.ts).toLocaleString()} — {h.note}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setView(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[10px] uppercase text-muted-foreground">{label}</p><p className="font-medium">{value}</p></div>;
}
function StatusPill({ s }: { s: OrderStatus }) {
  const map: Record<OrderStatus, string> = {
    New: "bg-blue-500/10 text-blue-700",
    Approved: "bg-violet-500/10 text-violet-700",
    Packed: "bg-amber-500/10 text-amber-700",
    Shipped: "bg-cyan-500/10 text-cyan-700",
    Delivered: "bg-primary/10 text-primary",
    Cancelled: "bg-destructive/10 text-destructive",
    Returned: "bg-orange-500/10 text-orange-700",
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${map[s]}`}>{s}</span>;
}
