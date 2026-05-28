import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Pencil, Trash2, Plus, Star, X, Upload, Youtube, Image as ImageIcon, Users2, MessageSquareQuote } from "lucide-react";
import { toast } from "sonner";
import {
  useTestimonials, upsertTestimonial, deleteTestimonial,
  useGallery, upsertGallery, deleteGallery,
  useVideos, upsertVideo, deleteVideo, extractYouTubeId,
  usePartners, upsertPartner, deletePartner,
  fileToDataUrl,
  type Testimonial, type GalleryImage, type VideoItem, type Partner,
} from "@/lib/content-store";

export default function AdminContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Site Content</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add and manage testimonials, gallery photos, YouTube videos and partner logos shown on the website.
        </p>
      </div>

      <Tabs defaultValue="testimonials">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="testimonials" className="gap-1.5"><MessageSquareQuote className="h-4 w-4" />Testimonials</TabsTrigger>
          <TabsTrigger value="gallery" className="gap-1.5"><ImageIcon className="h-4 w-4" />Gallery</TabsTrigger>
          <TabsTrigger value="videos" className="gap-1.5"><Youtube className="h-4 w-4" />Videos</TabsTrigger>
          <TabsTrigger value="partners" className="gap-1.5"><Users2 className="h-4 w-4" />Partners</TabsTrigger>
        </TabsList>

        <TabsContent value="testimonials" className="mt-4"><TestimonialsPanel /></TabsContent>
        <TabsContent value="gallery" className="mt-4"><GalleryPanel /></TabsContent>
        <TabsContent value="videos" className="mt-4"><VideosPanel /></TabsContent>
        <TabsContent value="partners" className="mt-4"><PartnersPanel /></TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------------- Testimonials ---------------- */
