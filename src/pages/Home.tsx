import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Banknote, ShieldCheck, Sprout, Snowflake, Ship, Landmark,
  ArrowRight, CheckCircle2, Truck, Stethoscope, Headphones, PlayCircle, Leaf, Users, SprayCan,
} from "lucide-react";
import imgLoans from "@/assets/service-loans.jpg";
import imgInsurance from "@/assets/service-insurance.jpg";
import imgSeeds from "@/assets/service-seeds.jpg";
import imgCold from "@/assets/service-cold.jpg";
import imgTrade from "@/assets/service-trade.jpg";
import imgSchemes from "@/assets/service-schemes.jpg";

const homeServices = [
  { key: "loans", Icon: Banknote, img: imgLoans },
  { key: "insurance", Icon: ShieldCheck, img: imgInsurance },
  { key: "seeds", Icon: Sprout, img: imgSeeds },
  { key: "cold", Icon: Snowflake, img: imgCold },
  { key: "trade", Icon: Ship, img: imgTrade },
  { key: "schemes", Icon: Landmark, img: imgSchemes },
] as const;

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      {/* Promo banner hero */}
      <section className="container mx-auto px-3 pt-4 sm:px-4 sm:pt-6">
        <div className="relative overflow-hidden rounded-2xl shadow-elegant">
          <div className="relative grid items-center gap-4 bg-[linear-gradient(110deg,#1a1a1a_0%,#2a2a1a_45%,#d4b830_55%,#f0d860_100%)] p-5 sm:gap-6 sm:p-8 md:grid-cols-2 md:p-12">
            <div className="relative z-10 text-white animate-fade-up">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur sm:text-xs">
                <Truck className="h-3 w-3" /> Limited offer
              </span>
              <h1 className="mt-3 text-3xl font-black leading-[0.95] tracking-tight drop-shadow-md sm:text-5xl md:text-6xl">
                FREE DOOR<br />DELIVERY!!
              </h1>
              <p className="mt-3 max-w-md text-xs font-semibold text-amber-100 sm:text-sm">
                Buy for ₹5,000 &amp; above to get free delivery on all products except fertilisers.
              </p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-amber-300 sm:text-xs">
                Offer valid till June 30, 2026
              </p>
              <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
                <Button asChild size="default" className="gap-2 bg-white text-foreground hover:bg-white/90">
                  <Link to="/products">Shop now <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button asChild size="default" variant="outline" className="gap-2 border-white/60 bg-transparent text-white hover:bg-white/10">
                  <Link to="/staff/login">Login</Link>
                </Button>
                <Button asChild size="default" variant="outline" className="gap-2 border-white/60 bg-transparent text-white hover:bg-white/10">
                  <Link to="/signup">{t("hero.ctaPrimary")}</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="relative ml-auto aspect-square w-full max-w-sm rounded-2xl bg-gradient-to-br from-amber-200/80 to-amber-400/40 p-6 backdrop-blur">
                <div className="flex h-full flex-col items-center justify-center text-center text-foreground">
                  <Truck className="h-20 w-20 text-amber-900" strokeWidth={1.5} />
                  <p className="mt-4 text-2xl font-extrabold">₹5,000+</p>
                  <p className="mt-1 text-sm font-semibold opacity-80">Order value for free shipping</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service tile row */}
        <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-6 sm:grid-cols-4 sm:gap-3 lg:grid-cols-7">
          {[
            { label: "Spraying", Icon: SprayCan, to: "/services/schemes" },
            { label: "Door Delivery", Icon: Truck, to: "/services/trade" },
            { label: "Crop Doctor", Icon: Leaf, to: "/services/seeds" },
            { label: "Ask an Expert", Icon: Headphones, to: "/support" },
            { label: "Agri Video", Icon: PlayCircle, to: "/blog" },
            { label: "My Crops", Icon: Sprout, to: "/portal/dashboard" },
            { label: "Connect", Icon: Users, to: "/contact" },
          ].map(({ label, Icon, to }) => (
            <Link key={label} to={to}>
              <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border/60 bg-muted/40 p-3 text-center transition hover:border-primary/40 hover:bg-muted sm:flex-row sm:gap-2 sm:p-4 sm:text-left">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-[11px] font-semibold leading-tight sm:text-sm">{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Key Services (6 cards) */}
      <section className="container mx-auto px-4 py-10 sm:py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-2xl font-bold sm:text-3xl md:text-4xl">{t("services.title")}</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">{t("services.subtitle")}</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-3">
          {homeServices.map(({ key, Icon, img }) => (
            <Link key={key} to={`/services/${key}`} className="block">
              <Card className="group card-lift h-full overflow-hidden border-border/60">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={img}
                    alt={t(`services.items.${key}.title`)}
                    loading="lazy"
                    width={768}
                    height={512}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-lg bg-background/90 text-primary shadow-sm backdrop-blur sm:h-11 sm:w-11">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                </div>
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-sm font-semibold sm:text-lg">{t(`services.items.${key}.title`)}</h3>
                  <p className="mt-1 hidden text-sm text-muted-foreground sm:block">{t(`services.items.${key}.short`)}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center sm:mt-8">
          <Button asChild variant="outline" size="sm" className="sm:size-default"><Link to="/services">{t("services.title")} →</Link></Button>
        </div>
      </section>

      {/* Why AgriKart Fin */}
      <section className="bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-bold md:text-4xl">{t("whyTitle")}</h2>
            <p className="mt-4 text-muted-foreground md:text-lg">{t("why")}</p>
          </div>
          <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
            {(t("why").split(",")).map((x, i) => (
              <li key={i} className="flex items-start gap-2 rounded-lg border border-border/60 bg-card p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">{x.trim()}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative overflow-hidden rounded-2xl bg-cta-gradient px-6 py-12 text-primary-foreground shadow-glow md:px-12 md:py-16">
          <div className="absolute inset-0 bg-grain opacity-25 pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-balance text-3xl font-bold md:text-4xl">{t("register.title")}</h2>
            <p className="mt-3 text-primary-foreground/85">{t("register.subtitle")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary" className="shadow-elegant">
                <Link to="/signup">{t("hero.ctaPrimary")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/pay">{t("hero.ctaSecondary")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
