import { useParams } from "react-router-dom";
import { useList } from "@/services/queries";
import { GalleryForm } from "@/components/admin/GalleryForm";

export default function GalleryEdit() {
  const { id } = useParams<{ id: string }>();
  const { data = [], isLoading } = useList("gallery");
  const item = data.find((g) => g.id === id);
  if (isLoading) return <div className="text-ink-muted">Loading…</div>;
  if (!item) return <div className="text-ink-muted">Gallery not found.</div>;
  return <GalleryForm mode="edit" initial={item} />;
}
