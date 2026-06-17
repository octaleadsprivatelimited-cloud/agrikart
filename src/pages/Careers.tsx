import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin } from "lucide-react";

export default function Careers() {
  const { t } = useTranslation();
  const openings = t("careers.openings", { returnObjects: true }) as Array<{
    role: string;
    loc: string;
    type: string;
  }>;
  return (
    <>
      <PageHeader title={t("careers.title")} subtitle={t("careers.intro")} />
      <section className="container mx-auto grid gap-4 px-4 py-16">
        {openings.map((o, i) => (
          <Card key={i}>
            <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold">{o.role}</h3>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {o.loc}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    {o.type}
                  </span>
                </div>
              </div>
              <Button asChild variant="outline">
                <a href="mailto:careers@agrifincart.com">{t("careers.apply")}</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
