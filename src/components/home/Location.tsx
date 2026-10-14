import { MapPin, Navigation, UtensilsCrossed } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import FadeUp from "@/components/ui/FadeUp";
import { RESORT_DIRECTIONS_URL, RESORT_MAP_EMBED_URL } from "@/lib/constants";

export default function Location() {
  return (
    <section id="location" className="bg-cream py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Location"
          heading="Find Your Way to Sajek"
          subtitle="Sampari Resort, Sajek Valley, Rangamati, Bangladesh."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-5">
          <FadeUp className="overflow-hidden rounded-3xl bg-sand/20 md:col-span-3">
            <div className="aspect-[4/3] w-full md:aspect-auto md:h-full md:min-h-[400px]">
              <iframe
                title="Map showing Sampari Resort in Sajek Valley"
                src={RESORT_MAP_EMBED_URL}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </FadeUp>

          <FadeUp delay={100} className="flex flex-col gap-4 md:col-span-2">
            <div className="rounded-3xl bg-mist p-7">
              <MapPin className="h-5 w-5 text-mountain" strokeWidth={1.5} />
              <h3 className="mt-4 font-serif-display text-lg text-forest">
                Sampari Resort
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-mountain">
                Sajek Valley, Rangamati, Bangladesh
              </p>
              <a
                href={RESORT_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-mist transition-colors hover:bg-mountain"
              >
                <Navigation className="h-4 w-4" />
                Get Directions
              </a>
            </div>

            <div className="rounded-3xl bg-mist p-7">
              <UtensilsCrossed className="h-5 w-5 text-mountain" strokeWidth={1.5} />
              <h3 className="mt-4 font-serif-display text-lg text-forest">
                Nearby Restaurants
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-mountain">
                The resort kitchen is currently closed, but several
                restaurants sit just 1–2 minutes&apos; walk from Sampari — you
                won&apos;t go far for a meal.
              </p>
            </div>
          </FadeUp>
        </div>
      </Container>
    </section>
  );
}
