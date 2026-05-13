import { Link } from "react-router-dom";
import { useList, useRemove } from "@/services/queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

export default function Gallery() {
  const { data = [], isLoading } = useList("gallery");
  const remove = useRemove("gallery");
  return (
    <div>
      <AdminPageHeader title="Gallery programs" newHref="/admin/gallery/new" newLabel="New gallery" />
      <div className="bg-background border border-border rounded-2xl overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Photos</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={3} className="py-12 text-center text-ink-muted">Loading…</TableCell></TableRow>}
            {!isLoading && data.length === 0 && <TableRow><TableCell colSpan={3} className="py-12 text-center text-ink-muted">No galleries yet.</TableCell></TableRow>}
            {data.map((g) => (
              <TableRow key={g.id}>
                <TableCell className="font-medium">{g.title}</TableCell>
                <TableCell className="text-ink-muted">{g.images.length}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm" className="gap-1.5"><Link to={`/admin/gallery/${g.id}`}><Pencil className="h-3.5 w-3.5" /> Edit</Link></Button>
                    <DeleteConfirm title={`Delete "${g.title}"?`} onConfirm={async () => { await remove.mutateAsync(g.id); toast.success("Gallery deleted"); }} />
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
