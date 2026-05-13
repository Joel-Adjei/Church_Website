import { useParams } from "react-router-dom";
import { useList } from "@/services/queries";
import { SermonForm } from "@/components/admin/SermonForm";

export default function SermonEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: sermons = [], isLoading } = useList("sermons");
  const sermon = sermons.find((s) => s.id === id);
  if (isLoading) return <div className="text-ink-muted">Loading…</div>;
  if (!sermon) return <div className="text-ink-muted">Sermon not found.</div>;
  return <SermonForm mode="edit" initial={sermon} />;
}
