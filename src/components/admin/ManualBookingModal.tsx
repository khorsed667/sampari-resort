"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { rooms } from "@/data/rooms";
import { calculateRoomPrice } from "@/lib/pricing";
import { getUnavailableDatesForRoom } from "@/lib/availability";
import { ADVANCE_PAYMENT_TAKA } from "@/lib/constants";
import { addDaysISO } from "@/lib/utils";
import { addManualBooking } from "@/lib/bookingsStore";
import Calendar from "@/components/ui/Calendar";

export default function ManualBookingModal({
  isOpen,
  onClose,
  onAdded,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [totalOverride, setTotalOverride] = useState<number | null>(null);
  const [advance, setAdvance] = useState<number>(ADVANCE_PAYMENT_TAKA);
  const [notes, setNotes] = useState("");

  const room = rooms.find((r) => r.id === roomId);

  // Suggested from the pricing engine whenever the relevant inputs change —
  // a pure calculation during render, not a side effect. The admin can
  // still type over it, tracked separately as an override.
  const suggestedTotal =
    room && checkIn && checkOut
      ? calculateRoomPrice(room, new Date(checkIn), new Date(checkOut), guests).total
      : 0;
  const total = totalOverride ?? suggestedTotal;

  if (!isOpen) return null;

  const handleCheckInChange = (iso: string) => {
    setCheckIn(iso);
    const minCheckOut = addDaysISO(iso, 1);
    if (!checkOut || checkOut < minCheckOut) setCheckOut(minCheckOut);
  };

  const canSave = Boolean(room && checkIn && checkOut && name.trim());

  const handleSave = () => {
    if (!room || !checkIn || !checkOut || !name.trim()) return;
    addManualBooking({
      roomId: room.id,
      roomName: room.name,
      categoryLabel: room.categoryLabel,
      checkIn,
      checkOut,
      guests,
      guestDetails: { name: name.trim(), phone: phone.trim(), email: email.trim() },
      total,
      advance,
      notes: notes.trim() || undefined,
    });
    onAdded();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-end justify-center bg-forest/60 backdrop-blur-sm md:items-center md:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[92svh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-mist p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl md:rounded-[2rem] md:p-8">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-display text-xl text-forest">Add Manual Booking</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-mountain transition-colors hover:bg-forest/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-1.5 text-sm text-mountain">
          For a booking that came in by phone, walk-in, or another channel. This blocks the
          dates immediately.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <FormField label="Room">
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full rounded-xl border border-forest/15 bg-cream px-3.5 py-2.5 text-sm text-forest outline-none focus:border-forest/40"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} — {r.categoryLabel}
                </option>
              ))}
            </select>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Check-in">
              <Calendar
                label="Check-in"
                value={checkIn}
                onChange={handleCheckInChange}
                unavailableDates={room ? getUnavailableDatesForRoom(room.id) : []}
              />
            </FormField>
            <FormField label="Check-out">
              <Calendar
                label="Check-out"
                value={checkOut}
                onChange={setCheckOut}
                unavailableDates={room ? getUnavailableDatesForRoom(room.id) : []}
                minDate={checkIn ? new Date(addDaysISO(checkIn, 1)) : undefined}
              />
            </FormField>
          </div>

          <FormField label="Guests">
            <input
              type="number"
              min={1}
              max={12}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value) || 1)}
              className="w-full rounded-xl border border-forest/15 bg-cream px-3.5 py-2.5 text-sm text-forest outline-none focus:border-forest/40"
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Guest Name">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full rounded-xl border border-forest/15 bg-cream px-3.5 py-2.5 text-sm text-forest outline-none placeholder:text-sage focus:border-forest/40"
              />
            </FormField>
            <FormField label="Phone (optional)">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full rounded-xl border border-forest/15 bg-cream px-3.5 py-2.5 text-sm text-forest outline-none placeholder:text-sage focus:border-forest/40"
              />
            </FormField>
          </div>

          <FormField label="Email (optional)">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="guest@example.com"
              className="w-full rounded-xl border border-forest/15 bg-cream px-3.5 py-2.5 text-sm text-forest outline-none placeholder:text-sage focus:border-forest/40"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Total (৳)">
              <input
                type="number"
                min={0}
                value={total}
                onChange={(e) => setTotalOverride(e.target.value === "" ? 0 : Number(e.target.value))}
                className="w-full rounded-xl border border-forest/15 bg-cream px-3.5 py-2.5 text-sm text-forest outline-none focus:border-forest/40"
              />
            </FormField>
            <FormField label="Advance Received (৳)">
              <input
                type="number"
                min={0}
                value={advance}
                onChange={(e) => setAdvance(Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-forest/15 bg-cream px-3.5 py-2.5 text-sm text-forest outline-none focus:border-forest/40"
              />
            </FormField>
          </div>

          <FormField label="Notes (optional)">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Booked via phone call"
              className="w-full resize-none rounded-xl border border-forest/15 bg-cream px-3.5 py-2.5 text-sm text-forest outline-none placeholder:text-sage focus:border-forest/40"
            />
          </FormField>

          <button
            type="button"
            disabled={!canSave}
            onClick={handleSave}
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-mist transition-colors hover:bg-mountain disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
            Add Booking
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold tracking-[0.12em] text-sage uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}
