import { useParams } from "react-router-dom";
import { useDevotionById } from "@/services/queries";
import { DevotionForm } from "@/components/admin/DevotionForm";
import { EditFormSkeleton } from "@/components/admin/EditFormSkeleton";

export default function DevotionEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading } = useDevotionById(id);
  if (isLoading) return <EditFormSkeleton inputs={2} hasImage textareaRows={10} maxWidth="max-w-3xl" />;
  if (!item) return <div className="text-ink-muted">Devotion not found.</div>;
  return <DevotionForm mode="edit" initial={item} />;
}
