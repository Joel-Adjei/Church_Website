import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Calendar, User, BookOpen, HandHeart, Lightbulb } from "lucide-react";
import { useBySlug, useList } from "@/services/queries";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/ShareButtons";
import { Badge } from "@/components/ui/badge";

export default function DevotionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: d, isLoading, error } = useBySlug("devotions", slug);
  const { data: all = [] } = useList("devotions");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? Math.min(100, Math.max(0, (h.scrollTop / total) * 100)) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  if (isLoading) return <div className="py-24 text-center text-ink-muted">Loading…</div>;
  if (error || !d) return <div className="py-24 text-center text-ink-muted">Devotion not found.</div>;

  const related = all
    .filter((x) => x.status === "published" && x.id !== d.id)
    .sort((a, b) => b.devotionDate.localeCompare(a.devotionDate))
    .slice(0, 3);

  return (
    <article>
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
        <div className="h-full bg-accent transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        {d.imageUrl && <img src={d.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />}
        <div className="relative mx-auto max-w-3xl px-6 lg:px-10 py-20 md:py-28 text-primary-foreground">
          <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1.5 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10">
            <Link to="/devotions"><ArrowLeft className="h-4 w-4" /> All devotions</Link>
          </Button>
          {d.category && <Badge className="mt-6 bg-accent text-accent-foreground border-0">{d.category}</Badge>}
          <h1 className="mt-4 font-display text-4xl md:text-6xl leading-[1.05]">{d.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-primary-foreground/80">
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {format(parseISO(d.devotionDate), "EEEE, MMMM d, yyyy")}</span>
            <span className="inline-flex items-center gap-1.5"><User className="h-4 w-4" /> {d.author}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 lg:px-10 py-12 md:py-16">
        <section className="relative bg-gradient-to-br from-accent/15 via-surface-elevated to-surface-elevated border border-accent/30 rounded-3xl p-8 md:p-12 mb-12 shadow-card">
          <BookOpen className="h-8 w-8 text-accent mb-4" />
          <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">Scripture</p>
          <blockquote className="mt-3 font-display text-2xl md:text-3xl italic text-ink leading-snug">"{d.verseText}"</blockquote>
          <footer className="mt-4 text-sm uppercase tracking-widest text-ink-muted font-semibold">— {d.verseRef}</footer>
        </section>

        <div className="text-lg text-ink leading-[1.8] whitespace-pre-line" style={{ fontFamily: "var(--font-display)" }}>
          {d.content}
        </div>

        {d.reflection && (
          <section className="mt-12 rounded-2xl border border-border bg-surface-elevated p-6 md:p-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent font-semibold">
              <Lightbulb className="h-4 w-4" /> Reflection
            </div>
            <p className="mt-3 text-lg text-ink leading-relaxed">{d.reflection}</p>
          </section>
        )}

        {d.prayer && (
          <section className="mt-6 rounded-2xl border border-primary/20 bg-primary text-primary-foreground p-6 md:p-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent font-semibold">
              <HandHeart className="h-4 w-4" /> A Prayer
            </div>
            <p className="mt-3 text-lg leading-relaxed italic whitespace-pre-line">{d.prayer}</p>
          </section>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-8">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-ink-muted font-semibold">Encourage someone today</div>
            <div className="text-ink font-medium">Share this devotion</div>
          </div>
          <ShareButtons title={d.title} excerpt={d.verseText} />
        </div>

        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-border">
            <h2 className="font-display text-3xl text-ink mb-8">More devotions</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} to={`/devotions/${r.slug}`} className="group block">
                  <div className="aspect-video overflow-hidden rounded-xl bg-muted">
                    {r.imageUrl
                      ? <img src={r.imageUrl} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                      : <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20" />}
                  </div>
                  <h3 className="mt-3 font-display text-lg text-ink leading-snug group-hover:text-primary">{r.title}</h3>
                  <p className="mt-1 text-xs text-ink-muted">{format(parseISO(r.devotionDate), "MMM d, yyyy")}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
