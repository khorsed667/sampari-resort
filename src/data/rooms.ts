import { Room, RoomCategoryGroup, RoomDisplayCard } from "@/types/room";

// Individual rooms — this is the "source of truth" list.
// In a future backend/admin phase, this array will be replaced by an API call,
// but every component below only ever reads the Room type, so the swap is safe.
export const rooms: Room[] = [
  {
    id: "rod",
    name: "Rod",
    shortName: "Rod",
    banglaName: "রোদ",
    category: "couple-cottage",
    categoryLabel: "Couple Cottage",
    capacity: 2,
    beds: 1,
    weekendPrice: 3500,
    weekdayDiscount: 500,
    image: "/images/rooms/rod.svg",
    description:
      "A sunlit wooden cottage named for the morning light that spills across Sajek's ridgelines. Warm, quiet, and built for two.",
    features: ["Private balcony", "Mountain view", "Mosquito net", "Attached washroom"],
  },
  {
    id: "brishti",
    name: "Brishti",
    shortName: "Brishti",
    banglaName: "বৃষ্টি",
    category: "couple-cottage",
    categoryLabel: "Couple Cottage",
    capacity: 2,
    beds: 1,
    weekendPrice: 3500,
    weekdayDiscount: 500,
    image: "/images/rooms/brishti.svg",
    description:
      "Named for Sajek's sudden hill rain, Brishti is a cosy bamboo-and-wood cottage where the sound of rain on the roof becomes part of the stay.",
    features: ["Private balcony", "Mountain view", "Mosquito net", "Attached washroom"],
  },
  {
    id: "megh",
    name: "Megh",
    shortName: "Megh",
    banglaName: "মেঘ",
    category: "couple-cottage",
    categoryLabel: "Couple Cottage",
    capacity: 2,
    beds: 1,
    weekendPrice: 3500,
    weekdayDiscount: 500,
    image: "/images/rooms/megh.svg",
    description:
      "Megh means cloud — and this cottage sits closest to where the clouds settle each morning. A quiet favourite among returning guests.",
    features: ["Private balcony", "Cloud-facing view", "Mosquito net", "Attached washroom"],
  },
  {
    id: "chhaya",
    name: "Chhaya",
    shortName: "Chhaya",
    banglaName: "ছায়া",
    category: "couple-cottage",
    categoryLabel: "Couple Cottage",
    capacity: 2,
    beds: 1,
    weekendPrice: 3500,
    weekdayDiscount: 500,
    image: "/images/rooms/chhaya.svg",
    description:
      "Chhaya means shade — a cool, tree-shaded cottage for guests who want their mornings a little slower and their afternoons a little quieter.",
    features: ["Private balcony", "Shaded setting", "Mosquito net", "Attached washroom"],
  },
  {
    id: "kp-1",
    name: "Khumpui-1",
    shortName: "KP-1",
    banglaName: "খুমপুই-১",
    category: "couple-room",
    categoryLabel: "Couple Room",
    capacity: 2,
    beds: 1,
    weekendPrice: 2500,
    weekdayDiscount: 500,
    image: "/images/rooms/kp1.svg",
    description:
      "A simple, comfortable couple's room — the resort's most accessible stay, without compromising on the view that Sampari is known for.",
    features: ["Mountain-facing window", "Mosquito net", "Attached washroom"],
  },
  {
    id: "kp-2",
    name: "Khumpui-2",
    shortName: "KP-2",
    banglaName: "খুমপুই-২",
    category: "twin-room",
    categoryLabel: "2-Bed Room",
    capacity: 4,
    beds: 2,
    weekendPrice: 3500,
    weekdayDiscount: 500,
    image: "/images/rooms/kp2.svg",
    description:
      "Two beds, room to breathe. Well suited to small families or two couples travelling together who still want their own space.",
    features: ["Two beds", "Mountain view", "Mosquito net", "Attached washroom"],
  },
  {
    id: "kt-1",
    name: "Khumtai-1",
    shortName: "KT-1",
    banglaName: "খুমতাই-১",
    category: "twin-room",
    categoryLabel: "2-Bed Room",
    capacity: 4,
    beds: 2,
    weekendPrice: 3500,
    weekdayDiscount: 500,
    image: "/images/rooms/kt1.svg",
    description:
      "A bright, airy twin room tucked toward the quieter end of the resort — good for friends or family who want easy access to the hillside paths.",
    features: ["Two beds", "Mountain view", "Mosquito net", "Attached washroom"],
  },
  {
    id: "kt-2",
    name: "Khumtai-2",
    shortName: "KT-2",
    banglaName: "খুমতাই-২",
    category: "family-room",
    categoryLabel: "3-Bed Room",
    capacity: 6,
    beds: 3,
    weekendPrice: 4500,
    weekdayDiscount: 500,
    image: "/images/rooms/kt2.svg",
    description:
      "The resort's larger family room — three beds and enough floor space for children to spread out after a day exploring the valley.",
    features: ["Three beds", "Mountain view", "Mosquito net", "Attached washroom"],
  },
  {
    id: "ch-1",
    name: "Chumui-1",
    shortName: "CH-1",
    banglaName: "চুমুই-১",
    category: "family-room",
    categoryLabel: "3-Bed Room",
    capacity: 6,
    beds: 3,
    weekendPrice: 4500,
    weekdayDiscount: 500,
    image: "/images/rooms/ch1.svg",
    description:
      "A spacious family room close to the resort's open sitting area, good for groups who plan to gather in the evenings.",
    features: ["Three beds", "Mountain view", "Mosquito net", "Attached washroom"],
  },
  {
    id: "ch-2",
    name: "Chumui-2",
    shortName: "CH-2",
    banglaName: "চুমুই-২",
    category: "family-room",
    categoryLabel: "3-Bed Room",
    capacity: 6,
    beds: 3,
    weekendPrice: 4500,
    weekdayDiscount: 500,
    image: "/images/rooms/ch2.svg",
    description:
      "Wood-panelled and generously sized, Chumui-2 is a favourite with larger families visiting Sajek together.",
    features: ["Three beds", "Mountain view", "Mosquito net", "Attached washroom"],
  },
  {
    id: "ch-3",
    name: "Chumui-3",
    shortName: "CH-3",
    banglaName: "চুমুই-৩",
    category: "family-room",
    categoryLabel: "3-Bed Room",
    capacity: 6,
    beds: 3,
    weekendPrice: 4500,
    weekdayDiscount: 500,
    image: "/images/rooms/ch3.svg",
    description:
      "The last of the resort's 3-bed rooms, set slightly apart for a touch more privacy while still close to everything.",
    features: ["Three beds", "Mountain view", "Mosquito net", "Attached washroom"],
  },
];

