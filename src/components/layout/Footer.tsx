import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getWhatsAppContactUrl } from "@/lib/whatsapp";
import { RESORT_FACEBOOK_URL } from "@/lib/constants";
import FacebookIcon from "@/components/ui/FacebookIcon";

const NAV_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "Stay", href: "/#stay" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Location", href: "/#location" },
];

export default function Footer() {
  return (
    <footer className="bg-forest pb-10 pt-20 text-cream/85">
      <Container>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <p className="font-serif-display text-xl tracking-[0.1em] text-mist">
              SAMPARI RESORT
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
              A peaceful escape above the clouds of Sajek.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-sand uppercase">
              Navigate
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/75 transition-colors hover:text-mist"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={getWhatsAppContactUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cream/75 transition-colors hover:text-mist"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-sand uppercase">
              Reach Us
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href="tel:+8801849889055"
                className="flex items-center gap-2.5 text-sm text-cream/75 transition-colors hover:text-mist"
              >
                <Phone className="h-4 w-4" />
                01849-889055
              </a>
              <a
                href={RESORT_FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-cream/75 transition-colors hover:text-mist"
              >
                <FacebookIcon className="h-4 w-4" />
                Sampari Resort
              </a>
              <a
                href={getWhatsAppContactUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex w-fit items-center gap-2 rounded-full border border-cream/25 px-4 py-2 text-sm text-mist transition-colors hover:bg-cream/10"
              >
                <MessageCircle className="h-4 w-4" />
                Message on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-cream/10 pt-7 text-xs text-cream/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Sampari Resort. All rights reserved.</p>
          <p>Sajek Valley, Rangamati, Bangladesh</p>
        </div>
      </Container>
    </footer>
  );
}
