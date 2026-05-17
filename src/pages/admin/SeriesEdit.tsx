import { useParams } from "react-router-dom";
import { useSeriesById } from "@/services/queries";
import { SeriesForm } from "@/components/admin/SeriesForm";
import { EditFormSkeleton } from "@/components/admin/EditFormSkeleton";

export default function SeriesEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading } = useSeriesById(id);
  if (isLoading) return <EditFormSkeleton inputs={1} textareaRows={4} />;
  if (!item) return <div className="text-ink-muted">Series not found.</div>;
  return <SeriesForm mode="edit" initial={item} />;
}
