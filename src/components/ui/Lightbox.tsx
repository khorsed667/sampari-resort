"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LightboxItem {
  src: string;
  alt: string;
  /** Human-readable group used for the filter tabs, e.g. "Cottages", "Views". Omit to hide filtering for this item. */
  categoryLabel?: string;
}

interface LightboxProps {
  items: LightboxItem[];
  index: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export default function Lightbox({
  items,
  index,
  isOpen,
  onClose,
  onIndexChange,
}: LightboxProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [lastItems, setLastItems] = useState(items);

  // Reset the category filter whenever a fresh set of items is opened.
  // Derived during render (not in an effect) to avoid an extra render pass.
  if (items !== lastItems) {
    setLastItems(items);
    if (activeCategory !== "All") setActiveCategory("All");
  }

  const categories = Array.from(
    new Set(items.map((item) => item.categoryLabel).filter(Boolean))
  ) as string[];

  const visibleItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.categoryLabel === activeCategory);

  const current = visibleItems[Math.min(index, visibleItems.length - 1)];

  const goNext = useCallback(() => {
    if (visibleItems.length === 0) return;
    onIndexChange((index + 1) % visibleItems.length);
  }, [index, visibleItems.length, onIndexChange]);

  const goPrev = useCallback(() => {
    if (visibleItems.length === 0) return;
    onIndexChange((index - 1 + visibleItems.length) % visibleItems.length);
  }, [index, visibleItems.length, onIndexChange]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, goNext, goPrev]);

  if (!isOpen || !current) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
      className="fixed inset-0 z-[80] flex flex-col bg-forest/97 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top bar: category filter tabs + counter + close */}
      <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8 md:py-6">
        <div className="flex flex-1 gap-2 overflow-x-auto scrollbar-none">
          {categories.length > 1 && (
            <>
              <FilterTab
                label="All"
                active={activeCategory === "All"}
                onClick={() => {
                  setActiveCategory("All");
                  onIndexChange(0);
                }}
              />
              {categories.map((cat) => (
                <FilterTab
                  key={cat}
                  label={cat}
                  active={activeCategory === cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    onIndexChange(0);
                  }}
                />
              ))}
            </>
          )}
        </div>

        <span className="shrink-0 font-serif-display text-sm tracking-wide text-cream/70">
          {String(index + 1).padStart(2, "0")} / {String(visibleItems.length).padStart(2, "0")}
        </span>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="shrink-0 rounded-full p-2 text-mist transition-colors hover:bg-mist/10"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Main image stage */}
      <div className="relative flex flex-1 items-center justify-center px-4 pb-6 md:px-20">
        <div className="relative h-full w-full max-w-5xl">
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            sizes="90vw"
            className="object-contain"
            priority
          />
        </div>

        {visibleItems.length > 1 && (
          <>
            <NavButton direction="prev" onClick={goPrev} />
            <NavButton direction="next" onClick={goNext} />
          </>
        )}
      </div>

      {current.alt && (
        <p className="px-6 pb-6 text-center text-sm text-cream/60 md:pb-8">
          {current.alt}
        </p>
      )}
    </div>
  );
}

function FilterTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide transition-colors duration-300",
        active
          ? "border-sand bg-sand/15 text-sand"
          : "border-cream/25 text-cream/60 hover:border-cream/50 hover:text-cream/90"
      )}
    >
      {label}
    </button>
  );
}

function NavButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous image" : "Next image"}
      className={cn(
        "absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-mist/10 p-2 text-mist backdrop-blur-sm transition-colors hover:bg-mist/20 md:p-3",
        direction === "prev" ? "left-2 md:left-4" : "right-2 md:right-4"
      )}
    >
      <Icon className="h-5 w-5 md:h-6 md:w-6" />
    </button>
  );
}
