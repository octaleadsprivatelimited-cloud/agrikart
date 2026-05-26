import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  const { t } = useTranslation();
  const items = t("faq.items", { returnObjects: true }) as Array<{ q: string; a: string }>;
  return (
    <>
      <PageHeader title={t("faq.title")} />
      <section className="container mx-auto max-w-3xl px-4 py-16">
        <Accordion type="single" collapsible className="w-full">
          {items.map((it, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-semibold">{it.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
