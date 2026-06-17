import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  findCustomerByCode,
  isFarmerVerified,
  recordPayment,
  useCurrentStaff,
  type Customer,
} from "@/lib/staff-store";
import { useProducts, placeOrder, fmt, type Address, type PaymentMode } from "@/lib/shop-store";
import { Search, Plus, Minus, Trash2, ShieldCheck, ShieldAlert, ShoppingCart } from "lucide-react";

type Line = { productId: string; qty: number };
type PayChoice = "COD" | "Cash" | "UPI" | "Card" | "NetBanking";

export default function PlaceOrder() {
  const staff = useCurrentStaff();
  const navigate = useNavigate();
  const products = useProducts();

  const [code, setCode] = useState("");
  const [farmer, setFarmer] = useState<Customer | null>(null);
  const [lookupErr, setLookupErr] = useState("");

  const [lines, setLines] = useState<Line[]>([]);
  const [pickId, setPickId] = useState("");
  const [pay, setPay] = useState<PayChoice>("Cash");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const verified = isFarmerVerified(farmer);

  const productMap = useMemo(() => {
    const m = new Map(products.map((p) => [p.id, p]));
    return m;
  }, [products]);

  const orderLines = useMemo(
    () =>
      lines
        .map((l) => {
          const p = productMap.get(l.productId);
          if (!p) return null;
          const price = p.discountPrice ?? p.price;
          return { productId: p.id, name: p.name, price, qty: l.qty, stock: p.stock };
        })
        .filter(Boolean) as {
        productId: string;
        name: string;
        price: number;
        qty: number;
        stock: number;
      }[],
    [lines, productMap],
  );

  const subtotal = orderLines.reduce((s, l) => s + l.price * l.qty, 0);

  function lookup() {
    setLookupErr("");
    const c = findCustomerByCode(code);
    if (!c) {
      setFarmer(null);
      setLookupErr("No farmer found with that ID.");
      return;
    }
    setFarmer(c);
  }

  function addLine() {
    if (!pickId) return;
    setLines((prev) => {
      const i = prev.findIndex((l) => l.productId === pickId);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + 1 };
        return next;
      }
      return [...prev, { productId: pickId, qty: 1 }];
    });
    setPickId("");
  }

  function setQty(id: string, qty: number) {
    setLines((prev) => prev.map((l) => (l.productId === id ? { ...l, qty: Math.max(1, qty) } : l)));
  }
  function remove(id: string) {
    setLines((prev) => prev.filter((l) => l.productId !== id));
  }

  async function submit() {
    if (!staff) return;
    if (!farmer) {
      toast.error("Look up a farmer first");
      return;
    }
    if (!verified) {
      toast.error("Farmer is not verified. Admin must approve KYC documents first.");
      return;
    }
    if (orderLines.length === 0) {
      toast.error("Add at least one product");
      return;
    }
    for (const l of orderLines) {
      if (l.qty > l.stock) {
        toast.error(`Only ${l.stock} in stock for ${l.name}`);
        return;
      }
    }
    if ((pay === "UPI" || pay === "Card" || pay === "NetBanking") && !reference.trim()) {
      toast.error("Enter the payment reference / transaction ID");
      return;
    }

    setSubmitting(true);
    try {
      const address: Address = {
        id: "addr-" + farmer.id.slice(0, 6),
        userId: farmer.farmerCode,
        label: "Farm",
        name: farmer.farmerName,
        mobile: farmer.mobile,
        line1: `Farmer ID ${farmer.farmerCode}`,
        village: farmer.village,
        mandal: farmer.district,
        district: farmer.district,
        pincode: "",
        isDefault: true,
      };

      const paymentMode: PaymentMode = pay === "COD" ? "COD" : "Online";
      const order = placeOrder({
        userId: farmer.farmerCode,
        userName: farmer.farmerName,
        mobile: farmer.mobile,
        address,
        lines: orderLines.map((l) => ({
          productId: l.productId,
          name: l.name,
          price: l.price,
          qty: l.qty,
        })),
        paymentMode,
      });

      if (pay !== "COD") {
        const txn = recordPayment({
          farmerId: farmer.farmerCode,
          farmerName: farmer.farmerName,
          mobile: farmer.mobile,
          kind: "renewal",
          amount: order.total,
          method: pay as "Cash" | "UPI" | "Card" | "NetBanking",
          reference: reference.trim() || undefined,
          note: note.trim() || undefined,
          collectedById: staff.id,
          collectedByName: staff.name,
        });
        toast.success(`Order ${order.id} placed · ${fmt(order.total)} via ${pay} · ${txn.id}`);
      } else {
        toast.success(`Order ${order.id} placed · ${fmt(order.total)} · Cash on Delivery`);
      }
      navigate(`/staff/customers/${farmer.id}`);
    } catch (e) {
      toast.error((e as Error).message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Place Order</h1>
        <p className="text-sm text-muted-foreground">
          Place an order on behalf of a verified farmer.
        </p>
      </div>

      {/* Step 1: farmer lookup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">1. Farmer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="code">Farmer ID</Label>
              <Input
                id="code"
                placeholder="e.g. AGFC0001"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    lookup();
                  }
                }}
              />
            </div>
            <Button type="button" onClick={lookup}>
              <Search className="mr-2 h-4 w-4" />
              Look up
            </Button>
          </div>
          {lookupErr && <p className="text-sm text-destructive">{lookupErr}</p>}

          {farmer && (
            <div className="rounded-md border border-border bg-muted/30 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {farmer.farmerName}
                    <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-mono font-bold text-primary">
                      {farmer.farmerCode}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {farmer.village}, {farmer.district} · {farmer.mobile}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Land: {farmer.landSize} · Crops: {farmer.crops}
                  </p>
                </div>
                {verified ? (
                  <Badge className="bg-emerald-600 hover:bg-emerald-600">
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <ShieldAlert className="mr-1 h-3 w-3" />
                    Not verified
                  </Badge>
                )}
              </div>
              {!verified && (
                <p className="mt-2 text-xs text-destructive">
                  Status: <b>{farmer.status}</b>. Orders can only be placed for farmers whose KYC
                  documents (Aadhaar, PAN, Land) have been approved by an admin.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 2: products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">2. Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[220px]">
              <Label>Add product</Label>
              <Select value={pickId} onValueChange={setPickId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {products
                    .filter((p) => p.status === "Active")
                    .map((p) => (
                      <SelectItem key={p.id} value={p.id} disabled={p.stock === 0}>
                        {p.name} · {fmt(p.discountPrice ?? p.price)}{" "}
                        {p.stock === 0 ? "(Out of stock)" : `· stock ${p.stock}`}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="button" onClick={addLine} disabled={!pickId}>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>

          {orderLines.length === 0 ? (
            <p className="text-sm text-muted-foreground">No items added.</p>
          ) : (
            <div className="divide-y divide-border rounded-md border border-border">
              {orderLines.map((l) => (
                <div key={l.productId} className="flex flex-wrap items-center gap-3 p-3">
                  <div className="flex-1 min-w-[180px]">
                    <p className="text-sm font-medium">{l.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {fmt(l.price)} · stock {l.stock}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => setQty(l.productId, l.qty - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      className="h-8 w-14 text-center"
                      value={l.qty}
                      onChange={(e) =>
                        setQty(l.productId, Math.max(1, parseInt(e.target.value || "1", 10)))
                      }
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => setQty(l.productId, l.qty + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="w-24 text-right text-sm font-semibold">
                    {fmt(l.price * l.qty)}
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive"
                    onClick={() => remove(l.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center justify-between p-3 bg-muted/30">
                <span className="text-sm text-muted-foreground">Subtotal (excl. shipping)</span>
                <span className="text-lg font-bold">{fmt(subtotal)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 3: payment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">3. Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Method</Label>
              <Select value={pay} onValueChange={(v) => setPay(v as PayChoice)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash (collected now)</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="NetBanking">Net Banking</SelectItem>
                  <SelectItem value="COD">Cash on Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {pay !== "COD" && (
              <div>
                <Label>Reference / Txn No.{pay !== "Cash" ? " *" : ""}</Label>
                <Input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder={
                    pay === "UPI"
                      ? "UPI ref id"
                      : pay === "Cash"
                        ? "Receipt no. (optional)"
                        : "Txn id"
                  }
                />
              </div>
            )}
          </div>
          {pay !== "COD" && (
            <div>
              <Label>Note (optional)</Label>
              <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-card p-4">
        <div>
          <p className="text-xs text-muted-foreground">Order total (excl. shipping)</p>
          <p className="text-2xl font-bold">{fmt(subtotal)}</p>
        </div>
        <Button
          size="lg"
          onClick={submit}
          disabled={submitting || !farmer || !verified || orderLines.length === 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {submitting ? "Placing…" : "Place Order"}
        </Button>
      </div>
    </div>
  );
}
