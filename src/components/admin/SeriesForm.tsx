import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateSeries, useUpdateSeries } from "@/services/queries";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import type { SermonSeries } from "@/types";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

const schema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200),
  description: z.string().trim().min(2, "Description is required").max(2000),
  image: z.string().optional(),
});
type Values = z.infer<typeof schema>;

export function SeriesForm({ initial, mode }: { initial?: SermonSeries; mode: "new" | "edit" }) {
  const navigate = useNavigate();
  const create = useCreateSeries();
  const update = useUpdateSeries();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? { title: initial.title, description: initial.description, image: initial.image ?? "" }
      : { title: "", description: "", image: "" },
  });

  async function onSubmit(values: Values) {
    const payload = { title: values.title, description: values.description, image: values.image ?? "" };
    try {
      if (mode === "new") await create.mutateAsync(payload);
      else if (initial) await update.mutateAsync({ id: initial.id, ...payload });
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
          <Input id="title" {...form.register("title")} />
          {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
        </div>
        <Controller
          control={form.control}
          name="image"
          render={({ field }) => (
            <ImageUploadField
              label="Cover Image"
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
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
