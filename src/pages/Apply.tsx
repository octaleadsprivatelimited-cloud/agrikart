import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createSubmission, serviceCategories, type ServiceCategory } from "@/lib/staff-store";
import { Sprout, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const empty = {
  farmerName: "", mobile: "", village: "", district: "",
  serviceCategory: "" as ServiceCategory | "",
  message: "",
};

export default function Apply() {
  const [form, setForm] = useState(empty);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.serviceCategory) return toast.error("Please select a service.");
    if (!/^[0-9]{10}$/.test(form.mobile)) return toast.error("Enter a valid 10-digit mobile.");
    const s = createSubmission({
      farmerName: form.farmerName.trim(),
      mobile: form.mobile.trim(),
      village: form.village.trim(),
      district: form.district.trim(),
      serviceCategory: form.serviceCategory as ServiceCategory,
      message: form.message.trim(),
    });
    setSubmittedId(s.id);
    setForm(empty);
    toast.success("Your request has been submitted.");
  };

  if (submittedId) {
    return (
      <section className="container mx-auto max-w-xl px-4 py-16">
        <Card>
          <CardContent className="p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="mt-5 text-2xl font-bold">Request received</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your reference ID is <span className="font-mono font-semibold text-foreground">{submittedId}</span>.
              Our team will review and contact you shortly.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <Button onClick={() => setSubmittedId(null)}>Submit another request</Button>
              <Button asChild variant="outline"><Link to="/">Back home</Link></Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="container mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <div className="mb-6 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Sprout className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Apply for a service</h1>
        <p className="mt-1 text-sm text-muted-foreground">No account needed. Fill the form and our team will reach out.</p>
      </div>
      <Card>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
            <Field label="Farmer Name">
              <Input required maxLength={100} value={form.farmerName} onChange={e => set("farmerName")(e.target.value)} />
            </Field>
            <Field label="Mobile">
              <Input required inputMode="numeric" pattern="[0-9]{10}" maxLength={10} value={form.mobile} onChange={e => set("mobile")(e.target.value)} />
            </Field>
            <Field label="Village">
              <Input required maxLength={100} value={form.village} onChange={e => set("village")(e.target.value)} />
            </Field>
            <Field label="District">
              <Input required maxLength={100} value={form.district} onChange={e => set("district")(e.target.value)} />
            </Field>
            <Field label="Service Required" className="sm:col-span-2">
              <Select value={form.serviceCategory} onValueChange={(v) => set("serviceCategory")(v)}>
                <SelectTrigger><SelectValue placeholder="Select a service…" /></SelectTrigger>
                <SelectContent>
                  {serviceCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Message / Details" className="sm:col-span-2">
              <Textarea required minLength={5} maxLength={500} rows={4} value={form.message} onChange={e => set("message")(e.target.value)} placeholder="Briefly describe what you need…" />
            </Field>
            <div className="sm:col-span-2">
              <Button type="submit" size="lg" className="w-full">Submit request</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
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
