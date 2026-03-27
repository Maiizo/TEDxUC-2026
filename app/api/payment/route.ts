import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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

    // Convert file to base64 for storage (dev only - in production use Vercel Blob or S3)
    const buffer = await proofFile.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = proofFile.type;
    const proofUrl = `data:${mimeType};base64,${base64}`;

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        registrationId,
        amount,
        paymentMethod,
        status: 'verifying',
        proofUrl,
        proofSenderName: senderName,
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
