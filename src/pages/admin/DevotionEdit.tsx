import { useParams } from "react-router-dom";
import { useDevotionById } from "@/services/queries";
import { DevotionForm } from "@/components/admin/DevotionForm";
import { Loader2, LoaderIcon } from "lucide-react";

export default function DevotionEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading } = useDevotionById(id);
  if (isLoading)
    return (
      <div className="w-full text-ink-muted">
        <LoaderIcon className="animate-spin" />
      </div>
    );
  if (!item) return <div className="text-ink-muted">Devotion not found.</div>;
  return <DevotionForm mode="edit" initial={item} />;
}
