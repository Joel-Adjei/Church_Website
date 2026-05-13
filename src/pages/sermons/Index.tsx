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
import { useList } from "@/services/queries";
import { format } from "date-fns";
import { SectionHeading } from "@/components/SectionHeading";
import heroImg from "@/assets/sermon_bg.jpg";

export default function SermonsIndex() {
  const { data: sermons = [], isLoading } = useList("sermons");
  const { data: series = [] } = useList("series");
  const [q, setQ] = useState("");
  const [speaker, setSpeaker] = useState<string>("all");

  const speakers = useMemo(() => Array.from(new Set(sermons.map((s) => s.speaker))), [sermons]);
  const seriesTitle = (id?: string | null) => series.find((x) => x.id === id)?.title;

  const filtered = sermons.filter((s) => {
    if (speaker !== "all" && s.speaker !== speaker) return false;
    if (q && !`${s.title} ${s.description} ${s.speaker}`.toLowerCase().includes(q.toLowerCase()))
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
              placeholder="Search sermons, speakers, topics…"
              className="pl-10 h-11"
              aria-label="Search sermons"
            />
          </div>
          <Select value={speaker} onValueChange={setSpeaker}>
            <SelectTrigger className="md:w-64 h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All speakers</SelectItem>
              {speakers.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
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
              const st = seriesTitle(s.seriesId);
              return (
                <Link key={s.id} to={`/sermons/${s.slug}`} className="group block">
                  <div className="relative overflow-hidden rounded-2xl aspect-[16/10] bg-muted shadow-card">
                    <img
                      src={s.thumbnailUrl}
                      alt={s.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
                    <PlayCircle
                      className="absolute bottom-4 right-4 h-10 w-10 text-primary-foreground/95"
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
                      <User className="h-3.5 w-3.5" /> {s.speaker}
                    </span>
                    <span>·</span>
                    <span>{format(new Date(s.sermonDate), "MMM d, yyyy")}</span>
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
