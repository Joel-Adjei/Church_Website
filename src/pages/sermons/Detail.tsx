import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useSermonById, useSermons, useSeries } from "@/services/queries";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/ShareButtons";
import { youtubeThumbnail } from "@/lib/utils";
import { Seo } from "@/components/Seo";

function youtubeEmbedId(url: string): string {
  try {
    const u = new URL(url);
    return u.searchParams.get("v") ?? url;
  } catch {
    return url;
  }
}

import { LoadingState } from "@/components/ui/loading-state";

export default function SermonDetail({ viewID, toView }: { viewID?: string; toView?: boolean }) {
  const p = useParams<{ id: string; title: string }>();
  const [URLSearchParams, SetURLSearchParams] = useSearchParams({ title: "tuuuu" });
  const { data: sermon, isLoading, error } = useSermonById(toView ? viewID : p.id);
  const { data: sermons = [] } = useSermons();
  const { data: series = [] } = useSeries();

  console.log(URLSearchParams.get("title"));

  if (isLoading) return <LoadingState />;
  if (error || !sermon)
    return <div className="py-24 text-center text-ink-muted">{p.title} - Sermon not found.</div>;

  const seriesTitle = series.find((s) => s.id === sermon.series)?.title;
  const related = sermons
    .filter((s) => s.series && s.series === sermon.series && s.id !== sermon.id)
    .slice(0, 3);
  const embedId = youtubeEmbedId(sermon.video_link);

  return (
    <article className="mx-auto max-w-4xl px-6 lg:px-10 py-12 md:py-20">
      <Seo
        title={sermon.title}
        description={sermon.description.slice(0, 160)}
        image={sermon.video_link ? youtubeThumbnail(sermon.video_link) : undefined}
        type="article"
      />
      {toView ? null : (
        <div className="flex items-center justify-between gap-2 mb-6 flex-wrap">
          <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1.5">
            <Link to="/sermons">
              <ArrowLeft className="h-4 w-4" /> All sermons
            </Link>
          </Button>
          <ShareButtons title={sermon.title} excerpt={sermon.description.slice(0, 140)} />
        </div>
      )}

      {seriesTitle && (
        <div className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">
          {seriesTitle}
        </div>
      )}
      <h1 className="font-display text-4xl md:text-6xl text-ink leading-[1.05]">{sermon.title}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-muted">
        <span className="inline-flex items-center gap-1.5">
          <User className="h-4 w-4" /> {sermon.preacher}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-4 w-4" /> {format(new Date(sermon.date), "MMMM d, yyyy")}
        </span>
      </div>

      {sermon.video_link && (
        <div className="mt-10 aspect-video overflow-hidden rounded-2xl bg-primary shadow-elevated">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${embedId}`}
            title={sermon.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <div className="mt-10 text-lg text-ink-muted leading-relaxed whitespace-pre-line">
        {sermon.description}
      </div>

      {sermon.podcast_link && (
        <div className="mt-8">
          <a
            href={sermon.podcast_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-accent font-medium hover:underline"
          >
            Listen on podcast
          </a>
        </div>
      )}

      {toView
        ? null
        : related.length > 0 && (
            <div className="mt-20 pt-12 border-t border-border">
              <h2 className="font-display text-3xl text-ink mb-8">More from {seriesTitle}</h2>
              <div className="grid gap-6 sm:grid-cols-3">
                {related.map((r) => (
                  <Link key={r.id} to={`/sermons/${r.id}`} className="group block">
                    <div className="relative aspect-video overflow-hidden rounded-xl bg-muted flex items-center justify-center">
                      <img
                        src={youtubeThumbnail(r.video_link)}
                        alt={r.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mt-3 font-display text-lg text-ink leading-snug group-hover:text-primary">
                      {r.title}
                    </h3>
                    <p className="mt-1 text-xs text-ink-muted">
                      {format(new Date(r.date), "MMM d, yyyy")}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
    </article>
  );
}
