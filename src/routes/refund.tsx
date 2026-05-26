import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/refund")({ component: Refund });

function Refund() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader title={t("legal.refundTitle")} subtitle={t("legal.updated")} />
      <article className="container mx-auto max-w-3xl space-y-4 px-4 py-16 text-muted-foreground">
        <h2 className="pt-2 text-xl font-bold text-foreground">Cancellations</h2>
        <p>Bookings can be cancelled free of charge as long as they have not yet been marked as Approved by our team.</p>
        <h2 className="pt-4 text-xl font-bold text-foreground">Refunds</h2>
        <p>Approved refunds are processed back to the original payment method within 7-10 working days.</p>
        <h2 className="pt-4 text-xl font-bold text-foreground">Non-refundable charges</h2>
        <p>Government fees, third-party insurance premiums and consumed services (e.g. drone hours already flown) are non-refundable.</p>
        <h2 className="pt-4 text-xl font-bold text-foreground">Contact</h2>
        <p>For any refund-related queries write to support@agrikartfin.com or call +91 99999 99999.</p>
      </article>
    </>
  );
}