// Grouped view used by the homepage Rooms section — groups rooms into the
// 4 categories from the brief while still surfacing individual room names.
export const roomCategoryGroups: RoomCategoryGroup[] = [
  {
    category: "couple-cottage",
    categoryLabel: "Couple Cottage",
    tagline: "Rod · Brishti · Megh · Chhaya",
    capacity: 2,
    beds: 1,
    weekendPrice: 3500,
    weekdayDiscount: 500,
    image: "/images/rooms/rod.svg",
    description:
      "Four standalone wooden and bamboo cottages, each named for something you'll notice in Sajek's sky — sun, rain, cloud, shade.",
    features: ["Private balcony", "Mountain view", "Mosquito net", "Attached washroom"],
    rooms: rooms.filter((r) => r.category === "couple-cottage"),
  },
  {
    category: "couple-room",
    categoryLabel: "Couple Room",
    tagline: "Khumpui-1",
    capacity: 2,
    beds: 1,
    weekendPrice: 2500,
    weekdayDiscount: 500,
    image: "/images/rooms/kp1.svg",
    description:
      "A comfortable, simply furnished room for two — Sampari's most approachable stay.",
    features: ["Mountain-facing window", "Mosquito net", "Attached washroom"],
    rooms: rooms.filter((r) => r.category === "couple-room"),
  },
  {
    category: "twin-room",
    categoryLabel: "2-Bed Room",
    tagline: "Khumpui-2 · Khumtai-1",
    capacity: 4,
    beds: 2,
    weekendPrice: 3500,
    weekdayDiscount: 500,
    image: "/images/rooms/kp2.svg",
    description:
      "Two beds and a little more room to spread out — well suited to small families or friends travelling together.",
    features: ["Two beds", "Mountain view", "Mosquito net", "Attached washroom"],
    rooms: rooms.filter((r) => r.category === "twin-room"),
  },
  {
    category: "family-room",
    categoryLabel: "3-Bed Room",
    tagline: "Khumtai-2 · Chumui-1 · Chumui-2 · Chumui-3",
    capacity: 6,
    beds: 3,
    weekendPrice: 4500,
    weekdayDiscount: 500,
    image: "/images/rooms/kt2.svg",
    description:
      "The resort's largest rooms — three beds each, built for families and groups who want to stay together.",
    features: ["Three beds", "Mountain view", "Mosquito net", "Attached washroom"],
    rooms: rooms.filter((r) => r.category === "family-room"),
  },
];

export const resortStats = {
  totalCottages: 7,
  totalRooms: 11,
  totalBeds: 21,
  maxCapacity: 42,
};

export const extraGuestCharge = 500;

// --- Display-card mappers -------------------------------------------------
// The Rooms grid can show a whole category ("Couple Cottage", covering Rod /
// Brishti / Megh / Chhaya) or, once filtered to one category, each room
// individually by its own name. Both feed the same RoomCard/RoomModal via
// this shared RoomDisplayCard shape.

export function groupToDisplayCard(group: RoomCategoryGroup): RoomDisplayCard {
  return {
    id: group.category,
    heading: group.categoryLabel,
    categoryBadge: group.categoryLabel,
    subheading: group.tagline,
    capacity: group.capacity,
    beds: group.beds,
    weekendPrice: group.weekendPrice,
    weekdayDiscount: group.weekdayDiscount,
    image: group.image,
    description: group.description,
    features: group.features,
    lightboxImages: group.rooms.map((room) => ({
      src: room.image,
      alt: `${room.name}${room.banglaName ? ` (${room.banglaName})` : ""} — ${group.categoryLabel}`,
    })),
    siblingRooms:
      group.rooms.length > 1
        ? group.rooms.map((room) => ({
            id: room.id,
            name: room.name,
            banglaName: room.banglaName,
          }))
        : undefined,
  };
}

export function roomToDisplayCard(room: Room): RoomDisplayCard {
  const siblings = rooms.filter((r) => r.category === room.category && r.id !== room.id);
  return {
    id: room.id,
    heading: room.name,
    categoryBadge: room.categoryLabel,
    subheading: room.banglaName ?? room.categoryLabel,
    capacity: room.capacity,
    beds: room.beds,
    weekendPrice: room.weekendPrice,
    weekdayDiscount: room.weekdayDiscount,
    image: room.image,
    description: room.description,
    features: room.features,
    lightboxImages: [
      {
        src: room.image,
        alt: `${room.name}${room.banglaName ? ` (${room.banglaName})` : ""} — ${room.categoryLabel}`,
      },
    ],
    siblingRooms:
      siblings.length > 0
        ? siblings.map((r) => ({ id: r.id, name: r.name, banglaName: r.banglaName }))
        : undefined,
  };
}
