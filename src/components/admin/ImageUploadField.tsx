import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageIcon, Loader2, UploadCloud, X } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";

export function ImageUploadField({
  label,
  value,
  onChange,
  hint,
  optional = true,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  optional?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-2">
      <Label>
        {label}{" "}
        {optional && <span className="text-ink-muted font-normal">(optional)</span>}
      </Label>

      {value ? (
        <div className="relative inline-flex flex-col gap-2">
          <div className="relative group">
            <img
              src={value}
              alt=""
              className="h-40 w-full max-w-xs object-cover rounded-xl border border-border"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="h-8 text-xs"
                onClick={() => ref.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <UploadCloud className="h-3.5 w-3.5 mr-1" /> Replace
                  </>
                )}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="h-8 text-xs"
                onClick={() => onChange("")}
              >
                <X className="h-3.5 w-3.5 mr-1" /> Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          disabled={uploading}
          className={`
            w-full max-w-xs flex flex-col items-center justify-center gap-2 h-36 rounded-xl border-2 border-dashed
            transition-all cursor-pointer text-sm
            ${dragging
              ? "border-primary bg-primary/5 text-primary"
              : "border-border hover:border-primary/50 hover:bg-muted/40 text-ink-muted"
            }
            ${uploading ? "opacity-60 cursor-not-allowed" : ""}
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              <span className="text-xs">Uploading…</span>
            </>
          ) : (
            <>
              <UploadCloud className={`h-7 w-7 ${dragging ? "text-primary" : "text-ink-muted"}`} />
              <span className="font-medium">Click or drag & drop</span>
              <span className="text-xs">PNG, JPG, WEBP, SVG</span>
            </>
          )}
        </button>
      )}

      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onInputChange}
      />
      {hint && <p className="text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}

export function MultiImageUpload({
  label,
  values,
  onChange,
  hint,
}: {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
  hint?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);

  async function handleFiles(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      toast.error("Please select image files only");
      return;
    }
    setUploading(true);
    setUploadTotal(imageFiles.length);
    setUploadCount(0);

    const results: string[] = [];
    for (const file of imageFiles) {
      try {
        const url = await uploadToCloudinary(file);
        results.push(url);
        setUploadCount((c) => c + 1);
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    onChange([...values, ...results]);
    setUploading(false);
    setUploadCount(0);
    setUploadTotal(0);
  }

  function removeAt(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {/* Drop zone */}
      <button
        type="button"
        onClick={() => ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        disabled={uploading}
        className={`
          w-full flex flex-col items-center justify-center gap-2 h-32 rounded-xl border-2 border-dashed
          transition-all cursor-pointer text-sm
          ${dragging
            ? "border-primary bg-primary/5 text-primary"
            : "border-border hover:border-primary/50 hover:bg-muted/40 text-ink-muted"
          }
          ${uploading ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        {uploading ? (
          <>
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
            <span className="text-xs">
              Uploading {uploadCount} / {uploadTotal}…
            </span>
          </>
        ) : (
          <>
            <UploadCloud className={`h-7 w-7 ${dragging ? "text-primary" : "text-ink-muted"}`} />
            <span className="font-medium">Click or drag & drop images</span>
            <span className="text-xs">Select multiple — PNG, JPG, WEBP</span>
          </>
        )}
      </button>

      {/* Preview grid */}
      {values.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {values.map((url, i) => (
            <div key={url + i} className="relative group aspect-square">
              {url ? (
                <img
                  src={url}
                  alt=""
                  className="w-full h-full object-cover rounded-lg border border-border"
                />
              ) : (
                <div className="w-full h-full rounded-lg border border-border bg-muted flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-ink-muted" />
                </div>
              )}
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {hint && <p className="text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}
