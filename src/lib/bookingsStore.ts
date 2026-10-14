"use client";

import { BookingRecord, BookingStatus } from "@/types/booking";
import { expandDateRange } from "@/lib/utils";

const STORAGE_KEY = "sampari_bookings_v1";
const UPDATE_EVENT = "sampari-bookings-updated";

function isBrowser() {
  return typeof window !== "undefined";
}

function readLocal(): BookingRecord[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BookingRecord[]) : [];
  } catch {
    return [];
  }
}

let cachedSnapshot: BookingRecord[] | null = null;
let isInitialFetchDone = false;

function invalidateCache() {
  cachedSnapshot = null;
}

function writeLocal(records: BookingRecord[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Ignore storage quota or disabled errors
  }
  invalidateCache();
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

function generateId(): string {
  return `bk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Fetches the latest bookings from the MongoDB API and updates local snapshot. */
export async function syncFromDatabase(): Promise<BookingRecord[]> {
  if (!isBrowser()) return [];
  try {
    const res = await fetch("/api/bookings", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch bookings");
    const data = await res.json();
    if (data.success && Array.isArray(data.bookings)) {
      writeLocal(data.bookings);
      return data.bookings;
    }
  } catch (error) {
    console.warn("Could not sync bookings with MongoDB Atlas:", error);
  }
  return readLocal();
}

// Background poller to keep multiple tabs/devices updated with MongoDB
if (isBrowser()) {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) invalidateCache();
  });

  // Initial sync on startup
  if (!isInitialFetchDone) {
    isInitialFetchDone = true;
    setTimeout(() => {
      syncFromDatabase();
    }, 100);
  }

  // Sync on tab re-focus
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      syncFromDatabase();
    }
  });

  // Periodic poll every 25 seconds when page is active
  setInterval(() => {
    if (document.visibilityState === "visible") {
      syncFromDatabase();
    }
  }, 25000);
}

/** Subscribe to booking store updates for useSyncExternalStore */
export function subscribeToBookings(callback: () => void): () => void {
  if (!isBrowser()) return () => {};
  window.addEventListener(UPDATE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(UPDATE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function getAllBookings(): BookingRecord[] {
  if (cachedSnapshot) return cachedSnapshot;
  cachedSnapshot = readLocal().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return cachedSnapshot;
}

export function getBookingsByStatus(status: BookingStatus): BookingRecord[] {
  return getAllBookings().filter((b) => b.status === status);
}

export const getPendingRequests = () => getBookingsByStatus("pending");
export const getConfirmedBookings = () => getBookingsByStatus("confirmed");
export const getRejectedBookings = () => getBookingsByStatus("rejected");

type NewBookingInput = Omit<BookingRecord, "id" | "status" | "source" | "createdAt">;

/** A guest submitting the booking form on the live site — persists to MongoDB Atlas. */
export function createBookingRequest(input: NewBookingInput): BookingRecord {
  const record: BookingRecord = {
    ...input,
    id: generateId(),
    source: "website",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  // 1. Optimistic local update
  writeLocal([...readLocal(), record]);

  // 2. Persist to MongoDB Atlas asynchronously
  if (isBrowser()) {
    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          console.warn("Failed to save booking to MongoDB:", data.error);
        } else if (data.booking) {
          // Replace optimistic record with server record
          const current = readLocal().filter((b) => b.id !== record.id);
          writeLocal([...current, data.booking]);
        }
      })
      .catch((err) => console.error("Error creating booking:", err));
  }

  return record;
}

/** An admin recording a booking that came in outside the website — persists to MongoDB Atlas. */
export function addManualBooking(input: NewBookingInput): BookingRecord {
  const record: BookingRecord = {
    ...input,
    id: generateId(),
    source: "manual",
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  // 1. Optimistic local update
  writeLocal([...readLocal(), record]);

  // 2. Persist to MongoDB Atlas asynchronously
  if (isBrowser()) {
    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          console.warn("Failed to save manual booking to MongoDB:", data.error);
        } else if (data.booking) {
          const current = readLocal().filter((b) => b.id !== record.id);
          writeLocal([...current, data.booking]);
        }
      })
      .catch((err) => console.error("Error saving manual booking:", err));
  }

  return record;
}

export function confirmBooking(id: string) {
  // 1. Optimistic update
  writeLocal(readLocal().map((b) => (b.id === id ? { ...b, status: "confirmed" as const } : b)));

  // 2. Persist to MongoDB Atlas
  if (isBrowser()) {
    fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "confirmed" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          console.warn("Failed to confirm booking in MongoDB:", data.error);
          syncFromDatabase(); // Rollback to actual database state
        }
      })
      .catch((err) => console.error("Error confirming booking:", err));
  }
}

export function rejectBooking(id: string) {
  // 1. Optimistic update
  writeLocal(readLocal().map((b) => (b.id === id ? { ...b, status: "rejected" as const } : b)));

  // 2. Persist to MongoDB Atlas
  if (isBrowser()) {
    fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          console.warn("Failed to reject booking in MongoDB:", data.error);
          syncFromDatabase();
        }
      })
      .catch((err) => console.error("Error rejecting booking:", err));
  }
}

export function deleteBooking(id: string) {
  // 1. Optimistic update
  writeLocal(readLocal().filter((b) => b.id !== id));

  // 2. Delete from MongoDB Atlas
  if (isBrowser()) {
    fetch(`/api/bookings/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          console.warn("Failed to delete booking from MongoDB:", data.error);
          syncFromDatabase();
        }
      })
      .catch((err) => console.error("Error deleting booking:", err));
  }
}

/**
 * Every night occupied by a CONFIRMED booking for one room.
 */
export function getConfirmedDatesForRoom(roomId: string): string[] {
  const dates = new Set<string>();
  getConfirmedBookings()
    .filter((b) => b.roomId === roomId)
    .forEach((b) => expandDateRange(b.checkIn, b.checkOut).forEach((d) => dates.add(d)));
  return Array.from(dates);
}
