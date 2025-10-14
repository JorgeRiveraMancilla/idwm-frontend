import { NextResponse } from "next/server";

import { auth } from "@/auth.config";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ accessToken: session.accessToken });
  } catch (error) {
    console.error("Error obteniendo token:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
