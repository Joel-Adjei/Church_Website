import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Seo } from "@/components/Seo";
import { SectionHeading } from "@/components/SectionHeading";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Heart, Users, HandHeart, Globe } from "lucide-react";
import heroImg from "@/assets/img_17.jpg";
import { useSettings } from "@/services/queries";

const leaders = [
  {
    name: "Pastor David Whitfield",
    role: "Senior Pastor",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    bio: "David has led Grace Cathedral since 2014. He holds an MDiv from Princeton and a heart for the city.",
  },
  {
    name: "Pastor Anna Reyes",
    role: "Teaching Pastor",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    bio: "Anna leads our teaching team and oversees small groups. She lives in Springfield with her husband and two boys.",
  },
  {
    name: "Pastor Marcus Hale",
    role: "Pastor of Worship",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
    bio: "Marcus oversees worship and the arts. A composer, songwriter, and lifelong student of hymnody.",
  },
  {
    name: "Sarah Chen",
    role: "Director of Missions",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    bio: "Sarah leads our local and global partnerships, with a focus on long-term, relational mission.",
  },
];

const lifeImages = [
  {
    src: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1400&q=80",
    alt: "Congregation worshipping together",
  },
  {
    src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1400&q=80",
    alt: "Community gathering and fellowship",
  },
  {
    src: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1400&q=80",
    alt: "Volunteers serving the community",
  },
  {
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&q=80",
    alt: "Joyful celebration after service",
  },
  {
    src: "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=1400&q=80",
    alt: "Worship band leading praise",
  },
  {
    src: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1400&q=80",
    alt: "Children's ministry program",
  },
];

const values = [
  {
    icon: Heart,
    title: "Gospel-centered",
    text: "Everything we do flows from the good news of Jesus.",
  },
  {
    icon: Users,
    title: "Family on mission",
    text: "We belong to one another and to the world God loves.",
  },
  {
    icon: HandHeart,
    title: "Generously serving",
    text: "Our time, gifts, and resources are joyfully shared.",
  },
  {
    icon: Globe,
    title: "Locally rooted, globally aware",
    text: "From our neighborhood to the nations.",
  },
];

const milestones = [
  { year: "1962", text: "Grace Cathedral is planted by 14 founding families." },
  { year: "1978", text: "We move into our current sanctuary on Cathedral Lane." },
  { year: "1995", text: "Launch of our citywide partnerships and food pantry." },
  { year: "2010", text: "First international church plant in East Africa." },
  { year: "2024", text: "Over 1,800 people gather across three weekend services." },
];

export default function About() {
  const autoplay = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true }),
  );
  const { data: siteSettings } = useSettings();

  return (
    <>
      <Seo
        title="About Us"
        description="Meet the people, values, and story behind Grace Cathedral — a family of faith rooted in the city and the gospel."
      />
      <section className="relative h-[70dvh] lg:h-[80dvh] flex items-end isolate overflow-hidden ">
        <img
          className="absolute w-full h-full -z-10 object-cover object-center opacity-"
          src={heroImg}
        />
        <div className="absolute z-0 bottom-0 w-full h-[70%] bg-linear-to-t from-background to-transparent " />

        <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-10  text-center">
          <div className="w-60 bg-white mb-3 rounded-full mx-auto ">
            <img
              src={siteSettings?.logo_url}
              alt={siteSettings?.church_name}
              className="w-full object-contain"
            />
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-ink leading-[0.95] drop-shadow-sm animate-in slide-in-from-bottom-6 duration-1000 delay-100">
            {siteSettings?.church_name ?? "Grace Cathedral"}
          </h1>
          <p className="mt-6 text-lg text-ink-muted max-w-2xl mx-auto">
            For more than sixty years, Grace Cathedral has been a place where ordinary people meet
            an extraordinary God — and learn to live differently because of it.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 lg:px-10 py-20 md:py-28">
        <SectionHeading
          eyebrow="Our mission"
          title="To love God, love people, and serve the city."
        />
        <p className="mt-6 text-lg text-ink-muted leading-relaxed">
          Grace Cathedral was planted in 1962 by a small group of families who believed that the
          church should be both a sanctuary for the soul and a force for good in its neighborhood.
          Six decades later, we're still trying to live that out — Sunday by Sunday, week by week.
        </p>
        <p className="mt-4 text-lg text-ink-muted leading-relaxed">
          We are an intergenerational, multi-ethnic congregation rooted in historic Christian faith.
          We hold to the Apostles' Creed, the authority of Scripture, and the joyful invitation of
          the gospel. Whether you are exploring faith for the first time or have followed Jesus your
          whole life, you have a seat at the table here.
        </p>
      </section>

      <section className="bg-surface-elevated border-y border-border overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 md:py-28">
          <SectionHeading
            eyebrow="Life at Grace"
            title="Glimpses of our community"
            description="Sundays, service days, small groups, and the simple moments in between."
          />
          <div className="mt-12">
            <Carousel
              opts={{ loop: true, align: "start" }}
              plugins={[autoplay.current]}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {lifeImages.map((img) => (
                  <CarouselItem key={img.src} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-card">
                      <img
                        src={img.src}
                        alt={img.alt}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-20 md:py-28">
        <SectionHeading
          eyebrow="What shapes us"
          title="Our values"
          description="Four convictions that guide how we worship, gather, and serve."
        />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="p-6 rounded-2xl border border-border bg-card">
                <div className="h-11 w-11 rounded-xl bg-accent/10 text-accent inline-flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl text-ink">{v.title}</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{v.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-surface-elevated border-y border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 md:py-28">
          <SectionHeading
            eyebrow="Who we are"
            title="Leadership"
            description="A team of pastors and staff who love this church and the city it serves."
          />
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map((p) => (
              <div key={p.name}>
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                  <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="mt-5 font-display text-xl text-ink">{p.name}</h3>
                <p className="text-sm text-accent font-medium">{p.role}</p>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{p.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 lg:px-10 py-20 md:py-28">
        <SectionHeading eyebrow="Our journey" title="Six decades, one story." />
        <ol className="mt-10 relative border-l border-border ml-2">
          {milestones.map((m) => (
            <li key={m.year} className="ml-6 mb-8 last:mb-0">
              <span className="absolute -left-[7px] mt-2 h-3.5 w-3.5 rounded-full bg-accent ring-4 ring-background" />
              <div className="font-display text-2xl text-ink">{m.year}</div>
              <p className="mt-1 text-ink-muted">{m.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-surface-elevated border-t border-border">
        <div className="mx-auto max-w-3xl px-6 lg:px-10 py-20 md:py-28">
          <SectionHeading eyebrow="What we believe" title="Historic, hopeful, and grounded." />
          <ul className="mt-8 space-y-4 text-lg text-ink-muted leading-relaxed">
            {[
              "The Bible is God's inspired and authoritative word.",
              "Jesus Christ is fully God and fully human, crucified and risen.",
              "Salvation is by grace through faith, not by works.",
              "The Holy Spirit indwells and empowers every believer.",
              "The church is the gathered, sent people of God.",
            ].map((b) => (
              <li key={b} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" /> {b}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
