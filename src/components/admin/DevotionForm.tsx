import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDevotion, useUpdateDevotion } from "@/services/queries";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import type { Devotion } from "@/types";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

const schema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200),
  reference: z.string().trim().min(2, "Bible verse is required").max(20),
  verse_content: z.string().trim().min(2, "Verse content is required").max(100),
  content: z.string().trim().min(20, "Content is too short").max(20000),
  thumbnail: z.string().optional(),
  prayer: z.string().trim().max(4000).optional().or(z.literal("")),
  reflection: z.string().trim().max(2000).optional().or(z.literal("")),
});
type Values = z.infer<typeof schema>;

export function DevotionForm({ initial, mode }: { initial?: Devotion; mode: "new" | "edit" }) {
  const navigate = useNavigate();
  const create = useCreateDevotion();
  const update = useUpdateDevotion();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          title: initial.title,
          reference: initial.Bible_verse.reference,
          verse_content: initial.Bible_verse.verse_content,
          content: initial.content,
          thumbnail: initial.thumbnail ?? "",
          prayer: initial.prayer ?? "",
          reflection: initial.reflection ?? "",
        }
      : {
          title: "",
          reference: "",
          verse_content: "",
          content: "",
          thumbnail: "",
          prayer: "",
          reflection: "",
        },
  });

  async function onSubmit(values: Values) {
    const payload = {
      title: values.title,
      Bible_verse: {
        reference: values.reference,
        verse_content: values.verse_content,
      },
      content: values.content,
      thumbnail: values.thumbnail || "",
      prayer: values.prayer || "",
      reflection: values.reflection || "",
    };
    try {
      if (mode === "new") {
        await create.mutateAsync(payload);
        toast.success("Devotion created");
      } else if (initial) {
        await update.mutateAsync({ id: initial.id, ...payload });
        toast.success("Devotion updated");
      }
      navigate("/admin/devotions");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1.5 mb-4">
        <Link to="/admin/devotions">
          <ArrowLeft className="h-4 w-4" /> Devotions
        </Link>
      </Button>
      <h1 className="font-display text-3xl text-ink mb-8">
        {mode === "new" ? "New devotion" : "Edit devotion"}
      </h1>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 max-w-3xl bg-background border border-border rounded-2xl p-6"
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reference">Bible verse reference</Label>
          <Input id="reference" placeholder="e.g. John 3:16" {...form.register("reference")} />
          {form.formState.errors.reference && (
            <p className="text-xs text-destructive">{form.formState.errors.reference.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="verse_content">Bible verse content</Label>
          <Textarea
            id="verse_content"
            rows={3}
            placeholder="Enter the full Bible verse."
            {...form.register("verse_content")}
          />
          {form.formState.errors.verse_content && (
            <p className="text-xs text-destructive">
              {form.formState.errors.verse_content.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Devotion content</Label>
          <Textarea
            id="content"
            rows={10}
            placeholder="Write the full devotion message."
            {...form.register("content")}
          />
          {form.formState.errors.content && (
            <p className="text-xs text-destructive">{form.formState.errors.content.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reflection">Reflection / Key Takeaway</Label>
          <Textarea id="reflection" rows={3} {...form.register("reflection")} />
          {form.formState.errors.reflection && (
            <p className="text-xs text-destructive">{form.formState.errors.reflection.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="prayer">Prayer</Label>
          <Textarea id="prayer" rows={4} {...form.register("prayer")} />
        </div>

        <Controller
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <ImageUploadField
              label="Thumbnail"
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />

        <div className="flex gap-2 justify-end pt-4 border-t border-border">
          <Button type="button" variant="outline" asChild>
            <Link to="/admin/devotions">Cancel</Link>
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : "Save devotion"}
          </Button>
        </div>
      </form>
    </div>
  );
}
