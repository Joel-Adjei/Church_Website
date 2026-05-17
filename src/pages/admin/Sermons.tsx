import { Link } from "react-router-dom";
import { useSermons, useDeleteSermon, useList } from "@/services/queries";
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
import { format } from "date-fns";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import SermonDetail from "../sermons/Detail";

export default function Sermons() {
  const { data: sermons = [], isLoading } = useSermons();
  const { data: series = [] } = useList("series");
  const remove = useDeleteSermon();
  const seriesTitle = (id?: string | null) => series.find((s) => s.id === id)?.title || "—";

  const [selectedId, setSelectedId] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);

  const handleView = (id: string) => {
    setSelectedId(id);
    setOpenDialog(true);
  };
  return (
    <div>
      <AdminPageHeader
        title="Sermons"
        description="Manage Sunday sermons."
        newHref="/admin/sermons/new"
        newLabel="New sermon"
      />
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
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-7 w-20 ml-auto" /></TableCell>
              </TableRow>
            ))}
            {!isLoading && sermons.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-ink-muted">
                  No sermons yet.
                </TableCell>
              </TableRow>
            )}
            {sermons.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium cursor-pointer" onClick={() => handleView(s.id)}>
                  {s.title}
                </TableCell>
                <TableCell>{s.preacher}</TableCell>
                <TableCell className="text-ink-muted">
                  {s.series ? seriesTitle(s?.series) : "—"}
                </TableCell>
                <TableCell className="text-ink-muted">
                  {format(new Date(s.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm" className="gap-1.5">
                      <Link to={`/admin/sermons/${s.id}`}>
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Link>
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
      <Dialog open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
        <DialogContent className="h-[90dvh] max-w-5xl overflow-auto p-0">
          <SermonDetail viewID={selectedId} toView={true} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
