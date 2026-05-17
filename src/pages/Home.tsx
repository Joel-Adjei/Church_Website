import { useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Radio,
  PlayCircle,
  HandHeart,
  Users,
  BookOpen,
  Heart,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { settings } from "@/utils/mockData";
import { useEvents, useSermons, useSeries, useAnnouncements } from "@/services/queries";
import { format } from "date-fns";
import { youtubeThumbnail } from "@/lib/utils";
import { useLiveStore } from "@/store/live";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import img from "@/assets/img_06.jpg";
import imgbd from "@/assets/devotions-hero.jpg";

const STORY_VIDEO_ID = "ScMzIvxBSi4";
const STORY_THUMB = "https://images.unsplash.com/photo-1508963493744-76fce69379c0?w=1600&q=80";

const nextSteps = [
  {
    icon: BookOpen,
    title: "Listen in",
    desc: "Catch up on recent sermons & series.",
    to: "/sermons",
  },
  {
    icon: HandHeart,
    title: "Serve & give",
    desc: "Use your gifts to bless the city.",
    to: "/contact",
  },
];

const testimonials = [
  {
    quote:
      "Grace Cathedral became home the moment we walked in. The teaching is honest, the people are warm, and our kids love it.",
    name: "The Okafor family",
    role: "Members since 2019",
  },
  {
    quote:
      "I came in skeptical and stayed because no one tried to package faith as easy. They just made room for my questions.",
    name: "Jordan M.",
    role: "First-time guest, now baptized",
  },
  {
    quote: "Serving with the food pantry team showed me what church can be in a city.",
    name: "Priya S.",
    role: "Mercy ministries volunteer",
  },
];

const SERVICE_IMAGES = [
  img,
  "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&auto=format&fit=crop&q=80",
  imgbd, // Bible Study: cozy group conversation with coffee/books
];

export default function Home() {
  const { data: sermons = [] } = useSermons();
  const { data: events = [] } = useEvents();
  const { data: announcements = [] } = useAnnouncements();
  const { data: series = [] } = useSeries();
  const isLive = useLiveStore((state) => state.isLive);

  const latest = sermons[0];
  const upcoming = events.slice(0, 3);
  const news = announcements.slice(0, 3);
  const seriesTitle = (id?: string | null) => series.find((s) => s.id === id)?.title;
  const [videoOpen, setVideoOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image:
        settings.bannerImageUrl ||
        "https://images.unsplash.com/photo-1548625361-195fe57656ef?w=1600&q=80",
      eyebrow: "Welcome home",
      title: settings.churchName,
      tagline: settings.tagline,
    },
    {
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1600&q=80",
      eyebrow: "Join our community",
      title: "Life Together",
      tagline: "Discover a place where you belong and can grow in your faith.",
    },
    {
      image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=1600&q=80",
      eyebrow: "Experience worship",
      title: "Heartfelt Praise",
      tagline: "Join us this Sunday for transformative worship and powerful teaching.",
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
        title="Grace Cathedral — A community of faith, hope, and love"
        description="Grace Cathedral is a welcoming community in the heart of the city. Join us for worship, sermons, events, and life together."
        noSuffix
      />
      <section className="relative h-[90vh] min-h-[600px] w-full isolate overflow-hidden bg-primary">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out",
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

            <div className="relative h-full flex items-center justify-center">
              <div
                key={index === currentSlide ? `content-${index}` : `content-hidden-${index}`}
                className="mx-auto max-w-6xl px-6 lg:px-10 py-24 w-full flex flex-col items-center"
              >
                <span className="inline-block text-center text-xs uppercase tracking-[0.2em] text-primary bg-white/40 py-2 px-4 rounded font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards">
                  {slide.eyebrow}
                </span>
                <h1 className="font-display text-center text-5xl md:text-8xl lg:text-9xl text-primary-foreground leading-[0.95] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-forwards">
                  {slide.title}
                </h1>
                <p className="mt-8 text-lg text-center md:text-2xl text-primary-foreground/90 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 fill-mode-forwards">
                  {slide.tagline}
                </p>
                <div className="mt-12 flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700 fill-mode-forwards">
                  {isLive && (
                    <Button
                      asChild
                      size="lg"
                      variant={"secondary"}
                      className="gap-2 h-14 px-8 text-base"
                    >
                      <Link to="/live">
                        <Radio className="h-4 w-4 animate-pulse" /> Watch Live
                      </Link>
                    </Button>
                  )}
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="bg-white/10 backdrop-blur-md h-14 px-8 text-base border-white/20 text-white hover:bg-white hover:text-primary transition-all"
                  >
                    <Link to="/sermons">Browse sermons</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slide indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map(({ image }, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                "h-1.5 transition-all duration-500 rounded-full",
                i === currentSlide ? "w-8 bg-accent" : "w-2 bg-white/30 hover:bg-white/50",
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 animate-bounce flex flex-col items-center opacity-50">
          <div className="w-px h-8 bg-linear-to-b from-white/0 via-white/50 to-white/0" />
        </div>
      </section>

      <section className="bg-background pb-7 md:pb-9 border-b border-border">
        <div className="bg-accent flex flex-col p-3.5 items-center text-center mb-5">
          <h2 className="font-display text-3xl text-ink leading-tight">Weekly Service Times</h2>
          {/* <div className="mt-4 w-12 h-0.5 bg-mute/60 rounded" /> */}
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-2 md:grid-cols-3">
            {settings.serviceTimes.map((s, i) => {
              const parts = s.includes(" — ") ? s.split(" — ") : s.split(" - ");
              const time = parts[0]?.trim() || s;
              const name = parts[1]?.trim() || `Service ${i + 1}`;
              const image = SERVICE_IMAGES[i % SERVICE_IMAGES.length];

              return (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-lg aspect-[16/11] md:aspect-[4/3] lg:aspect-[16/11] shadow-card hover:shadow-elevated transition-all duration-500 border border-border/10 flex flex-col justify-end p-6 md:p-8"
                >
                  {/* Background Image with Zoom Effect */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                  {/* Premium Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/65 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />

                  {/* Sleek Golden Border Glow on Hover */}
                  <div className="absolute inset-0 border border-white/10 rounded-2xl group-hover:border-accent/40 transition-colors duration-500 pointer-events-none" />

                  {/* Card Content */}
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    {/* Top Row: Service Badge & Icon */}
                    <div className="flex items-center justify-end">
                      <Clock className="h-5 w-5 text-accent/80 group-hover:text-accent group-hover:rotate-12 transition-all duration-500" />
                    </div>

                    {/* Bottom Row: Text and Micro-interactions */}
                    <div className="mt-8">
                      <h3 className="font-display text-2xl md:text-3xl text-white leading-tight group-hover:text-accent transition-colors duration-300">
                        {name}
                      </h3>
                      <p className="mt-2 text-sm md:text-base text-white/80 font-medium tracking-wide">
                        {time}
                      </p>

                      {/* Animated Visit Action Link */}
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-accent opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <span>Plan your visit</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {latest && (
        <section className="mx-auto max-w-7xl px-6 lg:px-10 py-20 md:py-28">
          <SectionHeading eyebrow="Latest sermon" title="This week from our pulpit" />
          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <Link
              to={`/sermons/${latest.id}`}
              className="group relative block overflow-hidden rounded-2xl shadow-card bg-muted aspect-[16/10]"
            >
              <div className="absolute inset-0 bg-linear-to-t from-primary/80 to-transparent z-10" />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <PlayCircle
                  className="h-20 w-20 text-primary-foreground/95 transition-transform group-hover:scale-110"
                  strokeWidth={1.2}
                />
              </div>
              <img
                src={youtubeThumbnail(latest.video_link)}
                alt={latest.title}
                className="absolute inset-0 h-full w-full object-cover z-0 transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <div>
              {seriesTitle(latest.series) && (
                <div className="text-sm text-accent font-semibold uppercase tracking-widest mb-3">
                  {seriesTitle(latest.series)}
                </div>
              )}
              <h3 className="font-display text-4xl md:text-5xl text-ink leading-[1.05]">
                {latest.title}
              </h3>
              <p className="mt-2 text-ink-muted">
                {latest.preacher} · {format(new Date(latest.date), "MMMM d, yyyy")}
              </p>
              <p className="mt-6 text-lg text-ink-muted leading-relaxed">{latest.description}</p>
              <Button asChild className="mt-8 gap-2">
                <Link to={`/sermons/${latest.id}`}>
                  Watch now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="border-y border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-20">
          <SectionHeading eyebrow="Next steps" title="However you arrive, there's a way forward." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 ">
            {nextSteps.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.title}
                  to={s.to}
                  className="group p-6 rounded-2xl border border-border bg-card hover:shadow-elevated transition-shadow"
                >
                  <div className="h-11 w-11 rounded-xl bg-accent/10 text-accent inline-flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl text-ink">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-muted">{s.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <SectionHeading eyebrow="Our story" title="Take two minutes to meet us." />
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              A short film about who we are, the people we're for, and the hope that holds it all
              together.
            </p>
            <Button size="lg" className="mt-8 gap-2" onClick={() => setVideoOpen(true)}>
              <Play className="h-4 w-4" /> Watch the film
            </Button>
          </div>
          <button
            type="button"
            onClick={() => setVideoOpen(true)}
            aria-label="Play our story video"
            className="group relative block overflow-hidden rounded-2xl shadow-elevated focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <img
              src={STORY_THUMB}
              alt="Our story"
              className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-primary/70 via-primary/20 to-transparent" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="h-20 w-20 rounded-full bg-background/95 inline-flex items-center justify-center shadow-elevated transition-transform group-hover:scale-110">
                <Play className="h-8 w-8 text-primary ml-1" fill="currentColor" />
              </span>
            </span>
          </button>
        </div>
      </section>

      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black border-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Our story</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
            {videoOpen && (
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${STORY_VIDEO_ID}?autoplay=1&rel=0`}
                title="Our story"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {upcoming.length > 0 && (
        <section className="bg-surface-elevated border-y border-border">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 md:py-28">
            <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
              <SectionHeading eyebrow="What's next" title="Upcoming events" />
              <Link
                to="/events"
                className="text-sm font-medium text-primary hover:text-accent inline-flex items-center gap-1"
              >
                All events <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {upcoming.map((e) => (
                <Link
                  key={e.id}
                  to={`/events/${e.id}`}
                  className="group block overflow-hidden rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated transition-shadow"
                >
                  {e.flyer && (
                    <div className="aspect-4/3 overflow-hidden">
                      <img
                        src={e.flyer}
                        alt={e.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-accent font-semibold">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(e.date), "MMM d")} · {e.start_time.slice(0, 5)}
                    </div>
                    <h3 className="mt-3 font-display text-2xl text-ink leading-tight group-hover:text-primary transition-colors">
                      {e.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted">
                      <MapPin className="h-3.5 w-3.5" /> {e.location}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {news.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 lg:px-10 py-20 md:py-28">
          <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
            <SectionHeading eyebrow="From the church" title="Latest news" />
            <Link
              to="/announcements"
              className="text-sm font-medium text-primary hover:text-accent inline-flex items-center gap-1"
            >
              All news <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {news.map((n) => (
              <Link key={n.id} to={`/announcements/${n.id}`} className="group block">
                <div className="text-xs text-ink-muted mb-3">
                  {format(new Date(n.date), "MMMM d, yyyy")}
                </div>
                <h3 className="font-display text-2xl text-ink leading-snug group-hover:text-primary transition-colors">
                  {n.title}
                </h3>
                <p className="mt-3 text-ink-muted line-clamp-3">{n.content}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  Read more <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="bg-surface-elevated border-y border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 md:py-28">
          <SectionHeading eyebrow="Voices from the pews" title="What people are saying" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="p-7 rounded-2xl bg-card border border-border shadow-card"
              >
                <blockquote className="font-display text-lg text-ink leading-snug">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-5 text-sm">
                  <div className="font-semibold text-ink">{t.name}</div>
                  <div className="text-ink-muted">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid gap-6 md:grid-cols-3 text-center">
          {[
            { to: "/live", label: "Watch Live", desc: "Join our service from anywhere" },
            { to: "/contact", label: "Get in touch", desc: "We'd love to meet you" },
            { to: "/about", label: "Our story", desc: "Who we are & what we believe" },
          ].map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="group block py-6 px-4 rounded-2xl hover:bg-primary-foreground/5 transition-colors"
            >
              <h3 className="font-display text-2xl group-hover:text-accent transition-colors">
                {q.label}
              </h3>
              <p className="mt-2 text-primary-foreground/70">{q.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
