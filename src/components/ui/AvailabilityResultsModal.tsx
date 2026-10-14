"use client";

import { useEffect, useRef } from "react";
import { X, MessageCircle } from "lucide-react";
import { Room } from "@/types/room";
import { roomToDisplayCard } from "@/data/rooms";
import RoomCard from "@/components/home/RoomCard";
import { getQuickInquiryUrl } from "@/lib/whatsapp";

export default function AvailabilityResultsModal({
  isOpen,
  onClose,
  results,
  searchContext,
  fallbackNotice,
}: {
  isOpen: boolean;
  onClose: () => void;
  results: Room[];
  searchContext: { checkIn?: string; checkOut?: string; guests: number };
  /** Set when the exact room requested wasn't available and these are alternatives. */
  fallbackNotice?: string;
}) {
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

  if (!isOpen) return null;

  const dateLabel =
    searchContext.checkIn &&
    new Date(searchContext.checkIn).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="availability-results-title"
      className="fixed inset-0 z-[70] flex items-end justify-center bg-forest/60 backdrop-blur-sm md:items-center md:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[92svh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[2rem] bg-cream shadow-2xl md:rounded-[2rem]">
        <div className="flex items-start justify-between border-b border-forest/10 p-6 md:p-8">
          <div>
            <h3
              id="availability-results-title"
              className="font-serif-display text-xl text-forest md:text-2xl"
            >
              {results.length > 0
                ? `${results.length} ${results.length === 1 ? "Option" : "Options"} Available`
                : "Nothing Available on These Dates"}
            </h3>
            <p className="mt-1.5 text-sm text-mountain">
              {dateLabel ? `For ${dateLabel} · ` : ""}
              {searchContext.guests} {searchContext.guests === 1 ? "guest" : "guests"}
            </p>
            {fallbackNotice && (
              <p className="mt-2 text-xs text-brown">{fallbackNotice}</p>
            )}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-mountain transition-colors hover:bg-forest/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((room) => (
                <RoomCard
                  key={room.id}
                  card={roomToDisplayCard(room)}
                  categoryId={room.category}
                  roomId={room.id}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <p className="max-w-sm text-sm text-mountain">
                We couldn&apos;t find an open room or cottage for those exact dates. Message us
                directly — the resort may still be able to help.
              </p>
              <a
                href={getQuickInquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-mist transition-colors hover:bg-mountain"
              >
                <MessageCircle className="h-4 w-4" />
                Message on WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
