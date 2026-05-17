import { useParams } from "react-router-dom";
import { useResourceById } from "@/services/queries";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { EditFormSkeleton } from "@/components/admin/EditFormSkeleton";

export default function ResourceEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading } = useResourceById(id);
  if (isLoading) return <EditFormSkeleton inputs={3} hasImage textareaRows={5} />;
  if (!item) return <div className="text-ink-muted">Resource not found.</div>;
  return <ResourceForm mode="edit" initial={item} />;
}
