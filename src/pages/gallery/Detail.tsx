import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useBySlug } from "@/services/queries";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/ShareButtons";

export default function GalleryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: program, isLoading, error } = useBySlug("gallery", slug);
  const [active, setActive] = useState<number | null>(null);

  if (isLoading) return <div className="py-24 text-center text-ink-muted">Loading…</div>;
  if (error || !program) return <div className="py-24 text-center text-ink-muted">Gallery not found.</div>;

  const close = () => setActive(null);
  const prev = () => setActive((a) => (a === null ? 0 : (a - 1 + program.images.length) % program.images.length));
  const next = () => setActive((a) => (a === null ? 0 : (a + 1) % program.images.length));

  return (
    <article className="mx-auto max-w-7xl px-6 lg:px-10 py-12 md:py-20">
      <div className="flex items-center justify-between gap-2 mb-6 flex-wrap">
        <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1.5">
          <Link to="/gallery"><ArrowLeft className="h-4 w-4" /> All galleries</Link>
        </Button>
        <ShareButtons title={program.title} excerpt={program.description.slice(0, 140)} />
      </div>

      <div className="max-w-3xl mb-12">
        <h1 className="font-display text-4xl md:text-6xl text-ink leading-[1.05]">{program.title}</h1>
        <p className="mt-4 text-lg text-ink-muted leading-relaxed">{program.description}</p>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
        {program.images.map((img, i) => (
          <button key={i} onClick={() => setActive(i)} className="block w-full overflow-hidden rounded-xl group">
            <img src={img.url} alt={img.caption ?? ""} className="w-full transition-transform duration-500 group-hover:scale-105" />
          </button>
        ))}
      </div>

      {active !== null && (
        <div className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-md flex items-center justify-center p-4" onClick={close}>
          <button onClick={(e) => { e.stopPropagation(); close(); }} className="absolute top-6 right-6 h-12 w-12 inline-flex items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-6 h-12 w-12 inline-flex items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20" aria-label="Previous">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-6 h-12 w-12 inline-flex items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20" aria-label="Next">
            <ChevronRight className="h-6 w-6" />
          </button>
          <img src={program.images[active].url} alt="" className="max-h-[85vh] max-w-full rounded-xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </article>
  );
}
