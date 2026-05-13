import { useParams } from "react-router-dom";
import { useList } from "@/services/queries";
import { SeriesForm } from "@/components/admin/SeriesForm";

export default function SeriesEdit() {
  const { id } = useParams<{ id: string }>();
  const { data = [], isLoading } = useList("series");
  const item = data.find((s) => s.id === id);
  if (isLoading) return <div className="text-ink-muted">Loading…</div>;
  if (!item) return <div className="text-ink-muted">Series not found.</div>;
  return <SeriesForm mode="edit" initial={item} />;
}
