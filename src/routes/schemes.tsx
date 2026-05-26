import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Landmark } from "lucide-react";

export const Route = createFileRoute("/schemes")({
  component: SchemesPage,
  head: () => ({
    meta: [
      { title: "Government Schemes — AgriKart Fin" },
      { name: "description", content: "PMFBY, PM-KISAN and KCC application assistance for Indian farmers." },
    ],
  }),
});

function SchemesPage() {
  const { t } = useTranslation();
  const items = t("schemes.items", { returnObjects: true }) as Array<{ name: string; desc: string }>;
  return (
    <>
      <PageHeader title={t("schemes.title")} subtitle={t("schemes.intro")} />
      <section className="container mx-auto grid gap-5 px-4 py-16 md:grid-cols-3">
        {items.map((it) => (
          <Card key={it.name} className="transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
                <Landmark className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{it.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
