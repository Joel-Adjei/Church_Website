import { Skeleton } from "@/components/ui/skeleton";

interface EditFormSkeletonProps {
  inputs?: number;
  textareaRows?: number;
  hasImage?: boolean;
  maxWidth?: string;
}

export function EditFormSkeleton({
  inputs = 3,
  textareaRows = 6,
  hasImage = false,
  maxWidth = "max-w-2xl",
}: EditFormSkeletonProps) {
  return (
    <div>
      {/* Back button */}
      <Skeleton className="h-7 w-28 mb-4" />

      {/* Page title */}
      <Skeleton className="h-9 w-56 mb-8" />

      {/* Form card */}
      <div className={`${maxWidth} bg-background border border-border rounded-2xl p-6 space-y-5`}>
        {Array.from({ length: inputs }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}

        {hasImage && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-36 w-full rounded-xl" />
          </div>
        )}

        {textareaRows > 0 && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="w-full" style={{ height: `${textareaRows * 1.5}rem` }} />
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-2 justify-end pt-4 border-t border-border">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
    </div>
  );
}
