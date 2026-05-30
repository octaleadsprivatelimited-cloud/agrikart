
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useSettings, updateSettings, type CompanySettings } from "@/lib/shop-store";
import { toast } from "sonner";


export default function AdminSettings() {
  const live = useSettings();
  const [s, setS] = useState<CompanySettings>(live);
  useEffect(() => { setS(live); }, [live]);

  const save = () => { updateSettings(s); toast.success("Settings saved"); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Company profile, payment, shipping & compliance.</p>
      </div>

      <Card><CardContent className="space-y-3 p-6">
        <h2 className="text-base font-semibold">Company profile</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name"><Input value={s.name} onChange={e => setS({ ...s, name: e.target.value })} /></Field>
          <Field label="Tagline"><Input value={s.tagline} onChange={e => setS({ ...s, tagline: e.target.value })} /></Field>
          <Field label="Phone"><Input value={s.phone} onChange={e => setS({ ...s, phone: e.target.value })} /></Field>
          <Field label="Email"><Input value={s.email} onChange={e => setS({ ...s, email: e.target.value })} /></Field>
          <Field label="Address" className="sm:col-span-2"><Textarea rows={2} value={s.address} onChange={e => setS({ ...s, address: e.target.value })} /></Field>
        </div>
      </CardContent></Card>

      <Card><CardContent className="space-y-3 p-6">
        <h2 className="text-base font-semibold">Compliance</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="GSTIN"><Input value={s.gstin} onChange={e => setS({ ...s, gstin: e.target.value })} /></Field>
          <Field label="Licenses" className="sm:col-span-2"><Textarea rows={2} value={s.license} onChange={e => setS({ ...s, license: e.target.value })} /></Field>
        </div>
      </CardContent></Card>

      <Card><CardContent className="space-y-3 p-6">
        <h2 className="text-base font-semibold">Payment methods</h2>
        <div className="flex items-center justify-between rounded-md border p-3">
          <div><p className="font-medium">Cash on Delivery</p><p className="text-xs text-muted-foreground">Allow COD at checkout</p></div>
          <Switch checked={s.codEnabled} onCheckedChange={(v) => setS({ ...s, codEnabled: v })} />
        </div>
        <div className="flex items-center justify-between rounded-md border p-3">
          <div><p className="font-medium">Online payments</p><p className="text-xs text-muted-foreground">Razorpay (to be integrated)</p></div>
          <Switch checked={s.onlineEnabled} onCheckedChange={(v) => setS({ ...s, onlineEnabled: v })} />
        </div>
      </CardContent></Card>

      <Card><CardContent className="space-y-3 p-6">
        <h2 className="text-base font-semibold">Shipping</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Free shipping above (₹)"><Input type="number" value={s.freeShippingAbove} onChange={e => setS({ ...s, freeShippingAbove: +e.target.value })} /></Field>
          <Field label="Shipping fee (₹)"><Input type="number" value={s.shippingFee} onChange={e => setS({ ...s, shippingFee: +e.target.value })} /></Field>
        </div>
      </CardContent></Card>

      <Card><CardContent className="space-y-3 p-6">
        <h2 className="text-base font-semibold">Roles & permissions</h2>
        <p className="text-sm text-muted-foreground">Roles are managed in <a href="/admin/staff" className="text-primary hover:underline">Staff</a>. Current roles: Admin, Employee, Farmer.</p>
        <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-5">
          <li><strong>Admin</strong> — full access to all modules.</li>
          <li><strong>Employee</strong> — customers, requests, payments collection.</li>
          <li><strong>Farmer</strong> — customer portal only.</li>
        </ul>
      </CardContent></Card>

      <div className="flex justify-end"><Button onClick={save}>Save all changes</Button></div>
    </div>
  );
}
function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={`space-y-1.5 ${className ?? ""}`}><Label className="text-xs">{label}</Label>{children}</div>;
}
