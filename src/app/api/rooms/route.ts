import { NextRequest, NextResponse } from "next/server";
import { getRoomsCollection } from "@/lib/mongodb";
import { rooms as defaultRooms } from "@/data/rooms";
import { Room } from "@/types/room";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const collection = await getRoomsCollection();
    let docs = await collection.find({}).toArray();

    // Auto-seed rooms if collection is empty
    if (docs.length === 0) {
      await collection.insertMany(defaultRooms);
      docs = await collection.find({}).toArray();
    }

    const rooms: Room[] = docs.map((doc) => {
      const { _id, ...rest } = doc as unknown as Room & { _id?: unknown };
      return rest;
    });

    return NextResponse.json({ success: true, rooms });
  } catch (error: unknown) {
    console.error("GET /api/rooms error:", error);
    // Return fallback static rooms if database error occurs
    return NextResponse.json({ success: true, rooms: defaultRooms, fallback: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const collection = await getRoomsCollection();

    if (!body.id || !body.name || !body.category) {
      return NextResponse.json(
        { success: false, error: "Missing required room fields (id, name, category)" },
        { status: 400 }
      );
    }

    const existing = await collection.findOne({ id: body.id });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `A room with ID "${body.id}" already exists.` },
        { status: 409 }
      );
    }

    const newRoom: Room = {
      id: body.id,
      name: body.name,
      shortName: body.shortName || body.name,
      banglaName: body.banglaName || undefined,
      category: body.category,
      categoryLabel: body.categoryLabel || "Room",
      capacity: Number(body.capacity) || 2,
      beds: Number(body.beds) || 1,
      weekendPrice: Number(body.weekendPrice) || 3500,
      weekdayDiscount: Number(body.weekdayDiscount) || 500,
      image: body.image || "/images/rooms/rod.svg",
      gallery: Array.isArray(body.gallery) ? body.gallery : undefined,
      description: body.description || "",
      features: Array.isArray(body.features) ? body.features : ["Mountain view", "Attached washroom"],
    };

    await collection.insertOne(newRoom);

    return NextResponse.json({ success: true, room: newRoom }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/rooms error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create room in database" },
      { status: 500 }
    );
  }
}
