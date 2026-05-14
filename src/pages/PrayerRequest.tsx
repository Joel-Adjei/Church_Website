import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Seo } from "@/components/Seo";
import {
  Heart,
  ShieldCheck,
  EyeOff,
  Globe,
  ChevronRight,
  HandHeart,
  BookOpen,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionHeading } from "@/components/SectionHeading";
import { useSubmitPrayerRequest } from "@/services/queries";
import heroImg from "@/assets/bg_12.jpg";
import type { PrayerPrivacy } from "@/types";

const PRIVACY_OPTIONS: {
  value: PrayerPrivacy;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    value: "private",
    label: "Pastoral team only",
    description: "Only our pastors and prayer team will see this.",
    icon: ShieldCheck,
  },
  {
    value: "anonymous",
    label: "Anonymous",
    description: "Submitted without your name or email.",
    icon: EyeOff,
  },
];

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  phone: z.string().optional(),

  subject: z.string().min(3, "Please give your request a title"),
  request: z.string().min(20, "Please share a few more details so we can pray specifically"),
  privacy: z.enum(["private", "anonymous"]),
});
type FormData = z.infer<typeof schema>;

export default function PrayerRequest() {
  const submit = useSubmitPrayerRequest();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { privacy: "private" },
  });

  const selectedPrivacy = watch("privacy");

  const onSubmit = async (data: FormData) => {
    const payload = data.privacy === "anonymous" ? { ...data, name: "Anonymous" } : data;
    await submit.mutateAsync(payload);
    toast.success("Your prayer request has been received. Our team is praying with you.", {
      duration: 5000,
    });
    reset();
  };

  return (
    <>
      <Seo
        title="Prayer Requests"
        description="Share your prayer needs with Grace Cathedral. Our team is committed to praying for you and standing with you."
      />
      {/* Hero */}
      <section className="relative h-[420px] flex items-end overflow-hidden">
        <img src={heroImg} className="absolute inset-0 h-full w-full object-cover" alt="" />
        <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/60 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-24 z-20 w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
              <Heart className="h-5 w-5 text-accent" />
            </div>
            <span className="text-accent text-sm font-medium tracking-wider uppercase">
              Prayer Ministry
            </span>
          </div>
          <SectionHeading
            eyebrow=""
            title="Bring your needs before God"
            titleColor="white"
            description="You are not alone. Our pastoral team and prayer warriors are here to stand with you."
          />
        </div>
      </section>

      {/* Promise strip */}
      <div className="bg-accent/10 border-y border-accent/20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-4 flex flex-wrap gap-6 text-sm text-ink-muted">
          <span className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-accent" /> All requests treated with care and
            confidentiality
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent" /> Your privacy choices are always honoured
          </span>
          <span className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-accent" /> Backed by Scripture and intercession
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-20 grid gap-12 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 bg-card border border-border rounded-2xl p-8 shadow-card"
          >
            <div>
              <h2 className="font-display text-2xl text-ink">Submit a prayer request</h2>
              <p className="text-sm text-ink-muted mt-1">Fields marked * are required.</p>
            </div>

            {/* Name + Phone */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Full name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  className="mt-1.5"
                  disabled={selectedPrivacy === "anonymous"}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+233 24 000 0000"
                  {...register("phone")}
                  className="mt-1.5"
                  disabled={selectedPrivacy === "anonymous"}
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <Label htmlFor="subject">Request title *</Label>
              <Input
                id="subject"
                placeholder="e.g. Healing for my mother"
                {...register("subject")}
                className="mt-1.5"
              />
              {errors.subject && (
                <p className="mt-1 text-xs text-destructive">{errors.subject.message}</p>
              )}
            </div>

            {/* Request */}
            <div>
              <Label htmlFor="request">Your prayer request *</Label>
              <Textarea
                id="request"
                rows={6}
                placeholder="Share what's on your heart. The more detail you share, the more specifically we can pray with you."
                {...register("request")}
                className="mt-1.5 resize-none"
              />
              {errors.request && (
                <p className="mt-1 text-xs text-destructive">{errors.request.message}</p>
              )}
            </div>

            {/* Privacy */}
            <div>
              <Label>Privacy *</Label>
              <div className="mt-2 space-y-2">
                {PRIVACY_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const active = selectedPrivacy === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setValue("privacy", opt.value, { shouldValidate: true })}
                      className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                        active
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-background hover:border-primary/40"
                      }`}
                    >
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${active ? "bg-primary/10" : "bg-secondary"}`}
                      >
                        <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-ink-muted"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm font-medium ${active ? "text-primary" : "text-ink"}`}
                        >
                          {opt.label}
                        </div>
                        <div className="text-xs text-ink-muted mt-0.5">{opt.description}</div>
                      </div>
                      <div
                        className={`h-4 w-4 rounded-full border-2 mt-1 shrink-0 transition-colors ${active ? "border-primary bg-primary" : "border-border"}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full gap-2 text-base"
            >
              <Heart className="h-5 w-5" />
              {isSubmitting ? "Submitting…" : "Submit prayer request"}
            </Button>

            <p className="text-center text-xs text-ink-muted">
              "Cast all your anxiety on him because he cares for you." — 1 Peter 5:7
            </p>
          </form>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-2 space-y-6">
          {/* How it works */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display text-xl text-ink mb-4">How it works</h3>
            <ol className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Submit your request",
                  desc: "Fill out the form with as much or as little detail as you like.",
                },
                {
                  step: "2",
                  title: "Our team is notified",
                  desc: "Pastors and dedicated prayer warriors receive your request immediately.",
                },
                {
                  step: "3",
                  title: "We intercede for you",
                  desc: "Your need is lifted before God in our daily and weekly prayer meetings.",
                },
                {
                  step: "4",
                  title: "We follow up",
                  desc: "A pastoral team member may reach out to check in on you.",
                },
              ].map((item) => (
                <li key={item.step} className="flex gap-3">
                  <div className="h-7 w-7 rounded-full bg-accent/15 flex items-center justify-center shrink-0 text-accent text-xs font-semibold">
                    {item.step}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ink">{item.title}</div>
                    <div className="text-xs text-ink-muted mt-0.5">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Scripture */}
          <div className="rounded-2xl bg-linear-to-br from-primary to-primary/80 text-primary-foreground p-6">
            <HandHeart className="h-8 w-8 mb-4 opacity-80" />
            <blockquote className="font-display text-lg leading-relaxed italic mb-3">
              "Do not be anxious about anything, but in every situation, by prayer and petition,
              with thanksgiving, present your requests to God."
            </blockquote>
            <cite className="text-sm opacity-70">Philippians 4:6</cite>
          </div>
        </aside>
      </div>
    </>
  );
}
