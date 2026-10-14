"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  BedDouble,
  Check,
  Expand,
  MapPin,
  Navigation,
  Clock,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { RoomDisplayCard } from "@/types/room";
import { getWeekdayPrice, formatTaka } from "@/lib/pricing";
import { extraGuestCharge } from "@/data/rooms";
import { useLightbox } from "@/components/ui/LightboxProvider";
import { useCheckAvailability } from "@/components/ui/CheckAvailabilityProvider";
import { Container } from "@/components/ui/Container";
import Parallax from "@/components/ui/Parallax";
import FacebookIcon from "@/components/ui/FacebookIcon";
import {
  RESORT_ADDRESS,
  RESORT_DIRECTIONS_URL,
  RESORT_FACEBOOK_URL,
  CHECK_IN_TIME,
  CHECK_OUT_TIME,
  CANCELLATION_POLICY,
  ADVANCE_PAYMENT_NOTE,
} from "@/lib/constants";

export default function RoomDetailContent({
  card,
  categoryId,
  roomId,
}: {
  card: RoomDisplayCard;
  categoryId: string;
  roomId: string;
}) {
  const { open: openLightbox } = useLightbox();
  const { open: openCheckAvailability } = useCheckAvailability();

  const weekdayPrice = getWeekdayPrice(card);

  return (
    <main>
      {/* Banner — parallax, matching the Hero treatment */}
      <section className="relative h-[56svh] min-h-[380px] w-full overflow-hidden">
        <Parallax strength={0.15} className="absolute -top-16 -bottom-16 inset-x-0 will-change-transform">
          <Image
            src={card.image}
            alt={`${card.heading} at Sampari Resort`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/20 to-forest/30" />

        <Container className="relative z-10 flex h-full flex-col justify-end pb-10">
          <Link
            href="/#stay"
            className="mb-5 flex w-fit items-center gap-1.5 text-sm font-medium text-mist/85 transition-colors hover:text-mist"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all rooms
          </Link>
          <p className="text-xs font-semibold tracking-[0.2em] text-sand uppercase">
            {card.subheading}
          </p>
          <h1 className="mt-2 font-serif-display text-4xl font-medium text-mist md:text-5xl">
            {card.heading}
          </h1>

          <button
            type="button"
            onClick={() => openLightbox({ items: card.lightboxImages, startIndex: 0 })}
            aria-label={`Open full-screen photos of ${card.heading}`}
            className="mt-4 flex w-fit items-center gap-2 rounded-full bg-mist/15 px-4 py-2 text-xs font-medium text-mist backdrop-blur-sm transition-colors hover:bg-mist/25"
          >
            <Expand className="h-3.5 w-3.5" />
            View Photos
          </button>
        </Container>
      </section>

      <Container className="max-w-3xl py-12 md:py-16">
        <div className="flex items-center gap-5 text-sm text-mountain">
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" /> Up to {card.capacity} guests
          </span>
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4" /> {card.beds} {card.beds > 1 ? "beds" : "bed"}
          </span>
        </div>

        <p className="mt-5 text-base leading-relaxed text-mountain md:text-lg">
          {card.description}
        </p>

        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5">
          {card.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-mountain">
              <Check className="h-3.5 w-3.5 shrink-0 text-sage" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-7 rounded-2xl bg-sand/25 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-mountain">Weekday / weeknight</span>
            <span className="font-serif-display text-lg text-forest">
              {formatTaka(weekdayPrice)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-mountain">Weekend / public holiday</span>
            <span className="font-serif-display text-lg text-forest">
              {formatTaka(card.weekendPrice)}
            </span>
          </div>
          <p className="mt-3 border-t border-forest/10 pt-3 text-xs text-sage">
            +{formatTaka(extraGuestCharge)} per extra guest above {card.capacity} (age 4+)
          </p>
        </div>

        {card.siblingRooms && card.siblingRooms.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold tracking-[0.15em] text-sage uppercase">
              Also in this category
            </p>
            <div className="flex flex-wrap gap-2">
              {card.siblingRooms.map((room) => (
                <Link
                  key={room.id}
                  href={`/rooms/${room.id}`}
                  className="rounded-full bg-forest/5 px-3 py-1.5 text-xs text-forest transition-colors hover:bg-forest/10"
                >
                  {room.name}
                  {room.banglaName ? ` · ${room.banglaName}` : ""}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Booking information */}
        <div className="mt-8 border-t border-forest/10 pt-7">
          <p className="mb-4 text-xs font-semibold tracking-[0.15em] text-sage uppercase">
            Booking Information
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <BookingInfoRow icon={Clock} label="Check-in" detail={CHECK_IN_TIME} />
            <BookingInfoRow icon={Clock} label="Check-out" detail={CHECK_OUT_TIME} />
            <BookingInfoRow icon={ShieldCheck} label="Cancellation" detail={CANCELLATION_POLICY} />
            <BookingInfoRow icon={Wallet} label="Advance Payment" detail={ADVANCE_PAYMENT_NOTE} />
          </div>
        </div>

        {/* Location */}
        <div className="mt-7 flex flex-col gap-3 rounded-2xl bg-forest/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mountain" />
            <div>
              <p className="text-sm font-medium text-forest">Sampari Resort</p>
              <p className="text-xs text-mountain">{RESORT_ADDRESS}</p>
            </div>
          </div>
          <div className="flex gap-2.5">
            <a
              href={RESORT_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-forest/20 px-4 py-2 text-xs font-medium text-forest transition-colors hover:bg-forest/5 sm:flex-none"
            >
              <Navigation className="h-3.5 w-3.5" />
              Directions
            </a>
            <a
              href={RESORT_FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-forest/20 px-4 py-2 text-xs font-medium text-forest transition-colors hover:bg-forest/5 sm:flex-none"
            >
              <FacebookIcon className="h-3.5 w-3.5" />
              More Photos
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openCheckAvailability({ roomCategory: categoryId, roomId })}
          className="mt-8 block w-full rounded-full bg-forest px-6 py-4 text-center text-sm font-medium tracking-wide text-mist transition-colors hover:bg-mountain"
        >
          Book Now
        </button>
      </Container>
    </main>
  );
}

function BookingInfoRow({
  icon: Icon,
  label,
  detail,
}: {
  icon: React.ElementType;
  label: string;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-mountain" strokeWidth={1.5} />
      <div>
        <p className="text-xs font-medium text-forest">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-mountain">{detail}</p>
      </div>
    </div>
  );
}
