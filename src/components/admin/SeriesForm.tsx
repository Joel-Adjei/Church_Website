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
import type { SermonSeries } from "@/types";

const schema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(200).regex(/^[a-z0-9-]+$/, "Lowercase, numbers, hyphens only"),
  description: z.string().trim().min(2).max(2000),
});
type Values = z.infer<typeof schema>;

export function SeriesForm({ initial, mode }: { initial?: SermonSeries; mode: "new" | "edit" }) {
  const navigate = useNavigate();
  const create = useCreate("series");
  const update = useUpdate("series");
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? { title: "", slug: "", description: "" },
  });

  async function onSubmit(values: Values) {
    try {
      if (mode === "new") await create.mutateAsync(values);
      else if (initial) await update.mutateAsync({ id: initial.id, ...values });
      toast.success(mode === "new" ? "Series created" : "Series updated");
      navigate("/admin/series");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1.5 mb-4">
        <Link to="/admin/series"><ArrowLeft className="h-4 w-4" /> Series</Link>
      </Button>
      <h1 className="font-display text-3xl text-ink mb-8">{mode === "new" ? "New series" : "Edit series"}</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 max-w-2xl bg-background border border-border rounded-2xl p-6" noValidate>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...form.register("title", {
            onChange: (e) => { if (mode === "new" && !form.getValues("slug")) form.setValue("slug", slugify(e.target.value)); },
          })} />
          {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...form.register("slug")} />
          {form.formState.errors.slug && <p className="text-xs text-destructive">{form.formState.errors.slug.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={4} {...form.register("description")} />
          {form.formState.errors.description && <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>}
        </div>
        <div className="flex gap-2 justify-end pt-2 border-t border-border">
          <Button type="button" variant="outline" asChild><Link to="/admin/series">Cancel</Link></Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Saving…" : "Save"}</Button>
        </div>
      </form>
    </div>
  );
}
