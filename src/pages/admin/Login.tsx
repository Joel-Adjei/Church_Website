import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useSiteSetting } from "@/store/setting";

const schema = z.object({
  email: z.string().email().trim().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { church_name, logo_url } = useSiteSetting();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      await login(values.email, values.password);
      const params = new URLSearchParams(window.location.search);
      navigate(params.get("redirect") ?? "/admin");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid credentials. Please try again.");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-surface-elevated px-4">
      <div className="w-full max-w-md bg-background border border-border rounded-2xl shadow-card p-8">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="flex h-9 w-9 items-center justify-center text-primary-foreground font-display">
            <img src={logo_url} className="size-full object-contain" />
          </div>
          <span className="font-display text-xl">{church_name || "Potters House Church"}</span>
        </Link>
        <h1 className="font-display text-3xl text-ink">Admin sign in</h1>
        <p className="mt-2 text-sm text-ink-muted">Sign in to manage your church content.</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="pr-10"
                {...form.register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-muted hover:text-ink"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {!showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          {error && (
            <div
              role="alert"
              className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-md p-3"
            >
              {error}
            </div>
          )}
          <Button type="submit" className="w-full gap-2" disabled={form.formState.isSubmitting}>
            <LogIn className="h-4 w-4" /> {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
