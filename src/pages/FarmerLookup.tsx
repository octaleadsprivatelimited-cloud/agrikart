import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  findCustomerByCode,
  useCurrentStaff,
  usePayments,
  useCustomerEdits,
  useRequests,
  type Customer,
} from "@/lib/staff-store";
import {
  Search,
  User,
  Phone,
  MapPin,
  Calendar,
  Layers,
  Sprout,
  ShieldCheck,
  ShieldAlert,
  Download,
  Clock,
  CreditCard,
  FileSpreadsheet,
} from "lucide-react";

export default function FarmerLookup() {
  const staff = useCurrentStaff();
  const isAdmin = staff?.role === "admin";

  const [code, setCode] = useState("");
  const [farmer, setFarmer] = useState<Customer | null>(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const payments = usePayments();
  const edits = useCustomerEdits(farmer?.id);
  const requests = useRequests({ customerId: farmer?.id });

  // Filter payments and edits for the found farmer
  const farmerPayments = useMemo(() => {
    if (!farmer) return [];
    return payments.filter((p) => p.farmerId === farmer.id || p.farmerId === farmer.farmerCode);
  }, [payments, farmer]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSearched(true);

    const query = code.trim().toUpperCase();
    if (!query) {
      setErrorMsg("Please enter a Farmer ID.");
      setFarmer(null);
      return;
    }

    const found = findCustomerByCode(query);
    if (!found) {
      setFarmer(null);
      setErrorMsg("No farmer found with that ID. Please check the spelling (e.g., AGFC0001).");
      return;
    }

    setFarmer(found);
  };

  const maskedPhone = (phone: string) => {
    if (phone.length <= 4) return "****";
    return "*".repeat(phone.length - 4) + phone.slice(-4);
  };

  return (
    <>
      <PageHeader
        title="Farmer ID Status Lookup"
        subtitle="Track your enrollment progress, membership plan, and service bookings."
      />

      <section className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
        <Card className="border-primary/20 shadow-md">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[260px]">
                <label htmlFor="farmerCode" className="text-sm font-semibold text-foreground">
                  Enter Farmer Unique ID
                </label>
                <Input
                  id="farmerCode"
                  placeholder="e.g. AGFC0001"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mt-1.5 h-11"
                />
              </div>
              <Button type="submit" size="lg" className="h-11">
                <Search className="mr-2 h-5 w-5" /> Search
              </Button>
            </form>
            {errorMsg && <p className="mt-3 text-sm text-destructive font-medium">{errorMsg}</p>}
          </CardContent>
        </Card>

        {searched && farmer && (
          <div className="mt-8 space-y-6">
            {/* Status card */}
            <Card className="overflow-hidden border-border/80 shadow">
              <div className="bg-primary/5 px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/60">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Farmer Profile
                  </span>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    {farmer.farmerName}
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-mono font-bold text-primary">
                      {farmer.farmerCode}
                    </span>
                  </h2>
                </div>
                <Badge
                  className={
                    farmer.status === "Approved"
                      ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                      : farmer.status === "Rejected"
                        ? "bg-destructive hover:bg-destructive text-white"
                        : "bg-amber-500 hover:bg-amber-500 text-white"
                  }
                >
                  {farmer.status}
                </Badge>
              </div>

              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground border-b pb-1">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-3 text-sm gap-2">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="col-span-2 font-medium">{farmer.farmerName}</span>

                      <span className="text-muted-foreground">Mobile:</span>
                      <span className="col-span-2 font-medium">
                        {isAdmin ? farmer.mobile : maskedPhone(farmer.mobile)}
                      </span>

                      <span className="text-muted-foreground">Village:</span>
                      <span className="col-span-2 font-medium">{farmer.village}</span>

                      <span className="text-muted-foreground">District:</span>
                      <span className="col-span-2 font-medium">{farmer.district}</span>

                      <span className="text-muted-foreground">Land Size:</span>
                      <span className="col-span-2 font-medium">
                        {farmer.landSize} acres ({farmer.farmerType || "Owner"})
                      </span>

                      <span className="text-muted-foreground">Crops:</span>
                      <span className="col-span-2 font-medium">{farmer.crops}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground border-b pb-1">
                      {isAdmin ? "KYC Details (Admin Only)" : "Security & Verification Status"}
                    </h3>
                    {isAdmin ? (
                      <div className="grid grid-cols-3 text-sm gap-2">
                        <span className="text-muted-foreground">Aadhaar:</span>
                        <span className="col-span-2 font-mono font-medium">
                          {farmer.documents?.aadhaar?.number || farmer.aadhaar || "—"}
                        </span>

                        <span className="text-muted-foreground">PAN:</span>
                        <span className="col-span-2 font-mono font-medium">
                          {farmer.documents?.pan?.number || "—"}
                        </span>

                        <span className="text-muted-foreground">Survey No:</span>
                        <span className="col-span-2 font-mono font-medium">
                          {farmer.documents?.land?.surveyNo || "—"}
                        </span>

                        <span className="text-muted-foreground">Enrolled By:</span>
                        <span className="col-span-2 font-medium">{farmer.employeeName}</span>

                        <span className="text-muted-foreground">Enrolled At:</span>
                        <span className="col-span-2 font-medium">
                          {new Date(farmer.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <div className="rounded-lg bg-muted/40 p-4 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 p-2 rounded">
                          <ShieldCheck className="h-4 w-4" /> Secure Profile Masking Enabled
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Sensitive credentials (Aadhaar, PAN, and Land surveys) are hidden for
                          privacy. Admins can view complete profiles inside the Admin portal.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Documents and Maps */}
                {isAdmin && (
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Document Attachments
                      </h4>
                      <div className="grid gap-2 text-xs">
                        {farmer.documents?.aadhaar?.file && (
                          <a
                            href={farmer.documents.aadhaar.file.dataUrl}
                            download={farmer.documents.aadhaar.file.name}
                            className="flex items-center justify-between rounded border p-2 hover:bg-muted/40"
                          >
                            <span className="font-semibold truncate">Aadhaar Upload</span>
                            <Download className="h-3.5 w-3.5 text-primary" />
                          </a>
                        )}
                        {farmer.documents?.pan?.file && (
                          <a
                            href={farmer.documents.pan.file.dataUrl}
                            download={farmer.documents.pan.file.name}
                            className="flex items-center justify-between rounded border p-2 hover:bg-muted/40"
                          >
                            <span className="font-semibold truncate">PAN Upload</span>
                            <Download className="h-3.5 w-3.5 text-primary" />
                          </a>
                        )}
                        {farmer.documents?.land?.file && (
                          <a
                            href={farmer.documents.land.file.dataUrl}
                            download={farmer.documents.land.file.name}
                            className="flex items-center justify-between rounded border p-2 hover:bg-muted/40"
                          >
                            <span className="font-semibold truncate">Land Record</span>
                            <Download className="h-3.5 w-3.5 text-primary" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        GPS Coordinate Reference
                      </h4>
                      <div className="rounded border bg-muted/20 p-3 text-xs">
                        <p className="font-semibold">Map Coordinate Fix</p>
                        <p className="text-muted-foreground mt-0.5">
                          Lat: {farmer.gps.lat.toFixed(6)} · Lng: {farmer.gps.lng.toFixed(6)}
                        </p>
                        <a
                          href={`https://www.openstreetmap.org/?mlat=${farmer.gps.lat}&mlon=${farmer.gps.lng}#map=18`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-block font-semibold text-primary hover:underline"
                        >
                          Open in OpenStreetMap
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* History Section */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Payment History */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" /> Billing & Payments
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {farmerPayments.length === 0 ? (
                    <p className="text-sm text-muted-foreground p-4 text-center">
                      No payment history.
                    </p>
                  ) : (
                    <ul className="divide-y text-xs">
                      {farmerPayments.map((p) => (
                        <li key={p.id} className="py-2.5 flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold capitalize">{p.kind} Plan</p>
                            <p className="text-muted-foreground mt-0.5">
                              {new Date(p.createdAt).toLocaleDateString()} · {p.method}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-foreground">₹{p.amount}</p>
                            <p className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 inline-block mt-0.5">
                              {p.status}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* Inquiries & Requests */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Sprout className="h-4 w-4 text-primary" /> Service Requests
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {requests.length === 0 ? (
                    <p className="text-sm text-muted-foreground p-4 text-center">
                      No service requests booked.
                    </p>
                  ) : (
                    <ul className="divide-y text-xs">
                      {requests.map((r) => (
                        <li key={r.id} className="py-2.5 flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold">{r.category}</p>
                            <p className="text-muted-foreground mt-0.5 truncate max-w-[200px]">
                              {r.description || "Inquiry submission"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-muted-foreground">
                              {new Date(r.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-[10px] font-semibold text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10 inline-block mt-0.5">
                              {r.status}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Profile Audit History */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Verification Audit History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {!edits || edits.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-4 text-center">
                    No audit log exists yet.
                  </p>
                ) : (
                  <ul className="divide-y text-xs">
                    {edits.map((e) => (
                      <li key={e.id} className="py-2.5">
                        <div className="flex justify-between items-center gap-2">
                          <span className="font-semibold text-foreground">
                            Profile update by {e.editorName} ({e.editorRole})
                          </span>
                          <span className="text-muted-foreground">
                            {new Date(e.at).toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-1.5 space-y-1 pl-3 border-l-2 border-primary/20">
                          {e.changes.map((c, i) => (
                            <p key={i} className="text-muted-foreground text-[11px]">
                              Changed <b className="text-foreground">{c.field}</b> from{" "}
                              <span className="italic">"{c.from}"</span> to{" "}
                              <b className="text-foreground">"{c.to}"</b>
                            </p>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </>
  );
}
