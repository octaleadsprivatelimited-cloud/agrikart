import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import agrikartLogo from "@/assets/agrikart-logo.png";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-16 border-t border-border/60 bg-muted/40 md:mt-24">
      <div className="container mx-auto grid gap-6 px-4 py-8 md:grid-cols-4 md:gap-10 md:py-12">
        <div className="text-center md:text-left">
          <img
            src={agrikartLogo}
            alt="Agrikart Fintech Pvt. Ltd."
            loading="lazy"
            width={260}
            height={78}
            className="mx-auto h-[4.55rem] w-auto md:mx-0"
          />
          <p className="mt-3 text-sm text-muted-foreground">{t("footer.tagline")}</p>
          <p className="mt-4 text-xs text-muted-foreground">{t("brandFull")}</p>
          <p className="text-xs text-muted-foreground">{t("cin")}</p>
        </div>

        <FooterSection title={t("footer.company")}>
          <li>
            <Link to="/about" className="hover:text-primary">
              {t("nav.about")}
            </Link>
          </li>
          <li>
            <Link to="/careers" className="hover:text-primary">
              {t("nav.careers")}
            </Link>
          </li>
          <li>
            <Link to="/blog" className="hover:text-primary">
              {t("nav.blog")}
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-primary">
              {t("nav.contact")}
            </Link>
          </li>
        </FooterSection>

        <FooterSection title={t("footer.services")}>
          <li>
            <Link to="/services" className="hover:text-primary">
              {t("nav.services")}
            </Link>
          </li>
          <li>
            <Link to="/schemes" className="hover:text-primary">
              {t("nav.schemes")}
            </Link>
          </li>
          <li>
            <Link to="/signup" className="hover:text-primary">
              {t("nav.register")}
            </Link>
          </li>
          <li>
            <Link to="/pay" className="hover:text-primary">
              {t("nav.payNow")}
            </Link>
          </li>
          <li>
            <Link to="/commission" className="hover:text-primary">
              Commission Model
            </Link>
          </li>
          <li>
            <Link to="/faq" className="hover:text-primary">
              {t("nav.faq")}
            </Link>
          </li>
          <li>
            <Link to="/staff/login" className="hover:text-primary">
              Staff Login
            </Link>
          </li>
        </FooterSection>

        <FooterSection title={t("footer.legal")}>
          <li>
            <Link to="/privacy" className="hover:text-primary">
              {t("legal.privacyTitle")}
            </Link>
          </li>
          <li>
            <Link to="/terms" className="hover:text-primary">
              {t("legal.termsTitle")}
            </Link>
          </li>
          <li>
            <Link to="/refund" className="hover:text-primary">
              {t("legal.refundTitle")}
            </Link>
          </li>
        </FooterSection>
      </div>
      <div className="border-t border-border/60">
        <div className="container mx-auto px-4 py-4 text-center text-xs text-muted-foreground md:py-5">
          <p>
            © {new Date().getFullYear()} {t("brandFull")}. {t("footer.rights")}
          </p>
          <p className="mt-1">
            Developed By{" "}
            <a
              href="https://www.octaleads.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary underline"
            >
              OctaLeads Pvt Ltd.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterSection({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/60 py-2 md:border-0 md:py-0">
      {/* Mobile: collapsible header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-sm font-semibold md:hidden"
      >
        <span>{title}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {/* Desktop: static heading */}
      <h4 className="hidden text-sm font-semibold md:block">{title}</h4>
      <ul
        className={`space-y-2 text-sm text-muted-foreground md:mt-3 md:block ${open ? "mt-3 block" : "hidden"}`}
      >
        {children}
      </ul>
    </div>
  );
}
