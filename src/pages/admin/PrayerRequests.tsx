import { useState } from "react";
import {
  usePrayerRequests,
  useUpdatePrayerRequest,
  useDeletePrayerRequest,
} from "@/services/queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import {
  Search,
  Heart,
  ShieldCheck,
  EyeOff,
  Globe,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  BookMarked,
  TrendingUp,
  MessageSquare,
  Phone,
  Mail,
} from "lucide-react";
import type { PrayerCategory, PrayerPrivacy, PrayerRequest, PrayerStatus } from "@/types";
import { cn } from "@/utils/utils";

const CATEGORY_META: Record<PrayerCategory, { label: string; color: string }> = {
  healing: { label: "Healing", color: "text-rose-500" },
  family: { label: "Family", color: "text-amber-500" },
  finances: { label: "Finances", color: "text-emerald-500" },
  guidance: { label: "Guidance", color: "text-blue-500" },
  salvation: { label: "Salvation", color: "text-purple-500" },
  relationships: { label: "Relationships", color: "text-pink-500" },
  thanksgiving: { label: "Thanksgiving", color: "text-orange-500" },
  other: { label: "Other", color: "text-ink-muted" },
};

const PRIVACY_META: Record<
  PrayerPrivacy,
  { label: string; icon: React.ElementType; color: string }
> = {
  public: { label: "Public", icon: Globe, color: "text-blue-500" },
  private: { label: "Private", icon: ShieldCheck, color: "text-emerald-500" },
  anonymous: { label: "Anonymous", icon: EyeOff, color: "text-ink-muted" },
};

const STATUS_META: Record<
  PrayerStatus,
  { label: string; icon: React.ElementType; variant: "default" | "secondary" | "outline" }
> = {
  new: { label: "New", icon: Sparkles, variant: "secondary" },
  praying: { label: "Praying", icon: Clock, variant: "default" },
  answered: { label: "Answered", icon: CheckCircle2, variant: "outline" },
};

