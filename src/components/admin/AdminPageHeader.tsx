import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminPageHeader({
  title,
  description,
  newHref,
  newLabel = "New",
}: {
  title: string;
  description?: string;
  newHref?: string;
  newLabel?: string;
}) {
  return (
    <div className="flex items-start sm:items-end justify-between gap-4 flex-wrap mb-6 sm:mb-8">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl text-ink">{title}</h1>
        {description && <p className="mt-2 text-ink-muted">{description}</p>}
      </div>
      {newHref && (
        <Button asChild className="gap-1.5">
          <Link to={newHref}><Plus className="h-4 w-4" /> {newLabel}</Link>
        </Button>
      )}
    </div>
  );
}

export function AdminCard({ children }: { children: ReactNode }) {
  return <div className="bg-background border border-border rounded-2xl">{children}</div>;
}
