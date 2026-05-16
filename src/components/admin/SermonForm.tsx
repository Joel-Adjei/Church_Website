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
import { useCreateSermon, useUpdateSermon, useSeries } from "@/services/queries";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import type { Sermon } from "@/types";

const schema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200),
  preacher: z.string().trim().min(2, "Preacher is required").max(120),
  description: z.string().trim().min(10, "Description is too short").max(4000),
  series: z.string().optional(),
  video_link: z.string().trim().url("Must be a valid YouTube URL").or(z.literal("")),
  podcast_link: z.string().trim().url("Must be a valid URL").or(z.literal("")).optional(),
});
export type SermonFormValues = z.infer<typeof schema>;

export function SermonForm({ initial, mode }: { initial?: Sermon; mode: "new" | "edit" }) {
  const navigate = useNavigate();
  const { data: series = [] } = useSeries();
  const create = useCreateSermon();
  const update = useUpdateSermon();

  const form = useForm<SermonFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          title: initial.title,
          preacher: initial.preacher,
          description: initial.description,
          series: initial.series ?? "none",
          video_link: initial.video_link,
          podcast_link: initial.podcast_link ?? "",
        }
      : {
          title: "",
          preacher: "",
          description: "",
          series: "none",
          video_link: "",
          podcast_link: "",
        },
  });

  async function onSubmit(values: SermonFormValues) {
    const payload = {
      ...values,
      series: values.series === "none" ? null : (values.series ?? null),
      podcast_link: values.podcast_link ?? "",
    };
    try {
      if (mode === "new") {
        await create.mutateAsync(payload);
        toast.success("Sermon created");
      } else if (initial) {
        await update.mutateAsync({ id: initial.id, ...payload });
        toast.success("Sermon updated");
      }
      navigate("/admin/sermons");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1.5 mb-4">
        <Link to="/admin/sermons">
          <ArrowLeft className="h-4 w-4" /> Sermons
        </Link>
      </Button>
      <h1 className="font-display text-3xl text-ink mb-8">
        {mode === "new" ? "New sermon" : "Edit sermon"}
      </h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 max-w-2xl bg-background border border-border rounded-2xl p-6"
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
          )}
        </div>
        <div className="">
          <div className="space-y-2">
            <Label htmlFor="preacher">Preacher</Label>
            <Input id="preacher" {...form.register("preacher")} />
            {form.formState.errors.preacher && (
              <p className="text-xs text-destructive">{form.formState.errors.preacher.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="series">Series</Label>
          <Select value={form.watch("series")} onValueChange={(v) => form.setValue("series", v)}>
            <SelectTrigger id="series">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No series</SelectItem>
              {series.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="video_link">Video Link</Label>
          <Input
            id="video_link"
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            {...form.register("video_link")}
          />
          {form.formState.errors.video_link && (
            <p className="text-xs text-destructive">{form.formState.errors.video_link.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="podcast_link">
            Podcast Link <span className="text-ink-muted font-normal">(optional)</span>
          </Label>
          <Input
            id="podcast_link"
            type="url"
            placeholder="https://..."
            {...form.register("podcast_link")}
          />
          {form.formState.errors.podcast_link && (
            <p className="text-xs text-destructive">{form.formState.errors.podcast_link.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={6} {...form.register("description")} />
          {form.formState.errors.description && (
            <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
          )}
        </div>
        <div className="flex gap-2 justify-end pt-2 border-t border-border">
          <Button type="button" variant="outline" asChild>
            <Link to="/admin/sermons">Cancel</Link>
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
