import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { captureGps, createCustomer, useCurrentStaff } from "@/lib/staff-store";
import { MapPin, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";


export default function AddCustomer() {
  const staff = useCurrentStaff();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    farmerName: "", mobile: "", aadhaar: "", village: "", district: "",
    landSize: "", crops: "",
  });
  const [gps, setGps] = useState<{ lat: number; lng: number; accuracy: number; timestamp: number } | null>(null);
  const [gpsErr, setGpsErr] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const grabGps = async () => {
    setCapturing(true); setGpsErr(null);
    try {
      const pos = await captureGps();
      setGps(pos);
    } catch (err) {
      setGpsErr((err as Error).message);
      setGps(null);
    } finally {
      setCapturing(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staff) return;
    if (!gps) {
      toast.error("GPS location is mandatory. Please capture it first.");
      return;
    }
    const c = createCustomer({
      ...form,
      farmerName: form.farmerName.trim(),
      gps,
      employeeId: staff.id,
      employeeName: staff.name,
    });
    toast.success(`Customer added! Farmer ID: ${c.farmerCode}`);
    void navigate(`/staff/customers/${c.id}`);
  };

  return (
    <Card>
      <CardContent className="p-8">
        <h1 className="text-2xl font-bold">Add Customer</h1>
        <p className="mt-1 text-sm text-muted-foreground">Capture farmer details and on-site GPS location.</p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Farmer Name"><Input required maxLength={100} value={form.farmerName} onChange={update("farmerName")} /></Field>
          <Field label="Mobile Number"><Input required pattern="[0-9]{10}" maxLength={10} value={form.mobile} onChange={update("mobile")} /></Field>
          <Field label="Aadhaar (optional)" className="sm:col-span-2"><Input pattern="[0-9]{12}" maxLength={12} value={form.aadhaar} onChange={update("aadhaar")} /></Field>
          <Field label="Village"><Input required maxLength={100} value={form.village} onChange={update("village")} /></Field>
          <Field label="District"><Input required maxLength={100} value={form.district} onChange={update("district")} /></Field>
          <Field label="Land Size (acres)"><Input required type="number" min="0" step="0.1" value={form.landSize} onChange={update("landSize")} /></Field>
          <Field label="Crops Grown"><Input required maxLength={200} value={form.crops} onChange={update("crops")} placeholder="Cotton, Paddy" /></Field>

          <div className="sm:col-span-2">
            <Label>GPS Location (mandatory)</Label>
            <div className="mt-1.5 rounded-lg border border-dashed border-border bg-muted/40 p-4">
              {gps ? (
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                  <div className="text-sm">
                    <p className="font-semibold">Location captured</p>
                    <p className="text-muted-foreground">Lat: {gps.lat.toFixed(6)} Â· Lng: {gps.lng.toFixed(6)}</p>
                    <p className="text-xs text-muted-foreground">Accuracy: Â±{Math.round(gps.accuracy)}m Â· {new Date(gps.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ) : gpsErr ? (
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
                  <div className="text-sm">
                    <p className="font-semibold text-destructive">{gpsErr}</p>
                    <p className="text-xs text-muted-foreground">Enable location permissions in your browser and retry.</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Click below to capture the farmer's on-site GPS coordinates.</p>
              )}
              <Button type="button" variant="outline" size="sm" onClick={grabGps} disabled={capturing} className="mt-3">
                {capturing ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                {gps ? "Recapture" : "Capture GPS"}
              </Button>
            </div>
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" size="lg" className="w-full" disabled={!gps}>Save Customer</Button>
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
