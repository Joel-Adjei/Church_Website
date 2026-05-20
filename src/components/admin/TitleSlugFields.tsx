// import { useEffect, useRef } from "react";
// import type { UseFormReturn, FieldValues, Path } from "react-hook-form";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// // import { slugify } from "@/store/store";

// export function TitleSlugFields<T extends FieldValues>({
//   form, mode, titleField, slugField,
// }: {
//   form: UseFormReturn<T>;
//   mode: "new" | "edit";
//   titleField: Path<T>;
//   slugField: Path<T>;
// }) {
//   const title = form.watch(titleField);
//   const manualRef = useRef(mode !== "new");

//   useEffect(() => {
//     if (manualRef.current) return;
//     form.setValue(slugField, slugify(String(title ?? "")) as never, { shouldValidate: false, shouldDirty: false });
//   }, [title, form, slugField]);

//   const titleErr = (form.formState.errors as Record<string, { message?: string } | undefined>)[titleField as string];
//   const slugErr = (form.formState.errors as Record<string, { message?: string } | undefined>)[slugField as string];

//   return (
//     <>
//       <div className="space-y-2">
//         <Label htmlFor={titleField as string}>Title</Label>
//         <Input id={titleField as string} {...form.register(titleField)} />
//         {titleErr?.message && <p className="text-xs text-destructive">{titleErr.message}</p>}
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor={slugField as string}>Slug</Label>
//         <Input
//           id={slugField as string}
//           {...form.register(slugField, {
//             onChange: (e) => { manualRef.current = e.target.value !== slugify(String(form.getValues(titleField) ?? "")); },
//           })}
//         />
//         {slugErr?.message && <p className="text-xs text-destructive">{slugErr.message}</p>}
//       </div>
//     </>
//   );
// }
