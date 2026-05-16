import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateEvent, useUpdateEvent } from "@/services/queries";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import type { ChurchEvent } from "@/types";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(200),
  description: z.string().trim().min(2, "Description is required").max(4000),
  flyer: z.string().optional(),
  location: z.string().trim().min(2, "Location is required").max(200),
  date: z.string().min(1, "Start date is required"),
  start_time: z.string().min(1, "Start time is required"),
  days: z.coerce.number().min(1),
});
type Values = z.infer<typeof schema>;

export function EventForm({ initial, mode }: { initial?: ChurchEvent; mode: "new" | "edit" }) {
  const navigate = useNavigate();
  const create = useCreateEvent();
  const update = useUpdateEvent();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          name: initial.name,
          description: initial.description,
          flyer: initial.flyer ?? "",
          location: initial.location,
          date: initial.date,
          start_time: initial.start_time.slice(0, 5),
          days: initial.days,
        }
      : {
          name: "",
          description: "",
          flyer: "",
          location: "",
          date: "",
          start_time: "",
          days: 1,
        },
  });

  async function onSubmit(values: Values) {
    const payload = {
      ...values,
      flyer: values.flyer ?? "",
      start_time: `${values.start_time}:00`,
    };
    try {
      if (mode === "new") await create.mutateAsync(payload);
      else if (initial) await update.mutateAsync({ id: initial.id, ...payload });
      toast.success(mode === "new" ? "Event created" : "Event updated");
      navigate("/admin/events");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1.5 mb-4">
        <Link to="/admin/events">
          <ArrowLeft className="h-4 w-4" /> Events
        </Link>
      </Button>
      <h1 className="font-display text-3xl text-ink mb-8">
        {mode === "new" ? "New event" : "Edit event"}
      </h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 max-w-2xl bg-background border border-border rounded-2xl p-6"
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Start Date</Label>
            <Input id="date" type="date" {...form.register("date")} />
            {form.formState.errors.date && (
              <p className="text-xs text-destructive">{form.formState.errors.date.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="start_time">Start Time</Label>
            <Input id="start_time" type="time" {...form.register("start_time")} />
            {form.formState.errors.start_time && (
              <p className="text-xs text-destructive">{form.formState.errors.start_time.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="days">Days</Label>
            <Input id="days" type="number" min={1} {...form.register("days")} />
            {form.formState.errors.days && (
              <p className="text-xs text-destructive">{form.formState.errors.days.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...form.register("location")} />
          {form.formState.errors.location && (
            <p className="text-xs text-destructive">{form.formState.errors.location.message}</p>
          )}
        </div>
        <Controller
          control={form.control}
          name="flyer"
          render={({ field }) => (
            <ImageUploadField
              label="Flyer / Banner Image"
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={6} {...form.register("description")} />
          {form.formState.errors.description && (
            <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
          )}
        </div>
        <div className="flex gap-2 justify-end pt-2 border-t border-border">
          <Button type="button" variant="outline" asChild>
            <Link to="/admin/events">Cancel</Link>
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
