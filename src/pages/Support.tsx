import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, FileText, LifeBuoy, BookOpen, Sprout } from "lucide-react";

const channels = [
  {
    Icon: Phone,
    title: "Call Helpline",
    body: "10am – 7pm, every day. Telugu & English.",
    action: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    Icon: MessageCircle,
    title: "WhatsApp Chat",
    body: "Send your crop photo and we will respond within 2 hours.",
    action: "Chat on WhatsApp",
    href: "https://wa.me/919876543210",
  },
  {
    Icon: LifeBuoy,
    title: "Raise a Ticket",
    body: "Login to your dashboard to raise an order or product ticket.",
    action: "Go to dashboard",
    href: "/portal/dashboard",
  },
];

const topics = [
  {
    Icon: Sprout,
    title: "Crop advice",
    text: "Get personalised recommendations for paddy, cotton, chilli, maize, vegetables and orchard crops.",
  },
  {
    Icon: BookOpen,
    title: "Usage guides",
    text: "Step-by-step instructions for safe handling of pesticides, fertilizers and tools.",
  },
  {
    Icon: FileText,
    title: "Order & invoice help",
    text: "Track delivery, reschedule, download invoices and request returns.",
  },
];

export default function Support() {
  return (
    <>
      <PageHeader
        eyebrow="Farmer Support"
        title="We're here to help, every step"
        subtitle="Talk to our agronomy team, get crop-wise product suggestions and raise tickets — in your language."
      />

      <section className="container mx-auto grid gap-6 px-4 py-10 md:grid-cols-3">
        {channels.map(({ Icon, title, body, action, href }) => (
          <Card key={title}>
            <CardContent className="p-6">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              <Button asChild variant="outline" className="mt-4 w-full">
                {href.startsWith("/") ? (
                  <Link to={href}>{action}</Link>
                ) : (
                  <a href={href} target="_blank" rel="noreferrer">
                    {action}
                  </a>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="container mx-auto grid gap-6 px-4 pb-16 md:grid-cols-3">
        {topics.map(({ Icon, title, text }) => (
          <div key={title} className="rounded-xl border bg-card p-6">
            <Icon className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>
    </>
  );
}
