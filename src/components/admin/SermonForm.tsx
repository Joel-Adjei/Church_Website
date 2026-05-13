import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreate, useList, useUpdate } from "@/services/queries";
import { slugify } from "@/store/store";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import type { Sermon } from "@/types";
import { TitleSlugFields } from "./TitleSlugFields";

const schema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200),
  slug: z.string().trim().min(2, "Slug is required").max(200).regex(/^[a-z0-9-]+$/, "Lowercase, numbers, hyphens only"),
  speaker: z.string().trim().min(2, "Speaker is required").max(120),
  description: z.string().trim().min(10, "Description is too short").max(4000),
  sermonDate: z.string().min(1, "Date is required"),
  seriesId: z.string().optional(),
  youtubeId: z.string().trim().min(3, "YouTube ID required").max(40),
  thumbnailUrl: z.string().trim().url("Must be a valid URL"),
});
export type SermonFormValues = z.infer<typeof schema>;

export function SermonForm({ initial, mode }: { initial?: Sermon; mode: "new" | "edit" }) {
  const navigate = useNavigate();
  const { data: series = [] } = useList("series");
  const create = useCreate("sermons");
  const update = useUpdate("sermons");

  const form = useForm<SermonFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? { ...initial, seriesId: initial.seriesId ?? "none" }
      : { title: "", slug: "", speaker: "", description: "", sermonDate: new Date().toISOString().slice(0, 10), seriesId: "none", youtubeId: "", thumbnailUrl: "" },
  });

  async function onSubmit(values: SermonFormValues) {
    const payload = { ...values, seriesId: values.seriesId === "none" ? null : values.seriesId };
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
        <Link to="/admin/sermons"><ArrowLeft className="h-4 w-4" /> Sermons</Link>
      </Button>
      <h1 className="font-display text-3xl text-ink mb-8">{mode === "new" ? "New sermon" : "Edit sermon"}</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 max-w-2xl bg-background border border-border rounded-2xl p-6" noValidate>
        <TitleSlugFields form={form} mode={mode} titleField="title" slugField="slug" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="speaker">Speaker</Label>
            <Input id="speaker" {...form.register("speaker")} />
            {form.formState.errors.speaker && <p className="text-xs text-destructive">{form.formState.errors.speaker.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sermonDate">Date</Label>
            <Input id="sermonDate" type="date" {...form.register("sermonDate")} />
            {form.formState.errors.sermonDate && <p className="text-xs text-destructive">{form.formState.errors.sermonDate.message}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="seriesId">Series</Label>
          <Select value={form.watch("seriesId")} onValueChange={(v) => form.setValue("seriesId", v)}>
            <SelectTrigger id="seriesId"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No series</SelectItem>
              {series.map((s) => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="youtubeId">YouTube ID</Label>
            <Input id="youtubeId" placeholder="e.g. dQw4w9WgXcQ" {...form.register("youtubeId")} />
            {form.formState.errors.youtubeId && <p className="text-xs text-destructive">{form.formState.errors.youtubeId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
            <Input id="thumbnailUrl" type="url" {...form.register("thumbnailUrl")} />
            {form.formState.errors.thumbnailUrl && <p className="text-xs text-destructive">{form.formState.errors.thumbnailUrl.message}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={6} {...form.register("description")} />
          {form.formState.errors.description && <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>}
        </div>
        <div className="flex gap-2 justify-end pt-2 border-t border-border">
          <Button type="button" variant="outline" asChild><Link to="/admin/sermons">Cancel</Link></Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Saving…" : "Save"}</Button>
        </div>
      </form>
    </div>
  );
}
