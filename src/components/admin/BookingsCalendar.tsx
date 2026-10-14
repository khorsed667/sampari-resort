"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BookingRecord } from "@/types/booking";
import { expandDateRange, cn } from "@/lib/utils";

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

export default function BookingsCalendar({
  bookings,
  roomId,
}: {
  bookings: BookingRecord[];
  roomId: string;
}) {
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const roomBookings = useMemo(
    () => bookings.filter((b) => b.roomId === roomId && b.status === "confirmed"),
    [bookings, roomId]
  );

  // Map each booked ISO date to which source booked it, so the calendar can
  // colour website vs. manually-entered bookings differently.
  const dateSourceMap = useMemo(() => {
    const map = new Map<string, "website" | "manual">();
    roomBookings.forEach((b) => {
      expandDateRange(b.checkIn, b.checkOut).forEach((d) => map.set(d, b.source));
    });
    return map;
  }, [roomBookings]);

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

  const today = toISODate(new Date());

  return (
    <div className="rounded-3xl bg-mist p-5 md:p-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewMonth(new Date(year, month - 1, 1))}
          aria-label="Previous month"
          className="flex h-8 w-8 items-center justify-center rounded-full text-forest transition-colors hover:bg-forest/5"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium text-forest">
          {MONTH_LABELS[month]} {year}
        </span>
        <button
          type="button"
          onClick={() => setViewMonth(new Date(year, month + 1, 1))}
          aria-label="Next month"
          className="flex h-8 w-8 items-center justify-center rounded-full text-forest transition-colors hover:bg-forest/5"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
        {WEEKDAY_LABELS.map((d) => (
          <span key={d} className="text-[10px] font-semibold tracking-wide text-sage">
            {d}
          </span>
        ))}

        {cells.map((date, i) => {
          if (!date) return <span key={`blank-${i}`} />;
          const iso = toISODate(date);
          const source = dateSourceMap.get(iso);
          const isToday = iso === today;

          return (
            <div
              key={iso}
              title={source ? (source === "website" ? "Website booking" : "Manual entry") : undefined}
              className={cn(
                "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs transition-colors",
                source === "website" && "bg-forest text-mist font-semibold",
                source === "manual" && "bg-brown text-mist font-semibold",
                !source && "text-forest",
                isToday && !source && "ring-1 ring-forest/30"
              )}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 border-t border-forest/10 pt-3 text-[11px] text-mountain">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-forest" />
          Website Booking
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-brown" />
          Manual Entry
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-forest/15 ring-1 ring-forest/30" />
          Available
        </span>
      </div>
    </div>
  );
}
