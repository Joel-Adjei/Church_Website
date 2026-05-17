import { GivingForm } from "@/components/admin/GivingForm";
import { useAccountById } from "@/services/queries";
import { useParams } from "react-router-dom";
import { EditFormSkeleton } from "@/components/admin/EditFormSkeleton";

export default function GivingEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading } = useAccountById(id);
  if (isLoading) return <EditFormSkeleton inputs={4} textareaRows={3} />;
  if (!item) return <div className="text-ink-muted">Account not found.</div>;

  return <GivingForm mode="edit" initial={item} />;
}
