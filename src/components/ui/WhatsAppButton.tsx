import { MessageCircle } from "lucide-react";
import { getWhatsAppContactUrl } from "@/lib/whatsapp";

export default function WhatsAppButton() {
  return (
    <a
      href={getWhatsAppContactUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message Sampari Resort on WhatsApp"
      className="fixed bottom-5 right-5 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-forest p-3.5 text-mist shadow-lg shadow-forest/30 transition-transform duration-300 hover:scale-105 active:scale-95 md:bottom-8 md:right-8 md:flex"
    >
      <MessageCircle className="h-6 w-6" strokeWidth={1.75} />
    </a>
  );
}