function DetailDialog({ request, onClose }: { request: PrayerRequest; onClose: () => void }) {
  const update = useUpdatePrayerRequest();
  const [note, setNote] = useState(request.adminNote ?? "");

  const setStatus = async (status: PrayerStatus) => {
    await update.mutateAsync({ id: request.id, status });
    toast.success(`Status updated to "${STATUS_META[status].label}"`);
    onClose();
  };

  const saveNote = async () => {
    await update.mutateAsync({ id: request.id, adminNote: note });
    toast.success("Note saved");
    onClose();
  };

  const privacyMeta = PRIVACY_META[request.privacy];
  const PrivacyIcon = privacyMeta.icon;

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="font-display text-xl">{request.subject}</DialogTitle>
      </DialogHeader>

      <div className="space-y-5 mt-2">
        {/* Requester */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-elevated border border-border">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-display text-sm">
            {request.privacy === "anonymous" ? "?" : (request.firstName[0] ?? "?").toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-ink">
              {request.privacy === "anonymous"
                ? "Anonymous"
                : `${request.firstName} ${request.lastName}`.trim()}
            </div>
            {request.privacy !== "anonymous" && (
              <div className="flex flex-wrap gap-3 mt-1 text-xs text-ink-muted">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {request.email}
                </span>
                {request.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {request.phone}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs">
            <PrivacyIcon className={cn("h-3.5 w-3.5", privacyMeta.color)} />
            <span className="text-ink-muted">{privacyMeta.label}</span>
          </div>
        </div>

        {/* Request text */}
        <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
          <p className="text-sm text-ink leading-relaxed italic">"{request.request}"</p>
        </div>
      </div>
    </DialogContent>
  );
}

export default function PrayerRequests() {
  const { data: requests = [], isLoading } = usePrayerRequests();
  const remove = useDeletePrayerRequest();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PrayerStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<PrayerCategory | "all">("all");
  const [selected, setSelected] = useState<PrayerRequest | null>(null);

  const filtered = requests.filter((r) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.subject.toLowerCase().includes(q) ||
      r.request.toLowerCase().includes(q) ||
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const total = requests.length;
  const newCount = requests.filter((r) => r.status === "new").length;
  const prayingCount = requests.filter((r) => r.status === "praying").length;
  const answeredCount = requests.filter((r) => r.status === "answered").length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Prayer Requests"
        description="All prayer requests submitted by members and visitors."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total requests",
            value: total,
            icon: Heart,
            color: "bg-rose-100 text-rose-600",
          },
          { label: "New", value: newCount, icon: Sparkles, color: "bg-amber-100 text-amber-600" },
          {
            label: "Being prayed for",
            value: prayingCount,
            icon: Users,
            color: "bg-blue-100 text-blue-600",
          },
          {
            label: "Answered",
            value: answeredCount,
            icon: TrendingUp,
            color: "bg-emerald-100 text-emerald-600",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-background border border-border rounded-2xl p-5 flex items-center gap-4"
            >
              <div
                className={cn(
                  "h-11 w-11 rounded-full flex items-center justify-center shrink-0",
                  stat.color,
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-display text-ink">{stat.value}</div>
                <div className="text-xs text-ink-muted mt-0.5">{stat.label}</div>
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
            placeholder="Search requests…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-56"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as PrayerStatus | "all")}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="praying">Praying</SelectItem>
            <SelectItem value="answered">Answered</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={categoryFilter}
          onValueChange={(v) => setCategoryFilter(v as PrayerCategory | "all")}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {(Object.keys(CATEGORY_META) as PrayerCategory[]).map((c) => (
              <SelectItem key={c} value={c}>
                {CATEGORY_META[c].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cards grid */}
      {isLoading && (
        <div className="text-center py-20 text-ink-muted">Loading prayer requests…</div>
      )}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-20 text-ink-muted">
          {search || statusFilter !== "all" || categoryFilter !== "all"
            ? "No requests match your filters."
            : "No prayer requests yet."}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((r) => {
          const statusMeta = STATUS_META[r.status];
          const StatusIcon = statusMeta.icon;
          const privacyMeta = PRIVACY_META[r.privacy];
          const PrivacyIcon = privacyMeta.icon;

          return (
            <div
              key={r.id}
              className="group bg-card border border-border rounded-2xl p-5 shadow-card hover:shadow-elevated transition-shadow flex flex-col gap-4"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-ink leading-snug line-clamp-2">{r.subject}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-ink-muted text-xs">·</span>
                    <span className="text-xs text-ink-muted">
                      {format(parseISO(r.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <p className="text-sm text-ink-muted line-clamp-3 leading-relaxed flex-1">
                {r.request}
              </p>

              {/* Requester + privacy */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                    {r.privacy === "anonymous" ? "?" : (r.firstName[0] ?? "?").toUpperCase()}
                  </div>
                  <span className="text-sm text-ink-muted">
                    {r.privacy === "anonymous"
                      ? "Anonymous"
                      : `${r.firstName} ${r.lastName}`.trim()}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-ink-muted">
                  <PrivacyIcon className={cn("h-3.5 w-3.5", privacyMeta.color)} />
                  {privacyMeta.label}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 -mb-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5 text-xs"
                  onClick={() => setSelected(r)}
                >
                  <BookMarked className="h-3.5 w-3.5" /> View
                </Button>
                <DeleteConfirm
                  title="Remove this prayer request?"
                  onConfirm={async () => {
                    await remove.mutateAsync(r.id);
                    toast.success("Prayer request removed");
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail dialog */}
      {selected && (
        <Dialog
          open={!!selected}
          onOpenChange={(open) => {
            if (!open) setSelected(null);
          }}
        >
          <DetailDialog request={selected} onClose={() => setSelected(null)} />
        </Dialog>
      )}
    </div>
  );
}
