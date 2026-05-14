import { Link } from "react-router-dom";
import { ArrowRight, Loader2, BellOff } from "lucide-react";
import { Seo } from "@/components/Seo";
import { useAnnouncements } from "@/services/queries";
import { format } from "date-fns";
import heroImg from "@/assets/bg_09.jpg";

export default function AnnouncementsIndex() {
  const { data: announcements = [], isLoading } = useAnnouncements();
  return (
    <>
      <Seo
        title="News & Announcements"
        description="Stay up to date with the latest news and announcements from Grace Cathedral."
      />
      <section className="relative lg:h-90 flex items-end overflow-hidden">
        <img src={heroImg} className="absolute bottom-0 inset-0 h-full w-full object-cover" />
        <div className="h-full w-full bg-linear-to-t from-primary/20 to-primary/0 z-10 absolute" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-24 z-20">
          <div className="max-w-4xl">
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-primary leading-[1.05]">
              News & Announcements
            </h2>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-6 lg:px-10 py-16">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-ink-muted">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading announcements…</p>
          </div>
        )}
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
        <div className="divide-y divide-border">
        {announcements.map((a) => (
          <Link key={a.id} to={`/announcements/${a.id}`} className="group block py-10 first:pt-0">
            <div className="text-xs text-accent font-semibold uppercase tracking-widest">
              {format(new Date(a.date), "MMMM d, yyyy")}
            </div>
            <h2 className="mt-3 font-display text-3xl text-ink leading-snug group-hover:text-primary transition-colors">
              {a.title}
            </h2>
            <p className="mt-3 text-lg text-ink-muted line-clamp-2">{a.content}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
              Read more <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
        </div>
      </section>
    </>
  );
}
