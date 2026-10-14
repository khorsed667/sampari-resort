import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-6 md:px-10", className)}>
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  heading,
  subtitle,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  heading: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-xs font-semibold tracking-[0.2em] uppercase",
            light ? "text-sand" : "text-sage"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-serif-display text-3xl font-medium leading-[1.15] tracking-tight md:text-[2.75rem]",
          light ? "text-mist" : "text-forest"
        )}
      >
        {heading}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed md:text-lg",
            light ? "text-cream/80" : "text-mountain"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
