import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IndianRupee, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/pay")({
  component: PayPage,
  head: () => ({
    meta: [
      { title: "Pay Now — AgriKart Fin" },
      { name: "description", content: "Pay joining fee ₹2,000 or annual renewal ₹1,499 via Rojaripay." },
    ],
  }),
});

function PayPage() {
  const { t } = useTranslation();
  const [paid, setPaid] = useState<"joining" | "renewal" | null>(null);

  const pay = (kind: "joining" | "renewal") => {
    // Rojaripay integration placeholder
    toast.success(t("pay.success"));
    setPaid(kind);
  };

  return (
    <>
      <PageHeader title={t("pay.title")} subtitle={t("pay.subtitle")} />
      <section className="container mx-auto grid max-w-3xl gap-5 px-4 py-12 md:grid-cols-2">
        <PayCard
          label={t("pay.joining")}
          amount="₹2,000"
          onPay={() => pay("joining")}
          paid={paid === "joining"}
          btn={t("pay.payBtn")}
        />
        <PayCard
          label={t("pay.renewal")}
          amount="₹1,499"
          onPay={() => pay("renewal")}
          paid={paid === "renewal"}
          btn={t("pay.payBtn")}
        />
      </section>
      <p className="container mx-auto max-w-3xl px-4 pb-12 text-center text-xs text-muted-foreground">
        Powered by Rojaripay • UPI / Cards / Net Banking
      </p>
    </>
  );
}

function PayCard({ label, amount, onPay, paid, btn }: { label: string; amount: string; onPay: () => void; paid: boolean; btn: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
          <IndianRupee className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">{label}</h3>
        <p className="mt-1 text-3xl font-extrabold">{amount}</p>
        {paid ? (
          <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            <CheckCircle2 className="h-4 w-4" /> Paid
          </p>
        ) : (
          <Button onClick={onPay} className="mt-4 w-full">{btn}</Button>
        )}
      </CardContent>
    </Card>
  );
}
