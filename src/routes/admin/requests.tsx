import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCustomers, useRequests, updateRequestStatus, type CustomerStatus } from "@/lib/staff-store";
import { StatusPill } from "../staff/dashboard";

export const Route = createFileRoute("/admin/requests")({ component: AdminRequests });

const tabs: Array<{ key: "All" | CustomerStatus; label: string }> = [
  { key: "All", label: "All" },
  { key: "Pending", label: "Pending" },
  { key: "Approved", label: "Approved" },
  { key: "Rejected", label: "Rejected" },
];

function AdminRequests() {
  const requests = useRequests();
  const customers = useCustomers();
  const [tab, setTab] = useState<"All" | CustomerStatus>("All");

  const customerById = useMemo(() => new Map(customers.map(c => [c.id, c])), [customers]);
  const filtered = tab === "All" ? requests : requests.filter(r => r.status === tab);

  return (
    <div>
      <h1 className="text-3xl font-bold">Service Requests</h1>
      <p className="mt-1 text-sm text-muted-foreground">All service requests across all employees and customers.</p>

      <div className="mt-6 flex flex-wrap gap-1 rounded-md border border-border bg-card p-1 w-fit">
        {tabs.map(t => (
          <button key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="mt-6"><CardContent className="p-8 text-center text-muted-foreground">No service requests match the filter.</CardContent></Card>
      ) : (
        <Card className="mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 hidden md:table-cell">Description</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Employee</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => {
                  const c = customerById.get(r.customerId);
                  return (
                    <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                      <td className="px-4 py-3">
                        {c ? (
                          <Link to="/admin/customers/$id" params={{ id: c.id }} className="font-medium hover:text-primary">{c.farmerName}</Link>
                        ) : <span className="text-muted-foreground">—</span>}
                        <p className="text-xs text-muted-foreground">{c?.village ?? ""}</p>
                      </td>
                      <td className="px-4 py-3 font-medium">{r.category}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground max-w-xs truncate">{r.description || "—"}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">{c?.employeeName ?? "—"}</td>
                      <td className="px-4 py-3"><StatusPill status={r.status} /></td>
                      <td className="px-4 py-3 text-right">
                        {r.status === "Pending" && (
                          <div className="flex justify-end gap-1">
                            <Button size="sm" variant="outline" onClick={() => updateRequestStatus(r.id, "Approved")}>Approve</Button>
                            <Button size="sm" variant="ghost" onClick={() => updateRequestStatus(r.id, "Rejected")}>Reject</Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
