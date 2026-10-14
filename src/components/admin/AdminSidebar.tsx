"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  CalendarCheck,
  BarChart3,
  BedDouble,
  Archive,
  ExternalLink,
  LogOut,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SessionPayload } from "@/types/auth";

const NAV_ITEMS = [
  { href: "/admin/requests", label: "Booking Requests", icon: ClipboardList },
  { href: "/admin/bookings", label: "Confirmed Bookings", icon: CalendarCheck },
  { href: "/admin/rooms", label: "Rooms", icon: BedDouble },
  { href: "/admin/archive", label: "Archive", icon: Archive },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SessionPayload | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        }
      })
      .catch((err) => console.warn("Failed to load user profile:", err));
  }, []);

  const handleSignOut = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Signout failed:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-forest/10 bg-mist px-4 py-4 md:h-screen md:w-64 md:border-b-0 md:border-r md:px-5 md:py-8">
      <Link href="/admin" className="px-2 font-serif-display text-lg tracking-[0.08em] text-forest">
        SAMPARI ADMIN
      </Link>

      <nav className="mt-6 flex gap-1 overflow-x-auto md:mt-10 md:flex-col md:overflow-visible">
        {NAV_ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-forest text-mist"
                  : "text-mountain hover:bg-forest/5 hover:text-forest"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user profile and actions */}
      <div className="mt-auto hidden flex-col gap-2 border-t border-forest/10 pt-5 md:flex">
        {user && (
          <div className="flex items-center gap-2.5 rounded-2xl bg-forest/[0.04] p-3 text-xs">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-sand">
              <UserCheck className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-forest">{user.name}</p>
              <p className="truncate text-[10px] text-sage">{user.email}</p>
            </div>
          </div>
        )}

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-sage transition-colors hover:bg-forest/5 hover:text-forest"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>View Live Site</span>
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={loggingOut}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-brown transition-colors hover:bg-brown/10 disabled:opacity-50"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{loggingOut ? "Signing Out..." : "Sign Out"}</span>
        </button>
      </div>

      {/* Mobile Sign Out button */}
      <div className="mt-3 flex items-center justify-between border-t border-forest/10 pt-3 md:hidden">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs text-sage"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>Live Site</span>
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={loggingOut}
          className="flex items-center gap-1.5 text-xs font-semibold text-brown"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
