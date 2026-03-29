import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { prisma } from '@/lib/db';

const MAX_PROOF_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_PROOF_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

function getSafeExtFromFile(file: File): string {
  const extFromName = file.name.split('.').pop()?.toLowerCase();
  if (extFromName && /^[a-z0-9]+$/.test(extFromName)) {
    return extFromName;
  }

  const fromMime: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };

  return fromMime[file.type] ?? 'bin';
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const registrationId = formData.get('registrationId') as string;
    const senderName = formData.get('senderName') as string;
    const proofFile = formData.get('proof') as File;
    const amountRaw = formData.get('amount');
    const fallbackAmount = Number(amountRaw);
    const paymentMethod = 'PROOF_UPLOAD';

    if (!registrationId || !senderName || !proofFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!(proofFile instanceof File)) {
      return NextResponse.json(
        { error: 'Invalid payment proof file' },
        { status: 400 }
      );
    }

    if (!ALLOWED_PROOF_TYPES.has(proofFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Use PNG, JPG, WEBP, or GIF.' },
        { status: 400 }
      );
    }

    if (proofFile.size > MAX_PROOF_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File is too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Verify registration exists
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        event: {
          select: {
            price: true,
          },
        },
      },
    });

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    // Amount is derived from the event to prevent client-side tampering.
    const amount = Number.isNaN(Number(registration.event?.price))
      ? (Number.isNaN(fallbackAmount) ? 0 : fallbackAmount)
      : Number(registration.event.price);

    const safeSenderName = senderName.trim();
    const safeRegNumber = registration.registrationNumber.replace(/[^a-zA-Z0-9-_]/g, '-');
    const ext = getSafeExtFromFile(proofFile);
    const blobPath = `payment-proofs/${safeRegNumber}-${Date.now()}.${ext}`;

    const blob = await put(blobPath, proofFile, {
      access: 'private',
      addRandomSuffix: true,
      contentType: proofFile.type,
    });

    const proofUrl = blob.downloadUrl ?? blob.url;

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        registrationId,
        amount,
        paymentMethod,
        status: 'verifying',
        proofUrl,
        proofSenderName: safeSenderName,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Payment submitted for verification',
        paymentId: payment.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Payment submission error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to submit payment: ${errorMessage}` },
      { status: 500 }
    );
  }
}
