import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

export function ImageUploadField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  function pick(file: File) {
    setBusy(true);
    const reader = new FileReader();
    reader.onload = () => { onChange(String(reader.result)); setBusy(false); };
    reader.onerror = () => setBusy(false);
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value ? (
        <div className="flex items-start gap-3">
          <img src={value} alt="" className="h-24 w-24 object-cover rounded-md border border-border bg-muted" />
          <div className="flex flex-col gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => ref.current?.click()}>
              <Upload className="h-3.5 w-3.5 mr-1.5" /> Replace
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
              <X className="h-3.5 w-3.5 mr-1.5" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <Button type="button" variant="outline" onClick={() => ref.current?.click()} disabled={busy}>
          <Upload className="h-4 w-4 mr-2" /> {busy ? "Uploading…" : "Upload image"}
        </Button>
      )}
      <Input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) pick(f); e.target.value = ""; }}
      />
      {hint && <p className="text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}
