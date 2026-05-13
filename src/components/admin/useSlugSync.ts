import { useEffect, useRef } from "react";
import type { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { slugify } from "@/store/store";

export function useSlugSync<T extends FieldValues>(
  form: UseFormReturn<T>,
  titleField: Path<T>,
  slugField: Path<T>,
  enabled: boolean,
) {
  const title = form.watch(titleField);
  const slug = form.watch(slugField);
  const manualRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    if (manualRef.current) return;
    const desired = slugify(String(title ?? ""));
    if (desired !== slug) {
      form.setValue(slugField, desired as never, { shouldValidate: false, shouldDirty: false });
    }
  }, [title, enabled, form, slug, slugField]);

  return {
    onSlugChange: (v: string) => {
      manualRef.current = v !== slugify(String(title ?? ""));
    },
  };
}
