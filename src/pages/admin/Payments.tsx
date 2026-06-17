import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrders, setOrderPayment, fmt, type PaymentState } from "@/lib/shop-store";
import { toast } from "sonner";
import { Search } from "lucide-react";

export default function AdminPayments() {
  const orders = useOrders();
  const [q, setQ] = useState("");
  const [state, setState] = useState<PaymentState | "All">("All");

  const filtered = useMemo(
    () =>
      orders.filter(
        (o) =>
          (state === "All" || o.paymentState === state) &&
          (q === "" || (o.id + o.userName).toLowerCase().includes(q.toLowerCase())),
      ),
    [orders, q, state],
  );

  const totals = useMemo(() => {
    const paid = orders.filter((o) => o.paymentState === "Paid").reduce((s, o) => s + o.total, 0);
    const pending = orders
      .filter((o) => o.paymentState === "Pending")
      .reduce((s, o) => s + o.total, 0);
    const refunded = orders
      .filter((o) => o.paymentState === "Refunded")
      .reduce((s, o) => s + o.total, 0);
    return { paid, pending, refunded };
  }, [orders]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Order payments — COD collection, online txns, refunds.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <KPI tone="bg-primary/10 text-primary" label="Collected" value={fmt(totals.paid)} />
        <KPI
          tone="bg-amber-500/10 text-amber-700"
          label="Pending (COD)"
          value={fmt(totals.pending)}
        />
        <KPI
          tone="bg-destructive/10 text-destructive"
          label="Refunded"
          value={fmt(totals.refunded)}
        />
      </div>

      <Card>
        <CardContent className="p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Select value={state} onValueChange={(v) => setState(v as PaymentState | "All")}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All states</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
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
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">State</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((o) => (
                  <tr key={o.id}>
                    <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                    <td className="px-4 py-3">{o.userName}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{o.paymentMode}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          o.paymentState === "Paid"
                            ? "default"
                            : o.paymentState === "Refunded"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {o.paymentState}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium">{fmt(o.total)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right space-x-1">
                      {o.paymentState === "Pending" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setOrderPayment(o.id, "Paid");
                            toast.success("Marked Paid");
                          }}
                        >
                          Mark Paid
                        </Button>
                      )}
                      {o.paymentState === "Paid" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm("Refund this payment?")) {
                              setOrderPayment(o.id, "Refunded");
                              toast.success("Refunded");
                            }
                          }}
                        >
                          Refund
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No payments match.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
function KPI({ tone, label, value }: { tone: string; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className={`mb-2 inline-block rounded-md px-2 py-0.5 text-xs ${tone}`}>{label}</div>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
