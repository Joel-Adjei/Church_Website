import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreate, useUpdate } from "@/services/queries";
import { slugify } from "@/store/store";
import { toast } from "sonner";
import { ArrowLeft, Star } from "lucide-react";
import type { Resource } from "@/types";

const schema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(200),
  slug: z.string().trim().min(2).max(200).regex(/^[a-z0-9-]+$/, "Lowercase, numbers, hyphens only"),
  description: z.string().trim().min(10, "Please describe the resource").max(4000),
  category: z.enum(["books", "clothing", "food", "equipment", "digital", "stationery", "other"]),
  condition: z.enum(["new", "like-new", "good", "fair"]),
  availability: z.enum(["available", "limited", "claimed"]),
  imageUrl: z.string().trim().url("Enter a valid URL").or(z.literal("")).optional(),
  contactEmail: z.string().trim().email("Enter a valid email").or(z.literal("")).optional(),
  contactPhone: z.string().trim().optional(),
  pickupLocation: z.string().trim().optional(),
  quantity: z.coerce.number().int().min(0).optional(),
  featured: z.boolean(),
});
type Values = z.infer<typeof schema>;

export function ResourceForm({ initial, mode }: { initial?: Resource; mode: "new" | "edit" }) {
  const navigate = useNavigate();
  const create = useCreate("resources");
  const update = useUpdate("resources");

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          ...initial,
          imageUrl: initial.imageUrl ?? "",
          contactEmail: initial.contactEmail ?? "",
          contactPhone: initial.contactPhone ?? "",
          pickupLocation: initial.pickupLocation ?? "",
          quantity: initial.quantity ?? 1,
        }
      : {
          title: "", slug: "", description: "",
          category: "other", condition: "good", availability: "available",
          imageUrl: "", contactEmail: "", contactPhone: "", pickupLocation: "",
          quantity: 1, featured: false,
        },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = form;
  const featured = watch("featured");

  async function onSubmit(values: Values) {
    const payload = {
      ...values,
      imageUrl: values.imageUrl || undefined,
      contactEmail: values.contactEmail || undefined,
      contactPhone: values.contactPhone || undefined,
      pickupLocation: values.pickupLocation || undefined,
    };
    try {
      if (mode === "new") await create.mutateAsync(payload);
      else if (initial) await update.mutateAsync({ id: initial.id, ...payload });
      toast.success(mode === "new" ? "Resource created" : "Resource updated");
      navigate("/admin/resources");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1.5 mb-4">
        <Link to="/admin/resources"><ArrowLeft className="h-4 w-4" /> Resources</Link>
      </Button>
      <h1 className="font-display text-3xl text-ink mb-8">
        {mode === "new" ? "New resource" : "Edit resource"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl bg-background border border-border rounded-2xl p-6" noValidate>
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...register("title", {
              onChange: (e) => {
                if (mode === "new") setValue("slug", slugify(e.target.value));
              },
            })}
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} />
          {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
        </div>

        {/* Category / Condition / Availability */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select
              defaultValue={form.getValues("category")}
              onValueChange={(v) => setValue("category", v as Values["category"], { shouldValidate: true })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="digital">Digital</SelectItem>
                <SelectItem value="stationery">Stationery</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Condition *</Label>
            <Select
              defaultValue={form.getValues("condition")}
              onValueChange={(v) => setValue("condition", v as Values["condition"], { shouldValidate: true })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="like-new">Like New</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Availability *</Label>
            <Select
              defaultValue={form.getValues("availability")}
              onValueChange={(v) => setValue("availability", v as Values["availability"], { shouldValidate: true })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="limited">Limited</SelectItem>
                <SelectItem value="claimed">Claimed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea id="description" rows={5} {...register("description")} />
          {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
        </div>

        {/* Image URL */}
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL <span className="text-ink-muted">(optional)</span></Label>
          <Input id="imageUrl" type="url" placeholder="https://…" {...register("imageUrl")} />
          {errors.imageUrl && <p className="text-xs text-destructive">{errors.imageUrl.message}</p>}
        </div>

        {/* Pickup location + quantity */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pickupLocation">Pickup location <span className="text-ink-muted">(optional)</span></Label>
            <Input id="pickupLocation" placeholder="e.g. Church Office" {...register("pickupLocation")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity <span className="text-ink-muted">(optional)</span></Label>
            <Input id="quantity" type="number" min={0} {...register("quantity")} />
            {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
          </div>
        </div>

        {/* Contact */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact email <span className="text-ink-muted">(optional)</span></Label>
            <Input id="contactEmail" type="email" {...register("contactEmail")} />
            {errors.contactEmail && <p className="text-xs text-destructive">{errors.contactEmail.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact phone <span className="text-ink-muted">(optional)</span></Label>
            <Input id="contactPhone" type="tel" {...register("contactPhone")} />
          </div>
        </div>

        {/* Featured toggle */}
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${featured ? "border-primary bg-primary/5" : "border-border"}`}
          onClick={() => setValue("featured", !featured)}
        >
          <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${featured ? "bg-primary/10" : "bg-secondary"}`}>
            <Star className={`h-4 w-4 ${featured ? "text-primary" : "text-ink-muted"}`} />
          </div>
          <div>
            <div className={`text-sm font-medium ${featured ? "text-primary" : "text-ink"}`}>Feature this resource</div>
            <div className="text-xs text-ink-muted">Highlighted at the top of the public resources page</div>
          </div>
          <div className={`ml-auto h-4 w-4 rounded-full border-2 shrink-0 transition-colors ${featured ? "border-primary bg-primary" : "border-border"}`} />
        </div>

        <div className="flex gap-2 justify-end pt-2 border-t border-border">
          <Button type="button" variant="outline" asChild>
            <Link to="/admin/resources">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save resource"}
          </Button>
        </div>
      </form>
    </div>
  );
}
