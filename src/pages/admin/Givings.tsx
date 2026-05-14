import { useState } from "react";
import { useGivings, useDeleteGiving } from "@/services/queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { Search, TrendingUp, Heart, Globe, Building2, Users, Gift, HandCoins } from "lucide-react";
import type { GivingCategory } from "@/types";
import { cn } from "@/utils/utils";

const CATEGORY_META: Record<
  GivingCategory,
  { label: string; icon: React.ElementType; color: string }
> = {
  tithe: { label: "Tithe", icon: Heart, color: "text-rose-500" },
  offering: { label: "General Offering", icon: HandCoins, color: "text-amber-500" },
  missions: { label: "Missions", icon: Globe, color: "text-blue-500" },
  "building-fund": { label: "Building Fund", icon: Building2, color: "text-emerald-500" },
  benevolence: { label: "Benevolence", icon: Users, color: "text-purple-500" },
  other: { label: "Other", icon: Gift, color: "text-ink-muted" },
};

export default function Givings() {
  const { data: givings = [], isLoading } = useGivings();
  const remove = useDeleteGiving();
  const [search, setSearch] = useState("");

  const filtered = givings.filter((g) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const name = g.name.toLowerCase();
    return name.includes(q) || g.category.includes(q);
  });

  const totalCompleted = givings
    .filter((g) => g.status === "completed")
    .reduce((sum, g) => sum + g.amount, 0);
  const totalCount = givings.filter((g) => g.status === "completed").length;

  const categoryTotals = givings
    .filter((g) => g.status === "completed")
    .reduce<Record<string, number>>((acc, g) => {
      acc[g.category] = (acc[g.category] ?? 0) + g.amount;
      return acc;
    }, {});

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Givings"
        description="All donations and offerings submitted by members."
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-background border border-border rounded-2xl p`-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-display text-ink">₵{totalCompleted.toLocaleString()}</div>
            <div className="text-xs text-ink-muted mt-0.5">Total received</div>
          </div>
        </div>
        <div className="bg-background border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-display text-ink">{totalCount}</div>
            <div className="text-xs text-ink-muted mt-0.5">Completed gifts</div>
          </div>
        </div>
        <div className="bg-background border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <HandCoins className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <div className="text-2xl font-display text-ink capitalize">
              {topCategory
                ? (CATEGORY_META[topCategory[0] as GivingCategory]?.label ?? topCategory[0])
                : "—"}
            </div>
            <div className="text-xs text-ink-muted mt-0.5">Top category</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
        <Input
          placeholder="Search by name, email, category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="bg-background border border-border rounded-2xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-ink-muted">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {!isLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-ink-muted">
                  {search ? "No results match your search." : "No givings recorded yet."}
                </TableCell>
              </TableRow>
            )}
            {filtered.map((g) => {
              const meta = CATEGORY_META[g.category];
              const Icon = meta.icon;
              const donorName = g.anonymous ? "Anonymous" : g.name;
              return (
                <TableRow key={g.id}>
                  <TableCell>
                    <div className="font-medium text-ink">{donorName}</div>
                    {!g.anonymous && <div className="text-xs text-ink-muted">{g.email}</div>}
                    {g.message && (
                      <div className="text-xs text-ink-muted mt-0.5 italic max-w-[200px] truncate">
                        "{g.message}"
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold text-ink">
                    ₵{g.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Icon className={cn("h-3.5 w-3.5 shrink-0", meta.color)} />
                      <span className="text-sm">{meta.label}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-ink-muted whitespace-nowrap text-sm">
                    {format(parseISO(g.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DeleteConfirm
                      title={`Remove this giving record?`}
                      onConfirm={async () => {
                        await remove.mutateAsync(g.id);
                        toast.success("Giving record removed");
                      }}
                    />
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
