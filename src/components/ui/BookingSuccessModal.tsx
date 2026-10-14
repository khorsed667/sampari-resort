"use client";

import { useEffect, useRef } from "react";
import { Check, X, MessageCircle, CalendarDays, Users, BedDouble, ArrowRight } from "lucide-react";
import { BookingRecord } from "@/types/booking";
import { formatTaka } from "@/lib/pricing";

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingRecord | null;
  whatsappUrl?: string | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BookingSuccessModal({
  isOpen,
  onClose,
  booking,
  whatsappUrl,
}: BookingSuccessModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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

  if (!isOpen || !booking) return null;

  const dueAtProperty = Math.max(0, booking.total - booking.advance);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      className="fixed inset-0 z-[85] flex items-center justify-center bg-forest/65 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-mist p-6 shadow-2xl animate-fade-up md:p-8">
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-mountain transition-colors hover:bg-forest/5"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Success Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest text-sand shadow-lg shadow-forest/20 ring-8 ring-forest/10">
            <Check className="h-7 w-7" strokeWidth={2.5} />
          </div>

          <h3
            id="success-modal-title"
            className="mt-4 font-serif-display text-2xl text-forest md:text-3xl"
          >
            Booking Request Received!
          </h3>
          <p className="mt-1.5 max-w-sm text-sm text-mountain">
            Your booking request has been registered in the system. Finalize it on WhatsApp to secure your stay.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="mt-6 rounded-2xl border border-forest/10 bg-cream p-5 text-sm">
          <div className="flex items-center justify-between border-b border-forest/10 pb-3">
            <div className="flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-sage" />
              <span className="font-serif-display text-base text-forest">{booking.roomName}</span>
            </div>
            <span className="rounded-full bg-sand/30 px-2.5 py-0.5 text-xs font-semibold text-brown">
              {booking.categoryLabel}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-mountain">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 text-sage" />
              <span>{formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-sage" />
              <span>{booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}</span>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="mt-4 rounded-xl bg-mist p-3.5 text-xs">
            <div className="flex justify-between text-mountain">
              <span>Estimated Total Stay</span>
              <strong className="font-serif-display text-sm text-forest">{formatTaka(booking.total)}</strong>
            </div>
            <div className="mt-1.5 flex justify-between text-mountain">
              <span>Advance Payment (bKash)</span>
              <span className="font-medium text-forest">{formatTaka(booking.advance)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-forest/10 pt-2 font-medium text-mountain">
              <span>Due at Resort</span>
              <span className="text-forest">{formatTaka(dueAtProperty)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-4 text-sm font-medium tracking-wide text-mist shadow-lg shadow-forest/10 transition-colors hover:bg-mountain"
            >
              <MessageCircle className="h-4 w-4" />
              Open WhatsApp to Finalize
              <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-forest/20 px-6 py-3 text-sm font-medium text-forest transition-colors hover:bg-forest/5"
          >
            Close & Return to Site
          </button>
        </div>

        <p className="mt-4 text-center text-[11px] text-sage">
          Reference ID: <span className="font-mono">{booking.id}</span>
        </p>
      </div>
    </div>
  );
}
