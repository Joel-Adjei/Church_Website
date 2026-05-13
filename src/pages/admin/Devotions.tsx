import { Link } from "react-router-dom";
import { useList, useRemove, useUpdate } from "@/services/queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Star } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

export default function Devotions() {
  const { data: devotions = [], isLoading } = useList("devotions");
  const remove = useRemove("devotions");
  const update = useUpdate("devotions");

  const sorted = [...devotions].sort((a, b) => b.devotionDate.localeCompare(a.devotionDate));

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
              <TableHead>Verse</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={5} className="text-center py-12 text-ink-muted">Loading…</TableCell></TableRow>}
            {!isLoading && sorted.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-12 text-ink-muted">No devotions yet.</TableCell></TableRow>
            )}
            {sorted.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {d.featured && <Star className="h-3.5 w-3.5 fill-accent text-accent" />}
                    {d.title}
                  </div>
                </TableCell>
                <TableCell className="text-ink-muted">{d.verseRef}</TableCell>
                <TableCell className="text-ink-muted whitespace-nowrap">{format(parseISO(d.devotionDate), "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <Badge variant={d.status === "published" ? "default" : "secondary"} className="capitalize">{d.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5"
                      onClick={async () => {
                        await update.mutateAsync({ id: d.id, featured: !d.featured });
                        toast.success(d.featured ? "Removed from featured" : "Marked as featured");
                      }}
                    >
                      <Star className={`h-3.5 w-3.5 ${d.featured ? "fill-accent text-accent" : ""}`} />
                      {d.featured ? "Unfeature" : "Feature"}
                    </Button>
                    <Button asChild variant="ghost" size="sm" className="gap-1.5">
                      <Link to={`/admin/devotions/${d.id}`}><Pencil className="h-3.5 w-3.5" /> Edit</Link>
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
