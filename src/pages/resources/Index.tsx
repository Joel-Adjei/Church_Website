import { useState } from "react";
import { useList } from "@/services/queries";
import { Seo } from "@/components/Seo";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Shirt,
  ShoppingBasket,
  Cpu,
  FileText,
  Package,
  Search,
  MapPin,
  Mail,
  Phone,
  Tag,
  CheckCircle,
  AlertCircle,
  XCircle,
  Star,
  Loader2,
} from "lucide-react";
import type { Resource, ResourceCategory } from "@/types";
import { cn } from "@/utils/utils";
import heroImg from "@/assets/img_03.jpg";

const CATEGORIES: { value: ResourceCategory | "all"; label: string; icon: React.ElementType }[] = [
  { value: "all", label: "All", icon: Package },
  { value: "books", label: "Books", icon: BookOpen },
  { value: "clothing", label: "Clothing", icon: Shirt },
  { value: "food", label: "Food", icon: ShoppingBasket },
  { value: "equipment", label: "Equipment", icon: Cpu },
  { value: "stationery", label: "Stationery", icon: FileText },
  { value: "other", label: "Other", icon: Package },
];

const CATEGORY_COLORS: Record<ResourceCategory, string> = {
  books: "bg-amber-100 text-amber-700 border-amber-200",
  clothing: "bg-pink-100 text-pink-700 border-pink-200",
  food: "bg-emerald-100 text-emerald-700 border-emerald-200",
  equipment: "bg-blue-100 text-blue-700 border-blue-200",
  digital: "bg-purple-100 text-purple-700 border-purple-200",
  stationery: "bg-orange-100 text-orange-700 border-orange-200",
  other: "bg-secondary text-ink-muted border-border",
};

const CATEGORY_ICONS: Record<ResourceCategory, React.ElementType> = {
  books: BookOpen,
  clothing: Shirt,
  food: ShoppingBasket,
  equipment: Cpu,
  digital: FileText,
  stationery: FileText,
  other: Package,
};

const AVAILABILITY_META = {
  available: {
    label: "Available",
    icon: CheckCircle,
    className: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  limited: {
    label: "Limited",
    icon: AlertCircle,
    className: "text-amber-600 bg-amber-50 border-amber-200",
  },
  claimed: {
    label: "Claimed",
    icon: XCircle,
    className: "text-ink-muted bg-secondary border-border",
  },
};

const CONDITION_LABELS: Record<string, string> = {
  new: "New",
  "like-new": "Like New",
  good: "Good",
  fair: "Fair",
};

function ResourceCard({ resource }: { resource: Resource }) {
  const avail = AVAILABILITY_META[resource.availability];
  const AvailIcon = avail.icon;
  const CatIcon = CATEGORY_ICONS[resource.category];
  const catColor = CATEGORY_COLORS[resource.category];
  const isClaimed = resource.availability === "claimed";

  return (
    <div
      className={cn(
        "group bg-card border border-border rounded-2xl overflow-hidden shadow-card transition-all duration-300",
        "hover:shadow-elevated hover:-translate-y-0.5",
        isClaimed && "opacity-60",
      )}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
        {resource.imageUrl ? (
          <img
            src={resource.imageUrl}
            alt={resource.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CatIcon className="h-12 w-12 text-ink-muted/30" />
          </div>
        )}
        {/* Featured badge */}
        {resource.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-full shadow-sm">
            <Star className="h-3 w-3" /> Featured
          </div>
        )}
        {/* Availability overlay */}
        <div
          className={cn(
            "absolute top-3 right-3 flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border",
            avail.className,
          )}
        >
          <AvailIcon className="h-3 w-3" /> {avail.label}
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3">
        {/* Category + condition */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border",
              catColor,
            )}
          >
            <CatIcon className="h-3 w-3" />
            {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
          </span>
          <span className="text-xs text-ink-muted border border-border rounded-full px-2.5 py-1">
            {CONDITION_LABELS[resource.condition]}
          </span>
          {resource.quantity !== undefined && (
            <span className="text-xs text-ink-muted flex items-center gap-1">
              <Tag className="h-3 w-3" /> Qty: {resource.quantity}
            </span>
          )}
        </div>

        {/* Title + description */}
        <div>
          <h3 className="font-display text-lg text-ink leading-snug group-hover:text-primary transition-colors">
            {resource.title}
          </h3>
          <p className="text-sm text-ink-muted mt-1.5 leading-relaxed line-clamp-3">
            {resource.description}
          </p>
        </div>

        {/* Pickup + contact */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          {resource.pickupLocation && (
            <div className="flex items-start gap-2 text-xs text-ink-muted">
              <MapPin className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
              <span>{resource.pickupLocation}</span>
            </div>
          )}
          {resource.contactEmail && (
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <Mail className="h-3.5 w-3.5 text-accent shrink-0" />
              <a
                href={`mailto:${resource.contactEmail}`}
                className="hover:underline hover:text-ink"
              >
                {resource.contactEmail}
              </a>
            </div>
          )}
          {resource.contactPhone && (
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <Phone className="h-3.5 w-3.5 text-accent shrink-0" />
              <span>{resource.contactPhone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResourcesIndex() {
  const { data: resources = [], isLoading } = useList("resources");
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = resources.filter((r) => {
    const matchesCategory = activeCategory === "all" || r.category === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch =
      !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const featured = filtered.filter((r) => r.featured && r.availability !== "claimed");
  const rest = filtered.filter((r) => !(r.featured && r.availability !== "claimed"));

  return (
    <>
      <Seo
        title="Resources"
        description="Browse books, equipment, and other resources shared by the Grace Cathedral community."
      />
      {/* Hero */}
      <section className="relative h-[400px] flex items-end overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/55 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-20 z-20 w-full">
          <SectionHeading
            eyebrow="Church Resources"
            title="Share. Give. Receive."
            titleColor="white"
            description="Browse books, clothing, food, equipment and more — freely shared by our church family."
          />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12 md:py-16 space-y-10">
        {/* Search + Category filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <Input
              placeholder="Search resources…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant={activeCategory === value ? "default" : "outline"}
                size="sm"
                className="gap-1.5"
                onClick={() => setActiveCategory(value)}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </Button>
            ))}
          </div>
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

        {/* Featured */}
        {featured.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <Star className="h-4 w-4 text-accent" />
              <h2 className="font-display text-xl text-ink">Featured Resources</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featured.map((r) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
            </div>
          </section>
        )}

        {/* Rest */}
        {rest.length > 0 && (
          <section>
            {featured.length > 0 && (
              <h2 className="font-display text-xl text-ink mb-5">All Resources</h2>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rest.map((r) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="rounded-2xl bg-linear-to-br from-primary to-primary/80 text-primary-foreground p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="font-display text-2xl mb-2">Have something to donate?</h3>
            <p className="text-primary-foreground/80 text-sm">
              Your unused books, clothing, or equipment could be a blessing to another member of our
              church family.
            </p>
          </div>
          <a
            href="/contact"
            className="shrink-0 inline-flex items-center gap-2 bg-white text-primary font-medium text-sm px-6 py-3 rounded-xl hover:bg-white/90 transition-colors"
          >
            Contact us to donate
          </a>
        </div>
      </div>
    </>
  );
}
