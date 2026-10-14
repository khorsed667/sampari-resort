import {
  Clock,
  ShieldCheck,
  Wallet,
  Droplets,
  UtensilsCrossed,
  Zap,
  Bath,
} from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Container";
import FadeUp from "@/components/ui/FadeUp";
import {
  CHECK_IN_TIME,
  CHECK_OUT_TIME,
  CANCELLATION_POLICY,
  ADVANCE_PAYMENT_NOTE,
} from "@/lib/constants";

const practicalInfo = [
  {
    icon: Clock,
    title: "Check-in",
    detail: CHECK_IN_TIME,
  },
  {
    icon: Clock,
    title: "Check-out",
    detail: CHECK_OUT_TIME,
  },
  {
    icon: ShieldCheck,
    title: "Cancellation",
    detail: CANCELLATION_POLICY,
  },
  {
    icon: Wallet,
    title: "Booking Payment",
    detail: ADVANCE_PAYMENT_NOTE,
  },
];

const facilities = [
  {
    icon: Bath,
    title: "In Every Room",
    detail: "1 bottle of water, mini-pack soap, shampoo and toothpaste are included.",
  },
  {
    icon: UtensilsCrossed,
    title: "Kitchen",
    detail:
      "The resort kitchen is currently closed. Several restaurants are approximately 1–2 minutes' walk away.",
  },
  {
    icon: Droplets,
    title: "Water",
    detail: "Water is available throughout the day.",
  },
  {
    icon: Zap,
    title: "Electricity",
    detail:
      "The resort runs on PDB electricity with no full-time generator backup. During load shedding, solar power keeps lights running through the night.",
  },
];

export default function ResortInfo() {
  return (
    <section className="bg-sand/30 py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Good to Know"
          heading="Resort Information"
          subtitle="Practical details, stated plainly — so there are no surprises when you arrive."
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {practicalInfo.map((item, i) => (
            <FadeUp key={item.title} delay={i * 70}>
              <InfoCard {...item} />
            </FadeUp>
          ))}
        </div>

        <div className="mt-20">
          <h3 className="font-serif-display text-2xl text-forest">Facilities & Notes</h3>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {facilities.map((item, i) => (
              <FadeUp key={item.title} delay={i * 70}>
                <InfoCard {...item} />
              </FadeUp>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function InfoCard({
  icon: Icon,
  title,
  detail,
}: {
  icon: React.ElementType;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-mist p-6">
      <Icon className="h-5 w-5 text-mountain" strokeWidth={1.5} />
      <h4 className="mt-4 font-serif-display text-lg text-forest">{title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-mountain">{detail}</p>
    </div>
  );
}
