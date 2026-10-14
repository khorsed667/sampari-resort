"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarCheck, MessageCircle } from "lucide-react";
import { getQuickInquiryUrl } from "@/lib/whatsapp";
import { useCheckAvailability } from "@/components/ui/CheckAvailabilityProvider";

export default function MobileBookingBar() {
  const [visible, setVisible] = useState(false);
  const { open: openCheckAvailability } = useCheckAvailability();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.75);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 flex gap-2.5 border-t border-forest/10 bg-mist/97 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-8px_rgba(24,60,50,0.15)] backdrop-blur-sm md:hidden"
        >
          <button
            type="button"
            onClick={() => openCheckAvailability()}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-forest/25 px-4 py-3 text-sm font-medium text-forest transition-colors active:bg-forest/5"
          >
            <CalendarCheck className="h-4 w-4" />
            Check Dates
          </button>
          <a
            href={getQuickInquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-forest px-4 py-3 text-sm font-medium text-mist transition-colors active:bg-mountain"
          >
            <MessageCircle className="h-4 w-4" />
            Book via WhatsApp
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
