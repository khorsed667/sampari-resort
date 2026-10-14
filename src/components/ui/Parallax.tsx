"use client";

import { ReactNode, useEffect, useRef } from "react";

export default function Parallax({
  children,
  strength = 0.12,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const current = useRef(0);
  const target = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    // Eases the tracked offset toward the scroll-derived target each frame
    // instead of snapping to it directly — gives the banner a smooth,
    // slightly trailing drift rather than a rigid 1:1 scroll lock.
    const animate = () => {
      const node = ref.current;
      const distance = target.current - current.current;
      current.current += distance * 0.08;

      if (node) {
        node.style.transform = `translate3d(0, ${current.current.toFixed(2)}px, 0)`;
      }

      if (Math.abs(distance) > 0.05) {
        rafId.current = requestAnimationFrame(animate);
      } else {
        rafId.current = null;
      }
    };

    const onScroll = () => {
      target.current = window.scrollY * strength;
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [strength]);

  return (
    <div ref={ref} className={className ?? "will-change-transform"}>
      {children}
    </div>
  );
}
