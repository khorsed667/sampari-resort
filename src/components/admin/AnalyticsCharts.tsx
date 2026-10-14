"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BookingRecord } from "@/types/booking";
import { bucketBookings, AnalyticsPeriod } from "@/lib/analytics";
import { formatTaka } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const PERIOD_OPTIONS: { value: AnalyticsPeriod; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export default function AnalyticsCharts({ bookings }: { bookings: BookingRecord[] }) {
  const [period, setPeriod] = useState<AnalyticsPeriod>("monthly");
  const data = useMemo(() => bucketBookings(bookings, period), [bookings, period]);

  return (
    <div>
      <div className="flex gap-2">
        {PERIOD_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setPeriod(opt.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              period === opt.value
                ? "border-forest bg-forest text-mist"
                : "border-forest/15 text-mountain hover:border-forest/35"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {data.length === 0 ? (
        <div className="mt-6 rounded-3xl bg-mist p-10 text-center">
          <p className="text-sm text-mountain">
            No confirmed bookings yet — charts will fill in as bookings come through.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <ChartCard title="Bookings">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#183c3212" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#3F6652", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: "#3F6652", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#FAF9F5",
                    border: "1px solid #183c3220",
                    borderRadius: 12,
                    fontSize: 13,
                  }}
                  formatter={(value) => [String(value), "Bookings"]}
                />
                <Bar dataKey="bookings" fill="#183C32" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Revenue (৳)">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#183c3212" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#3F6652", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: "#3F6652", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#FAF9F5",
                    border: "1px solid #183c3220",
                    borderRadius: 12,
                    fontSize: 13,
                  }}
                  formatter={(value) => [formatTaka(Number(value)), "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#765C48" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-mist p-5 md:p-6">
      <p className="text-xs font-semibold tracking-[0.15em] text-sage uppercase">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
