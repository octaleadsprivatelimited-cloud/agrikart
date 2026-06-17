import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBooking, useCurrentUser } from "@/lib/auth-store";
import { toast } from "sonner";

const serviceKeys = [
  "drone",
  "seeds",
  "pesticides",
  "cold",
  "trade",
  "loans",
  "insurance",
  "schemes",
  "support",
] as const;

export default function BookService() {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !category) return;
    createBooking(user.id, t(`services.items.${category}.title`), description.trim());
    toast.success(t("portal.submitted"));
    void navigate("/portal/bookings");
  };

  return (
    <Card>
      <CardContent className="p-5 sm:p-8">
        <h1 className="text-2xl font-bold">{t("portal.bookService")}</h1>
        <form onSubmit={onSubmit} className="mt-6 grid gap-5">
          <div>
            <Label>{t("portal.chooseService")}</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder={t("portal.chooseService")} />
              </SelectTrigger>
              <SelectContent>
                {serviceKeys.map((k) => (
                  <SelectItem key={k} value={k}>
                    {t(`services.items.${k}.title`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="desc">{t("portal.describe")}</Label>
            <Textarea
              id="desc"
              required
              minLength={5}
              maxLength={1000}
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button type="submit" size="lg" disabled={!category}>
            {t("portal.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
