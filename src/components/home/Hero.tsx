"use client";

import Image from "next/image";
import Link from "next/link";
import Parallax from "@/components/ui/Parallax";
import { useCheckAvailability } from "@/components/ui/CheckAvailabilityProvider";

export default function Hero() {
  const { open: openCheckAvailability } = useCheckAvailability();

  return (
    <section id="home" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <Parallax strength={0.15} className="absolute -top-16 -bottom-16 inset-x-0 will-change-transform">
        <Image
          src="/images/hero/hero-main.svg"
          alt="Cinematic view of Sajek's misty hills at sunrise, with a wooden cottage in the foreground"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </Parallax>

      {/* Dark overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/25 to-forest/40" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="mb-5 text-xs font-semibold tracking-[0.3em] text-sand uppercase md:text-sm">
          A Quiet Escape in Sajek
        </p>
        <h1 className="max-w-3xl font-serif-display text-5xl font-medium leading-[1.08] text-mist md:text-7xl">
          Stay Above the Clouds
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-mist/85 md:text-lg">
          Wake up to misty mountains, peaceful mornings and endless views of Sajek.
        </p>

        <div className="mt-10 flex flex-col gap-3.5 sm:flex-row">
          <button
            type="button"
            onClick={() => openCheckAvailability()}
            className="rounded-full bg-mist px-8 py-3.5 text-sm font-medium tracking-wide text-forest transition-transform duration-300 hover:scale-[1.03] active:scale-95"
          >
            Check Availability
          </button>
          <Link
            href="#stay"
            className="rounded-full border border-mist/60 px-8 py-3.5 text-sm font-medium tracking-wide text-mist transition-colors duration-300 hover:bg-mist/10"
          >
            Explore Rooms
          </Link>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-mist/70 md:flex">
        <span className="text-[11px] tracking-[0.25em] uppercase">Scroll</span>
        <div className="h-9 w-px bg-mist/40" />
      </div>
    </section>
  );
}
