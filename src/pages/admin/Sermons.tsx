import { Link } from "react-router-dom";
import { useSermons, useDeleteSermon, useList } from "@/services/queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function Sermons() {
  const { data: sermons = [], isLoading } = useSermons();
  const { data: series = [] } = useList("series");
  const remove = useDeleteSermon();
  const seriesTitle = (id?: string | null) => series.find((s) => s.id === id)?.title ?? "—";

  return (
    <div>
      <AdminPageHeader title="Sermons" description="Manage Sunday sermons." newHref="/admin/sermons/new" newLabel="New sermon" />
      <div className="bg-background border border-border rounded-2xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Preacher</TableHead>
              <TableHead>Series</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={5} className="text-center py-12 text-ink-muted">Loading…</TableCell></TableRow>}
            {!isLoading && sermons.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-12 text-ink-muted">No sermons yet.</TableCell></TableRow>
            )}
            {sermons.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.title}</TableCell>
                <TableCell>{s.preacher}</TableCell>
                <TableCell className="text-ink-muted">{seriesTitle(s.series)}</TableCell>
                <TableCell className="text-ink-muted">{format(new Date(s.date), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm" className="gap-1.5">
                      <Link to={`/admin/sermons/${s.id}`}><Pencil className="h-3.5 w-3.5" /> Edit</Link>
                    </Button>
                    <DeleteConfirm
                      title={`Delete "${s.title}"?`}
                      onConfirm={async () => {
                        await remove.mutateAsync(s.id);
                        toast.success("Sermon deleted");
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
