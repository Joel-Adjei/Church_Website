import { useState } from "react";
import { Link } from "react-router-dom";
import { useList, useRemove } from "@/services/queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
  Pencil, Search, Package, BookOpen, Shirt, ShoppingBasket, Cpu, FileText,
  CheckCircle, AlertCircle, XCircle, Star, TrendingUp,
} from "lucide-react";
import type { ResourceCategory } from "@/types";
import { cn } from "@/utils/utils";

const CATEGORY_ICONS: Record<ResourceCategory, React.ElementType> = {
  books: BookOpen, clothing: Shirt, food: ShoppingBasket,
  equipment: Cpu, digital: FileText, stationery: FileText, other: Package,
};

const CATEGORY_COLORS: Record<ResourceCategory, string> = {
  books: "text-amber-600 bg-amber-50",
  clothing: "text-pink-600 bg-pink-50",
  food: "text-emerald-600 bg-emerald-50",
  equipment: "text-blue-600 bg-blue-50",
  digital: "text-purple-600 bg-purple-50",
  stationery: "text-orange-600 bg-orange-50",
  other: "text-ink-muted bg-secondary",
};

const AVAILABILITY_META = {
  available: { label: "Available", icon: CheckCircle, className: "text-emerald-600" },
  limited: { label: "Limited", icon: AlertCircle, className: "text-amber-600" },
  claimed: { label: "Claimed", icon: XCircle, className: "text-ink-muted" },
};

const CONDITION_LABELS: Record<string, string> = {
  new: "New", "like-new": "Like New", good: "Good", fair: "Fair",
};

export default function Resources() {
  const { data = [], isLoading } = useList("resources");
  const remove = useRemove("resources");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ResourceCategory | "all">("all");
  const [availFilter, setAvailFilter] = useState<"available" | "limited" | "claimed" | "all">("all");

  const filtered = data.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    const matchCat = categoryFilter === "all" || r.category === categoryFilter;
    const matchAvail = availFilter === "all" || r.availability === availFilter;
    return matchSearch && matchCat && matchAvail;
  });

  const totalAvailable = data.filter((r) => r.availability === "available").length;
  const totalLimited = data.filter((r) => r.availability === "limited").length;
  const totalClaimed = data.filter((r) => r.availability === "claimed").length;
  const totalFeatured = data.filter((r) => r.featured).length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Resources"
        description="Books, clothing, food, equipment and more shared with the community."
        newHref="/admin/resources/new"
        newLabel="New resource"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Available", value: totalAvailable, icon: CheckCircle, color: "bg-emerald-100 text-emerald-600" },
          { label: "Limited", value: totalLimited, icon: AlertCircle, color: "bg-amber-100 text-amber-600" },
          { label: "Claimed", value: totalClaimed, icon: XCircle, color: "bg-secondary text-ink-muted" },
          { label: "Featured", value: totalFeatured, icon: Star, color: "bg-accent/20 text-accent" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-background border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className={cn("h-11 w-11 rounded-full flex items-center justify-center shrink-0", s.color)}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-display text-ink">{s.value}</div>
                <div className="text-xs text-ink-muted mt-0.5">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
          <Input
            placeholder="Search resources…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-56"
          />
        </div>
        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as ResourceCategory | "all")}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="books">Books</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="food">Food</SelectItem>
            <SelectItem value="equipment">Equipment</SelectItem>
            <SelectItem value="digital">Digital</SelectItem>
            <SelectItem value="stationery">Stationery</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={availFilter} onValueChange={(v) => setAvailFilter(v as typeof availFilter)}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Availability" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="limited">Limited</SelectItem>
            <SelectItem value="claimed">Claimed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-background border border-border rounded-2xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resource</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-ink-muted">Loading…</TableCell>
              </TableRow>
            )}
            {!isLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-ink-muted">
                  {search || categoryFilter !== "all" || availFilter !== "all"
                    ? "No resources match your filters."
                    : "No resources yet. Add one!"}
                </TableCell>
              </TableRow>
            )}
            {filtered.map((r) => {
              const CatIcon = CATEGORY_ICONS[r.category];
              const catColor = CATEGORY_COLORS[r.category];
              const avail = AVAILABILITY_META[r.availability];
              const AvailIcon = avail.icon;
              return (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {r.imageUrl ? (
                        <img src={r.imageUrl} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                          <CatIcon className="h-4 w-4 text-ink-muted" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-ink flex items-center gap-1.5">
                          {r.title}
                          {r.featured && <Star className="h-3.5 w-3.5 text-accent" />}
                        </div>
                        <div className="text-xs text-ink-muted line-clamp-1 max-w-[220px]">{r.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full", catColor)}>
                      <CatIcon className="h-3 w-3" />
                      {r.category.charAt(0).toUpperCase() + r.category.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-ink-muted">
                    {CONDITION_LABELS[r.condition]}
                  </TableCell>
                  <TableCell>
                    <div className={cn("flex items-center gap-1 text-sm font-medium", avail.className)}>
                      <AvailIcon className="h-3.5 w-3.5" /> {avail.label}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-ink-muted">
                    {r.quantity ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="sm" className="gap-1.5">
                        <Link to={`/admin/resources/${r.id}`}>
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Link>
                      </Button>
                      <DeleteConfirm
                        title={`Delete "${r.title}"?`}
                        onConfirm={async () => {
                          await remove.mutateAsync(r.id);
                          toast.success("Resource deleted");
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
