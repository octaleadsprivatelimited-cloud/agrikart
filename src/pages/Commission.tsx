import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";

export default function Commission() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader title={t("commission.title")} />
      <section className="container mx-auto max-w-3xl px-4 py-12">
        <Card>
          <CardContent className="p-8">
            <Wallet className="h-8 w-8 text-primary" />
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t("commission.body")}</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
