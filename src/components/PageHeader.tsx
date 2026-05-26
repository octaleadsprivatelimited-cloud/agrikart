export function PageHeader({ title, subtitle, eyebrow }: { title: string; subtitle?: string; eyebrow?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-hero-gradient">
      <div className="absolute inset-0 bg-grain opacity-40 pointer-events-none" />
      <div className="container relative mx-auto px-4 py-14 md:py-20">
        {eyebrow && (
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary animate-fade-up">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-5xl animate-fade-up">
          <span className="text-gradient-brand">{title}</span>
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg animate-fade-up">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
