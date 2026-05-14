import { useParams } from "react-router-dom";
import { useGalleryById } from "@/services/queries";
import { GalleryForm } from "@/components/admin/GalleryForm";

export default function GalleryEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading } = useGalleryById(id);
  if (isLoading) return <div className="text-ink-muted">Loading…</div>;
  if (!item) return <div className="text-ink-muted">Gallery not found.</div>;
  return <GalleryForm mode="edit" initial={item} />;
}
