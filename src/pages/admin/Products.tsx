import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  upsertProduct,
  deleteProduct,
  CATEGORIES,
  fmt,
  type Product,
  type Category,
} from "@/lib/shop-store";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { toast } from "sonner";

type Form = Omit<Product, "id" | "slug"> & { id?: string };
const empty: Form = {
  name: "",
  category: "Pesticides",
  brand: "",
  manufacturer: "",
  price: 0,
  stock: 0,
  reorderLevel: 10,
  batchNumber: "",
  expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
  license: "",
  description: "",
  usage: "",
  safety: "",
  image: "ðŸ§ª",
  status: "Active",
  supplier: "",
  cropTags: [],
};

export default function AdminProducts() {
  const products = useProducts();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "All">("All");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(empty);

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (cat === "All" || p.category === cat) &&
          (q === "" || (p.name + p.brand + p.batchNumber).toLowerCase().includes(q.toLowerCase())),
      ),
    [products, q, cat],
  );

  const startNew = () => {
    setForm(empty);
    setOpen(true);
  };
  const startEdit = (p: Product) => {
    setForm({ ...p });
    setOpen(true);
  };
  const save = () => {
    if (!form.name.trim() || form.price <= 0) return toast.error("Name and price are required");
    upsertProduct(form);
    toast.success(form.id ? "Product updated" : "Product added");
    setOpen(false);
  };
  const remove = (p: Product) => {
    if (!confirm(`Delete ${p.name}?`)) return;
    deleteProduct(p.id);
    toast.success("Product deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">{products.length} items in catalog</p>
        </div>
        <Button onClick={startNew}>
          <Plus className="h-4 w-4" /> Add product
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search name, brand, batch…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <Select value={cat} onValueChange={(v) => setCat(v as Category | "All")}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Expiry</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((p) => {
                  const low = p.stock > 0 && p.stock <= p.reorderLevel;
                  const out = p.stock === 0;
                  return (
                    <tr key={p.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 place-items-center rounded-md bg-muted text-lg">
                            {p.image}
                          </span>
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {p.brand} · {p.batchNumber}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                      <td className="px-4 py-3 font-medium">{fmt(p.discountPrice ?? p.price)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            out
                              ? "text-destructive font-medium"
                              : low
                                ? "text-[oklch(0.55_0.16_75)] font-medium"
                                : ""
                          }
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.expiryDate}</td>
                      <td className="px-4 py-3">
                        <Badge variant={p.status === "Active" ? "default" : "secondary"}>
                          {p.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" onClick={() => startEdit(p)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => remove(p)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No products match.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit product" : "Add product"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name" className="sm:col-span-2">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
            <Field label="Category">
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v as Category })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Status">
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as Product["status"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Brand">
              <Input
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              />
            </Field>
            <Field label="Manufacturer">
              <Input
                value={form.manufacturer}
                onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
              />
            </Field>
            <Field label="Price (₹)">
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: +e.target.value })}
              />
            </Field>
            <Field label="Discount Price (₹)">
              <Input
                type="number"
                value={form.discountPrice ?? ""}
                onChange={(e) =>
                  setForm({ ...form, discountPrice: e.target.value ? +e.target.value : undefined })
                }
              />
            </Field>
            <Field label="Stock">
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: +e.target.value })}
              />
            </Field>
            <Field label="Reorder Level">
              <Input
                type="number"
                value={form.reorderLevel}
                onChange={(e) => setForm({ ...form, reorderLevel: +e.target.value })}
              />
            </Field>
            <Field label="Batch Number">
              <Input
                value={form.batchNumber}
                onChange={(e) => setForm({ ...form, batchNumber: e.target.value })}
              />
            </Field>
            <Field label="Expiry Date">
              <Input
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              />
            </Field>
            <Field label="License">
              <Input
                value={form.license}
                onChange={(e) => setForm({ ...form, license: e.target.value })}
              />
            </Field>
            <Field label="Supplier">
              <Input
                value={form.supplier}
                onChange={(e) => setForm({ ...form, supplier: e.target.value })}
              />
            </Field>
            <Field label="Image (emoji or URL)">
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </Field>
            <Field label="Crop Tags (comma separated)" className="sm:col-span-2">
              <Input
                value={form.cropTags.join(", ")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    cropTags: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <Textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>
            <Field label="Usage Instructions" className="sm:col-span-2">
              <Textarea
                rows={2}
                value={form.usage}
                onChange={(e) => setForm({ ...form, usage: e.target.value })}
              />
            </Field>
            <Field label="Safety Precautions" className="sm:col-span-2">
              <Textarea
                rows={2}
                value={form.safety}
                onChange={(e) => setForm({ ...form, safety: e.target.value })}
              />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>{form.id ? "Save changes" : "Add product"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
