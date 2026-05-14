import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { settings } from "@/utils/mockData";
import { SectionHeading } from "@/components/SectionHeading";
import heroImg from "@/assets/bg_11.jpg";

const schema = z.object({
  name: z.string().min(2, "Please share your name"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "What's this about?"),
  message: z.string().min(10, "A few more words please"),
});
type FormData = z.infer<typeof schema>;

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Message sent — we'll be in touch soon.");
    reset();
    void data;
  };

  return (
    <>
      <section className="relative h-90 flex items-end overflow-hidden">
        <img src={heroImg} className="absolute inset-0 h-full w-full object-cover" />
        <div className="h-full w-full bg-linear-to-t from-primary to-primary/0 z-10 absolute" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-24 z-20">
          <SectionHeading
            eyebrow="Say hello"
            title="We'd love to hear from you"
            titleColor="white"
            description="Whether you're new, curious, or just want to say hi — drop us a line."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 bg-card border border-border rounded-2xl p-8 shadow-card"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input id="name" {...register("name")} aria-required />
                {errors.name && (
                  <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" {...register("email")} aria-required />
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input id="subject" {...register("subject")} aria-required />
              {errors.subject && (
                <p className="mt-1 text-xs text-destructive">{errors.subject.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea id="message" rows={6} {...register("message")} aria-required />
              {errors.message && (
                <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full sm:w-auto gap-2"
            >
              <Send className="h-4 w-4" /> {isSubmitting ? "Sending…" : "Send message"}
            </Button>
          </form>
        </div>

        <aside className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border p-8 bg-surface-elevated">
            <h3 className="font-display text-2xl text-ink mb-5">Visit us</h3>
            <ul className="space-y-4 text-ink-muted">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>{settings.email}</span>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border aspect-[4/3]">
            <iframe
              title="Map"
              className="w-full h-full"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-89.66%2C39.78%2C-89.62%2C39.81&layer=mapnik"
            />
          </div>
        </aside>
      </section>
    </>
  );
}
