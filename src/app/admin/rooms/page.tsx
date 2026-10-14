"use client";

import { useEffect, useState, useTransition } from "react";
import {
  BedDouble,
  Edit2,
  Users,
  Check,
  X,
  Plus,
  RefreshCw,
  Sparkles,
  Save,
  Trash2,
} from "lucide-react";
import { Room, RoomCategory } from "@/types/room";
import { formatTaka } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const CATEGORY_OPTIONS: { value: RoomCategory; label: string }[] = [
  { value: "couple-cottage", label: "Couple Cottage" },
  { value: "couple-room", label: "Couple Room" },
  { value: "twin-room", label: "2-Bed Room" },
  { value: "family-room", label: "3-Bed Room" },
];

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isNewRoomModal, setIsNewRoomModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/rooms", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.rooms)) {
        setRooms(data.rooms);
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleSaveRoom = async (formData: Partial<Room>) => {
    if (!editingRoom) return;
    try {
      const res = await fetch(`/api/rooms/${editingRoom.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setRooms((prev) =>
          prev.map((r) => (r.id === editingRoom.id ? { ...r, ...data.room } : r))
        );
        setEditingRoom(null);
        showToast(`Room "${data.room.name}" updated successfully.`);
      } else {
        alert(data.error || "Failed to update room");
      }
    } catch (err) {
      console.error("Error updating room:", err);
      alert("Error saving room changes.");
    }
  };

  const handleCreateRoom = async (newRoom: Room) => {
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoom),
      });
      const data = await res.json();
      if (data.success) {
        setRooms((prev) => [...prev, data.room]);
        setIsNewRoomModal(false);
        showToast(`Room "${data.room.name}" created successfully.`);
      } else {
        alert(data.error || "Failed to create room");
      }
    } catch (err) {
      console.error("Error creating room:", err);
      alert("Error adding room.");
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm(`Are you sure you want to delete this room from the database?`)) return;
    try {
      const res = await fetch(`/api/rooms/${roomId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setRooms((prev) => prev.filter((r) => r.id !== roomId));
        setEditingRoom(null);
        showToast("Room deleted successfully.");
      } else {
        alert(data.error || "Failed to delete room");
      }
    } catch (err) {
      console.error("Error deleting room:", err);
      alert("Error deleting room.");
    }
  };

  const filteredRooms =
    activeCategory === "all"
      ? rooms
      : rooms.filter((r) => r.category === activeCategory);

  return (
    <div>
      {/* Toast notification */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-forest px-4 py-3 text-sm text-mist shadow-xl animate-fade-up">
          <Check className="h-4 w-4 text-sand" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-display text-2xl text-forest md:text-3xl">Room Management</h1>
            <span className="rounded-full bg-forest/10 px-2.5 py-0.5 text-xs font-semibold text-forest">
              {rooms.length} Rooms
            </span>
          </div>
          <p className="mt-1.5 text-sm text-mountain">
            Manage room pricing, amenities, bed capacities, and descriptions in MongoDB Atlas.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchRooms}
            disabled={loading}
            aria-label="Refresh rooms"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-forest/20 text-forest transition-colors hover:bg-forest/5"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
          <button
            type="button"
            onClick={() => setIsNewRoomModal(true)}
            className="flex items-center gap-2 rounded-full bg-forest px-4 py-2.5 text-sm font-medium text-mist transition-colors hover:bg-mountain"
          >
            <Plus className="h-4 w-4" />
            Add Room
          </button>
        </div>
      </header>

      {/* Category Filter Tabs */}
      <div className="mt-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={cn(
            "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
            activeCategory === "all"
              ? "border-forest bg-forest text-mist"
              : "border-forest/15 text-mountain hover:border-forest/35"
          )}
        >
          All Rooms ({rooms.length})
        </button>
        {CATEGORY_OPTIONS.map((cat) => {
          const count = rooms.filter((r) => r.category === cat.value).length;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
                activeCategory === cat.value
                  ? "border-forest bg-forest text-mist"
                  : "border-forest/15 text-mountain hover:border-forest/35"
              )}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-3xl bg-mist" />
          ))}
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-mist p-10 text-center">
          <p className="text-sm text-mountain">No rooms found in this category.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredRooms.map((room) => {
            const weekdayPrice = room.weekendPrice - room.weekdayDiscount;
            return (
              <div
                key={room.id}
                className="group relative flex flex-col justify-between rounded-3xl bg-mist p-6 shadow-sm shadow-forest/5 transition-all hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif-display text-xl text-forest">{room.name}</h3>
                        {room.banglaName && (
                          <span className="text-xs font-medium text-sage">
                            ({room.banglaName})
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs font-semibold tracking-wide text-mountain uppercase">
                        {room.categoryLabel}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEditingRoom(room)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-forest/5 text-forest transition-colors hover:bg-forest hover:text-mist"
                      title="Edit room details and pricing"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-mountain">
                    {room.description || "No description provided."}
                  </p>

                  <div className="mt-4 flex items-center gap-4 text-xs text-mountain">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-sage" /> {room.capacity} guests
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BedDouble className="h-3.5 w-3.5 text-sage" /> {room.beds} {room.beds === 1 ? "bed" : "beds"}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {room.features.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full bg-forest/[0.04] px-2.5 py-0.5 text-[10px] text-mountain"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-forest/10 pt-4">
                  <div>
                    <span className="text-[11px] text-sage">Weekday</span>
                    <p className="font-serif-display text-base text-forest">
                      {formatTaka(weekdayPrice)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-sage">Weekend</span>
                    <p className="font-serif-display text-base text-forest">
                      {formatTaka(room.weekendPrice)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Room Modal */}
      {editingRoom && (
        <EditRoomModal
          room={editingRoom}
          onClose={() => setEditingRoom(null)}
          onSave={handleSaveRoom}
          onDelete={() => handleDeleteRoom(editingRoom.id)}
        />
      )}

      {/* Add New Room Modal */}
      {isNewRoomModal && (
        <NewRoomModal
          onClose={() => setIsNewRoomModal(false)}
          onCreate={handleCreateRoom}
        />
      )}
    </div>
  );
}

function EditRoomModal({
  room,
  onClose,
  onSave,
  onDelete,
}: {
  room: Room;
  onClose: () => void;
  onSave: (data: Partial<Room>) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const [weekendPrice, setWeekendPrice] = useState(room.weekendPrice);
  const [weekdayDiscount, setWeekdayDiscount] = useState(room.weekdayDiscount);
  const [capacity, setCapacity] = useState(room.capacity);
  const [beds, setBeds] = useState(room.beds);
  const [banglaName, setBanglaName] = useState(room.banglaName || "");
  const [description, setDescription] = useState(room.description || "");
  const [featuresStr, setFeaturesStr] = useState(room.features.join(", "));
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave({
      weekendPrice: Number(weekendPrice),
      weekdayDiscount: Number(weekdayDiscount),
      capacity: Number(capacity),
      beds: Number(beds),
      banglaName: banglaName.trim() || undefined,
      description: description.trim(),
      features: featuresStr
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    });
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    await onDelete();
    setIsDeleting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-mist p-6 shadow-2xl md:p-8">
        <div className="flex items-center justify-between border-b border-forest/10 pb-4">
          <div>
            <h3 className="font-serif-display text-xl text-forest">Edit {room.name}</h3>
            <p className="text-xs text-sage">{room.categoryLabel} ({room.id})</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-mountain hover:bg-forest/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-sage uppercase">Weekend Price (৳)</span>
              <input
                type="number"
                min="500"
                step="100"
                value={weekendPrice}
                onChange={(e) => setWeekendPrice(Number(e.target.value))}
                className="rounded-xl border border-forest/15 bg-cream px-3 py-2 text-sm text-forest outline-none focus:border-forest/40"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-sage uppercase">Weekday Discount (৳)</span>
              <input
                type="number"
                min="0"
                step="100"
                value={weekdayDiscount}
                onChange={(e) => setWeekdayDiscount(Number(e.target.value))}
                className="rounded-xl border border-forest/15 bg-cream px-3 py-2 text-sm text-forest outline-none focus:border-forest/40"
              />
            </label>
          </div>

          <div className="rounded-xl bg-forest/[0.03] p-3 text-xs text-mountain">
            Effective Weekday Price: <strong>{formatTaka(weekendPrice - weekdayDiscount)}</strong> / night
          </div>

          <div className="grid grid-cols-3 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-sage uppercase">Capacity (Guests)</span>
              <input
                type="number"
                min="1"
                max="12"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="rounded-xl border border-forest/15 bg-cream px-3 py-2 text-sm text-forest outline-none focus:border-forest/40"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-sage uppercase">Bed Count</span>
              <input
                type="number"
                min="1"
                max="6"
                value={beds}
                onChange={(e) => setBeds(Number(e.target.value))}
                className="rounded-xl border border-forest/15 bg-cream px-3 py-2 text-sm text-forest outline-none focus:border-forest/40"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-sage uppercase">Bangla Name</span>
              <input
                type="text"
                value={banglaName}
                onChange={(e) => setBanglaName(e.target.value)}
                placeholder="রোদ"
                className="rounded-xl border border-forest/15 bg-cream px-3 py-2 text-sm text-forest outline-none focus:border-forest/40"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-sage uppercase">Description</span>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl border border-forest/15 bg-cream p-3 text-sm text-forest outline-none focus:border-forest/40"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-sage uppercase">Features (Comma Separated)</span>
            <input
              type="text"
              value={featuresStr}
              onChange={(e) => setFeaturesStr(e.target.value)}
              className="rounded-xl border border-forest/15 bg-cream px-3 py-2 text-sm text-forest outline-none focus:border-forest/40"
            />
          </label>

          <div className="mt-2 flex items-center justify-between border-t border-forest/10 pt-3">
            {onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || isSaving}
                className="flex items-center gap-1.5 rounded-full border border-brown/30 px-4 py-2 text-xs font-semibold text-brown transition-colors hover:bg-brown/10 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {isDeleting ? "Deleting..." : "Delete Room"}
              </button>
            ) : <div />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving || isDeleting}
                className="rounded-full border border-forest/20 px-5 py-2.5 text-sm font-medium text-forest hover:bg-forest/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || isDeleting}
                className="flex items-center gap-1.5 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-mist hover:bg-mountain disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function NewRoomModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (room: Room) => Promise<void>;
}) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [banglaName, setBanglaName] = useState("");
  const [category, setCategory] = useState<RoomCategory>("couple-cottage");
  const [weekendPrice, setWeekendPrice] = useState(3500);
  const [weekdayDiscount, setWeekdayDiscount] = useState(500);
  const [capacity, setCapacity] = useState(2);
  const [beds, setBeds] = useState(1);
  const [description, setDescription] = useState("");
  const [featuresStr, setFeaturesStr] = useState("Private balcony, Mountain view, Attached washroom");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim() || !name.trim()) return;

    setIsSubmitting(true);
    const catLabel =
      CATEGORY_OPTIONS.find((c) => c.value === category)?.label || "Room";

    await onCreate({
      id: id.trim().toLowerCase().replace(/\s+/g, "-"),
      name: name.trim(),
      shortName: name.trim(),
      banglaName: banglaName.trim() || undefined,
      category,
      categoryLabel: catLabel,
      capacity: Number(capacity),
      beds: Number(beds),
      weekendPrice: Number(weekendPrice),
      weekdayDiscount: Number(weekdayDiscount),
      image: "/images/rooms/rod.svg",
      description: description.trim(),
      features: featuresStr
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-mist p-6 shadow-2xl md:p-8">
        <div className="flex items-center justify-between border-b border-forest/10 pb-4">
          <h3 className="font-serif-display text-xl text-forest">Add New Room</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-mountain hover:bg-forest/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-sage uppercase">Room ID (e.g. rod-2)</span>
              <input
                type="text"
                required
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="rod-2"
                className="rounded-xl border border-forest/15 bg-cream px-3 py-2 text-sm text-forest outline-none focus:border-forest/40"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-sage uppercase">Room Name</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rod Cottage 2"
                className="rounded-xl border border-forest/15 bg-cream px-3 py-2 text-sm text-forest outline-none focus:border-forest/40"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-sage uppercase">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RoomCategory)}
                className="rounded-xl border border-forest/15 bg-cream px-3 py-2 text-sm text-forest outline-none focus:border-forest/40"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-sage uppercase">Bangla Name</span>
              <input
                type="text"
                value={banglaName}
                onChange={(e) => setBanglaName(e.target.value)}
                placeholder="রোদ-২"
                className="rounded-xl border border-forest/15 bg-cream px-3 py-2 text-sm text-forest outline-none focus:border-forest/40"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-sage uppercase">Weekend Price (৳)</span>
              <input
                type="number"
                min="500"
                value={weekendPrice}
                onChange={(e) => setWeekendPrice(Number(e.target.value))}
                className="rounded-xl border border-forest/15 bg-cream px-3 py-2 text-sm text-forest outline-none focus:border-forest/40"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-sage uppercase">Weekday Discount (৳)</span>
              <input
                type="number"
                min="0"
                value={weekdayDiscount}
                onChange={(e) => setWeekdayDiscount(Number(e.target.value))}
                className="rounded-xl border border-forest/15 bg-cream px-3 py-2 text-sm text-forest outline-none focus:border-forest/40"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-sage uppercase">Capacity (Guests)</span>
              <input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="rounded-xl border border-forest/15 bg-cream px-3 py-2 text-sm text-forest outline-none focus:border-forest/40"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-sage uppercase">Beds</span>
              <input
                type="number"
                min="1"
                value={beds}
                onChange={(e) => setBeds(Number(e.target.value))}
                className="rounded-xl border border-forest/15 bg-cream px-3 py-2 text-sm text-forest outline-none focus:border-forest/40"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-sage uppercase">Description</span>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the room setting and views..."
              className="rounded-xl border border-forest/15 bg-cream p-3 text-sm text-forest outline-none focus:border-forest/40"
            />
          </label>

          <div className="mt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full border border-forest/20 px-5 py-2.5 text-sm font-medium text-forest hover:bg-forest/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-mist hover:bg-mountain disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              {isSubmitting ? "Adding..." : "Create Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
