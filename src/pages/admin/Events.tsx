import { Link } from "react-router-dom";
import { useEvents, useDeleteEvent } from "@/services/queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function Events() {
  const { data = [], isLoading } = useEvents();
  const remove = useDeleteEvent();
  return (
    <div>
      <AdminPageHeader title="Events" newHref="/admin/events/new" newLabel="New event" />
      <div className="bg-background border border-border rounded-2xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={4} className="py-12 text-center text-ink-muted">Loading…</TableCell></TableRow>}
            {!isLoading && data.length === 0 && <TableRow><TableCell colSpan={4} className="py-12 text-center text-ink-muted">No events yet.</TableCell></TableRow>}
            {data.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">{e.name}</TableCell>
                <TableCell className="text-ink-muted">
                  {format(new Date(e.date), "MMM d, yyyy")} · {e.start_time.slice(0, 5)}
                </TableCell>
                <TableCell className="text-ink-muted">{e.location}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm" className="gap-1.5">
                      <Link to={`/admin/events/${e.id}`}><Pencil className="h-3.5 w-3.5" /> Edit</Link>
                    </Button>
                    <DeleteConfirm
                      title={`Delete "${e.name}"?`}
                      onConfirm={async () => { await remove.mutateAsync(e.id); toast.success("Event deleted"); }}
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
