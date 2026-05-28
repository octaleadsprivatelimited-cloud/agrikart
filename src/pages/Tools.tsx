import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { SprayCan, Leaf, Stethoscope, Calculator, CloudSun, Sprout, Headphones, PlayCircle } from "lucide-react";

const tools = [
  { label: "Crop Doctor", desc: "Diagnose crop diseases with expert guidance.", Icon: Leaf, to: "/services/seeds" },
  { label: "Spraying Service", desc: "Book drone & manual spraying.", Icon: SprayCan, to: "/services/schemes" },
  { label: "Veterinary Help", desc: "Connect with vets for livestock care.", Icon: Stethoscope, to: "/support" },
  { label: "Cost Calculator", desc: "Estimate input costs for your farm.", Icon: Calculator, to: "/pay" },
  { label: "Weather Advisory", desc: "Local weather and crop guidance.", Icon: CloudSun, to: "/blog" },
  { label: "My Crops", desc: "Track your crop cycle and bookings.", Icon: Sprout, to: "/portal/dashboard" },
  { label: "Ask an Expert", desc: "Talk to an agronomist.", Icon: Headphones, to: "/support" },
  { label: "Agri Videos", desc: "Learn farming best practices.", Icon: PlayCircle, to: "/blog" },
];

export default function Tools() {
  return (
    <>
      <PageHeader title="Farmer Tools" subtitle="Practical tools and services to help you grow better." />
      <section className="container mx-auto grid gap-4 px-4 py-12 sm:grid-cols-2 md:py-16 lg:grid-cols-4">
        {tools.map(({ label, desc, Icon, to }) => (
          <Link key={label} to={to} className="block">
            <Card className="card-lift h-full border-border/60">
              <CardContent className="flex flex-col gap-3 p-6">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold">{label}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </>
  );
}
