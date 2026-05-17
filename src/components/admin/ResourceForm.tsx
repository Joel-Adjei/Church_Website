import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateResource, useUpdateResource } from "@/services/queries";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import type { Resource } from "@/types";
import { ImageUploadField } from "./ImageUploadField";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(200),
  purchase_link: z.string().trim().min(1, "Purchase link is required").max(500),
  price: z.string().trim().min(1, "Price is required").max(100),
  image: z.string().trim().max(500).optional().or(z.literal("")),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
});
type Values = z.infer<typeof schema>;

export function ResourceForm({ initial, mode }: { initial?: Resource; mode: "new" | "edit" }) {
  const navigate = useNavigate();
  const create = useCreateResource();
  const update = useUpdateResource();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          name: initial.name,
          purchase_link: initial.purchase_link,
          price: initial.price,
          image: initial.image ?? "",
          description: initial.description ?? "",
        }
      : { name: "", purchase_link: "", price: "", image: "", description: "" },
  });

  async function onSubmit(values: Values) {
    const payload = {
      name: values.name,
      purchase_link: values.purchase_link,
      price: values.price,
      image: values.image || undefined,
      description: values.description || undefined,
    };
    try {
      if (mode === "new") {
        await create.mutateAsync(payload);
        toast.success("Resource created");
      } else if (initial) {
        await update.mutateAsync({ id: initial.id, ...payload });
        toast.success("Resource updated");
      }
      navigate("/admin/resources");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1.5 mb-4">
        <Link to="/admin/resources">
          <ArrowLeft className="h-4 w-4" /> Resources
        </Link>
      </Button>
      <h1 className="font-display text-3xl text-ink mb-8">
        {mode === "new" ? "New resource" : "Edit resource"}
      </h1>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 max-w-2xl bg-background border border-border rounded-2xl p-6"
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="e.g. The Purpose Driven Life" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" placeholder="e.g. Free, GH₵50, $9.99" {...form.register("price")} />
            {form.formState.errors.price && (
              <p className="text-xs text-destructive">{form.formState.errors.price.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="purchase_link">Purchase / Get link</Label>
            <Input id="purchase_link" placeholder="https://…" {...form.register("purchase_link")} />
            {form.formState.errors.purchase_link && (
              <p className="text-xs text-destructive">
                {form.formState.errors.purchase_link.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="mx-auto w-full space-y-2">
            <Controller
              control={form.control}
              name="image"
              render={({ field }) => (
                <ImageUploadField
                  label="Image"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-ink-muted">(optional)</span>
          </Label>
          <Textarea
            id="description"
            rows={5}
            placeholder="Brief description of the resource…"
            {...form.register("description")}
          />
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t border-border">
          <Button type="button" variant="outline" asChild>
            <Link to="/admin/resources">Cancel</Link>
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : "Save resource"}
          </Button>
        </div>
      </form>
    </div>
  );
}
