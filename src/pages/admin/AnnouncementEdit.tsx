import { useParams } from "react-router-dom";
import { useAnnouncementById } from "@/services/queries";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";

export default function AnnouncementEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading } = useAnnouncementById(id);
  if (isLoading) return <div className="text-ink-muted">Loading…</div>;
  if (!item) return <div className="text-ink-muted">Announcement not found.</div>;
  return <AnnouncementForm mode="edit" initial={item} />;
}
