import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCurrentStaff, useCustomers, type CustomerStatus, permissions } from "@/lib/staff-store";
import { StatusPill } from "./Dashboard";
import { Search, MapPin, ChevronRight } from "lucide-react";


const tabs: Array<{ key: "All" | CustomerStatus; label: string }> = [
  { key: "All", label: "All" },
  { key: "Pending", label: "Pending" },
  { key: "Approved", label: "Approved" },
  { key: "Rejected", label: "Rejected" },
];

export default function CustomersList() {
  const staff = useCurrentStaff();
  const seesAll = permissions.canViewAllCustomers(staff);
  const customers = useCustomers({ employeeId: seesAll ? undefined : staff?.id });
  const [tab, setTab] = useState<"All" | CustomerStatus>("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let r = customers;
    if (tab !== "All") r = r.filter(c => c.status === tab);
    if (q) {
      const s = q.toLowerCase();
      r = r.filter(c => c.farmerName.toLowerCase().includes(s) || c.mobile.includes(q) || c.village.toLowerCase().includes(s) || (c.farmerCode ?? "").toLowerCase().includes(s));
    }
    return r;
  }, [customers, tab, q]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button asChild><Link to="/staff/add-customer">Add Customer</Link></Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search name, mobile or village…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1 rounded-md border border-border bg-card p-1">
          {tabs.map(t => (
            <button key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="mt-6"><CardContent className="p-8 text-center text-muted-foreground">No customers match the current filter.</CardContent></Card>
      ) : (
        <div className="mt-6 grid gap-3">
          {filtered.map(c => (
            <Link key={c.id} to={`/staff/customers/${c.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary font-bold">
                    {c.farmerName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{c.farmerName} <span className="ml-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-mono font-bold text-primary">{c.farmerCode}</span></p>
                    <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{c.village}, {c.district} · {c.mobile}
                    </p>
                  </div>
                  <StatusPill status={c.status} />
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
