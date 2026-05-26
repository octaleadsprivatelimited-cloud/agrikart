export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="border-b border-border/60 bg-hero-gradient">
      <div className="container mx-auto px-4 py-14 md:py-20">
        <h1 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">{subtitle}</p>}
      </div>
    </section>
  );
}
