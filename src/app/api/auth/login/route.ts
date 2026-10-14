import { NextRequest, NextResponse } from "next/server";
import { getAdminsCollection } from "@/lib/mongodb";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please enter both email and password." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const adminsCollection = await getAdminsCollection();

    const admin = await adminsCollection.findOne({ email: normalizedEmail });
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isValidPassword = verifyPassword(String(password), admin.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Update last login timestamp
    await adminsCollection.updateOne(
      { id: admin.id },
      { $set: { lastLoginAt: new Date().toISOString() } }
    );

    // Issue HTTP-only signed session cookie
    await setSessionCookie(admin);

    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error: unknown) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to authenticate." },
      { status: 500 }
    );
  }
}
