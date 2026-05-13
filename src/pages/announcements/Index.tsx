import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useList } from "@/services/queries";
import { format } from "date-fns";
import { SectionHeading } from "@/components/SectionHeading";
import heroImg from "@/assets/bg_09.jpg";

export default function AnnouncementsIndex() {
  const { data: announcements = [] } = useList("announcements");
  return (
    <>
      <section className="relative  lg:h-90 flex items-end overflow-hidden">
        <img src={heroImg} className="absolute bottom-0 inset-0 h-full w-full object-cover" />
        <div className="h-full w-full bg-linear-to-t from-primary/20 to-primary/0 z-10 absolute" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-24 z-20">
          {/* <SectionHeading eyebrow="Stay in the loop" title="News & announcements" /> */}
          <div className={`max-w-4xl`}>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-primary leading-[1.05]">
              News & Announcements
            </h2>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-6 lg:px-10 py-16 divide-y divide-border">
        {announcements.map((a) => (
          <Link key={a.id} to={`/announcements/${a.slug}`} className="group block py-10 first:pt-0">
            <div className="text-xs text-accent font-semibold uppercase tracking-widest">
              {format(new Date(a.publishAt), "MMMM d, yyyy")}
            </div>
            <h2 className="mt-3 font-display text-3xl text-ink leading-snug group-hover:text-primary transition-colors">
              {a.title}
            </h2>
            <p className="mt-3 text-lg text-ink-muted line-clamp-2">{a.body}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
              Read more <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}
