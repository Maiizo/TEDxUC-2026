import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  // Verify admin token
  const token = request.cookies.get("admin-token")?.value;
  if (!token) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized" },
      { status: 401 }
    );
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json(
      { status: "error", message: "Invalid token" },
      { status: 401 }
    );
  }

  try {
    // Fetch all events with registration counts
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    // Fetch recent registrations
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        event: {
          select: { name: true, type: true },
        },
        payments: {
          select: { status: true, paymentMethod: true, amount: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    // Summary stats
    const totalRegistrations = await prisma.registration.count();
    const paidRegistrations = await prisma.registration.count({
      where: { status: "paid" },
    });
    const pendingRegistrations = await prisma.registration.count({
      where: { status: "pending" },
    });
    const totalRevenue = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "success" },
    });

    return NextResponse.json({
      status: "success",
      data: {
        stats: {
          totalRegistrations,
          paidRegistrations,
          pendingRegistrations,
          totalRevenue: totalRevenue._sum.amount || 0,
        },
        events,
        registrations,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
