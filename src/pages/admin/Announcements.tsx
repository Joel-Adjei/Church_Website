import { Link } from "react-router-dom";
import { useAnnouncements, useDeleteAnnouncement } from "@/services/queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function Announcements() {
  const { data = [], isLoading } = useAnnouncements();
  const remove = useDeleteAnnouncement();
  return (
    <div>
      <AdminPageHeader title="Announcements" newHref="/admin/announcements/new" newLabel="New announcement" />
      <div className="bg-background border border-border rounded-2xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={3} className="py-12 text-center text-ink-muted">Loading…</TableCell></TableRow>}
            {!isLoading && data.length === 0 && <TableRow><TableCell colSpan={3} className="py-12 text-center text-ink-muted">No announcements yet.</TableCell></TableRow>}
            {data.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.title}</TableCell>
                <TableCell className="text-ink-muted">{format(new Date(a.date), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm" className="gap-1.5">
                      <Link to={`/admin/announcements/${a.id}`}><Pencil className="h-3.5 w-3.5" /> Edit</Link>
                    </Button>
                    <DeleteConfirm
                      title={`Delete "${a.title}"?`}
                      onConfirm={async () => { await remove.mutateAsync(a.id); toast.success("Announcement deleted"); }}
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
