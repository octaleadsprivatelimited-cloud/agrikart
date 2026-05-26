import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/privacy")({ component: Privacy });

function Privacy() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader title={t("legal.privacyTitle")} subtitle={t("legal.updated")} />
      <article className="container mx-auto max-w-3xl space-y-4 px-4 py-16 text-muted-foreground">
        <p>AGRIKART FIN TECH PRIVATE LIMITED ("we", "us") respects your privacy. This policy explains what data we collect and how we use it.</p>
        <h2 className="pt-4 text-xl font-bold text-foreground">Information we collect</h2>
        <p>Name, mobile number, Aadhaar (optional), village, district, land size, crops grown, GPS location when you book a service, and payment details for completed transactions.</p>
        <h2 className="pt-4 text-xl font-bold text-foreground">How we use your data</h2>
        <p>To process service requests, verify identity, disburse loans, file insurance claims, and communicate updates. We never sell your data to third parties.</p>
        <h2 className="pt-4 text-xl font-bold text-foreground">Data security</h2>
        <p>Data is stored with industry-standard encryption. Access is restricted to authorized employees.</p>
        <h2 className="pt-4 text-xl font-bold text-foreground">Your rights</h2>
        <p>You may request deletion of your account and associated data at any time by writing to privacy@agrikartfin.com.</p>
      </article>
    </>
  );
}
