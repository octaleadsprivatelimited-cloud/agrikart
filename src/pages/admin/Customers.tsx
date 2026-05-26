import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCustomers, type CustomerStatus } from "@/lib/staff-store";
import { StatusPill } from "../staff/dashboard";
import { Search, MapPin, ChevronRight } from "lucide-react";


const tabs: Array<{ key: "All" | CustomerStatus; label: string }> = [
  { key: "All", label: "All" },
  { key: "Pending", label: "Pending" },
  { key: "Approved", label: "Approved" },
  { key: "Rejected", label: "Rejected" },
];

export default function AdminCustomers() {
  const customers = useCustomers();
  const [tab, setTab] = useState<"All" | CustomerStatus>("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let r = customers;
    if (tab !== "All") r = r.filter(c => c.status === tab);
    if (q) {
      const s = q.toLowerCase();
      r = r.filter(c =>
        c.farmerName.toLowerCase().includes(s) ||
        c.mobile.includes(q) ||
        c.village.toLowerCase().includes(s) ||
        c.district.toLowerCase().includes(s) ||
        c.employeeName.toLowerCase().includes(s)
      );
    }
    return r;
  }, [customers, tab, q]);

  return (
    <div>
      <h1 className="text-3xl font-bold">All Customers</h1>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search name, mobile, village, district, employeeâ€¦" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
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
        <Card className="mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Farmer</th>
                  <th className="px-4 py-3 hidden md:table-cell">Location</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Employee</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                    <td className="px-4 py-3">
                      <Link to="/admin/customers/$id" params={{ id: c.id }} className="font-medium hover:text-primary">{c.farmerName}</Link>
                      <p className="text-xs text-muted-foreground">{c.mobile}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="inline-flex items-center gap-1 text-xs"><MapPin className="h-3 w-3" />{c.village}, {c.district}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">{c.employeeName}</td>
                    <td className="px-4 py-3"><StatusPill status={c.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <Link to="/admin/customers/$id" params={{ id: c.id }} className="inline-flex items-center text-xs font-semibold text-primary hover:underline">
                        View <ChevronRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
