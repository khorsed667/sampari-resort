export interface AdminUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: "admin" | "superadmin";
  createdAt: string;
  lastLoginAt?: string;
}

export type AdminUserPublic = Omit<AdminUser, "passwordHash">;

export interface SessionPayload {
  id: string;
  email: string;
  name: string;
  role: "admin" | "superadmin";
  exp: number; // Unix timestamp in seconds
}

export interface PasswordResetRecord {
  token: string;
  email: string;
  expiresAt: string; // ISO date string
  used: boolean;
  createdAt: string;
}
