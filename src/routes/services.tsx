import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Banknote, ShieldCheck, Sprout, Snowflake, Ship, Landmark } from "lucide-react";

export const Route = createFileRoute("/services")({ component: Services });

const items = [
  { key: "loans", Icon: Banknote },
  { key: "insurance", Icon: ShieldCheck },
  { key: "seeds", Icon: Sprout },
  { key: "cold", Icon: Snowflake },
  { key: "trade", Icon: Ship },
  { key: "schemes", Icon: Landmark },
] as const;

function Services() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader title={t("services.title")} subtitle={t("services.subtitle")} />
      <section className="container mx-auto grid gap-5 px-4 py-16 md:grid-cols-2">
        {items.map(({ key, Icon }) => (
          <Card key={key} className="card-lift border-border/60">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t(`services.items.${key}.title`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`services.items.${key}.desc`)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
