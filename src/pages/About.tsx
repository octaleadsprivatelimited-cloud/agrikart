import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Building2, Users } from "lucide-react";
import imgWho from "@/assets/about-who.jpg";
import imgVision from "@/assets/about-vision.jpg";
import imgMission from "@/assets/about-mission.jpg";
import imgCompany from "@/assets/about-company.jpg";
import imgValues from "@/assets/about-values.jpg";

export default function About() {
  const { t } = useTranslation();
  const values = t("about.values", { returnObjects: true }) as { name: string; desc: string }[];

  const cards = [
    { img: imgWho, Icon: Users, title: t("about.whoTitle"), body: t("about.who") },
    { img: imgVision, Icon: Eye, title: t("about.visionTitle"), body: t("about.vision") },
    { img: imgMission, Icon: Target, title: t("about.missionTitle"), body: t("about.mission") },
    { img: imgCompany, Icon: Building2, title: t("brandFull"), body: `${t("cin")} · Registered Office: Hyderabad, Telangana, India` },
  ];

  return (
    <>
      <PageHeader title={t("about.title")} subtitle={t("about.who")} />
      <section className="container mx-auto grid gap-4 px-4 py-10 sm:gap-6 sm:py-16 md:grid-cols-2">
        {cards.map(({ img, Icon, title, body }) => (
          <Card key={title} className="overflow-hidden">
            <div className="relative aspect-[16/9] overflow-hidden">
              <img src={img} alt={title} loading="lazy" width={1280} height={800}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-lg bg-background/90 text-primary shadow-sm backdrop-blur">
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <CardContent className="p-5 sm:p-8">
              <h2 className="text-lg font-bold sm:text-xl">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">{body}</p>
            </CardContent>
          </Card>
        ))}
        <Card className="overflow-hidden md:col-span-2">
          <div className="relative h-40 overflow-hidden sm:h-56">
            <img src={imgValues} alt={t("about.valuesTitle")} loading="lazy" width={1600} height={700}
              className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <h2 className="absolute bottom-3 left-5 text-lg font-bold sm:bottom-5 sm:left-8 sm:text-2xl">{t("about.valuesTitle")}</h2>
          </div>
          <CardContent className="p-5 sm:p-8">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
