import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
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
  captureGps,
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
  Loader2,
  CheckCircle2,
  IndianRupee,
  Banknote,
  FileText,
  Upload,
  ShieldCheck,
  MapPin,
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

/* ------------------------------------------------------------------ */
/*  Helper: read file as data URL                                     */
/* ------------------------------------------------------------------ */
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error("Failed to read file"));
    r.readAsDataURL(file);
  });
}

/* ------------------------------------------------------------------ */
/*  Helper: compress image to fit within maxBytes                     */
/* ------------------------------------------------------------------ */
function compressImage(file: File, maxBytes: number): Promise<{ dataUrl: string; size: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width;
        let h = img.height;
        const MAX_DIM = 1024;
        if (w > MAX_DIM || h > MAX_DIM) {
          if (w > h) { h = Math.round((h * MAX_DIM) / w); w = MAX_DIM; }
          else { w = Math.round((w * MAX_DIM) / h); h = MAX_DIM; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas error")); return; }
        ctx.drawImage(img, 0, 0, w, h);
        let quality = 0.7;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);
        let size = Math.round((dataUrl.split(",")[1].length * 3) / 4);
        if (size > maxBytes) { quality = 0.4; dataUrl = canvas.toDataURL("image/jpeg", quality); size = Math.round((dataUrl.split(",")[1].length * 3) / 4); }
        resolve({ dataUrl, size });
      };
      img.onerror = () => reject(new Error("Image parse error"));
      img.src = String(e.target?.result ?? "");
    };
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsDataURL(file);
  });
}

