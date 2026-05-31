import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Banknote, ShieldCheck, Sprout, Snowflake, Ship, Landmark, TestTube2, Handshake,
  ArrowLeft, ArrowRight, CheckCircle2, FileText, Phone, IndianRupee,
} from "lucide-react";
import imgLoans from "@/assets/service-loans.jpg";
import imgInsurance from "@/assets/service-insurance.jpg";
import imgSeeds from "@/assets/service-seeds.jpg";
import imgCold from "@/assets/service-cold.jpg";
import imgTrade from "@/assets/service-trade.jpg";
import imgSchemes from "@/assets/service-schemes.jpg";
import imgSoil from "@/assets/service-soil.jpg";
import imgMarket from "@/assets/service-market.jpg";

type ServiceContent = {
  Icon: typeof Banknote;
  img: string;
  features: string[];
  process: { title: string; desc: string }[];
  docs: string[];
  pricing: string;
  faqs: { q: string; a: string }[];
};

const SERVICES: Record<string, ServiceContent> = {
  loans: { Icon: Banknote, img: imgLoans, features: ["Crop loans, KCC, equipment & dairy loans via partner NBFCs","Door-step documentation & application filling","Eligibility check before applying — no wasted effort","Transparent processing fee, no hidden charges","Status tracking until disbursal"], process: [{ title: "Eligibility Check", desc: "Share Aadhaar, land record and crop details. We run a quick check with partner lenders." },{ title: "Documentation", desc: "Our field officer helps you collect, scan and submit the required papers." },{ title: "Lender Review", desc: "The NBFC / bank reviews and decides amount, interest rate and tenure." },{ title: "Disbursal", desc: "On approval, amount is credited directly to your bank account by the lender." }], docs: ["Aadhaar & PAN","Land record / Pattadar passbook","Bank passbook (last 6 months)","Passport-size photo","Crop & sowing details"], pricing: "Facilitation fee from ₹499 per application. Interest, processing and other charges are decided by the lender — AgriKart Fin does not collect them.", faqs: [{ q: "Does AgriKart Fin give loans directly?", a: "No. We are a facilitator only. The loan is given by a partner NBFC or bank. All approvals and terms are decided by them." },{ q: "How long does it take?", a: "Typically 5–10 working days after documents are complete, depending on the lender." },{ q: "What if my application is rejected?", a: "We help you understand the reason and, if possible, re-apply with a different partner lender." }] },
  insurance: { Icon: ShieldCheck, img: imgInsurance, features: ["PMFBY crop insurance enrolment support","Cattle, health & accident cover advisory","Claim filing assistance with photos & documents","Policy comparison across insurers","Renewal reminders by SMS"], process: [{ title: "Risk Review", desc: "We understand your crop, livestock and family situation to suggest the right cover." },{ title: "Policy Selection", desc: "Compare premium, sum insured and exclusions across partner insurers." },{ title: "Enrolment", desc: "Documents collected and policy issued in your name." },{ title: "Claim Support", desc: "On loss event, we help you raise and follow up the claim end-to-end." }], docs: ["Aadhaar","Bank passbook","Land record (for crop cover)","Sowing certificate","Cattle tag / health record (for cattle cover)"], pricing: "Advisory is free for AgriKart Fin members. Premium is paid directly to the insurer as per policy.", faqs: [{ q: "Which insurers do you work with?", a: "We work with empanelled PMFBY insurers and leading private general & health insurers in India." },{ q: "Do you guarantee claim payout?", a: "No. Payout is decided by the insurer as per policy terms. We help you submit a complete, timely claim." }] },
  seeds: { Icon: Sprout, img: imgSeeds, features: ["Company-certified, high-yield seed varieties","Crop & season-wise recommendation","Quality fertilizers and bio-inputs","Crop protection — pesticides & fungicides","Delivery to nearest centre or doorstep (select areas)"], process: [{ title: "Tell Us Your Crop", desc: "Share crop, acreage and sowing window through the app or our field officer." },{ title: "Get Recommendation", desc: "We suggest seed variety, fertilizer schedule and protection plan." },{ title: "Place Order", desc: "Pay online or cash on delivery at the centre." },{ title: "Pickup / Delivery", desc: "Collect from the nearest AgriKart point or get it delivered." }], docs: ["Farmer ID","Phone number for delivery"], pricing: "MRP per bag/packet as printed. Member discount up to 5% on select inputs.", faqs: [{ q: "Are seeds certified?", a: "Yes. All seeds are sourced from licensed companies with batch & lot traceability." },{ q: "Can I return unused stock?", a: "Sealed, unopened packs can be returned within 7 days with the bill." }] },
  soil: {
    Icon: TestTube2,
    img: imgSoil,
    features: [
      "Lab-grade soil health analysis — pH, EC, organic carbon",
      "Macro-nutrients (N, P, K) and micro-nutrients (Zn, Fe, Mn, B, Cu, S)",
      "Crop-wise fertilizer & amendment recommendation",
      "Soil Health Card aligned with Government of India format",
      "On-farm sample collection by trained field officers",
      "Digital report on WhatsApp / app within 7 working days",
    ],
    process: [
      { title: "Book a Test", desc: "Choose Basic or Advanced package, share farm location and crop plan." },
      { title: "Sample Collection", desc: "Our field officer visits your farm and collects samples from multiple points using the standard zig-zag method." },
      { title: "Lab Analysis", desc: "Samples are tested at our NABL-aligned partner lab for physical, chemical and nutrient parameters." },
      { title: "Report & Advisory", desc: "Get a digital report with crop-specific fertilizer dose, lime/gypsum advice and an agronomist call-back." },
    ],
    docs: ["Farmer ID / Aadhaar", "Land record or survey number", "Crop & previous season details"],
    pricing: "Basic pack (pH, EC, OC, NPK) from ₹499 per sample. Advanced pack (NPK + 6 micro-nutrients + recommendation) from ₹999 per sample. Sample collection charges may apply outside service areas.",
    faqs: [
      { q: "How often should I test my soil?", a: "Once every 2–3 years for the same crop rotation, or before changing crops / starting horticulture." },
      { q: "Will the report tell me how much fertilizer to use?", a: "Yes. The advanced report includes crop-wise NPK dose in kg/acre and any soil amendment (lime, gypsum, organic matter) needed." },
      { q: "Is this the same as a Government Soil Health Card?", a: "Our report follows the same parameters and format, and can be used alongside the SHC for planning." },
    ],
  },
  cold: { Icon: Snowflake, img: imgCold, features: ["Temperature & humidity controlled storage","Online slot booking with live availability","Transparent daily / weekly / monthly charges","QR-coded bag tracking","Insurance for stored produce (optional)"], process: [{ title: "Book Slot", desc: "Enter Farmer ID, crop name, number of bags and expected storage days." },{ title: "Drop-off", desc: "Bring produce to the facility. Bags are weighed, tagged and stored." },{ title: "Storage", desc: "Produce is kept under recommended conditions for your crop." },{ title: "Pickup", desc: "Pay storage charges and collect, or list for sale through our buyer network." }], docs: ["Farmer ID","Crop & quantity declaration","ID proof at pickup"], pricing: "From ₹2 per kg per month for grains; ₹4 per kg per month for fruits & vegetables. Final rate depends on crop & duration.", faqs: [{ q: "Can I store partial bags?", a: "Minimum booking is 10 bags or 200 kg, whichever is higher." },{ q: "What if produce gets damaged?", a: "If damage is due to facility issue, you are compensated as per our storage terms. Optional insurance covers wider risks." }] },
  trade: { Icon: Ship, img: imgTrade, features: ["Domestic mandi & corporate buyer linkages","Export readiness — quality, packing & docs","Buyer discovery for FPOs & aggregators","Logistics & cold-chain support","Payment escrow for first-time buyers"], process: [{ title: "Register Lot", desc: "Submit crop, grade, quantity and location through the app." },{ title: "Buyer Match", desc: "We match with verified domestic / export buyers and share quotes." },{ title: "Quality & Packing", desc: "Sample testing, grading and export-grade packing as per buyer spec." },{ title: "Dispatch & Payment", desc: "Logistics arranged; payment released against documents." }], docs: ["FPO / Farmer ID","GSTIN (if applicable)","Crop grade & lab report","Bank details for payout"], pricing: "Service fee 1–3% of trade value depending on crop and destination. No upfront charges.", faqs: [{ q: "Which countries do you export to?", a: "Primarily Middle East, Southeast Asia and select EU markets. Crop list varies by season." },{ q: "Do you handle customs?", a: "Yes, through our partner CHA — included in the service fee." }] },
  schemes: { Icon: Landmark, img: imgSchemes, features: ["PM-KISAN, PMFBY, KCC, PMKSY enrolment help","State scheme awareness in Telugu","Documentation & online application","Status tracking & grievance support","Subsidy & DBT credit verification"], process: [{ title: "Eligibility Screening", desc: "We check which central & state schemes you qualify for." },{ title: "Document Collection", desc: "Aadhaar, land record, bank details and scheme-specific papers." },{ title: "Online Application", desc: "We submit the application on the official portal on your behalf." },{ title: "Follow-up", desc: "We track status and help resolve issues until benefit is credited." }], docs: ["Aadhaar","Pattadar passbook / 1B record","Bank passbook with IFSC","Mobile number linked to Aadhaar"], pricing: "Nominal service fee from ₹199 per scheme application. Government fee, if any, is paid directly to the portal.", faqs: [{ q: "Can you guarantee scheme approval?", a: "No. Approval depends on government eligibility rules. We ensure your application is complete and submitted on time." },{ q: "How long for PM-KISAN credit?", a: "Usually 1–3 months after Aadhaar–bank–land seeding is validated." }] },
  market: {
    Icon: Handshake,
    img: imgMarket,
    features: [
      "Connect farmers with trusted buyers, processors and agri companies",
      "Support buy-back arrangements through partner organizations",
      "Help farmers get better market access and competitive prices",
      "Facilitate crop procurement opportunities through our network",
      "Transparent price discovery and weighment",
      "Timely payment release through escrow / direct credit",
    ],
    process: [
      { title: "Register Your Crop", desc: "Share crop, grade, expected quantity and harvest window through the app or field officer." },
      { title: "Buyer Match", desc: "We match your produce with verified buyers, processors and agri companies in our network." },
      { title: "Buy-Back Agreement", desc: "Where available, partner organizations offer a pre-agreed buy-back price for your crop." },
      { title: "Procurement & Payment", desc: "Produce is procured at the agreed location, weighed transparently and payment is released to your bank." },
    ],
    docs: ["Farmer ID / Aadhaar", "Land / crop details", "Bank passbook for payment", "GSTIN (for FPOs, if applicable)"],
    pricing: "No upfront charge for farmers. A small facilitation fee (1–2% of trade value) is collected from the buyer / FPO on successful procurement.",
    faqs: [
      { q: "Do you guarantee a fixed price?", a: "Where a partner buy-back is available, the price is pre-agreed in writing. Otherwise prices follow prevailing mandi / corporate buyer rates." },
      { q: "Who pays me for my crop?", a: "Payment is released directly by the buyer (or via our escrow) to your registered bank account after weighment and quality check." },
      { q: "Which crops are covered?", a: "Cotton, paddy, maize, chilli, turmeric, pulses and select fruits & vegetables. Coverage expands with the partner network." },
    ],
  },
};

