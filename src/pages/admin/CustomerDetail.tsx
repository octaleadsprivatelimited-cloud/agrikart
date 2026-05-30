import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  useCustomer, useRequests, updateCustomerStatus, updateRequestStatus,
  useCurrentStaff, useCustomerEdits, isFarmerVerified,
  type Customer, type CustomerDocuments, type DocFile,
} from "@/lib/staff-store";
import { useOrders, type Order } from "@/lib/shop-store";
import { CustomerMapClient } from "@/components/CustomerMapClient";
import { StatusPill } from "../staff/Dashboard";
import {
  ArrowLeft, MapPin, Phone, Sprout, CheckCircle2, XCircle, History,
  FileText, ShieldCheck, ShieldAlert, Download, ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";


export default function AdminCustomerDetail() {
  const { id } = useParams();
  const staff = useCurrentStaff();
  const customer = useCustomer(id);
  const requests = useRequests({ customerId: id });
  const edits = useCustomerEdits(id);
  const [remarks, setRemarks] = useState("");

  if (!customer) {
    return (
      <Card><CardContent className="p-8 text-center text-muted-foreground">
        Customer not found. <Link to="/admin/customers" className="text-primary underline">Back</Link>
      </CardContent></Card>
    );
  }

  const verified = isFarmerVerified(customer);
  const hasDocs = !!customer.documents;

  const approve = () => {
    if (!staff) return;
    if (!hasDocs) { toast.error("Cannot approve: farmer has not submitted KYC documents."); return; }
    try { updateCustomerStatus(customer.id, "Approved", staff, remarks.trim() || undefined); toast.success(`${customer.farmerName} approved`); setRemarks(""); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  };
  const reject = () => {
    if (!staff) return;
    try { updateCustomerStatus(customer.id, "Rejected", staff, remarks.trim() || undefined); toast.success(`${customer.farmerName} rejected`); setRemarks(""); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  };

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/admin/customers"><ArrowLeft className="h-4 w-4" /> Back</Link>
      </Button>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">{customer.farmerName}</h1>
              <p className="mt-1 text-xs"><span className="inline-block rounded bg-primary/10 px-2 py-0.5 font-mono font-bold text-primary">Farmer ID: {customer.farmerCode}</span></p>
              <p className="mt-1 text-sm text-muted-foreground inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {customer.village}, {customer.district}
              </p>
            </div>
            <StatusPill status={customer.status} />
          </div>
          {customer.remarks && (
            <p className="mt-3 rounded-md bg-muted px-3 py-2 text-sm"><span className="font-semibold">Remarks:</span> {customer.remarks}</p>
          )}
          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <Info Icon={Phone} label="Mobile" value={customer.mobile} />
            <Info Icon={Sprout} label="Crops" value={customer.crops} />
            <Info label="Land size" value={`${customer.landSize} acres`} />
            <Info label="Aadhaar" value={customer.aadhaar || "—"} />
            <Info label="Added by" value={customer.employeeName} />
            <Info label="Date" value={new Date(customer.createdAt).toLocaleString()} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold">Approval</h2>
          <p className="mt-1 text-sm text-muted-foreground">Add optional remarks before approving or rejecting.</p>
          <div className="mt-4">
            <Label htmlFor="rmk">Remarks (optional)</Label>
            <Textarea id="rmk" rows={2} maxLength={500} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="e.g. Verified Aadhaar and land documents." />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={approve} disabled={customer.status === "Approved"}>
              <CheckCircle2 className="h-4 w-4" /> Approve
            </Button>
            <Button onClick={reject} variant="destructive" disabled={customer.status === "Rejected"}>
              <XCircle className="h-4 w-4" /> Reject
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold">GPS Location</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {customer.gps.lat.toFixed(6)}, {customer.gps.lng.toFixed(6)} · ±{Math.round(customer.gps.accuracy)}m · {new Date(customer.gps.timestamp).toLocaleString()}
          </p>
          <div className="mt-4">
            <CustomerMapClient lat={customer.gps.lat} lng={customer.gps.lng} label={customer.farmerName} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold">Service Requests</h2>
          {requests.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No service requests yet.</p>
          ) : (
            <ul className="mt-3 divide-y">
              {requests.map(r => (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                  <div>
                    <p className="font-medium">{r.category}</p>
                    <p className="text-xs text-muted-foreground">{r.description || "—"} · {new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill status={r.status} />
                    {r.status === "Pending" && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => updateRequestStatus(r.id, "Approved")}>Approve</Button>
                        <Button size="sm" variant="ghost" onClick={() => updateRequestStatus(r.id, "Rejected")}>Reject</Button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <DocumentsCard customer={customer} verified={verified} />
      <OrderHistoryCard farmerCode={customer.farmerCode} />
      <EditHistoryCard edits={edits} />
    </div>
  );
}

export function EditHistoryCard({ edits }: { edits: ReturnType<typeof useCustomerEdits> }) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="inline-flex items-center gap-2 text-lg font-semibold"><History className="h-4 w-4" /> Edit History</h2>
        {edits.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No edits recorded yet.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {edits.map(e => (
              <li key={e.id} className="border-l-2 border-primary/40 pl-4">
                <p className="text-sm font-medium">
                  {e.editorName} <span className="text-xs uppercase text-muted-foreground">({e.editorRole})</span>
                </p>
                <p className="text-xs text-muted-foreground">{new Date(e.at).toLocaleString()}</p>
                <ul className="mt-2 space-y-1 text-xs">
                  {e.changes.map((c, i) => (
                    <li key={i}>
                      <span className="font-medium">{c.field}:</span>{" "}
                      <span className="line-through text-muted-foreground">{c.from || "—"}</span>{" → "}
                      <span className="text-foreground">{c.to || "—"}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function Info({ Icon, label, value }: { Icon?: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      {Icon && <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />}
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

export function DocumentsCard({ customer, verified }: { customer: Customer; verified: boolean }) {
  const d = customer.documents;
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold">
            <FileText className="h-4 w-4" /> KYC Documents
          </h2>
          {verified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              <ShieldCheck className="h-3.5 w-3.5" /> Verified — can purchase
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              <ShieldAlert className="h-3.5 w-3.5" /> Not yet verified
            </span>
          )}
        </div>
        {!d ? (
          <p className="mt-3 text-sm text-muted-foreground">No documents on file (legacy record). Ask the farmer to re-enroll to upload Aadhaar, PAN and land proof.</p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <DocTile title="Aadhaar" subtitle={d.aadhaar.number} file={d.aadhaar.file} />
            <DocTile title="PAN" subtitle={d.pan.number} file={d.pan.file} />
            <DocTile title="Land record" subtitle={d.land.surveyNo} file={d.land.file} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DocTile({ title, subtitle, file }: { title: string; subtitle: string; file: DocFile }) {
  const isImage = file.type.startsWith("image/");
  return (
    <div className="rounded-md border border-border bg-card p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{title}</p>
      <p className="mt-0.5 font-mono text-sm font-medium">{subtitle}</p>
      <div className="mt-2 overflow-hidden rounded border border-border bg-muted/40">
        {isImage ? (
          <img src={file.dataUrl} alt={title} className="h-32 w-full object-cover" />
        ) : (
          <div className="grid h-32 place-items-center text-xs text-muted-foreground">
            <FileText className="mb-1 h-6 w-6" /> PDF document
          </div>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="truncate text-muted-foreground">{file.name}</span>
        <a href={file.dataUrl} download={file.name} className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
          <Download className="h-3 w-3" /> Open
        </a>
      </div>
    </div>
  );
}

export function OrderHistoryCard({ farmerCode }: { farmerCode: string }) {
  const orders = useOrders().filter((o: Order) => o.userId === farmerCode);
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="inline-flex items-center gap-2 text-lg font-semibold">
          <ShoppingBag className="h-4 w-4" /> Purchase History
        </h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No purchases yet for this farmer.</p>
        ) : (
          <ul className="mt-3 divide-y">
            {orders.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">{o.id}</p>
                  <p className="font-medium">{o.lines.map(l => `${l.name} ×${l.qty}`).join(", ")}</p>
                  <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString()} · {o.paymentMode} · {o.paymentState}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{o.total.toLocaleString()}</p>
                  <StatusPill status={o.status as never} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
