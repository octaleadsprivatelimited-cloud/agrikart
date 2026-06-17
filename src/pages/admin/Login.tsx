import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";
import { staffLogin, staffLogout, ADMIN_DEFAULT_EMAIL, getCurrentStaff } from "@/lib/staff-store";
import { toast } from "sonner";
import { firebaseAuth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function AdminLogin() {
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
    const cleanEmail = email.trim();
    try {
      // Primary: Firebase Auth for the admin account.
      if (cleanEmail.toLowerCase() === ADMIN_DEFAULT_EMAIL.toLowerCase()) {
        try {
          await signInWithEmailAndPassword(firebaseAuth, cleanEmail, password);
        } catch (err: unknown) {
          const code = (err as { code?: string })?.code ?? "";
          // Fallback to local credentials only if the Firebase user doesn't exist yet.
          if (code !== "auth/user-not-found" && code !== "auth/invalid-credential") {
            throw err;
          }
        }
      }
      const s = await staffLogin(cleanEmail, password);
      if (s.role === "employee") {
        toast.success(`Welcome, ${s.name}`);
        void navigate("/staff/dashboard");
        return;
      }
      toast.success(`Welcome Admin, ${s.name}`);
      void navigate("/admin/dashboard");
    } catch {
      toast.error("Invalid email or password.");
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
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-2xl font-bold">Admin Login</h1>
            <p className="mt-1 text-sm text-muted-foreground">Restricted to administrators.</p>
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
            <Button type="submit" size="lg" disabled={loading}>{loading ? "Signing in…" : "Login"}</Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Field employee? <Link to="/staff/login" className="font-semibold text-primary hover:underline">Staff login</Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
