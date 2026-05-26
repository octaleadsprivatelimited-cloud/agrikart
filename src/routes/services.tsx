import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Banknote, ShieldCheck, Sprout, Snowflake, Ship, Landmark, ArrowRight } from "lucide-react";
import imgLoans from "@/assets/service-loans.jpg";
import imgInsurance from "@/assets/service-insurance.jpg";
import imgSeeds from "@/assets/service-seeds.jpg";
import imgCold from "@/assets/service-cold.jpg";
import imgTrade from "@/assets/service-trade.jpg";
import imgSchemes from "@/assets/service-schemes.jpg";

export const Route = createFileRoute("/services")({ component: Services });

const items = [
  { key: "loans", Icon: Banknote, img: imgLoans },
  { key: "insurance", Icon: ShieldCheck, img: imgInsurance },
  { key: "seeds", Icon: Sprout, img: imgSeeds },
  { key: "cold", Icon: Snowflake, img: imgCold },
  { key: "trade", Icon: Ship, img: imgTrade },
  { key: "schemes", Icon: Landmark, img: imgSchemes },
] as const;

function Services() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader title={t("services.title")} subtitle={t("services.subtitle")} />
      <section className="container mx-auto grid gap-5 px-4 py-12 md:grid-cols-2 md:py-16">
        {items.map(({ key, Icon, img }) => (
          <Link key={key} to="/services/$slug" params={{ slug: key }} className="group block">
            <Card className="card-lift overflow-hidden border-border/60">
              <div className="relative aspect-[16/9] overflow-hidden">
                <img src={img} alt={t(`services.items.${key}.title`)} loading="lazy" width={768} height={512}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-lg bg-background/90 text-primary shadow-sm backdrop-blur">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  {t(`services.items.${key}.title`)}
                  <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`services.items.${key}.short`)}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </>
  );
}
