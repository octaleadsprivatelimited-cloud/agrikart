import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

export default function Blog() {
  const { t } = useTranslation();
  const posts = t("blog.posts", { returnObjects: true }) as Array<{
    title: string;
    date: string;
    excerpt: string;
  }>;
  return (
    <>
      <PageHeader title={t("blog.title")} subtitle={t("blog.subtitle")} />
      <section className="container mx-auto grid gap-6 px-4 py-16 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => (
          <Card key={i} className="card-lift border-border/60">
            <div className="aspect-[16/10] rounded-t-xl bg-[linear-gradient(135deg,oklch(0.62_0.16_145)_0%,oklch(0.78_0.15_75)_100%)]" />
            <CardContent className="p-6">
              <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" /> {p.date}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
