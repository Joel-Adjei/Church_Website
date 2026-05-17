import { useParams } from "react-router-dom";
import { useSermonById } from "@/services/queries";
import { SermonForm } from "@/components/admin/SermonForm";
import { EditFormSkeleton } from "@/components/admin/EditFormSkeleton";

export default function SermonEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: sermon, isLoading } = useSermonById(id);
  if (isLoading) return <EditFormSkeleton inputs={5} textareaRows={6} />;
  if (!sermon) return <div className="text-ink-muted">Sermon not found.</div>;
  return <SermonForm mode="edit" initial={sermon} />;
}