function TestimonialsPanel() {
  const items = useTestimonials();
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [open, setOpen] = useState(false);
  const start = (t: Testimonial | null) => { setEditing(t); setOpen(true); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} testimonial(s)</p>
        <Button onClick={() => start(null)} size="sm"><Plus className="h-4 w-4" /> Add testimonial</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(t => (
          <Card key={t.id}>
            <CardContent className="space-y-2 p-4">
              <div className="flex items-start gap-3">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {t.name.charAt(0)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{t.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.role}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => start(t)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => { deleteTestimonial(t.id); toast.success("Deleted"); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">"{t.quote}"</p>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <EmptyState label="No testimonials yet." />}
      </div>

      {open && <TestimonialDialog initial={editing} onClose={() => setOpen(false)} />}
    </div>
  );
}

function TestimonialDialog({ initial, onClose }: { initial: Testimonial | null; onClose: () => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [quote, setQuote] = useState(initial?.quote ?? "");
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [avatar, setAvatar] = useState(initial?.avatar ?? "");

  const save = () => {
    if (!name.trim() || !quote.trim()) { toast.error("Name & quote required"); return; }
    upsertTestimonial({ id: initial?.id, name, role, quote, rating, avatar });
    toast.success(initial ? "Updated" : "Added");
    onClose();
  };

  return (
    <ModalShell title={initial ? "Edit testimonial" : "Add testimonial"} onClose={onClose}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name"><Input value={name} onChange={e => setName(e.target.value)} /></Field>
        <Field label="Role / Location"><Input value={role} onChange={e => setRole(e.target.value)} placeholder="Farmer, Guntur" /></Field>
        <Field label="Rating (1-5)"><Input type="number" min={1} max={5} value={rating} onChange={e => setRating(+e.target.value)} /></Field>
        <Field label="Avatar"><ImagePicker value={avatar} onChange={setAvatar} /></Field>
        <Field label="Quote" className="sm:col-span-2"><Textarea rows={3} value={quote} onChange={e => setQuote(e.target.value)} /></Field>
      </div>
      <ModalActions onClose={onClose} onSave={save} />
    </ModalShell>
  );
}

/* ---------------- Gallery ---------------- */
function GalleryPanel() {
  const items = useGallery();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const start = (g: GalleryImage | null) => { setEditing(g); setOpen(true); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} image(s)</p>
        <Button onClick={() => start(null)} size="sm"><Plus className="h-4 w-4" /> Add image</Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map(g => (
          <Card key={g.id} className="overflow-hidden">
            <div className="relative aspect-square">
              <img src={g.image} alt={g.title} className="h-full w-full object-cover" />
              <div className="absolute right-1 top-1 flex gap-1">
                <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => start(g)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => { deleteGallery(g.id); toast.success("Deleted"); }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <CardContent className="p-3">
              <p className="truncate text-sm font-semibold">{g.title}</p>
              {g.caption && <p className="truncate text-xs text-muted-foreground">{g.caption}</p>}
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <EmptyState label="No gallery images yet." />}
      </div>

      {open && <GalleryDialog initial={editing} onClose={() => setOpen(false)} />}
    </div>
  );
}

function GalleryDialog({ initial, onClose }: { initial: GalleryImage | null; onClose: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [caption, setCaption] = useState(initial?.caption ?? "");
  const [image, setImage] = useState(initial?.image ?? "");

  const save = () => {
    if (!image) { toast.error("Image required"); return; }
    if (!title.trim()) { toast.error("Title required"); return; }
    upsertGallery({ id: initial?.id, title, caption, image });
    toast.success(initial ? "Updated" : "Added");
    onClose();
  };

  return (
    <ModalShell title={initial ? "Edit image" : "Add gallery image"} onClose={onClose}>
      <div className="space-y-3">
        <Field label="Image"><ImagePicker value={image} onChange={setImage} /></Field>
        <Field label="Title"><Input value={title} onChange={e => setTitle(e.target.value)} /></Field>
        <Field label="Caption"><Input value={caption} onChange={e => setCaption(e.target.value)} /></Field>
      </div>
      <ModalActions onClose={onClose} onSave={save} />
    </ModalShell>
  );
}

/* ---------------- Videos ---------------- */
function VideosPanel() {
  const items = useVideos();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<VideoItem | null>(null);
  const start = (v: VideoItem | null) => { setEditing(v); setOpen(true); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} video(s)</p>
        <Button onClick={() => start(null)} size="sm"><Plus className="h-4 w-4" /> Add video</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(v => (
          <Card key={v.id} className="overflow-hidden">
            <div className="aspect-video bg-muted">
              {v.youtubeId ? (
                <img src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`} alt={v.title} className="h-full w-full object-cover" />
              ) : <div className="grid h-full place-items-center text-muted-foreground">Invalid URL</div>}
            </div>
            <CardContent className="space-y-1 p-3">
              <p className="truncate text-sm font-semibold">{v.title}</p>
              {v.description && <p className="line-clamp-2 text-xs text-muted-foreground">{v.description}</p>}
              <div className="flex justify-end gap-1 pt-1">
                <Button size="icon" variant="ghost" onClick={() => start(v)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => { deleteVideo(v.id); toast.success("Deleted"); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <EmptyState label="No videos yet." />}
      </div>

      {open && <VideoDialog initial={editing} onClose={() => setOpen(false)} />}
    </div>
  );
}

function VideoDialog({ initial, onClose }: { initial: VideoItem | null; onClose: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(initial?.youtubeUrl ?? "");
  const id = extractYouTubeId(youtubeUrl);

  const save = () => {
    if (!title.trim()) { toast.error("Title required"); return; }
    if (!id) { toast.error("Invalid YouTube URL"); return; }
    upsertVideo({ id: initial?.id, title, description, youtubeUrl });
    toast.success(initial ? "Updated" : "Added");
    onClose();
  };

  return (
    <ModalShell title={initial ? "Edit video" : "Add YouTube video"} onClose={onClose}>
      <div className="space-y-3">
        <Field label="YouTube URL">
          <Input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
        </Field>
        {id && <img src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} alt="" className="aspect-video w-full rounded-md object-cover" />}
        <Field label="Title"><Input value={title} onChange={e => setTitle(e.target.value)} /></Field>
        <Field label="Description"><Textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} /></Field>
      </div>
      <ModalActions onClose={onClose} onSave={save} />
    </ModalShell>
  );
}

/* ---------------- Partners ---------------- */
function PartnersPanel() {
  const items = usePartners();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const start = (p: Partner | null) => { setEditing(p); setOpen(true); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} partner(s)</p>
        <Button onClick={() => start(null)} size="sm"><Plus className="h-4 w-4" /> Add partner</Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map(p => (
          <Card key={p.id}>
            <CardContent className="space-y-2 p-4 text-center">
              <div className="mx-auto grid h-20 w-full place-items-center rounded-md bg-muted">
                {p.logo.startsWith("data:") || p.logo.startsWith("http") ? (
                  <img src={p.logo} alt={p.name} className="max-h-16 max-w-full object-contain" />
                ) : (
                  <span className="text-4xl">{p.logo}</span>
                )}
              </div>
              <p className="truncate text-sm font-semibold">{p.name}</p>
              {p.website && <p className="truncate text-xs text-muted-foreground">{p.website}</p>}
              <div className="flex justify-center gap-1">
                <Button size="icon" variant="ghost" onClick={() => start(p)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => { deletePartner(p.id); toast.success("Deleted"); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <EmptyState label="No partners yet." />}
      </div>

      {open && <PartnerDialog initial={editing} onClose={() => setOpen(false)} />}
    </div>
  );
}

function PartnerDialog({ initial, onClose }: { initial: Partner | null; onClose: () => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [website, setWebsite] = useState(initial?.website ?? "");
  const [logo, setLogo] = useState(initial?.logo ?? "");

  const save = () => {
    if (!name.trim()) { toast.error("Name required"); return; }
    if (!logo) { toast.error("Logo required"); return; }
    upsertPartner({ id: initial?.id, name, website, logo });
    toast.success(initial ? "Updated" : "Added");
    onClose();
  };

  return (
    <ModalShell title={initial ? "Edit partner" : "Add partner"} onClose={onClose}>
      <div className="space-y-3">
        <Field label="Logo"><ImagePicker value={logo} onChange={setLogo} /></Field>
        <Field label="Name"><Input value={name} onChange={e => setName(e.target.value)} /></Field>
        <Field label="Website"><Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..." /></Field>
      </div>
      <ModalActions onClose={onClose} onSave={save} />
    </ModalShell>
  );
}

/* ---------------- Shared bits ---------------- */
function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={`space-y-1.5 ${className ?? ""}`}><Label className="text-xs">{label}</Label>{children}</div>;
}

function ImagePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const onFile = async (f: File | null) => {
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) { toast.error("Image too large (max 2 MB)"); return; }
    onChange(await fileToDataUrl(f));
  };
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-md border bg-muted">
        {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="h-5 w-5 text-muted-foreground" />}
      </div>
      <div className="flex-1 space-y-1.5">
        <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted">
          <Upload className="h-3.5 w-3.5" /> Upload
          <input type="file" accept="image/*" className="hidden" onChange={e => onFile(e.target.files?.[0] ?? null)} />
        </label>
        <Input value={value.startsWith("data:") ? "" : value} placeholder="or paste URL" onChange={e => onChange(e.target.value)} className="h-8 text-xs" />
      </div>
    </div>
  );
}

function ModalShell({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl bg-background shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-base font-semibold">{title}</h2>
          <Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}

function ModalActions({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  return (
    <div className="mt-4 flex justify-end gap-2 border-t pt-3">
      <Button variant="ghost" onClick={onClose}>Cancel</Button>
      <Button onClick={onSave}>Save</Button>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="col-span-full rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
