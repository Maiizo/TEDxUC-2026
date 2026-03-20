import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const registrationId = formData.get('registrationId') as string;
    const senderName = formData.get('senderName') as string;
    const proofFile = formData.get('proof') as File;
    const amount = parseFloat(formData.get('amount') as string);
    const paymentMethod = formData.get('paymentMethod') as string || 'BCA';

    if (!registrationId || !senderName || !proofFile || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify registration exists
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId }
    });

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

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
