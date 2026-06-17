import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Crown,
  Sprout,
  ShieldCheck,
  Users,
  Headset,
  Star,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Plan = {
  id: "basic" | "premium";
  name: string;
  tagline: string;
  priceYear: number;
  joiningFee?: number;
  priceNote?: string;
  badge?: string;
  highlight?: boolean;
  cta: string;
  Icon: typeof Sprout;
  features: string[];
};

const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic Plan",
    tagline: "Everything a farmer needs to get started.",
    priceYear: 1499,
    cta: "Join Basic Plan",
    Icon: Sprout,
    features: [
      "Crop Loan Assistance",
      "Crop Insurance Support",
      "Government Scheme Updates",
      "Seeds, pesticides & Fertilizers Discounts",
      "Market Price Updates",
      "Agriculture Advisory Support",
      "Priority Customer Support",
      "Doorstep Executive Service",
      "Digital Farmer Membership ID",
      "Training & Awareness Programs",
      "WhatsApp Farmer Support Group Access",
    ],
  },
  {
    id: "premium",
    name: "Premium Plan",
    tagline: "Full-service membership with a dedicated executive.",
    priceYear: 4999,
    badge: "Most Popular",
    highlight: true,
    cta: "Join Premium Plan",
    Icon: Crown,
    features: [
      "Priority Crop Loan Assistance",
      "Fast-track Processing Support",
      "Crop & Accident Insurance Guidance",
      "Premium Agriculture Advisory",
      "Seeds, Fertilizers & Pesticides Discounts",
      "Daily Market Intelligence Updates",
      "Dedicated Relationship Executive",
      "Doorstep Farmer Services",
      "Digital Farmer Business Profile",
      "Exclusive Training Programs",
      "Dairy/Poultry/Tractor Finance Guidance",
      "VIP Member Benefits & Priority Support",
    ],
  },
];

const TRUST = [
  { Icon: Users, label: "Trusted by Farmers" },
  { Icon: Headset, label: "Dedicated Support" },
  { Icon: ShieldCheck, label: "Secure Membership" },
  { Icon: Star, label: "Rated 4.8 / 5" },
];

type Cycle = "year" | "month";

export default function Membership() {
  const selectedPlan = PLANS.find((p) => p.highlight)!;

  return (
    <>
      <PageHeader
        eyebrow="Memberships"
        title="Membership Plans"
        subtitle="Choose the right membership and unlock exclusive financial, agricultural, and advisory benefits designed for farmers."
      />

      <section className="container mx-auto px-4 py-10 sm:py-14">
        {/* Pricing cards */}
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 md:gap-8">
          {PLANS.map((plan, idx) => {
            const price = plan.priceYear;
            const suffix = "/ year";
            const { Icon } = plan;
            return (
              <Card
                key={plan.id}
                className={cn(
                  "card-lift relative overflow-hidden border-border/70 animate-fade-up",
                  plan.highlight &&
                    "border-primary/60 shadow-glow ring-1 ring-primary/30 md:scale-[1.02]",
                )}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {plan.highlight && <div className="absolute inset-x-0 top-0 h-1 bg-cta-gradient" />}
                {plan.badge && (
                  <Badge className="absolute right-4 top-4 gap-1 bg-cta-gradient text-primary-foreground shadow">
                    <Sparkles className="h-3 w-3" />
                    {plan.badge}
                  </Badge>
                )}

                <CardContent className="p-6 sm:p-8">
                  <div
                    className={cn(
                      "mb-5 grid h-12 w-12 place-items-center rounded-xl",
                      plan.highlight
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-bold sm:text-2xl">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>

                  <div className="mt-5 flex items-end gap-2">
                    <span className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    <span className="mb-2 text-sm text-muted-foreground">{suffix}</span>
                  </div>
                  {plan.priceNote && (
                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                      {plan.priceNote}
                    </p>
                  )}

                  <Button
                    asChild
                    size="lg"
                    variant={plan.highlight ? "default" : "outline"}
                    className={cn("mt-6 w-full gap-2", plan.highlight && "shadow-elegant")}
                  >
                    <Link to="/apply">
                      {plan.cta} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  <ul className="mt-7 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <span
                          className={cn(
                            "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full",
                            plan.highlight
                              ? "bg-primary text-primary-foreground"
                              : "bg-primary/10 text-primary",
                          )}
                        >
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        <span className="text-foreground/85">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Comparison table */}
        <div className="mx-auto mt-14 max-w-5xl">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Compare plans</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            A side-by-side look at every benefit included with each membership.
          </p>

          <div className="mt-6 overflow-hidden rounded-xl border border-border/70 bg-card shadow-elegant">
            <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-2 bg-muted/60 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-6 sm:text-sm">
              <div>Benefit</div>
              <div className="text-center">Basic</div>
              <div className="text-center text-primary">Premium Plan</div>
            </div>
            {comparisonRows.map((row, i) => (
              <div
                key={row.label}
                className={cn(
                  "grid grid-cols-[1.5fr_1fr_1fr] gap-2 px-4 py-3 text-sm sm:px-6",
                  i % 2 === 1 && "bg-muted/30",
                )}
              >
                <div className="font-medium text-foreground/90">{row.label}</div>
                <div className="text-center text-muted-foreground">{renderCell(row.basic)}</div>
                <div className="text-center font-semibold text-primary">
                  {renderCell(row.premium)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
          {TRUST.map(({ Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 shadow-sm"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold">{label}</span>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-2xl bg-cta-gradient p-8 text-center text-primary-foreground shadow-glow sm:p-12">
          <h2 className="text-2xl font-bold sm:text-4xl">
            Empowering Farmers with Financial & Agricultural Support
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm opacity-90 sm:text-base">
            Join thousands of farmers who trust AgriKart for credit, insurance, advisory and
            doorstep support — all under one membership.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="mt-6 gap-2 font-semibold shadow-elegant"
          >
            <Link to="/apply">
              Become a Member Today <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div className="sticky bottom-0 z-30 border-t border-border bg-background/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)] backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-[11px] font-semibold uppercase text-muted-foreground">
              {selectedPlan.name}
            </div>
            <div className="text-lg font-bold leading-none">
              ₹{selectedPlan.priceYear.toLocaleString("en-IN")}
              <span className="ml-1 text-xs font-normal text-muted-foreground">/yr</span>
            </div>
          </div>
          <Button asChild size="lg" className="flex-1 gap-2 shadow-elegant">
            <Link to="/apply">
              Join Now <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}

type Cell = boolean | string;
const comparisonRows: { label: string; basic: Cell; premium: Cell }[] = [
  { label: "Crop Loan Assistance", basic: "Standard", premium: "Priority" },
  { label: "Insurance Guidance", basic: "Crop", premium: "Crop + Accident" },
  { label: "Agriculture Advisory", basic: true, premium: "Premium" },
  { label: "Market Price Updates", basic: "Weekly", premium: "Daily" },
  { label: "Relationship Executive", basic: false, premium: "Dedicated" },
  { label: "Doorstep Services", basic: true, premium: true },
  { label: "Digital Farmer ID / Profile", basic: "Membership ID", premium: "Business Profile" },
  { label: "Training Programs", basic: true, premium: "Exclusive" },
  { label: "Dairy / Poultry / Tractor Finance", basic: false, premium: true },
  { label: "VIP Priority Support", basic: false, premium: true },
];

function renderCell(v: Cell) {
  if (v === true) return <Check className="mx-auto h-4 w-4" strokeWidth={3} />;
  if (v === false) return <span className="text-muted-foreground/50">—</span>;
  return v;
}
