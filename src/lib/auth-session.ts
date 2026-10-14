import { SessionPayload } from "@/types/auth";

export const AUTH_COOKIE_NAME = "sampari_admin_session";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

const SECRET_KEY =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "sampari_resort_secure_secret_key_2026_sajek_cloud_sanctuary";

function base64UrlEncode(str: string): string {
  if (typeof btoa === "function") {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  return Buffer.from(str, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(base64Url: string): string {
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  if (typeof atob === "function") {
    return atob(base64);
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return base64UrlEncode(binary);
}

function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const binary = base64UrlDecode(base64Url);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getCryptoKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Signs a session payload into a compact HMAC-SHA256 token string.
 * Format: `<header.payload>.<signature>`
 */
export async function createSessionToken(
  user: Omit<SessionPayload, "exp">
): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const payload: SessionPayload = { ...user, exp };

  const encoder = new TextEncoder();
  const dataString = base64UrlEncode(JSON.stringify(payload));

  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(dataString)
  );

  const signatureString = bufferToBase64Url(signatureBuffer);
  return `${dataString}.${signatureString}`;
}

/**
 * Verifies a compact session token, validates the HMAC-SHA256 signature
 * and checks expiration timestamp. Returns null if invalid or expired.
 */
export async function verifySessionToken(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [dataString, signatureString] = parts;
  if (!dataString || !signatureString) return null;

  try {
    const key = await getCryptoKey();
    const encoder = new TextEncoder();
    const signatureBytes = base64UrlToUint8Array(signatureString);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      encoder.encode(dataString)
    );

    if (!isValid) return null;

    const payloadJson = base64UrlDecode(dataString);
    const payload = JSON.parse(payloadJson) as SessionPayload;

    const nowSeconds = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < nowSeconds) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}
