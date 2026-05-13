import { Link } from "react-router-dom";
import { Images } from "lucide-react";
import { useList } from "@/services/queries";
import { SectionHeading } from "@/components/SectionHeading";
import heroImg from "@/assets/bg_02.jpg";

export default function GalleryIndex() {
  const { data: programs = [] } = useList("gallery");
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

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((p) => (
          <Link
            key={p.id}
            to={`/gallery/${p.slug}`}
            className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-card hover:shadow-elevated transition-shadow"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={p.coverImageUrl}
                alt={p.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
              <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 text-xs text-primary-foreground bg-primary/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                <Images className="h-3.5 w-3.5" /> {p.images.length} photos
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl text-ink group-hover:text-primary transition-colors">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-ink-muted line-clamp-2">{p.description}</p>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
