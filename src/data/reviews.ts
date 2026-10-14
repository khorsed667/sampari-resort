import { Review } from "@/types/experience";

// Placeholder reviews written in the resort's voice, styled after real guest
// feedback patterns. Replace with verified reviews when available — structured
// so a future admin panel can manage this list directly.
export const reviews: Review[] = [
  {
    id: "r1",
    guestName: "Farhana R.",
    location: "Dhaka",
    quote:
      "Waking up surrounded by clouds made the whole trip worth it. Our cottage balcony looked straight into the valley.",
    rating: 5,
    stayType: "Couple Cottage",
  },
  {
    id: "r2",
    guestName: "Tanvir A.",
    location: "Chattogram",
    quote:
      "Quiet, well kept, and the staff were genuinely kind. We watched the sunrise from bed without leaving the room.",
    rating: 5,
    stayType: "3-Bed Room",
  },
  {
    id: "r3",
    guestName: "Nusrat J.",
    location: "Sylhet",
    quote:
      "Simple and peaceful in the best way. No noise, no rush — just hills, tea, and time to slow down.",
    rating: 4,
    stayType: "Couple Room",
  },
  {
    id: "r4",
    guestName: "Rakib H.",
    location: "Dhaka",
    quote:
      "Booked last minute over WhatsApp and the whole process was easy. The evening bonfire was the highlight for our kids.",
    rating: 5,
    stayType: "2-Bed Room",
  },
];
