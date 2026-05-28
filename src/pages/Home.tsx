import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Banknote, ShieldCheck, Sprout, Snowflake, Ship, ArrowRight,
  Timer, BadgeCheck, Leaf, Users, Headphones, SprayCan, Package,
  Handshake, MapPin, IndianRupee, Star, PlayCircle,
} from "lucide-react";
import { useTestimonials, useGallery, useVideos, usePartners } from "@/lib/content-store";
import imgLoans from "@/assets/service-loans.jpg";
import imgInsurance from "@/assets/service-insurance.jpg";
import imgSeeds from "@/assets/service-seeds.jpg";
import imgCold from "@/assets/service-cold.jpg";
import imgTrade from "@/assets/service-trade.jpg";
import heroFarmer from "@/assets/farmer-cutout.png";
import heroFieldBg from "@/assets/hero-field-bg.jpg";

const heroIcons = [
  { label: "Loans Assistance", Icon: Banknote, to: "/services/loans" },
  { label: "Insurance", Icon: ShieldCheck, to: "/services/insurance" },
  { label: "Seeds, Pesticides & Fertilisers", Icon: Sprout, to: "/services/seeds" },
  { label: "Drone Services", Icon: SprayCan, to: "/drone-services" },
  { label: "Agri Inputs", Icon: Package, to: "/products" },
  { label: "Cold Storage, Import & Export", Icon: Snowflake, to: "/services/cold" },
] as const;

const serviceCards = [
  { title: "Loan Assistance Services", desc: "Easy & quick loans for crops, agriculture equipment and all other needs.", Icon: Banknote, img: imgLoans, to: "/services/loans" },
  { title: "Insurance Services", desc: "Crop insurance, health insurance, equipment insurance and more.", Icon: ShieldCheck, img: imgInsurance, to: "/services/insurance" },
  { title: "Seeds, Pesticides & Fertilisers", desc: "High quality seeds, pesticides and fertilisers at best prices.", Icon: Sprout, img: imgSeeds, to: "/services/seeds" },
  { title: "Drone Services", desc: "Spraying, surveying, crop monitoring and other drone based services.", Icon: SprayCan, img: imgTrade, to: "/drone-services" },
  { title: "Cold Storage Services", desc: "Modern cold storage services for better storage and quality preservation.", Icon: Snowflake, img: imgCold, to: "/services/cold" },
  { title: "Import & Export Services", desc: "Import and export of agriculture products and allied goods.", Icon: Ship, img: imgTrade, to: "/services/trade" },
] as const;

const whyItems = [
  { Icon: Timer, label: "Fast & Easy Loan Support" },
  { Icon: BadgeCheck, label: "Trusted Insurance Assistance" },
  { Icon: Leaf, label: "Quality Agri Products" },
  { Icon: Users, label: "Village Level Field Executives" },
  { Icon: Headphones, label: "Dedicated Support Team" },
] as const;

const stats = [
  { Icon: Users, value: "10,000+", label: "Farmers Registered" },
  { Icon: MapPin, value: "250+", label: "Villages Covered" },
  { Icon: IndianRupee, value: "50Cr+", label: "Loans Processed" },
  { Icon: Handshake, value: "100+", label: "Partner Institutions" },
] as const;

