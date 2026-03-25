import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    let events;
    if (type) {
      events = await prisma.event.findMany({
        where: { type },
        orderBy: { date: "asc" },
      });
    } else {
      events = await prisma.event.findMany({
        orderBy: { date: "asc" },
      });
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
