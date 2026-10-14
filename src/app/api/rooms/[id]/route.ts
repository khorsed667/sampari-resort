import { NextRequest, NextResponse } from "next/server";
import { getRoomsCollection } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const collection = await getRoomsCollection();
    const existing = await collection.findOne({ id });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 }
      );
    }

    const updateFields: Record<string, unknown> = {};

    if (body.name !== undefined) updateFields.name = body.name;
    if (body.shortName !== undefined) updateFields.shortName = body.shortName;
    if (body.banglaName !== undefined) updateFields.banglaName = body.banglaName;
    if (body.category !== undefined) updateFields.category = body.category;
    if (body.categoryLabel !== undefined) updateFields.categoryLabel = body.categoryLabel;
    if (body.capacity !== undefined) updateFields.capacity = Number(body.capacity);
    if (body.beds !== undefined) updateFields.beds = Number(body.beds);
    if (body.weekendPrice !== undefined) updateFields.weekendPrice = Number(body.weekendPrice);
    if (body.weekdayDiscount !== undefined) updateFields.weekdayDiscount = Number(body.weekdayDiscount);
    if (body.description !== undefined) updateFields.description = body.description;
    if (body.features !== undefined && Array.isArray(body.features)) updateFields.features = body.features;
    if (body.image !== undefined) updateFields.image = body.image;

    await collection.updateOne({ id }, { $set: updateFields });
    const updated = await collection.findOne({ id });

    const { _id, ...cleanRoom } = (updated || {}) as Record<string, unknown>;

    return NextResponse.json({ success: true, room: cleanRoom });
  } catch (error: unknown) {
    console.error("PATCH /api/rooms/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update room in database" },
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
    const collection = await getRoomsCollection();

    const result = await collection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, id });
  } catch (error: unknown) {
    console.error("DELETE /api/rooms/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete room" },
      { status: 500 }
    );
  }
}
