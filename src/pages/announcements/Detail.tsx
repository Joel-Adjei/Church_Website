import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAnnouncementById } from "@/services/queries";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/ShareButtons";
import { Seo } from "@/components/Seo";

export default function AnnouncementDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: a, isLoading, error } = useAnnouncementById(id);
  if (isLoading) return <div className="py-24 text-center text-ink-muted">Loading…</div>;
  if (error || !a) return <div className="py-24 text-center text-ink-muted">Announcement not found.</div>;
  return (
    <article className="mx-auto max-w-3xl px-6 lg:px-10 py-12 md:py-20">
      <Seo
        title={a.title}
        description={a.content.slice(0, 160)}
        type="article"
      />
      <div className="flex items-center justify-between gap-2 mb-6 flex-wrap">
        <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1.5">
          <Link to="/announcements"><ArrowLeft className="h-4 w-4" /> All news</Link>
        </Button>
        <ShareButtons title={a.title} excerpt={a.content.slice(0, 140)} />
      </div>
      <div className="text-xs text-accent font-semibold uppercase tracking-widest">{format(new Date(a.date), "MMMM d, yyyy")}</div>
      <h1 className="mt-3 font-display text-4xl md:text-6xl text-ink leading-[1.05]">{a.title}</h1>
      <div className="mt-10 text-lg text-ink-muted leading-relaxed whitespace-pre-line">{a.content}</div>
    </article>
  );
}
