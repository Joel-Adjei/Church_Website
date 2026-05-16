import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateLiveStream, useUpdateLiveStream } from "@/services/queries";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import type { LiveStream } from "@/types";

const schema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  stream_link: z.string().trim().min(1, "Stream link is required").max(500),
  status: z.string().min(1, "Status is required"),
  date: z.string().min(1, "Date is required"),
});
type Values = z.infer<typeof schema>;

const STATUSES = [
  { value: "live", label: "Live" },
  { value: "past", label: "Ended" },
];

export function LiveStreamForm({ initial, mode }: { initial?: LiveStream; mode: "new" | "edit" }) {
  const navigate = useNavigate();
  const create = useCreateLiveStream();
  const update = useUpdateLiveStream();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          title: initial.title,
          description: initial.description ?? "",
          stream_link: initial.stream_link,
          status: initial.status,
          date: initial.date.slice(0, 16),
        }
      : {
          title: "",
          description: "",
          stream_link: "",
          status: "offline",
          date: new Date().toISOString().slice(0, 16),
        },
  });

  async function onSubmit(values: Values) {
    const payload = {
      title: values.title,
      description: values.description || "",
      stream_link: values.stream_link,
      status: values.status,
      date: values.date,
    };
    try {
      if (mode === "new") {
        await create.mutateAsync(payload);
        toast.success("Live stream created");
      } else if (initial) {
        await update.mutateAsync({ id: initial.id, ...payload });
        toast.success("Live stream updated");
      }
      navigate("/admin/live");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1.5 mb-4">
        <Link to="/admin/live">
          <ArrowLeft className="h-4 w-4" /> Live streams
        </Link>
      </Button>
      <h1 className="font-display text-3xl text-ink mb-8">
        {mode === "new" ? "New live stream" : "Edit live stream"}
      </h1>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 max-w-2xl bg-background border border-border rounded-2xl p-6"
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="e.g. Sunday Morning Service" {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={3} {...form.register("description")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stream_link">Stream embed URL</Label>
          <Input
            id="stream_link"
            placeholder="https://www.youtube.com/embed/…"
            {...form.register("stream_link")}
          />
          {form.formState.errors.stream_link && (
            <p className="text-xs text-destructive">{form.formState.errors.stream_link.message}</p>
          )}
          <p className="text-xs text-ink-muted">Use the embed URL (not the share link).</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.watch("status")} onValueChange={(v) => form.setValue("status", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.status && (
              <p className="text-xs text-destructive">{form.formState.errors.status.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date & time</Label>
            <Input id="date" type="datetime-local" {...form.register("date")} />
            {form.formState.errors.date && (
              <p className="text-xs text-destructive">{form.formState.errors.date.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t border-border">
          <Button type="button" variant="outline" asChild>
            <Link to="/admin/live">Cancel</Link>
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
