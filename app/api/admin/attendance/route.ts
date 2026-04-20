import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

function isMainEvent(name: string, type: string) {
  return /main\s*event/i.test(name) || /main\s*event/i.test(type);
}

function response(
  status: number,
  message: string,
  data?: Record<string, unknown>,
  error?: string
) {
  return NextResponse.json(
    {
      success: status < 400,
      message,
      ...(data ? { data } : {}),
      ...(error ? { error } : {}),
    },
    { status }
  );
}

async function authorize(request: NextRequest) {
  const token = request.cookies.get("admin-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(request: NextRequest) {
  try {
    const payload = await authorize(request);
    if (!payload) {
      return response(401, "Unauthorized", undefined, "Unauthorized");
    }

    const recentAttendees = await prisma.registration.findMany({
      where: {
        attendanceStatus: "attended",
        event: {
          OR: [
            { name: { contains: "main event", mode: "insensitive" } },
            { type: { contains: "main event", mode: "insensitive" } },
          ],
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 30,
      select: {
        id: true,
        fullName: true,
        email: true,
        registrationNumber: true,
        updatedAt: true,
      },
    });

    return response(200, "Recent attendees fetched", { attendees: recentAttendees });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return response(500, "Failed to fetch attendees", undefined, errorMessage);
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await authorize(request);
    if (!payload) {
      return response(401, "Unauthorized", undefined, "Unauthorized");
    }

    const body = await request.json().catch(() => null);
    const qrData = typeof body?.qrData === "string" ? body.qrData.trim() : "";

    if (!qrData) {
      return response(400, "qrData is required", undefined, "qrData is required");
    }

    const registration = await prisma.registration.findFirst({
      where: { qrCode: qrData },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            type: true,
            date: true,
          },
        },
      },
    });

    if (!registration) {
      return response(404, "QR code is not valid", undefined, "Registration not found");
    }

    if (!isMainEvent(registration.event.name, registration.event.type)) {
      return response(
        422,
        "This QR is not for Main Event attendance",
        {
          registration: {
            id: registration.id,
            fullName: registration.fullName,
            registrationNumber: registration.registrationNumber,
            eventName: registration.event.name,
          },
        },
        "Non-main-event QR"
      );
    }

    if (registration.status !== "paid") {
      return response(
        409,
        "Participant has not completed payment approval",
        {
          registration: {
            id: registration.id,
            fullName: registration.fullName,
            registrationNumber: registration.registrationNumber,
            status: registration.status,
            attendanceStatus: registration.attendanceStatus,
          },
        },
        "Registration is not paid"
      );
    }

    if (registration.attendanceStatus === "attended") {
      return response(200, `${registration.fullName} was already checked in`, {
        registration: {
          id: registration.id,
          fullName: registration.fullName,
          email: registration.email,
          registrationNumber: registration.registrationNumber,
          status: registration.status,
          attendanceStatus: registration.attendanceStatus,
          updatedAt: registration.updatedAt,
        },
      });
    }

    const updated = await prisma.registration.update({
      where: { id: registration.id },
      data: { attendanceStatus: "attended" },
      select: {
        id: true,
        fullName: true,
        email: true,
        registrationNumber: true,
        status: true,
        attendanceStatus: true,
        updatedAt: true,
      },
    });

    return response(200, `${updated.fullName} checked in successfully`, {
      registration: updated,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return response(500, "Failed to verify QR code", undefined, errorMessage);
  }
}