const SLUGS = Object.keys(SERVICES);
function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

export default function ServiceDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const s = SERVICES[slug];

  if (!s) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Service not found</h1>
        <Button asChild className="mt-4"><Link to="/services">Back to Services</Link></Button>
      </div>
    );
  }

  const Icon = s.Icon;
  const title = t(`services.items.${slug}.title`);
  const short = t(`services.items.${slug}.short`);
  const desc = t(`services.items.${slug}.desc`);
  const idx = SLUGS.indexOf(slug);
  const prev = SLUGS[(idx - 1 + SLUGS.length) % SLUGS.length];
  const next = SLUGS[(idx + 1) % SLUGS.length];

  return (
    <>
      <PageHeader eyebrow={t("services.title")} title={title} subtitle={short} />
      <section className="container mx-auto px-4 py-8 md:py-12">
        <Button asChild variant="ghost" size="sm" className="mb-6 gap-2"><Link to="/services"><ArrowLeft className="h-4 w-4" /> {t("services.title")}</Link></Button>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="overflow-hidden rounded-2xl border border-border/60 shadow-elegant"><img src={s.img} alt={title} width={768} height={512} className="h-full w-full object-cover" /></div>
          <Card className="border-border/60"><CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-6 w-6" /></div><h2 className="text-xl font-bold md:text-2xl">{title}</h2></div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">{desc}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="gap-2"><Link to="/signup">{t("hero.ctaPrimary")} <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild variant="outline" className="gap-2"><Link to="/contact"><Phone className="h-4 w-4" /> {t("nav.contact") as string}</Link></Button>
            </div>
          </CardContent></Card>
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/30 py-12 md:py-16"><div className="container mx-auto px-4"><h2 className="text-2xl font-bold md:text-3xl">What you get</h2><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{s.features.map((f, i) => (<div key={i} className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-4"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><p className="text-sm leading-relaxed">{f}</p></div>))}</div></div></section>

      <section className="container mx-auto px-4 py-12 md:py-16"><h2 className="text-2xl font-bold md:text-3xl">How it works</h2><ol className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{s.process.map((p, i) => (<li key={i} className="relative rounded-xl border border-border/60 bg-card p-5"><div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</div><h3 className="mt-3 font-semibold">{p.title}</h3><p className="mt-1 text-sm text-muted-foreground">{p.desc}</p></li>))}</ol></section>

      <section className="border-t border-border/60 bg-muted/30 py-12 md:py-16"><div className="container mx-auto grid gap-6 px-4 md:grid-cols-2">
        <Card className="border-border/60"><CardContent className="p-6"><div className="flex items-center gap-3"><FileText className="h-5 w-5 text-primary" /><h3 className="text-lg font-semibold">Documents required</h3></div><ul className="mt-4 space-y-2">{s.docs.map((d, i) => (<li key={i} className="flex items-start gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{d}</span></li>))}</ul></CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-6"><div className="flex items-center gap-3"><IndianRupee className="h-5 w-5 text-primary" /><h3 className="text-lg font-semibold">Pricing</h3></div><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.pricing}</p></CardContent></Card>
      </div></section>

      <section className="container mx-auto px-4 py-12 md:py-16"><h2 className="text-2xl font-bold md:text-3xl">Frequently asked</h2><Accordion type="single" collapsible className="mt-6 w-full">{s.faqs.map((f, i) => (<AccordionItem key={i} value={`item-${i}`}><AccordionTrigger className="text-left">{f.q}</AccordionTrigger><AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent></AccordionItem>))}</Accordion></section>

      <section className="container mx-auto px-4 pb-16"><div className="flex items-center justify-between border-t border-border/60 pt-6">
        <Button asChild variant="ghost" size="sm" className="gap-2"><Link to={`/services/${prev}`}><ArrowLeft className="h-4 w-4" /> {t(`services.items.${prev}.title`)}</Link></Button>
        <Button asChild variant="ghost" size="sm" className="gap-2"><Link to={`/services/${next}`}>{t(`services.items.${next}.title`)} <ArrowRight className="h-4 w-4" /></Link></Button>
      </div></section>
    </>
  );
}
