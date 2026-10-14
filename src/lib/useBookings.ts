"use client";

import { useSyncExternalStore } from "react";
import { getAllBookings, subscribeToBookings } from "@/lib/bookingsStore";
import { BookingRecord } from "@/types/booking";

const EMPTY: BookingRecord[] = [];

/** Reads all bookings and stays live-updated as the store changes —
 * confirming/rejecting/adding a booking anywhere re-renders every page
 * using this hook. Returns an empty snapshot on the server (localStorage
 * only exists in the browser) and the real data once mounted. */
export function useBookings(): BookingRecord[] {
  return useSyncExternalStore(subscribeToBookings, getAllBookings, () => EMPTY);
}
