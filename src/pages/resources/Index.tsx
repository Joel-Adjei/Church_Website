import { useState } from "react";
import { Link } from "react-router-dom";
import { useResources } from "@/services/queries";
import { Seo } from "@/components/Seo";
import { SectionHeading } from "@/components/SectionHeading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Package, ArrowRight, Loader2, ExternalLink } from "lucide-react";
import heroImg from "@/assets/img_03.jpg";

export default function ResourcesIndex() {
  const { data: resources = [], isLoading } = useResources();
  const [search, setSearch] = useState("");

  const filtered = resources.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return r.name.toLowerCase().includes(q) || (r.description ?? "").toLowerCase().includes(q);
  });

  return (
    <>
      <Seo
        title="Resources"
        description="Browse books, materials, and other resources shared by the Grace Cathedral community."
      />

      <section className="relative h-100 flex items-end overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/55 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-20 z-20 w-full">
          <SectionHeading
            eyebrow="Church Resources"
            title="Resources for the Community"
            titleColor="white"
            description="Books, materials, and more — available to our church family."
          />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12 md:py-16 space-y-10">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
          <Input
            placeholder="Search resources…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-ink-muted">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading resources…</p>
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20">
            <Package className="h-12 w-12 text-ink-muted/30 mx-auto mb-3" />
            <p className="text-ink-muted">No resources found{search ? ` for "${search}"` : ""}.</p>
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((r) => (
              <Link
                key={r.id}
                to={`/resources/${r.id}`}
                className="group bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
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
                      <Package className="h-12 w-12 text-ink-muted/30" />
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div>
                    <h3 className="font-display text-lg text-ink leading-snug group-hover:text-primary transition-colors">
                      {r.name}
                    </h3>
                    {r.description && (
                      <p className="text-sm text-ink-muted mt-1.5 leading-relaxed line-clamp-2">
                        {r.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-sm font-semibold text-accent">{r.price}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted group-hover:text-primary transition-colors">
                      View <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="rounded-2xl bg-linear-to-br from-primary to-primary/80 text-primary-foreground p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="font-display text-2xl mb-2">Have something to contribute?</h3>
            <p className="text-primary-foreground/80 text-sm">
              Share a resource with the Grace Cathedral community. Contact us to get it listed.
            </p>
          </div>
          <Link
            to="/contact"
            className="shrink-0 inline-flex items-center gap-2 bg-white text-primary font-medium text-sm px-6 py-3 rounded-xl hover:bg-white/90 transition-colors"
          >
            Contact us <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
