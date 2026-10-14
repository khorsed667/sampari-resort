import { NextResponse } from "next/server";
import { getCurrentAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getCurrentAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, user: null, message: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: session.id,
        email: session.email,
        name: session.name,
        role: session.role,
      },
    });
  } catch (error: unknown) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch session." },
      { status: 500 }
    );
  }
}
