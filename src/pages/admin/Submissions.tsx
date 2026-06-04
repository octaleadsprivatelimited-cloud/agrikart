import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  useSubmissions, useStaffList, assignSubmission, updateSubmissionStatus, approveSubmission,
  type SubmissionStatus,
} from "@/lib/staff-store";
import { Search, MapPin, Phone, Inbox, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const statuses: SubmissionStatus[] = ["New", "Approved", "Assigned", "In Progress", "Completed", "Rejected"];

function statusTone(s: SubmissionStatus): string {
  switch (s) {
    case "New": return "bg-accent/20 text-[oklch(0.45_0.15_75)]";
    case "Approved": return "bg-[oklch(0.93_0.08_145)] text-[oklch(0.35_0.13_150)]";
    case "Assigned": return "bg-primary/10 text-primary";
    case "In Progress": return "bg-[oklch(0.93_0.10_240)] text-[oklch(0.35_0.15_240)]";
    case "Completed": return "bg-[oklch(0.93_0.08_145)] text-[oklch(0.35_0.13_150)]";
    case "Rejected": return "bg-destructive/10 text-destructive";
    default: return "bg-muted text-muted-foreground";
  }
}

export default function AdminSubmissions() {
  const submissions = useSubmissions();
  const staff = useStaffList();
  const employees = useMemo(() => staff.filter(s => s.role === "employee"), [staff]);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"All" | SubmissionStatus>("All");

  const filtered = useMemo(() => {
    let r = submissions;
    if (tab !== "All") r = r.filter(s => s.status === tab);
    if (q) {
      const s = q.toLowerCase();
      r = r.filter(x =>
        x.farmerName.toLowerCase().includes(s) ||
        x.mobile.includes(q) ||
        x.village.toLowerCase().includes(s) ||
        x.district.toLowerCase().includes(s) ||
        x.id.toLowerCase().includes(s)
      );
    }
    return r;
  }, [submissions, tab, q]);

  const handleAssign = (id: string, staffId: string) => {
    try {
      assignSubmission(id, staffId);
      toast.success("Submission assigned");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Farmer Submissions</h1>
          <p className="mt-1 text-sm text-muted-foreground">Forms submitted by farmers from the website. Allocate each to a staff member.</p>
        </div>
        <Badge variant="secondary" className="gap-1.5"><Inbox className="h-3 w-3" /> {submissions.length} total</Badge>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search name, mobile, village, district, ID…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1 rounded-md border border-border bg-card p-1">
          {(["All", ...statuses] as const).map(t => (
            <button key={t}
              onClick={() => setTab(t)}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="mt-6"><CardContent className="p-10 text-center text-muted-foreground">No submissions match the current filter.</CardContent></Card>
      ) : (
        <div className="mt-6 grid gap-3">
          {filtered.map(s => (
            <Card key={s.id}>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-muted-foreground">{s.id} · {new Date(s.createdAt).toLocaleString()}</p>
                    <h3 className="mt-0.5 text-lg font-semibold">{s.farmerName}</h3>
                    <p className="mt-1 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{s.mobile}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{s.village}, {s.district}</span>
                    </p>
                  </div>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(s.status)}`}>{s.status}</span>
                </div>

                <div className="mt-3 rounded-md bg-muted/40 px-3 py-2 text-sm">
                  <span className="font-semibold">{s.serviceCategory}:</span> {s.message}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Assign to staff</p>
                    <Select value={s.assignedStaffId ?? ""} onValueChange={(v) => handleAssign(s.id, v)}>
                      <SelectTrigger><SelectValue placeholder={employees.length ? "Choose employee…" : "No employees available"} /></SelectTrigger>
                      <SelectContent>
                        {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {s.assignedStaffName && (
                      <p className="mt-1 text-xs text-muted-foreground">Currently assigned to <span className="font-medium text-foreground">{s.assignedStaffName}</span></p>
                    )}
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</p>
                    <Select value={s.status} onValueChange={(v) => updateSubmissionStatus(s.id, v as SubmissionStatus)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {statuses.map(st => <SelectItem key={st} value={st}>{st}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-border/60 pt-3">
                  {s.status !== "Approved" && s.status !== "Completed" && s.status !== "Rejected" && (
                    <Button size="sm" onClick={() => { approveSubmission(s.id); toast.success("Lead approved — now visible to staff"); }}>
                      <CheckCircle2 className="h-4 w-4" /> Approve & send to staff
                    </Button>
                  )}
                  {s.status !== "Rejected" && (
                    <Button size="sm" variant="outline" onClick={() => { updateSubmissionStatus(s.id, "Rejected"); toast.success("Lead rejected"); }}>
                      Reject
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
