import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCustomer, useRequests, updateCustomerStatus, updateRequestStatus } from "@/lib/staff-store";
import { CustomerMapClient } from "@/components/CustomerMapClient";
import { StatusPill } from "../staff/dashboard";
import { ArrowLeft, MapPin, Phone, Sprout, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/customers/$id")({ component: AdminCustomerDetail });

function AdminCustomerDetail() {
  const { id } = Route.useParams();
  const customer = useCustomer(id);
  const requests = useRequests({ customerId: id });
  const [remarks, setRemarks] = useState("");

  if (!customer) {
    return (
      <Card><CardContent className="p-8 text-center text-muted-foreground">
        Customer not found. <Link to="/admin/customers" className="text-primary underline">Back</Link>
      </CardContent></Card>
    );
  }

  const approve = () => {
    updateCustomerStatus(customer.id, "Approved", remarks.trim() || undefined);
    toast.success(`${customer.farmerName} approved`);
    setRemarks("");
  };
  const reject = () => {
    updateCustomerStatus(customer.id, "Rejected", remarks.trim() || undefined);
    toast.success(`${customer.farmerName} rejected`);
    setRemarks("");
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
    </div>
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
