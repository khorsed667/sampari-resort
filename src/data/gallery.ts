import { GalleryImage } from "@/types/experience";

// Placeholder imagery — structured so real Sampari Resort photography can be
// dropped into /public/images/gallery with matching filenames later.
export const galleryImages: GalleryImage[] = [
  { id: "g1", src: "/images/gallery/exterior-1.svg", alt: "Sampari Resort grounds among the hills", category: "exterior", span: "large" },
  { id: "g2", src: "/images/gallery/cottage-1.svg", alt: "Wooden cottage exterior", category: "cottage", span: "tall" },
  { id: "g3", src: "/images/gallery/mountain-1.svg", alt: "Clouds drifting between Sajek's hills", category: "mountain", span: "wide" },
  { id: "g4", src: "/images/gallery/room-1.svg", alt: "Interior of a Sampari cottage room", category: "room" },
  { id: "g5", src: "/images/gallery/balcony-1.svg", alt: "Private balcony overlooking the valley", category: "balcony", span: "tall" },
  { id: "g6", src: "/images/gallery/mountain-2.svg", alt: "Sajek Valley at golden hour", category: "mountain", span: "wide" },
  { id: "g7", src: "/images/gallery/food-1.svg", alt: "Local food near the resort", category: "food" },
  { id: "g8", src: "/images/gallery/evening-1.svg", alt: "Evening bonfire atmosphere", category: "evening", span: "wide" },
  { id: "g9", src: "/images/gallery/guests-1.svg", alt: "Guests relaxing at the resort", category: "guests" },
  { id: "g10", src: "/images/gallery/cottage-2.svg", alt: "Bamboo cottage architecture", category: "cottage", span: "tall" },
];

// Maps the fine-grained data category onto the broader, guest-facing group
// shown as filter tabs inside the lightbox (spec: "Cottages, Views, Dining").
export const galleryCategoryLabels: Record<GalleryImage["category"], string> = {
  exterior: "Cottages",
  cottage: "Cottages",
  room: "Cottages",
  balcony: "Views",
  mountain: "Views",
  evening: "Views",
  food: "Dining",
  guests: "Moments",
};
