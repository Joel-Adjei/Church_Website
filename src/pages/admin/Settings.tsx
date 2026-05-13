import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings, useUpdateSettings } from "@/services/queries";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

const schema = z.object({
  churchName: z.string().trim().min(2, "Required").max(120),
  tagline: z.string().trim().min(2, "Required").max(280),
  logoUrl: z.string(),
  bannerImageUrl: z.string(),
  phone: z.string().trim().min(3, "Required"),
  email: z.string().trim().email("Must be a valid email"),
  address: z.string().trim().min(3, "Required"),
  serviceTimes: z
    .array(z.object({ value: z.string().trim().min(2, "Required") }))
    .min(1, "Add at least one service time"),
  socials: z.object({
    facebook: z.string().trim().url().or(z.literal("")),
    instagram: z.string().trim().url().or(z.literal("")),
    youtube: z.string().trim().url().or(z.literal("")),
    twitter: z.string().trim().url().or(z.literal("")),
  }),
});
type Values = z.infer<typeof schema>;

export default function Settings() {
  const { data, isLoading } = useSettings();
  const update = useUpdateSettings();
  const [tab, setTab] = useState("branding");

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      churchName: "",
      tagline: "",
      logoUrl: "",
      bannerImageUrl: "",
      phone: "",
      email: "",
      address: "",
      serviceTimes: [{ value: "" }],
      socials: { facebook: "", instagram: "", youtube: "", twitter: "" },
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
        serviceTimes: (data.serviceTimes.length ? data.serviceTimes : [""]).map((value) => ({
          value,
        })),
      });
    }
  }, [data, form]);

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "serviceTimes" });

  async function onSubmit(values: Values) {
    try {
      await update.mutateAsync({
        ...values,
        serviceTimes: values.serviceTimes.map((s) => s.value).filter(Boolean),
      });
      toast.success("Settings saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  if (isLoading) return <div className="text-ink-muted">Loading…</div>;

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Manage church branding, contact details, services and social links."
      />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-background border border-border rounded-2xl p-6 max-w-3xl"
        noValidate
      >
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="services">Service Times</TabsTrigger>
            <TabsTrigger value="socials">Socials</TabsTrigger>
          </TabsList>

          <TabsContent value="branding" className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="churchName">Church name</Label>
              <Input id="churchName" {...form.register("churchName")} />
              {form.formState.errors.churchName && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.churchName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Textarea id="tagline" rows={2} {...form.register("tagline")} />
              {form.formState.errors.tagline && (
                <p className="text-xs text-destructive">{form.formState.errors.tagline.message}</p>
              )}
            </div>
            <Controller
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <ImageUploadField
                  label="Logo"
                  value={field.value}
                  onChange={field.onChange}
                  hint="Square PNG or SVG works best."
                />
              )}
            />
          </TabsContent>

          <TabsContent value="contact" className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...form.register("phone")} />
                {form.formState.errors.phone && (
                  <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" rows={2} {...form.register("address")} />
              {form.formState.errors.address && (
                <p className="text-xs text-destructive">{form.formState.errors.address.message}</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-3">
            {fields.map((f, i) => (
              <div key={f.id} className="flex gap-2">
                <Input
                  placeholder="e.g. Sunday 9:00 AM — Worship"
                  {...form.register(`serviceTimes.${i}.value` as const)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(i)}
                  disabled={fields.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "" })}>
              <Plus className="h-4 w-4 mr-1.5" /> Add time
            </Button>
            {form.formState.errors.serviceTimes && (
              <p className="text-xs text-destructive">
                {form.formState.errors.serviceTimes.message as string}
              </p>
            )}
          </TabsContent>

          <TabsContent value="socials" className="space-y-4">
            {(["facebook", "instagram", "youtube", "twitter"] as const).map((k) => (
              <div className="space-y-2" key={k}>
                <Label htmlFor={k} className="capitalize">
                  {k}
                </Label>
                <Input
                  id={k}
                  placeholder={`https://${k}.com/yourchurch`}
                  {...form.register(`socials.${k}` as const)}
                />
                {form.formState.errors.socials?.[k] && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.socials?.[k]?.message}
                  </p>
                )}
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-6 mt-6 border-t border-border">
          <Button type="submit" disabled={form.formState.isSubmitting || update.isPending}>
            {form.formState.isSubmitting || update.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
