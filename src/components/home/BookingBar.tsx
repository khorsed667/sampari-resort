"use client";

import { useState } from "react";
import { Users, BedDouble, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import Calendar from "@/components/ui/Calendar";
import SpreadDropdown from "@/components/ui/SpreadDropdown";
import { roomCategoryGroups } from "@/data/rooms";
import { getGlobalUnavailableDates } from "@/lib/availability";
import { addDaysISO } from "@/lib/utils";
import { useCheckAvailability } from "@/components/ui/CheckAvailabilityProvider";

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6].map((n) => ({
  value: String(n),
  label: `${n} ${n === 1 ? "Guest" : "Guests"}`,
}));

const ROOM_OPTIONS = [
  { value: "", label: "Any room" },
  ...roomCategoryGroups.map((group) => ({ value: group.category, label: group.categoryLabel })),
];

export default function BookingBar() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [room, setRoom] = useState("");
  const unavailableDates = getGlobalUnavailableDates();
  const { open: openCheckAvailability, search: searchAvailability } = useCheckAvailability();

  // Enforces a minimum one-night stay: picking a check-in date auto-advances
  // check-out to the next day if it isn't already a valid later date.
  const handleCheckInChange = (iso: string) => {
    setCheckIn(iso);
    const minCheckOut = addDaysISO(iso, 1);
    if (!checkOut || checkOut < minCheckOut) {
      setCheckOut(minCheckOut);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkIn && checkOut) {
      searchAvailability({
        checkIn,
        checkOut,
        guests: Number(guests),
        categoryId: room || undefined,
      });
    } else {
      openCheckAvailability({
        roomCategory: room || undefined,
        checkIn: checkIn || undefined,
        checkOut: checkOut || undefined,
        guests: Number(guests),
      });
    }
  };

  return (
    <div className="relative z-20 -mt-16 md:-mt-12">
      <Container>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 rounded-3xl bg-mist/95 p-6 shadow-xl shadow-forest/10 ring-1 ring-forest/5 backdrop-blur-sm sm:grid-cols-2 md:grid-cols-5 md:items-end md:gap-4 md:p-7"
        >
          <Field label="Check-in">
            <Calendar
              label="Check-in"
              value={checkIn}
              onChange={handleCheckInChange}
              unavailableDates={unavailableDates}
            />
          </Field>

          <Field label="Check-out">
            <Calendar
              label="Check-out"
              value={checkOut}
              onChange={setCheckOut}
              unavailableDates={unavailableDates}
              minDate={checkIn ? new Date(addDaysISO(checkIn, 1)) : undefined}
            />
          </Field>

          <Field label="Guests" icon={<Users className="h-4 w-4" />}>
            <SpreadDropdown
              label="Guests"
              icon={<Users className="h-4 w-4" />}
              value={guests}
              options={GUEST_OPTIONS}
              onChange={setGuests}
            />
          </Field>

          <Field label="Room" icon={<BedDouble className="h-4 w-4" />}>
            <SpreadDropdown
              label="Room"
              icon={<BedDouble className="h-4 w-4" />}
              value={room}
              options={ROOM_OPTIONS}
              onChange={setRoom}
              placeholder="Any room"
            />
          </Field>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-2xl bg-forest px-6 py-4 text-sm font-medium tracking-wide text-mist transition-colors duration-300 hover:bg-mountain md:h-full"
          >
            Check Availability
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </Container>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-forest/10 pb-2 md:border-b-0 md:pb-0">
      <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] text-sage uppercase">
        {icon}
        {label}
      </span>
      {children}
    </div>
  );
}
