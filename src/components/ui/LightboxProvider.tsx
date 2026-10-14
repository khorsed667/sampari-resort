"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import Lightbox, { LightboxItem } from "@/components/ui/Lightbox";

interface OpenOptions {
  items: LightboxItem[];
  startIndex?: number;
}

interface LightboxContextValue {
  open: (options: OpenOptions) => void;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) {
    throw new Error("useLightbox must be used within LightboxProvider");
  }
  return ctx;
}

export default function LightboxProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LightboxItem[]>([]);
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(({ items: newItems, startIndex = 0 }: OpenOptions) => {
    setItems(newItems);
    setIndex(startIndex);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <LightboxContext.Provider value={value}>
      {children}
      <Lightbox
        items={items}
        index={index}
        isOpen={isOpen}
        onClose={close}
        onIndexChange={setIndex}
      />
    </LightboxContext.Provider>
  );
}
