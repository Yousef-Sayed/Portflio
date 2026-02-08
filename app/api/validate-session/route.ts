import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionToken } = body;

    if (!sessionToken) {
      return NextResponse.json({ valid: false, user: null });
    }

    // Session validation is done client-side via Convex actions
    // This API endpoint is primarily for edge cases
    return NextResponse.json({ valid: true, sessionToken });
  } catch (error) {
    console.error("Session validation error:", error);
    return NextResponse.json({ valid: false, user: null });
  }
}
