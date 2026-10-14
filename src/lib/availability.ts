import { unavailableRanges } from "@/data/availability";
import { rooms } from "@/data/rooms";
import { Room, RoomCategory } from "@/types/room";
import { getConfirmedDatesForRoom } from "@/lib/bookingsStore";
import { expandDateRange } from "@/lib/utils";

/**
 * Returns true if the given room can be booked on the given date. Combines
 * the static "all"/manual closures in data/availability.ts with whatever
 * the admin dashboard has actually confirmed for that room — a pending
 * request never blocks a date, only a confirmation does.
 */
export function isRoomAvailable(roomId: string, isoDate: string): boolean {
  const staticallyBlocked = unavailableRanges.some(
    (range) =>
      (range.roomId === "all" || range.roomId === roomId) &&
      range.dates.includes(isoDate)
  );
  if (staticallyBlocked) return false;
  return !getConfirmedDatesForRoom(roomId).includes(isoDate);
}

/**
 * Returns true if the room is available for every night of a stay range
 * (checkIn inclusive, checkOut exclusive).
 */
export function isRoomAvailableForRange(
  roomId: string,
  checkIn: string,
  checkOut: string
): boolean {
  const nights = expandDateRange(checkIn, checkOut);
  return nights.length === 0 || nights.every((date) => isRoomAvailable(roomId, date));
}

/**
 * All booked-out dates for one room — static entries plus confirmed
 * bookings from the admin dashboard. Feeds the calendar's "booked" date
 * highlighting for that room.
 */
export function getUnavailableDatesForRoom(roomId: string): string[] {
  const dates = new Set<string>();
  unavailableRanges.forEach((range) => {
    if (range.roomId === "all" || range.roomId === roomId) {
      range.dates.forEach((d) => dates.add(d));
    }
  });
  getConfirmedDatesForRoom(roomId).forEach((d) => dates.add(d));
  return Array.from(dates);
}

/**
 * Resort-wide closures only — a general indicator for the calendar before
 * any specific room has been chosen (generic "Check Availability" entry
 * points don't yet know which room the guest wants).
 */
export function getGlobalUnavailableDates(): string[] {
  const dates = new Set<string>();
  unavailableRanges.forEach((range) => {
    if (range.roomId === "all") range.dates.forEach((d) => dates.add(d));
  });
  return Array.from(dates);
}

/**
 * Maps a guest count to the room categories worth showing. Guests who fit
 * the smallest (2-guest) tier only see that tier; anyone above it sees
 * every larger tier together — a party of 3 and a party of 6 are both
 * reasonably served by either the 2-bed or the 3-bed rooms.
 */
export function getEligibleCategoriesForGuests(guests: number): RoomCategory[] {
  if (guests <= 2) return ["couple-cottage", "couple-room"];
  return ["twin-room", "family-room"];
}

export interface RoomSearchParams {
  checkIn?: string;
  checkOut?: string;
  guests: number;
  /** Narrows to one category — e.g. opened from a category's group card. */
  categoryId?: string;
  /** Narrows to one specific room — e.g. opened from an individual room card. */
  roomId?: string;
}

/**
 * Central search behind the "Check Availability" flow. Reads local data
 * now; in Phase 3 this becomes a Supabase query with the same signature
 * and return shape, so the calling UI won't need to change.
 */
export function searchAvailableRooms({
  checkIn,
  checkOut,
  guests,
  categoryId,
  roomId,
}: RoomSearchParams): Room[] {
  let pool: Room[];

  const isAvailable = (targetRoomId: string) => {
    if (!checkIn) return true;
    if (checkOut) return isRoomAvailableForRange(targetRoomId, checkIn, checkOut);
    return isRoomAvailable(targetRoomId, checkIn);
  };

  if (roomId) {
    const match = rooms.find((r) => r.id === roomId);
    pool = match ? [match] : [];
    // If that exact room is booked on the chosen date range, fall back to its
    // siblings in the same category instead of coming back empty.
    if (checkIn && match && !isAvailable(match.id)) {
      pool = rooms.filter((r) => r.category === match.category);
    }
  } else if (categoryId) {
    pool = rooms.filter((r) => r.category === categoryId);
  } else {
    const eligible = getEligibleCategoriesForGuests(guests);
    pool = rooms.filter((r) => eligible.includes(r.category));
  }

  if (checkIn) {
    pool = pool.filter((r) => isAvailable(r.id));
  }

  return pool;
}
