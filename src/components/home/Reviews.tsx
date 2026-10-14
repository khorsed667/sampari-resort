import { Star } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import FadeUp from "@/components/ui/FadeUp";
import { reviews } from "@/data/reviews";

export default function Reviews() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Guest Reviews"
          heading="What Guests Remember"
          align="center"
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {reviews.map((review, i) => (
            <FadeUp key={review.id} delay={i * 90}>
              <blockquote className="flex h-full flex-col rounded-3xl bg-mist p-8">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-4 w-4"
                      fill={idx < review.rating ? "#765C48" : "none"}
                      stroke="#765C48"
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
                <p className="mt-5 flex-1 font-serif-display text-lg leading-relaxed text-forest md:text-xl">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <footer className="mt-6 flex items-center justify-between border-t border-forest/10 pt-5 text-sm">
                  <span className="font-medium text-forest">
                    {review.guestName}
                    {review.location ? `, ${review.location}` : ""}
                  </span>
                  {review.stayType && (
                    <span className="text-sage">{review.stayType}</span>
                  )}
                </footer>
              </blockquote>
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
