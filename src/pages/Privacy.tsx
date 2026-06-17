import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";

export default function Privacy() {
  const { t } = useTranslation();
  const points = t("legal.privacy.points", { returnObjects: true }) as string[];
  return (
    <>
      <PageHeader title={t("legal.privacyTitle")} subtitle={t("legal.updated")} />
      <article className="container mx-auto max-w-3xl space-y-4 px-4 py-16 text-muted-foreground">
        <p>{t("legal.privacy.intro")}</p>
        <ul className="list-disc space-y-3 pl-6">
          {points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </article>
    </>
  );
}
