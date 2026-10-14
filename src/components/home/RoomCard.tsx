"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, BedDouble, Expand } from "lucide-react";
import { RoomDisplayCard } from "@/types/room";
import { getWeekdayPrice, formatTaka } from "@/lib/pricing";
import { useLightbox } from "@/components/ui/LightboxProvider";
import { useCheckAvailability } from "@/components/ui/CheckAvailabilityProvider";

export default function RoomCard({
  card,
  categoryId,
  roomId,
}: {
  card: RoomDisplayCard;
  /** The category id — used to pre-select in the availability modal. */
  categoryId: string;
  /** This card's own room id — used both for the detail-page link and to lock booking to it. */
  roomId: string;
}) {
  const weekdayPrice = getWeekdayPrice(card);
  const { open: openLightbox } = useLightbox();
  const { open: openCheckAvailability } = useCheckAvailability();

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl bg-mist ring-1 ring-forest/[0.06] transition-shadow duration-500 hover:shadow-xl hover:shadow-forest/10">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <button
          type="button"
          onClick={() => openLightbox({ items: card.lightboxImages, startIndex: 0 })}
          aria-label={`Open full-screen photos of ${card.heading}`}
          className="absolute inset-0 h-full w-full cursor-zoom-in"
        >
          <Image
            src={card.image}
            alt={`${card.heading} at Sampari Resort`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-forest/0 opacity-0 transition-all duration-300 group-hover:bg-forest/20 group-hover:opacity-100">
            <Expand className="h-6 w-6 text-mist drop-shadow" strokeWidth={1.5} />
          </div>
        </button>
        <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-mist/90 px-3 py-1 text-[11px] font-semibold tracking-wide text-forest">
          {card.categoryBadge}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif-display text-xl text-forest">{card.heading}</h3>
        <p className="mt-1 text-sm text-sage">{card.subheading}</p>

        <div className="mt-4 flex items-center gap-4 text-sm text-mountain">
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" /> {card.capacity} guests
          </span>
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-3.5 w-3.5" /> {card.beds} {card.beds > 1 ? "beds" : "bed"}
          </span>
        </div>

        <p className="mt-4 flex-1 text-sm leading-relaxed text-mountain">
          {card.description}
        </p>

        <div className="mt-5 flex items-end justify-between border-t border-forest/10 pt-4">
          <div>
            <p className="text-xs text-sage">Weekday from</p>
            <p className="font-serif-display text-lg text-forest">
              {formatTaka(weekdayPrice)}
              <span className="text-xs font-sans text-sage"> /night</span>
            </p>
            <p className="text-xs text-sage">
              Weekend {formatTaka(card.weekendPrice)}
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <Link
            href={`/rooms/${roomId}`}
            className="flex-1 rounded-full border border-forest/20 px-4 py-2.5 text-center text-sm font-medium text-forest transition-colors hover:bg-forest/5"
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={() => openCheckAvailability({ roomCategory: categoryId, roomId })}
            className="flex-1 rounded-full bg-forest px-4 py-2.5 text-center text-sm font-medium text-mist transition-colors hover:bg-mountain"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
