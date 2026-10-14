"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCheckAvailability } from "@/components/ui/CheckAvailabilityProvider";

const NAV_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "Stay", href: "/#stay" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Location", href: "/#location" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open: openCheckAvailability } = useCheckAvailability();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const solid = scrolled || mobileOpen;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[60] transition-all duration-500",
          solid
            ? "bg-cream/95 shadow-sm shadow-forest/5 backdrop-blur-md border-b border-forest/10"
            : "bg-transparent"
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10 md:py-5">
          <Link
            href="/#home"
            className={cn(
              "font-serif-display text-lg tracking-[0.12em] transition-colors duration-500 md:text-xl",
              solid ? "text-forest" : "text-mist"
            )}
          >
            SAMPARI RESORT
          </Link>

          <ul className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm font-medium tracking-wide transition-colors duration-500",
                    solid
                      ? "text-mountain hover:text-forest"
                      : "text-mist/90 hover:text-mist"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => openCheckAvailability()}
            className={cn(
              "hidden rounded-full border px-5 py-2.5 text-sm font-medium tracking-wide transition-all duration-500 md:inline-block",
              solid
                ? "border-forest bg-forest text-mist hover:bg-mountain"
                : "border-mist/70 text-mist hover:bg-mist/10"
            )}
          >
            Check Availability
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className={cn(
              "relative z-10 md:hidden",
              solid ? "text-forest" : "text-mist"
            )}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </header>

      {/* Mobile menu panel — rendered as a sibling of <header>, not a child.
          Header uses backdrop-blur when solid, which creates a new containing
          block for position:fixed descendants; nesting the panel inside it
          would trap the panel inside header's own (small) box instead of
          the viewport. */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-cream transition-opacity duration-300 md:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        <ul className="mt-28 flex flex-1 flex-col gap-1 px-8">
          {NAV_LINKS.map((link, i) => (
            <li
              key={link.href}
              className="border-b border-forest/10 py-4"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <Link
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-serif-display text-2xl text-forest"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="px-8 pb-10">
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              openCheckAvailability();
            }}
            className="block w-full rounded-full bg-forest px-6 py-3.5 text-center text-sm font-medium tracking-wide text-mist"
          >
            Check Availability
          </button>
        </div>
      </div>
    </>
  );
}
