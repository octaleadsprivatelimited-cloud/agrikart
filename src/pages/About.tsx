import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Building2, Users } from "lucide-react";

export default function About() {
  const { t } = useTranslation();
  const values = t("about.values", { returnObjects: true }) as { name: string; desc: string }[];
  return (
    <>
      <PageHeader title={t("about.title")} subtitle={t("about.who")} />
      <section className="container mx-auto grid gap-4 px-4 py-10 sm:gap-6 sm:py-16 md:grid-cols-2">
        <Card>
          <CardContent className="p-5 sm:p-8">
            <Users className="h-7 w-7 text-primary sm:h-8 sm:w-8" />
            <h2 className="mt-3 text-lg font-bold sm:mt-4 sm:text-xl">{t("about.whoTitle")}</h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">{t("about.who")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 sm:p-8">
            <Eye className="h-7 w-7 text-primary sm:h-8 sm:w-8" />
            <h2 className="mt-3 text-lg font-bold sm:mt-4 sm:text-xl">{t("about.visionTitle")}</h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">{t("about.vision")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 sm:p-8">
            <Target className="h-7 w-7 text-primary sm:h-8 sm:w-8" />
            <h2 className="mt-3 text-lg font-bold sm:mt-4 sm:text-xl">{t("about.missionTitle")}</h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">{t("about.mission")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 sm:p-8">
            <Building2 className="h-7 w-7 text-primary sm:h-8 sm:w-8" />
            <h2 className="mt-3 text-lg font-bold sm:mt-4 sm:text-xl">{t("brandFull")}</h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">{t("cin")}</p>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">Registered Office: Hyderabad, Telangana, India</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardContent className="p-5 sm:p-8">
            <h2 className="text-lg font-bold sm:text-xl">{t("about.valuesTitle")}</h2>
            <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((v) => (
                <div key={v.name} className="rounded-xl border border-border/60 bg-card/50 p-4 transition hover:border-primary/40 hover:shadow-sm">
                  <h3 className="text-sm font-semibold text-primary sm:text-base">{v.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{v.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
