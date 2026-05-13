import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreate, useUpdate } from "@/services/queries";
import { slugify } from "@/store/store";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import type { Announcement } from "@/types";

const schema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(200).regex(/^[a-z0-9-]+$/, "Lowercase, numbers, hyphens only"),
  body: z.string().trim().min(2).max(8000),
  imageUrl: z.string().trim().url().or(z.literal("")).optional(),
  publishAt: z.string().min(1, "Date required"),
});
type Values = z.infer<typeof schema>;

export function AnnouncementForm({ initial, mode }: { initial?: Announcement; mode: "new" | "edit" }) {
  const navigate = useNavigate();
  const create = useCreate("announcements");
  const update = useUpdate("announcements");
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? { ...initial, imageUrl: initial.imageUrl ?? "" }
      : { title: "", slug: "", body: "", imageUrl: "", publishAt: new Date().toISOString().slice(0, 10) },
  });

  async function onSubmit(values: Values) {
    const payload = { ...values, imageUrl: values.imageUrl || undefined };
    try {
      if (mode === "new") await create.mutateAsync(payload);
      else if (initial) await update.mutateAsync({ id: initial.id, ...payload });
      toast.success(mode === "new" ? "Announcement created" : "Announcement updated");
      navigate("/admin/announcements");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Save failed"); }
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1.5 mb-4">
        <Link to="/admin/announcements"><ArrowLeft className="h-4 w-4" /> Announcements</Link>
      </Button>
      <h1 className="font-display text-3xl text-ink mb-8">{mode === "new" ? "New announcement" : "Edit announcement"}</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 max-w-2xl bg-background border border-border rounded-2xl p-6" noValidate>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...form.register("title", { onChange: (e) => { if (mode === "new" && !form.getValues("slug")) form.setValue("slug", slugify(e.target.value)); } })} />
          {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...form.register("slug")} />
          {form.formState.errors.slug && <p className="text-xs text-destructive">{form.formState.errors.slug.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="publishAt">Publish date</Label>
          <Input id="publishAt" type="date" {...form.register("publishAt")} />
          {form.formState.errors.publishAt && <p className="text-xs text-destructive">{form.formState.errors.publishAt.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL (optional)</Label>
          <Input id="imageUrl" type="url" {...form.register("imageUrl")} />
          {form.formState.errors.imageUrl && <p className="text-xs text-destructive">{form.formState.errors.imageUrl.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="body">Body</Label>
          <Textarea id="body" rows={8} {...form.register("body")} />
          {form.formState.errors.body && <p className="text-xs text-destructive">{form.formState.errors.body.message}</p>}
        </div>
        <div className="flex gap-2 justify-end pt-2 border-t border-border">
          <Button type="button" variant="outline" asChild><Link to="/admin/announcements">Cancel</Link></Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Saving…" : "Save"}</Button>
        </div>
      </form>
    </div>
  );
}
