export const RESORT_WHATSAPP_NUMBER = "8801849889055";

export interface WhatsAppBookingDetails {
  name: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  roomName: string;
  guests: number;
  estimatedPrice: string;
  message?: string;
}

/**
 * Builds a wa.me URL with a pre-filled, fully-encoded booking message.
 * Wired up in Phase 2 — kept here now so the booking bar / room modal
 * can start pointing at it without further refactors.
 */
export function generateWhatsAppBookingUrl(details: WhatsAppBookingDetails): string {
  const lines = [
    "Assalamu Alaikum,",
    "I would like to request a booking at Sampari Resort.",
    "",
    `Name: ${details.name}`,
    `Phone: ${details.phone}`,
    `Check-in: ${details.checkIn}`,
    `Check-out: ${details.checkOut}`,
    `Room: ${details.roomName}`,
    `Guests: ${details.guests}`,
    `Estimated Price: ${details.estimatedPrice}`,
    "Special Request:",
    details.message?.trim() ? details.message : "None",
    "",
    "Please confirm availability and booking details.",
    "Thank you.",
  ];

  const message = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${RESORT_WHATSAPP_NUMBER}?text=${message}`;
}

/** Simple contact link (no pre-filled message) used in the footer/nav. */
export function getWhatsAppContactUrl(): string {
  return `https://wa.me/${RESORT_WHATSAPP_NUMBER}`;
}

/** A short, pre-filled inquiry — used by the mobile sticky booking bar,
 * where no dates/room have been chosen yet. */
export function getQuickInquiryUrl(): string {
  const message = encodeURIComponent(
    "Assalamu Alaikum, I'd like to check room availability at Sampari Resort."
  );
  return `https://wa.me/${RESORT_WHATSAPP_NUMBER}?text=${message}`;
}

export interface QuickAvailabilityFields {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  roomLabel?: string;
}

/** Used by the "Check Availability" quick modal available from anywhere on
 * the site. Builds a best-effort inquiry from whichever fields the guest
 * filled in — dates and room aren't required to send the message. */
export function generateQuickAvailabilityUrl(fields: QuickAvailabilityFields): string {
  const lines = [
    "Assalamu Alaikum,",
    "I'd like to check availability at Sampari Resort.",
    "",
  ];

  if (fields.checkIn) lines.push(`Check-in: ${fields.checkIn}`);
  if (fields.checkOut) lines.push(`Check-out: ${fields.checkOut}`);
  if (fields.guests) lines.push(`Guests: ${fields.guests}`);
  if (fields.roomLabel) lines.push(`Room: ${fields.roomLabel}`);

  lines.push("", "Please let me know what's available. Thank you.");

  const message = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${RESORT_WHATSAPP_NUMBER}?text=${message}`;
}

export interface BookingRequestFields {
  checkIn: string;
  checkOut: string;
  guests: number;
  roomLabel: string;
  total: number;
  advance: number;
}

/**
 * Used once a specific room, dates and guest count are all known (the
 * "locked" Check Availability flow). Includes the computed total for the
 * stay and the flat per-room bKash advance, so the guest sees exactly what
 * they're committing to before WhatsApp even opens.
 */
export function generateBookingRequestUrl(fields: BookingRequestFields): string {
  const dueAtProperty = Math.max(0, fields.total - fields.advance);

  const lines = [
    "Assalamu Alaikum,",
    "I would like to request a booking at Sampari Resort.",
    "",
    `Room: ${fields.roomLabel}`,
    `Check-in: ${fields.checkIn}`,
    `Check-out: ${fields.checkOut}`,
    `Guests: ${fields.guests}`,
    "",
    `Estimated Total: ৳${fields.total.toLocaleString("en-US")}`,
    `Advance Payment (bKash): ৳${fields.advance.toLocaleString("en-US")}`,
    `Due at Property: ৳${dueAtProperty.toLocaleString("en-US")}`,
    "",
    "Please confirm availability and booking details.",
    "Thank you.",
  ];

  const message = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${RESORT_WHATSAPP_NUMBER}?text=${message}`;
}
