
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useStaffList, createStaff, deleteStaff, updateStaffRole, useCurrentStaff, resetStaffPassword, type StaffRole } from "@/lib/staff-store";
import { UserPlus, Trash2, ShieldCheck, User, KeyRound } from "lucide-react";
import { toast } from "sonner";


export default function AdminStaff() {
  const me = useCurrentStaff();
  const staff = useStaffList();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee" as StaffRole });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || form.password.length < 6) {
      toast.error("Fill all fields. Password must be 6+ characters.");
      return;
    }
    try {
      createStaff(form);
      toast.success(`${form.role === "admin" ? "Admin" : "Employee"} added`);
      setForm({ name: "", email: "", password: "", role: "employee" });
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const remove = (id: string, name: string) => {
    if (id === me?.id) return toast.error("You cannot delete your own account.");
    if (!confirm(`Remove ${name}?`)) return;
    deleteStaff(id);
    toast.success("Removed");
  };

  const resetPw = (id: string, name: string) => {
    const next = prompt(`Set a new password for ${name} (min 6 chars):`);
    if (next == null) return;
    try {
      resetStaffPassword(me, id, next);
      toast.success(`Password reset for ${name}`);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">Add or remove employees and admins. Admins can manage everything.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold"><UserPlus className="h-4 w-4" /> Add Staff</h2>
          <form onSubmit={submit} className="grid gap-3 md:grid-cols-4">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><Label>Password</Label><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <div>
              <Label>Role</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as StaffRole })}>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <Button type="submit" className="md:col-span-4 md:w-fit">Add Staff</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {staff.map(s => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{s.name} {s.id === me?.id && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-foreground"}`}>
                      {s.role === "admin" ? <ShieldCheck className="h-3 w-3" /> : <User className="h-3 w-3" />}
                      {s.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => resetPw(s.id, s.name)} title="Reset password">
                        <KeyRound className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => updateStaffRole(s.id, s.role === "admin" ? "employee" : "admin")} disabled={s.id === me?.id}>
                        Make {s.role === "admin" ? "Employee" : "Admin"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(s.id, s.name)} disabled={s.id === me?.id}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
