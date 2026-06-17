export function PageHeader({
  title,
  subtitle,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-hero-gradient">
      <div className="absolute inset-0 bg-grain opacity-40 pointer-events-none" />
      <div className="container relative mx-auto px-4 py-8 sm:py-12 md:py-20">
        {eyebrow && (
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary animate-fade-up sm:text-xs">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight sm:mt-3 sm:text-3xl md:text-5xl animate-fade-up">
          <span className="text-gradient-brand">{title}</span>
        </h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:mt-3 sm:text-base md:text-lg animate-fade-up">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
