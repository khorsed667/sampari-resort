import { Room } from "@/types/room";
import { PriceBreakdown } from "@/types/booking";
import { extraGuestCharge } from "@/data/rooms";

/**
 * A day counts as "weekend pricing" if it's Friday, Saturday, or a
 * government holiday. Government holidays aren't modeled yet (no holiday
 * calendar source in Phase 1) — this can take an optional holiday list once
 * Phase 2/3 introduces one.
 */
export function isWeekendDay(date: Date, holidays: string[] = []): boolean {
  const day = date.getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday
  const iso = date.toISOString().slice(0, 10);
  return day === 5 || day === 6 || holidays.includes(iso);
}

export function getWeekdayPrice(room: Pick<Room, "weekendPrice" | "weekdayDiscount">): number {
  return room.weekendPrice - room.weekdayDiscount;
}

/**
 * Calculates a full price breakdown for a stay.
 * extraGuests should be guests older than 4 beyond the room's base capacity.
 */
export function calculateRoomPrice(
  room: Pick<Room, "weekendPrice" | "weekdayDiscount" | "capacity">,
  checkIn: Date,
  checkOut: Date,
  guestCount: number,
  holidays: string[] = []
): PriceBreakdown {
  const nights = Math.max(
    0,
    Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  );

  let weekendNights = 0;
  let weekdayNights = 0;
  const cursor = new Date(checkIn);
  for (let i = 0; i < nights; i++) {
    if (isWeekendDay(cursor, holidays)) {
      weekendNights++;
    } else {
      weekdayNights++;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  const weekdayPrice = getWeekdayPrice(room);
  const baseTotal = weekendNights * room.weekendPrice + weekdayNights * weekdayPrice;

  const extraGuests = Math.max(0, guestCount - room.capacity);
  const extraGuestChargeTotal = extraGuests * extraGuestCharge * Math.max(nights, 1);

  return {
    nights,
    weekendNights,
    weekdayNights,
    baseTotal,
    extraGuestCharge: extraGuestChargeTotal,
    extraGuests,
    total: baseTotal + extraGuestChargeTotal,
  };
}

export function formatTaka(amount: number): string {
  return `৳${amount.toLocaleString("en-US")}`;
}
