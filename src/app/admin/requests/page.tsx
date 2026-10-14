"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X, User, Phone, Mail, CalendarDays, Users, Clock } from "lucide-react";
import { useBookings } from "@/lib/useBookings";
import { confirmBooking, rejectBooking } from "@/lib/bookingsStore";
import { formatTaka } from "@/lib/pricing";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatSubmitted(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function BookingRequestsPage() {
  const bookings = useBookings();
  const pending = bookings.filter((b) => b.status === "pending");

  return (
    <div>
      <header>
        <h1 className="font-serif-display text-2xl text-forest md:text-3xl">Booking Requests</h1>
        <p className="mt-1.5 text-sm text-mountain">
          New requests submitted through the website. Confirm to lock the dates, or reject to release them.
        </p>
      </header>

      {pending.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-mist p-10 text-center">
          <p className="text-sm text-mountain">No pending requests right now.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {pending.map((booking) => (
              <motion.div
                key={booking.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl bg-mist p-6 shadow-sm shadow-forest/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif-display text-lg text-forest">
                      {booking.roomName}
                    </h3>
                    <p className="text-xs text-sage">{booking.categoryLabel}</p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-sand/30 px-2.5 py-1 text-[11px] text-brown">
                    <Clock className="h-3 w-3" />
                    {formatSubmitted(booking.createdAt)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-forest/10 pt-4 text-sm">
                  <div className="flex items-center gap-2 text-mountain">
                    <CalendarDays className="h-4 w-4 shrink-0 text-sage" />
                    {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                  </div>
                  <div className="flex items-center gap-2 text-mountain">
                    <Users className="h-4 w-4 shrink-0 text-sage" />
                    {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                  </div>
                  <div className="flex items-center gap-2 text-mountain">
                    <User className="h-4 w-4 shrink-0 text-sage" />
                    {booking.guestDetails.name}
                  </div>
                  <div className="flex items-center gap-2 text-mountain">
                    <Phone className="h-4 w-4 shrink-0 text-sage" />
                    {booking.guestDetails.phone}
                  </div>
                  <div className="col-span-2 flex items-center gap-2 text-mountain">
                    <Mail className="h-4 w-4 shrink-0 text-sage" />
                    {booking.guestDetails.email}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-2xl bg-sand/20 px-4 py-3 text-sm">
                  <span className="text-mountain">Total {formatTaka(booking.total)}</span>
                  <span className="text-forest">Advance {formatTaka(booking.advance)}</span>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => rejectBooking(booking.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-forest/20 px-4 py-2.5 text-sm font-medium text-forest transition-colors hover:bg-forest/5"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmBooking(booking.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-forest px-4 py-2.5 text-sm font-medium text-mist transition-colors hover:bg-mountain"
                  >
                    <Check className="h-4 w-4" />
                    Confirm
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
