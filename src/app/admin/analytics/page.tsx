"use client";

import { CalendarCheck, Wallet, ClipboardList } from "lucide-react";
import { useBookings } from "@/lib/useBookings";
import { formatTaka } from "@/lib/pricing";
import { totalRevenue, totalConfirmedCount } from "@/lib/analytics";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";

export default function AnalyticsPage() {
  const bookings = useBookings();
  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <div>
      <header>
        <h1 className="font-serif-display text-2xl text-forest md:text-3xl">Analytics</h1>
        <p className="mt-1.5 text-sm text-mountain">
          Booking volume and revenue over time, from confirmed bookings.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={CalendarCheck}
          label="Confirmed Bookings"
          value={String(totalConfirmedCount(bookings))}
        />
        <StatCard icon={Wallet} label="Total Revenue" value={formatTaka(totalRevenue(bookings))} />
        <StatCard icon={ClipboardList} label="Pending Requests" value={String(pendingCount)} />
      </div>

      <div className="mt-8">
        <AnalyticsCharts bookings={bookings} />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl bg-mist p-5">
      <Icon className="h-5 w-5 text-mountain" strokeWidth={1.5} />
      <p className="mt-3 font-serif-display text-2xl text-forest">{value}</p>
      <p className="mt-1 text-xs text-sage">{label}</p>
    </div>
  );
}
