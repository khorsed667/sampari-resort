import { NextRequest, NextResponse } from "next/server";
import { getBookingsCollection } from "@/lib/mongodb";
import { BookingRecord, BookingStatus } from "@/types/booking";
import { expandDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as BookingStatus | null;
    const roomId = searchParams.get("roomId");

    const collection = await getBookingsCollection();
    const query: Record<string, unknown> = {};

    if (status) {
      query.status = status;
    }
    if (roomId) {
      query.roomId = roomId;
    }

    const docs = await collection.find(query).sort({ createdAt: -1 }).toArray();

    // Map documents to clean BookingRecord format without MongoDB internal _id
    const bookings: BookingRecord[] = docs.map((doc) => {
      const { _id, ...rest } = doc as unknown as BookingRecord & { _id?: unknown };
      return rest;
    });

    return NextResponse.json({ success: true, bookings });
  } catch (error: unknown) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings from database" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      roomId,
      roomName,
      categoryLabel,
      checkIn,
      checkOut,
      guests,
      guestDetails,
      total,
      advance,
      source = "website",
      notes,
    } = body;

    if (!roomId || !checkIn || !checkOut) {
      return NextResponse.json(
        { success: false, error: "Missing required booking details (room, check-in, check-out)" },
        { status: 400 }
      );
    }

    const collection = await getBookingsCollection();

    // Double-booking check against existing confirmed reservations
    const requestedNights = expandDateRange(checkIn, checkOut);
    const existingConfirmed = await collection
      .find({
        roomId,
        status: "confirmed",
      })
      .toArray();

    const isOverlap = existingConfirmed.some((existing) => {
      const occupiedNights = expandDateRange(existing.checkIn, existing.checkOut);
      return requestedNights.some((night) => occupiedNights.includes(night));
    });

    if (isOverlap) {
      return NextResponse.json(
        {
          success: false,
          error: "Selected dates are no longer available for this room.",
        },
        { status: 409 }
      );
    }

    const id = body.id || `bk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const status: BookingStatus = source === "manual" ? "confirmed" : "pending";
    const createdAt = new Date().toISOString();

    const newBooking: BookingRecord = {
      id,
      source: source === "manual" ? "manual" : "website",
      status,
      roomId,
      roomName: roomName || roomId,
      categoryLabel: categoryLabel || "Room",
      checkIn,
      checkOut,
      guests: Number(guests) || 2,
      guestDetails: {
        name: guestDetails?.name?.trim() || "Guest",
        phone: guestDetails?.phone?.trim() || "",
        email: guestDetails?.email?.trim() || "",
      },
      total: Number(total) || 0,
      advance: Number(advance) || 0,
      notes: notes?.trim() || undefined,
      createdAt,
    };

    await collection.insertOne(newBooking);

    return NextResponse.json({ success: true, booking: newBooking }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create booking in database" },
      { status: 500 }
    );
  }
}
