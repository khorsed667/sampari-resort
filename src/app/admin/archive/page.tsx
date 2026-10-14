"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  CalendarDays,
  Users,
  User,
  Phone,
  Mail,
  Wallet,
  Clock,
  History,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useBookings } from "@/lib/useBookings";
import { formatTaka } from "@/lib/pricing";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminArchivePage() {
  const bookings = useBookings();
  const [filterStatus, setFilterStatus] = useState<"all" | "confirmed" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const todayISO = useMemo(() => {
    return new Date().toISOString().slice(0, 10);
  }, []);

  // Filter bookings whose checkOut has passed (checkOut < today)
  const archivedBookings = useMemo(() => {
    return bookings.filter((b) => {
      const isPassed = b.checkOut < todayISO;
      const matchesStatus = filterStatus === "all" || b.status === filterStatus;
      const matchesSearch =
        !searchQuery ||
        b.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.guestDetails.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.guestDetails.phone.includes(searchQuery);

      return isPassed && matchesStatus && matchesSearch;
    });
  }, [bookings, todayISO, filterStatus, searchQuery]);

  const totalArchivedRevenue = useMemo(() => {
    return archivedBookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + b.total, 0);
  }, [archivedBookings]);

  const totalGuestsHosted = useMemo(() => {
    return archivedBookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + b.guests, 0);
  }, [archivedBookings]);

  return (
    <div>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-display text-2xl text-forest md:text-3xl">Booking Archive</h1>
            <span className="rounded-full bg-sand/30 px-2.5 py-0.5 text-xs font-semibold text-brown">
              {archivedBookings.length} Past Records
            </span>
          </div>
          <p className="mt-1.5 text-sm text-mountain">
            Historical records of completed and past stays where the checkout date has passed.
          </p>
        </div>
      </header>

      {/* Summary KPI Cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-3xl bg-mist p-5">
          <History className="h-5 w-5 text-mountain" strokeWidth={1.5} />
          <p className="mt-3 font-serif-display text-2xl text-forest">
            {archivedBookings.filter((b) => b.status === "confirmed").length}
          </p>
          <p className="mt-1 text-xs text-sage">Completed Stays</p>
        </div>

        <div className="rounded-3xl bg-mist p-5">
          <Wallet className="h-5 w-5 text-mountain" strokeWidth={1.5} />
          <p className="mt-3 font-serif-display text-2xl text-forest">
            {formatTaka(totalArchivedRevenue)}
          </p>
          <p className="mt-1 text-xs text-sage">Historical Revenue</p>
        </div>

        <div className="rounded-3xl bg-mist p-5">
          <Users className="h-5 w-5 text-mountain" strokeWidth={1.5} />
          <p className="mt-3 font-serif-display text-2xl text-forest">
            {totalGuestsHosted}
          </p>
          <p className="mt-1 text-xs text-sage">Total Guests Hosted</p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilterStatus("all")}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
              filterStatus === "all"
                ? "border-forest bg-forest text-mist"
                : "border-forest/15 text-mountain hover:border-forest/35"
            )}
          >
            All Past Stays
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("confirmed")}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
              filterStatus === "confirmed"
                ? "border-forest bg-forest text-mist"
                : "border-forest/15 text-mountain hover:border-forest/35"
            )}
          >
            Completed
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("rejected")}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
              filterStatus === "rejected"
                ? "border-forest bg-forest text-mist"
                : "border-forest/15 text-mountain hover:border-forest/35"
            )}
          >
            Rejected / Cancelled
          </button>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search guest or room..."
          className="rounded-xl border border-forest/15 bg-mist px-3.5 py-2 text-xs text-forest outline-none placeholder:text-sage focus:border-forest/40 sm:w-64"
        />
      </div>

      {/* Archive List */}
      {archivedBookings.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-mist p-10 text-center">
          <Archive className="mx-auto h-8 w-8 text-sage/60" strokeWidth={1.5} />
          <p className="mt-3 text-sm text-mountain">No past bookings match the filter criteria.</p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {archivedBookings.map((b) => (
            <div
              key={b.id}
              className="flex flex-col gap-4 rounded-3xl bg-mist p-6 shadow-sm shadow-forest/5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-serif-display text-lg text-forest">{b.roomName}</h3>
                  <span className="text-xs text-sage">({b.categoryLabel})</span>
                  <span
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      b.status === "confirmed"
                        ? "bg-forest/10 text-forest"
                        : "bg-brown/10 text-brown"
                    )}
                  >
                    {b.status === "confirmed" ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {b.status}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      b.source === "website" ? "bg-forest text-mist" : "bg-brown text-mist"
                    )}
                  >
                    {b.source}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-mountain">
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-sage" />
                    {b.guestDetails.name}
                  </span>
                  {b.guestDetails.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-sage" />
                      {b.guestDetails.phone}
                    </span>
                  )}
                  {b.guestDetails.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-sage" />
                      {b.guestDetails.email}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-sage" />
                    {b.guests} {b.guests === 1 ? "guest" : "guests"}
                  </span>
                </div>

                {b.notes && (
                  <p className="mt-2 text-xs italic text-sage">
                    &quot;{b.notes}&quot;
                  </p>
                )}
              </div>

              <div className="flex flex-row items-center justify-between border-t border-forest/10 pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                <div className="flex items-center gap-1.5 text-xs text-mountain">
                  <CalendarDays className="h-3.5 w-3.5 text-sage" />
                  <span>
                    {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                  </span>
                </div>
                <div className="mt-1 text-right">
                  <p className="font-serif-display text-base text-forest">
                    {formatTaka(b.total)}
                  </p>
                  <p className="text-[10px] text-sage">Advance: {formatTaka(b.advance)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
