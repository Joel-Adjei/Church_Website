import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useBySlug } from "@/services/queries";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/ShareButtons";

export default function AnnouncementDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: a, isLoading, error } = useBySlug("announcements", slug);
  if (isLoading) return <div className="py-24 text-center text-ink-muted">Loading…</div>;
  if (error || !a) return <div className="py-24 text-center text-ink-muted">Announcement not found.</div>;
  return (
    <article className="mx-auto max-w-3xl px-6 lg:px-10 py-12 md:py-20">
      <div className="flex items-center justify-between gap-2 mb-6 flex-wrap">
        <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1.5">
          <Link to="/announcements"><ArrowLeft className="h-4 w-4" /> All news</Link>
        </Button>
        <ShareButtons title={a.title} excerpt={a.body.slice(0, 140)} />
      </div>
      <div className="text-xs text-accent font-semibold uppercase tracking-widest">{format(new Date(a.publishAt), "MMMM d, yyyy")}</div>
      <h1 className="mt-3 font-display text-4xl md:text-6xl text-ink leading-[1.05]">{a.title}</h1>
      {a.imageUrl && (
        <div className="mt-10 aspect-[16/9] overflow-hidden rounded-2xl">
          <img src={a.imageUrl} alt={a.title} className="h-full w-full object-cover" />
        </div>
      )}
      <div className="mt-10 text-lg text-ink-muted leading-relaxed whitespace-pre-line">{a.body}</div>
    </article>
  );
}
