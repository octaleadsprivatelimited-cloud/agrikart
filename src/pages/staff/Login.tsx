import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { staffLogin, staffLogout, getCurrentStaff } from "@/lib/staff-store";
import { toast } from "sonner";


export default function StaffLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const s = getCurrentStaff();
    if (s) {
      if (s.role === "admin") {
        void navigate("/admin/dashboard");
      } else {
        void navigate("/staff/dashboard");
      }
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const s = await staffLogin(email.trim(), password);
      if (s.role === "admin") {
        toast.success(`Welcome Admin, ${s.name}`);
        void navigate("/admin/dashboard");
        return;
      }
      toast.success(`Welcome, ${s.name}`);
      void navigate("/staff/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="p-5 sm:p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Shield className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">Staff Login</h1>
            <p className="mt-1 text-sm text-muted-foreground">For field employees.</p>
          </div>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required disabled={loading} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required disabled={loading} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Administrator? <Link to="/admin/login" className="font-semibold text-primary hover:underline">Admin login</Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
