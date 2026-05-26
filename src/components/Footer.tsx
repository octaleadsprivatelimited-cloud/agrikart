import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Sprout } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/40">
      <div className="container mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Sprout className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">{t("brand")}</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{t("footer.tagline")}</p>
          <p className="mt-4 text-xs text-muted-foreground">{t("brandFull")}</p>
          <p className="text-xs text-muted-foreground">{t("cin")}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">{t("footer.company")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">{t("nav.about")}</Link></li>
            <li><Link to="/careers" className="hover:text-primary">{t("nav.careers")}</Link></li>
            <li><Link to="/blog" className="hover:text-primary">{t("nav.blog")}</Link></li>
            <li><Link to="/contact" className="hover:text-primary">{t("nav.contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">{t("footer.services")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-primary">{t("nav.services")}</Link></li>
            <li><Link to="/faq" className="hover:text-primary">{t("nav.faq")}</Link></li>
            <li><Link to="/staff/login" className="hover:text-primary">Staff Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">{t("footer.legal")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-primary">{t("legal.privacyTitle")}</Link></li>
            <li><Link to="/terms" className="hover:text-primary">{t("legal.termsTitle")}</Link></li>
            <li><Link to="/refund" className="hover:text-primary">{t("legal.refundTitle")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container mx-auto px-4 py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {t("brandFull")}. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
