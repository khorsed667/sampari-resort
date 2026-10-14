import { BookingRecord } from "@/types/booking";

export type AnalyticsPeriod = "weekly" | "monthly" | "yearly";

export interface PeriodBucket {
  key: string;
  label: string;
  bookings: number;
  revenue: number;
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Groups confirmed bookings (website + manual — both count toward real
 * revenue) by check-in date into weekly, monthly, or yearly buckets.
 */
export function bucketBookings(
  bookings: BookingRecord[],
  period: AnalyticsPeriod
): PeriodBucket[] {
  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const buckets = new Map<string, PeriodBucket>();

  confirmed.forEach((b) => {
    const date = new Date(b.checkIn);
    let key: string;
    let label: string;

    if (period === "yearly") {
      key = String(date.getFullYear());
      label = key;
    } else if (period === "monthly") {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      label = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    } else {
      const weekStart = startOfWeek(date);
      key = weekStart.toISOString().slice(0, 10);
      label = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }

    const existing = buckets.get(key);
    if (existing) {
      existing.bookings += 1;
      existing.revenue += b.total;
    } else {
      buckets.set(key, { key, label, bookings: 1, revenue: b.total });
    }
  });

  return Array.from(buckets.values()).sort((a, b) => a.key.localeCompare(b.key));
}

export function totalRevenue(bookings: BookingRecord[]): number {
  return bookings.filter((b) => b.status === "confirmed").reduce((sum, b) => sum + b.total, 0);
}

export function totalConfirmedCount(bookings: BookingRecord[]): number {
  return bookings.filter((b) => b.status === "confirmed").length;
}
