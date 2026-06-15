import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IndianRupee, CheckCircle2, Copy, Landmark } from "lucide-react";
import { toast } from "sonner";
import { recordPayment } from "@/lib/staff-store";
import { useSettings } from "@/lib/shop-store";

export default function Pay() {
  const { t } = useTranslation();
  const settings = useSettings();
  const [paid, setPaid] = useState<{ kind: "joining" | "renewal"; txnId: string; orderId: string } | null>(null);
  const [farmerId, setFarmerId] = useState("");
  const [farmerName, setFarmerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [showBank, setShowBank] = useState(false);

  const pay = (kind: "joining" | "renewal") => {
    if (!farmerId.trim()) return toast.error(t("pay.errFarmerId"));
    if (mobile && !/^\d{10}$/.test(mobile.trim())) return toast.error(t("pay.errMobile"));
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return toast.error(t("pay.errEmail"));
    const amount = kind === "joining" ? 1499 : 4999;
    const p = recordPayment({
      farmerId: farmerId.trim().toUpperCase(),
      farmerName: farmerName.trim() || undefined,
      mobile: mobile.trim() || undefined,
      email: email.trim().toLowerCase() || undefined,
      kind, amount,
    });
    toast.success(t("pay.success"));
    setPaid({ kind, txnId: p.id, orderId: p.orderId });
  };

  return (
    <>
      <PageHeader title={t("pay.title")} subtitle={t("pay.subtitle")} />
      <section className="container mx-auto max-w-3xl px-4 py-12">
        <Card className="mb-6"><CardContent className="grid gap-3 p-6 sm:grid-cols-2">
          <div><Label>{t("pay.farmerIdLabel")}</Label><Input value={farmerId} onChange={(e) => setFarmerId(e.target.value)} placeholder={t("pay.farmerIdPlaceholder")} maxLength={20} /></div>
          <div><Label>{t("pay.nameLabel")}</Label><Input value={farmerName} onChange={(e) => setFarmerName(e.target.value)} maxLength={100} /></div>
          <div><Label>{t("pay.mobileLabel")}</Label><Input value={mobile} onChange={(e) => setMobile(e.target.value)} maxLength={10} placeholder={t("pay.mobilePlaceholder")} /></div>
          <div><Label>{t("pay.emailLabel")}</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} placeholder={t("pay.emailPlaceholder")} /></div>
        </CardContent></Card>
        {paid && (
          <Card className="mb-6 border-primary/30 bg-primary/5"><CardContent className="p-5 text-sm">
            <p className="font-semibold text-primary inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> {t("pay.successHeading")}</p>
            <div className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
              <p>{t("pay.txnId")}: <span className="font-mono text-foreground">{paid.txnId}</span></p>
              <p>{t("pay.orderId")}: <span className="font-mono text-foreground">{paid.orderId}</span></p>
            </div>
          </CardContent></Card>
        )}
        <div className="grid gap-5 md:grid-cols-2">
          <PayCard label={t("pay.joining")} amount="₹1,499" onPay={() => pay("joining")} paid={paid?.kind === "joining"} btn={t("pay.payBtn")} paidLabel={t("pay.paid")} />
          <PayCard label={t("pay.renewal")} amount="₹4,999" onPay={() => pay("renewal")} paid={paid?.kind === "renewal"} btn={t("pay.payBtn")} paidLabel={t("pay.paid")} />
        </div>

        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Bank Transfer (NEFT / IMPS / UPI)</h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">You can also pay via direct bank transfer. Use the details below and share the transaction screenshot on WhatsApp.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <BankField label="Bank Name" value={settings.bankName} />
              <BankField label="Account Holder" value={settings.bankAccountName} />
              <BankField label="Account Number" value={settings.bankAccountNumber} />
              <BankField label="Account Type" value={settings.bankAccountType} />
              <BankField label="IFSC Code" value={settings.bankIfsc} />
            </div>
          </CardContent>
        </Card>
      </section>
      <p className="container mx-auto max-w-3xl px-4 pb-12 text-center text-xs text-muted-foreground">{t("pay.poweredBy")}</p>
    </>
  );
}

function PayCard({ label, amount, onPay, paid, btn, paidLabel }: { label: string; amount: string; onPay: () => void; paid: boolean; btn: string; paidLabel: string }) {
  return (
    <Card><CardContent className="p-6">
      <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary"><IndianRupee className="h-6 w-6" /></div>
      <h3 className="mt-4 text-lg font-semibold">{label}</h3>
      <p className="mt-1 text-3xl font-extrabold">{amount}</p>
      {paid ? (
        <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"><CheckCircle2 className="h-4 w-4" /> {paidLabel}</p>
      ) : (
        <Button onClick={onPay} className="mt-4 w-full">{btn}</Button>
      )}
    </CardContent></Card>
  );
}
