import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createSubmission, serviceCategories, type ServiceCategory } from "@/lib/staff-store";
import { Sprout, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const empty = {
  farmerName: "", mobile: "", village: "", district: "",
  serviceCategory: "" as ServiceCategory | "",
  message: "",
};

export default function Apply() {
  const { t } = useTranslation();
  const [form, setForm] = useState(empty);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.serviceCategory) return toast.error(t("validation.selectService"));
    if (!/^[0-9]{10}$/.test(form.mobile)) return toast.error(t("validation.mobile10"));
    const s = createSubmission({
      farmerName: form.farmerName.trim(),
      mobile: form.mobile.trim(),
      village: form.village.trim(),
      district: form.district.trim(),
      serviceCategory: form.serviceCategory as ServiceCategory,
      message: form.message.trim(),
    });
    setSubmittedId(s.id);
    setForm(empty);
    toast.success(t("apply.submitted"));
  };

  if (submittedId) {
    return (
      <section className="container mx-auto max-w-xl px-4 py-16">
        <Card>
          <CardContent className="p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="mt-5 text-2xl font-bold">{t("apply.received")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("apply.refIntro")} <span className="font-mono font-semibold text-foreground">{submittedId}</span>.
              {" "}{t("apply.refOutro")}
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <Button onClick={() => setSubmittedId(null)}>{t("apply.submitAnother")}</Button>
              <Button asChild variant="outline"><Link to="/">{t("apply.backHome")}</Link></Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="container mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <div className="mb-6 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Sprout className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-3xl font-bold">{t("apply.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("apply.subtitle")}</p>
      </div>
      <Card>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
            <Field label={t("apply.farmerName")}>
              <Input required maxLength={100} value={form.farmerName} onChange={e => set("farmerName")(e.target.value)} />
            </Field>
            <Field label={t("apply.mobile")}>
              <Input required inputMode="numeric" pattern="[0-9]{10}" maxLength={10} value={form.mobile} onChange={e => set("mobile")(e.target.value)} />
            </Field>
            <Field label={t("apply.village")}>
              <Input required maxLength={100} value={form.village} onChange={e => set("village")(e.target.value)} />
            </Field>
            <Field label={t("apply.district")}>
              <Input required maxLength={100} value={form.district} onChange={e => set("district")(e.target.value)} />
            </Field>
            <Field label={t("apply.serviceRequired")} className="sm:col-span-2">
              <Select value={form.serviceCategory} onValueChange={(v) => set("serviceCategory")(v)}>
                <SelectTrigger><SelectValue placeholder={t("apply.selectServicePlaceholder")} /></SelectTrigger>
                <SelectContent>
                  {serviceCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label={t("apply.messageLabel")} className="sm:col-span-2">
              <Textarea required minLength={5} maxLength={500} rows={4} value={form.message} onChange={e => set("message")(e.target.value)} placeholder={t("apply.messagePlaceholder")} />
            </Field>
            <div className="sm:col-span-2">
              <Button type="submit" size="lg" className="w-full">{t("apply.submit")}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
