import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, createToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { status: "error", message: "Email and password are required" },
        { status: 400 }
      );
    }

    const valid = await verifyCredentials(email, password);
    if (!valid) {
      return NextResponse.json(
        { status: "error", message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await createToken(email);

    const response = NextResponse.json(
      { status: "success", message: "Login successful" },
      { status: 200 }
    );

    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
