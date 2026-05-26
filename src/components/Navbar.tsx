import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "./LanguageToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sprout } from "lucide-react";

const linkCls = "text-sm font-medium text-foreground/80 hover:text-primary transition-colors";

export function Navbar() {
  const { t } = useTranslation();

  const items: Array<{ to: string; label: string }> = [
    { to: "/", label: t("nav.home") },
    { to: "/services", label: t("nav.services") },
    { to: "/schemes", label: t("nav.schemes") },
    { to: "/about", label: t("nav.about") },
    { to: "/faq", label: t("nav.faq") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/75 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-cta-gradient text-primary-foreground shadow-elegant transition-transform group-hover:scale-105">
            <Sprout className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">{t("brand")}</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {items.map(i => (
            <Link key={i.to} to={i.to} className={linkCls} activeProps={{ className: "text-primary" }}>
              {i.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
            <Link to="/signup">{t("nav.register")}</Link>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/pay">{t("nav.payNow")}</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-8 flex flex-col gap-1">
                {items.map(i => (
                  <Link key={i.to} to={i.to} className="rounded-md px-3 py-2 text-base font-medium hover:bg-muted">
                    {i.label}
                  </Link>
                ))}
                <div className="mt-4 border-t pt-4 flex flex-col gap-2">
                  <Button asChild variant="outline"><Link to="/signup">{t("nav.register")}</Link></Button>
                  <Button asChild><Link to="/pay">{t("nav.payNow")}</Link></Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
