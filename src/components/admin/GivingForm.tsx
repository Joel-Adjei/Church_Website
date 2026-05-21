import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAccount, useUpdateAccount } from "@/services/queries";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import type { Account } from "@/types";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectGroup,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";

const schema = z.object({
  name: z.string().min(2, "Name is required").max(200),
  channel_type: z.enum(["momo", "bank", "card", "other"]),
  account_name: z.string().min(2, "Account name is required"),
  account_number: z.string().min(2, "Account number is required"),
  bank_name: z.string().optional(),
  branch: z.string().optional(),
  network: z.string().optional(),
  currency: z.string().optional(),
  instructions: z.string().trim().min(2, "Instructions are required").max(8000),
  is_active: z.literal(true),
  // display_order: z.number().min(0, "Display order must be a positive number"),
});
type Values = z.infer<typeof schema>;

export function GivingForm({ initial, mode }: { initial?: Account; mode: "new" | "edit" }) {
  const navigate = useNavigate();
  const create = useCreateAccount();
  const update = useUpdateAccount();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          name: initial.name,
          channel_type: initial.channel_type,
          account_name: initial.account_name,
          account_number: initial.account_number,
          bank_name: initial.bank_name,
          branch: initial.branch,
          network: initial.network,
          currency: initial.currency,
          instructions: initial.instructions,
          is_active: initial.is_active,
          // display_order: initial.display_order,
        }
      : {
          name: "",
          channel_type: "momo",
          account_name: "",
          account_number: "",
          bank_name: "",
          branch: "",
          network: "",
          currency: "GHC",
          instructions: "",
          is_active: true,
          // display_order: 0,
        },
  });

  async function onSubmit(values: Values) {
    try {
      if (mode === "new") await create.mutateAsync(values);
      else if (initial) await update.mutateAsync({ id: initial.id, ...values });
      toast.success(mode === "new" ? "Account created" : "Account updated");
      navigate("/admin/givings");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  const networks = ["MTN", "Telecel", "Artel | Tigo"];
  const currency = ["GHC", "USD", "Others"];

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="-ml-3 gap-1.5 mb-4">
        <Link to="/admin/givings">
          <ArrowLeft className="h-4 w-4" /> Givings
        </Link>
      </Button>
      <h1 className="font-display text-3xl text-ink mb-8">
        {mode === "new" ? "New giving account" : "Edit giving account"}
      </h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 mx-auto max-w-3xl bg-background border border-border rounded-2xl p-6"
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="channel_type">Channel Type</Label>
          <Controller
            control={form.control}
            name="channel_type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select channel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="momo">Mobile Money</SelectItem>
                    <SelectItem value="bank">Bank</SelectItem>
                    {/* <SelectItem value="other">Other</SelectItem> */}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          {form.formState.errors.channel_type && (
            <p className="text-xs text-destructive">{form.formState.errors.channel_type.message}</p>
          )}
        </div>

        <div className="flex w-full md:items-center  flex-col md:flex-row gap-5">
          <div className="flex-1 space-y-2">
            <Label htmlFor="account_name">Account Name</Label>
            <Input id="account_name" {...form.register("account_name")} />
            {form.formState.errors.account_name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.account_name.message}
              </p>
            )}
          </div>

          <div className="space-x-2">
            <Label htmlFor="is_active">Is Active</Label>
            <Controller
              name="is_active"
              control={form.control}
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="account_number">Account Number</Label>
            <Input id="account_number" {...form.register("account_number")} />
            {form.formState.errors.account_number && (
              <p className="text-xs text-destructive">
                {form.formState.errors.account_number.message}
              </p>
            )}
          </div>
          {form.watch("channel_type") === "bank" ? (
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Controller
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {currency.map((n) => (
                          <SelectItem value={n}>{n}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.network && (
                <p className="text-xs text-destructive">{form.formState.errors.network.message}</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="network">Network</Label>
              <Controller
                control={form.control}
                name="network"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {networks.map((n) => (
                          <SelectItem value={n}>{n}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.network && (
                <p className="text-xs text-destructive">{form.formState.errors.network.message}</p>
              )}
            </div>
          )}
        </div>
        {form.watch("channel_type") === "bank" ? (
          <>
            <div className="flex-1 space-y-2">
              <Label htmlFor="bank_name">Bank Name</Label>
              <Input id="bank_name" {...form.register("bank_name")} />
              {form.formState.errors.bank_name && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.bank_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Input id="branch" {...form.register("branch")} />
              {form.formState.errors.branch && (
                <p className="text-xs text-destructive">{form.formState.errors.branch.message}</p>
              )}
            </div>
          </>
        ) : null}

        <Separator className="my-6" />

        <div className="space-y-2">
          <Label htmlFor="instructions">Instructions</Label>
          <Textarea id="instructions" rows={4} {...form.register("instructions")} />
          {form.formState.errors.instructions && (
            <p className="text-xs text-destructive">{form.formState.errors.instructions.message}</p>
          )}
        </div>

        {/* <div className="space-y-2">
          <Label htmlFor="display_order">Display Order</Label>
          <Input
            id="display_order"
            type="number"
            min={0}
            {...form.register("display_order", { valueAsNumber: true })}
          />
          {form.formState.errors.display_order && (
            <p className="text-xs text-destructive">
              {form.formState.errors.display_order.message}
            </p>
          )}
        </div> */}

        <div className="flex gap-2 justify-end pt-2 border-t border-border">
          <Button type="button" variant="outline" asChild>
            <Link to="/admin/givings">Cancel</Link>
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
