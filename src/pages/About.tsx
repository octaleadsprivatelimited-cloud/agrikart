import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Building2, Users } from "lucide-react";

export default function About() {
  const { t } = useTranslation();
  const values = t("about.values", { returnObjects: true }) as string[];
  return (
    <>
      <PageHeader title={t("about.title")} subtitle={t("about.who")} />
      <section className="container mx-auto grid gap-6 px-4 py-16 md:grid-cols-2">
        <Card>
          <CardContent className="p-8">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-xl font-bold">{t("about.whoTitle")}</h2>
            <p className="mt-2 text-muted-foreground">{t("about.who")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-8">
            <Eye className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-xl font-bold">{t("about.visionTitle")}</h2>
            <p className="mt-2 text-muted-foreground">{t("about.vision")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-8">
            <Target className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-xl font-bold">{t("about.missionTitle")}</h2>
            <p className="mt-2 text-muted-foreground">{t("about.mission")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-8">
            <Building2 className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-xl font-bold">{t("brandFull")}</h2>
            <p className="mt-2 text-muted-foreground">{t("cin")}</p>
            <p className="mt-1 text-muted-foreground">Registered Office: Hyderabad, Telangana, India</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold">{t("about.valuesTitle")}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {values.map((v) => (
                <span key={v} className="rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                  {v}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
