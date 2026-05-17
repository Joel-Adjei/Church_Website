import { Link } from "react-router-dom";
import { useResources, useDeleteResource } from "@/services/queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Package, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Resources() {
  const { data: resources = [], isLoading } = useResources();
  const remove = useDeleteResource();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Resources"
        description="Books, materials, and other resources available to the community."
        newHref="/admin/resources/new"
        newLabel="New resource"
      />
      <div className="bg-background border border-border rounded-2xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resource</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Link</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-52" />
                    </div>
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-7 w-20 ml-auto" /></TableCell>
              </TableRow>
            ))}
            {!isLoading && resources.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center py-12 text-ink-muted">No resources yet.</TableCell></TableRow>
            )}
            {resources.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {r.image ? (
                      <img src={r.image} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <Package className="h-4 w-4 text-ink-muted" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-ink">{r.name}</div>
                      {r.description && <div className="text-xs text-ink-muted line-clamp-1 max-w-55">{r.description}</div>}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-ink">{r.price}</TableCell>
                <TableCell>
                  <a
                    href={r.purchase_link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> View
                  </a>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm" className="gap-1.5">
                      <Link to={`/admin/resources/${r.id}`}><Pencil className="h-3.5 w-3.5" /> Edit</Link>
                    </Button>
                    <DeleteConfirm
                      title={`Delete "${r.name}"?`}
                      onConfirm={async () => {
                        await remove.mutateAsync(r.id);
                        toast.success("Resource deleted");
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
