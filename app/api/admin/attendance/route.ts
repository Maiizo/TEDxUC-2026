import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

function isMainEvent(name: string, type: string) {
  return /main\s*event/i.test(name) || /main\s*event/i.test(type);
}

type ParsedQrPayload = {
  qrTokens: string[];
  registrationNumbers: string[];
  registrationIds: string[];
};

function uniqueNonEmpty(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function stripControlChars(value: string) {
  return value.replace(/[\u0000-\u001F\u007F]/g, "").trim();
}

function safelyDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function parseQrPayload(rawQrData: string): ParsedQrPayload {
  const normalizedRaw = stripControlChars(rawQrData);
  const decodedRaw = stripControlChars(safelyDecodeURIComponent(normalizedRaw));

  const qrTokens = uniqueNonEmpty([normalizedRaw, decodedRaw]);
  const registrationNumbers: string[] = [];
  const registrationIds: string[] = [];

  const parseJsonCandidate = (value: string) => {
    if (!value.startsWith("{") || !value.endsWith("}")) return;

    try {
      const parsed = JSON.parse(value) as {
        id?: unknown;
        regNum?: unknown;
        registrationNumber?: unknown;
        qrData?: unknown;
        token?: unknown;
      };

      if (typeof parsed.id === "string") {
        registrationIds.push(stripControlChars(parsed.id));
      }
      if (typeof parsed.regNum === "string") {
        registrationNumbers.push(stripControlChars(parsed.regNum));
      }
      if (typeof parsed.registrationNumber === "string") {
        registrationNumbers.push(stripControlChars(parsed.registrationNumber));
      }
      if (typeof parsed.qrData === "string") {
        qrTokens.push(stripControlChars(parsed.qrData));
      }
      if (typeof parsed.token === "string") {
        qrTokens.push(stripControlChars(parsed.token));
      }
    } catch {
      // Ignore invalid JSON payloads from scanner input
    }
  };

  parseJsonCandidate(normalizedRaw);
  parseJsonCandidate(decodedRaw);

  const parseUrlCandidate = (value: string) => {
    if (!/^https?:\/\//i.test(value)) return;

    try {
      const url = new URL(value);
      const tokenKeys = ["qrData", "token", "code", "qr", "data"];
      const regNumberKeys = ["registrationNumber", "regNum", "reg"];
      const regIdKeys = ["registrationId", "id"];

      for (const key of tokenKeys) {
        const v = url.searchParams.get(key);
        if (v) qrTokens.push(stripControlChars(v));
      }
      for (const key of regNumberKeys) {
        const v = url.searchParams.get(key);
        if (v) registrationNumbers.push(stripControlChars(v));
      }
      for (const key of regIdKeys) {
        const v = url.searchParams.get(key);
        if (v) registrationIds.push(stripControlChars(v));
      }
    } catch {
      // Ignore invalid URL payloads
    }
  };

  parseUrlCandidate(normalizedRaw);
  parseUrlCandidate(decodedRaw);

  const tedxTokenMatch = decodedRaw.match(/^TEDx26-(TDX-[A-Z0-9]{8}-[A-Z0-9]{4})-\d{10,}$/i);
  if (tedxTokenMatch?.[1]) {
    registrationNumbers.push(tedxTokenMatch[1].toUpperCase());
  }

  if (/^TDX-\d{8}-[A-Z0-9]{8}-[A-Z0-9]{4}$/i.test(decodedRaw)) {
    registrationNumbers.push(decodedRaw.toUpperCase());
  }

  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(decodedRaw)) {
    registrationIds.push(decodedRaw);
  }

  return {
    qrTokens: uniqueNonEmpty(qrTokens),
    registrationNumbers: uniqueNonEmpty(registrationNumbers),
    registrationIds: uniqueNonEmpty(registrationIds),
  };
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
    const qrData = typeof body?.qrData === "string" ? stripControlChars(body.qrData) : "";

    if (!qrData) {
      return response(400, "qrData is required", undefined, "qrData is required");
    }

    const parsed = parseQrPayload(qrData);

    const whereClauses: Array<Record<string, unknown>> = [];
    for (const token of parsed.qrTokens) {
      whereClauses.push({ qrCode: token });
    }
    for (const registrationNumber of parsed.registrationNumbers) {
      whereClauses.push({
        registrationNumber: {
          equals: registrationNumber,
          mode: "insensitive",
        },
      });
    }
    for (const registrationId of parsed.registrationIds) {
      whereClauses.push({ id: registrationId });
    }

    if (whereClauses.length === 0) {
      return response(400, "Invalid QR payload", undefined, "Unable to parse scanner payload");
    }

    const registration = await prisma.registration.findFirst({
      where: { OR: whereClauses },
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