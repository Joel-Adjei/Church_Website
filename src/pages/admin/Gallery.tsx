import { Link } from "react-router-dom";
import { useGallery, useDeleteGallery } from "@/services/queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm";
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
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import GalleryDetail from "../gallery/Detail";

export default function Gallery() {
  const { data = [], isLoading } = useGallery();
  const remove = useDeleteGallery();
  const [selectedId, setSelectedId] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);

  const handleView = (id: string) => {
    setSelectedId(id);
    setOpenDialog(true);
  };
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
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-44" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-7 w-20 ml-auto" /></TableCell>
              </TableRow>
            ))}
            {!isLoading && data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-ink-muted">
                  No galleries yet.
                </TableCell>
              </TableRow>
            )}
            {data.map((g) => (
              <TableRow key={g.id}>
                <TableCell className="font-medium cursor-pointer" onClick={() => handleView(g.id)}>
                  {g.title}
                </TableCell>
                <TableCell className="text-ink-muted">{g.venue}</TableCell>
                <TableCell className="text-ink-muted">{g.images.length}</TableCell>
                <TableCell className="text-ink-muted">
                  {format(new Date(g.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm" className="gap-1.5">
                      <Link to={`/admin/gallery/${g.id}`}>
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Link>
                    </Button>
                    <DeleteConfirm
                      title={`Delete "${g.title}"?`}
                      onConfirm={async () => {
                        await remove.mutateAsync(g.id);
                        toast.success("Gallery deleted");
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
          <GalleryDetail viewID={selectedId} toView={true} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
