"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import CheckAvailabilityModal, {
  AvailabilitySearchFields,
} from "@/components/ui/CheckAvailabilityModal";
import AvailabilityResultsModal from "@/components/ui/AvailabilityResultsModal";
import BookingSuccessModal from "@/components/ui/BookingSuccessModal";
import { rooms } from "@/data/rooms";
import { Room } from "@/types/room";
import { BookingRecord } from "@/types/booking";
import { isRoomAvailable, searchAvailableRooms } from "@/lib/availability";
import { calculateRoomPrice } from "@/lib/pricing";
import { ADVANCE_PAYMENT_TAKA } from "@/lib/constants";
import { generateQuickAvailabilityUrl, generateBookingRequestUrl } from "@/lib/whatsapp";
import { createBookingRequest } from "@/lib/bookingsStore";
import BookingToast from "@/components/ui/BookingToast";

export interface OpenOptions {
  /** Pre-selects a room category — e.g. opened from a category's group card. */
  roomCategory?: string;
  /** Locks to one specific room — e.g. opened from an individual room card. */
  roomId?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  mode?: "locked" | "group" | "generic";
}

interface CheckAvailabilityContextValue {
  open: (options?: OpenOptions) => void;
  search: (fields: AvailabilitySearchFields) => void;
}

const CheckAvailabilityContext = createContext<CheckAvailabilityContextValue | null>(
  null
);

export function useCheckAvailability() {
  const ctx = useContext(CheckAvailabilityContext);
  if (!ctx) {
    throw new Error(
      "useCheckAvailability must be used within CheckAvailabilityProvider"
    );
  }
  return ctx;
}

export default function CheckAvailabilityProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [checkOpen, setCheckOpen] = useState(false);
  const [bookingTarget, setBookingTarget] = useState<OpenOptions | undefined>();

  const [resultsOpen, setResultsOpen] = useState(false);
  const [resultsRooms, setResultsRooms] = useState<Room[]>([]);
  const [resultsContext, setResultsContext] = useState<{
    checkIn?: string;
    checkOut?: string;
    guests: number;
  }>({ guests: 2 });
  const [fallbackNotice, setFallbackNotice] = useState<string | undefined>();
  const [toastMessage, setToastMessage] = useState<string | undefined>();

  // Booking success modal states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successBooking, setSuccessBooking] = useState<BookingRecord | null>(null);
  const [successWhatsappUrl, setSuccessWhatsappUrl] = useState<string | null>(null);

  const open = useCallback((options?: OpenOptions) => {
    setBookingTarget(options);
    setCheckOpen(true);
  }, []);

  const closeCheck = useCallback(() => setCheckOpen(false), []);
  const closeResults = useCallback(() => setResultsOpen(false), []);

  // A room locked from an individual room card (e.g. "Brishti") skips
  // browsing entirely: if it's open on the chosen date we save to database,
  // prepare WhatsApp and show the Booking Success receipt modal.
  const handleSearch = useCallback(async (fields: AvailabilitySearchFields) => {
    const lockedRoomId = bookingTarget?.roomId;

    if (lockedRoomId) {
      const room = rooms.find((r) => r.id === lockedRoomId);
      const available = !fields.checkIn || isRoomAvailable(lockedRoomId, fields.checkIn);

      if (available && room) {
        const hasDates = Boolean(fields.checkIn && fields.checkOut);
        const total = hasDates
          ? calculateRoomPrice(
              room,
              new Date(fields.checkIn),
              new Date(fields.checkOut),
              fields.guests
            ).total
          : 0;

        if (hasDates && fields.guestDetails) {
          setIsSubmitting(true);
          try {
            const newRecord = createBookingRequest({
              roomId: room.id,
              roomName: room.name,
              categoryLabel: room.categoryLabel,
              checkIn: fields.checkIn,
              checkOut: fields.checkOut,
              guests: fields.guests,
              guestDetails: fields.guestDetails,
              total,
              advance: ADVANCE_PAYMENT_TAKA,
            });

            const url = generateBookingRequestUrl({
              checkIn: fields.checkIn,
              checkOut: fields.checkOut,
              guests: fields.guests,
              roomLabel: `${room.name} (${room.categoryLabel})`,
              total,
              advance: ADVANCE_PAYMENT_TAKA,
            });

            // Smooth server processing indicator
            await new Promise((r) => setTimeout(r, 650));

            setCheckOpen(false);
            setSuccessBooking(newRecord);
            setSuccessWhatsappUrl(url);
            setSuccessModalOpen(true);
          } finally {
            setIsSubmitting(false);
          }
          return;
        }

        const url = generateQuickAvailabilityUrl({
          checkIn: fields.checkIn || undefined,
          checkOut: fields.checkOut || undefined,
          guests: fields.guests,
          roomLabel: `${room.name} (${room.categoryLabel})`,
        });
        window.open(url, "_blank", "noopener,noreferrer");
        setCheckOpen(false);
        return;
      }

      const results = searchAvailableRooms({
        checkIn: fields.checkIn || undefined,
        checkOut: fields.checkOut || undefined,
        guests: fields.guests,
        roomId: lockedRoomId,
      });
      setResultsRooms(results);
      setResultsContext({
        checkIn: fields.checkIn,
        checkOut: fields.checkOut,
        guests: fields.guests,
      });
      setFallbackNotice(
        room ? `${room.name} isn't available on this date — here are similar options.` : undefined
      );
      setCheckOpen(false);
      setResultsOpen(true);
      return;
    }

    // Group mode (category chosen) or generic mode (category or nothing chosen).
    const results = searchAvailableRooms({
      checkIn: fields.checkIn || undefined,
      checkOut: fields.checkOut || undefined,
      guests: fields.guests,
      categoryId: fields.categoryId,
      roomId: fields.roomId,
    });
    setResultsRooms(results);
    setResultsContext({
      checkIn: fields.checkIn,
      checkOut: fields.checkOut,
      guests: fields.guests,
    });
    setFallbackNotice(undefined);
    setCheckOpen(false);
    setResultsOpen(true);
  }, [bookingTarget]);

  const value = useMemo(() => ({ open, search: handleSearch }), [open, handleSearch]);

  return (
    <CheckAvailabilityContext.Provider value={value}>
      {children}
      <CheckAvailabilityModal
        isOpen={checkOpen}
        onClose={closeCheck}
        isSubmitting={isSubmitting}
        bookingTarget={
          bookingTarget
            ? {
                category: bookingTarget.roomCategory,
                roomId: bookingTarget.roomId,
                checkIn: bookingTarget.checkIn,
                checkOut: bookingTarget.checkOut,
                guests: bookingTarget.guests,
                mode: bookingTarget.mode,
              }
            : undefined
        }
        onSearch={handleSearch}
      />
      <AvailabilityResultsModal
        isOpen={resultsOpen}
        onClose={closeResults}
        results={resultsRooms}
        searchContext={resultsContext}
        fallbackNotice={fallbackNotice}
      />
      <BookingSuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        booking={successBooking}
        whatsappUrl={successWhatsappUrl}
      />
      <BookingToast message={toastMessage} onDone={() => setToastMessage(undefined)} />
    </CheckAvailabilityContext.Provider>
  );
}
