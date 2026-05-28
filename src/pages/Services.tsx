import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Banknote, ShieldCheck, Sprout, Snowflake, Ship, Landmark, TestTube2, ArrowRight } from "lucide-react";
import imgLoans from "@/assets/service-loans.jpg";
import imgInsurance from "@/assets/service-insurance.jpg";
import imgSeeds from "@/assets/service-seeds.jpg";
import imgCold from "@/assets/service-cold.jpg";
import imgTrade from "@/assets/service-trade.jpg";
import imgSchemes from "@/assets/service-schemes.jpg";
import imgSoil from "@/assets/service-soil.jpg";

const items = [
  { key: "loans", Icon: Banknote, img: imgLoans },
  { key: "insurance", Icon: ShieldCheck, img: imgInsurance },
  { key: "seeds", Icon: Sprout, img: imgSeeds },
  { key: "soil", Icon: TestTube2, img: imgSoil },
  { key: "cold", Icon: Snowflake, img: imgCold },
  { key: "trade", Icon: Ship, img: imgTrade },
  { key: "schemes", Icon: Landmark, img: imgSchemes },
] as const;

export default function Services() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader title={t("services.title")} subtitle={t("services.subtitle")} />
      <section className="container mx-auto grid gap-4 px-4 py-8 sm:gap-5 sm:py-12 md:grid-cols-2 md:py-16">
        {items.map(({ key, Icon, img }) => (
          <Link key={key} to={`/services/${key}`} className="group block">
            <Card className="card-lift overflow-hidden border-border/60">
              <div className="relative aspect-[16/9] overflow-hidden">
                <img src={img} alt={t(`services.items.${key}.title`)} loading="lazy" width={768} height={512}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-lg bg-background/90 text-primary shadow-sm backdrop-blur">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <CardContent className="p-4 sm:p-6">
                <h3 className="flex items-center gap-2 text-base font-semibold sm:text-lg">
                  {t(`services.items.${key}.title`)}
                  <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:mt-2">{t(`services.items.${key}.short`)}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </>
  );
}
