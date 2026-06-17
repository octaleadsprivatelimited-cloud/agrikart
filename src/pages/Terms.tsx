import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";

export default function Terms() {
  const { t } = useTranslation();
  const points = t("legal.terms.points", { returnObjects: true }) as string[];
  return (
    <>
      <PageHeader title={t("legal.termsTitle")} subtitle={t("legal.updated")} />
      <article className="container mx-auto max-w-3xl space-y-4 px-4 py-16 text-muted-foreground">
        <p>{t("legal.terms.intro")}</p>
        <ul className="list-disc space-y-3 pl-6">
          {points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </article>
    </>
  );
}
