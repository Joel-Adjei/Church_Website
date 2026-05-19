import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAnnouncement, useUpdateAnnouncement } from "@/services/queries";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import type { Announcement } from "@/types";
import TextEditor from "../ui/TextEditor";

const schema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200),
  content: z.string().trim().min(2, "Content is required").max(8000),
});
type Values = z.infer<typeof schema>;

export function AnnouncementForm({
  initial,
  mode,
}: {
  initial?: Announcement;
  mode: "new" | "edit";
}) {
  const navigate = useNavigate();
  const create = useCreateAnnouncement();
  const update = useUpdateAnnouncement();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? { title: initial.title, content: initial.content }
      : { title: "", content: "" },
  });

  async function onSubmit(values: Values) {
    try {
      if (mode === "new") await create.mutateAsync(values);
      else if (initial) await update.mutateAsync({ id: initial.id, ...values });
      toast.success(mode === "new" ? "Announcement created" : "Announcement updated");
      navigate("/admin/announcements");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1.5 mb-4">
        <Link to="/admin/announcements">
          <ArrowLeft className="h-4 w-4" /> Announcements
        </Link>
      </Button>
      <h1 className="font-display text-3xl text-ink mb-8">
        {mode === "new" ? "New announcement" : "Edit announcement"}
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
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          {/* <Textarea id="content" rows={10} {...form.register("content")} /> */}
          <Controller
            control={form.control}
            name="content"
            render={({ field }) => <TextEditor value={field.value} setValue={field.onChange} />}
          />

          {form.formState.errors.content && (
            <p className="text-xs text-destructive">{form.formState.errors.content.message}</p>
          )}
        </div>
        <div className="flex gap-2 justify-end pt-2 border-t border-border">
          <Button type="button" variant="outline" asChild>
            <Link to="/admin/announcements">Cancel</Link>
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
