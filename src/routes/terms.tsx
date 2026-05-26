import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/terms")({ component: Terms });

function Terms() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader title={t("legal.termsTitle")} subtitle={t("legal.updated")} />
      <article className="container mx-auto max-w-3xl space-y-4 px-4 py-16 text-muted-foreground">
        <p>By using AgriKart Fin services you agree to the following terms.</p>
        <h2 className="pt-4 text-xl font-bold text-foreground">Eligibility</h2>
        <p>You must be 18 years or older and a resident of India to use our services.</p>
        <h2 className="pt-4 text-xl font-bold text-foreground">Service availability</h2>
        <p>Services are subject to availability in your district. We reserve the right to refuse or delay any request.</p>
        <h2 className="pt-4 text-xl font-bold text-foreground">Payments</h2>
        <p>All payments must be made via approved UPI/bank channels. Cash payments are not accepted.</p>
        <h2 className="pt-4 text-xl font-bold text-foreground">Limitation of liability</h2>
        <p>AgriKart Fin is not liable for crop losses, weather damage or third-party actions beyond our reasonable control.</p>
        <h2 className="pt-4 text-xl font-bold text-foreground">Governing law</h2>
        <p>These terms are governed by the laws of India and disputes fall under the jurisdiction of courts in Hyderabad, Telangana.</p>
      </article>
    </>
  );
}
