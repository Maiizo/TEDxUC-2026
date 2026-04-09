import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import QRCode from 'qrcode';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { registrationId: string } }
) {
  try {
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return Response.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const registration = await prisma.registration.findUnique({
      where: { id: params.registrationId },
      select: { qrCode: true },
    });

    if (!registration || !registration.qrCode) {
      return Response.json(
        { error: 'QR code not found' },
        { status: 404 }
      );
    }

    const pngBuffer = await QRCode.toBuffer(registration.qrCode, {
      type: 'png',
      width: 400,
    });

    return new Response(pngBuffer as any, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('QR code generation error:', error);
    return Response.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
