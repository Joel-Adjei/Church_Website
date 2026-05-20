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
import { Switch } from "@/components/ui/switch";
import { useSettings, useUpdateSettings } from "@/services/queries";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

const SOCIAL_KEYS = ["facebook", "instagram", "youtube", "twitter"] as const;

const schema = z.object({
  church_name: z.string().trim().min(2, "Required").max(120),
  tagline: z.string().trim().min(2, "Required").max(280),
  logo_url: z.string(),
  banner_image_url: z.string(),
  phone: z.string().trim().or(z.literal("")),
  email: z.string().trim().email("Must be a valid email").or(z.literal("")),
  address: z.string().trim().or(z.literal("")),
  service_times: z
    .array(z.object({ value: z.string().trim().min(2, "Required") }))
    .min(1, "Add at least one service time"),
  social_facebook: z.string().trim().url().or(z.literal("")).optional(),
  social_instagram: z.string().trim().url().or(z.literal("")).optional(),
  social_youtube: z.string().trim().url().or(z.literal("")).optional(),
  social_twitter: z.string().trim().url().or(z.literal("")).optional(),
  footer_note: z.string().optional(),
  default_seo_title: z.string().optional(),
  default_seo_description: z.string().optional(),
  default_og_image_url: z.string().optional(),
  show_announcements: z.boolean(),
  show_gallery: z.boolean(),
  show_resources: z.boolean(),
  show_prayer_request: z.boolean(),
  show_live_badge: z.boolean(),
});

type Values = z.infer<typeof schema>;

