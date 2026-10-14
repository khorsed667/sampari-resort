"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function Calendar({
  label,
  value,
  onChange,
  unavailableDates = [],
  minDate,
}: {
  label: string;
  value: string;
  onChange: (iso: string) => void;
  unavailableDates?: string[];
  /** Earliest selectable date — defaults to today. */
  minDate?: Date;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const today = startOfDay(new Date());
  const floor = minDate ? startOfDay(minDate) : today;

  const initialMonth = value ? new Date(value) : floor;
  const [viewMonth, setViewMonth] = useState(
    new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1)
  );

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const unavailableSet = new Set(unavailableDates);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekday = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const goPrevMonth = () => setViewMonth(new Date(year, month - 1, 1));
  const goNextMonth = () => setViewMonth(new Date(year, month + 1, 1));

  const canGoPrev = new Date(year, month, 1) > new Date(floor.getFullYear(), floor.getMonth(), 1);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-label={`${label}: ${value ? formatDisplay(value) : "not set"}`}
        className="flex w-full items-center justify-between gap-2 bg-transparent text-left text-sm text-forest outline-none"
      >
        <span className={value ? "text-forest" : "text-sage"}>
          {value ? formatDisplay(value) : "Select date"}
        </span>
        <CalendarDays className="h-4 w-4 shrink-0 text-sage" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-20 mt-2 w-72 rounded-2xl border border-forest/10 bg-mist p-3 shadow-lg shadow-forest/10">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={goPrevMonth}
              disabled={!canGoPrev}
              aria-label="Previous month"
              className="flex h-6 w-6 items-center justify-center rounded-full text-forest transition-colors hover:bg-forest/5 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="text-xs font-medium text-forest">
              {MONTH_LABELS[month]} {year}
            </span>
            <button
              type="button"
              onClick={goNextMonth}
              aria-label="Next month"
              className="flex h-6 w-6 items-center justify-center rounded-full text-forest transition-colors hover:bg-forest/5"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-2 grid grid-cols-7 gap-y-1 text-center">
            {WEEKDAY_LABELS.map((d) => (
              <span key={d} className="text-[9px] font-semibold tracking-wide text-sage">
                {d}
              </span>
            ))}

            {cells.map((date, i) => {
              if (!date) return <span key={`blank-${i}`} />;

              const iso = toISODate(date);
              const isPast = startOfDay(date) < floor;
              const isBooked = unavailableSet.has(iso);
              const isDisabled = isPast || isBooked;
              const isSelected = value === iso;
              const isToday = toISODate(today) === iso;

              return (
                <button
                  key={iso}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    onChange(iso);
                    setIsOpen(false);
                  }}
                  aria-label={`${iso}${isBooked ? " — booked" : isPast ? " — unavailable" : ""}`}
                  className={cn(
                    "relative mx-auto flex h-7 w-7 items-center justify-center rounded-full text-[11px] transition-colors",
                    isSelected && "bg-forest text-mist font-semibold",
                    !isSelected && !isDisabled && "text-forest hover:bg-forest/10",
                    !isSelected && isBooked && "text-brown/50 line-through cursor-not-allowed",
                    !isSelected && isPast && !isBooked && "text-sage/40 cursor-not-allowed",
                    isToday && !isSelected && "ring-1 ring-forest/30"
                  )}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-2.5 flex items-center justify-center gap-3 border-t border-forest/10 pt-2 text-[9px] text-mountain">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-forest/15 ring-1 ring-forest/30" />
              Available
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-brown/40" />
              Booked
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-forest" />
              Selected
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
