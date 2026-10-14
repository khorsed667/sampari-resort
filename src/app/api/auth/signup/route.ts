import { NextRequest, NextResponse } from "next/server";
import { getAdminsCollection } from "@/lib/mongodb";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { AdminUser } from "@/types/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter your full name." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const adminsCollection = await getAdminsCollection();

    // Check if admin already exists
    const existing = await adminsCollection.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An administrator with this email already exists." },
        { status: 409 }
      );
    }

    const totalAdmins = await adminsCollection.countDocuments();
    const role: "superadmin" | "admin" = totalAdmins === 0 ? "superadmin" : "admin";

    const newAdmin: AdminUser = {
      id: `admin_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      email: normalizedEmail,
      name: name.trim(),
      passwordHash: hashPassword(password),
      role,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    await adminsCollection.insertOne(newAdmin);

    // Issue HTTP-only signed session cookie
    await setSessionCookie(newAdmin);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newAdmin.id,
          email: newAdmin.email,
          name: newAdmin.name,
          role: newAdmin.role,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create administrator account." },
      { status: 500 }
    );
  }
}
