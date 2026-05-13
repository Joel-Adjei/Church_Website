import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLive, useUpdateLive } from "@/services/queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

const schema = z.object({
  isLive: z.boolean(),
  platform: z.enum(["youtube", "vimeo", "facebook", "custom"]),
  streamUrl: z.string().trim().url("Must be a valid URL"),
  nextService: z.string().trim().min(2, "Required"),
});
type Values = z.infer<typeof schema>;

export default function LiveStream() {
  const { data, isLoading } = useLive();
  const update = useUpdateLive();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { isLive: false, platform: "youtube", streamUrl: "", nextService: "" },
  });

  useEffect(() => { if (data) form.reset(data); }, [data, form]);

  async function onSubmit(values: Values) {
    try {
      await update.mutateAsync(values);
      toast.success(values.isLive ? "Stream is now live" : "Stream settings saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  if (isLoading) return <div className="text-ink-muted">Loading…</div>;

  const isLive = form.watch("isLive");

  return (
    <div>
      <AdminPageHeader title="Live stream" description="Control the live worship stream and the placeholder shown to visitors." />
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-background border border-border rounded-2xl p-6 max-w-2xl space-y-6" noValidate>
        <div className="flex items-center justify-between p-4 rounded-lg bg-surface-elevated border border-border">
          <div className="flex items-center gap-3">
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isLive ? "bg-destructive" : "bg-muted-foreground"}`}>
              {isLive && <span className="absolute inset-0 rounded-full bg-destructive animate-ping opacity-60" />}
            </span>
            <div>
              <Label htmlFor="isLive" className="cursor-pointer">Currently live</Label>
              <p className="text-xs text-ink-muted">Toggle on when a stream is active.</p>
            </div>
          </div>
          <Controller
            control={form.control}
            name="isLive"
            render={({ field }) => <Switch id="isLive" checked={field.value} onCheckedChange={field.onChange} />}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Controller
            control={form.control}
            name="platform"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="platform"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="vimeo">Vimeo</SelectItem>
                  <SelectItem value="facebook">Facebook Live</SelectItem>
                  <SelectItem value="custom">Custom embed</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="streamUrl">Stream embed URL</Label>
          <Input id="streamUrl" type="url" placeholder="https://www.youtube.com/embed/…" {...form.register("streamUrl")} />
          {form.formState.errors.streamUrl && <p className="text-xs text-destructive">{form.formState.errors.streamUrl.message}</p>}
          <p className="text-xs text-ink-muted">Use the embed URL, not the share link.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nextService">Next service label</Label>
          <Input id="nextService" placeholder="e.g. Sunday at 9:00 AM" {...form.register("nextService")} />
          {form.formState.errors.nextService && <p className="text-xs text-destructive">{form.formState.errors.nextService.message}</p>}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <a href="/live" target="_blank" rel="noreferrer" className="text-sm text-ink-muted hover:text-primary inline-flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5" /> Preview public page
          </a>
          <Button type="submit" disabled={form.formState.isSubmitting || update.isPending}>
            {form.formState.isSubmitting || update.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
