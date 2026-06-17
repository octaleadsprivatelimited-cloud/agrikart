import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  useCurrentStaff,
  useSubmissions,
  updateSubmissionStatus,
  type SubmissionStatus,
} from "@/lib/staff-store";
import { MapPin, Phone, Inbox } from "lucide-react";

const statuses: SubmissionStatus[] = [
  "Approved",
  "Assigned",
  "In Progress",
  "Completed",
  "Rejected",
];

function tone(s: SubmissionStatus): string {
  switch (s) {
    case "New":
      return "bg-accent/20 text-[oklch(0.45_0.15_75)]";
    case "Approved":
      return "bg-[oklch(0.93_0.08_145)] text-[oklch(0.35_0.13_150)]";
    case "Assigned":
      return "bg-primary/10 text-primary";
    case "In Progress":
      return "bg-[oklch(0.93_0.10_240)] text-[oklch(0.35_0.15_240)]";
    case "Completed":
      return "bg-[oklch(0.93_0.08_145)] text-[oklch(0.35_0.13_150)]";
    case "Rejected":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function StaffSubmissions() {
  const staff = useCurrentStaff();
  const submissions = useSubmissions({ forStaffId: staff?.id });
  const [tab, setTab] = useState<"All" | SubmissionStatus>("All");
  const filtered = useMemo(
    () => (tab === "All" ? submissions : submissions.filter((s) => s.status === tab)),
    [submissions, tab],
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">My Assigned Submissions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Farmer requests allocated to you by the admin.
          </p>
        </div>
        <Badge variant="secondary" className="gap-1.5">
          <Inbox className="h-3 w-3" /> {submissions.length} total
        </Badge>
      </div>

      <div className="mt-6 flex flex-wrap gap-1 rounded-md border border-border bg-card p-1 w-fit">
        {(["All", ...statuses] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="p-10 text-center text-muted-foreground">
            No submissions assigned to you yet.
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 grid gap-3">
          {filtered.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-muted-foreground">
                      {s.id} · {new Date(s.createdAt).toLocaleString()}
                    </p>
                    <h3 className="mt-0.5 text-lg font-semibold">{s.farmerName}</h3>
                    <p className="mt-1 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {s.mobile}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {s.village}, {s.district}
                      </span>
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tone(s.status)}`}
                  >
                    {s.status}
                  </span>
                </div>

                <div className="mt-3 rounded-md bg-muted/40 px-3 py-2 text-sm">
                  <span className="font-semibold">{s.serviceCategory}:</span> {s.message}
                </div>

                <div className="mt-4 max-w-xs">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Update status
                  </p>
                  <Select
                    value={s.status}
                    onValueChange={(v) => updateSubmissionStatus(s.id, v as SubmissionStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((st) => (
                        <SelectItem key={st} value={st}>
                          {st}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
