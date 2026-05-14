import { Link } from "react-router-dom";
import { useLiveStreams, useDeleteLiveStream, useUpdateLiveStream } from "@/services/queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Radio } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

function statusVariant(status: string): "default" | "secondary" | "destructive" {
  if (status === "live") return "default";
  if (status === "scheduled") return "secondary";
  return "secondary";
}

export default function LiveStreamAdmin() {
  const { data: streams = [], isLoading } = useLiveStreams();
  const remove = useDeleteLiveStream();
  const update = useUpdateLiveStream();

  const sorted = [...streams].sort((a, b) => b.date.localeCompare(a.date));

  async function toggleLive(id: string, current: string) {
    const newStatus = current === "live" ? "offline" : "live";
    const stream = streams.find((s) => s.id === id);
    if (!stream) return;
    try {
      await update.mutateAsync({
        id,
        title: stream.title,
        description: stream.description,
        stream_link: stream.stream_link,
        status: newStatus,
        date: stream.date,
      });
      toast.success(newStatus === "live" ? "Stream is now live" : "Stream ended");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Live streams"
        description="Manage your live worship streams. Set status to 'Live' to broadcast to visitors."
        newHref="/admin/live/new"
        newLabel="New stream"
      />
      <div className="bg-background border border-border rounded-2xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={4} className="text-center py-12 text-ink-muted">Loading…</TableCell></TableRow>}
            {!isLoading && sorted.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center py-12 text-ink-muted">No streams yet.</TableCell></TableRow>
            )}
            {sorted.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.title}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(s.status)} className="capitalize gap-1.5">
                    {s.status === "live" && <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />}
                    {s.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-ink-muted whitespace-nowrap">{format(parseISO(s.date), "MMM d, yyyy h:mm a")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => toggleLive(s.id, s.status)}
                      disabled={update.isPending}
                    >
                      <Radio className="h-3.5 w-3.5" />
                      {s.status === "live" ? "End stream" : "Go live"}
                    </Button>
                    <Button asChild variant="ghost" size="sm" className="gap-1.5">
                      <Link to={`/admin/live/${s.id}`}><Pencil className="h-3.5 w-3.5" /> Edit</Link>
                    </Button>
                    <DeleteConfirm
                      title={`Delete "${s.title}"?`}
                      onConfirm={async () => {
                        await remove.mutateAsync(s.id);
                        toast.success("Stream deleted");
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
