import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, Sprout, SprayCan, Snowflake, Ship, Banknote, ShieldCheck, Landmark, Headphones } from "lucide-react";

export const Route = createFileRoute("/services")({ component: Services });

const items = [
  { key: "drone", Icon: Plane },
  { key: "seeds", Icon: Sprout },
  { key: "pesticides", Icon: SprayCan },
  { key: "cold", Icon: Snowflake },
  { key: "trade", Icon: Ship },
  { key: "loans", Icon: Banknote },
  { key: "insurance", Icon: ShieldCheck },
  { key: "schemes", Icon: Landmark },
  { key: "support", Icon: Headphones },
] as const;

function Services() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader title={t("services.title")} subtitle={t("services.subtitle")} />
      <section className="container mx-auto grid gap-5 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ key, Icon }) => (
          <Card key={key} className="transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{t(`services.items.${key}.title`)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(`services.items.${key}.desc`)}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
