import { MongoClient, Db, Collection } from "mongodb";
import { BookingRecord } from "@/types/booking";
import { Room } from "@/types/room";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "sampari";

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable so the MongoClient is not repeatedly
  // created across hot module reloads.
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, instantiate client per normal connection pool.
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

let indexesCreated = false;
let roomIndexesCreated = false;

export async function getBookingsCollection(): Promise<Collection<BookingRecord>> {
  const db = await getDatabase();
  const collection = db.collection<BookingRecord>("bookings");

  if (!indexesCreated) {
    indexesCreated = true;
    collection
      .createIndexes([
        { key: { id: 1 }, unique: true },
        { key: { status: 1 } },
        { key: { roomId: 1, checkIn: 1, checkOut: 1 } },
        { key: { createdAt: -1 } },
      ])
      .catch((err) => {
        console.warn("MongoDB Bookings index warning:", err.message);
      });
  }

  return collection;
}

export async function getRoomsCollection(): Promise<Collection<Room>> {
  const db = await getDatabase();
  const collection = db.collection<Room>("rooms");

  if (!roomIndexesCreated) {
    roomIndexesCreated = true;
    collection
      .createIndexes([
        { key: { id: 1 }, unique: true },
        { key: { category: 1 } },
      ])
      .catch((err) => {
        console.warn("MongoDB Rooms index warning:", err.message);
      });
  }

  return collection;
}

let adminIndexesCreated = false;

export async function getAdminsCollection(): Promise<Collection<import("@/types/auth").AdminUser>> {
  const db = await getDatabase();
  const collection = db.collection<import("@/types/auth").AdminUser>("admins");

  if (!adminIndexesCreated) {
    adminIndexesCreated = true;
    collection
      .createIndexes([
        { key: { email: 1 }, unique: true },
        { key: { id: 1 }, unique: true },
      ])
      .catch((err) => {
        console.warn("MongoDB Admins index warning:", err.message);
      });
  }

  return collection;
}

let resetIndexesCreated = false;

export async function getPasswordResetsCollection(): Promise<Collection<import("@/types/auth").PasswordResetRecord>> {
  const db = await getDatabase();
  const collection = db.collection<import("@/types/auth").PasswordResetRecord>("password_resets");

  if (!resetIndexesCreated) {
    resetIndexesCreated = true;
    collection
      .createIndexes([
        { key: { token: 1 }, unique: true },
        { key: { email: 1 } },
        { key: { expiresAt: 1 } },
      ])
      .catch((err) => {
        console.warn("MongoDB Password Resets index warning:", err.message);
      });
  }

  return collection;
}

export default clientPromise;
