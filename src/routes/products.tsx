import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES, useProducts, fmt, type Category } from "@/lib/shop-store";
import { Search, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Agri Products — Pesticides, Fertilizers, Seeds & Tools | AgriKart" },
      { name: "description", content: "Browse certified pesticides, fertilizers, hybrid seeds, farming tools and crop protection products with batch and expiry transparency." },
      { property: "og:title", content: "Agri Products | AgriKart" },
      { property: "og:description", content: "Certified agri-inputs with batch, expiry and licence details. Doorstep delivery across Telangana & AP." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const products = useProducts();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "All">("All");

  const filtered = useMemo(() => products.filter(p =>
    p.status === "Active" &&
    (cat === "All" || p.category === cat) &&
    (q.trim() === "" || (p.name + " " + p.brand + " " + p.cropTags.join(" ")).toLowerCase().includes(q.toLowerCase()))
  ), [products, q, cat]);

  return (
    <>
      <PageHeader eyebrow="Shop" title="Agri Products" subtitle="Certified pesticides, fertilizers, seeds, tools and crop protection — with full batch & expiry transparency." />
      <section className="container mx-auto px-4 py-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, brands, crops…" className="pl-9" />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["All", ...CATEGORIES] as const).map(c => (
              <button key={c} onClick={() => setCat(c as Category | "All")}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="py-24 text-center text-sm text-muted-foreground">No products match your search.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(p => {
              const price = p.discountPrice ?? p.price;
              return (
                <Card key={p.id} className="group overflow-hidden transition hover:shadow-lg">
                  <Link to="/products/$slug" params={{ slug: p.slug }} className="block">
                    <div className="grid aspect-square place-items-center bg-gradient-to-br from-muted to-background text-7xl">{p.image}</div>
                    <CardContent className="p-4">
                      <Badge variant="secondary" className="mb-2 text-[10px]">{p.category}</Badge>
                      <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold group-hover:text-primary">{p.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{p.brand}</p>
                      <div className="mt-3 flex items-end justify-between">
                        <div>
                          <p className="text-lg font-bold text-primary">{fmt(price)}</p>
                          {p.discountPrice && <p className="text-xs text-muted-foreground line-through">{fmt(p.price)}</p>}
                        </div>
                        {p.stock === 0 ? <Badge variant="destructive">Out of stock</Badge>
                          : p.stock <= p.reorderLevel ? <Badge className="bg-amber-500 text-white hover:bg-amber-500">Low stock</Badge>
                          : <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">In stock</Badge>}
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-12 rounded-2xl border bg-muted/30 p-6 text-center">
          <ShoppingBag className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-3 text-lg font-semibold">Login as a farmer to place orders</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to add to cart, place orders, track delivery and download invoices.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Button asChild variant="outline"><Link to="/login">Login</Link></Button>
            <Button asChild><Link to="/signup">Farmer Registration</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
