import crypto from "node:crypto";
import { cookies } from "next/headers";
import {
  AUTH_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  verifySessionToken,
} from "./auth-session";
import { AdminUser, AdminUserPublic, SessionPayload } from "@/types/auth";

export * from "./auth-session";

/**
 * Hashes a plain password using PBKDF2 with SHA-512 and a random 16-byte salt.
 * Result format: `<salt>:<derivedKey>`
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return `${salt}:${derivedKey}`;
}

/**
 * Validates a plain password against a stored `<salt>:<derivedKey>` hash
 * using constant-time comparison to prevent timing attacks.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;

    const derivedKey = crypto
      .pbkdf2Sync(password, salt, 100000, 64, "sha512")
      .toString("hex");

    return crypto.timingSafeEqual(
      Buffer.from(key, "hex"),
      Buffer.from(derivedKey, "hex")
    );
  } catch {
    return false;
  }
}

/**
 * Sets the HTTP-only admin session cookie on the current Next.js response.
 */
export async function setSessionCookie(user: AdminUserPublic): Promise<string> {
  const token = await createSessionToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return token;
}

/**
 * Clears the HTTP-only admin session cookie.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Retrieves and validates the current admin session from incoming cookies.
 */
export async function getCurrentAdminSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

/**
 * Generates a cryptographically secure random reset token.
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
