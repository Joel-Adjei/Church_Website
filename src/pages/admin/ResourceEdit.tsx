import { useParams } from "react-router-dom";
import { useList } from "@/services/queries";
import { ResourceForm } from "@/components/admin/ResourceForm";

export default function ResourceEdit() {
  const { id } = useParams<{ id: string }>();
  const { data = [], isLoading } = useList("resources");
  const item = data.find((r) => r.id === id);
  if (isLoading) return <div className="text-ink-muted">Loading…</div>;
  if (!item) return <div className="text-ink-muted">Resource not found.</div>;
  return <ResourceForm mode="edit" initial={item} />;
}
