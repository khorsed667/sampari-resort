"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container, SectionHeading } from "@/components/ui/Container";
import RoomCard from "@/components/home/RoomCard";
import RoomFilterPills, { FilterOption } from "@/components/home/RoomFilterPills";
import { roomCategoryGroups, rooms, roomToDisplayCard } from "@/data/rooms";

const FILTERS: FilterOption[] = roomCategoryGroups.map((group) => ({
  id: group.category,
  label: group.categoryLabel,
}));

export default function Rooms() {
  const [filter, setFilter] = useState<string>(FILTERS[0].id);

  // Always shows one card per individual room, named for that room —
  // e.g. Rod / Brishti / Megh / Chhaya rather than a combined category card.
  const visibleCards = useMemo(
    () => rooms.filter((room) => room.category === filter).map(roomToDisplayCard),
    [filter]
  );

  return (
    <section id="stay" className="bg-cream py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Rooms & Cottages"
          heading="Stay Your Way"
          subtitle="Wood, warmth and mountain views — spaces made for slow mornings."
        />

        <div className="mt-10 md:mt-12">
          <RoomFilterPills options={FILTERS} active={filter} onChange={setFilter} />
        </div>

        <motion.div
          layout
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {visibleCards.map((card) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <RoomCard card={card} categoryId={filter} roomId={card.id} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {visibleCards.length === 0 && (
          <p className="mt-10 text-center text-sm text-sage">
            No rooms match this filter right now.
          </p>
        )}
      </Container>
    </section>
  );
}
