import { NextRequest, NextResponse } from 'next/server';
import { get } from '@vercel/blob';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function toBlobLookupRef(value: string): string {
  try {
    const parsed = new URL(value);
    const pathname = parsed.pathname.startsWith('/')
      ? parsed.pathname.slice(1)
      : parsed.pathname;
    return pathname || value;
  } catch {
    return value;
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ paymentId: string }> }
) {
  const token = request.cookies.get('admin-token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { paymentId } = await context.params;
  if (!paymentId) {
    return NextResponse.json({ error: 'Missing payment id' }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    select: { proofUrl: true },
  });

  if (!payment?.proofUrl) {
    return NextResponse.json({ error: 'Proof not found' }, { status: 404 });
  }

  try {
    const blobResult = await get(toBlobLookupRef(payment.proofUrl), {
      access: 'private',
    });

    if (!blobResult) {
      return NextResponse.json({ error: 'Proof not found' }, { status: 404 });
    }

    const headers = new Headers(Array.from(blobResult.headers.entries()));
    if (blobResult.blob.contentType) {
      headers.set('Content-Type', blobResult.blob.contentType);
    }

    return new NextResponse(blobResult.stream, {
      status: blobResult.statusCode,
      headers,
    });
  } catch (error) {
    console.error('Admin proof view error:', error);
    return NextResponse.json({ error: 'Failed to open proof' }, { status: 500 });
  }
}
