import { useState } from "react";
import { usePrayerRequests, useDeletePrayerRequest } from "@/services/queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { Search, Heart, BookMarked, Phone, User2 } from "lucide-react";
import type { PrayerRequest } from "@/types";
import { cn } from "@/utils/utils";

function DetailDialog({ request, onClose }: { request: PrayerRequest; onClose: () => void }) {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="font-display text-xl">{request.subject}</DialogTitle>
      </DialogHeader>

      <div className="space-y-5 mt-2">
        {/* Requester */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-elevated border border-border">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-display text-sm">
            {request.name === "Anonymous" ? "?" : (request?.name[0] ?? "?").toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-ink">
              {request.name === "Anonymous" ? "Anonymous" : request.name.trim()}
            </div>
            {request.name !== "Anonymous" && (
              <div className="flex flex-wrap gap-3 mt-1 text-xs text-ink-muted">
                {request.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {request.phone}
                  </span>
                )}
              </div>
            )}
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
  const [selected, setSelected] = useState<PrayerRequest | null>(null);

  const filtered = requests.filter((r) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.subject.toLowerCase().includes(q) ||
      r.request?.toLowerCase().includes(q) ||
      r.name.toLowerCase().includes(q);
    return matchesSearch;
  });

  const total = requests.length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Prayer Requests"
        description="All prayer requests submitted by members and visitors."
      />

      {/* Stats */}
      <div className="bg-muted/50 border-l-4 border-border">
        <div className=" p-5 flex items-center gap-2">
          <div className="text-lg  text-ink-muted mt-0.5">Total requests:</div>
          <div className="text-2xl text-ink">{total}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex w-full gap-3">
        <div className="w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
          <Input
            placeholder="Search requests…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
      </div>

      {/* Cards grid */}
      {isLoading && (
        <div className="text-center py-20 text-ink-muted">Loading prayer requests…</div>
      )}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-20 text-ink-muted">
          {search ? "No requests match your filters." : "No prayer requests yet."}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((r) => {
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
                      {format(parseISO(r.date || ""), "MMM d, yyyy")}
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
                    {r.name === "Anonymous" ? "?" : <User2 />}
                  </div>
                  <span className="text-sm text-ink-muted">
                    {r.name === "Anonymous" ? "Anonymous" : r.name.trim()}
                  </span>
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
