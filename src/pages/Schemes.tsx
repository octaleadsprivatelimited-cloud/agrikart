import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Landmark } from "lucide-react";

export default function Schemes() {
  const { t } = useTranslation();
  const items = t("schemes.items", { returnObjects: true }) as Array<{
    name: string;
    desc: string;
  }>;
  return (
    <>
      <PageHeader title={t("schemes.title")} subtitle={t("schemes.intro")} />
      <section className="container mx-auto grid gap-4 px-4 py-10 sm:gap-5 sm:py-16 sm:grid-cols-2 md:grid-cols-3">
        {items.map((it) => (
          <Card key={it.name} className="card-lift border-border/60">
            <CardContent className="p-5 sm:p-6">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary sm:h-12 sm:w-12">
                <Landmark className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="mt-3 text-base font-semibold sm:mt-4 sm:text-lg">{it.name}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground sm:mt-2">{it.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
