import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plane, Sprout, SprayCan, Snowflake, Ship, Banknote, ShieldCheck, Landmark, Headphones, ArrowRight, Quote, CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

const serviceIcons = [Plane, Sprout, SprayCan, Snowflake, Ship, Banknote, ShieldCheck, Landmark, Headphones];
const serviceKeys = ["drone","seeds","pesticides","cold","trade","loans","insurance","schemes","support"] as const;

function Home() {
  const { t } = useTranslation();
  const testimonials = t("testimonials.items", { returnObjects: true }) as Array<{ name: string; quote: string }>;

  return (
    <>
      {/* Hero */}
      <section className="bg-hero-gradient">
        <div className="container mx-auto grid gap-12 px-4 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sprout className="h-3.5 w-3.5" /> {t("hero.eyebrow")}
            </span>
            <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight md:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">{t("hero.subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/signup">{t("hero.ctaPrimary")} <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/services">{t("hero.ctaSecondary")}</Link>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["100% Free Registration","Telugu Support","Trusted by 10,000+ Farmers"].map(x => (
                <li key={x} className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" />{x}</li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl">
              <div className="h-full w-full bg-[linear-gradient(135deg,oklch(0.62_0.16_145)_0%,oklch(0.78_0.15_75)_100%)] p-8 text-white">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-wider opacity-90">Today on AgriKart</p>
                    <p className="mt-2 text-3xl font-bold">12,847</p>
                    <p className="text-sm opacity-90">Active farmers across 200+ villages</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[{n:"₹4.2 Cr",l:"Loans Disbursed"},{n:"3,200",l:"Drone Hours"},{n:"850 t",l:"Cold Storage"},{n:"99.2%",l:"Approval Rate"}].map(s => (
                      <div key={s.l} className="rounded-lg bg-white/15 p-3 backdrop-blur">
                        <p className="text-xl font-bold">{s.n}</p>
                        <p className="text-xs opacity-90">{s.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl">{t("services.title")}</h2>
          <p className="mt-3 text-muted-foreground">{t("services.subtitle")}</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {serviceKeys.map((key, i) => {
            const Icon = serviceIcons[i];
            return (
              <Card key={key} className="group transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{t(`services.items.${key}.title`)}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t(`services.items.${key}.desc`)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mx-auto max-w-2xl text-center text-balance text-3xl font-bold md:text-4xl">{t("testimonials.title")}</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((it, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Quote className="h-6 w-6 text-primary/40" />
                  <p className="mt-3 text-foreground">"{it.quote}"</p>
                  <p className="mt-4 text-sm font-semibold text-muted-foreground">— {it.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-12 text-primary-foreground md:px-12 md:py-16">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-balance text-3xl font-bold md:text-4xl">{t("hero.title")}</h2>
            <p className="mt-3 text-primary-foreground/80">{t("hero.subtitle")}</p>
            <Button asChild size="lg" variant="secondary" className="mt-6">
              <Link to="/signup">{t("hero.ctaPrimary")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
