import { Link } from "react-router-dom";
import { useGallery, useDeleteGallery } from "@/services/queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function Gallery() {
  const { data = [], isLoading } = useGallery();
  const remove = useDeleteGallery();
  return (
    <div>
      <AdminPageHeader title="Gallery albums" newHref="/admin/gallery/new" newLabel="New album" />
      <div className="bg-background border border-border rounded-2xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Photos</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={5} className="py-12 text-center text-ink-muted">Loading…</TableCell></TableRow>}
            {!isLoading && data.length === 0 && <TableRow><TableCell colSpan={5} className="py-12 text-center text-ink-muted">No galleries yet.</TableCell></TableRow>}
            {data.map((g) => (
              <TableRow key={g.id}>
                <TableCell className="font-medium">{g.title}</TableCell>
                <TableCell className="text-ink-muted">{g.venue}</TableCell>
                <TableCell className="text-ink-muted">{g.images.length}</TableCell>
                <TableCell className="text-ink-muted">{format(new Date(g.date), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm" className="gap-1.5">
                      <Link to={`/admin/gallery/${g.id}`}><Pencil className="h-3.5 w-3.5" /> Edit</Link>
                    </Button>
                    <DeleteConfirm
                      title={`Delete "${g.title}"?`}
                      onConfirm={async () => { await remove.mutateAsync(g.id); toast.success("Gallery deleted"); }}
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
