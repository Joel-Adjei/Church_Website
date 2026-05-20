import { Link } from "react-router-dom";
import { Images, ImageOff, Radio } from "lucide-react";
import { Seo } from "@/components/Seo";
import { useGallery, useSettings } from "@/services/queries";
import { SectionHeading } from "@/components/SectionHeading";
import heroImg from "@/assets/img_15.jpg";
import img1 from "@/assets/img_16.jpg";
import img2 from "@/assets/img_04.jpg";
import { LoadingState } from "@/components/ui/loading-state";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function GalleryIndex() {
  const { data: programs = [], isLoading } = useGallery();
  const { data: siteSettings } = useSettings();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: heroImg,
      eyebrow: "Moments together",
      title: "Gallery",
      tagline: "A look back at the seasons and celebrations that shape our community.",
    },
    {
      image: img1,
      eyebrow: "Browse our gallery",
      title: "Moments of Grace",
      tagline: "Captured memories of our community walking together in faith.",
    },
    {
      image: img2,
      eyebrow: "Relive the experience",
      title: "Captured in Worship",
      tagline: "Relive the moments where hearts were lifted and God was glorified.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);
  return (
    <>
      <Seo
        title="Gallery"
        description="A collection of moments from Grace Cathedral — services, events, and community life in photos."
      />

      <section className="relative lg:h-[90vh] min-h-[600px] w-full isolate overflow-hidden bg-primary">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 h-full w-full transition-opacity duration-2000 ease-in-out",
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
          >
            {/* Background with Ken Burns */}
            <div
              className={cn(
                "absolute inset-0 bg-cover bg-center",
                index === currentSlide ? "animate-ken-burns" : "",
              )}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-linear-to-b from-primary/30 via-primary/60 to-primary/80" />
            </div>

            <div className="relative w-full max-w-4xl h-full flex items-center px-6 lg:px-12">
              <div
                key={index === currentSlide ? `content-${index}` : `content-hidden-${index}`}
                className=" max-w-6xl px-6 lg:px-10 py-24 w-full flex flex-col items-left"
              >
                <div className="flex gap-2 h-fit ">
                  <div className="w-6 h-6 bg-accent " />
                  <h1 className="font-display text-left text-7xl md:text-8xl lg:text-9xl text-primary-foreground leading-[0.95] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-forwards">
                    {slide.title}
                  </h1>
                </div>

                <p className="mt-8 text-md text-left md:text-xl text-primary-foreground/90 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 fill-mode-forwards">
                  {slide.tagline}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Slide indicators mobile view */}
        <div className="flex lg:hidden absolute lg:top-1/2  left-1/2   bottom-4  lg:right-4 -translate-x-1/2 lg:translate-x-0 lg:-translate-y-1/2 z-20  items-center gap-3">
          {slides.map(({ image }, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                " transition-all rounded-lg overflow-hidden duration-500",
                i === currentSlide
                  ? "w-20 h-25 bg-accent"
                  : "w-10 h-15  bg-white/30 hover:bg-white/50 opacity-30",
              )}
              aria-label={`Go to slide ${i + 1}`}
            >
              <img src={image} alt={`image-${i}`} className="size-full object-cover" />
            </button>
          ))}
        </div>

        {/* Slide indicators laptop view */}
        <div className="hidden lg:flex absolute lg:top-1/2  lg:right-4 lg:-translate-y-1/2 z-20  items-center gap-3">
          {slides.map(({ image }, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                " transition-all rounded-2xl overflow-hidden duration-500 ",
                i === currentSlide
                  ? "w-45 h-50 bg-accent"
                  : ":w-20 h-25 hover:cursor-zoom-in bg-white opacity-30",
              )}
              aria-label={`Go to slide ${i + 1}`}
            >
              <img src={image} alt={`image-${i}`} className="size-full object-cover" />
            </button>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 animate-bounce flex flex-col items-center opacity-50">
          <div className="w-px h-8 bg-linear-to-b from-white/0 via-white/50 to-white/0" />
        </div>
      </section>
      {/* <section className="relative h-120 flex items-end overflow-hidden">
        <img src={heroImg} className="absolute inset-0 h-full w-full object-cover" />
        <div className="md:hidden h-full w-full bg-linear-to-t from-primary via-primary/70 to-primary/10 z-10 absolute" />
        <div className="hidden md:block h-full w-full bg-linear-to-r from-primary via-primary/70 to-primary/0 z-10 absolute" />
        <div className="relative max-w-7xl px-6 lg:px-28 py-16 md:py-24 z-20">
          <SectionHeading
            eyebrow="Moments together"
            title="Gallery"
            titleColor="white"
            description="A look back at the seasons and celebrations that shape our community."
          />
        </div>
      </section> */}

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
        {isLoading && <LoadingState message="Loading gallery..." />}
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
