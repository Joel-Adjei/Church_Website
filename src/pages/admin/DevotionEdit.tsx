import { useParams } from "react-router-dom";
import { useList } from "@/services/queries";
import { DevotionForm } from "@/components/admin/DevotionForm";

export default function DevotionEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: devotions = [], isLoading } = useList("devotions");
  const item = devotions.find((d) => d.id === id);
  if (isLoading) return <div className="text-ink-muted">Loading…</div>;
  if (!item) return <div className="text-ink-muted">Devotion not found.</div>;
  return <DevotionForm mode="edit" initial={item} />;
}
