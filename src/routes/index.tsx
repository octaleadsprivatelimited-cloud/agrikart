import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Banknote, ShieldCheck, Sprout, Snowflake, Ship, Landmark,
  ArrowRight, CheckCircle2, IndianRupee,
} from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

const homeServices = [
  { key: "loans", Icon: Banknote },
  { key: "insurance", Icon: ShieldCheck },
  { key: "seeds", Icon: Sprout },
  { key: "cold", Icon: Snowflake },
  { key: "trade", Icon: Ship },
  { key: "schemes", Icon: Landmark },
] as const;

function Home() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 bg-grain opacity-40 pointer-events-none" />
        <div className="container relative mx-auto grid gap-12 px-4 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sprout className="h-3.5 w-3.5" /> {t("hero.eyebrow")}
            </span>
            <h1 className="mt-5 text-balance text-3xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              <span className="text-gradient-brand">{t("hero.title")}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">{t("hero.subtitle")}</p>
            <p className="mt-3 text-sm font-semibold text-primary">{t("hero.highlight")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2 shadow-elegant">
                <Link to="/signup">{t("hero.ctaPrimary")} <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link to="/pay"><IndianRupee className="h-4 w-4" /> {t("hero.ctaSecondary")}</Link>
              </Button>
            </div>
          </div>
          <div className="relative animate-rise">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-cta-gradient opacity-20 blur-2xl" />
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 bg-card shadow-glow">
              <div className="h-full w-full bg-cta-gradient p-8 text-white">
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
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl">{t("services.title")}</h2>
          <p className="mt-3 text-muted-foreground">{t("services.subtitle")}</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {homeServices.map(({ key, Icon }) => (
            <Card key={key} className="group card-lift border-border/60">
              <CardContent className="p-6">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{t(`services.items.${key}.title`)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t(`services.items.${key}.short`)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="outline"><Link to="/services">{t("services.title")} →</Link></Button>
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
