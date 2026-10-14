export interface Review {
  id: string;
  guestName: string;
  location?: string;
  quote: string;
  rating: number;
  stayType?: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category:
    | "exterior"
    | "cottage"
    | "room"
    | "balcony"
    | "mountain"
    | "food"
    | "evening"
    | "guests";
  span?: "wide" | "tall" | "large" | "normal";
}
