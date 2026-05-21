import { Link } from "react-router-dom";
import { ArrowRight, BellOff } from "lucide-react";
import { Seo } from "@/components/Seo";
import { useAnnouncements } from "@/services/queries";
import { format } from "date-fns";
import heroImg from "@/assets/img_11.jpg";
import { LoadingState } from "@/components/ui/loading-state";

export default function AnnouncementsIndex() {
  const { data: announcements = [], isLoading } = useAnnouncements();
  return (
    <>
      <Seo
        title="News & Announcements"
        description="Stay up to date with the latest news and announcements from Grace Cathedral."
      />
      <section className="relative h-[50vh] lg:h-[70vh] flex items-end overflow-hidden bg-ink">
        {/* Background Image with subtle entrance animation */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            className="h-full w-full object-cover object-center animate-in fade-in zoom-in-110 duration-1000 ease-out"
            alt="Hero Background"
            fetchPriority="high"
            decoding="async"
          />
          {/* Multi-layered overlay for depth and legibility */}
          <div className="absolute inset-0 bg-linear-to-b from-ink/30 via-ink/10 to-ink/70 z-10" />
          <div className="absolute inset-0 bg-linear-to-t from-primary/90 to-transparent z-10" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-24 z-20 w-full">
          <div className="max-w-4xl space-y-6">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] drop-shadow-sm animate-in slide-in-from-bottom-6 duration-1000 delay-100">
              News <span className="italic text-accent"> & </span>{" "}
              <br className="hidden md:block" />
              <span className="italic ">Announcements</span>
            </h1>

            <p className="max-w-2xl text-sm md:text-lg text-white/80 leading-relaxed animate-in slide-in-from-bottom-8 duration-1000 delay-200">
              Stay connected with our community through the latest stories, upcoming events, and
              important updates from Grace Cathedral.
            </p>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-accent/50 to-transparent z-30" />
      </section>

      <section className="mx-auto max-w-4xl px-6 lg:px-10 py-20 lg:py-32">
        <div className="mb-12 flex items-baseline justify-between border-b pb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-ink-muted">All News</h2>
          <span className="text-xs text-ink-muted">{announcements.length} Articles</span>
        </div>

        {isLoading && <LoadingState message="Loading announcements..." />}

        {!isLoading && announcements.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="rounded-full bg-muted p-5">
              <BellOff className="h-10 w-10 text-ink-muted" />
            </div>
            <p className="text-lg font-semibold text-ink">No announcements yet</p>
            <p className="text-sm text-ink-muted max-w-xs text-center">
              Nothing to share right now — check back soon for the latest news.
            </p>
          </div>
        )}

        <div className="space-y-16">
          {announcements.map((a) => (
            <Link key={a.id} to={`/announcements/${a.id}`} className="group block relative">
              <article className="grid md:grid-cols-[1fr_2fr] gap-8 items-start">
                <div className="pt-2">
                  <div className="text-xs text-accent font-bold uppercase tracking-[0.15em]">
                    {format(new Date(a.date), "MMM d, yyyy")}
                  </div>
                  <div className="mt-4 h-px w-8 bg-border group-hover:w-16 transition-all duration-500" />
                </div>

                <div className="space-y-4">
                  <h2 className="font-display text-3xl md:text-4xl text-ink leading-tight group-hover:text-primary transition-colors duration-300">
                    {a.title}
                  </h2>
                  <div
                    className="text-lg text-ink-muted line-clamp-3 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: a.content.replace(/&nbsp;/g, " ") }}
                  />
                  <div className="pt-2 inline-flex items-center gap-2 text-sm font-bold text-accent uppercase tracking-wider group-hover:gap-4 transition-all duration-300">
                    Read the story <ArrowRight className="h-4 w-4" />
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