/* ================================================================== */
/*  AddCustomer Component                                             */
/* ================================================================== */
export default function AddCustomer() {
  const staff = useCurrentStaff();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Basic fields
  const [farmerName, setFarmerName] = useState(searchParams.get("name") || "");
  const [mobile, setMobile] = useState(searchParams.get("mobile") || "");
  const [village, setVillage] = useState(searchParams.get("village") || "");
  const [district, setDistrict] = useState(searchParams.get("district") || "");
  const [landSize, setLandSize] = useState("");
  const [crops, setCrops] = useState(searchParams.get("category") ? `Requesting: ${searchParams.get("category")}` : "");
  const [farmerType, setFarmerType] = useState<FarmerType>("Owner");

  // KYC documents
  const [aadhaarNo, setAadhaarNo] = useState("");
  const [panNo, setPanNo] = useState("");
  const [surveyNo, setSurveyNo] = useState("");
  const [aadhaarFile, setAadhaarFile] = useState<DocFile | null>(null);
  const [panFile, setPanFile] = useState<DocFile | null>(null);
  const [landFile, setLandFile] = useState<DocFile | null>(null);

  // GPS
  const [gps, setGps] = useState<{ lat: number; lng: number; accuracy: number; timestamp: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Payment
  const [collectPayment, setCollectPayment] = useState(true);
  const [payKind, setPayKind] = useState<PaymentKind>("joining");
  const [payMethod, setPayMethod] = useState<PayMethod>("Cash");
  const [payAmount, setPayAmount] = useState(String(KIND_AMOUNTS.joining));
  const [payReference, setPayReference] = useState("");
  const [payNote, setPayNote] = useState("");

  // Submitting state
  const [submitting, setSubmitting] = useState(false);

  /* ---------- File picker ---------- */
  const handleFile = (setter: (f: DocFile | null) => void) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!DOC_ACCEPT_MIME.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP or PDF allowed.");
      e.target.value = "";
      return;
    }
    try {
      if (file.type.startsWith("image/")) {
        const compressed = await compressImage(file, DOC_MAX_BYTES);
        setter({ name: file.name.replace(/\.[^/.]+$/, "") + ".jpg", type: "image/jpeg", size: compressed.size, dataUrl: compressed.dataUrl });
        toast.success("Image uploaded.");
      } else {
        if (file.size > DOC_MAX_BYTES) {
          toast.error(`PDF too large (max ${Math.round(DOC_MAX_BYTES / 1024)} KB).`);
          e.target.value = "";
          return;
        }
        const dataUrl = await readFileAsDataUrl(file);
        setter({ name: file.name, type: file.type, size: file.size, dataUrl });
        toast.success("File uploaded.");
      }
    } catch {
      toast.error("Failed to process file.");
      e.target.value = "";
    }
  };

  /* ---------- GPS capture ---------- */
  const doGps = async () => {
    setGpsLoading(true);
    try {
      const fix = await captureGps();
      setGps(fix);
      toast.success(`Location captured (±${Math.round(fix.accuracy)}m)`);
    } catch {
      // Use fallback location
      const fallback = { lat: 17.385044, lng: 78.486671, accuracy: 100, timestamp: Date.now() };
      setGps(fallback);
      toast.info("Using default location. Update later if needed.");
    } finally {
      setGpsLoading(false);
    }
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async () => {
    if (submitting) return;

    // Session check
    if (!staff) {
      toast.error("Session expired. Please log in again.");
      navigate("/staff/login");
      return;
    }

    // Validate required fields
    if (!farmerName.trim()) { toast.error("Farmer name is required."); return; }
    if (!/^\d{10}$/.test(mobile.trim())) { toast.error("Enter a valid 10-digit mobile number."); return; }
    if (!village.trim()) { toast.error("Village is required."); return; }
    if (!district.trim()) { toast.error("District is required."); return; }
    if (!landSize.trim()) { toast.error("Land size is required."); return; }
    if (!crops.trim()) { toast.error("Crops grown is required."); return; }

    // KYC validation
    if (!/^\d{12}$/.test(aadhaarNo.trim())) { toast.error("Enter a valid 12-digit Aadhaar number."); return; }
    if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(panNo.trim().toUpperCase())) { toast.error("Enter a valid PAN (e.g. ABCDE1234F)."); return; }
    if (!surveyNo.trim()) { toast.error("Land survey / pattadar number is required."); return; }
    if (!aadhaarFile || !panFile || !landFile) { toast.error("Upload all three documents: Aadhaar, PAN, and land proof."); return; }

    // Payment validation
    const amountNum = Number(payAmount);
    if (collectPayment) {
      if (!Number.isFinite(amountNum) || amountNum <= 0) { toast.error("Enter a valid payment amount."); return; }
      if (payMethod === "UPI" && !payReference.trim()) { toast.error("UPI reference / txn ID is required."); return; }
    }

    setSubmitting(true);

    try {
      // Get GPS (auto-fallback if it fails)
      let finalGps = gps;
      if (!finalGps) {
        try {
          finalGps = await captureGps();
        } catch {
          finalGps = { lat: 17.385044, lng: 78.486671, accuracy: 100, timestamp: Date.now() };
        }
      }

      const documents: CustomerDocuments = {
        aadhaar: { number: aadhaarNo.trim(), file: aadhaarFile },
        pan: { number: panNo.trim().toUpperCase(), file: panFile },
        land: { surveyNo: surveyNo.trim(), file: landFile },
      };

      const c = createCustomer({
        farmerName: farmerName.trim(),
        farmerType,
        mobile: mobile.trim(),
        aadhaar: aadhaarNo.trim(),
        village: village.trim(),
        district: district.trim(),
        landSize: landSize.trim(),
        crops: crops.trim(),
        gps: finalGps,
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
        toast.success(`${c.farmerName} enrolled · ₹${amountNum} collected (${p.id}). Farmer ID will be issued after admin approval.`);
      } else {
        toast.success(`${c.farmerName} enrolled! Sent to admin for approval.`);
      }

      navigate(`/staff/customers/${c.id}`);
    } catch (err: any) {
      console.error("Enrollment error:", err);
      toast.error(err?.message || "Failed to enroll farmer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-5 sm:p-8">
        <h1 className="text-2xl font-bold">Add Customer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill farmer details below. After submission, it will be sent to admin for approval.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {/* Farmer Name */}
          <div>
            <Label>Farmer Name <span className="text-destructive">*</span></Label>
            <Input maxLength={100} value={farmerName} onChange={(e) => setFarmerName(e.target.value)} placeholder="Full name" />
          </div>

          {/* Mobile */}
          <div>
            <Label>Mobile Number <span className="text-destructive">*</span></Label>
            <Input maxLength={10} value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="10 digits" inputMode="numeric" />
          </div>

          {/* Farmer Type */}
          <div className="sm:col-span-2">
            <Label>Farmer Type <span className="text-destructive">*</span></Label>
            <Select value={farmerType} onValueChange={(v) => setFarmerType(v as FarmerType)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(FARMER_TYPE_LABELS) as FarmerType[]).map((k) => (
                  <SelectItem key={k} value={k}>{FARMER_TYPE_LABELS[k]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Village */}
          <div>
            <Label>Village <span className="text-destructive">*</span></Label>
            <Input maxLength={100} value={village} onChange={(e) => setVillage(e.target.value)} />
          </div>

          {/* District */}
          <div>
            <Label>District <span className="text-destructive">*</span></Label>
            <Input maxLength={100} value={district} onChange={(e) => setDistrict(e.target.value)} />
          </div>

          {/* Land Size */}
          <div>
            <Label>Land Size (acres) <span className="text-destructive">*</span></Label>
            <Input type="number" min="0" step="0.1" value={landSize} onChange={(e) => setLandSize(e.target.value)} />
          </div>

          {/* Crops */}
          <div>
            <Label>Crops Grown <span className="text-destructive">*</span></Label>
            <Input maxLength={200} value={crops} onChange={(e) => setCrops(e.target.value)} placeholder="Cotton, Paddy" />
          </div>

          {/* --------- KYC Documents --------- */}
          <div className="sm:col-span-2">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">KYC & land documents <span className="text-destructive">*</span></p>
                  <p className="text-xs text-muted-foreground">
                    Aadhaar, PAN and a land record are required. JPG / PNG / PDF, max {Math.round(DOC_MAX_BYTES / 1024)} KB each.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <DocBlock label="Aadhaar" numberLabel="Aadhaar number (12 digits)" numberValue={aadhaarNo} onNumberChange={setAadhaarNo} file={aadhaarFile} onFileChange={handleFile(setAadhaarFile)} inputMode="numeric" maxLength={12} />
                <DocBlock label="PAN" numberLabel="PAN (ABCDE1234F)" numberValue={panNo} onNumberChange={(v) => setPanNo(v.toUpperCase())} file={panFile} onFileChange={handleFile(setPanFile)} maxLength={10} />
                <div className="sm:col-span-2">
                  <DocBlock label="Land record" numberLabel="Survey / Pattadar passbook no." numberValue={surveyNo} onNumberChange={setSurveyNo} file={landFile} onFileChange={handleFile(setLandFile)} maxLength={40} />
                </div>
              </div>
            </div>
          </div>

          {/* --------- GPS --------- */}
          <div className="sm:col-span-2">
            <Label>GPS Location</Label>
            <div className="mt-1.5 flex items-center gap-3">
              {gps ? (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Lat: {gps.lat.toFixed(4)}, Lng: {gps.lng.toFixed(4)} (±{Math.round(gps.accuracy)}m)</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Not captured yet (will auto-detect on submit)</span>
              )}
              <Button type="button" variant="outline" size="sm" onClick={doGps} disabled={gpsLoading}>
                {gpsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                {gpsLoading ? "Detecting…" : gps ? "Recapture" : "Capture GPS"}
              </Button>
            </div>
          </div>

          {/* --------- Payment --------- */}
          <div className="sm:col-span-2">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                    <IndianRupee className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Collect enrollment payment</p>
                    <p className="text-xs text-muted-foreground">Record cash, UPI, card, or net-banking payment now.</p>
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 text-xs">
                  <Checkbox checked={collectPayment} onCheckedChange={(v) => setCollectPayment(v === true)} />
                  <span className="font-medium">{collectPayment ? "Enabled" : "Skip"}</span>
                </label>
              </div>

              {collectPayment && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Plan</Label>
                    <Select value={payKind} onValueChange={(v) => { setPayKind(v as PaymentKind); setPayAmount(String(KIND_AMOUNTS[v as PaymentKind])); }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="joining">Basic Plan · ₹1,499 / year</SelectItem>
                        <SelectItem value="renewal">Premium Plan · ₹4,999 / year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Amount (₹)</Label>
                    <Input type="number" min="0" step="1" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
                  </div>
                  <div>
                    <Label>Method</Label>
                    <Select value={payMethod} onValueChange={(v) => setPayMethod(v as PayMethod)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PAY_METHODS.map((m) => (
                          <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>
                      {payMethod === "Cash" ? "Receipt no. (optional)" : payMethod === "UPI" ? "UPI ref / txn ID" : payMethod === "Card" ? "Card last 4 / auth code" : "Bank ref no."}
                    </Label>
                    <Input value={payReference} onChange={(e) => setPayReference(e.target.value)} placeholder={payMethod === "UPI" ? "e.g. 4123ABCD56" : ""} maxLength={64} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Note (optional)</Label>
                    <Input value={payNote} onChange={(e) => setPayNote(e.target.value)} maxLength={200} placeholder="Any remark for this collection" />
                  </div>
                  <div className="sm:col-span-2 inline-flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                    <Banknote className="h-3.5 w-3.5" />
                    Collected by <span className="font-semibold text-foreground">{staff?.name}</span>. A receipt with txn ID is generated on save.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* --------- Submit Button --------- */}
          <div className="sm:col-span-2">
            <Button type="button" size="lg" className="w-full" onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Enrolling…</>
              ) : collectPayment ? (
                `Enroll farmer & collect ₹${payAmount || 0}`
              ) : (
                "Save Customer"
              )}
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              After submission, the farmer will appear in admin panel for approval. Farmer ID is issued upon approval.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  DocBlock — reusable KYC document input block                      */
/* ------------------------------------------------------------------ */
function DocBlock(props: {
  label: string;
  numberLabel: string;
  numberValue: string;
  onNumberChange: (v: string) => void;
  file: DocFile | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputMode?: string;
  maxLength?: number;
}) {
  const { label, numberLabel, numberValue, onNumberChange, file, onFileChange, inputMode, maxLength } = props;
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
        <Input value={numberValue} onChange={(e) => onNumberChange(e.target.value)} maxLength={maxLength} inputMode={inputMode as any} />
      </div>
      <div className="mt-2">
        <Label className="text-xs">Upload file</Label>
        <label className="mt-1 flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 text-xs hover:bg-muted">
          <Upload className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="flex-1 truncate text-foreground">
            {file ? (
              <>
                <FileText className="mr-1 inline h-3 w-3" />
                {file.name} <span className="text-muted-foreground">· {(file.size / 1024).toFixed(0)} KB</span>
              </>
            ) : (
              "Choose JPG / PNG / PDF…"
            )}
          </span>
          <input type="file" accept={DOC_ACCEPT_MIME.join(",")} className="sr-only" onChange={onFileChange} />
        </label>
      </div>
    </div>
  );
}
