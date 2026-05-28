// Customizable site content: testimonials, gallery, videos, partners.
// LocalStorage-backed, follows the same pattern as shop-store.ts.
import { useEffect, useState } from "react";

export type Testimonial = {
  id: string;
  name: string;
  role: string;     // e.g. "Farmer, Guntur"
  quote: string;
  rating: number;   // 1-5
  avatar?: string;  // data URL or external URL
  createdAt: number;
};

export type GalleryImage = {
  id: string;
  title: string;
  caption?: string;
  image: string;    // data URL or external URL
  createdAt: number;
};

export type VideoItem = {
  id: string;
  title: string;
  description?: string;
  youtubeUrl: string;     // full url
  youtubeId: string;      // extracted
  createdAt: number;
};

export type Partner = {
  id: string;
  name: string;
  website?: string;
  logo: string;     // data URL or external URL
  createdAt: number;
};

const TESTI_KEY = "agrikart.testimonials";
const GALLERY_KEY = "agrikart.gallery";
const VIDEOS_KEY = "agrikart.videos";
const PARTNERS_KEY = "agrikart.partners";
const SEED_KEY = "agrikart.content_seed_v1";

function read<T>(k: string, fb: T): T {
  if (typeof window === "undefined") return fb;
  try { return JSON.parse(localStorage.getItem(k) ?? "") as T; } catch { return fb; }
}
function write(k: string, v: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(k, JSON.stringify(v));
}
function emit(name: string) { window.dispatchEvent(new Event(name)); }
const uid = () => Math.random().toString(36).slice(2, 10);

export function extractYouTubeId(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.searchParams.get("v")) return u.searchParams.get("v")!;
    const m = u.pathname.match(/\/(embed|shorts)\/([^/?]+)/);
    if (m) return m[2];
  } catch { /* ignore */ }
  // fallback: maybe raw id
  return url.length === 11 ? url : "";
}

// ---------------- seed ----------------
function seed() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(SEED_KEY)) return;

  const testimonials: Testimonial[] = [
    { id: uid(), name: "Ramesh Reddy", role: "Paddy Farmer, Guntur", rating: 5, createdAt: Date.now() - 3 * 86400000,
      quote: "Agrikart helped me get my crop loan in just 3 days. The team came to my village and did everything." },
    { id: uid(), name: "Lakshmi Devi", role: "Cotton Farmer, Warangal", rating: 5, createdAt: Date.now() - 6 * 86400000,
      quote: "Quality seeds and pesticides at fair prices. My yield improved 20% this season." },
    { id: uid(), name: "Suresh Kumar", role: "Vegetable Farmer, Khammam", rating: 4, createdAt: Date.now() - 10 * 86400000,
      quote: "Drone spraying saved me 4 days of labour. Booking was simple and the pilot was very professional." },
  ];
  write(TESTI_KEY, testimonials);

  const partners: Partner[] = [
    { id: uid(), name: "NABARD", website: "https://www.nabard.org", logo: "🏦", createdAt: Date.now() },
    { id: uid(), name: "IFFCO", website: "https://www.iffco.in", logo: "🌾", createdAt: Date.now() },
    { id: uid(), name: "Coromandel", website: "#", logo: "🧪", createdAt: Date.now() },
    { id: uid(), name: "Tata Rallis", website: "#", logo: "🛡️", createdAt: Date.now() },
    { id: uid(), name: "Mahyco", website: "#", logo: "🌱", createdAt: Date.now() },
    { id: uid(), name: "Stihl", website: "#", logo: "🛠️", createdAt: Date.now() },
  ];
  write(PARTNERS_KEY, partners);

  const videos: VideoItem[] = [
    { id: uid(), title: "How Agrikart helps farmers", description: "Quick intro to our services.",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", youtubeId: "dQw4w9WgXcQ", createdAt: Date.now() },
  ];
  write(VIDEOS_KEY, videos);

  write(GALLERY_KEY, []);
  localStorage.setItem(SEED_KEY, "1");
}
seed();

