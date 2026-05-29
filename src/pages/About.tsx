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
            <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
              {values.map((v) => (
                <span key={v} className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary sm:px-4 sm:py-1.5 sm:text-sm">
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
