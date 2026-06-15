import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageToggle } from "./LanguageToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu, Search, ShoppingCart,
  Store, Bug, Beaker, Wrench, Leaf, FlaskConical, Stethoscope, Sparkles, Atom,
} from "lucide-react";
import agrikartLogo from "@/assets/agrikart-logo.png";

const topLinks = [
  { to: "/", labelKey: "nav.home" },
  { to: "/about", labelKey: "nav.about" },
  { to: "/services", labelKey: "nav.services" },
  { to: "/drone-services", labelKey: "nav.droneServices" },
  { to: "/tools", labelKey: "nav.tools" },
  { to: "/products", labelKey: "nav.store" },
  { to: "/schemes", labelKey: "nav.schemes" },
] as const;

const categories = [
  { to: "/products", labelKey: "nav.categories.shopAll", Icon: Store },
  { to: "/products", labelKey: "nav.categories.pesticides", Icon: Bug },
  { to: "/products", labelKey: "nav.categories.fertilisers", Icon: Beaker },
  { to: "/products", labelKey: "nav.categories.implements", Icon: Wrench },
  { to: "/products", labelKey: "nav.categories.organic", Icon: Leaf },
  { to: "/products", labelKey: "nav.categories.specialty", Icon: FlaskConical },
  { to: "/products", labelKey: "nav.categories.veterinary", Icon: Stethoscope },
  { to: "/products", labelKey: "nav.categories.seeds", Icon: Sparkles },
  { to: "/products", labelKey: "nav.categories.nano", Icon: Atom },
] as const;

export function Navbar() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background">
      {/* Top row */}
      <div className="container mx-auto flex h-16 items-center gap-3 px-3 sm:gap-4 sm:px-4">
        <Link to="/" className="flex shrink-0 items-center gap-2 group" aria-label={t("brand")}>
          <img
            src={agrikartLogo}
            alt="Agrikart Fintech Pvt. Ltd."
            width={176}
            height={53}
            className="h-11 w-auto sm:h-[3.3rem] transition-transform group-hover:scale-105"
          />
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {topLinks.map(i => (
            <Link key={i.labelKey} to={i.to} className="text-sm font-semibold text-foreground/85 hover:text-primary">
              {t(i.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="relative flex-1 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("nav.searchPlaceholder")}
            className="h-10 rounded-full border-primary/30 bg-muted/40 pl-9 pr-12 text-sm"
          />
          <button
            aria-label="Search"
            className="absolute right-1 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <div className="hidden sm:block"><LanguageToggle /></div>
          <Link to="/portal/bookings" aria-label="Cart" className="relative grid h-9 w-9 place-items-center rounded-full text-foreground/80 hover:bg-muted">
            <ShoppingCart className="h-5 w-5" />
          </Link>
          <Button asChild size="sm" className="hidden gap-1.5 sm:inline-flex">
            <Link to="/apply">{t("nav.applyNow")}</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-8 flex flex-col gap-1">
                {topLinks.map(i => (
                  <Link key={i.labelKey} to={i.to} className="rounded-md px-3 py-2 text-base font-medium hover:bg-muted">
                    {t(i.labelKey)}
                  </Link>
                ))}
                <div className="mt-4 border-t pt-4 flex flex-col gap-2">
                  <LanguageToggle />
                  <Button asChild><Link to="/apply">{t("nav.applyNow")}</Link></Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Category strip */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-2 sm:px-4">
          <ul className="flex items-center gap-1 overflow-x-auto py-2 [scrollbar-width:none] [-ms-overflow-style:none] sm:gap-2 [&::-webkit-scrollbar]:hidden">
            {categories.map(({ labelKey, Icon, to }) => (
              <li key={labelKey} className="shrink-0">
                <Link
                  to={to}
                  className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold hover:bg-primary-foreground/15 sm:text-sm"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-primary-foreground/15">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {t(labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
