import { Link, useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { addToCart, getProductBySlug, fmt } from "@/lib/shop-store";
import { useCurrentUser } from "@/lib/auth-store";
import { ShoppingCart, ShieldAlert, Calendar, Hash, Factory, FileBadge2, Phone } from "lucide-react";
import { toast } from "sonner";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const p = getProductBySlug(slug ?? "");

  if (!p) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Button asChild className="mt-4"><Link to="/products">Back to products</Link></Button>
      </div>
    );
  }

  const price = p.discountPrice ?? p.price;

  const handleAdd = () => {
    if (!user) { toast.info("Please login as a farmer to place orders"); navigate("/login"); return; }
    addToCart(user.id, p.id, 1);
    toast.success(`Added ${p.name} to cart`);
  };

  return (
    <>
      <PageHeader eyebrow={p.category} title={p.name} subtitle={`${p.brand} · ${p.manufacturer}`} />
      <section className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[1fr_1.2fr]">
        <Card><CardContent className="p-0">
          <div className="grid aspect-square place-items-center bg-gradient-to-br from-muted to-background text-[12rem]">{p.image}</div>
        </CardContent></Card>

        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{p.category}</Badge>
            {p.stock === 0
              ? <Badge variant="destructive">Out of stock</Badge>
              : p.stock <= p.reorderLevel
              ? <Badge className="bg-amber-500 text-white hover:bg-amber-500">Low stock ({p.stock} left)</Badge>
              : <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">In stock</Badge>}
          </div>

          <div className="flex items-end gap-3">
            <p className="text-4xl font-bold text-primary">{fmt(price)}</p>
            {p.discountPrice && <p className="text-lg text-muted-foreground line-through">{fmt(p.price)}</p>}
            <p className="text-sm text-muted-foreground">incl. of all taxes</p>
          </div>

          <p className="text-sm leading-relaxed text-foreground/85">{p.description}</p>

          <div className="grid gap-2 rounded-lg border bg-muted/30 p-4 text-sm sm:grid-cols-2">
            <Detail Icon={Hash} label="Batch No." value={p.batchNumber} />
            <Detail Icon={Calendar} label="Expiry" value={new Date(p.expiryDate).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })} />
            <Detail Icon={Factory} label="Manufacturer" value={p.manufacturer} />
            <Detail Icon={FileBadge2} label="Licence" value={p.license} />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="lg" onClick={handleAdd} disabled={p.stock === 0}>
              <ShoppingCart className="h-4 w-4" /> {p.stock === 0 ? "Out of stock" : "Add to cart"}
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="tel:+919876543210"><Phone className="h-4 w-4" /> Enquire by call</a>
            </Button>
          </div>

          <Card><CardContent className="space-y-3 p-4 text-sm">
            <h3 className="font-semibold">Usage instructions</h3>
            <p className="text-foreground/80">{p.usage}</p>
          </CardContent></Card>

          <Card className="border-destructive/30 bg-destructive/5"><CardContent className="space-y-2 p-4 text-sm">
            <h3 className="flex items-center gap-2 font-semibold text-destructive"><ShieldAlert className="h-4 w-4" /> Safety precautions</h3>
            <p className="text-foreground/85">{p.safety}</p>
            <p className="text-xs text-muted-foreground">Pesticides & agrochemicals must be handled by trained adults only. Keep out of reach of children and animals.</p>
          </CardContent></Card>
        </div>
      </section>
    </>
  );
}

function Detail({ Icon, label, value }: { Icon: typeof Hash; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
      <div>
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
