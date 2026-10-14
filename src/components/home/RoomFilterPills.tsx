"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FilterOption {
  id: string;
  label: string;
}

export default function RoomFilterPills({
  options,
  active,
  onChange,
}: {
  options: FilterOption[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Filter rooms by category"
      className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible"
    >
      {options.map((option) => {
        const isActive = option.id === active;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium tracking-wide transition-colors duration-300",
              isActive
                ? "border-forest text-forest"
                : "border-forest/15 text-mountain hover:border-forest/35 hover:text-forest"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="active-room-pill"
                className="absolute inset-0 rounded-full bg-forest/8"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
