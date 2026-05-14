import { useParams } from "react-router-dom";
import { useLiveStreamById } from "@/services/queries";
import { LiveStreamForm } from "@/components/admin/LiveStreamForm";

export default function LiveStreamEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading } = useLiveStreamById(id);
  if (isLoading) return <div className="text-ink-muted">Loading…</div>;
  if (!item) return <div className="text-ink-muted">Stream not found.</div>;
  return <LiveStreamForm mode="edit" initial={item} />;
}
