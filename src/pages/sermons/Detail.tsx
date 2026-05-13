import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useBySlug, useList } from "@/services/queries";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/ShareButtons";

export default function SermonDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: sermon, isLoading, error } = useBySlug("sermons", slug);
  const { data: sermons = [] } = useList("sermons");
  const { data: series = [] } = useList("series");

  if (isLoading) return <div className="py-24 text-center text-ink-muted">Loading…</div>;
  if (error || !sermon) return <div className="py-24 text-center text-ink-muted">Sermon not found.</div>;

  const seriesTitle = series.find((s) => s.id === sermon.seriesId)?.title;
  const related = sermons.filter((s) => s.seriesId && s.seriesId === sermon.seriesId && s.id !== sermon.id).slice(0, 3);

  return (
    <article className="mx-auto max-w-4xl px-6 lg:px-10 py-12 md:py-20">
      <div className="flex items-center justify-between gap-2 mb-6 flex-wrap">
        <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1.5">
          <Link to="/sermons"><ArrowLeft className="h-4 w-4" /> All sermons</Link>
        </Button>
        <ShareButtons title={sermon.title} excerpt={sermon.description.slice(0, 140)} />
      </div>

      {seriesTitle && <div className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">{seriesTitle}</div>}
      <h1 className="font-display text-4xl md:text-6xl text-ink leading-[1.05]">{sermon.title}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-muted">
        <span className="inline-flex items-center gap-1.5"><User className="h-4 w-4" /> {sermon.speaker}</span>
        <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {format(new Date(sermon.sermonDate), "MMMM d, yyyy")}</span>
      </div>

      <div className="mt-10 aspect-video overflow-hidden rounded-2xl bg-primary shadow-elevated">
        <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${sermon.youtubeId}`} title={sermon.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>

      <div className="mt-10 text-lg text-ink-muted leading-relaxed whitespace-pre-line">{sermon.description}</div>

      {related.length > 0 && (
        <div className="mt-20 pt-12 border-t border-border">
          <h2 className="font-display text-3xl text-ink mb-8">More from {seriesTitle}</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((r) => (
              <Link key={r.id} to={`/sermons/${r.slug}`} className="group block">
                <div className="aspect-video overflow-hidden rounded-xl bg-muted">
                  <img src={r.thumbnailUrl} alt={r.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                </div>
                <h3 className="mt-3 font-display text-lg text-ink leading-snug group-hover:text-primary">{r.title}</h3>
                <p className="mt-1 text-xs text-ink-muted">{format(new Date(r.sermonDate), "MMM d, yyyy")}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
