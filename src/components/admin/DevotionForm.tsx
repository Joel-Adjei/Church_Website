import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useCreate, useUpdate } from "@/services/queries";
import { ImageUploadField } from "./ImageUploadField";
import { TitleSlugFields } from "./TitleSlugFields";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import type { Devotion } from "@/types";

const schema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200),
  slug: z.string().trim().min(2).max(200).regex(/^[a-z0-9-]+$/, "Lowercase, numbers, hyphens only"),
  verseRef: z.string().trim().min(2, "Reference required").max(120),
  verseText: z.string().trim().min(5, "Verse text required").max(1000),
  content: z.string().trim().min(20, "Devotion content is too short").max(20000),
  prayer: z.string().trim().max(4000).optional().or(z.literal("")),
  reflection: z.string().trim().max(2000).optional().or(z.literal("")),
  author: z.string().trim().min(2, "Author required").max(120),
  imageUrl: z.string().trim().max(200000).optional().or(z.literal("")),
  devotionDate: z.string().min(1, "Date is required"),
  category: z.string().trim().max(60).optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
  featured: z.boolean(),
});
type Values = z.infer<typeof schema>;

const CATEGORIES = ["Faith", "Prayer", "Hope", "Grace", "Scripture", "Service", "Love", "Wisdom"];

export function DevotionForm({ initial, mode }: { initial?: Devotion; mode: "new" | "edit" }) {
  const navigate = useNavigate();
  const create = useCreate("devotions");
  const update = useUpdate("devotions");

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? { ...initial, prayer: initial.prayer ?? "", reflection: initial.reflection ?? "", category: initial.category ?? "", imageUrl: initial.imageUrl ?? "" }
      : {
          title: "", slug: "", verseRef: "", verseText: "", content: "",
          prayer: "", reflection: "", author: "", imageUrl: "",
          devotionDate: new Date().toISOString().slice(0, 10),
          category: "Faith", status: "draft", featured: false,
        },
  });

  async function onSubmit(values: Values) {
    const payload = {
      ...values,
      prayer: values.prayer || "",
      reflection: values.reflection || "",
      category: values.category || "",
      imageUrl: values.imageUrl || "",
      createdAt: initial?.createdAt ?? new Date().toISOString(),
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

  const featured = form.watch("featured");
  const status = form.watch("status");

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1.5 mb-4">
        <Link to="/admin/devotions"><ArrowLeft className="h-4 w-4" /> Devotions</Link>
      </Button>
      <h1 className="font-display text-3xl text-ink mb-8">{mode === "new" ? "New devotion" : "Edit devotion"}</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 max-w-3xl bg-background border border-border rounded-2xl p-6" noValidate>
        <TitleSlugFields form={form} mode={mode} titleField="title" slugField="slug" />

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="verseRef">Bible verse reference</Label>
            <Input id="verseRef" placeholder="e.g. John 3:16" {...form.register("verseRef")} />
            {form.formState.errors.verseRef && <p className="text-xs text-destructive">{form.formState.errors.verseRef.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input id="author" {...form.register("author")} />
            {form.formState.errors.author && <p className="text-xs text-destructive">{form.formState.errors.author.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="verseText">Verse text</Label>
          <Textarea id="verseText" rows={3} {...form.register("verseText")} />
          {form.formState.errors.verseText && <p className="text-xs text-destructive">{form.formState.errors.verseText.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Devotion content</Label>
          <Textarea id="content" rows={10} placeholder="Write the full devotion message. Paragraphs are separated by blank lines." {...form.register("content")} />
          <p className="text-xs text-ink-muted">Tip: leave a blank line between paragraphs for clean spacing.</p>
          {form.formState.errors.content && <p className="text-xs text-destructive">{form.formState.errors.content.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reflection">Reflection / Key Takeaway</Label>
          <Textarea id="reflection" rows={3} {...form.register("reflection")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prayer">Prayer</Label>
          <Textarea id="prayer" rows={4} {...form.register("prayer")} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="devotionDate">Devotion date</Label>
            <Input id="devotionDate" type="date" {...form.register("devotionDate")} />
            {form.formState.errors.devotionDate && <p className="text-xs text-destructive">{form.formState.errors.devotionDate.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Category / Tag</Label>
            <Select value={form.watch("category") || ""} onValueChange={(v) => form.setValue("category", v)}>
              <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <ImageUploadField
          label="Featured image"
          value={form.watch("imageUrl") || ""}
          onChange={(url) => form.setValue("imageUrl", url)}
          hint="Recommended: 1600×900 or larger."
        />

        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => form.setValue("status", v as "draft" | "published")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Featured (current day devotion)</Label>
            <div className="flex items-center gap-3 h-9">
              <Switch checked={featured} onCheckedChange={(v) => form.setValue("featured", v)} />
              <span className="text-sm text-ink-muted">{featured ? "Featured on the devotions page" : "Not featured"}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t border-border">
          <Button type="button" variant="outline" asChild><Link to="/admin/devotions">Cancel</Link></Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Saving…" : "Save devotion"}</Button>
        </div>
      </form>
    </div>
  );
}
