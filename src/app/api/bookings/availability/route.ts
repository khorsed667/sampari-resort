import { NextRequest, NextResponse } from "next/server";
import { getBookingsCollection } from "@/lib/mongodb";
import { unavailableRanges } from "@/data/availability";
import { expandDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");

    const collection = await getBookingsCollection();
    const query: Record<string, unknown> = { status: "confirmed" };

    if (roomId && roomId !== "all") {
      query.roomId = roomId;
    }

    const confirmedBookings = await collection.find(query).toArray();

    // Map confirmed dates by room
    const datesByRoom: Record<string, Set<string>> = {};

    // 1. Add static closures from data/availability.ts
    unavailableRanges.forEach((range) => {
      const targetRoom = range.roomId;
      if (!datesByRoom[targetRoom]) {
        datesByRoom[targetRoom] = new Set<string>();
      }
      range.dates.forEach((d) => datesByRoom[targetRoom].add(d));
    });

    // 2. Add confirmed database bookings
    confirmedBookings.forEach((b) => {
      if (!datesByRoom[b.roomId]) {
        datesByRoom[b.roomId] = new Set<string>();
      }
      const occupiedNights = expandDateRange(b.checkIn, b.checkOut);
      occupiedNights.forEach((d) => datesByRoom[b.roomId].add(d));
    });

    // If a specific room was requested, return that room's dates (plus any global "all" closures)
    if (roomId && roomId !== "all") {
      const roomSet = datesByRoom[roomId] || new Set<string>();
      const globalSet = datesByRoom["all"] || new Set<string>();
      const combined = Array.from(new Set([...roomSet, ...globalSet])).sort();
      return NextResponse.json({ success: true, dates: combined });
    }

    // Otherwise return a map of dates for all rooms
    const result: Record<string, string[]> = {};
    for (const [key, set] of Object.entries(datesByRoom)) {
      result[key] = Array.from(set).sort();
    }

    return NextResponse.json({ success: true, unavailableDatesByRoom: result });
  } catch (error: unknown) {
    console.error("GET /api/bookings/availability error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch availability dates" },
      { status: 500 }
    );
  }
}