export default function Home() {
  const testimonials = useTestimonials();
  const gallery = useGallery();
  const videos = useVideos();
  const partners = usePartners();
  return (
    <>
      {/* HERO — One Stop Digital Platform */}
      <section className="container mx-auto px-3 pt-4 sm:px-4 sm:pt-6">
        <div className="relative overflow-hidden rounded-2xl shadow-elegant ring-1 ring-border/60">
          {/* Background field + sky */}
          <div className="absolute inset-0">
            <img
              src={heroFieldBg}
              alt=""
              aria-hidden="true"
              width={1536}
              height={896}
              className="h-full w-full object-cover"
            />
            {/* Soft left fade for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/55 to-transparent md:from-background/80 md:via-background/30" />
          </div>

          <div className="relative grid items-end gap-4 px-5 pt-8 sm:px-8 sm:pt-12 md:grid-cols-2 md:gap-6 md:px-12 md:pt-14">
            {/* Text */}
            <div className="animate-fade-up max-w-xl pb-8 sm:pb-12 md:pb-14">
              <h1 className="text-balance text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
                One Stop Digital Platform{" "}
                <span className="text-primary">for Farmers</span>
              </h1>
              <p className="mt-4 max-w-md text-sm font-medium text-foreground/80 sm:text-base">
                Loans, Insurance, Agri Inputs, Technology &amp; More — All in One Place.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 sm:mt-7 sm:gap-3">
                <Button asChild size="lg" className="gap-2 bg-primary text-primary-foreground shadow-elegant hover:bg-primary/90">
                  <Link to="/apply">Apply for Loan <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" className="gap-2 bg-[hsl(45_95%_55%)] text-foreground shadow-elegant hover:bg-[hsl(45_95%_50%)]">
                  <Link to="/careers">Join as Field Executive</Link>
                </Button>
              </div>
            </div>

            {/* Farmer cutout */}
            <div className="relative hidden md:flex md:justify-end md:items-end">
              <img
                src={heroFarmer}
                alt="Indian farmer holding paddy"
                width={832}
                height={1216}
                className="h-[460px] w-auto object-contain object-bottom drop-shadow-2xl lg:h-[540px] xl:h-[600px]"
              />
            </div>
          </div>
        </div>

        {/* Service icons row */}
        <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-3 md:grid-cols-6">
          {heroIcons.map(({ label, Icon, to }) => (
            <Link key={label} to={to}>
              <div className="flex h-full flex-col items-center gap-2 rounded-2xl border border-border/60 bg-primary/5 p-3 text-center transition hover:border-primary/40 hover:bg-primary/10 hover:shadow-elegant sm:p-4">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-background text-primary shadow-sm sm:h-14 sm:w-14">
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.75} />
                </span>
                <span className="text-[11px] font-semibold leading-tight text-foreground sm:text-xs">{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PARTNER MARQUEE — auto-scrolling logos */}
      {partners.length > 0 && (
        <section className="border-y border-border/60 bg-muted/30 py-6 sm:py-8">
          <div className="container mx-auto px-4">
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:mb-5 sm:text-sm">
              Trusted by leading partners
            </p>
            <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="flex w-max animate-marquee gap-8 sm:gap-12 group-hover:[animation-play-state:paused]">
                {[...partners, ...partners].map((p, idx) => {
                  const isImage = p.logo.startsWith("data:") || p.logo.startsWith("http");
                  const inner = (
                    <div className="grid h-14 w-32 shrink-0 place-items-center sm:h-16 sm:w-40">
                      {isImage
                        ? <img src={p.logo} alt={p.name} className="max-h-12 max-w-full object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0" />
                        : <span className="text-3xl opacity-80 transition hover:opacity-100 sm:text-4xl">{p.logo}</span>}
                    </div>
                  );
                  return p.website && p.website !== "#"
                    ? <a key={`${p.id}-${idx}`} href={p.website} target="_blank" rel="noreferrer" title={p.name}>{inner}</a>
                    : <div key={`${p.id}-${idx}`} title={p.name}>{inner}</div>;
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SERVICES — display in sequence */}
      <section className="container mx-auto px-4 py-10 sm:py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-2xl font-bold sm:text-3xl md:text-4xl">Our Services</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
            A complete suite of financial &amp; agri services built for Indian farmers.
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {serviceCards.map(({ title, desc, Icon, img, to }, i) => (
            <Link key={title} to={to} className="block">
              <Card className="group card-lift h-full overflow-hidden border-border/60">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={img}
                    alt={title}
                    loading={i < 2 ? "eager" : "lazy"}
                    width={768}
                    height={480}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                  <span className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-lg bg-background/90 text-primary shadow-sm backdrop-blur">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="absolute right-3 top-3 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-bold text-primary shadow-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <CardContent className="p-4 sm:p-5">
                  <h3 className="text-base font-semibold sm:text-lg">{title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center sm:mt-8">
          <Button asChild variant="outline" size="sm" className="sm:size-default">
            <Link to="/services">View all services →</Link>
          </Button>
        </div>
      </section>

      {/* WHY CHOOSE AGRIKART */}
      <section className="bg-muted/40 py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-2xl font-bold sm:text-3xl md:text-4xl">Why Choose Agrikart?</h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Trusted by thousands of farmers across India for quality, speed and transparency.
            </p>
          </div>
          <ul className="mx-auto mt-6 grid max-w-5xl gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {whyItems.map(({ Icon, label }) => (
              <li key={label} className="flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-center transition hover:border-primary/40 hover:shadow-elegant sm:p-5">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-xs font-semibold leading-tight sm:text-sm">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TRUST & STATISTICS COUNTERS */}
      <section className="container mx-auto px-4 py-10 sm:py-14 md:py-20">
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          {stats.map(({ Icon, value, label }) => (
            <div key={label} className="rounded-2xl border border-border/60 bg-card p-5 text-center shadow-sm sm:p-6">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </span>
              <p className="mt-3 text-2xl font-extrabold text-primary sm:text-3xl">{value}</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="bg-muted/40 py-10 sm:py-14 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-2xl font-bold sm:text-3xl md:text-4xl">What Farmers Say</h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">Real stories from farmers we've supported.</p>
            </div>
            <div className="mt-6 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {testimonials.slice(0, 6).map(t => (
                <Card key={t.id} className="h-full">
                  <CardContent className="space-y-3 p-5">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/85">"{t.quote}"</p>
                    <div className="flex items-center gap-3 pt-2">
                      {t.avatar ? (
                        <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {t.name.charAt(0)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{t.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {gallery.length > 0 && (
        <section className="container mx-auto px-4 py-10 sm:py-14 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-2xl font-bold sm:text-3xl md:text-4xl">Gallery</h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">Moments from the field.</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-10 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
            {gallery.slice(0, 8).map(g => (
              <div key={g.id} className="group relative aspect-square overflow-hidden rounded-xl border border-border/60">
                <img src={g.image} alt={g.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-3 text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-xs font-semibold">{g.title}</p>
                  {g.caption && <p className="text-[10px] opacity-90">{g.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* VIDEOS */}
      {videos.length > 0 && (
        <section className="bg-muted/40 py-10 sm:py-14 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-2xl font-bold sm:text-3xl md:text-4xl">Watch & Learn</h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">Short videos about our services and farmer stories.</p>
            </div>
            <div className="mt-6 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
              {videos.slice(0, 6).map(v => (
                <Card key={v.id} className="overflow-hidden">
                  <a href={`https://www.youtube.com/watch?v=${v.youtubeId}`} target="_blank" rel="noreferrer" className="group block">
                    <div className="relative aspect-video bg-muted">
                      <img src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`} alt={v.title} loading="lazy" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 grid place-items-center bg-black/30 transition group-hover:bg-black/50">
                        <PlayCircle className="h-14 w-14 text-white drop-shadow-lg" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="font-semibold">{v.title}</p>
                      {v.description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{v.description}</p>}
                    </CardContent>
                  </a>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PARTNERS */}
      {partners.length > 0 && (
        <section className="container mx-auto px-4 py-10 sm:py-14 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-2xl font-bold sm:text-3xl md:text-4xl">Our Partners</h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">Trusted institutions and brands we work with.</p>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 sm:mt-10 sm:grid-cols-4 sm:gap-4 md:grid-cols-6">
            {partners.map(p => {
              const isImage = p.logo.startsWith("data:") || p.logo.startsWith("http");
              const inner = (
                <div className="grid h-20 w-full place-items-center rounded-xl border border-border/60 bg-card p-3 transition hover:border-primary/40 hover:shadow-elegant">
                  {isImage
                    ? <img src={p.logo} alt={p.name} className="max-h-12 max-w-full object-contain grayscale transition hover:grayscale-0" />
                    : <span className="text-3xl">{p.logo}</span>}
                </div>
              );
              return p.website
                ? <a key={p.id} href={p.website} target="_blank" rel="noreferrer" title={p.name}>{inner}</a>
                : <div key={p.id} title={p.name}>{inner}</div>;
            })}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container mx-auto px-4 pb-10 sm:pb-14 md:pb-20">
        <div className="relative overflow-hidden rounded-2xl bg-cta-gradient px-5 py-8 text-primary-foreground shadow-glow sm:px-6 sm:py-12 md:px-12 md:py-16">
          <div className="absolute inset-0 bg-grain opacity-25 pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-balance text-2xl font-bold sm:text-3xl md:text-4xl">Ready to grow with Agrikart?</h2>
            <p className="mt-2 text-sm text-primary-foreground/85 sm:mt-3 sm:text-base">
              Apply for a service in minutes — our team will reach out to assist you.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
              <Button asChild size="lg" variant="secondary" className="shadow-elegant">
                <Link to="/apply">Apply Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
