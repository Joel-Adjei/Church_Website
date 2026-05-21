import { Link } from "react-router-dom";
import { FolderOpen, PlayCircle, ArrowRight, VideoOff } from "lucide-react";
import { Seo } from "@/components/Seo";
import { useSeries, useSermons } from "@/services/queries";
import { LoadingState } from "@/components/ui/loading-state";
import { youtubeThumbnail } from "@/lib/utils";

// Beautiful default fallbacks for series that don't have images
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&q=80", // Cathedral lights
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80", // Open bible
  "https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=800&q=80", // Worship sky
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80", // Calm ocean sunrise
];

export default function SeriesIndex() {
  const { data: series = [], isLoading: isSeriesLoading } = useSeries();
  const { data: sermons = [], isLoading: isSermonsLoading } = useSermons();

  const isLoading = isSeriesLoading || isSermonsLoading;

  // Group sermons by series ID to calculate count and get thumbnail fallbacks
  const getSeriesSermons = (seriesId: string) => {
    return sermons.filter((s) => s.series === seriesId);
  };

  const getSeriesImage = (s: any, idx: number) => {
    if (s.image && s.image.trim() !== "") return s.image;
    const seriesSermons = getSeriesSermons(s.id);
    if (seriesSermons.length > 0 && seriesSermons[0].video_link) {
      const thumb = youtubeThumbnail(seriesSermons[0].video_link);
      if (thumb) return thumb;
    }
    // Fallback to rotating curated images if absolutely no image or sermon exists
    return FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
  };

  return (
    <>
      <Seo
        title="Sermon Series"
        description="Explore curated sermon series, study resources, and teaching archives at Grace Cathedral. Grow deeper in your faith."
      />

      {/* Modern High-Fidelity Hero Section */}
      <section className="relative h-[45vh] lg:h-[60vh] flex items-end overflow-hidden bg-ink">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1600&q=80"
            className="h-full w-full object-cover object-center animate-ken-burns"
            alt="Sermon Series Hero"
            fetchPriority="high"
            decoding="async"
          />
          {/* Multi-layered elegant gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/50 to-ink/90 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent z-10" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-24 z-20 w-full">
          <div className="max-w-4xl space-y-6">
            {/* Elegant glassmorphic badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/25 border border-accent/40 backdrop-blur-md animate-in slide-in-from-bottom-4 duration-700">
              <FolderOpen className="h-3.5 w-3.5 text-accent animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white">
                Curated Collections
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] drop-shadow-sm animate-in slide-in-from-bottom-6 duration-1000 delay-100">
              Sermon Series
            </h1>

            <p className="max-w-2xl text-sm md:text-lg text-white/80 leading-relaxed animate-in slide-in-from-bottom-8 duration-1000 delay-200">
              Journey with us through targeted books of the Bible, deep doctrinal studies, and 
              practical lifestyle teachings curated into series for comprehensive learning.
            </p>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent z-30" />
      </section>

      {/* Main Grid Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-24">
        {isLoading ? (
          <LoadingState message="Loading sermon series..." />
        ) : series.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="rounded-full bg-muted p-6 border border-dashed border-border">
              <VideoOff className="h-12 w-12 text-ink-muted" />
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-ink">No Series Available</p>
              <p className="text-ink-muted mt-2 max-w-xs mx-auto leading-relaxed">
                We're currently preparing brand new series collections. Check back soon for updates!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {series.map((s, index) => {
              const seriesSermons = getSeriesSermons(s.id);
              const sermonCount = seriesSermons.length;
              const seriesImage = getSeriesImage(s, index);

              return (
                <Link key={s.id} to={`/series/${s.id}`} className="group block">
                  {/* Playlist-style stacked cards effect */}
                  <div className="relative aspect-[16/10] w-full rounded-2xl bg-ink shadow-card transition-all duration-300">
                    
                    {/* Visual stack indicator at the back */}
                    <div className="absolute -top-2 left-4 right-4 h-2 rounded-t-xl bg-primary/45 border-t border-white/20 group-hover:-top-3 transition-all duration-300" />
                    <div className="absolute -top-1 left-2 right-2 h-1.5 rounded-t-xl bg-primary/70 border-t border-white/10 group-hover:-top-1.5 transition-all duration-300" />

                    {/* Main Image Container */}
                    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-ink-muted border border-border/10 flex items-center justify-center">
                      <img
                        src={seriesImage}
                        alt={s.title}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-40"
                      />
                      
                      {/* Glassmorphic Side/Bottom overlay for sermon count (YouTube playlist vibe) */}
                      <div className="absolute inset-y-0 right-0 w-2/5 bg-ink/75 backdrop-blur-xs flex flex-col justify-center items-center text-white border-l border-white/10 p-4 transition-all duration-500 group-hover:w-full group-hover:bg-primary/90">
                        <FolderOpen className="h-7 w-7 text-accent mb-2 group-hover:scale-110 transition-transform" />
                        <span className="font-display text-2xl font-bold">{sermonCount}</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-white/70">
                          {sermonCount === 1 ? "Sermon" : "Sermons"}
                        </span>
                      </div>

                      {/* Accent highlight gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent z-10 pointer-events-none" />

                      {/* Hover Watch Icon Overlay */}
                      <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="h-14 w-14 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center">
                          <PlayCircle className="h-7 w-7 text-white" strokeWidth={1.5} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text details below card */}
                  <div className="mt-6 space-y-2">
                    <h3 className="font-display text-2xl text-ink leading-tight group-hover:text-primary transition-colors duration-300">
                      {s.title}
                    </h3>
                    <p className="text-sm text-ink-muted line-clamp-2 leading-relaxed">
                      {s.description || "Explore this beautifully compiled teaching series."}
                    </p>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent group-hover:text-primary transition-colors pt-1">
                      <span>View Series playlist</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
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
