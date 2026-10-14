"use client";

import { useEffect, useRef, useState } from "react";
import { X, Users, BedDouble, Send, Search, User, Phone, Mail, Loader2 } from "lucide-react";
import { rooms, roomCategoryGroups, extraGuestCharge } from "@/data/rooms";
import { getUnavailableDatesForRoom, getGlobalUnavailableDates } from "@/lib/availability";
import { getWeekdayPrice, calculateRoomPrice, formatTaka } from "@/lib/pricing";
import { ADVANCE_PAYMENT_TAKA } from "@/lib/constants";
import { addDaysISO } from "@/lib/utils";
import Calendar from "@/components/ui/Calendar";
import SpreadDropdown from "@/components/ui/SpreadDropdown";

export interface AvailabilitySearchFields {
  checkIn: string;
  checkOut: string;
  guests: number;
  categoryId?: string;
  roomId?: string;
  guestDetails?: { name: string; phone: string; email: string };
}

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6].map((n) => ({
  value: String(n),
  label: `${n} ${n === 1 ? "Guest" : "Guests"}`,
}));

export interface BookingTarget {
  category?: string;
  roomId?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  mode?: "locked" | "group" | "generic";
}

export default function CheckAvailabilityModal({
  isOpen,
  onClose,
  bookingTarget,
  onSearch,
  isSubmitting = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  bookingTarget?: BookingTarget;
  onSearch: (fields: AvailabilitySearchFields) => void;
  isSubmitting?: boolean;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [lastOpen, setLastOpen] = useState(isOpen);

  // Reset fields to match a freshly-opened booking target — derived during
  // render (not in an effect) to avoid an extra render pass.
  if (isOpen !== lastOpen) {
    setLastOpen(isOpen);
    if (isOpen) {
      setSelectedRoomId(bookingTarget?.roomId);
      setSelectedCategoryId(bookingTarget?.category);
      const initCheckIn = bookingTarget?.checkIn ?? "";
      let initCheckOut = bookingTarget?.checkOut ?? "";
      if (initCheckIn && (!initCheckOut || initCheckOut <= initCheckIn)) {
        initCheckOut = addDaysISO(initCheckIn, 1);
      }
      setCheckIn(initCheckIn);
      setCheckOut(initCheckOut);
      setGuests(bookingTarget?.guests ? String(bookingTarget.guests) : "2");
      setGuestName("");
      setGuestPhone("");
      setGuestEmail("");
      setAttemptedSubmit(false);
    }
  }

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Three room-field modes:
  // locked  — a specific room was chosen (e.g. "Brishti"): show it fixed, no picker.
  // group   — a category was chosen from a category card: pick among that category's individual rooms by name.
  // generic — opened from Hero/Navbar/mobile bar with no context: pick among the four categories, or "Any room".
  const lockedRoom = bookingTarget?.roomId
    ? rooms.find((r) => r.id === bookingTarget.roomId)
    : undefined;
  const groupOptions =
    !lockedRoom && bookingTarget?.category && bookingTarget?.mode === "group"
      ? roomCategoryGroups.find((g) => g.category === bookingTarget.category)?.rooms
      : undefined;
  const mode: "locked" | "group" | "generic" = lockedRoom
    ? "locked"
    : groupOptions
    ? "group"
    : "generic";

  const unavailableDates = selectedRoomId
    ? getUnavailableDatesForRoom(selectedRoomId)
    : getGlobalUnavailableDates();

  // Minimum one-night stay: picking a check-in date auto-advances check-out
  // to the next day if it isn't already a valid later date.
  const handleCheckInChange = (iso: string) => {
    setCheckIn(iso);
    const minCheckOut = addDaysISO(iso, 1);
    if (!checkOut || checkOut < minCheckOut) {
      setCheckOut(minCheckOut);
    }
  };

  // Pricing is only shown in locked mode (opened via "Book Now" on one
  // specific room) — the availability search itself stays price-free since
  // it's browsing, not booking.
  const priceSource = mode === "locked" ? lockedRoom : undefined;

  // Live total once both dates are picked — recalculated on every date or
  // guest-count change so the guest always sees the real number before
  // sending anything.
  const priceBreakdown =
    priceSource && checkIn && checkOut
      ? calculateRoomPrice(priceSource, new Date(checkIn), new Date(checkOut), Number(guests))
      : undefined;

  const isSearchMode = mode !== "locked";
  const submitLabel = isSearchMode ? "Show Available Rooms" : "Submit Booking Request";
  const SubmitIcon = isSearchMode ? Search : Send;

  // Guest details are only required for a real booking request (locked
  // mode) — browsing/searching doesn't need to identify anyone yet.
  const nameError = !guestName.trim() ? "Please enter your name." : undefined;
  const phoneError = !/^[0-9+\-\s]{7,20}$/.test(guestPhone.trim())
    ? "Please enter a valid phone number."
    : undefined;
  const emailError = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail.trim())
    ? "Please enter a valid email address."
    : undefined;
  const guestDetailsInvalid = mode === "locked" && Boolean(nameError || phoneError || emailError);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestDetailsInvalid) {
      setAttemptedSubmit(true);
      return;
    }
    onSearch({
      checkIn,
      checkOut,
      guests: Number(guests),
      categoryId: mode === "group" ? bookingTarget?.category : mode === "generic" ? selectedCategoryId : undefined,
      roomId: mode === "locked" ? bookingTarget?.roomId : mode === "group" ? selectedRoomId : undefined,
      guestDetails:
        mode === "locked"
          ? { name: guestName.trim(), phone: guestPhone.trim(), email: guestEmail.trim() }
          : undefined,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="check-availability-title"
      className="fixed inset-0 z-[70] flex items-end justify-center bg-forest/60 backdrop-blur-sm md:items-center md:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[92svh] w-full max-w-md overflow-y-auto rounded-t-[2rem] bg-mist p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl md:rounded-[2rem] md:p-8">
        <div className="flex items-center justify-between">
          <h3
            id="check-availability-title"
            className="font-serif-display text-xl text-forest md:text-2xl"
          >
            Check Availability
          </h3>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-mountain transition-colors hover:bg-forest/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-1.5 text-sm text-mountain">
          {mode === "locked"
            ? `Checking availability for ${lockedRoom?.name}.`
            : "Pick your dates and we'll show what's open."}
        </p>

        {priceSource && (
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-sand/25 px-4 py-3 text-sm">
            <span className="text-mountain">
              Weekday <strong className="text-forest">{formatTaka(getWeekdayPrice(priceSource))}</strong>
            </span>
            <span className="h-4 w-px bg-forest/15" />
            <span className="text-mountain">
              Weekend <strong className="text-forest">{formatTaka(priceSource.weekendPrice)}</strong>
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
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

          {mode === "locked" && lockedRoom && (
            <Field label="Room" icon={<BedDouble className="h-4 w-4" />}>
              <span className="text-sm text-forest">
                {lockedRoom.name} — {lockedRoom.categoryLabel}
              </span>
            </Field>
          )}

          {mode === "group" && groupOptions && (
            <Field label="Room" icon={<BedDouble className="h-4 w-4" />}>
              <SpreadDropdown
                label="Room"
                icon={<BedDouble className="h-4 w-4" />}
                value={selectedRoomId ?? ""}
                onChange={(v) => setSelectedRoomId(v || undefined)}
                placeholder="Any room in this category"
                options={[
                  { value: "", label: "Any room in this category" },
                  ...groupOptions.map((room) => ({
                    value: room.id,
                    label: room.banglaName ? `${room.name} (${room.banglaName})` : room.name,
                  })),
                ]}
              />
            </Field>
          )}

          {mode === "generic" && (
            <Field label="Room" icon={<BedDouble className="h-4 w-4" />}>
              <SpreadDropdown
                label="Room"
                icon={<BedDouble className="h-4 w-4" />}
                value={selectedCategoryId ?? ""}
                onChange={(v) => setSelectedCategoryId(v || undefined)}
                placeholder="Any room"
                options={[
                  { value: "", label: "Any room" },
                  ...roomCategoryGroups.map((group) => ({
                    value: group.category,
                    label: group.categoryLabel,
                  })),
                ]}
              />
            </Field>
          )}

          {mode === "locked" && (
            <>
              <Field label="Full Name" icon={<User className="h-4 w-4" />}>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-transparent text-sm text-forest outline-none placeholder:text-sage"
                />
              </Field>
              {attemptedSubmit && nameError && (
                <p className="-mt-3 text-xs text-brown">{nameError}</p>
              )}

              <Field label="Phone Number" icon={<Phone className="h-4 w-4" />}>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-transparent text-sm text-forest outline-none placeholder:text-sage"
                />
              </Field>
              {attemptedSubmit && phoneError && (
                <p className="-mt-3 text-xs text-brown">{phoneError}</p>
              )}

              <Field label="Email Address" icon={<Mail className="h-4 w-4" />}>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm text-forest outline-none placeholder:text-sage"
                />
              </Field>
              {attemptedSubmit && emailError && (
                <p className="-mt-3 text-xs text-brown">{emailError}</p>
              )}
            </>
          )}

          {priceBreakdown && (
            <div className="rounded-2xl border border-forest/10 bg-forest/[0.03] p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-mountain">
                  Estimated total ({priceBreakdown.nights} {priceBreakdown.nights === 1 ? "night" : "nights"})
                </span>
                <span className="font-serif-display text-base text-forest">
                  {formatTaka(priceBreakdown.total)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-mountain">Advance (bKash)</span>
                <span className="text-forest">{formatTaka(ADVANCE_PAYMENT_TAKA)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-forest/10 pt-2">
                <span className="text-mountain">Due at property</span>
                <span className="font-medium text-forest">
                  {formatTaka(Math.max(0, priceBreakdown.total - ADVANCE_PAYMENT_TAKA))}
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-4 text-sm font-medium tracking-wide text-mist transition-colors duration-300 hover:bg-mountain disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-sand" />
                <span>Processing Booking Request...</span>
              </>
            ) : (
              <>
                <SubmitIcon className="h-4 w-4" />
                <span>{submitLabel}</span>
              </>
            )}
          </button>

          <p className="text-center text-xs text-sage">
            {mode === "locked"
              ? "If this room isn't open on your dates, we'll suggest similar options."
              : "We'll show matching rooms and cottages you can book instantly on WhatsApp."}
          </p>

          {priceSource && (
            <p className="text-center text-[11px] text-sage">
              +{formatTaka(extraGuestCharge)} per extra guest above {priceSource.capacity} (age 4+)
            </p>
          )}
        </form>
      </div>
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
    <div className="flex flex-col gap-1.5 border-b border-forest/10 pb-2.5">
      <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] text-sage uppercase">
        {icon}
        {label}
      </span>
      {children}
    </div>
  );
}
