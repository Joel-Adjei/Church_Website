import { Link, useParams } from "react-router-dom";
import { useResourceById, useResources } from "@/services/queries";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, ExternalLink, Tag } from "lucide-react";

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: resource, isLoading, error } = useResourceById(id);
  const { data: all = [] } = useResources();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <Package className="h-12 w-12 text-ink-muted/30 mx-auto mb-4" />
        <h1 className="font-display text-2xl text-ink mb-2">Resource not found</h1>
        <p className="text-ink-muted mb-6">This resource may have been removed or is no longer available.</p>
        <Button asChild variant="outline">
          <Link to="/resources"><ArrowLeft className="h-4 w-4 mr-1.5" /> Back to resources</Link>
        </Button>
      </div>
    );
  }

  const related = all.filter((r) => r.id !== resource.id).slice(0, 3);

  return (
    <>
      <Seo
        title={resource.name}
        description={resource.description ?? `${resource.name} — available from Grace Cathedral.`}
        image={resource.image}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary min-h-80 flex items-end">
        {resource.image && (
          <img
            src={resource.image}
            alt={resource.name}
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/80 to-primary/30" />
        <div className="relative mx-auto max-w-5xl w-full px-6 lg:px-10 py-16 z-10">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-3 gap-1.5 text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 mb-6"
          >
            <Link to="/resources"><ArrowLeft className="h-4 w-4" /> All resources</Link>
          </Button>
          <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <Tag className="h-3.5 w-3.5" /> {resource.price}
          </div>
          <h1 className="font-display text-4xl md:text-6xl text-primary-foreground leading-[1.05]">
            {resource.name}
          </h1>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-6 lg:px-10 py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16 items-start">
          {/* Left: image + description */}
          <div>
            {resource.image && (
              <div className="rounded-2xl overflow-hidden shadow-elevated mb-8">
                <img
                  src={resource.image}
                  alt={resource.name}
                  className="w-full object-cover max-h-96"
                />
              </div>
            )}
            {resource.description ? (
              <div className="prose prose-lg max-w-none text-ink leading-relaxed whitespace-pre-line">
                {resource.description}
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-border py-16 text-ink-muted">
                <Package className="h-10 w-10 opacity-30" />
              </div>
            )}
          </div>

          {/* Right: sticky action card */}
          <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-border bg-card shadow-card p-6 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-ink-muted font-semibold mb-1">Price</p>
                <p className="font-display text-3xl text-ink">{resource.price}</p>
              </div>

              <div className="border-t border-border pt-5 space-y-3">
                <a
                  href={resource.purchase_link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground font-medium text-sm px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Get this resource <ExternalLink className="h-4 w-4" />
                </a>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/contact">Ask the church</Link>
                </Button>
              </div>

              <div className="border-t border-border pt-4 text-xs text-ink-muted leading-relaxed">
                This resource is shared by Grace Cathedral. Contact us if you have any questions.
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-border">
            <h2 className="font-display text-3xl text-ink mb-8">More resources</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/resources/${r.id}`}
                  className="group block bg-card border border-border rounded-2xl overflow-hidden hover:shadow-card transition-shadow"
                >
                  <div className="aspect-4/3 overflow-hidden bg-secondary">
                    {r.image ? (
                      <img
                        src={r.image}
                        alt={r.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-ink-muted/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg text-ink group-hover:text-primary transition-colors leading-snug">
                      {r.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-accent">{r.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
