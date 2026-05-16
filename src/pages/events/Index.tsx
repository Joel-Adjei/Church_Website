import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight, Loader2, CalendarX } from "lucide-react";
import { Seo } from "@/components/Seo";
import { useEvents } from "@/services/queries";
import { format } from "date-fns";
import { SectionHeading } from "@/components/SectionHeading";
import heroImg from "@/assets/img_13.jpg";
import img1 from "@/assets/img_01.jpg";

export default function EventsIndex() {
  const { data: events = [], isLoading } = useEvents();
  return (
    <>
      <Seo
        title="Events"
        description="Discover upcoming events at Grace Cathedral — from worship nights and conferences to community gatherings."
      />
      <section className="relative h-[50vh] lg:h-[75vh] flex items-center justify-center overflow-hidden bg-ink text-center">
        {/* Background Image with cinematic entrance animation */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            className="h-full w-full object-cover object-center animate-in fade-in zoom-in-110 duration-1000 ease-out"
            alt="Events Background"
          />
          {/* Multi-layered overlay for depth and legibility */}
          <div className="absolute inset-0 bg-ink/40 z-10" />
          <div className="absolute inset-0 bg-linear-to-b from-ink/20 via-transparent to-ink/90 z-10" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 z-20 w-full">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Editorial Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 backdrop-blur-md animate-in slide-in-from-bottom-4 duration-700">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white">
                Gather With Us
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] drop-shadow-md animate-in slide-in-from-bottom-6 duration-1000 delay-100">
              Upcoming <span className="italic text-accent">Events</span>
            </h1>

            <p className="max-w-xl mx-auto text-sm md:text-lg text-white/80 leading-relaxed animate-in slide-in-from-bottom-8 duration-1000 delay-200">
              From worship nights and conferences to community gatherings and serving days. Join us
              as we grow together.
            </p>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-accent/50 to-transparent z-30" />
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32">
        <div className="mb-16 flex flex-col md:flex-row items-baseline justify-between border-b pb-8 gap-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-ink-muted">
            Scheduled Gatherings
          </h2>
          <span className="text-xs text-ink-muted font-medium bg-muted px-3 py-1 rounded-full">
            {events.length} Upcoming Events
          </span>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-ink-muted">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium uppercase tracking-widest">Discovering events…</p>
          </div>
        )}

        {!isLoading && events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="rounded-full bg-muted p-6">
              <CalendarX className="h-12 w-12 text-ink-muted" />
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-ink">No upcoming events</p>
              <p className="text-ink-muted mt-2 max-w-xs mx-auto leading-relaxed">
                There are no events scheduled right now. Check back soon for what's coming up.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
          {events.map((e) => (
            <Link key={e.id} to={`/events/${e.id}`} className="group block relative">
              <article className="h-full flex flex-col">
                {e.flyer && (
                  <div className="relative aspect-16/10 overflow-hidden rounded-2xl bg-muted shadow-card transition-shadow duration-500 group-hover:shadow-elevated">
                    <img
                      src={e.flyer}
                      alt={e.name}
                      onError={(e) => {
                        e.currentTarget.src = img1;
                      }}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                )}

                <div className="mt-8 flex-1 space-y-4">
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-accent">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {format(new Date(e.date), "EEEE, MMM d")} · {e.start_time.slice(0, 5)}
                    </span>
                  </div>

                  <h3 className="font-display text-3xl md:text-4xl text-ink leading-tight group-hover:text-primary transition-colors duration-300">
                    {e.name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-ink-muted font-medium">
                    <MapPin className="h-4 w-4 text-accent" />
                    <span>{e.location}</span>
                  </div>

                  <p className="text-lg text-ink-muted line-clamp-2 leading-relaxed">
                    {e.description}
                  </p>

                  <div className="pt-2 inline-flex items-center gap-2 text-sm font-bold text-accent uppercase tracking-wider group-hover:gap-4 transition-all duration-300">
                    Event Details <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
