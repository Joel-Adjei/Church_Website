import { useForm, useFieldArray } from "react-hook-form";
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
import { ArrowLeft, Plus, X } from "lucide-react";
import type { GalleryProgram } from "@/types";

const schema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(200).regex(/^[a-z0-9-]+$/, "Lowercase, numbers, hyphens only"),
  description: z.string().trim().min(2).max(2000),
  coverImageUrl: z.string().trim().url(),
  images: z.array(z.object({
    url: z.string().trim().url("Image URL must be valid"),
    caption: z.string().max(200).optional().or(z.literal("")),
  })).min(1, "Add at least one image"),
});
type Values = z.infer<typeof schema>;

export function GalleryForm({ initial, mode }: { initial?: GalleryProgram; mode: "new" | "edit" }) {
  const navigate = useNavigate();
  const create = useCreate("gallery");
  const update = useUpdate("gallery");

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? { ...initial, images: initial.images.map((i) => ({ url: i.url, caption: i.caption ?? "" })) }
      : { title: "", slug: "", description: "", coverImageUrl: "", images: [{ url: "", caption: "" }] },
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "images" });

  async function onSubmit(values: Values) {
    const payload = { ...values, images: values.images.map((i) => ({ url: i.url, caption: i.caption || undefined })) };
    try {
      if (mode === "new") await create.mutateAsync(payload);
      else if (initial) await update.mutateAsync({ id: initial.id, ...payload });
      toast.success(mode === "new" ? "Gallery created" : "Gallery updated");
      navigate("/admin/gallery");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Save failed"); }
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1.5 mb-4">
        <Link to="/admin/gallery"><ArrowLeft className="h-4 w-4" /> Galleries</Link>
      </Button>
      <h1 className="font-display text-3xl text-ink mb-8">{mode === "new" ? "New gallery" : "Edit gallery"}</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 max-w-3xl bg-background border border-border rounded-2xl p-6" noValidate>
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
          <Label htmlFor="coverImageUrl">Cover image URL</Label>
          <Input id="coverImageUrl" type="url" {...form.register("coverImageUrl")} />
          {form.formState.errors.coverImageUrl && <p className="text-xs text-destructive">{form.formState.errors.coverImageUrl.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={3} {...form.register("description")} />
          {form.formState.errors.description && <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Images</Label>
            <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => append({ url: "", caption: "" })}>
              <Plus className="h-3.5 w-3.5" /> Add image
            </Button>
          </div>
          <div className="space-y-3">
            {fields.map((f, i) => (
              <div key={f.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-start">
                <div>
                  <Input placeholder="Image URL" {...form.register(`images.${i}.url` as const)} />
                  {form.formState.errors.images?.[i]?.url && <p className="text-xs text-destructive mt-1">{form.formState.errors.images[i]?.url?.message}</p>}
                </div>
                <Input placeholder="Caption (optional)" {...form.register(`images.${i}.caption` as const)} />
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} aria-label="Remove image">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          {form.formState.errors.images && typeof form.formState.errors.images.message === "string" && (
            <p className="text-xs text-destructive">{form.formState.errors.images.message}</p>
          )}
        </div>

        <div className="flex gap-2 justify-end pt-2 border-t border-border">
          <Button type="button" variant="outline" asChild><Link to="/admin/gallery">Cancel</Link></Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Saving…" : "Save"}</Button>
        </div>
      </form>
    </div>
  );
}
