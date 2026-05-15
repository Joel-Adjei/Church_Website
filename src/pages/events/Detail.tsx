import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";
import { useEventById } from "@/services/queries";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/ShareButtons";
import { Seo } from "@/components/Seo";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, error } = useEventById(id);
  if (isLoading) return <div className="py-24 text-center text-ink-muted">Loading…</div>;
  if (error || !event)
    return <div className="py-24 text-center text-ink-muted">Event not found.</div>;

  const startDateTime = new Date(`${event.date}T${event.start_time}`);
  const endDateTime = event.end_time ? new Date(`${event.end_date}T${event.end_time}`) : null;

  return (
    <article>
      <Seo
        title={event.name}
        description={event.description.slice(0, 160)}
        image={event.flyer || undefined}
        type="article"
      />
      {event.flyer ? (
        <div className="relative h-[55vh] min-h-100 overflow-hidden">
          <img
            src={event.flyer}
            alt={event.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-primary/30 to-primary/90" />
          <div className="relative h-full mx-auto max-w-4xl px-6 lg:px-10 flex flex-col justify-end pb-16 text-primary-foreground">
            <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">
              Event
            </span>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.05]">{event.name}</h1>
          </div>
        </div>
      ) : (
        <div className="bg-primary py-20 px-6">
          <div className="mx-auto max-w-4xl">
            <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3 block">
              Event
            </span>
            <h1 className="font-display text-4xl md:text-6xl text-primary-foreground leading-[1.05]">
              {event.name}
            </h1>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-6 lg:px-10 py-12 md:py-16">
        <div className="flex items-center justify-between gap-2 mb-8 flex-wrap">
          <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1.5">
            <Link to="/events">
              <ArrowLeft className="h-4 w-4" /> All events
            </Link>
          </Button>
          <ShareButtons title={event.name} excerpt={event.description.slice(0, 140)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-10 p-6 bg-surface-elevated border border-border rounded-2xl">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-muted">Date</div>
              <div className="text-ink font-medium">
                {format(new Date(event.date), "MMM d, yyyy")}
                {event.days > 1 && event.end_date && ` – ${format(new Date(event.end_date), "MMM d, yyyy")}`}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-muted">Time</div>
              <div className="text-ink font-medium">
                {format(startDateTime, "h:mm a")}
                {endDateTime ? ` – ${format(endDateTime, "h:mm a")}` : ""}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-muted">Location</div>
              <div className="text-ink font-medium">{event.location}</div>
            </div>
          </div>
        </div>

        <div className="text-lg text-ink-muted leading-relaxed whitespace-pre-line">
          {event.description}
        </div>
      </div>
    </article>
  );
}
