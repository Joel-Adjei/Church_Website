import { Link } from "react-router-dom";
import { useSeries, useDeleteSeries } from "@/services/queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Series() {
  const { data: series = [], isLoading } = useSeries();
  const remove = useDeleteSeries();
  return (
    <div>
      <AdminPageHeader title="Sermon series" newHref="/admin/series/new" newLabel="New series" />
      <div className="bg-background border border-border rounded-2xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-44" /></TableCell>
                <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-7 w-20 ml-auto" /></TableCell>
              </TableRow>
            ))}
            {!isLoading && series.length === 0 && <TableRow><TableCell colSpan={3} className="py-12 text-center text-ink-muted">No series yet.</TableCell></TableRow>}
            {series.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.title}</TableCell>
                <TableCell className="text-ink-muted max-w-xs truncate">{s.description}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm" className="gap-1.5">
                      <Link to={`/admin/series/${s.id}`}><Pencil className="h-3.5 w-3.5" /> Edit</Link>
                    </Button>
                    <DeleteConfirm
                      title={`Delete "${s.title}"?`}
                      onConfirm={async () => { await remove.mutateAsync(s.id); toast.success("Series deleted"); }}
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
