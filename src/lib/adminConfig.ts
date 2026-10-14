/**
 * Admin dashboard configuration.
 *
 * Hardcoded credentials have been removed. Authentication is now enforced
 * using MongoDB Atlas admin records, salted cryptographic hashing (PBKDF2/SHA-512),
 * and signed HTTP-only session cookies.
 */

export const ADMIN_AUTH_ENABLED = true;
