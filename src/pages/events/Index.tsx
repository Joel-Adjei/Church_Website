import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { useList } from "@/services/queries";
import { format } from "date-fns";
import { SectionHeading } from "@/components/SectionHeading";
import heroImg from "@/assets/bg_01.jpg";

export default function EventsIndex() {
  const { data: events = [], isLoading } = useList("events");
  return (
    <>
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

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid gap-10 md:grid-cols-2">
        {isLoading && <div className="text-ink-muted">Loading…</div>}
        {events.map((e) => (
          <Link
            key={e.id}
            to={`/events/${e.slug}`}
            className="group block overflow-hidden rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated transition-shadow"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={e.bannerImageUrl}
                alt={e.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-8">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-accent font-semibold">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(e.startAt), "EEEE, MMM d · h:mm a")}
              </div>
              <h3 className="mt-3 font-display text-3xl text-ink leading-tight group-hover:text-primary transition-colors">
                {e.title}
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
      </section>
    </>
  );
}
