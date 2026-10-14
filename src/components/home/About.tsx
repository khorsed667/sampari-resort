import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import FadeUp from "@/components/ui/FadeUp";
import Parallax from "@/components/ui/Parallax";
import { resortStats } from "@/data/rooms";

export default function About() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <Container>
        <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-2 md:gap-20">
          <FadeUp className="relative order-2 aspect-[4/5] w-full overflow-hidden rounded-[2rem] md:order-1">
            <Parallax strength={0.08} className="absolute -top-10 -bottom-10 inset-x-0 will-change-transform">
              <Image
                src="/images/about/about-main.svg"
                alt="Wooden cottage at Sampari Resort surrounded by Sajek's hills"
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
            </Parallax>
          </FadeUp>

          <FadeUp delay={100} className="order-1 md:order-2">
            <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-sage uppercase">
              Welcome to Sampari
            </p>
            <h2 className="font-serif-display text-3xl font-medium leading-[1.15] text-forest md:text-[2.75rem]">
              A little closer to the clouds.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-mountain md:text-lg">
              Sampari Resort is a peaceful eco-resort in Sajek where guests can
              slow down, enjoy the mountains, watch clouds drift through the
              hills and spend time surrounded by nature.
            </p>
            <p className="mt-4 text-base leading-relaxed text-mountain md:text-lg">
              The resort is made up of {resortStats.totalCottages} wooden and
              bamboo eco-cottages — {resortStats.totalRooms} rooms in total —
              designed for families, friends and couples who want their stay
              in Sajek to feel unhurried.
            </p>

            <dl className="mt-9 grid grid-cols-3 gap-6 border-t border-forest/10 pt-7">
              <Stat value={`${resortStats.totalCottages}`} label="Eco-cottages" />
              <Stat value={`${resortStats.totalRooms}`} label="Rooms" />
              <Stat value={`${resortStats.maxCapacity}`} label="Max guests" />
            </dl>

            <Link
              href="#stay"
              className="mt-9 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-forest underline decoration-sand decoration-2 underline-offset-8 transition-colors hover:text-mountain"
            >
              Discover Sampari
              <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeUp>
        </div>
      </Container>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-serif-display text-2xl text-forest md:text-3xl">{value}</dt>
      <dd className="mt-1 text-xs tracking-wide text-sage">{label}</dd>
    </div>
  );
}