export default function Settings() {
  const { data, isLoading } = useSettings();
  const update = useUpdateSettings();
  const [tab, setTab] = useState("branding");

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      church_name: "",
      tagline: "",
      logo_url: "",
      banner_image_url: "",
      phone: "",
      email: "",
      address: "",
      service_times: [{ value: "" }],
      social_facebook: "",
      social_instagram: "",
      social_youtube: "",
      social_twitter: "",
      footer_note: "",
      default_seo_title: "",
      default_seo_description: "",
      default_og_image_url: "",
      show_announcements: true,
      show_gallery: true,
      show_resources: true,
      show_prayer_request: true,
      show_live_badge: true,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        church_name: data.church_name,
        tagline: data.tagline,
        logo_url: data.logo_url ?? "",
        banner_image_url: data.banner_image_url ?? "",
        phone: data.phone ?? "",
        email: data.email ?? "",
        address: data.address ?? "",
        service_times: (data.service_times.length ? data.service_times : [""]).map((value) => ({
          value,
        })),
        social_facebook: data.social_links?.facebook ?? "",
        social_instagram: data.social_links?.instagram ?? "",
        social_youtube: data.social_links?.youtube ?? "",
        social_twitter: data.social_links?.twitter ?? "",
        footer_note: data.footer_note ?? "",
        default_seo_title: data.default_seo_title ?? "",
        default_seo_description: data.default_seo_description ?? "",
        default_og_image_url: data.default_og_image_url ?? "",
        show_announcements: data.show_announcements ?? true,
        show_gallery: data.show_gallery ?? true,
        show_resources: data.show_resources ?? true,
        show_prayer_request: data.show_prayer_request ?? true,
        show_live_badge: data.show_live_badge ?? true,
      });
    }
  }, [data, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "service_times",
  });

  async function onSubmit(values: Values) {
    try {
      await update.mutateAsync({
        church_name: values.church_name,
        tagline: values.tagline,
        logo_url: values.logo_url,
        banner_image_url: values.banner_image_url,
        phone: values.phone,
        email: values.email,
        address: values.address,
        service_times: values.service_times.map((s) => s.value).filter(Boolean),
        social_links: {
          facebook: values.social_facebook || "",
          instagram: values.social_instagram || "",
          youtube: values.social_youtube || "",
          twitter: values.social_twitter || "",
        },
        footer_note: values.footer_note,
        default_seo_title: values.default_seo_title,
        default_seo_description: values.default_seo_description,
        default_og_image_url: values.default_og_image_url,
        show_announcements: values.show_announcements,
        show_gallery: values.show_gallery,
        show_resources: values.show_resources,
        show_prayer_request: values.show_prayer_request,
        show_live_badge: values.show_live_badge,
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
        className="bg-background border border-border rounded-2xl p-6 max-w-6xl"
        noValidate
      >
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6 flex-wrap h-auto rounded">
            <TabsTrigger className="rounded py-2 " value="branding">
              Branding
            </TabsTrigger>
            <TabsTrigger className="rounded py-2 " value="contact">
              Contact
            </TabsTrigger>
            <TabsTrigger className="rounded py-2 " value="services">
              Service Times
            </TabsTrigger>
            <TabsTrigger className="rounded py-2 " value="socials">
              Socials
            </TabsTrigger>
            <TabsTrigger className="rounded py-2 " value="seo">
              SEO
            </TabsTrigger>
            <TabsTrigger className="rounded py-2 " value="features">
              Features
            </TabsTrigger>
          </TabsList>

          <TabsContent value="branding" className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="church_name">Church name</Label>
              <Input id="church_name" {...form.register("church_name")} />
              {form.formState.errors.church_name && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.church_name.message}
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
              name="logo_url"
              render={({ field }) => (
                <ImageUploadField
                  label="Logo"
                  value={field.value}
                  onChange={field.onChange}
                  hint="Square PNG or SVG works best."
                />
              )}
            />
            <Controller
              control={form.control}
              name="banner_image_url"
              render={({ field }) => (
                <ImageUploadField
                  label="Banner Image"
                  value={field.value}
                  onChange={field.onChange}
                  hint="Wide landscape image shown on the homepage hero."
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
            <div className="space-y-2">
              <Label htmlFor="footer_note">Footer note</Label>
              <Textarea id="footer_note" rows={2} {...form.register("footer_note")} />
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-3">
            {fields.map((f, i) => (
              <div key={f.id} className="flex gap-2">
                <Input
                  placeholder="e.g. Sunday 9:00 AM — Worship"
                  {...form.register(`service_times.${i}.value` as const)}
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
            {form.formState.errors.service_times && (
              <p className="text-xs text-destructive">
                {form.formState.errors.service_times.message as string}
              </p>
            )}
          </TabsContent>

          <TabsContent value="socials" className="space-y-4">
            {SOCIAL_KEYS.map((k) => (
              <div className="space-y-2" key={k}>
                <Label htmlFor={`social_${k}`} className="capitalize">
                  {k}
                </Label>
                <Input
                  id={`social_${k}`}
                  placeholder={`https://${k}.com/yourchurch`}
                  {...form.register(`social_${k}` as `social_facebook`)}
                />
                {form.formState.errors[`social_${k}` as keyof Values] && (
                  <p className="text-xs text-destructive">
                    {
                      (form.formState.errors[`social_${k}` as keyof Values] as { message?: string })
                        ?.message
                    }
                  </p>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="seo" className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="default_seo_title">Default SEO title</Label>
              <Input id="default_seo_title" {...form.register("default_seo_title")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default_seo_description">Default SEO description</Label>
              <Textarea
                id="default_seo_description"
                rows={3}
                {...form.register("default_seo_description")}
              />
            </div>
            <Controller
              control={form.control}
              name="default_og_image_url"
              render={({ field }) => (
                <ImageUploadField
                  label="Default OG image"
                  value={field.value || ""}
                  onChange={field.onChange}
                  hint="Shown when sharing pages on social media (1200×630 recommended)."
                />
              )}
            />
          </TabsContent>

          <TabsContent value="features" className="space-y-5">
            {(
              [
                { name: "show_announcements", label: "Show Announcements section" },
                { name: "show_gallery", label: "Show Gallery section" },
                { name: "show_resources", label: "Show Resources section" },
                { name: "show_prayer_request", label: "Show Prayer Request section" },
                { name: "show_live_badge", label: "Show Live badge on navbar" },
              ] as const
            ).map(({ name, label }) => (
              <div key={name} className="flex items-center justify-between">
                <Label htmlFor={name}>{label}</Label>
                <Controller
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <Switch id={name} checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
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
