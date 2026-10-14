import { NextRequest, NextResponse } from "next/server";
import { getAdminsCollection, getPasswordResetsCollection } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, error: "Password reset token is missing." },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const resetsCollection = await getPasswordResetsCollection();
    const resetRecord = await resetsCollection.findOne({ token, used: false });

    if (!resetRecord) {
      return NextResponse.json(
        { success: false, error: "Invalid or already used password reset link." },
        { status: 400 }
      );
    }

    if (new Date(resetRecord.expiresAt).getTime() < Date.now()) {
      return NextResponse.json(
        { success: false, error: "This password reset link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const adminsCollection = await getAdminsCollection();
    const admin = await adminsCollection.findOne({ email: resetRecord.email });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Associated administrator account was not found." },
        { status: 404 }
      );
    }

    // Hash new password and update in MongoDB
    const newHash = hashPassword(newPassword);
    await adminsCollection.updateOne(
      { email: resetRecord.email },
      { $set: { passwordHash: newHash } }
    );

    // Mark token as used
    await resetsCollection.updateOne(
      { token },
      { $set: { used: true } }
    );

    return NextResponse.json({
      success: true,
      message: "Password successfully updated. You can now sign in with your new credentials.",
    });
  } catch (error: unknown) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset password." },
      { status: 500 }
    );
  }
}
