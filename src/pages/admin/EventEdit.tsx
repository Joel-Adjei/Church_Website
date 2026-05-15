import { useParams } from "react-router-dom";
import { useEventById } from "@/services/queries";
import { EventForm } from "@/components/admin/EventForm";

export default function EventEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading } = useEventById(id);
  if (isLoading) return <div className="text-ink-muted">Loading…</div>;
  if (!item) return <div className="text-ink-muted">Event not found.</div>;
  return (
    <div className="w-full mx-auto">
      <EventForm mode="edit" initial={item} />
    </div>
  );
}
