import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { rooms, roomToDisplayCard } from "@/data/rooms";
import RoomDetailContent from "@/components/home/RoomDetailContent";

export function generateStaticParams() {
  return rooms.map((room) => ({ roomId: room.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ roomId: string }>;
}): Promise<Metadata> {
  const { roomId } = await params;
  const room = rooms.find((r) => r.id === roomId);

  if (!room) return { title: "Room Not Found | Sampari Resort" };

  const title = `${room.name} — ${room.categoryLabel} | Sampari Resort`;
  const description = room.description;

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const room = rooms.find((r) => r.id === roomId);

  if (!room) notFound();

  const card = roomToDisplayCard(room);

  return <RoomDetailContent card={card} categoryId={room.category} roomId={room.id} />;
}
