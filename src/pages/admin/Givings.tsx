import { useAccounts, useDeleteAccount } from "@/services/queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Smartphone, Building2, CreditCard, Layers, Pencil, Hash, User } from "lucide-react";
import type { Account } from "@/types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const channelConfig = {
  momo: { label: "Mobile Money", icon: Smartphone, color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  bank: { label: "Bank Transfer", icon: Building2, color: "bg-blue-50 text-blue-700 border-blue-200" },
  card: { label: "Card Payment", icon: CreditCard, color: "bg-purple-50 text-purple-700 border-purple-200" },
  other: { label: "Other", icon: Layers, color: "bg-gray-50 text-gray-700 border-gray-200" },
};

function AccountCard({ a, onDelete }: { a: Account; onDelete: () => Promise<void> }) {
  const config = channelConfig[a.channel_type] ?? channelConfig.other;
  const Icon = config.icon;

  return (
    <div className="relative rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.color}`}>
          <Icon className="h-3.5 w-3.5" />
          {config.label}
        </div>
        {!a.is_active && (
          <Badge variant="outline" className="text-xs text-muted-foreground">Inactive</Badge>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="font-medium truncate">{a.account_name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Hash className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="font-mono text-muted-foreground">{a.account_number}</span>
        </div>
        {a.bank_name && (
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground truncate">{a.bank_name}{a.branch ? ` · ${a.branch}` : ""}</span>
          </div>
        )}
        {a.network && (
          <div className="text-xs text-muted-foreground pl-5">Network: {a.network}</div>
        )}
        {a.currency && (
          <div className="text-xs text-muted-foreground pl-5">Currency: {a.currency}</div>
        )}
      </div>

      {a.instructions && (
        <p className="text-xs text-muted-foreground border-t pt-3 leading-relaxed">{a.instructions}</p>
      )}

      <div className="flex items-center justify-end gap-1 border-t pt-3">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 h-8 text-xs">
          <Link to={`/admin/givings/${a.id}`}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Link>
        </Button>
        <DeleteConfirm
          title={`Delete "${a.bank_name || a.account_name}"?`}
          onConfirm={onDelete}
        />
      </div>
    </div>
  );
}

export default function Givings() {
  const { data: accounts, isLoading: fetchingAccounts } = useAccounts();
  const remove = useDeleteAccount();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Givings"
        description="Set Account details for giving"
        newHref="/admin/givings/new"
      />

      {fetchingAccounts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : accounts?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center text-muted-foreground">
          <Layers className="h-8 w-8 mb-3 opacity-40" />
          <p className="text-sm font-medium">No giving accounts found</p>
          <p className="text-xs mt-1">Add an account to enable giving options for your congregation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts?.map((a: Account) => (
            <AccountCard
              key={a.id}
              a={a}
              onDelete={async () => {
                await remove.mutateAsync(a.id);
                toast.success("Account deleted");
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
