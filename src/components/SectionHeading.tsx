import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  titleColor = "ink",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center" | "right";
  titleColor?: "white" | "ink";
}) {
  return (
    <div
      className={`${align === "center" ? "text-center max-w-3xl mx-auto" : align === "right" ? "lg:text-right  max-w-3xl mx-auto" : "max-w-3xl"}`}
    >
      {eyebrow && (
        <span className="inline-block text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">
          {eyebrow}
        </span>
      )}
      <h2
        className={`"font-display text-5xl md:text-6xl  leading-[1.05] ${titleColor == "white" ? "text-white" : "text-ink"}`}
      >
        {title}
      </h2>
      {description && <p className="mt-4 text-lg leading-relaxed text-white">{description}</p>}
    </div>
  );
}
