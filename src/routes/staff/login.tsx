import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { staffLogin } from "@/lib/staff-store";
import { toast } from "sonner";

export const Route = createFileRoute("/staff/login")({ component: StaffLogin });

function StaffLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const s = staffLogin(email.trim(), password);
      toast.success(`Welcome, ${s.name}`);
      void navigate({ to: s.role === "admin" ? "/admin/dashboard" : "/staff/dashboard" });
    } catch {
      toast.error("Invalid email or password.");
    }
  };

  return (
    <section className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Shield className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">Staff Login</h1>
            <p className="mt-1 text-sm text-muted-foreground">For employees and administrators.</p>
          </div>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" size="lg">Login</Button>
          </form>
          <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Demo credentials</p>
            <p className="mt-1">Employee: employee@agrikartfin.com / password123</p>
            <p>Admin: admin@agrikartfin.com / password123</p>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Farmer? <Link to="/login" className="font-semibold text-primary hover:underline">Login here</Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
