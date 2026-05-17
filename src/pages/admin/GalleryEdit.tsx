import { useParams } from "react-router-dom";
import { useGalleryById } from "@/services/queries";
import { GalleryForm } from "@/components/admin/GalleryForm";
import { EditFormSkeleton } from "@/components/admin/EditFormSkeleton";

export default function GalleryEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading } = useGalleryById(id);
  if (isLoading) return <EditFormSkeleton inputs={2} textareaRows={3} hasImage maxWidth="max-w-3xl" />;
  if (!item) return <div className="text-ink-muted">Gallery not found.</div>;
  return <GalleryForm mode="edit" initial={item} />;
}
