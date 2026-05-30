
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTickets, replyTicket, type Ticket } from "@/lib/shop-store";
import { useCurrentStaff } from "@/lib/staff-store";
import { toast } from "sonner";


export default function AdminTickets() {
  const tickets = useTickets();
  const staff = useCurrentStaff();
  const [view, setView] = useState<Ticket | null>(null);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<Ticket["status"]>("In Progress");

  const send = () => {
    if (!view || !msg.trim()) return toast.error("Reply required");
    replyTicket(view.id, staff?.name ?? "Admin", msg.trim(), status);
    toast.success("Reply sent");
    setMsg(""); setView(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
        <p className="mt-1 text-sm text-muted-foreground">{tickets.length} tickets · {tickets.filter(t => t.status !== "Closed").length} open</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-4 py-3">Ticket</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Topic</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th><th className="px-4 py-3"></th></tr>
              </thead>
              <tbody className="divide-y">
                {tickets.map(t => (
                  <tr key={t.id}>
                    <td className="px-4 py-3 font-mono text-xs">{t.id}</td>
                    <td className="px-4 py-3">{t.userName}</td>
                    <td className="px-4 py-3"><Badge variant="outline">{t.topic}</Badge></td>
                    <td className="px-4 py-3">{t.subject}</td>
                    <td className="px-4 py-3"><Badge variant={t.status === "Closed" ? "secondary" : t.status === "Open" ? "destructive" : "default"}>{t.status}</Badge></td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right"><Button size="sm" variant="outline" onClick={() => { setView(t); setStatus(t.status === "Open" ? "In Progress" : t.status); }}>Open</Button></td>
                  </tr>
                ))}
                {tickets.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">No tickets yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!view} onOpenChange={(v) => !v && setView(null)}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{view?.subject}</DialogTitle></DialogHeader>
          {view && (
            <div className="space-y-3 text-sm">
              <div className="rounded-md border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">{view.userName} · {view.topic} {view.orderId ? `· ${view.orderId}` : ""}</p>
                <p className="mt-1">{view.message}</p>
              </div>
              <div className="space-y-2">
                {view.replies.map((r, i) => (
                  <div key={i} className={`rounded-md p-3 text-sm ${r.author === view.userName ? "bg-muted" : "bg-primary/5"}`}>
                    <p className="text-xs text-muted-foreground">{r.author} · {new Date(r.ts).toLocaleString()}</p>
                    <p className="mt-1">{r.message}</p>
                  </div>
                ))}
              </div>
              <Textarea rows={3} value={msg} onChange={e => setMsg(e.target.value)} placeholder="Write a reply…" />
              <Select value={status} onValueChange={(v) => setStatus(v as Ticket["status"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setView(null)}>Cancel</Button><Button onClick={send}>Send reply</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
