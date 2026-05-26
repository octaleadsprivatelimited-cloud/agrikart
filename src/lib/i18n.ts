import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const en = {
  brand: "AgriKart Fin",
  brandFull: "AGRIKART FIN TECH PRIVATE LIMITED",
  cin: "CIN U47737TS2026PTC215691",
  nav: {
    home: "Home", about: "About", services: "Services", contact: "Contact",
    faq: "FAQ", careers: "Careers", blog: "Blog", login: "Login", signup: "Register",
    portal: "My Portal", logout: "Logout",
  },
  hero: {
    eyebrow: "Empowering Indian Farmers",
    title: "Smart agri-services, finance, and trade — all in one place.",
    subtitle: "From drones and seeds to loans, insurance and exports — AgriKart Fin connects farmers to everything they need to grow.",
    ctaPrimary: "Register as Farmer",
    ctaSecondary: "Explore Services",
  },
  services: {
    title: "Our Services",
    subtitle: "Nine core services built for the modern Indian farmer.",
    items: {
      drone: { title: "Drone Rentals", desc: "Precision spraying and crop monitoring with certified drone pilots." },
      seeds: { title: "Seeds & Fertilizers", desc: "High-yield certified seeds and fertilizers delivered to your village." },
      pesticides: { title: "Pesticides", desc: "Safe, government-approved pesticides with expert guidance." },
      cold: { title: "Cold Storage", desc: "Affordable cold-storage slots to preserve your harvest." },
      trade: { title: "Import / Export", desc: "Reach domestic and global buyers through verified channels." },
      loans: { title: "Agri Loans", desc: "Quick agricultural loans with simple paperwork." },
      insurance: { title: "Crop Insurance", desc: "Protect your crops against weather, pests, and price shocks." },
      schemes: { title: "Govt Schemes", desc: "Help applying for PM-KISAN, PMFBY and state subsidies." },
      support: { title: "24x7 Support", desc: "Telugu-speaking support team, every day of the year." },
    },
  },
  testimonials: {
    title: "Trusted by farmers across Telangana & Andhra Pradesh",
    items: [
      { name: "Ramesh, Warangal", quote: "I got my drone spraying done in 2 hours. Saved me a full week of labour." },
      { name: "Lakshmi, Karimnagar", quote: "The team helped me apply for PM-KISAN. Money came directly to my account." },
      { name: "Suresh, Khammam", quote: "Got my loan approved in 5 days. The local officer visited my farm personally." },
    ],
  },
  about: {
    title: "About AgriKart Fin",
    intro: "AgriKart Fin Tech Private Limited is a registered agri-business and fintech company headquartered in Telangana. Our mission is to bring world-class agricultural inputs, services, finance and market access to every Indian farmer — in their own language.",
    missionTitle: "Our Mission",
    mission: "To double farmer income through technology, trusted services and fair finance.",
    visionTitle: "Our Vision",
    vision: "A future where every farmer is empowered, connected, and prosperous.",
  },
  contact: {
    title: "Contact Us",
    subtitle: "We're here to help. Reach us anytime.",
    nameLabel: "Your Name", phoneLabel: "Mobile Number", messageLabel: "Message", submit: "Send Message",
    address: "Hyderabad, Telangana, India",
    sent: "Message sent! We'll get back to you shortly.",
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      { q: "How do I register as a farmer?", a: "Click the Register button at the top and fill in your details. It takes less than 2 minutes." },
      { q: "Is there any registration fee?", a: "No. Registration is completely free for all farmers." },
      { q: "How long does loan approval take?", a: "Most loans are processed within 5-7 working days after document verification." },
      { q: "Do you serve villages outside Telangana?", a: "We are expanding rapidly across South India. Contact us to check your district." },
      { q: "Can I cancel a booking?", a: "Yes, bookings can be cancelled before they are marked Approved. See our refund policy." },
    ],
  },
  careers: {
    title: "Careers at AgriKart Fin",
    intro: "Join us in transforming Indian agriculture. We're hiring across field operations, technology and customer support.",
    openings: [
      { role: "Field Operations Executive", loc: "Warangal / Karimnagar", type: "Full-time" },
      { role: "Customer Support — Telugu", loc: "Hyderabad", type: "Full-time" },
      { role: "Drone Pilot (DGCA Certified)", loc: "Multiple districts", type: "Contract" },
      { role: "Frontend Engineer (React)", loc: "Hyderabad / Remote", type: "Full-time" },
    ],
    apply: "Apply via careers@agrikartfin.com",
  },
  blog: {
    title: "Insights & News",
    subtitle: "Tips, schemes and stories from the field.",
    posts: [
      { title: "5 Drone Spraying Tips for Cotton Farmers", date: "May 2026", excerpt: "Improve coverage and reduce chemical use with these expert-backed tips." },
      { title: "Understanding PMFBY: A Complete Guide", date: "Apr 2026", excerpt: "Everything you need to know about the Pradhan Mantri Fasal Bima Yojana." },
      { title: "How to Get Your KCC Loan in 7 Days", date: "Apr 2026", excerpt: "Step-by-step process to apply for a Kisan Credit Card loan." },
    ],
  },
  legal: {
    privacyTitle: "Privacy Policy",
    termsTitle: "Terms & Conditions",
    refundTitle: "Refund Policy",
    updated: "Last updated: May 2026",
  },
  auth: {
    loginTitle: "Welcome back",
    loginSubtitle: "Login to manage your farm services.",
    signupTitle: "Create your farmer account",
    signupSubtitle: "Get access to all AgriKart Fin services.",
    name: "Full Name", mobile: "Mobile Number", aadhaar: "Aadhaar Number (optional)",
    village: "Village", district: "District", landSize: "Land Size (acres)", crops: "Main Crops Grown",
    email: "Email", password: "Password",
    loginBtn: "Login", signupBtn: "Create Account",
    noAccount: "Don't have an account?", haveAccount: "Already have an account?",
    invalidLogin: "Invalid email or password.",
    emailExists: "An account with this email already exists.",
  },
  portal: {
    welcome: "Welcome",
    dashboardTitle: "My Farm Dashboard",
    bookService: "Book a Service",
    myBookings: "My Bookings",
    totalBookings: "Total Bookings",
    pending: "Pending", approved: "Approved", rejected: "Rejected",
    chooseService: "Choose Service", describe: "Describe your requirement",
    submit: "Submit Request",
    submitted: "Your request has been submitted!",
    empty: "No bookings yet. Book your first service to get started.",
    payment: "UPI Payment Link",
    status: "Status",
    date: "Date",
  },
  footer: {
    company: "Company", legal: "Legal", services: "Services", contact: "Contact",
    rights: "All rights reserved.",
    tagline: "Empowering Indian farmers with technology, finance and trust.",
  },
};

// Telugu placeholders per spec — client will supply translations
const te = JSON.parse(JSON.stringify(en)) as typeof en;
const placeholder = (obj: Record<string, unknown>, path: string) => {
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    const p = path ? `${path}.${k}` : k;
    if (typeof v === "string") obj[k] = `[TE: ${p}]`;
    else if (Array.isArray(v)) v.forEach((item, i) => typeof item === "object" && placeholder(item as Record<string, unknown>, `${p}.${i}`));
    else if (v && typeof v === "object") placeholder(v as Record<string, unknown>, p);
  }
};
placeholder(te as unknown as Record<string, unknown>, "");

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, te: { translation: te } },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: { order: ["localStorage", "navigator"], caches: ["localStorage"] },
  });

export default i18n;
