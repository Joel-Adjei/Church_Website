import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateGallery, useUpdateGallery } from "@/services/queries";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import type { GalleryProgram } from "@/types";
import { MultiImageUpload } from "@/components/admin/ImageUploadField";

const schema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200),
  description: z.string().trim().min(2, "Description is required").max(2000),
  venue: z.string().trim().min(2, "Venue is required").max(200),
  image_urls: z.array(z.string()).min(1, "Add at least one image"),
});
type Values = z.infer<typeof schema>;

export function GalleryForm({ initial, mode }: { initial?: GalleryProgram; mode: "new" | "edit" }) {
  const navigate = useNavigate();
  const create = useCreateGallery();
  const update = useUpdateGallery();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          title: initial.title,
          description: initial.description,
          venue: initial.venue,
          image_urls: initial.images.length > 0
            ? initial.images.map((img) => img.image)
            : [],
        }
      : { title: "", description: "", venue: "", image_urls: [] },
  });

  async function onSubmit(values: Values) {
    const payload = {
      title: values.title,
      description: values.description,
      venue: values.venue,
      image_urls: values.image_urls,
    };
    try {
      if (mode === "new") await create.mutateAsync(payload);
      else if (initial) await update.mutateAsync({ id: initial.id, ...payload });
      toast.success(mode === "new" ? "Gallery created" : "Gallery updated");
      navigate("/admin/gallery");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
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
          <Input id="title" {...form.register("title")} />
          {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="venue">Venue</Label>
          <Input id="venue" {...form.register("venue")} />
          {form.formState.errors.venue && <p className="text-xs text-destructive">{form.formState.errors.venue.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={3} {...form.register("description")} />
          {form.formState.errors.description && <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>}
        </div>

        <MultiImageUpload
          label="Gallery Images"
          values={form.watch("image_urls")}
          onChange={(urls) => form.setValue("image_urls", urls, { shouldValidate: true })}
          hint="Upload as many images as you like. Drag & drop or click to select multiple at once."
        />
        {form.formState.errors.image_urls && (
          <p className="text-xs text-destructive">{form.formState.errors.image_urls.message as string}</p>
        )}

        <div className="flex gap-2 justify-end pt-2 border-t border-border">
          <Button type="button" variant="outline" asChild><Link to="/admin/gallery">Cancel</Link></Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Saving…" : "Save"}</Button>
        </div>
      </form>
    </div>
  );
}
