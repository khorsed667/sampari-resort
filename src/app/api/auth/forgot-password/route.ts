import { NextRequest, NextResponse } from "next/server";
import { getAdminsCollection, getPasswordResetsCollection } from "@/lib/mongodb";
import { generateResetToken } from "@/lib/auth";
import { PasswordResetRecord } from "@/types/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Please enter your administrator email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const adminsCollection = await getAdminsCollection();
    const admin = await adminsCollection.findOne({ email: normalizedEmail });

    if (!admin) {
      // Generic message to avoid email harvesting
      return NextResponse.json({
        success: true,
        message:
          "If an administrator account is associated with this email, a reset link has been prepared.",
      });
    }

    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour validity

    const resetRecord: PasswordResetRecord = {
      token,
      email: normalizedEmail,
      expiresAt,
      used: false,
      createdAt: new Date().toISOString(),
    };

    const resetsCollection = await getPasswordResetsCollection();
    await resetsCollection.insertOne(resetRecord);

    const resetUrl = `/admin/reset-password?token=${token}`;

    return NextResponse.json({
      success: true,
      message: "Password reset link generated successfully.",
      resetUrl,
      token,
    });
  } catch (error: unknown) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process password reset request." },
      { status: 500 }
    );
  }
}
