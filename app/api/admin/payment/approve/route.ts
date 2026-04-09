import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import QRCode from 'qrcode';
import { sendEmail } from '@/src/lib/mailer/sendEmail';
import { confirmedTemplate } from '@/src/lib/mailer/templates';

export const runtime = 'nodejs';

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

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value;
    if (!token) {
      return response(401, 'Unauthorized', undefined, 'Unauthorized');
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return response(401, 'Invalid token', undefined, 'Invalid token');
    }

    const { paymentId } = await request.json();
    if (!paymentId || typeof paymentId !== "string") {
      return response(400, 'paymentId is required', undefined, 'paymentId is required');
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { registration: true }
    });

    if (!payment) return response(404, 'Payment not found', undefined, 'Payment not found');
    if (payment.status === "approved") {
      return response(200, 'Payment already approved');
    }
    if (payment.status === "rejected") {
      return response(409, 'Rejected payment cannot be approved', undefined, 'Rejected payment cannot be approved');
    }

    const qrToken =
      payment.registration.qrCode ??
      `TEDx26-${payment.registration.registrationNumber}-${Date.now()}`;

    const updatedReg = await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: "approved",
          rejectionReason: null,
        },
      });

      return tx.registration.update({
        where: { id: payment.registrationId },
        data: {
          status: "paid",
          qrCode: qrToken,
        },
      });
    });

    const pngBuffer = await QRCode.toBuffer(qrToken, { type: "png", width: 400 });
    const confirmUrl = new URL('/event', request.nextUrl.origin).toString();
    const emailResult = await sendEmail(
      {
        to: updatedReg.email,
        subject: 'Ticket confirmed - TEDxUC 2026',
        html: confirmedTemplate({
          email: updatedReg.email,
          name: updatedReg.fullName,
          registrationNumber: updatedReg.registrationNumber,
          accessCode: updatedReg.registrationNumber,
          loginUrl: confirmUrl,
          qrImageBuffers: [{
            filename: 'ticket-qr.png',
            contentBase64: pngBuffer.toString('base64'),
            contentType: 'image/png',
            cid: 'ticket-qr',
          }],
          inlineImageCids: ['ticket-qr'],
        }),
        attachments: [{
          filename: 'ticket-qr.png',
          content: pngBuffer,
          contentType: 'image/png',
          cid: 'ticket-qr',
        }, {
          filename: 'ticket-qr-download.png',
          content: pngBuffer,
          contentType: 'image/png',
        }],
      },
      { verifyBeforeSend: true }
    );

    const notification = {
      success: emailResult.success,
      accepted: emailResult.accepted,
      rejected: emailResult.rejected,
      messageId: emailResult.messageId,
      ...(emailResult.error ? { error: emailResult.error } : {}),
    };

    const message = emailResult.success
      ? 'Payment approved'
      : `Payment approved, but confirmation email failed and should be retried. Reason: ${emailResult.error ?? 'Unknown SMTP error'}`;

    return response(200, message, {
      registrationId: updatedReg.id,
      paymentId,
      notification,
    });
  } catch (error) {
    console.error("Payment approval error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return response(500, 'Failed to approve payment', undefined, errorMessage);
  }
}