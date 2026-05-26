import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Building2 } from "lucide-react";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader title={t("about.title")} subtitle={t("about.intro")} />
      <section className="container mx-auto grid gap-6 px-4 py-16 md:grid-cols-2">
        <Card>
          <CardContent className="p-8">
            <Target className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-xl font-bold">{t("about.missionTitle")}</h2>
            <p className="mt-2 text-muted-foreground">{t("about.mission")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-8">
            <Eye className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-xl font-bold">{t("about.visionTitle")}</h2>
            <p className="mt-2 text-muted-foreground">{t("about.vision")}</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardContent className="p-8">
            <Building2 className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-xl font-bold">{t("brandFull")}</h2>
            <p className="mt-2 text-muted-foreground">{t("cin")}</p>
            <p className="mt-1 text-muted-foreground">Registered Office: Hyderabad, Telangana, India</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
