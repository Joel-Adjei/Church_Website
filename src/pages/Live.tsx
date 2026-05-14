import { Radio, Calendar } from "lucide-react";
import { useLive, useSettings } from "@/services/queries";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";

export default function Live() {
  const { data: live } = useLive();
  const { data: settings } = useSettings();
  const isLive = live?.isLive ?? false;
  const streamUrl = live?.streamUrl ?? "";
  const serviceTimes = settings?.serviceTimes ?? [];

  return (
    <section className="mx-auto max-w-5xl px-6 lg:px-10 py-12 md:py-20">
      <Seo
        title="Watch Live"
        description="Join Grace Cathedral for live worship online. Watch our live stream or catch the next scheduled service."
      />
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-4">
          <Radio className="h-3.5 w-3.5" /> Live service
        </span>
        <h1 className="font-display text-4xl md:text-6xl text-ink leading-[1.05]">Worship with us</h1>
        <p className="mt-4 text-lg text-ink-muted">Wherever you are, you're part of this community.</p>
      </div>

      {isLive && streamUrl ? (
        <div>
          {live?.stream?.title && (
            <div className="mb-4 text-center">
              <h2 className="font-display text-2xl text-ink">{live.stream.title}</h2>
              {live.stream.description && <p className="mt-1 text-ink-muted">{live.stream.description}</p>}
            </div>
          )}
          <div className="aspect-video overflow-hidden rounded-2xl bg-primary shadow-elevated">
            <iframe src={streamUrl} className="h-full w-full" allow="autoplay; encrypted-media" allowFullScreen title="Live stream" />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-border bg-surface-elevated p-12 md:p-20 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-secondary inline-flex items-center justify-center mb-6">
            <Calendar className="h-7 w-7 text-primary" />
          </div>
          <h2 className="font-display text-3xl text-ink">We're not live right now</h2>
          <p className="mt-3 text-ink-muted">Join us on Sunday for our next service.</p>
          {serviceTimes.length > 0 && (
            <div className="mt-8 grid gap-3 max-w-md mx-auto text-left">
              {serviceTimes.map((s, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-card border border-border">
                  <Radio className="h-4 w-4 text-accent" />
                  <span className="text-sm text-ink">{s}</span>
                </div>
              ))}
            </div>
          )}
          <Button className="mt-8" onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      )}
    </section>
  );
}
