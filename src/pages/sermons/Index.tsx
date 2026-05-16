import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Search, PlayCircle, User, VideoOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSermons, useSeries } from "@/services/queries";
import { format } from "date-fns";
import { SectionHeading } from "@/components/SectionHeading";
import heroImg from "@/assets/bg_10.jpg";
// import heroImg from "@/assets/sermon_bg.jpg";
import { youtubeThumbnail } from "@/lib/utils";
import { LoadingState } from "@/components/ui/loading-state";

export default function SermonsIndex() {
  const { data: sermons = [], isLoading } = useSermons();
  const { data: series = [] } = useSeries();
  const [q, setQ] = useState("");
  const [preacher, setPreacher] = useState<string>("all");

  const preachers = useMemo(() => Array.from(new Set(sermons.map((s) => s.preacher))), [sermons]);

  const seriesTitle = (id?: string | null) => series.find((x) => x.id === id)?.title;

  const filtered = sermons.filter((s) => {
    if (preacher !== "all" && s.preacher !== preacher) return false;
    if (q && !`${s.title} ${s.description} ${s.preacher}`.toLowerCase().includes(q.toLowerCase()))
      return false;
    return true;
  });

  return (
    <>
      <Seo
        title="Sermons & Series"
        description="Browse sermons, message series, and teachings from Grace Cathedral. Stream or listen to recent and past messages."
      />
      <section className="relative h-[50vh] lg:h-[70vh] flex items-end overflow-hidden bg-ink">
        {/* Background Image with cinematic entrance animation */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            className="h-full w-full object-cover object-center animate-in fade-in zoom-in-110 duration-1000 ease-out"
            alt="Sermons Background"
          />
          {/* Multi-layered overlay for depth and legibility */}
          <div className="absolute inset-0 bg-linear-to-b from-ink/30 via-ink/10 to-ink/70 z-10" />
          <div className="absolute inset-0 bg-linear-to-t from-primary/90 to-transparent z-10" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-24 z-20 w-full">
          <div className="max-w-4xl space-y-6">
            {/* Editorial Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/30 backdrop-blur-md animate-in slide-in-from-bottom-4 duration-700">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent-foreground dark:text-accent">
                Message Library
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] drop-shadow-sm animate-in slide-in-from-bottom-6 duration-1000 delay-100">
              Sermons
            </h1>

            <p className="max-w-2xl text-sm md:text-lg text-white/80 leading-relaxed animate-in slide-in-from-bottom-8 duration-1000 delay-200">
              Explore our library of archived Sunday messages, teaching series, and biblical
              insights from Grace Cathedral.
            </p>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-accent/50 to-transparent z-30" />
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-24">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-16 p-2 rounded-2xl bg-surface border shadow-sm">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted group-focus-within:text-primary transition-colors" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search sermons, preachers, topics…"
              className="pl-11 h-12 border-none bg-transparent shadow-none focus-visible:ring-0 text-lg"
              aria-label="Search sermons"
            />
          </div>
          <div className="h-12 w-px bg-border hidden md:block" />
          <Select value={preacher} onValueChange={setPreacher}>
            <SelectTrigger className="md:w-64 h-12 border-none bg-transparent shadow-none focus:ring-0 text-ink-muted font-medium">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Preachers</SelectItem>
              {preachers.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <LoadingState message="Loading messages..." />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="rounded-full bg-muted p-6">
              <VideoOff className="h-12 w-12 text-ink-muted" />
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-ink">No sermons found</p>
              <p className="text-ink-muted mt-2 max-w-xs mx-auto leading-relaxed">
                Try adjusting your search or filters to find the message you're looking for.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => {
              const st = seriesTitle(s.series);
              return (
                <Link key={s.id} to={`/sermons/${s.id}`} className="group block">
                  <div className="relative overflow-hidden rounded-2xl aspect-[16/10] bg-ink shadow-card flex items-center justify-center">
                    <img
                      src={youtubeThumbnail(s.video_link)}
                      alt={s.title}
                      className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-40"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-transparent to-transparent z-10" />

                    {/* Hover Content */}
                    <div className="relative z-20 flex flex-col items-center gap-4 transition-all duration-500 group-hover:translate-y-0 translate-y-4">
                      <div className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                        <PlayCircle className="h-8 w-8 text-white" strokeWidth={1.5} />
                      </div>
                      <span className="text-xs font-bold text-white uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        Watch Message
                      </span>
                    </div>

                    {st && (
                      <span className="absolute top-4 left-4 z-30 rounded-full bg-accent/90 backdrop-blur-md text-accent-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1">
                        {st}
                      </span>
                    )}
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent">
                      <span>{format(new Date(s.date), "MMMM d, yyyy")}</span>
                    </div>
                    <h3 className="font-display text-2xl text-ink leading-tight group-hover:text-primary transition-colors duration-300">
                      {s.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-ink-muted">
                      <User className="h-3.5 w-3.5" />
                      <span>{s.preacher}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
