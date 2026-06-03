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
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/drone-services", label: "Drone Services" },
  { to: "/tools", label: "Tools" },
  { to: "/products", label: "Store" },
  { to: "/schemes", label: "Government" },
] as const;

const categories = [
  { to: "/products", label: "Shop All", Icon: Store },
  { to: "/products", label: "Pesticides", Icon: Bug },
  { to: "/products", label: "Fertilisers", Icon: Beaker },
  { to: "/products", label: "Implements", Icon: Wrench },
  { to: "/products", label: "Organic", Icon: Leaf },
  { to: "/products", label: "Specialty", Icon: FlaskConical },
  { to: "/products", label: "Veterinary", Icon: Stethoscope },
  { to: "/products", label: "Seeds", Icon: Sparkles },
  { to: "/products", label: "Nano", Icon: Atom },
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
            <Link key={i.label} to={i.to} className="text-sm font-semibold text-foreground/85 hover:text-primary">
              {i.label}
            </Link>
          ))}
        </nav>

        <div className="relative flex-1 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for products, crops…"
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
            <Link to="/apply">Apply Now</Link>
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
                  <Link key={i.label} to={i.to} className="rounded-md px-3 py-2 text-base font-medium hover:bg-muted">
                    {i.label}
                  </Link>
                ))}
                <div className="mt-4 border-t pt-4 flex flex-col gap-2">
                  <LanguageToggle />
                  <Button asChild><Link to="/apply">Apply Now</Link></Button>
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
            {categories.map(({ label, Icon, to }) => (
              <li key={label} className="shrink-0">
                <Link
                  to={to}
                  className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold hover:bg-primary-foreground/15 sm:text-sm"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-primary-foreground/15">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
