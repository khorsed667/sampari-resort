import { UnavailableRange } from "@/types/booking";

// Empty until the admin dashboard exists. A room's dates should only ever
// show as "Booked" here after an admin has actually confirmed and marked
// that booking — never as placeholder/test data, since a false "booked"
// date could turn away a real guest.
//
// The shape is already what the admin dashboard will write to: an "all"
// entry for resort-wide closures, plus one entry per room id for that
// room's own confirmed bookings. lib/availability.ts's functions (and the
// booked-date styling in the Calendar component) are already built against
// this shape, so wiring in real data later — from Supabase or the admin
// panel's own storage — is a drop-in change here, not a rewrite.
export const unavailableRanges: UnavailableRange[] = [];
