import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES, useProducts, fmt, type Category } from "@/lib/shop-store";
import {
  Search, Heart, ChevronLeft, Layers, Bug, Beaker, Wrench, Leaf, FlaskConical,
  Stethoscope, Sparkles, Atom, ChevronDown,
} from "lucide-react";

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

const CATEGORY_TILES = [
  { key: "All", label: "All", Icon: Layers },
  { key: "Pesticides", label: "Pesticides", Icon: Bug },
  { key: "Fertilizers", label: "Fertilisers", Icon: Beaker },
  { key: "Farming Tools", label: "Implements", Icon: Wrench },
  { key: "Crop Protection", label: "Organic", Icon: Leaf },
  { key: "Seeds", label: "Specialty", Icon: FlaskConical },
  { key: "Pesticides", label: "Veterinary", Icon: Stethoscope, alias: true },
  { key: "Seeds", label: "Seeds", Icon: Sparkles },
  { key: "Fertilizers", label: "Nano", Icon: Atom, alias: true },
] as const;

function ProductsPage() {
  const products = useProducts();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "All">("All");
  const [sort, setSort] = useState<"featured" | "low" | "high">("featured");

  const filtered = useMemo(() => {
    const list = products.filter(p =>
      p.status === "Active" &&
      (cat === "All" || p.category === cat) &&
      (q.trim() === "" || (p.name + " " + p.brand + " " + p.cropTags.join(" ")).toLowerCase().includes(q.toLowerCase()))
    );
    if (sort === "low") list.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
    if (sort === "high") list.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
    return list;
  }, [products, q, cat, sort]);

  const activeLabel = cat === "All" ? "All Products" : cat;

  return (
    <div className="bg-muted/30">
      {/* Category circles strip */}
      <section className="border-b bg-gradient-to-b from-emerald-50/60 to-muted/30">
        <div className="container mx-auto px-3 py-5 sm:px-4 sm:py-7">
          <Link to="/" className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-foreground/80 hover:text-primary">
            <ChevronLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex gap-3 overflow-x-auto pb-1 sm:gap-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORY_TILES.map(({ key, label, Icon }, i) => {
              const isActive = cat === key && activeLabel.toLowerCase().includes(label.toLowerCase().slice(0, 4));
              return (
                <button
                  key={`${key}-${i}`}
                  onClick={() => setCat(key as Category | "All")}
                  className="group flex shrink-0 flex-col items-center gap-2"
                >
                  <span
                    className={`grid h-16 w-16 place-items-center rounded-full border-2 bg-emerald-100/70 text-emerald-800 transition sm:h-20 sm:w-20 ${
                      isActive ? "border-amber-400 shadow-elegant" : "border-primary/70 group-hover:border-primary"
                    }`}
                  >
                    <Icon className="h-7 w-7 sm:h-9 sm:w-9" strokeWidth={1.8} />
                  </span>
                  <span className={`text-[11px] font-semibold sm:text-sm ${isActive ? "text-primary" : "text-foreground/80"}`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-5 px-3 py-5 sm:px-4 sm:py-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold">Filter</h2>
            <button onClick={() => { setCat("All"); setQ(""); }} className="text-xs font-semibold text-primary hover:underline">
              Clear All
            </button>
          </div>
          <Card className="overflow-hidden border-emerald-200/60">
            <div className="bg-emerald-100/60 px-4 py-2.5 text-sm font-bold">Categories</div>
            <div className="p-3">
              <div className="relative mb-3">
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Product" className="h-9 pr-9 text-sm" />
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              </div>
              <ul className="space-y-1">
                {CATEGORIES.map(c => (
                  <li key={c}>
                    <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted">
                      <input
                        type="checkbox"
                        checked={cat === c}
                        onChange={() => setCat(cat === c ? "All" : c)}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="font-semibold uppercase tracking-wide text-xs">{c}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </aside>

        {/* Grid */}
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-lg font-bold sm:text-2xl">
              {activeLabel} <span className="text-muted-foreground font-medium">Total {filtered.length} Item(s)</span>
            </h1>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="appearance-none rounded-md border bg-background pl-3 pr-9 py-2 text-xs font-semibold sm:text-sm"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2" />
            </div>
          </div>

          {/* Mobile filter chips */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {(["All", ...CATEGORIES] as const).map(c => (
              <button
                key={c}
                onClick={() => setCat(c as Category | "All")}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="py-24 text-center text-sm text-muted-foreground">No products match your search.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map(p => {
                const price = p.discountPrice ?? p.price;
                const popular = p.stock > p.reorderLevel * 3;
                return (
                  <Card key={p.id} className="group relative flex flex-col overflow-hidden rounded-xl border-border/60 bg-white shadow-sm transition hover:shadow-lg">
                    {popular && (
                      <span className="absolute left-3 top-3 z-10 rounded-md bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-700">
                        Popular
                      </span>
                    )}
                    <button aria-label="Wishlist" className="absolute right-3 top-3 z-10 grid h-7 w-7 place-items-center rounded-full bg-white/80 text-muted-foreground hover:text-rose-500">
                      <Heart className="h-4 w-4" />
                    </button>

                    <Link to="/products/$slug" params={{ slug: p.slug }} className="block">
                      <div className="m-2 grid aspect-square place-items-center rounded-lg bg-emerald-50 text-5xl sm:m-3 sm:text-7xl">
                        {p.image}
                      </div>
                    </Link>

                    <div className="flex flex-1 flex-col px-3 pb-3 sm:px-4 sm:pb-4">
                      <Link to="/products/$slug" params={{ slug: p.slug }}>
                        <h3 className="line-clamp-2 min-h-[36px] text-xs font-bold uppercase tracking-wide text-foreground group-hover:text-primary sm:text-sm">
                          {p.name}
                        </h3>
                      </Link>
                      <div className="relative mt-2">
                        <select className="w-full appearance-none rounded-md border bg-background px-2.5 py-1.5 text-xs font-semibold sm:text-sm">
                          <option>1 Unit</option>
                          <option>5 Units</option>
                          <option>10 Units</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
                      </div>
                      <p className="mt-2 text-base font-extrabold sm:text-lg">{fmt(price)}</p>
                      <Button
                        size="sm"
                        className="mt-2 w-full bg-amber-400 font-bold text-foreground hover:bg-amber-500"
                        disabled={p.stock === 0}
                      >
                        {p.stock === 0 ? "Out of stock" : "Add to Cart"}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
