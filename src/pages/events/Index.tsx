import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight, Loader2, CalendarX } from "lucide-react";
import { Seo } from "@/components/Seo";
import { useEvents } from "@/services/queries";
import { format } from "date-fns";
import { SectionHeading } from "@/components/SectionHeading";
import heroImg from "@/assets/bg_01.jpg";

export default function EventsIndex() {
  const { data: events = [], isLoading } = useEvents();
  return (
    <>
      <Seo
        title="Events"
        description="Discover upcoming events at Grace Cathedral — from worship nights and conferences to community gatherings."
      />
      <section className="relative h-120 lg:h-130 flex items-end overflow-hidden">
        <img src={heroImg} className="absolute inset-0 h-full w-full object-cover" />
        <div className="h-full w-full bg-linear-to-t from-primary via-primary/80 to-primary/0 z-10 absolute" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-24 z-20">
          <SectionHeading
            eyebrow="Gather with us"
            title="Upcoming events"
            align="center"
            titleColor="white"
            description="From Sunday gatherings to community dinners and serving days."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-ink-muted">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading events…</p>
          </div>
        )}
        {!isLoading && events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="rounded-full bg-muted p-5">
              <CalendarX className="h-10 w-10 text-ink-muted" />
            </div>
            <p className="text-lg font-semibold text-ink">No upcoming events</p>
            <p className="text-sm text-ink-muted max-w-xs text-center">
              There are no events scheduled right now. Check back soon for what's coming up.
            </p>
          </div>
        )}
        <div className="grid gap-10 md:grid-cols-2">
        {events.map((e) => (
          <Link
            key={e.id}
            to={`/events/${e.id}`}
            className="group block overflow-hidden rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated transition-shadow"
          >
            {e.flyer && (
              <div className="aspect-16/10 overflow-hidden">
                <img
                  src={e.flyer}
                  alt={e.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-8">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-accent font-semibold">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(e.date), "EEEE, MMM d")} · {e.start_time.slice(0, 5)}
              </div>
              <h3 className="mt-3 font-display text-3xl text-ink leading-tight group-hover:text-primary transition-colors">
                {e.name}
              </h3>
              <div className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted">
                <MapPin className="h-4 w-4" /> {e.location}
              </div>
              <p className="mt-4 text-ink-muted line-clamp-2">{e.description}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
                Details <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        ))}
        </div>
      </section>
    </>
  );
}
