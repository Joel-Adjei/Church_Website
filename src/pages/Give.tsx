import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, HandCoins, Globe, Building2, Users, Gift, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/utils/utils";
import { useSubmitGiving } from "@/services/queries";
import type { GivingCategory } from "@/types";
import heroImg from "@/assets/bg_08.jpg";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  amount: z
    .number({ invalid_type_error: "Enter an amount" })
    .positive("Amount must be greater than 0"),
  category: z.enum(["tithe", "offering", "missions", "building-fund", "benevolence", "other"]),
  message: z.string().optional(),
  anonymous: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const PRESET_AMOUNTS = [50, 100, 200, 500, 1000];

const CATEGORIES: {
  value: GivingCategory;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  { value: "tithe", label: "Tithe", description: "Return 10% as an act of worship", icon: Heart },
  {
    value: "offering",
    label: "General Offering",
    description: "Support the general ministry fund",
    icon: HandCoins,
  },
  {
    value: "missions",
    label: "Missions",
    description: "Fund global outreach & evangelism",
    icon: Globe,
  },
  {
    value: "building-fund",
    label: "Building Fund",
    description: "Contribute to our sanctuary project",
    icon: Building2,
  },
  {
    value: "benevolence",
    label: "Benevolence",
    description: "Help members & families in need",
    icon: Users,
  },
  { value: "other", label: "Other", description: "Designate your gift as needed", icon: Gift },
];

export default function Give() {
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const submit = useSubmitGiving();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      category: "offering",
      message: "",
      anonymous: false,
      amount: undefined,
    },
  });

  function pickPreset(val: number) {
    setSelectedPreset(val);
    setCustomAmount("");
    form.setValue("amount", val, { shouldValidate: true });
  }

  function handleCustomAmountChange(raw: string) {
    setCustomAmount(raw);
    setSelectedPreset(null);
    const parsed = parseFloat(raw);
    form.setValue("amount", isNaN(parsed) ? (undefined as unknown as number) : parsed, {
      shouldValidate: true,
    });
  }

  async function onSubmit(data: FormValues) {
    try {
      await submit.mutateAsync(data);
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="font-display text-3xl text-ink mb-3">Thank You!</h1>
          <p className="text-ink-muted text-lg mb-2">Your gift has been received.</p>
          <p className="text-ink-muted text-sm mb-8">
            A confirmation will be sent to your email. May God bless your generosity.
          </p>
          <Button
            onClick={() => {
              setSubmitted(false);
              form.reset();
              setSelectedPreset(null);
              setCustomAmount("");
            }}
          >
            Give Again
          </Button>
        </div>
      </div>
    );
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const selectedCategory = watch("category");
  const isAnonymous = watch("anonymous");

  return (
    <div className="min-h-screen  bg-surface-elevated">
      {/* Hero */}
      <div className="relative h-120 overflow-hidden bg-primary text-primary-foreground">
        <img src={heroImg} className="absolute inset-0 h-full w-full object-cover" />
        <div className="h-full w-full bg-linear-to-t from-primary to-primary/0 z-10 absolute" />
        <div
          className="absolute inset-0 opacity-10 z-10"
          style={{
            backgroundImage: "radial-gradient(circle at 70% 50%, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 py-16 text-center z-20">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
            <Heart className="h-7 w-7" />
          </div>
          <h1 className="font-display text-primary text-4xl lg:text-7xl sm:text-5xl mb-4">
            Give with a Cheerful Heart
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">
            "Each of you should give what you have decided in your heart to give, not reluctantly or
            under compulsion, for God loves a cheerful giver." — 2 Corinthians 9:7
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Amount */}
          <section className="bg-background rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="font-display text-xl text-ink mb-1">Choose an Amount</h2>
            <p className="text-sm text-ink-muted mb-6">All amounts are in Ghana Cedis (GHS ₵)</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
              {PRESET_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => pickPreset(val)}
                  className={cn(
                    "rounded-xl border-2 py-3 text-sm font-semibold transition-all",
                    selectedPreset === val
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface-elevated text-ink hover:border-primary/50",
                  )}
                >
                  ₵{val}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted font-medium">
                ₵
              </span>
              <Input
                type="number"
                min="1"
                step="0.01"
                placeholder="Enter custom amount"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="pl-8"
              />
            </div>
            {errors.amount && (
              <p className="mt-1.5 text-sm text-destructive">{errors.amount.message}</p>
            )}
          </section>

          {/* Category */}
          <section className="bg-background rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="font-display text-xl text-ink mb-1">Giving Category</h2>
            <p className="text-sm text-ink-muted mb-6">Where would you like your gift to go?</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const active = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setValue("category", cat.value)}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all",
                      active
                        ? "border-primary bg-primary/5"
                        : "border-border bg-surface-elevated hover:border-primary/40",
                    )}
                  >
                    <div className="mt-0.5 shrink-0 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div
                        className={cn(
                          "text-sm font-semibold",
                          active ? "text-primary" : "text-ink",
                        )}
                      >
                        {cat.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Personal Info */}
          <section className="bg-background rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="font-display text-xl text-ink mb-1">Your Information</h2>
            <p className="text-sm text-ink-muted mb-6">
              We'll send a giving receipt to your email.
            </p>

            <div
              className={cn(
                "space-y-4",
                isAnonymous && "opacity-50 pointer-events-none select-none",
              )}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" placeholder="John" {...register("firstName")} />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" placeholder="Doe" {...register("lastName")} />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">
                  Phone number <span className="text-ink-muted">(optional)</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+233 00 000 0000"
                  {...register("phone")}
                />
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-border bg-surface-elevated p-4">
              <Checkbox
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={(checked) => {
                  setValue("anonymous", !!checked);
                  if (checked) {
                    setValue("firstName", "Anonymous");
                    setValue("lastName", "");
                    setValue("email", "anon@gracecathedral.org");
                    setValue("phone", "");
                  } else {
                    setValue("firstName", "");
                    setValue("lastName", "");
                    setValue("email", "");
                  }
                }}
              />
              <div>
                <Label htmlFor="anonymous" className="font-medium cursor-pointer">
                  Give anonymously
                </Label>
                <p className="text-xs text-ink-muted mt-0.5">
                  Your name will not appear in any public records.
                </p>
              </div>
            </div>
          </section>

          {/* Message */}
          <section className="bg-background rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="font-display text-xl text-ink mb-1">
              Leave a Note <span className="text-base font-normal text-ink-muted">(optional)</span>
            </h2>
            <p className="text-sm text-ink-muted mb-4">Share what's on your heart as you give.</p>
            <Textarea
              placeholder="e.g. Grateful for God's blessing this month…"
              rows={3}
              {...register("message")}
            />
          </section>

          {/* Submit */}
          <div className="flex flex-col items-center gap-3 pb-8">
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto sm:min-w-64 gap-2 text-base"
              disabled={submit.isPending}
            >
              <Heart className="h-4 w-4" />
              {submit.isPending ? "Processing…" : "Complete My Gift"}
            </Button>
            <p className="text-xs text-ink-muted text-center max-w-xs">
              Your giving is secure and goes directly to support the ministry of Grace Cathedral.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
