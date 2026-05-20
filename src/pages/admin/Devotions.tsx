import { Link } from "react-router-dom";
import { useDevotions, useDeleteDevotion } from "@/services/queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

export default function Devotions() {
  const { data: devotions = [], isLoading } = useDevotions();
  const remove = useDeleteDevotion();

  const sorted = [...devotions].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  return (
    <div>
      <AdminPageHeader
        title="Daily devotions"
        description="Schedule daily Scripture, reflection, and prayer."
        newHref="/admin/devotions/new"
        newLabel="New devotion"
      />
      <div className="bg-background border border-border rounded-2xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Bible verse</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-7 w-20 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            {!isLoading && sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-ink-muted">
                  No devotions yet.
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.title}</TableCell>
                  <TableCell className="text-ink-muted max-w-xs truncate">
                    {d?.Bible_verse?.reference || ""}
                  </TableCell>
                  <TableCell className="text-ink-muted whitespace-nowrap">
                    {format(parseISO(d?.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="sm" className="gap-1.5">
                        <Link to={`/admin/devotions/${d.id}`}>
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Link>
                      </Button>
                      <DeleteConfirm
                        title={`Delete "${d.title}"?`}
                        onConfirm={async () => {
                          await remove.mutateAsync(d.id);
                          toast.success("Devotion deleted");
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
