import { Link, useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCustomer,
  useRequests,
  addServiceRequest,
  serviceCategories,
  type ServiceCategory,
  useCurrentStaff,
  useCustomerEdits,
  editCustomer,
  permissions,
} from "@/lib/staff-store";
import { CustomerMapClient } from "@/components/CustomerMapClient";
import { StatusPill } from "./Dashboard";
import { EditHistoryCard } from "../admin/CustomerDetail";
import { ArrowLeft, MapPin, Phone, Sprout, Plus, Pencil, X, Save } from "lucide-react";
import { toast } from "sonner";

export default function CustomerDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const staff = useCurrentStaff();
  const customer = useCustomer(id);
  const requests = useRequests({ customerId: id });
  const edits = useCustomerEdits(id);

  const catParam = (searchParams.get("category") as ServiceCategory | "") || "";
  const descParam = searchParams.get("desc") || "";

  const [cat, setCat] = useState<ServiceCategory | "">(catParam);
  const [desc, setDesc] = useState(descParam);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  if (!customer) {
    return (
      <Card>
        <CardContent className="p-5 sm:p-8 text-center text-muted-foreground">
          Customer not found.{" "}
          <Link to="/staff/customers" className="text-primary underline">
            Back to list
          </Link>
        </CardContent>
      </Card>
    );
  }

  const canEdit = permissions.canEditCustomer(staff, customer);

  const startEdit = () => {
    setForm({
      farmerName: customer.farmerName,
      mobile: customer.mobile,
      aadhaar: customer.aadhaar ?? "",
      village: customer.village,
      district: customer.district,
      landSize: customer.landSize,
      crops: customer.crops,
      remarks: customer.remarks ?? "",
    });
    setEditing(true);
  };
  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staff) return;
    try {
      const { edit } = editCustomer(customer.id, form, staff);
      toast.success(
        edit
          ? `Saved ${edit.changes.length} change${edit.changes.length === 1 ? "" : "s"}`
          : "No changes to save",
      );
      setEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  const addReq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cat) return;
    addServiceRequest(customer.id, cat, desc.trim());
    setCat("");
    setDesc("");
    toast.success("Service request added");
  };

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/staff/customers">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </Button>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">{customer.farmerName}</h1>
              <p className="mt-1 text-xs">
                {customer.farmerCode ? (
                  <span className="inline-block rounded bg-primary/10 px-2 py-0.5 font-mono font-bold text-primary">
                    Farmer ID: {customer.farmerCode}
                  </span>
                ) : (
                  <span className="inline-block rounded bg-muted px-2 py-0.5 font-medium text-muted-foreground">
                    Farmer ID will be issued after admin approval
                  </span>
                )}
              </p>
              <p className="mt-1 text-sm text-muted-foreground inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {customer.village}, {customer.district}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusPill status={customer.status} />
              {canEdit && !editing && (
                <Button size="sm" variant="outline" onClick={startEdit}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
              )}
            </div>
          </div>

          {editing ? (
            <form onSubmit={saveEdit} className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ["farmerName", "Farmer Name"],
                ["mobile", "Mobile"],
                ["aadhaar", "Aadhaar"],
                ["village", "Village"],
                ["district", "District"],
                ["landSize", "Land size (acres)"],
                ["crops", "Crops"],
              ].map(([k, label]) => (
                <div key={k}>
                  <Label>{label}</Label>
                  <Input
                    value={form[k] ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <Label>Remarks</Label>
                <Textarea
                  rows={2}
                  value={form.remarks ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2 flex gap-2">
                <Button type="submit">
                  <Save className="h-4 w-4" /> Save changes
                </Button>
                <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                  <X className="h-4 w-4" /> Cancel
                </Button>
                <p className="ml-auto self-center text-xs text-muted-foreground">
                  Customer entries cannot be deleted.
                </p>
              </div>
            </form>
          ) : (
            <>
              {customer.remarks && (
                <p className="mt-3 rounded-md bg-muted px-3 py-2 text-sm">
                  <span className="font-semibold">Remarks:</span> {customer.remarks}
                </p>
              )}
              <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <Info Icon={Phone} label="Mobile" value={customer.mobile} />
                <Info Icon={Sprout} label="Crops" value={customer.crops} />
                <Info label="Land size" value={`${customer.landSize} acres`} />
                <Info label="Aadhaar" value={customer.aadhaar || "—"} />
                <Info label="Added by" value={customer.employeeName} />
                <Info label="Date" value={new Date(customer.createdAt).toLocaleString()} />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold">GPS Location</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {customer.gps.lat.toFixed(6)}, {customer.gps.lng.toFixed(6)} · ±
            {Math.round(customer.gps.accuracy)}m
          </p>
          <div className="mt-4">
            <CustomerMapClient
              lat={customer.gps.lat}
              lng={customer.gps.lng}
              label={customer.farmerName}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold">Service Requests</h2>
          <form onSubmit={addReq} className="mt-4 grid gap-3 sm:grid-cols-[200px_1fr_auto]">
            <div>
              <Label>Category</Label>
              <Select value={cat} onValueChange={(v) => setCat(v as ServiceCategory)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                required
                minLength={3}
                maxLength={500}
                rows={1}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={!cat}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
          </form>

          {requests.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No service requests yet.</p>
          ) : (
            <ul className="mt-4 divide-y">
              {requests.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{r.category}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.description || "—"} · {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusPill status={r.status} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <EditHistoryCard edits={edits} />
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
