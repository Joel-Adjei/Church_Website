import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { format, parseISO } from "date-fns";
import { Search, Calendar, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import devotionsHero from "@/assets/devotions-hero.jpg";
import { useDevotions } from "@/services/queries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/ShareButtons";
import type { Devotion } from "@/types";

const PAGE = 6;

function pickToday(devotions: Devotion[]): Devotion | undefined {
  if (!devotions.length) return undefined;
  return [...devotions].sort((a, b) => b.date.localeCompare(a.date))[0];
}

export default function DevotionsIndex() {
  const { data: devotions = [], isLoading } = useDevotions();
  const [q, setQ] = useState("");
  const [visible, setVisible] = useState(PAGE);

  const today = useMemo(() => pickToday(devotions), [devotions]);

  const past = useMemo(() => {
    const list = devotions
      .filter((d) => !today || d.id !== today.id)
      .sort((a, b) => b.date.localeCompare(a.date));
    if (!q) return list;
    const lower = q.toLowerCase();
    return list.filter((d) =>
      `${d.title} ${d.Bible_verse} ${d.content}`.toLowerCase().includes(lower)
    );
  }, [devotions, today, q]);

  const shown = past.slice(0, visible);

  return (
    <div>
      <Seo
        title="Daily Devotions"
        description="Read daily devotions from Grace Cathedral — scripture, reflection, and prayer to grow your faith each day."
      />
      <section className="relative overflow-hidden">
        <img src={devotionsHero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative mx-auto max-w-5xl px-6 lg:px-10 py-20 md:py-28 text-primary-foreground">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> Today's Devotion
          </div>
          {isLoading ? (
            <div className="mt-6 text-primary-foreground/70">Loading today's devotion…</div>
          ) : !today ? (
            <div className="mt-6">
              <h1 className="font-display text-4xl md:text-6xl leading-[1.05]">A quiet word is on the way</h1>
              <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl">We're preparing today's devotion. Check back soon.</p>
            </div>
          ) : (
            <>
              <h1 className="mt-4 font-display text-4xl md:text-6xl leading-[1.05]">{today.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-primary-foreground/80">
                <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {format(parseISO(today.date), "EEEE, MMMM d, yyyy")}</span>
              </div>
              <blockquote className="mt-10 border-l-2 border-accent pl-6 max-w-3xl">
                <p className="font-display text-2xl md:text-3xl italic leading-snug">"{today.Bible_verse}"</p>
              </blockquote>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                  <Link to={`/devotions/${today.id}`}>
                    Read today's devotion <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <ShareButtons
                  title={today.title}
                  excerpt={today.Bible_verse}
                  url={typeof window !== "undefined" ? `${window.location.origin}/devotions/${today.id}` : undefined}
                  align="start"
                />
              </div>
            </>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 lg:px-10 py-12 md:py-16">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-2">Archive</div>
            <h2 className="font-display text-3xl md:text-4xl text-ink">Past devotions</h2>
          </div>
          <div className="text-sm text-ink-muted">{past.length} {past.length === 1 ? "entry" : "entries"}</div>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <Input
              value={q}
              onChange={(e) => { setQ(e.target.value); setVisible(PAGE); }}
              placeholder="Search by title, verse, or content…"
              className="pl-9"
            />
          </div>
        </div>

        {past.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface-elevated py-20 text-center">
            <BookOpen className="h-10 w-10 text-ink-muted mx-auto mb-3" />
            <p className="text-ink-muted">No devotions match your search.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((d) => (
                <Link
                  key={d.id}
                  to={`/devotions/${d.id}`}
                  className="group flex flex-col bg-surface-elevated border border-border rounded-2xl overflow-hidden hover:shadow-card transition-shadow"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    {d.thumbnail
                      ? <img src={d.thumbnail} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      : <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20" />}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-ink-muted">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(parseISO(d.date), "MMM d, yyyy")}
                    </div>
                    <h3 className="mt-3 font-display text-xl text-ink leading-snug group-hover:text-primary">{d.title}</h3>
                    <p className="mt-2 text-sm italic text-ink-muted">"{d.Bible_verse.slice(0, 100)}{d.Bible_verse.length > 100 ? "…" : ""}"</p>
                  </div>
                </Link>
              ))}
            </div>
            {visible < past.length && (
              <div className="mt-12 text-center">
                <Button variant="outline" size="lg" onClick={() => setVisible((v) => v + PAGE)}>
                  Load more
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
