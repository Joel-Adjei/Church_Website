import { useParams } from "react-router-dom";
import { useList } from "@/services/queries";
import { EventForm } from "@/components/admin/EventForm";

export default function EventEdit() {
  const { id } = useParams<{ id: string }>();
  const { data = [], isLoading } = useList("events");
  const item = data.find((e) => e.id === id);
  if (isLoading) return <div className="text-ink-muted">Loading…</div>;
  if (!item) return <div className="text-ink-muted">Event not found.</div>;
  return <EventForm mode="edit" initial={item} />;
}
