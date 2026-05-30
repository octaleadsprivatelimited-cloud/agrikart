import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCustomer, useCurrentStaff } from "@/lib/staff-store";
import { MapPin, Loader2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type Gps = { lat: number; lng: number; accuracy: number; timestamp: number };

const TARGET_ACCURACY_M = 20; // stop refining once within 20m
const MAX_WATCH_MS = 25_000;  // give up after 25s and use best fix so far

export default function AddCustomer() {
  const staff = useCurrentStaff();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    farmerName: "", mobile: "", aadhaar: "", village: "", district: "",
    landSize: "", crops: "",
  });
  const [gps, setGps] = useState<Gps | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [gpsErr, setGpsErr] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const watchRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const formRef = useRef(form);
  formRef.current = form;

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const stopWatch = () => {
    if (watchRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setCapturing(false);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { "Accept": "application/json" } },
      );
      if (!res.ok) return;
      const data = await res.json();
      const display = (data?.display_name as string | undefined) ?? null;
      setAddress(display);
      // Auto-fill empty village/district from OSM address parts
      const a = data?.address ?? {};
      const village = a.village || a.hamlet || a.town || a.suburb || a.city_district || "";
      const district = a.state_district || a.county || a.district || "";
      setForm((prev) => ({
        ...prev,
        village: prev.village || (typeof village === "string" ? village : ""),
        district: prev.district || (typeof district === "string" ? district : ""),
      }));
    } catch {
      /* silent: address is non-critical */
    }
  };

  const startCapture = () => {
    setGpsErr(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGpsErr("Geolocation is not supported by this browser.");
      return;
    }
    stopWatch();
    setCapturing(true);
    let best: Gps | null = null;

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const fix: Gps = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        };
        if (!best || fix.accuracy < best.accuracy) {
          best = fix;
          setGps(fix);
        }
        if (fix.accuracy <= TARGET_ACCURACY_M) {
          stopWatch();
          void reverseGeocode(fix.lat, fix.lng);
        }
      },
      (err) => {
        stopWatch();
        setGpsErr(err.message || "Location permission denied.");
      },
      { enableHighAccuracy: true, timeout: MAX_WATCH_MS, maximumAge: 0 },
    );

    timeoutRef.current = window.setTimeout(() => {
      stopWatch();
      if (best) void reverseGeocode(best.lat, best.lng);
      else setGpsErr((prev) => prev ?? "Could not get a GPS fix. Please retry.");
    }, MAX_WATCH_MS);
  };

  // Auto-capture on mount (mandatory)
  useEffect(() => {
    startCapture();
    return stopWatch;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staff) return;
    if (!gps) {
      toast.error("GPS location is mandatory. Please allow location access.");
      return;
    }
    const c = createCustomer({
      ...formRef.current,
      farmerName: formRef.current.farmerName.trim(),
      gps,
      employeeId: staff.id,
      employeeName: staff.name,
    });
    toast.success(`Customer added! Farmer ID: ${c.farmerCode}`);
    void navigate(`/staff/customers/${c.id}`);
  };

  // OSM embed: small bbox around the point + marker
  const osmEmbedSrc = gps
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${gps.lng - 0.003},${gps.lat - 0.002},${gps.lng + 0.003},${gps.lat + 0.002}&layer=mapnik&marker=${gps.lat},${gps.lng}`
    : null;
  const osmLink = gps
    ? `https://www.openstreetmap.org/?mlat=${gps.lat}&mlon=${gps.lng}#map=18/${gps.lat}/${gps.lng}`
    : null;

  return (
    <Card>
      <CardContent className="p-8">
        <h1 className="text-2xl font-bold">Add Customer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Capture farmer details. GPS location is detected automatically from this device.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Farmer Name"><Input required maxLength={100} value={form.farmerName} onChange={update("farmerName")} /></Field>
          <Field label="Mobile Number"><Input required pattern="[0-9]{10}" maxLength={10} value={form.mobile} onChange={update("mobile")} /></Field>
          <Field label="Aadhaar (optional)" className="sm:col-span-2"><Input pattern="[0-9]{12}" maxLength={12} value={form.aadhaar} onChange={update("aadhaar")} /></Field>
          <Field label="Village"><Input required maxLength={100} value={form.village} onChange={update("village")} /></Field>
          <Field label="District"><Input required maxLength={100} value={form.district} onChange={update("district")} /></Field>
          <Field label="Land Size (acres)"><Input required type="number" min="0" step="0.1" value={form.landSize} onChange={update("landSize")} /></Field>
          <Field label="Crops Grown"><Input required maxLength={200} value={form.crops} onChange={update("crops")} placeholder="Cotton, Paddy" /></Field>

          <div className="sm:col-span-2">
            <div className="flex items-center justify-between">
              <Label>GPS Location <span className="text-destructive">*</span></Label>
              <Button type="button" variant="ghost" size="sm" onClick={startCapture} disabled={capturing}>
                {capturing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                {capturing ? "Locating…" : "Recapture"}
              </Button>
            </div>

            <div className="mt-1.5 rounded-lg border border-dashed border-border bg-muted/40 p-4">
              {gps ? (
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                  <div className="text-sm">
                    <p className="font-semibold">
                      Location captured
                      {capturing && <span className="ml-2 text-xs font-normal text-muted-foreground">Refining…</span>}
                    </p>
                    <p className="text-muted-foreground">Lat: {gps.lat.toFixed(6)} · Lng: {gps.lng.toFixed(6)}</p>
                    <p className="text-xs text-muted-foreground">
                      Accuracy: ±{Math.round(gps.accuracy)}m · {new Date(gps.timestamp).toLocaleString()}
                    </p>
                    {address && <p className="mt-1 text-xs text-foreground/80">{address}</p>}
                  </div>
                </div>
              ) : gpsErr ? (
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
                  <div className="text-sm">
                    <p className="font-semibold text-destructive">{gpsErr}</p>
                    <p className="text-xs text-muted-foreground">Enable location permissions in your browser and click Recapture.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-primary" />
                  <div className="text-sm">
                    <p className="font-semibold">Detecting your location…</p>
                    <p className="text-xs text-muted-foreground">Please allow location access when prompted.</p>
                  </div>
                </div>
              )}

              {osmEmbedSrc && (
                <div className="mt-4 overflow-hidden rounded-md border border-border">
                  <iframe
                    title="OpenStreetMap location preview"
                    src={osmEmbedSrc}
                    className="h-56 w-full"
                    loading="lazy"
                  />
                  <div className="flex items-center justify-between bg-background/60 px-3 py-1.5 text-xs">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" /> OpenStreetMap
                    </span>
                    <a href={osmLink!} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">
                      View larger map
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" size="lg" className="w-full" disabled={!gps}>
              {gps ? "Save Customer" : "Waiting for GPS…"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
