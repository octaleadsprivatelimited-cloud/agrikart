import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  createCustomer,
  recordPayment,
  useCurrentStaff,
  type PaymentKind,
  type Payment,
  type DocFile,
  type CustomerDocuments,
  type FarmerType,
  FARMER_TYPE_LABELS,
  DOC_MAX_BYTES,
  DOC_ACCEPT_MIME,
} from "@/lib/staff-store";
import {
  MapPin,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  IndianRupee,
  Banknote,
  FileText,
  Upload,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

type PayMethod = NonNullable<Payment["method"]>;
const PAY_METHODS: { value: PayMethod; label: string }[] = [
  { value: "Cash", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "Card", label: "Card" },
  { value: "NetBanking", label: "Net Banking" },
];
const KIND_AMOUNTS: Record<PaymentKind, number> = { joining: 1499, renewal: 4999 };

type Gps = { lat: number; lng: number; accuracy: number; timestamp: number };

const TARGET_ACCURACY_M = 20; // stop refining once within 20m
const MAX_WATCH_MS = 25_000; // give up after 25s and use best fix so far

export default function AddCustomer() {
  const staff = useCurrentStaff();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    farmerName: "",
    mobile: "",
    village: "",
    district: "",
    landSize: "",
    crops: "",
  });
  const [farmerType, setFarmerType] = useState<FarmerType>("Owner");

  // Documents (KYC + land proof) — all mandatory
  const [aadhaarNo, setAadhaarNo] = useState("");
  const [panNo, setPanNo] = useState("");
  const [surveyNo, setSurveyNo] = useState("");
  const [aadhaarFile, setAadhaarFile] = useState<DocFile | null>(null);
  const [panFile, setPanFile] = useState<DocFile | null>(null);
  const [landFile, setLandFile] = useState<DocFile | null>(null);

  const [gps, setGps] = useState<Gps | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [gpsErr, setGpsErr] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);

  // Payment collection
  const [collectPayment, setCollectPayment] = useState(true);
  const [payKind, setPayKind] = useState<PaymentKind>("joining");
  const [payMethod, setPayMethod] = useState<PayMethod>("Cash");
  const [payAmount, setPayAmount] = useState<string>(String(KIND_AMOUNTS.joining));
  const [payReference, setPayReference] = useState("");
  const [payNote, setPayNote] = useState("");

  const watchRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const formRef = useRef(form);
  formRef.current = form;

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const onKindChange = (k: PaymentKind) => {
    setPayKind(k);
    setPayAmount(String(KIND_AMOUNTS[k]));
  };

  const pickFile =
    (setter: (f: DocFile | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        setter(null);
        return;
      }
      if (!DOC_ACCEPT_MIME.includes(file.type)) {
        toast.error("Only JPG, PNG, WEBP or PDF allowed.");
        e.target.value = "";
        return;
      }
      if (file.size > DOC_MAX_BYTES) {
        toast.error(`File is too large (max ${Math.round(DOC_MAX_BYTES / 1024)} KB).`);
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setter({
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: String(reader.result ?? ""),
        });
      };
      reader.onerror = () => toast.error("Could not read file. Try a smaller one.");
      reader.readAsDataURL(file);
    };

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
        { headers: { Accept: "application/json" } },
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
    // KYC validation
    if (!/^\d{12}$/.test(aadhaarNo.trim())) {
      toast.error("Enter a valid 12-digit Aadhaar number.");
      return;
    }
    if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(panNo.trim().toUpperCase())) {
      toast.error("Enter a valid PAN (e.g. ABCDE1234F).");
      return;
    }
    if (!surveyNo.trim()) {
      toast.error("Land survey / pattadar number is required.");
      return;
    }
    if (!aadhaarFile || !panFile || !landFile) {
      toast.error("Upload all three documents: Aadhaar, PAN, and land proof.");
      return;
    }
    const amountNum = Number(payAmount);
    if (collectPayment) {
      if (!Number.isFinite(amountNum) || amountNum <= 0) {
        toast.error("Enter a valid payment amount.");
        return;
      }
      if (payMethod === "UPI" && !payReference.trim()) {
        toast.error("UPI reference / txn ID is required.");
        return;
      }
    }
    const documents: CustomerDocuments = {
      aadhaar: { number: aadhaarNo.trim(), file: aadhaarFile },
      pan: { number: panNo.trim().toUpperCase(), file: panFile },
      land: { surveyNo: surveyNo.trim(), file: landFile },
    };
    const c = createCustomer({
      ...formRef.current,
      farmerName: formRef.current.farmerName.trim(),
      farmerType,
      aadhaar: aadhaarNo.trim(),
      gps,
      documents,
      employeeId: staff.id,
      employeeName: staff.name,
    });
    if (collectPayment) {
      const p = recordPayment({
        farmerId: c.id,
        farmerName: c.farmerName,
        mobile: c.mobile,
        kind: payKind,
        amount: amountNum,
        method: payMethod,
        reference: payReference.trim() || undefined,
        note: payNote.trim() || undefined,
        collectedById: staff.id,
        collectedByName: staff.name,
      });
      toast.success(
        `${c.farmerName} enrolled · ₹${amountNum} collected (${p.id}). Farmer ID will be issued after admin approval.`,
      );
    } else {
      toast.success(`Enrollment submitted. Farmer ID will be issued after admin approval.`);
    }
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
      <CardContent className="p-5 sm:p-8">
        <h1 className="text-2xl font-bold">Add Customer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Capture farmer details. GPS location is detected automatically from this device.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Farmer Name">
            <Input
              required
              maxLength={100}
              value={form.farmerName}
              onChange={update("farmerName")}
            />
          </Field>
          <Field label="Mobile Number">
            <Input
              required
              pattern="[0-9]{10}"
              maxLength={10}
              value={form.mobile}
              onChange={update("mobile")}
            />
          </Field>

          <div className="sm:col-span-2">
            <Label>
              Farmer Type <span className="text-destructive">*</span>
            </Label>
            <Select value={farmerType} onValueChange={(v) => setFarmerType(v as FarmerType)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(FARMER_TYPE_LABELS) as FarmerType[]).map((k) => (
                  <SelectItem key={k} value={k}>
                    {FARMER_TYPE_LABELS[k]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-1 text-xs text-muted-foreground">
              "Koulu Rythu" = tenant farmer who cultivates land leased / rented from another owner.
            </p>
          </div>

          <Field label="Village">
            <Input required maxLength={100} value={form.village} onChange={update("village")} />
          </Field>
          <Field label="District">
            <Input required maxLength={100} value={form.district} onChange={update("district")} />
          </Field>
          <Field label="Land Size (acres)">
            <Input
              required
              type="number"
              min="0"
              step="0.1"
              value={form.landSize}
              onChange={update("landSize")}
            />
          </Field>
          <Field label="Crops Grown">
            <Input
              required
              maxLength={200}
              value={form.crops}
              onChange={update("crops")}
              placeholder="Cotton, Paddy"
            />
          </Field>

          {/* ---------- KYC Documents (mandatory) ---------- */}
          <div className="sm:col-span-2">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    KYC & land documents <span className="text-destructive">*</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Aadhaar, PAN and a land record are required. JPG / PNG / PDF, max{" "}
                    {Math.round(DOC_MAX_BYTES / 1024)} KB each.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <DocBlock
                  label="Aadhaar"
                  numberLabel="Aadhaar number (12 digits)"
                  numberValue={aadhaarNo}
                  onNumberChange={setAadhaarNo}
                  numberInputProps={{ pattern: "[0-9]{12}", maxLength: 12, inputMode: "numeric" }}
                  file={aadhaarFile}
                  onFileChange={pickFile(setAadhaarFile)}
                />
                <DocBlock
                  label="PAN"
                  numberLabel="PAN (ABCDE1234F)"
                  numberValue={panNo}
                  onNumberChange={(v) => setPanNo(v.toUpperCase())}
                  numberInputProps={{ pattern: "[A-Z]{5}[0-9]{4}[A-Z]", maxLength: 10 }}
                  file={panFile}
                  onFileChange={pickFile(setPanFile)}
                />
                <div className="sm:col-span-2">
                  <DocBlock
                    label="Land record"
                    numberLabel="Survey / Pattadar passbook no."
                    numberValue={surveyNo}
                    onNumberChange={setSurveyNo}
                    numberInputProps={{ maxLength: 40 }}
                    file={landFile}
                    onFileChange={pickFile(setLandFile)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <div className="flex items-center justify-between">
              <Label>
                GPS Location <span className="text-destructive">*</span>
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={startCapture}
                disabled={capturing}
              >
                {capturing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
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
                      {capturing && (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                          Refining…
                        </span>
                      )}
                    </p>
                    <p className="text-muted-foreground">
                      Lat: {gps.lat.toFixed(6)} · Lng: {gps.lng.toFixed(6)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Accuracy: ±{Math.round(gps.accuracy)}m ·{" "}
                      {new Date(gps.timestamp).toLocaleString()}
                    </p>
                    {address && <p className="mt-1 text-xs text-foreground/80">{address}</p>}
                  </div>
                </div>
              ) : gpsErr ? (
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
                  <div className="text-sm">
                    <p className="font-semibold text-destructive">{gpsErr}</p>
                    <p className="text-xs text-muted-foreground">
                      Enable location permissions in your browser and click Recapture.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-primary" />
                  <div className="text-sm">
                    <p className="font-semibold">Detecting your location…</p>
                    <p className="text-xs text-muted-foreground">
                      Please allow location access when prompted.
                    </p>
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
                    <a
                      href={osmLink!}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      View larger map
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ---------- Payment collection ---------- */}
          <div className="sm:col-span-2">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                    <IndianRupee className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Collect enrollment payment</p>
                    <p className="text-xs text-muted-foreground">
                      Record cash, UPI, card, or net-banking payment now.
                    </p>
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 text-xs">
                  <Checkbox
                    checked={collectPayment}
                    onCheckedChange={(v) => setCollectPayment(v === true)}
                  />
                  <span className="font-medium">{collectPayment ? "Enabled" : "Skip"}</span>
                </label>
              </div>

              {collectPayment && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Plan</Label>
                    <Select value={payKind} onValueChange={(v) => onKindChange(v as PaymentKind)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="joining">Basic Plan · ₹1,499 / year</SelectItem>
                        <SelectItem value="renewal">Premium Plan · ₹4,999 / year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Amount (₹)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      required={collectPayment}
                    />
                  </div>
                  <div>
                    <Label>Method</Label>
                    <Select value={payMethod} onValueChange={(v) => setPayMethod(v as PayMethod)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAY_METHODS.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>
                      {payMethod === "Cash"
                        ? "Receipt no. (optional)"
                        : payMethod === "UPI"
                          ? "UPI ref / txn ID"
                          : payMethod === "Card"
                            ? "Card last 4 / auth code"
                            : "Bank ref no."}
                    </Label>
                    <Input
                      value={payReference}
                      onChange={(e) => setPayReference(e.target.value)}
                      placeholder={payMethod === "UPI" ? "e.g. 4123ABCD56" : ""}
                      required={collectPayment && payMethod === "UPI"}
                      maxLength={64}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Note (optional)</Label>
                    <Input
                      value={payNote}
                      onChange={(e) => setPayNote(e.target.value)}
                      maxLength={200}
                      placeholder="Any remark for this collection"
                    />
                  </div>
                  <div className="sm:col-span-2 inline-flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                    <Banknote className="h-3.5 w-3.5" />
                    Collected by{" "}
                    <span className="font-semibold text-foreground">{staff?.name}</span>. A receipt
                    with txn ID is generated on save.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" size="lg" className="w-full" disabled={!gps}>
              {!gps
                ? "Waiting for GPS…"
                : collectPayment
                  ? `Enroll farmer & collect ₹${payAmount || 0}`
                  : "Save Customer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function DocBlock(props: {
  label: string;
  numberLabel: string;
  numberValue: string;
  onNumberChange: (v: string) => void;
  numberInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  file: DocFile | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { label, numberLabel, numberValue, onNumberChange, numberInputProps, file, onFileChange } =
    props;
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">{label}</p>
        {file && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            <CheckCircle2 className="h-3 w-3" /> Attached
          </span>
        )}
      </div>
      <div className="mt-2">
        <Label className="text-xs">{numberLabel}</Label>
        <Input
          required
          value={numberValue}
          onChange={(e) => onNumberChange(e.target.value)}
          {...numberInputProps}
        />
      </div>
      <div className="mt-2">
        <Label className="text-xs">Upload file</Label>
        <label className="mt-1 flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 text-xs hover:bg-muted">
          <Upload className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="flex-1 truncate text-foreground">
            {file ? (
              <>
                <FileText className="mr-1 inline h-3 w-3" />
                {file.name}{" "}
                <span className="text-muted-foreground">· {(file.size / 1024).toFixed(0)} KB</span>
              </>
            ) : (
              "Choose JPG / PNG / PDF…"
            )}
          </span>
          <input
            type="file"
            accept={DOC_ACCEPT_MIME.join(",")}
            className="sr-only"
            onChange={onFileChange}
            required={!file}
          />
        </label>
      </div>
    </div>
  );
}
