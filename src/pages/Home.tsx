import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Banknote, ShieldCheck, Sprout, Snowflake, Ship, ArrowRight,
  Timer, BadgeCheck, Leaf, Users, Headphones, SprayCan, Package,
  Handshake, MapPin, IndianRupee, Star, PlayCircle, Quote, HelpCircle, Plus,
} from "lucide-react";
import { useTestimonials, useGallery, useVideos, usePartners } from "@/lib/content-store";
import imgValues from "@/assets/about-values.jpg";
import imgMission from "@/assets/about-mission.jpg";
import imgLoans from "@/assets/service-loans.jpg";
import imgInsurance from "@/assets/service-insurance.jpg";
import imgSeeds from "@/assets/service-seeds.jpg";
import imgCold from "@/assets/service-cold.jpg";
import imgTrade from "@/assets/service-trade.jpg";
import imgDrone from "@/assets/service-drone.jpg";
import heroFarmer from "@/assets/farmer-family-cutout.png";
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
  { title: "Drone Services", desc: "Spraying, surveying, crop monitoring and other drone based services.", Icon: SprayCan, img: imgDrone, to: "/drone-services" },
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
  const { t } = useTranslation();
  const testimonials = useTestimonials();
  const gallery = useGallery();
  const videos = useVideos();
  const partners = usePartners();
  const faqItems = (t("faq.items", { returnObjects: true }) as Array<{ q: string; a: string }>).slice(0, 4);
  return (
    <>
      {/* HERO — One Stop Digital Platform */}
      <section className="container mx-auto px-3 pt-3 sm:px-4 sm:pt-6">
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
            {/* Soft fade for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/50 to-transparent md:bg-gradient-to-r md:from-background/80 md:via-background/30" />
          </div>

          <div className="relative grid items-end gap-3 px-4 pt-5 sm:gap-4 sm:px-8 sm:pt-12 md:grid-cols-2 md:gap-6 md:px-12 md:pt-14">
            {/* Text */}
            <div className="animate-fade-up max-w-xl pb-0 md:pb-14">
              <h1 className="text-balance text-2xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-5xl md:text-6xl">
                One Stop Digital Platform{" "}
                <span className="text-primary">for Farmers</span>
              </h1>
              <p className="mt-2 max-w-md text-xs font-medium text-foreground/80 sm:mt-4 sm:text-base">
                Loans, Insurance, Agri Inputs, Technology &amp; More — All in One Place.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 sm:mt-7 sm:gap-3">
                <Button asChild size="sm" className="gap-2 bg-primary text-primary-foreground shadow-elegant hover:bg-primary/90 sm:h-11 sm:px-6 sm:text-base">
                  <Link to="/apply">Apply for Loan <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button asChild size="sm" className="gap-2 bg-[hsl(45_95%_55%)] text-foreground shadow-elegant hover:bg-[hsl(45_95%_50%)] sm:h-11 sm:px-6 sm:text-base">
                  <Link to="/careers">Join as Field Executive</Link>
                </Button>
              </div>
            </div>

            {/* Farmer cutout */}
            <div className="relative flex justify-center items-end md:justify-end">
              <img
                src={heroFarmer}
                alt="Andhra Pradesh farmer family in traditional attire"
                width={832}
                height={1216}
                className="h-[180px] w-auto object-contain object-bottom drop-shadow-2xl sm:h-[320px] md:h-[460px] lg:h-[540px] xl:h-[600px]"
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

      {/* TESTIMONIALS — editorial bento */}
      {testimonials.length > 0 && (
        <section className="bg-[#fcfdfc] py-12 sm:py-20">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-12">
              <div className="max-w-2xl">
                <span className="inline-block rounded-full border border-[#a0c49d]/40 bg-[#a0c49d]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#1a3c2a]">
                  Voices from the field
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-[#1a3c2a] sm:text-4xl md:text-5xl">
                  What farmers say
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#5a8a5c] sm:text-base">
                  Real stories from the families we work with every day across South India.
                </p>
              </div>
              <div className="h-1 w-16 rounded-full bg-[#a0c49d]" />
            </div>

            <div className="grid auto-rows-min grid-cols-1 gap-4 sm:gap-6 md:grid-cols-4 lg:grid-cols-6">
              {/* Featured testimonial — hero block */}
              {testimonials[0] && (
                <article className="group relative overflow-hidden rounded-3xl border border-[#a0c49d]/20 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl sm:rounded-[2.5rem] md:col-span-4 md:min-h-[380px] lg:col-span-4 lg:row-span-2 lg:min-h-[480px]">
                  <img
                    src={imgMission}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a3c2a]/95 via-[#1a3c2a]/70 to-[#1a3c2a]/30" />
                  <div className="relative flex h-full flex-col justify-between p-6 text-white sm:p-10 lg:p-12">
                    <Quote className="h-10 w-10 text-[#a0c49d] sm:h-12 sm:w-12" strokeWidth={1.5} />
                    <div>
                      <p className="font-display text-xl font-medium leading-snug sm:text-2xl lg:text-3xl">
                        "{testimonials[0].quote}"
                      </p>
                      <div className="mt-6 flex items-center gap-4 border-t border-white/15 pt-5 sm:mt-8 sm:pt-6">
                        {testimonials[0].avatar ? (
                          <img src={testimonials[0].avatar} alt={testimonials[0].name} className="h-12 w-12 rounded-full object-cover ring-2 ring-[#a0c49d]/40" />
                        ) : (
                          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#a0c49d]/30 text-base font-bold text-white ring-2 ring-[#a0c49d]/40">
                            {testimonials[0].name.charAt(0)}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{testimonials[0].name}</p>
                          <p className="truncate text-xs text-white/70">{testimonials[0].role}</p>
                        </div>
                        <div className="ml-auto flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < testimonials[0].rating ? "fill-[#a0c49d] text-[#a0c49d]" : "text-white/20"}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* Side quotes — stacked */}
              {testimonials.slice(1, 3).map((tt) => (
                <article key={tt.id} className="overflow-hidden rounded-3xl border border-[#a0c49d]/20 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl sm:p-8 md:col-span-4 lg:col-span-2">
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < tt.rating ? "fill-[#a0c49d] text-[#a0c49d]" : "text-[#a0c49d]/20"}`} />
                    ))}
                  </div>
                  <p className="font-display text-base leading-relaxed text-[#1a3c2a] sm:text-lg">
                    "{tt.quote}"
                  </p>
                  <div className="mt-5 flex items-center gap-3 border-t border-[#a0c49d]/20 pt-4">
                    {tt.avatar ? (
                      <img src={tt.avatar} alt={tt.name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#a0c49d]/20 text-sm font-bold text-[#1a3c2a]">
                        {tt.name.charAt(0)}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#1a3c2a]">{tt.name}</p>
                      <p className="truncate text-xs text-[#5a8a5c]">{tt.role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ PREVIEW — editorial split */}
      <section className="bg-[#fcfdfc] py-12 sm:py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <article className="overflow-hidden rounded-3xl border border-[#a0c49d]/20 bg-white shadow-sm sm:rounded-[3rem]">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              {/* Left — title block */}
              <div className="relative min-h-[280px] lg:col-span-2">
                <img src={imgValues} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a3c2a]/90 via-[#1a3c2a]/75 to-[#2d5a3d]/60" />
                <div className="relative flex h-full flex-col justify-between p-8 text-white sm:p-12 lg:p-14">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#a0c49d]/25 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                      <HelpCircle className="h-3 w-3" /> Help center
                    </span>
                    <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                      Questions, answered.
                    </h2>
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/85 sm:text-base">
                      The most common things farmers ask before joining Agrikart. Still curious? Our team is one call away.
                    </p>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button asChild size="sm" className="bg-white text-[#1a3c2a] hover:bg-[#a0c49d]/30 hover:text-white">
                      <Link to="/faq">All FAQs <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">
                      <Link to="/contact">Talk to us</Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right — accordion list */}
              <div className="divide-y divide-[#a0c49d]/15 bg-white p-2 sm:p-4 lg:col-span-3">
                {faqItems.map((item, i) => (
                  <details key={i} className="group px-4 py-5 sm:px-6 sm:py-6">
                    <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
                      <div className="flex items-start gap-4">
                        <span className="mt-0.5 font-display text-xs font-bold text-[#a0c49d]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-display text-base font-semibold text-[#1a3c2a] sm:text-lg">
                          {item.q}
                        </h3>
                      </div>
                      <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#a0c49d]/40 text-[#1a3c2a] transition-transform duration-300 group-open:rotate-45 group-open:bg-[#1a3c2a] group-open:text-white">
                        <Plus className="h-4 w-4" />
                      </span>
                    </summary>
                    <p className="mt-3 pl-10 text-sm leading-relaxed text-[#5a8a5c]">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>


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

      {/* CTA — editorial bento */}
      <section className="bg-[#fcfdfc] pb-12 sm:pb-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid auto-rows-min grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-6">
            {/* Primary CTA — large dark block */}
            <article className="group relative overflow-hidden rounded-3xl shadow-sm transition-all duration-500 hover:shadow-2xl sm:rounded-[2.5rem] lg:col-span-4 lg:min-h-[360px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a3c2a] via-[#2d5a3d] to-[#1a3c2a]" />
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#a0c49d]/20 blur-3xl transition-transform duration-700 group-hover:scale-125" />
              <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-[#5a8a5c]/30 blur-3xl" />
              <div className="relative flex h-full flex-col justify-between gap-8 p-8 text-white sm:p-12 lg:p-14">
                <div>
                  <span className="inline-block rounded-full border border-white/20 bg-[#a0c49d]/25 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                    Get started today
                  </span>
                  <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
                    Ready to grow with <span className="text-[#a0c49d]">Agrikart?</span>
                  </h2>
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
                    Apply in minutes. A village-level field executive will reach out to walk you through every step — loans, insurance, inputs, or drone services.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" className="gap-2 bg-white text-[#1a3c2a] shadow-elegant hover:bg-[#a0c49d]/40 hover:text-white">
                    <Link to="/apply">Apply Now <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>
            </article>

            {/* Secondary CTA — light block with field executive pitch */}
            <article className="relative overflow-hidden rounded-3xl border border-[#a0c49d]/25 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl sm:rounded-[2.5rem] lg:col-span-2 lg:min-h-[360px]">
              <div className="flex h-full flex-col justify-between p-8 sm:p-10">
                <div>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1a3c2a] text-[#a0c49d]">
                    <Handshake className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-bold leading-tight text-[#1a3c2a] sm:text-3xl">
                    Become a village field executive.
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#5a8a5c]">
                    Earn commissions while serving farmers in your own village. Training and tools included.
                  </p>
                </div>
                <Button asChild variant="ghost" className="mt-6 w-fit gap-2 px-0 text-[#1a3c2a] hover:bg-transparent hover:text-[#5a8a5c]">
                  <Link to="/careers">Join the team <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
              <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-[#a0c49d]/15 blur-2xl" />
            </article>
          </div>
        </div>
      </section>

    </>
  );
}
