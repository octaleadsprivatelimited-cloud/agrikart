import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "./LanguageToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sprout, LogOut } from "lucide-react";
import { logout, useCurrentUser } from "@/lib/auth-store";

const linkCls = "text-sm font-medium text-foreground/80 hover:text-primary transition-colors";

export function Navbar() {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const navigate = useNavigate();

  const items: Array<{ to: string; label: string }> = [
    { to: "/", label: t("nav.home") },
    { to: "/services", label: t("nav.services") },
    { to: "/about", label: t("nav.about") },
    { to: "/blog", label: t("nav.blog") },
    { to: "/faq", label: t("nav.faq") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
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
          {user ? (
            <>
              <Button asChild size="sm" variant="ghost" className="hidden sm:inline-flex">
                <Link to="/portal/dashboard">{t("nav.portal")}</Link>
              </Button>
              <Button size="sm" variant="outline" onClick={() => { logout(); void navigate({ to: "/" }); }}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t("nav.logout")}</span>
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="sm" variant="ghost" className="hidden sm:inline-flex">
                <Link to="/login">{t("nav.login")}</Link>
              </Button>
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link to="/signup">{t("nav.signup")}</Link>
              </Button>
            </>
          )}

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
                  {user ? (
                    <Button asChild><Link to="/portal/dashboard">{t("nav.portal")}</Link></Button>
                  ) : (
                    <>
                      <Button asChild variant="outline"><Link to="/login">{t("nav.login")}</Link></Button>
                      <Button asChild><Link to="/signup">{t("nav.signup")}</Link></Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
