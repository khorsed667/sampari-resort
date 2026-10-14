import { NextResponse } from "next/server";
import { getBookingsCollection, getRoomsCollection } from "@/lib/mongodb";
import { rooms as defaultRooms } from "@/data/rooms";
import { BookingRecord } from "@/types/booking";

export const dynamic = "force-dynamic";

const sampleBookings: BookingRecord[] = [
  // --- OCTOBER 2026 BOOKINGS ---
  {
    id: "bk_seed_oct_01",
    source: "website",
    status: "confirmed",
    roomId: "rod",
    roomName: "Rod",
    categoryLabel: "Couple Cottage",
    checkIn: "2026-10-02",
    checkOut: "2026-10-04",
    guests: 2,
    guestDetails: {
      name: "Tamim Iqbal",
      phone: "01711223344",
      email: "tamim@example.com",
    },
    total: 7000,
    advance: 1020,
    notes: "Anniversary stay, cloud view requested.",
    createdAt: "2026-09-20T10:15:00.000Z",
  },
  {
    id: "bk_seed_oct_02",
    source: "manual",
    status: "confirmed",
    roomId: "brishti",
    roomName: "Brishti",
    categoryLabel: "Couple Cottage",
    checkIn: "2026-10-05",
    checkOut: "2026-10-07",
    guests: 2,
    guestDetails: {
      name: "Farhana Ahmed",
      phone: "01819887766",
      email: "farhana.ahmed@example.com",
    },
    total: 6000,
    advance: 1020,
    notes: "Direct phone booking. Paid advance via bKash.",
    createdAt: "2026-09-22T14:30:00.000Z",
  },
  {
    id: "bk_seed_oct_03",
    source: "website",
    status: "confirmed",
    roomId: "kp-1",
    roomName: "Khumpui-1",
    categoryLabel: "Couple Room",
    checkIn: "2026-10-09",
    checkOut: "2026-10-11",
    guests: 2,
    guestDetails: {
      name: "Nafis Fuad",
      phone: "01912345678",
      email: "nafis.fuad@example.com",
    },
    total: 5000,
    advance: 1020,
    createdAt: "2026-09-25T09:00:00.000Z",
  },
  {
    id: "bk_seed_oct_04",
    source: "manual",
    status: "confirmed",
    roomId: "kt-2",
    roomName: "Khumtai-2",
    categoryLabel: "3-Bed Room",
    checkIn: "2026-10-12",
    checkOut: "2026-10-14",
    guests: 5,
    guestDetails: {
      name: "Mahmudul Hasan Family",
      phone: "01678112233",
      email: "mahmud.hasan@example.com",
    },
    total: 9000,
    advance: 1020,
    notes: "Family trip from Chittagong.",
    createdAt: "2026-09-28T16:45:00.000Z",
  },
  {
    id: "bk_seed_oct_05",
    source: "website",
    status: "confirmed",
    roomId: "megh",
    roomName: "Megh",
    categoryLabel: "Couple Cottage",
    checkIn: "2026-10-16",
    checkOut: "2026-10-18",
    guests: 2,
    guestDetails: {
      name: "Dr. Anika Tabassum",
      phone: "01755667788",
      email: "anika.tabassum@example.com",
    },
    total: 7000,
    advance: 1020,
    createdAt: "2026-10-01T11:20:00.000Z",
  },
  {
    id: "bk_seed_oct_06",
    source: "website",
    status: "confirmed",
    roomId: "ch-1",
    roomName: "Chumui-1",
    categoryLabel: "3-Bed Room",
    checkIn: "2026-10-20",
    checkOut: "2026-10-22",
    guests: 6,
    guestDetails: {
      name: "Zubair Al Mamun",
      phone: "01811443322",
      email: "zubair.mamun@example.com",
    },
    total: 9000,
    advance: 1020,
    createdAt: "2026-10-03T08:10:00.000Z",
  },
  {
    id: "bk_seed_oct_07",
    source: "website",
    status: "confirmed",
    roomId: "chhaya",
    roomName: "Chhaya",
    categoryLabel: "Couple Cottage",
    checkIn: "2026-10-24",
    checkOut: "2026-10-26",
    guests: 2,
    guestDetails: {
      name: "Sadia Rahman",
      phone: "01799887766",
      email: "sadia.rahman@example.com",
    },
    total: 7000,
    advance: 1020,
    createdAt: "2026-10-05T13:00:00.000Z",
  },
  {
    id: "bk_seed_oct_08",
    source: "manual",
    status: "confirmed",
    roomId: "kp-2",
    roomName: "Khumpui-2",
    categoryLabel: "2-Bed Room",
    checkIn: "2026-10-28",
    checkOut: "2026-10-30",
    guests: 4,
    guestDetails: {
      name: "Imran Hossain",
      phone: "01555664433",
      email: "imran.hossain@example.com",
    },
    total: 7000,
    advance: 1020,
    createdAt: "2026-10-08T18:20:00.000Z",
  },
  {
    id: "bk_seed_oct_09",
    source: "website",
    status: "pending",
    roomId: "kp-1",
    roomName: "Khumpui-1",
    categoryLabel: "Couple Room",
    checkIn: "2026-10-22",
    checkOut: "2026-10-24",
    guests: 2,
    guestDetails: {
      name: "Ashraf Ali",
      phone: "01722334455",
      email: "ashraf.ali@example.com",
    },
    total: 5000,
    advance: 1020,
    notes: "Awaiting bKash deposit verification",
    createdAt: "2026-10-10T12:00:00.000Z",
  },

  // --- NOVEMBER 2026 BOOKINGS ---
  {
    id: "bk_seed_nov_01",
    source: "website",
    status: "confirmed",
    roomId: "brishti",
    roomName: "Brishti",
    categoryLabel: "Couple Cottage",
    checkIn: "2026-11-03",
    checkOut: "2026-11-05",
    guests: 2,
    guestDetails: {
      name: "Nusrat Jahan",
      phone: "01822334455",
      email: "nusrat.jahan@example.com",
    },
    total: 6000,
    advance: 1020,
    createdAt: "2026-10-02T15:00:00.000Z",
  },
  {
    id: "bk_seed_nov_02",
    source: "manual",
    status: "confirmed",
    roomId: "kt-1",
    roomName: "Khumtai-1",
    categoryLabel: "2-Bed Room",
    checkIn: "2026-11-06",
    checkOut: "2026-11-08",
    guests: 4,
    guestDetails: {
      name: "Sayed Al-Amin",
      phone: "01711998877",
      email: "sayed.alamin@example.com",
    },
    total: 7000,
    advance: 1020,
    notes: "Corporate retreat inquiry",
    createdAt: "2026-10-04T10:45:00.000Z",
  },
  {
    id: "bk_seed_nov_03",
    source: "website",
    status: "confirmed",
    roomId: "megh",
    roomName: "Megh",
    categoryLabel: "Couple Cottage",
    checkIn: "2026-11-10",
    checkOut: "2026-11-12",
    guests: 2,
    guestDetails: {
      name: "Adnan Sami",
      phone: "01988776655",
      email: "adnan.sami@example.com",
    },
    total: 6000,
    advance: 1020,
    createdAt: "2026-10-06T09:15:00.000Z",
  },
  {
    id: "bk_seed_nov_04",
    source: "manual",
    status: "confirmed",
    roomId: "ch-2",
    roomName: "Chumui-2",
    categoryLabel: "3-Bed Room",
    checkIn: "2026-11-13",
    checkOut: "2026-11-15",
    guests: 6,
    guestDetails: {
      name: "Enamul Haque",
      phone: "01611223344",
      email: "enamul.haque@example.com",
    },
    total: 9000,
    advance: 1020,
    notes: "Weekend family booking",
    createdAt: "2026-10-07T14:20:00.000Z",
  },
  {
    id: "bk_seed_nov_05",
    source: "website",
    status: "confirmed",
    roomId: "chhaya",
    roomName: "Chhaya",
    categoryLabel: "Couple Cottage",
    checkIn: "2026-11-17",
    checkOut: "2026-11-19",
    guests: 2,
    guestDetails: {
      name: "Farzana Boby",
      phone: "01733445566",
      email: "farzana.boby@example.com",
    },
    total: 6000,
    advance: 1020,
    createdAt: "2026-10-09T11:40:00.000Z",
  },
  {
    id: "bk_seed_nov_06",
    source: "website",
    status: "confirmed",
    roomId: "rod",
    roomName: "Rod",
    categoryLabel: "Couple Cottage",
    checkIn: "2026-11-20",
    checkOut: "2026-11-22",
    guests: 2,
    guestDetails: {
      name: "Kazi Ashikur Rahman",
      phone: "01855667788",
      email: "ashikur.kazi@example.com",
    },
    total: 7000,
    advance: 1020,
    createdAt: "2026-10-10T16:00:00.000Z",
  },
  {
    id: "bk_seed_nov_07",
    source: "manual",
    status: "confirmed",
    roomId: "kp-1",
    roomName: "Khumpui-1",
    categoryLabel: "Couple Room",
    checkIn: "2026-11-24",
    checkOut: "2026-11-26",
    guests: 2,
    guestDetails: {
      name: "Moshiur Rahman",
      phone: "01744556677",
      email: "moshiur.r@example.com",
    },
    total: 5000,
    advance: 1020,
    createdAt: "2026-10-11T13:30:00.000Z",
  },
  {
    id: "bk_seed_nov_08",
    source: "website",
    status: "confirmed",
    roomId: "ch-3",
    roomName: "Chumui-3",
    categoryLabel: "3-Bed Room",
    checkIn: "2026-11-27",
    checkOut: "2026-11-29",
    guests: 6,
    guestDetails: {
      name: "Sharif Ahmed Group",
      phone: "01933221100",
      email: "sharif.group@example.com",
    },
    total: 9000,
    advance: 1020,
    createdAt: "2026-10-12T08:00:00.000Z",
  },
  {
    id: "bk_seed_nov_09",
    source: "website",
    status: "pending",
    roomId: "rod",
    roomName: "Rod",
    categoryLabel: "Couple Cottage",
    checkIn: "2026-11-14",
    checkOut: "2026-11-16",
    guests: 2,
    guestDetails: {
      name: "Shahriar Kabir",
      phone: "01866778899",
      email: "shahriar.kabir@example.com",
    },
    total: 7000,
    advance: 1020,
    notes: "New pending website request",
    createdAt: "2026-10-12T14:30:00.000Z",
  },
  {
    id: "bk_seed_nov_10",
    source: "website",
    status: "pending",
    roomId: "megh",
    roomName: "Megh",
    categoryLabel: "Couple Cottage",
    checkIn: "2026-11-28",
    checkOut: "2026-11-30",
    guests: 2,
    guestDetails: {
      name: "Tanvir Hasan",
      phone: "01788990011",
      email: "tanvir.hasan@example.com",
    },
    total: 7000,
    advance: 1020,
    notes: "Requires room on upper hill side",
    createdAt: "2026-10-12T15:45:00.000Z",
  },
];

export async function GET() {
  return handleSeed();
}

export async function POST() {
  return handleSeed();
}

async function handleSeed() {
  try {
    const bookingsCollection = await getBookingsCollection();
    const roomsCollection = await getRoomsCollection();

    // 1. Seed default rooms if missing
    const existingRooms = await roomsCollection.countDocuments();
    if (existingRooms === 0) {
      await roomsCollection.insertMany(defaultRooms);
    }

    // 2. Insert or update sample bookings
    let insertedCount = 0;
    for (const booking of sampleBookings) {
      const existing = await bookingsCollection.findOne({ id: booking.id });
      if (!existing) {
        await bookingsCollection.insertOne(booking);
        insertedCount++;
      }
    }

    const totalBookings = await bookingsCollection.countDocuments();
    const totalRooms = await roomsCollection.countDocuments();

    return NextResponse.json({
      success: true,
      message: `Database seeded successfully. Inserted ${insertedCount} new bookings.`,
      stats: {
        totalRooms,
        totalBookings,
      },
    });
  } catch (error: unknown) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
