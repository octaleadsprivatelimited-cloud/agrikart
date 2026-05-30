
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useOrders, assignDelivery, updateOrderStatus, fmt, type Order } from "@/lib/shop-store";
import { Truck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";


export default function AdminDeliveries() {
  const orders = useOrders();
  const list = useMemo(() => orders.filter(o => ["Packed", "Shipped", "Delivered"].includes(o.status)), [orders]);
  const [open, setOpen] = useState<Order | null>(null);
  const [proofOpen, setProofOpen] = useState<Order | null>(null);
  const [person, setPerson] = useState(""); const [eta, setEta] = useState("");
  const [proof, setProof] = useState("");

  const submitAssign = () => {
    if (!open) return;
    if (!person.trim()) return toast.error("Person required");
    const ts = eta ? new Date(eta).getTime() : Date.now() + 2 * 86400000;
    assignDelivery(open.id, person.trim(), ts);
    updateOrderStatus(open.id, "Shipped", `Out for delivery via ${person}`);
    toast.success("Delivery assigned");
    setOpen(null); setPerson(""); setEta("");
  };
  const submitProof = () => {
    if (!proofOpen) return;
    if (!proof.trim()) return toast.error("Add proof note / signature");
    updateOrderStatus(proofOpen.id, "Delivered", `Delivered. Proof: ${proof}`);
    toast.success("Marked delivered");
    setProofOpen(null); setProof("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Deliveries</h1>
        <p className="mt-1 text-sm text-muted-foreground">Assign delivery staff, track and capture proof.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Assigned</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {list.map(o => (
                  <tr key={o.id}>
                    <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                    <td className="px-4 py-3"><p className="font-medium">{o.userName}</p><p className="text-xs text-muted-foreground">{o.mobile}</p></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{o.address.village}, {o.address.district}</td>
                    <td className="px-4 py-3 font-medium">{fmt(o.total)}</td>
                    <td className="px-4 py-3"><Badge variant="outline">{o.status}</Badge></td>
                    <td className="px-4 py-3 text-xs">{o.deliveryPerson ?? "—"}{o.expectedDelivery ? ` · ETA ${new Date(o.expectedDelivery).toLocaleDateString()}` : ""}</td>
                    <td className="px-4 py-3 text-right space-x-1">
                      {o.status !== "Delivered" && (
                        <Button size="sm" variant="outline" onClick={() => { setOpen(o); setPerson(o.deliveryPerson ?? ""); }}><Truck className="h-3.5 w-3.5" /> Assign</Button>
                      )}
                      {o.status === "Shipped" && (
                        <Button size="sm" onClick={() => setProofOpen(o)}><CheckCircle2 className="h-3.5 w-3.5" /> Delivered</Button>
                      )}
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">No active deliveries.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assign delivery — {open?.id}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label className="text-xs">Delivery person</Label><Input value={person} onChange={e => setPerson(e.target.value)} placeholder="e.g. Ramesh K." /></div>
            <div className="space-y-1.5"><Label className="text-xs">Expected delivery date</Label><Input type="date" value={eta} onChange={e => setEta(e.target.value)} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(null)}>Cancel</Button><Button onClick={submitAssign}>Assign & ship</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!proofOpen} onOpenChange={(v) => !v && setProofOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delivery proof — {proofOpen?.id}</DialogTitle></DialogHeader>
          <div className="space-y-1.5">
            <Label className="text-xs">Signature / OTP / photo reference</Label>
            <Input value={proof} onChange={e => setProof(e.target.value)} placeholder="e.g. OTP 4821, signed by farmer" />
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setProofOpen(null)}>Cancel</Button><Button onClick={submitProof}>Confirm delivered</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
