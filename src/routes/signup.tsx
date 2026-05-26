import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout } from "lucide-react";
import { signup } from "@/lib/auth-store";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({ component: SignupPage });

function SignupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", mobile: "", aadhaar: "",
    village: "", district: "", landSize: "", crops: "",
  });
  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      signup({ ...form, name: form.name.trim(), email: form.email.trim() });
      toast.success("Account created!");
      void navigate({ to: "/portal/dashboard" });
    } catch (err) {
      if ((err as Error).message === "EMAIL_EXISTS") toast.error(t("auth.emailExists"));
      else toast.error("Something went wrong.");
    }
  };

  return (
    <section className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground"><Sprout className="h-6 w-6" /></div>
            <h1 className="mt-4 text-2xl font-bold">{t("auth.signupTitle")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("auth.signupSubtitle")}</p>
          </div>
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
            <Field label={t("auth.name")} id="name"><Input id="name" required maxLength={100} value={form.name} onChange={update("name")} /></Field>
            <Field label={t("auth.mobile")} id="mobile"><Input id="mobile" required pattern="[0-9]{10}" maxLength={10} value={form.mobile} onChange={update("mobile")} /></Field>
            <Field label={t("auth.email")} id="email" className="sm:col-span-2"><Input id="email" type="email" required maxLength={255} value={form.email} onChange={update("email")} /></Field>
            <Field label={t("auth.password")} id="password" className="sm:col-span-2"><Input id="password" type="password" required minLength={6} value={form.password} onChange={update("password")} /></Field>
            <Field label={t("auth.aadhaar")} id="aadhaar" className="sm:col-span-2"><Input id="aadhaar" pattern="[0-9]{12}" maxLength={12} value={form.aadhaar} onChange={update("aadhaar")} /></Field>
            <Field label={t("auth.village")} id="village"><Input id="village" required maxLength={100} value={form.village} onChange={update("village")} /></Field>
            <Field label={t("auth.district")} id="district"><Input id="district" required maxLength={100} value={form.district} onChange={update("district")} /></Field>
            <Field label={t("auth.landSize")} id="land"><Input id="land" required type="number" min="0" step="0.1" value={form.landSize} onChange={update("landSize")} /></Field>
            <Field label={t("auth.crops")} id="crops"><Input id="crops" required maxLength={200} value={form.crops} onChange={update("crops")} placeholder="Cotton, Paddy, Chilli" /></Field>
            <div className="sm:col-span-2">
              <Button type="submit" size="lg" className="w-full">{t("auth.signupBtn")}</Button>
            </div>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            {t("auth.haveAccount")} <Link to="/login" className="font-semibold text-primary hover:underline">{t("nav.login")}</Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

function Field({ label, id, className, children }: { label: string; id: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
