import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBookings, useCurrentUser } from "@/lib/auth-store";
import { StatusPill } from "../staff/Dashboard";
import { ExternalLink, PlusCircle } from "lucide-react";


export default function MyBookings() {
  const { t } = useTranslation();
  const user = useCurrentUser();
  const bookings = useBookings(user?.id);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{t("portal.myBookings")}</h1>
        <Button asChild><Link to="/portal/book"><PlusCircle className="h-4 w-4" /> {t("portal.bookService")}</Link></Button>
      </div>

      {bookings.length === 0 ? (
        <Card className="mt-6"><CardContent className="p-8 text-center text-muted-foreground">{t("portal.empty")}</CardContent></Card>
      ) : (
        <div className="mt-6 grid gap-4">
          {bookings.map(b => (
            <Card key={b.id}>
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{b.serviceCategory}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("portal.date")}: {new Date(b.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <StatusPill status={b.status} />
                </div>
                <p className="mt-3 text-sm text-foreground/80">{b.description}</p>
                {b.status === "Approved" && b.paymentLink && (
                  <a
                    href={b.paymentLink}
                    target="_blank" rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    {t("portal.payment")} <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
