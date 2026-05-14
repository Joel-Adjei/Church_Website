import { Link } from "react-router-dom";
import { Images, ImageOff, Loader2 } from "lucide-react";
import { useGallery } from "@/services/queries";
import { SectionHeading } from "@/components/SectionHeading";
import heroImg from "@/assets/bg_02.jpg";

export default function GalleryIndex() {
  const { data: programs = [], isLoading } = useGallery();
  return (
    <>
      <section className="relative h-120 flex items-end overflow-hidden">
        <img src={heroImg} className="absolute inset-0 h-full w-full object-cover" />
        <div className="h-full w-full bg-linear-to-t from-primary to-primary/0 z-10 absolute" />
        <div className="relative max-w-7xl px-6 lg:px-28 py-16 md:py-24 z-20">
          <SectionHeading
            eyebrow="Moments together"
            title="Gallery"
            titleColor="white"
            description="A look back at the seasons and celebrations that shape our community."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-ink-muted">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading gallery…</p>
          </div>
        )}
        {!isLoading && programs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-ink-muted">
            <div className="rounded-full bg-muted p-5">
              <ImageOff className="h-10 w-10 text-ink-muted" />
            </div>
            <p className="text-lg font-semibold text-ink">No gallery albums yet</p>
            <p className="text-sm text-ink-muted max-w-xs text-center">
              Check back soon — photos from our events and celebrations will appear here.
            </p>
          </div>
        )}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((p) => {
          const cover = p.images[0]?.image;
          return (
            <Link
              key={p.id}
              to={`/gallery/${p.id}`}
              className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-card hover:shadow-elevated transition-shadow"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-muted">
                {cover && (
                  <img
                    src={cover}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-primary/70 to-transparent" />
                <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 text-xs text-primary-foreground bg-primary/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <Images className="h-3.5 w-3.5" /> {p.images.length} photos
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl text-ink group-hover:text-primary transition-colors">
                  {p.title}
                </h3>
                {p.venue && <p className="mt-1 text-xs text-accent font-medium">{p.venue}</p>}
                <p className="mt-2 text-sm text-ink-muted line-clamp-2">{p.description}</p>
              </div>
            </Link>
          );
        })}
        </div>
      </section>
    </>
  );
}
