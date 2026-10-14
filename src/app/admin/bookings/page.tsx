"use client";

import { useState } from "react";
import { Plus, CalendarDays, Users } from "lucide-react";
import { useBookings } from "@/lib/useBookings";
import { rooms } from "@/data/rooms";
import { formatTaka } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import BookingsCalendar from "@/components/admin/BookingsCalendar";
import ManualBookingModal from "@/components/admin/ManualBookingModal";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ConfirmedBookingsPage() {
  const bookings = useBookings();
  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id ?? "");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif-display text-2xl text-forest md:text-3xl">Confirmed Bookings</h1>
          <p className="mt-1.5 text-sm text-mountain">
            See which dates are booked per room, and add bookings that came in outside the website.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-mist transition-colors hover:bg-mountain"
        >
          <Plus className="h-4 w-4" />
          Add Manual Booking
        </button>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
        <div>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold tracking-[0.12em] text-sage uppercase">
              Room
            </span>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full rounded-xl border border-forest/15 bg-mist px-3.5 py-2.5 text-sm text-forest outline-none focus:border-forest/40"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} — {r.categoryLabel}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-4">
            <BookingsCalendar bookings={bookings} roomId={selectedRoomId} />
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold tracking-[0.12em] text-sage uppercase">
            All Confirmed Bookings
          </p>
          {confirmed.length === 0 ? (
            <div className="mt-3 rounded-3xl bg-mist p-8 text-center">
              <p className="text-sm text-mountain">No confirmed bookings yet.</p>
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-3">
              {confirmed.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col gap-3 rounded-2xl bg-mist p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif-display text-base text-forest">{b.roomName}</h4>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          b.source === "website" ? "bg-forest text-mist" : "bg-brown text-mist"
                        )}
                      >
                        {b.source === "website" ? "Website" : "Manual"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-sage">{b.guestDetails.name || "—"}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-mountain">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-sage" />
                      {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-sage" />
                      {b.guests}
                    </span>
                    <span className="font-medium text-forest">{formatTaka(b.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ManualBookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdded={() => setSelectedRoomId((id) => id)}
      />
    </div>
  );
}
