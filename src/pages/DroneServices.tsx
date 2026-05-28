import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  SprayCan, Sprout, Camera, Map, Gauge, ShieldCheck,
  Clock, Leaf, IndianRupee, CheckCircle2, ArrowRight, Phone,
} from "lucide-react";

const services = [
  { Icon: SprayCan, title: "Drone Spraying", desc: "Precision spraying of pesticides, fungicides & herbicides — uniform coverage with up to 90% less water." },
  { Icon: Sprout, title: "Nano Fertiliser Spraying", desc: "Foliar application of nano urea & nano DAP for faster nutrient uptake and higher yield." },
  { Icon: Camera, title: "Crop Health Imaging", desc: "Aerial multispectral imaging to detect stress, pests & disease before they spread." },
  { Icon: Map, title: "Field Mapping & Survey", desc: "High-resolution field maps for planning, plot demarcation and yield estimation." },
  { Icon: Gauge, title: "Seed Broadcasting", desc: "Drone-based seed and granule spreading for cover crops and large plots." },
  { Icon: ShieldCheck, title: "Locust & Pest Control", desc: "Rapid-response aerial spraying for outbreak control across large acreages." },
];

const benefits = [
  { Icon: Clock, title: "10x Faster", desc: "Spray 1 acre in 7–10 minutes vs hours by hand." },
  { Icon: Leaf, title: "Eco-Friendly", desc: "Up to 30% less chemical and 90% less water used per acre." },
  { Icon: ShieldCheck, title: "Operator Safe", desc: "No human exposure to chemicals during spraying." },
  { Icon: IndianRupee, title: "Cost Effective", desc: "Save on labour, water and input costs every season." },
];

const pricing = [
  { name: "Basic Plan", price: "₹1,499", unit: "/ acre", features: ["Pesticide / fungicide spray", "Trained DGCA-certified pilot", "Standard nozzle setup", "Service report included"] },
  { name: "Premium Plan", price: "₹4,999", unit: "/ acre", features: ["Nano nutrient + pesticide spray", "Multispectral crop imaging", "Digital field map & health report", "Priority scheduling & advisory"], featured: true },
];

const steps = [
  { n: "01", title: "Book a slot", desc: "Submit your request with crop, acreage and location." },
  { n: "02", title: "Field survey", desc: "Our team verifies the field and confirms schedule." },
  { n: "03", title: "Drone operation", desc: "Certified pilot performs the spray or mapping." },
  { n: "04", title: "Report & support", desc: "Receive a service report and follow-up advisory." },
];

export default function DroneServices() {
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium">("premium");
  const navigate = useNavigate();
  const proceed = () => navigate(`/apply?service=drone&plan=${selectedPlan}`);

  return (
    <>
      <PageHeader
        eyebrow="DGCA-certified pilots"
        title="Drone Services for Modern Farming"
        subtitle="Precision spraying, crop health imaging and field mapping — book trained drone operators on demand."
      />

      {/* CTA strip */}
      <section className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-lg font-bold sm:text-xl">Book a drone service for your farm</h2>
            <p className="mt-1 text-sm text-muted-foreground">Trained pilots, insured operations, transparent per-acre pricing.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild><Link to="/apply">Book Now <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
            <Button asChild variant="outline"><Link to="/contact"><Phone className="mr-1 h-4 w-4" /> Talk to us</Link></Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container mx-auto px-4 py-8 sm:py-12">
        <h2 className="text-xl font-bold sm:text-2xl">What we offer</h2>
        <p className="mt-1 text-sm text-muted-foreground">End-to-end drone services tailored for Indian farms.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ Icon, title, desc }) => (
            <Card key={title} className="card-lift border-border/60">
              <CardContent className="flex flex-col gap-3 p-5 sm:p-6">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-muted/30 border-y border-border/60">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <h2 className="text-xl font-bold sm:text-2xl">Why farmers choose drones</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-border/60 bg-background p-5">
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-3 text-base font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-8 sm:py-12">
        <h2 className="text-xl font-bold sm:text-2xl">Transparent per-acre pricing</h2>
        <p className="mt-1 text-sm text-muted-foreground">Final pricing may vary based on crop, terrain and acreage.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 md:max-w-3xl md:mx-auto">
          {pricing.map(p => (
            <Card key={p.name} className={`relative border-border/60 ${p.featured ? "border-primary/60 shadow-elegant" : ""}`}>
              {p.featured && (
                <span className="absolute -top-3 left-5 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                  Most Popular
                </span>
              )}
              <CardContent className="p-6">
                <h3 className="text-base font-semibold">{p.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold">{p.price}</span>
                  <span className="text-sm text-muted-foreground">{p.unit}</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-5 w-full" variant={p.featured ? "default" : "outline"}>
                  <Link to="/apply">Book {p.name}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Plan Selection */}
      <section className="container mx-auto px-4 pb-8 sm:pb-12">
        <Card className="border-border/60 md:max-w-3xl md:mx-auto">
          <CardContent className="p-5 sm:p-6">
            <h2 className="text-lg font-bold sm:text-xl">Choose your plan & proceed to booking</h2>
            <p className="mt-1 text-sm text-muted-foreground">Select a plan below and continue to fill in your farm details.</p>
            <RadioGroup
              value={selectedPlan}
              onValueChange={(v) => setSelectedPlan(v as "basic" | "premium")}
              className="mt-5 grid gap-3 sm:grid-cols-2"
            >
              {pricing.map(p => {
                const value = p.name.toLowerCase().includes("premium") ? "premium" : "basic";
                const active = selectedPlan === value;
                return (
                  <Label
                    key={p.name}
                    htmlFor={`plan-${value}`}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${active ? "border-primary bg-primary/5 ring-1 ring-primary/40" : "border-border/60 hover:border-primary/40"}`}
                  >
                    <RadioGroupItem id={`plan-${value}`} value={value} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-base font-semibold">{p.name}</span>
                        <span className="text-sm font-bold text-primary">{p.price}<span className="text-xs font-normal text-muted-foreground">{p.unit}</span></span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{p.features[0]}</p>
                    </div>
                  </Label>
                );
              })}
            </RadioGroup>
            <Button onClick={proceed} size="lg" className="mt-5 w-full sm:w-auto">
              Proceed to Booking <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>


      {/* Process */}
      <section className="bg-muted/30 border-t border-border/60">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <h2 className="text-xl font-bold sm:text-2xl">How it works</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(s => (
              <div key={s.n} className="rounded-xl border border-border/60 bg-background p-5">
                <span className="text-xs font-bold text-primary">{s.n}</span>
                <h3 className="mt-2 text-base font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Button asChild size="lg"><Link to="/apply">Request Drone Service</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/services">View all services</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
