import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Banknote, ShieldCheck, Sprout, Snowflake, Ship, Landmark,
  ArrowLeft, ArrowRight, CheckCircle2,
} from "lucide-react";
import imgLoans from "@/assets/service-loans.jpg";
import imgInsurance from "@/assets/service-insurance.jpg";
import imgSeeds from "@/assets/service-seeds.jpg";
import imgCold from "@/assets/service-cold.jpg";
import imgTrade from "@/assets/service-trade.jpg";
import imgSchemes from "@/assets/service-schemes.jpg";

const SERVICES = {
  loans:     { Icon: Banknote,     img: imgLoans },
  insurance: { Icon: ShieldCheck,  img: imgInsurance },
  seeds:     { Icon: Sprout,       img: imgSeeds },
  cold:      { Icon: Snowflake,    img: imgCold },
  trade:     { Icon: Ship,         img: imgTrade },
  schemes:   { Icon: Landmark,     img: imgSchemes },
} as const;

type Slug = keyof typeof SERVICES;
const SLUGS = Object.keys(SERVICES) as Slug[];

export const Route = createFileRoute("/services/$slug")({
  beforeLoad: ({ params }) => {
    if (!SLUGS.includes(params.slug as Slug)) throw notFound();
  },
  head: ({ params }) => ({
    meta: [
      { title: `Service — ${params.slug} | AgriKart Fin` },
      { name: "description", content: `Details about our ${params.slug} service for Indian farmers.` },
      { property: "og:title", content: `AgriKart Fin — ${params.slug}` },
      { property: "og:description", content: `Learn about our ${params.slug} service.` },
    ],
  }),
  component: ServiceDetail,
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Service not found</h1>
      <Button asChild className="mt-4"><Link to="/services">Back to Services</Link></Button>
    </div>
  ),
});

function ServiceDetail() {
  const { slug } = Route.useParams();
  const { t } = useTranslation();
  const s = SERVICES[slug as Slug];
  const Icon = s.Icon;
  const title = t(`services.items.${slug}.title`);
  const short = t(`services.items.${slug}.short`);
  const desc = t(`services.items.${slug}.desc`);

  const idx = SLUGS.indexOf(slug as Slug);
  const prev = SLUGS[(idx - 1 + SLUGS.length) % SLUGS.length];
  const next = SLUGS[(idx + 1) % SLUGS.length];

  return (
    <>
      <PageHeader eyebrow={t("services.title")} title={title} subtitle={short} />
      <section className="container mx-auto px-4 py-10 md:py-16">
        <Button asChild variant="ghost" size="sm" className="mb-6 gap-2">
          <Link to="/services"><ArrowLeft className="h-4 w-4" /> {t("services.title")}</Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="overflow-hidden rounded-2xl border border-border/60 shadow-elegant">
            <img
              src={s.img}
              alt={title}
              width={768}
              height={512}
              className="h-full w-full object-cover"
            />
          </div>

          <Card className="border-border/60">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">{desc}</p>

              <ul className="mt-6 space-y-2">
                {[short, "Transparent process and pricing", "Village-level support in your language"].map((line, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild className="gap-2"><Link to="/signup">{t("hero.ctaPrimary")} <ArrowRight className="h-4 w-4" /></Link></Button>
                <Button asChild variant="outline"><Link to="/contact">{t("nav.contact") as string}</Link></Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border/60 pt-6">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/services/$slug" params={{ slug: prev }}>
              <ArrowLeft className="h-4 w-4" /> {t(`services.items.${prev}.title`)}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/services/$slug" params={{ slug: next }}>
              {t(`services.items.${next}.title`)} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
