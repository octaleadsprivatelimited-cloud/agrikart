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

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  return (
    <>
      <PageHeader title={t("contact.title")} subtitle={t("contact.subtitle")} />
      <section className="container mx-auto grid gap-6 px-4 py-10 sm:gap-8 sm:py-16 md:grid-cols-3">
        <div className="space-y-3 sm:space-y-4">
          {[
            { Icon: MapPin, label: t("contact.address") },
            { Icon: Phone, label: "+91 99999 99999" },
            { Icon: Mail, label: "support@agrifincart.com" },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <p className="pt-2 text-sm break-words">{label}</p>
            </div>
          ))}
        </div>
        <Card className="md:col-span-2">
          <CardContent className="p-5 sm:p-8">
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
              <Button type="submit" size="lg" className="w-full sm:w-auto sm:justify-self-start">{t("contact.submit")}</Button>
            </form>
          </CardContent>
        </Card>
      </section>
      <section className="container mx-auto px-4 pb-10 sm:pb-16">
        <div className="overflow-hidden rounded-2xl border border-border/60 shadow-elegant">
          <iframe
            title="AgriKart Fin location"
            src="https://www.google.com/maps?q=18.425097,79.135345&z=17&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block aspect-[4/3] w-full border-0 sm:aspect-[16/9] sm:h-[400px]"
          />
        </div>
        <div className="mt-3 text-center">
          <a
            href="https://maps.app.goo.gl/i8H2cUypjBJYX5ay9"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Open in Google Maps →
          </a>
        </div>
      </section>
    </>
  );
}
