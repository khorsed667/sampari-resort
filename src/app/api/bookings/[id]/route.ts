import { NextRequest, NextResponse } from "next/server";
import { getBookingsCollection } from "@/lib/mongodb";
import { BookingStatus } from "@/types/booking";
import { expandDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const collection = await getBookingsCollection();
    const existing = await collection.findOne({ id });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    // If changing to confirmed, check for overlaps with other confirmed bookings
    if (body.status === "confirmed" && existing.status !== "confirmed") {
      const targetNights = expandDateRange(
        body.checkIn || existing.checkIn,
        body.checkOut || existing.checkOut
      );
      const otherConfirmed = await collection
        .find({
          roomId: body.roomId || existing.roomId,
          status: "confirmed",
          id: { $ne: id },
        })
        .toArray();

      const isOverlap = otherConfirmed.some((booking) => {
        const occupied = expandDateRange(booking.checkIn, booking.checkOut);
        return targetNights.some((night) => occupied.includes(night));
      });

      if (isOverlap) {
        return NextResponse.json(
          {
            success: false,
            error: "Cannot confirm booking: conflicting dates already confirmed for this room.",
          },
          { status: 409 }
        );
      }
    }

    const updateFields: Record<string, unknown> = {};
    if (body.status) {
      updateFields.status = body.status as BookingStatus;
    }
    if (body.guestDetails) {
      updateFields.guestDetails = body.guestDetails;
    }
    if (body.notes !== undefined) {
      updateFields.notes = body.notes;
    }
    if (body.total !== undefined) {
      updateFields.total = Number(body.total);
    }
    if (body.advance !== undefined) {
      updateFields.advance = Number(body.advance);
    }

    await collection.updateOne({ id }, { $set: updateFields });
    const updated = await collection.findOne({ id });

    return NextResponse.json({ success: true, booking: updated });
  } catch (error: unknown) {
    console.error("PATCH /api/bookings/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collection = await getBookingsCollection();

    const result = await collection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, id });
  } catch (error: unknown) {
    console.error("DELETE /api/bookings/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
