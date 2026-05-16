import { GivingForm } from "@/components/admin/GivingForm";
import { useAccountById } from "@/services/queries";
import { LoaderIcon } from "lucide-react";
import { useParams } from "react-router-dom";

export default function GivingEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading } = useAccountById(id);
  if (isLoading)
    return (
      <div className="w-full text-ink-muted">
        <LoaderIcon className="animate-spin" />
      </div>
    );
  if (!item) return <div className="text-ink-muted">Account not found.</div>;

  return <GivingForm mode="edit" initial={item} />;
}
