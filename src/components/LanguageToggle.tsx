import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const next = i18n.language?.startsWith("te") ? "en" : "te";
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => void i18n.changeLanguage(next)}
      className="gap-1.5"
      aria-label="Toggle language"
    >
      <Languages className="h-4 w-4" />
      <span className="font-semibold">{next === "te" ? "తె" : "EN"}</span>
    </Button>
  );
}
