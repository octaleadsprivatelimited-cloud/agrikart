import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IndianRupee, CheckCircle2, Copy, Landmark, Loader2, QrCode } from "lucide-react";
import { toast } from "sonner";
import { recordPayment } from "@/lib/staff-store";
import { useSettings } from "@/lib/shop-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Pay() {
  const { t } = useTranslation();
  const settings = useSettings();
  const [paid, setPaid] = useState<{
    kind: "joining" | "renewal";
    txnId: string;
    orderId: string;
  } | null>(null);
  const [farmerId, setFarmerId] = useState("");
  const [farmerName, setFarmerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [showBank, setShowBank] = useState(false);

  const [activeKind, setActiveKind] = useState<"joining" | "renewal" | null>(null);
  const [payMethod, setPayMethod] = useState<"UPI" | "Gateway" | null>(null);
  const [upiRef, setUpiRef] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);

  const initiatePayment = (kind: "joining" | "renewal") => {
    if (!farmerId.trim()) return toast.error(t("pay.errFarmerId"));
    if (mobile && !/^\d{10}$/.test(mobile.trim())) return toast.error(t("pay.errMobile"));
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return toast.error(t("pay.errEmail"));
    
    setActiveKind(kind);
    setPayMethod(null);
    setUpiRef("");
  };

  const handlePaymentSubmit = (method: "UPI" | "Card" | "NetBanking", reference?: string) => {
    if (!activeKind) return;
    const amount = activeKind === "joining" ? 1499 : 4999;
    
    setIsSimulating(true);
    
    setTimeout(() => {
      try {
        const p = recordPayment({
          farmerId: farmerId.trim().toUpperCase(),
          farmerName: farmerName.trim() || undefined,
          mobile: mobile.trim() || undefined,
          email: email.trim().toLowerCase() || undefined,
          kind: activeKind,
          amount,
          method,
          reference: reference || undefined,
        });
        toast.success(t("pay.success"));
        setPaid({ kind: activeKind, txnId: p.id, orderId: p.orderId });
        setActiveKind(null);
      } catch (err: any) {
        toast.error(err?.message || "Payment recording failed.");
      } finally {
        setIsSimulating(false);
      }
    }, method === "UPI" ? 500 : 1500);
  };

  return (
    <>
      <PageHeader title={t("pay.title")} subtitle={t("pay.subtitle")} />
      <section className="container mx-auto max-w-3xl px-4 py-12">
        <Card className="mb-6">
          <CardContent className="grid gap-3 p-6 sm:grid-cols-2">
            <div>
              <Label>{t("pay.farmerIdLabel")}</Label>
              <Input
                value={farmerId}
                onChange={(e) => setFarmerId(e.target.value)}
                placeholder={t("pay.farmerIdPlaceholder")}
                maxLength={20}
              />
            </div>
            <div>
              <Label>{t("pay.nameLabel")}</Label>
              <Input
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                maxLength={100}
              />
            </div>
            <div>
              <Label>{t("pay.mobileLabel")}</Label>
              <Input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                maxLength={10}
                placeholder={t("pay.mobilePlaceholder")}
              />
            </div>
            <div>
              <Label>{t("pay.emailLabel")}</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                placeholder={t("pay.emailPlaceholder")}
              />
            </div>
          </CardContent>
        </Card>
        {paid && (
          <Card className="mb-6 border-primary/30 bg-primary/5">
            <CardContent className="p-5 text-sm">
              <p className="font-semibold text-primary inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> {t("pay.successHeading")}
              </p>
              <div className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                <p>
                  {t("pay.txnId")}: <span className="font-mono text-foreground">{paid.txnId}</span>
                </p>
                <p>
                  {t("pay.orderId")}:{" "}
                  <span className="font-mono text-foreground">{paid.orderId}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="grid gap-5 md:grid-cols-2">
          <PayCard
            label={t("pay.joining")}
            amount="₹1,499"
            onPay={() => initiatePayment("joining")}
            paid={paid?.kind === "joining"}
            btn={t("pay.payBtn")}
            paidLabel={t("pay.paid")}
          />
          <PayCard
            label={t("pay.renewal")}
            amount="₹4,999"
            onPay={() => initiatePayment("renewal")}
            paid={paid?.kind === "renewal"}
            btn={t("pay.payBtn")}
            paidLabel={t("pay.paid")}
          />
        </div>

        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Bank Transfer (NEFT / IMPS / UPI)</h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              You can also pay via direct bank transfer. Use the details below and share the
              transaction screenshot on WhatsApp.
            </p>
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
      <p className="container mx-auto max-w-3xl px-4 pb-12 text-center text-xs text-muted-foreground">
        {t("pay.poweredBy")}
      </p>

      <Dialog open={activeKind !== null} onOpenChange={(open) => { if (!open && !isSimulating) setActiveKind(null); }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>
              Plan Amount: ₹{activeKind === "joining" ? "1,499" : "4,999"}
            </DialogDescription>
          </DialogHeader>

          {isSimulating ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium text-muted-foreground">Processing payment securely...</p>
            </div>
          ) : payMethod === null ? (
            <div className="grid gap-3 py-4">
              <Button 
                onClick={() => setPayMethod("UPI")} 
                className="w-full flex items-center justify-start gap-3 py-6 px-4 text-base cursor-pointer"
                variant="outline"
              >
                <QrCode className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-semibold">UPI Payment (Scan QR)</p>
                  <p className="text-xs text-muted-foreground font-normal">Pay with PhonePe, GPay, Paytm, etc.</p>
                </div>
              </Button>
              <Button 
                onClick={() => handlePaymentSubmit("NetBanking")} 
                className="w-full flex items-center justify-start gap-3 py-6 px-4 text-base cursor-pointer"
                variant="outline"
              >
                <Landmark className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-semibold">Rojaripay Gateway</p>
                  <p className="text-xs text-muted-foreground font-normal">Pay via Cards, Netbanking, etc.</p>
                </div>
              </Button>
            </div>
          ) : payMethod === "UPI" ? (
            <div className="flex flex-col items-center py-4 space-y-4">
              <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-dashed border-border bg-muted/30 w-full">
                <img src="/upi-qr.png" alt="UPI QR Code" className="max-w-[240px] w-full rounded-lg shadow-md border border-border bg-white p-2" />
                <p className="text-[10px] text-muted-foreground mt-2 text-center font-medium">
                  GANDI JAYANTH · UPI ID: 8121030900.1@hdfc
                </p>
              </div>
              <div className="w-full space-y-2">
                <Label htmlFor="upi-ref" className="text-xs font-semibold">
                  UPI Transaction ID / Ref No. <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="upi-ref"
                  placeholder="Enter 12-digit UPI reference ID"
                  value={upiRef}
                  onChange={(e) => setUpiRef(e.target.value)}
                  maxLength={64}
                />
              </div>
              <div className="flex w-full gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setPayMethod(null)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => handlePaymentSubmit("UPI", upiRef)} 
                  disabled={!upiRef.trim()}
                  className="flex-1 font-semibold"
                >
                  Confirm Payment
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

function PayCard({
  label,
  amount,
  onPay,
  paid,
  btn,
  paidLabel,
}: {
  label: string;
  amount: string;
  onPay: () => void;
  paid: boolean;
  btn: string;
  paidLabel: string;
}) {
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
            <CheckCircle2 className="h-4 w-4" /> {paidLabel}
          </p>
        ) : (
          <Button onClick={onPay} className="mt-4 w-full">
            {btn}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function BankField({ label, value }: { label: string; value: string }) {
  const copy = () => {
    navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  };
  return (
    <div className="rounded-md border border-border bg-muted/30 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold break-all">{value}</p>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-7 w-7 shrink-0"
          onClick={copy}
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
