"use client";

import Image from "next/image";
import { Expand } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import FadeUp from "@/components/ui/FadeUp";
import { useLightbox } from "@/components/ui/LightboxProvider";
import { galleryImages, galleryCategoryLabels } from "@/data/gallery";
import { cn } from "@/lib/utils";

const spanClasses: Record<string, string> = {
  wide: "sm:col-span-2",
  tall: "sm:row-span-2",
  large: "sm:col-span-2 sm:row-span-2",
  normal: "",
};

export default function Gallery() {
  const { open } = useLightbox();

  const lightboxItems = galleryImages.map((img) => ({
    src: img.src,
    alt: img.alt,
    categoryLabel: galleryCategoryLabels[img.category],
  }));

  return (
    <section id="gallery" className="bg-cream py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Gallery"
          heading="A Feel for the Place"
          subtitle="Wooden cottages, drifting cloud, and the quiet in between."
        />

        <div className="mt-14 grid grid-cols-2 auto-rows-[140px] gap-4 sm:grid-cols-4 sm:auto-rows-[160px] sm:grid-flow-dense md:gap-5">
          {galleryImages.map((img, i) => (
            <FadeUp
              key={img.id}
              delay={(i % 4) * 70}
              className={cn(
                "group relative aspect-square overflow-hidden rounded-2xl sm:aspect-auto",
                spanClasses[img.span ?? "normal"]
              )}
            >
              <button
                type="button"
                onClick={() => open({ items: lightboxItems, startIndex: i })}
                aria-label={`Open full-screen view: ${img.alt}`}
                className="absolute inset-0 h-full w-full cursor-zoom-in"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-forest/0 opacity-0 transition-all duration-300 group-hover:bg-forest/20 group-hover:opacity-100">
                  <Expand className="h-6 w-6 text-mist drop-shadow" strokeWidth={1.5} />
                </div>
              </button>
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
