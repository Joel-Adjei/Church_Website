import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";
import { useBySlug } from "@/services/queries";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/ShareButtons";

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: event, isLoading, error } = useBySlug("events", slug);
  if (isLoading) return <div className="py-24 text-center text-ink-muted">Loading…</div>;
  if (error || !event) return <div className="py-24 text-center text-ink-muted">Event not found.</div>;
  return (
    <article>
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <img src={event.bannerImageUrl} alt={event.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-primary/90" />
        <div className="relative h-full mx-auto max-w-4xl px-6 lg:px-10 flex flex-col justify-end pb-16 text-primary-foreground">
          <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">Event</span>
          <h1 className="font-display text-4xl md:text-6xl leading-[1.05]">{event.title}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 lg:px-10 py-12 md:py-16">
        <div className="flex items-center justify-between gap-2 mb-8 flex-wrap">
          <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1.5">
            <Link to="/events"><ArrowLeft className="h-4 w-4" /> All events</Link>
          </Button>
          <ShareButtons title={event.title} excerpt={event.description.slice(0, 140)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-10 p-6 bg-surface-elevated border border-border rounded-2xl">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-muted">Date</div>
              <div className="text-ink font-medium">{format(new Date(event.startAt), "MMM d, yyyy")}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-muted">Time</div>
              <div className="text-ink font-medium">{format(new Date(event.startAt), "h:mm a")} – {format(new Date(event.endAt), "h:mm a")}</div>
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

        <div className="text-lg text-ink-muted leading-relaxed whitespace-pre-line">{event.description}</div>
      </div>
    </article>
  );
}
