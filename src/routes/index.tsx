import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Banknote, ShieldCheck, Sprout, Snowflake, Ship, Landmark,
  ArrowRight, CheckCircle2, IndianRupee,
} from "lucide-react";
import imgLoans from "@/assets/service-loans.jpg";
import imgInsurance from "@/assets/service-insurance.jpg";
import imgSeeds from "@/assets/service-seeds.jpg";
import imgCold from "@/assets/service-cold.jpg";
import imgTrade from "@/assets/service-trade.jpg";
import imgSchemes from "@/assets/service-schemes.jpg";

export const Route = createFileRoute("/")({ component: Home });

const homeServices = [
  { key: "loans", Icon: Banknote, img: imgLoans },
  { key: "insurance", Icon: ShieldCheck, img: imgInsurance },
  { key: "seeds", Icon: Sprout, img: imgSeeds },
  { key: "cold", Icon: Snowflake, img: imgCold },
  { key: "trade", Icon: Ship, img: imgTrade },
  { key: "schemes", Icon: Landmark, img: imgSchemes },
] as const;

function Home() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 bg-grain opacity-40 pointer-events-none" />
        <div className="container relative mx-auto grid gap-8 px-4 py-10 sm:py-14 md:py-20 lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary sm:text-xs">
              <Sprout className="h-3.5 w-3.5" /> {t("hero.eyebrow")}
            </span>
            <h1 className="mt-3 text-balance text-2xl font-extrabold tracking-tight sm:mt-5 sm:text-3xl md:text-5xl lg:text-6xl">
              <span className="text-gradient-brand">{t("hero.title")}</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:mt-5 sm:text-base md:text-lg">{t("hero.subtitle")}</p>
            <p className="mt-2 text-xs font-semibold text-primary sm:mt-3 sm:text-sm">{t("hero.highlight")}</p>
            <div className="mt-5 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
              <Button asChild size="default" className="gap-2 shadow-elegant sm:size-lg">
                <Link to="/signup">{t("hero.ctaPrimary")} <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="default" variant="outline" className="gap-2 sm:size-lg">
                <Link to="/pay"><IndianRupee className="h-4 w-4" /> {t("hero.ctaSecondary")}</Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden animate-rise sm:block">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-cta-gradient opacity-20 blur-2xl" />
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 bg-card shadow-glow">
              <div className="h-full w-full bg-cta-gradient p-6 text-white sm:p-8">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-wider opacity-90">{t("brand")}</p>
                    <p className="mt-2 text-2xl font-bold leading-tight">
                      {t("hero.highlight")}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { n: "₹2,000", l: t("register.joiningFee").replace("Joining Fee: ", "").replace("జాయినింగ్ ఫీజు: ", "") },
                      { n: "₹1,499", l: t("register.renewalFee").replace("Annual Renewal: ", "").replace("వార్షిక రీన్యువల్: ", "") },
                      { n: "6", l: t("services.title") },
                      { n: "3+", l: t("schemes.title") },
                    ].map((s, i) => (
                      <div key={i} className="rounded-lg bg-white/15 p-3 backdrop-blur transition-colors hover:bg-white/25">
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

      {/* Key Services (6 cards) */}
      <section className="container mx-auto px-4 py-10 sm:py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-2xl font-bold sm:text-3xl md:text-4xl">{t("services.title")}</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">{t("services.subtitle")}</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-3">
          {homeServices.map(({ key, Icon, img }) => (
            <Card key={key} className="group card-lift overflow-hidden border-border/60">
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
