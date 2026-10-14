"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function BookingToast({
  message,
  onDone,
  duration = 4000,
}: {
  message: string | undefined;
  onDone: () => void;
  duration?: number;
}) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDone, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onDone]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-4 bottom-24 z-[100] mx-auto flex max-w-sm items-center gap-3 rounded-2xl bg-forest px-5 py-4 text-sm text-mist shadow-2xl md:inset-x-auto md:right-8 md:bottom-8"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-sand" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
