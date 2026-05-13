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
import type { ChurchEvent } from "@/types";

const schema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(200).regex(/^[a-z0-9-]+$/, "Lowercase, numbers, hyphens only"),
  description: z.string().trim().min(2).max(4000),
  startAt: z.string().min(1, "Start required"),
  endAt: z.string().min(1, "End required"),
  location: z.string().trim().min(2).max(200),
  bannerImageUrl: z.string().trim().url(),
}).refine((v) => new Date(v.endAt) >= new Date(v.startAt), { path: ["endAt"], message: "End must be after start" });
type Values = z.infer<typeof schema>;

function toLocal(s: string) { return s.length >= 16 ? s.slice(0, 16) : s; }

export function EventForm({ initial, mode }: { initial?: ChurchEvent; mode: "new" | "edit" }) {
  const navigate = useNavigate();
  const create = useCreate("events");
  const update = useUpdate("events");
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? { ...initial, startAt: toLocal(initial.startAt), endAt: toLocal(initial.endAt) }
      : { title: "", slug: "", description: "", startAt: "", endAt: "", location: "", bannerImageUrl: "" },
  });

  async function onSubmit(values: Values) {
    try {
      if (mode === "new") await create.mutateAsync(values);
      else if (initial) await update.mutateAsync({ id: initial.id, ...values });
      toast.success(mode === "new" ? "Event created" : "Event updated");
      navigate("/admin/events");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Save failed"); }
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1.5 mb-4">
        <Link to="/admin/events"><ArrowLeft className="h-4 w-4" /> Events</Link>
      </Button>
      <h1 className="font-display text-3xl text-ink mb-8">{mode === "new" ? "New event" : "Edit event"}</h1>
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
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startAt">Start</Label>
            <Input id="startAt" type="datetime-local" {...form.register("startAt")} />
            {form.formState.errors.startAt && <p className="text-xs text-destructive">{form.formState.errors.startAt.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="endAt">End</Label>
            <Input id="endAt" type="datetime-local" {...form.register("endAt")} />
            {form.formState.errors.endAt && <p className="text-xs text-destructive">{form.formState.errors.endAt.message}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...form.register("location")} />
          {form.formState.errors.location && <p className="text-xs text-destructive">{form.formState.errors.location.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="bannerImageUrl">Banner image URL</Label>
          <Input id="bannerImageUrl" type="url" {...form.register("bannerImageUrl")} />
          {form.formState.errors.bannerImageUrl && <p className="text-xs text-destructive">{form.formState.errors.bannerImageUrl.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={6} {...form.register("description")} />
          {form.formState.errors.description && <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>}
        </div>
        <div className="flex gap-2 justify-end pt-2 border-t border-border">
          <Button type="button" variant="outline" asChild><Link to="/admin/events">Cancel</Link></Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Saving…" : "Save"}</Button>
        </div>
      </form>
    </div>
  );
}
