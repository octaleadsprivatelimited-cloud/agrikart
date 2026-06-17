import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useProducts,
  useStockMoves,
  adjustStock,
  lowStock,
  outOfStock,
  nearExpiry,
  type Product,
} from "@/lib/shop-store";
import {
  AlertTriangle,
  PackageX,
  CalendarClock,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminInventory() {
  const products = useProducts();
  const moves = useStockMoves();
  const [open, setOpen] = useState(false);
  const [prodId, setProdId] = useState<string>("");
  const [dir, setDir] = useState<"in" | "out">("in");
  const [qty, setQty] = useState(0);
  const [reason, setReason] = useState("");

  const low = useMemo(() => lowStock(products), [products]);
  const out = useMemo(() => outOfStock(products), [products]);
  const expiring = useMemo(() => nearExpiry(products, 90), [products]);

  const startMove = (p: Product, d: "in" | "out") => {
    setProdId(p.id);
    setDir(d);
    setQty(0);
    setReason(d === "in" ? "Purchase received" : "Damaged / lost");
    setOpen(true);
  };
  const submit = () => {
    if (qty <= 0) return toast.error("Quantity must be > 0");
    adjustStock(prodId, dir === "in" ? qty : -qty, `${dir === "in" ? "IN" : "OUT"}: ${reason}`);
    toast.success(`Stock ${dir === "in" ? "added" : "removed"}`);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        <p className="mt-1 text-sm text-muted-foreground">Stock levels, alerts and movement log.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Alert
          tone="text-destructive bg-destructive/10"
          Icon={PackageX}
          label="Out of stock"
          value={out.length}
        />
        <Alert
          tone="text-[oklch(0.55_0.16_75)] bg-[oklch(0.95_0.06_75)]"
          Icon={AlertTriangle}
          label="Low stock"
          value={low.length}
        />
        <Alert
          tone="text-[oklch(0.50_0.18_25)] bg-[oklch(0.95_0.05_25)]"
          Icon={CalendarClock}
          label="Expiring < 90 days"
          value={expiring.length}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="border-b p-4">
            <h2 className="text-base font-semibold">Stock levels</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Reorder â‰¤</th>
                  <th className="px-4 py-3">Expiry</th>
                  <th className="px-4 py-3">Alert</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((p) => {
                  const isOut = p.stock === 0;
                  const isLow = !isOut && p.stock <= p.reorderLevel;
                  const isExp = new Date(p.expiryDate).getTime() <= Date.now() + 90 * 86400000;
                  return (
                    <tr key={p.id}>
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3">{p.stock}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.reorderLevel}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.expiryDate}</td>
                      <td className="px-4 py-3 space-x-1">
                        {isOut && <Badge variant="destructive">Out</Badge>}
                        {isLow && (
                          <Badge className="bg-[oklch(0.70_0.16_75)] text-white hover:bg-[oklch(0.70_0.16_75)]">
                            Low
                          </Badge>
                        )}
                        {isExp && (
                          <Badge variant="outline" className="border-destructive text-destructive">
                            Expiring
                          </Badge>
                        )}
                        {!isOut && !isLow && !isExp && (
                          <span className="text-xs text-muted-foreground">OK</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" onClick={() => startMove(p, "in")}>
                          <ArrowUpCircle className="h-4 w-4 text-primary" /> In
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => startMove(p, "out")}>
                          <ArrowDownCircle className="h-4 w-4 text-destructive" /> Out
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="border-b p-4">
            <h2 className="text-base font-semibold">Recent stock movements</h2>
          </div>
          {moves.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No stock movements yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Change</th>
                    <th className="px-4 py-3">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {moves.slice(0, 50).map((m) => (
                    <tr key={m.id}>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(m.ts).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">{m.productName}</td>
                      <td
                        className={`px-4 py-3 font-medium ${m.delta >= 0 ? "text-primary" : "text-destructive"}`}
                      >
                        {m.delta >= 0 ? "+" : ""}
                        {m.delta}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{m.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dir === "in" ? "Stock In" : "Stock Out"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Product</Label>
              <Select value={prodId} onValueChange={setProdId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} (stock: {p.stock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Quantity</Label>
              <Input type="number" value={qty} onChange={(e) => setQty(+e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Reason</Label>
              <Input value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Alert({
  tone,
  Icon,
  label,
  value,
}: {
  tone: string;
  Icon: typeof AlertTriangle;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-5">
        <div className={`grid h-10 w-10 place-items-center rounded-lg ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
