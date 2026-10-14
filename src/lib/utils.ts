export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Adds N days to an ISO ("YYYY-MM-DD") date string, returning a new ISO string. */
export function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

/** Every night actually occupied by a stay — checkIn inclusive, checkOut exclusive. */
export function expandDateRange(checkIn: string, checkOut: string): string[] {
  const dates: string[] = [];
  let cursor = checkIn;
  while (cursor < checkOut) {
    dates.push(cursor);
    cursor = addDaysISO(cursor, 1);
  }
  return dates;
}
