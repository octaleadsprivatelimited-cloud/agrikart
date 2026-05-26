import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout } from "lucide-react";
import { login } from "@/lib/auth-store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      login(email.trim(), password);
      void navigate({ to: "/portal/dashboard" });
    } catch {
      toast.error(t("auth.invalidLogin"));
    }
  };

  return (
    <section className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground"><Sprout className="h-6 w-6" /></div>
            <h1 className="mt-4 text-2xl font-bold">{t("auth.loginTitle")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("auth.loginSubtitle")}</p>
          </div>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div>
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
            </div>
            <div>
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" size="lg">{t("auth.loginBtn")}</Button>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            {t("auth.noAccount")} <Link to="/signup" className="font-semibold text-primary hover:underline">{t("nav.signup")}</Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
