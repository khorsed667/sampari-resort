export interface GuestDetails {
  name: string;
  phone: string;
  email: string;
}

export type BookingSource = "website" | "manual";
export type BookingStatus = "pending" | "confirmed" | "rejected";

export interface BookingRecord {
  id: string;
  source: BookingSource;
  status: BookingStatus;
  roomId: string;
  roomName: string;
  categoryLabel: string;
  checkIn: string; // ISO date
  checkOut: string; // ISO date
  guests: number;
  guestDetails: GuestDetails;
  total: number;
  advance: number;
  notes?: string;
  createdAt: string; // ISO datetime
}

export interface PriceBreakdown {
  nights: number;
  weekendNights: number;
  weekdayNights: number;
  baseTotal: number;
  extraGuestCharge: number;
  extraGuests: number;
  total: number;
}

export interface UnavailableRange {
  roomId: string | "all";
  dates: string[];
}