function useStore<T>(key: string, eventName: string, fb: T): T {
  const [v, set] = useState<T>(fb);
  useEffect(() => {
    const sync = () => set(read<T>(key, fb));
    sync();
    window.addEventListener(eventName, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(eventName, sync);
      window.removeEventListener("storage", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, eventName]);
  return v;
}

// ---------------- Testimonials ----------------
const EV_T = "agrikart-testimonials";
export const useTestimonials = () => useStore<Testimonial[]>(TESTI_KEY, EV_T, []);
export function upsertTestimonial(t: Omit<Testimonial, "id" | "createdAt"> & { id?: string }) {
  const all = read<Testimonial[]>(TESTI_KEY, []);
  if (t.id) {
    write(TESTI_KEY, all.map(x => x.id === t.id ? { ...x, ...t } as Testimonial : x));
  } else {
    write(TESTI_KEY, [{ ...t, id: uid(), createdAt: Date.now() }, ...all]);
  }
  emit(EV_T);
}
export function deleteTestimonial(id: string) {
  write(TESTI_KEY, read<Testimonial[]>(TESTI_KEY, []).filter(x => x.id !== id));
  emit(EV_T);
}

// ---------------- Gallery ----------------
const EV_G = "agrikart-gallery";
export const useGallery = () => useStore<GalleryImage[]>(GALLERY_KEY, EV_G, []);
export function upsertGallery(g: Omit<GalleryImage, "id" | "createdAt"> & { id?: string }) {
  const all = read<GalleryImage[]>(GALLERY_KEY, []);
  if (g.id) {
    write(GALLERY_KEY, all.map(x => x.id === g.id ? { ...x, ...g } as GalleryImage : x));
  } else {
    write(GALLERY_KEY, [{ ...g, id: uid(), createdAt: Date.now() }, ...all]);
  }
  emit(EV_G);
}
export function deleteGallery(id: string) {
  write(GALLERY_KEY, read<GalleryImage[]>(GALLERY_KEY, []).filter(x => x.id !== id));
  emit(EV_G);
}

// ---------------- Videos ----------------
const EV_V = "agrikart-videos";
export const useVideos = () => useStore<VideoItem[]>(VIDEOS_KEY, EV_V, []);
export function upsertVideo(v: Omit<VideoItem, "id" | "createdAt" | "youtubeId"> & { id?: string }) {
  const all = read<VideoItem[]>(VIDEOS_KEY, []);
  const youtubeId = extractYouTubeId(v.youtubeUrl);
  if (v.id) {
    write(VIDEOS_KEY, all.map(x => x.id === v.id ? { ...x, ...v, youtubeId } as VideoItem : x));
  } else {
    write(VIDEOS_KEY, [{ ...v, youtubeId, id: uid(), createdAt: Date.now() }, ...all]);
  }
  emit(EV_V);
}
export function deleteVideo(id: string) {
  write(VIDEOS_KEY, read<VideoItem[]>(VIDEOS_KEY, []).filter(x => x.id !== id));
  emit(EV_V);
}

// ---------------- Partners ----------------
const EV_P = "agrikart-partners";
export const usePartners = () => useStore<Partner[]>(PARTNERS_KEY, EV_P, []);
export function upsertPartner(p: Omit<Partner, "id" | "createdAt"> & { id?: string }) {
  const all = read<Partner[]>(PARTNERS_KEY, []);
  if (p.id) {
    write(PARTNERS_KEY, all.map(x => x.id === p.id ? { ...x, ...p } as Partner : x));
  } else {
    write(PARTNERS_KEY, [{ ...p, id: uid(), createdAt: Date.now() }, ...all]);
  }
  emit(EV_P);
}
export function deletePartner(id: string) {
  write(PARTNERS_KEY, read<Partner[]>(PARTNERS_KEY, []).filter(x => x.id !== id));
  emit(EV_P);
}

// ---------------- File → data URL helper ----------------
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
