import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Calendar, BookOpen, HandHeart, Lightbulb } from "lucide-react";
import { useDevotionById, useDevotions } from "@/services/queries";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/ShareButtons";
import imgSub from "@/assets/bg_07.jpg";

import { LoadingState } from "@/components/ui/loading-state";

export default function DevotionDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: d, isLoading, error } = useDevotionById(id);
  const { data: all = [] } = useDevotions();
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
  }, [id]);

  if (isLoading) return <LoadingState />;
  if (error || !d)
    return <div className="py-24 text-center text-ink-muted">Devotion not found.</div>;

  const related = all
    .filter((x) => x.id !== d.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <article>
      <Seo
        title={d.title}
        description={d.Bible_verse.reference.slice(0, 160)}
        image={d.thumbnail || undefined}
        type="article"
      />
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
        <div
          className="h-full bg-accent transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        {d.thumbnail ? (
          <img
            src={d.thumbnail}
            alt={d.title}
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
        ) : (
          <img
            src={imgSub}
            alt={d.title}
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
        )}
        <div className="relative mx-auto max-w-3xl px-6 lg:px-10 py-20 md:py-28 text-primary-foreground">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-3 gap-1.5 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
          >
            <Link to="/devotions">
              <ArrowLeft className="h-4 w-4" /> All devotions
            </Link>
          </Button>
          <h1 className="mt-6 font-display text-4xl md:text-6xl leading-[1.05]">{d.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-primary-foreground/80">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {format(parseISO(d.date), "EEEE, MMMM d, yyyy")}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 lg:px-10 py-12 md:py-16">
        <section className="relative bg-gradient-to-br from-accent/15 via-surface-elevated to-surface-elevated border border-accent/30 rounded-3xl p-8 md:p-12 mb-12 shadow-card">
          <BookOpen className="h-8 w-8 text-accent mb-4" />
          <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">Scripture</p>
          <blockquote className="mt-3 font-display text-2xl md:text-3xl italic text-ink leading-snug">
            "{d.Bible_verse.verse_content}"
          </blockquote>
        </section>

        <div
          className="text-lg text-ink leading-[1.8] whitespace-pre-line"
          style={{ fontFamily: "var(--font-display)" }}
        >
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

        {d.reflections && d.reflections.length > 0 && (
          <section className="mt-12 rounded-2xl border border-border bg-surface-elevated p-6 md:p-8">
            <h2 className="font-display text-2xl text-ink mb-6">Reflections</h2>
            <div className="space-y-4">
              {d.reflections.map((r) => (
                <div key={r.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <p className="text-ink leading-relaxed">{r.content}</p>
                  <p className="mt-2 text-sm text-ink-muted">
                    {r.name} · {format(parseISO(r.date), "MMM d, yyyy")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-8">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-ink-muted font-semibold">
              Encourage someone today
            </div>
            <div className="text-ink font-medium">Share this devotion</div>
          </div>
          <ShareButtons title={d.title} excerpt={d.Bible_verse.verse_content} />
        </div>

        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-border">
            <h2 className="font-display text-3xl text-ink mb-8">More devotions</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} to={`/devotions/${r.id}`} className="group block">
                  <div className="aspect-video overflow-hidden rounded-xl bg-muted">
                    {r.thumbnail ? (
                      <img
                        src={r.thumbnail}
                        alt=""
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20" />
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-lg text-ink leading-snug group-hover:text-primary">
                    {r.title}
                  </h3>
                  <p className="mt-1 text-xs text-ink-muted">
                    {format(parseISO(r.date), "MMM d, yyyy")}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
