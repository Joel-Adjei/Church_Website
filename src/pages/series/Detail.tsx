import { Link, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Play, 
  Share2, 
  FolderOpen,
  Info,
  Clock
} from "lucide-react";
import { useSeriesById, useSermons } from "@/services/queries";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { youtubeThumbnail } from "@/lib/utils";
import { Seo } from "@/components/Seo";
import { LoadingState } from "@/components/ui/loading-state";
import { toast } from "sonner";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&q=80";

export default function SeriesDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: series, isLoading: isSeriesLoading, error } = useSeriesById(id);
  const { data: sermons = [], isLoading: isSermonsLoading } = useSermons();

  const isLoading = isSeriesLoading || isSermonsLoading;

  if (isLoading) return <LoadingState message="Loading playlist details..." />;
  if (error || !series) {
    return (
      <div className="py-24 text-center">
        <p className="text-xl font-semibold text-ink">Series not found</p>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/series">Back to Series</Link>
        </Button>
      </div>
    );
  }

  // Filter sermons that belong to this series
  const seriesSermons = sermons
    .filter((s) => s.series === series.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort new to old, or old to new. Let's do chronological (oldest first) so they can watch in order, or reverse chronological. Usually playlist is ordered oldest first or we preserve the order they were published. Let's order by date (ascending, i.e., oldest first, like a course or series study).
  
  const chronologicalSermons = [...seriesSermons].reverse(); // Oldest first

  const firstSermon = chronologicalSermons[0];
  const seriesImage = series.image || firstSermon?.video_link ? youtubeThumbnail(firstSermon.video_link) : FALLBACK_IMAGE;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Playlist link copied to clipboard!");
  };

  return (
    <>
      <Seo
        title={`${series.title} — Sermon Series`}
        description={series.description || `Browse all Sunday messages and teaching in the ${series.title} series.`}
        image={seriesImage}
      />

      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 py-8 lg:py-12">
          
          {/* Back Button */}
          <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1.5 mb-8 text-ink-muted hover:text-primary">
            <Link to="/series">
              <ArrowLeft className="h-4 w-4" /> All Series
            </Link>
          </Button>

          {/* YouTube Playlist Inspired Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT COLUMN: Playlist Info Panel (Sticky on desktop) */}
            <div className="lg:sticky lg:top-24 bg-card rounded-3xl border border-border shadow-elevated overflow-hidden isolate">
              
              {/* ambient glow container */}
              <div className="relative p-6 md:p-8 flex flex-col h-full w-full">
                
                {/* Blurred image backdrop for YouTube's immersive ambient light vibe */}
                <div 
                  className="absolute inset-0 -z-10 bg-cover bg-center blur-2xl opacity-25 scale-110 pointer-events-none"
                  style={{ backgroundImage: `url(${seriesImage})` }}
                />

                {/* Series Thumbnail Container */}
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-ink shadow-md group">
                  <img
                    src={seriesImage}
                    alt={series.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Playlist Overlay Indicator */}
                  <div className="absolute inset-x-0 bottom-0 bg-ink/75 backdrop-blur-xs py-3 px-4 flex justify-between items-center text-white border-t border-white/10 text-xs font-semibold">
                    <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                      <FolderOpen className="h-4 w-4 text-accent" /> Sermon Series
                    </span>
                    <span>{seriesSermons.length} sermons</span>
                  </div>
                </div>

                {/* Series Metadata */}
                <div className="mt-8 space-y-4">
                  <h1 className="font-display text-3xl md:text-4xl text-ink leading-tight">
                    {series.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-muted font-medium">
                    <span>Grace Cathedral</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                    <span>{seriesSermons.length} lessons</span>
                    {firstSermon && (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-border" />
                        <span>Updated {format(new Date(firstSermon.date), "MMM yyyy")}</span>
                      </>
                    )}
                  </div>

                  <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-line">
                    {series.description || "No description provided for this teaching series."}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row lg:flex-col gap-3">
                  {firstSermon ? (
                    <Button asChild className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 group shadow-sm transition-all duration-300">
                      <Link to={`/sermons/${firstSermon.id}`}>
                        <Play className="h-4 w-4 fill-current group-hover:scale-110 transition-transform" />
                        Play All Messages
                      </Link>
                    </Button>
                  ) : (
                    <Button disabled className="w-full h-12 rounded-xl flex items-center justify-center gap-2">
                      <Play className="h-4 w-4" /> No Sermons
                    </Button>
                  )}

                  <Button 
                    onClick={handleShare}
                    variant="outline" 
                    className="w-full h-12 border-border/80 text-ink hover:bg-muted font-semibold rounded-xl flex items-center justify-center gap-2"
                  >
                    <Share2 className="h-4 w-4" /> Share Series
                  </Button>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN: Sermons List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <span className="text-sm font-semibold text-ink uppercase tracking-wider">
                  Playlist Items
                </span>
                <span className="text-xs text-ink-muted flex items-center gap-1 font-medium">
                  <Info className="h-3.5 w-3.5" /> Ordered chronologically (oldest first)
                </span>
              </div>

              {chronologicalSermons.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-3xl border border-border border-dashed p-8">
                  <FolderOpen className="h-12 w-12 text-ink-muted mx-auto mb-4" />
                  <h3 className="font-display text-xl text-ink font-semibold">No sermons added yet</h3>
                  <p className="text-sm text-ink-muted mt-2 max-w-sm mx-auto">
                    Sermons in this series will appear here once they are published by the media team.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {chronologicalSermons.map((s, index) => {
                    const idxStr = String(index + 1).padStart(2, "0");
                    const thumb = youtubeThumbnail(s.video_link) || FALLBACK_IMAGE;

                    return (
                      <Link 
                        key={s.id} 
                        to={`/sermons/${s.id}`} 
                        className="group flex flex-col sm:flex-row gap-4 p-3 rounded-2xl border border-transparent hover:border-border/60 hover:bg-card/75 transition-all duration-300 items-start sm:items-center"
                      >
                        
                        {/* Number and Thumbnail Container */}
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          
                          {/* Index Index */}
                          <div className="text-sm font-mono font-bold text-ink-muted/80 group-hover:text-primary transition-colors w-6 text-center">
                            {idxStr}
                          </div>

                          {/* Image Box */}
                          <div className="relative aspect-[16/10] w-36 rounded-xl overflow-hidden bg-ink shadow-sm flex-shrink-0">
                            <img
                              src={thumb}
                              alt={s.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            
                            {/* Glassmorphic Play Button overlay on hover */}
                            <div className="absolute inset-0 bg-primary/20 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <div className="h-9 w-9 rounded-full bg-white/90 border border-white flex items-center justify-center shadow-md">
                                <Play className="h-4 w-4 text-primary fill-current translate-x-0.5" />
                              </div>
                            </div>

                            {/* Decorative duration / tag if present */}
                            <span className="absolute bottom-1 right-1 bg-ink/75 text-[9px] px-1.5 py-0.5 rounded text-white font-mono font-medium">
                              Message
                            </span>
                          </div>

                        </div>

                        {/* Sermon Details */}
                        <div className="flex-1 space-y-1.5 min-w-0 pr-4">
                          <h3 className="font-display text-xl text-ink leading-snug group-hover:text-primary transition-colors line-clamp-1">
                            {s.title}
                          </h3>
                          
                          {/* Metainfo row */}
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted font-medium">
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5 text-accent" /> {s.preacher}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-border" />
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" /> {format(new Date(s.date), "MMM d, yyyy")}
                            </span>
                          </div>

                          <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed mt-1">
                            {s.description || "A transformative message on growing in faith, studying scripture, and living the Christian life."}
                          </p>
                        </div>

                        {/* Arrow indicator at the end */}
                        <div className="hidden md:flex h-9 w-9 rounded-full bg-muted/30 border border-border/40 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <Play className="h-3 w-3 text-ink-muted fill-current translate-x-0.5" />
                        </div>

                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
