import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MapPin, Phone, Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({ component: Contact });

function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  return (
    <>
      <PageHeader title={t("contact.title")} subtitle={t("contact.subtitle")} />
      <section className="container mx-auto grid gap-8 px-4 py-16 md:grid-cols-3">
        <div className="space-y-4">
          {[
            { Icon: MapPin, label: t("contact.address") },
            { Icon: Phone, label: "+91 99999 99999" },
            { Icon: Mail, label: "support@agrikartfin.com" },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <p className="pt-2 text-sm">{label}</p>
            </div>
          ))}
        </div>
        <Card className="md:col-span-2">
          <CardContent className="p-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success(t("contact.sent"));
                setForm({ name: "", phone: "", message: "" });
              }}
              className="grid gap-4"
            >
              <div>
                <Label htmlFor="name">{t("contact.nameLabel")}</Label>
                <Input id="name" required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="phone">{t("contact.phoneLabel")}</Label>
                <Input id="phone" required pattern="[0-9]{10}" maxLength={10} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="message">{t("contact.messageLabel")}</Label>
                <Textarea id="message" required maxLength={1000} rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <Button type="submit" size="lg">{t("contact.submit")}</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
