import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES, useProducts, fmt, type Category } from "@/lib/shop-store";
import {
  Search,
  Heart,
  ChevronLeft,
  Layers,
  Bug,
  Beaker,
  Wrench,
  Leaf,
  FlaskConical,
  Stethoscope,
  Sparkles,
  Atom,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

const CATEGORY_ICONS: Record<Category | "All", typeof Layers> = {
  All: Layers,
  Pesticides: Bug,
  Fertilisers: Beaker,
  Implements: Wrench,
  Organic: Leaf,
  "Speciality Nutrients": FlaskConical,
  Veterinary: Stethoscope,
  Seeds: Sparkles,
  Nano: Atom,
};

const TILE_ORDER: Array<Category | "All"> = [
  "All",
  "Pesticides",
  "Fertilisers",
  "Implements",
  "Organic",
  "Speciality Nutrients",
  "Veterinary",
  "Seeds",
  "Nano",
];

const CATEGORY_I18N: Record<Category | "All", string> = {
  All: "nav.categories.shopAll",
  Pesticides: "nav.categories.pesticides",
  Fertilisers: "nav.categories.fertilisers",
  Implements: "nav.categories.implements",
  Organic: "nav.categories.organic",
  "Speciality Nutrients": "nav.categories.specialty",
  Veterinary: "nav.categories.veterinary",
  Seeds: "nav.categories.seeds",
  Nano: "nav.categories.nano",
};

export default function Products() {
  const { t } = useTranslation();
  const products = useProducts();
  const [mounted, setMounted] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "All">("All");
  const [sort, setSort] = useState<"featured" | "low" | "high">("featured");

  useEffect(() => setMounted(true), []);

  const filtered = useMemo(() => {
    const list = products.filter(
      (p) =>
        p.status === "Active" &&
        (cat === "All" || p.category === cat) &&
        (q.trim() === "" ||
          (p.name + " " + p.brand + " " + p.cropTags.join(" "))
            .toLowerCase()
            .includes(q.toLowerCase())),
    );
    if (sort === "low")
      list.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
    if (sort === "high")
      list.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
    return list;
  }, [products, q, cat, sort]);

  const activeLabel = cat === "All" ? t("shop.allProducts") : t(CATEGORY_I18N[cat]);

  return (
    <div className="bg-muted/30">
      <section className="border-b bg-gradient-to-b from-emerald-50/60 to-muted/30">
        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-7">
          <Link
            to="/"
            className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-foreground/80 hover:text-primary sm:mb-3 sm:text-sm"
          >
            <ChevronLeft className="h-4 w-4" /> {t("shop.back")}
          </Link>
          <div className="flex gap-2.5 overflow-x-auto pb-1 sm:gap-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {TILE_ORDER.map((key) => {
              const Icon = CATEGORY_ICONS[key];
              const isActive = cat === key;
              return (
                <button
                  key={key}
                  onClick={() => setCat(key)}
                  className="group flex shrink-0 flex-col items-center gap-1.5 sm:gap-2"
                >
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-full border-2 bg-emerald-100/70 text-emerald-800 transition sm:h-20 sm:w-20 ${isActive ? "border-amber-400 shadow-elegant" : "border-primary/70 group-hover:border-primary"}`}
                  >
                    <Icon className="h-5 w-5 sm:h-9 sm:w-9" strokeWidth={1.8} />
                  </span>
                  <span
                    className={`whitespace-nowrap text-[10px] font-semibold sm:text-sm ${isActive ? "text-primary" : "text-foreground/80"}`}
                  >
                    {t(CATEGORY_I18N[key])}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-5 px-3 py-5 sm:px-4 sm:py-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold">{t("shop.filter")}</h2>
            <button
              onClick={() => {
                setCat("All");
                setQ("");
              }}
              className="text-xs font-semibold text-primary hover:underline"
            >
              {t("shop.clearAll")}
            </button>
          </div>
          <Card className="overflow-hidden border-emerald-200/60">
            <div className="bg-emerald-100/60 px-4 py-2.5 text-sm font-bold">
              {t("shop.allCategories")}
            </div>
            <div className="p-3">
              <div className="relative mb-3">
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("shop.searchPlaceholder")}
                  className="h-9 pr-9 text-sm"
                />
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              </div>
              <ul className="space-y-1">
                {CATEGORIES.map((c) => (
                  <li key={c}>
                    <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted">
                      <input
                        type="checkbox"
                        checked={cat === c}
                        onChange={() => setCat(cat === c ? "All" : c)}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        {t(CATEGORY_I18N[c])}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-lg font-bold sm:text-2xl">
              {activeLabel}{" "}
              <span className="font-medium text-muted-foreground">
                {t("shop.totalItems", { count: mounted ? filtered.length : 0 })}
              </span>
            </h1>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="appearance-none rounded-md border bg-background py-2 pl-3 pr-9 text-xs font-semibold sm:text-sm"
              >
                <option value="featured">{t("shop.sortFeatured")}</option>
                <option value="low">{t("shop.sortLow")}</option>
                <option value="high">{t("shop.sortHigh")}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2" />
            </div>
          </div>

          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {(["All", ...CATEGORIES] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCat(c as Category | "All")}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}
              >
                {t(CATEGORY_I18N[c as Category | "All"])}
              </button>
            ))}
          </div>

          {!mounted ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="aspect-[3/4] animate-pulse bg-muted/60" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border bg-card py-20 text-center">
              <p className="text-sm text-muted-foreground">{t("shop.noMatch")}</p>
              <p className="mt-2 text-xs text-muted-foreground">{t("shop.adminManaged")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => {
                const price = p.discountPrice ?? p.price;
                const popular = p.stock > p.reorderLevel * 3;
                return (
                  <Card
                    key={p.id}
                    className="group relative flex flex-col overflow-hidden rounded-xl border-border/60 bg-white shadow-sm transition hover:shadow-lg"
                  >
                    {popular && (
                      <span className="absolute left-2 top-2 z-10 rounded-md bg-sky-100 px-1.5 py-0.5 text-[9px] font-bold text-sky-700 sm:left-3 sm:top-3 sm:px-2 sm:text-[10px]">
                        {t("shop.popular")}
                      </span>
                    )}
                    <button
                      aria-label="Wishlist"
                      className="absolute right-2 top-2 z-10 grid h-6 w-6 place-items-center rounded-full bg-white/80 text-muted-foreground hover:text-rose-500 sm:right-3 sm:top-3 sm:h-7 sm:w-7"
                    >
                      <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                    <Link to={`/products/${p.slug}`} className="block">
                      <div className="m-1.5 grid aspect-square place-items-center rounded-lg bg-emerald-50 text-4xl sm:m-3 sm:text-7xl">
                        {p.image}
                      </div>
                    </Link>
                    <div className="flex flex-1 flex-col px-2.5 pb-2.5 sm:px-4 sm:pb-4">
                      <Link to={`/products/${p.slug}`}>
                        <h3 className="line-clamp-2 min-h-[32px] text-[11px] font-bold uppercase tracking-wide text-foreground group-hover:text-primary sm:min-h-[36px] sm:text-sm">
                          {p.name}
                        </h3>
                      </Link>
                      <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-[11px]">
                        {p.brand}
                      </p>
                      <p className="mt-1 text-sm font-extrabold sm:mt-2 sm:text-lg">{fmt(price)}</p>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="mt-1.5 h-8 w-full gap-1 border-primary/40 px-2 text-[11px] font-semibold text-primary hover:bg-primary hover:text-primary-foreground sm:mt-2 sm:h-9 sm:text-sm"
                      >
                        <Link to={`/products/${p.slug}`}>
                          {t("shop.viewDetails")}{" "}
                          <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </Link>
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
