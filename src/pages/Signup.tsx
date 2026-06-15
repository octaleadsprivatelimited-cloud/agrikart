import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { createSubmission } from "@/lib/staff-store";

type Form = {
  name: string; mobile: string; aadhaar: string; village: string; mandal: string;
  district: string; state: string; landArea: string; surveyNumbers: string; mainCrop: string; season: string;
};

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>({
    name: "", mobile: "", aadhaar: "", village: "", mandal: "",
    district: "", state: "", landArea: "", surveyNumbers: "", mainCrop: "", season: "",
  });
  const [farmerId, setFarmerId] = useState<string | null>(null);

  const upd = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[0-9]{10}$/.test(form.mobile)) { toast.error(t("validation.mobile10")); return; }
    if (!/^[0-9]{12}$/.test(form.aadhaar)) { toast.error(t("validation.aadhaar12")); return; }
    const sub = createSubmission({
      farmerName: form.name.trim(),
      mobile: form.mobile.trim(),
      village: form.village.trim(),
      district: form.district.trim(),
      serviceCategory: "General Inquiry",
      message: `Farmer registration request.\nAadhaar: ${form.aadhaar}\nMandal: ${form.mandal}, State: ${form.state}\nLand: ${form.landArea} acres, Survey #: ${form.surveyNumbers}\nMain crop: ${form.mainCrop}, Season: ${form.season}`,
    });
    setFarmerId(sub.id);
    toast.success(t("register.captured"));
    setTimeout(() => navigate("/pay"), 1200);
  };

  const f = t("register.fields", { returnObjects: true }) as Record<keyof Form, string>;
  const ph = t("register.placeholders", { returnObjects: true }) as { survey: string; crop: string; season: string };

  return (
    <section className="container mx-auto grid max-w-5xl gap-6 px-4 py-12 lg:grid-cols-[1fr_320px]">
      <Card>
        <CardContent className="p-5 sm:p-8">
          <div className="mb-6">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground"><Sprout className="h-6 w-6" /></div>
            <h1 className="mt-4 text-2xl font-bold">{t("register.title")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("register.subtitle")}</p>
          </div>
          {farmerId ? (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 text-center">
              <p className="text-sm">{t("register.success")}</p>
              <p className="mt-2 text-2xl font-extrabold tracking-wider text-primary">{farmerId}</p>
              <p className="mt-3 text-xs text-muted-foreground">{t("register.note")}</p>
              <Button className="mt-5" onClick={() => navigate("/pay")}>
                <IndianRupee className="mr-1.5 h-4 w-4" /> {t("hero.ctaSecondary")}
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              <Field label={f.name} id="name"><Input id="name" required maxLength={100} value={form.name} onChange={upd("name")} /></Field>
              <Field label={f.mobile} id="mobile"><Input id="mobile" required pattern="[0-9]{10}" maxLength={10} value={form.mobile} onChange={upd("mobile")} /></Field>
              <Field label={f.aadhaar} id="aadhaar" className="sm:col-span-2"><Input id="aadhaar" required pattern="[0-9]{12}" maxLength={12} value={form.aadhaar} onChange={upd("aadhaar")} /></Field>
              <Field label={f.village} id="village"><Input id="village" required value={form.village} onChange={upd("village")} /></Field>
              <Field label={f.mandal} id="mandal"><Input id="mandal" required value={form.mandal} onChange={upd("mandal")} /></Field>
              <Field label={f.district} id="district"><Input id="district" required value={form.district} onChange={upd("district")} /></Field>
              <Field label={f.state} id="state"><Input id="state" required value={form.state} onChange={upd("state")} /></Field>
              <Field label={f.landArea} id="land"><Input id="land" required type="number" min="0" step="0.1" value={form.landArea} onChange={upd("landArea")} /></Field>
              <Field label={f.surveyNumbers} id="survey"><Input id="survey" required value={form.surveyNumbers} onChange={upd("surveyNumbers")} placeholder={ph.survey} /></Field>
              <Field label={f.mainCrop} id="crop"><Input id="crop" required value={form.mainCrop} onChange={upd("mainCrop")} placeholder={ph.crop} /></Field>
              <Field label={f.season} id="season"><Input id="season" required value={form.season} onChange={upd("season")} placeholder={ph.season} /></Field>
              <div className="sm:col-span-2"><Button type="submit" size="lg" className="w-full">{t("register.submit")}</Button></div>
            </form>
          )}
        </CardContent>
      </Card>
      <aside className="space-y-4">
        <Card><CardContent className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t("register.feeTitle")}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="font-medium">{t("register.joiningFee")}</li>
            <li className="font-medium">{t("register.renewalFee")}</li>
            <li className="text-muted-foreground">{t("register.paymentMode")}</li>
          </ul>
          <p className="mt-4 rounded-md bg-accent/30 p-3 text-xs text-accent-foreground">{t("register.note")}</p>
        </CardContent></Card>
      </aside>
    </section>
  );
}

function Field({ label, id, className, children }: { label: string; id: string; className?: string; children: React.ReactNode }) {
  return (<div className={className}><Label htmlFor={id}>{label}</Label>{children}</div>);
}
