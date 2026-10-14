export type RoomCategory =
  | "couple-cottage"
  | "couple-room"
  | "twin-room"
  | "family-room";

export interface Room {
  id: string;
  name: string;
  shortName: string;
  banglaName?: string;
  category: RoomCategory;
  categoryLabel: string;
  capacity: number;
  beds: number;
  weekendPrice: number;
  weekdayDiscount: number;
  image: string;
  gallery?: string[];
  description: string;
  features: string[];
}

export interface RoomCategoryGroup {
  category: RoomCategory;
  categoryLabel: string;
  tagline: string;
  capacity: number;
  beds: number;
  weekendPrice: number;
  weekdayDiscount: number;
  image: string;
  description: string;
  features: string[];
  rooms: Room[];
}

/**
 * A normalized shape the Rooms grid renders from, regardless of whether it's
 * showing a whole category (heading = "Couple Cottage") or one specific room
 * within a filtered category (heading = "Rod"). Keeping this separate from
 * RoomCategoryGroup/Room means RoomCard and RoomModal don't need to know
 * which mode produced the data.
 */
export interface RoomDisplayCard {
  /** Unique per card — the room id in individual mode, the category id in group mode. */
  id: string;
  /** What's shown as the card/modal heading. */
  heading: string;
  /** Always the category name — shown as the image badge for context. */
  categoryBadge: string;
  /** Shown under the heading: room names for group mode, Bangla name for individual mode. */
  subheading: string;
  capacity: number;
  beds: number;
  weekendPrice: number;
  weekdayDiscount: number;
  image: string;
  description: string;
  features: string[];
  lightboxImages: { src: string; alt: string }[];
  /** Other rooms sharing this category, for the modal's "also in this category" list. */
  siblingRooms?: { id: string; name: string; banglaName?: string }[];
}
