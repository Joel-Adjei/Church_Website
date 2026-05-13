import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, PlayCircle, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSermons, useList } from "@/services/queries";
import { format } from "date-fns";
import { SectionHeading } from "@/components/SectionHeading";
import heroImg from "@/assets/sermon_bg.jpg";
import { youtubeThumbnail } from "@/lib/utils";

export default function SermonsIndex() {
  const { data: sermons = [], isLoading } = useSermons();
  const { data: series = [] } = useList("series");
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
      <section className="relative h-120 flex items-end overflow-hidden">
        <img src={heroImg} className="absolute inset-0 h-full w-full object-cover" />
        <div className="h-full w-full bg-linear-to-t from-primary via-primary/80 to-primary/0 z-10 absolute" />

        <div className="relative max-w-7xl px-6 lg:px-28 py-16 md:py-24 z-20">
          <SectionHeading
            eyebrow="Listen & watch"
            title="Sermons"
            titleColor="white"
            description="Every Sunday message, archived and searchable."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-12">
        <div className="flex flex-col md:flex-row gap-3 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search sermons, preachers, topics…"
              className="pl-10 h-11"
              aria-label="Search sermons"
            />
          </div>
          <Select value={preacher} onValueChange={setPreacher}>
            <SelectTrigger className="md:w-64 h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All preachers</SelectItem>
              {preachers.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="py-24 text-center text-ink-muted">Loading sermons…</div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center text-ink-muted">No sermons match your search.</div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => {
              const st = seriesTitle(s.series);
              return (
                <Link key={s.id} to={`/sermons/${s.id}`} className="group block">
                  <div className="relative overflow-hidden rounded-2xl aspect-[16/10] bg-muted shadow-card flex items-center justify-center">
                    <img
                      src={youtubeThumbnail(s.video_link)}
                      alt={s.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-primary/70 via-primary/10 to-transparent" />
                    <PlayCircle
                      className="relative h-14 w-14 text-primary-foreground/80"
                      strokeWidth={1.3}
                    />
                    {st && (
                      <span className="absolute top-4 left-4 rounded-full bg-accent text-accent-foreground text-xs font-semibold px-3 py-1">
                        {st}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-5 font-display text-2xl text-ink leading-snug group-hover:text-primary transition-colors">
                    {s.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-3 text-sm text-ink-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" /> {s.preacher}
                    </span>
                    <span>·</span>
                    <span>{format(new Date(s.date), "MMM d, yyyy")}</span>
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
