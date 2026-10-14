"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
}

const SPREAD_DURATION = 0.5;

export default function SpreadDropdown({
  label,
  icon,
  value,
  options,
  onChange,
  placeholder = "Select",
}: {
  label: string;
  icon?: React.ReactNode;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Standard SSR-safe portal mount-detection: document.body only exists in
  // the browser, so the portal target is deferred to after first mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const selected = options.find((o) => o.value === value);

  const handleOpen = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
    setIsOpen(true);
  };

  const panel = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="listbox"
          aria-label={label}
          className="fixed inset-0 z-[95] flex items-start justify-center p-4 pt-20 md:pt-28"
          style={{ transformOrigin: `${origin.x}px ${origin.y}px` }}
          initial={{ opacity: 0, scale: 0.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.05 }}
          transition={{ duration: SPREAD_DURATION, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="absolute inset-0 -z-10 bg-forest/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Anchored to a fixed top offset (not vertically centered) so the
              header and close button land in exactly the same screen
              position every time, regardless of how many options this
              particular dropdown has. */}
          <div className="relative flex max-h-[65vh] w-full max-w-sm flex-col overflow-hidden rounded-3xl bg-mist shadow-2xl">
            <div className="flex items-center justify-between border-b border-forest/10 p-5">
              <span className="flex items-center gap-2 text-sm font-semibold tracking-wide text-forest">
                {icon}
                {label}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full text-mountain transition-colors hover:bg-forest/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ul className="flex-1 overflow-y-auto p-2">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <li key={option.value || "empty"}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-colors",
                        isSelected
                          ? "bg-forest/8 font-medium text-forest"
                          : "text-mountain hover:bg-forest/5"
                      )}
                    >
                      {option.label}
                      {isSelected && <Check className="h-4 w-4 shrink-0 text-forest" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-2 bg-transparent text-left text-sm text-forest outline-none"
      >
        <span className={selected ? "text-forest" : "text-sage"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-sage" />
      </button>

      {mounted && createPortal(panel, document.body)}
    </>
  );
}
