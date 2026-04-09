import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { sendEmail } from '@/src/lib/mailer/sendEmail';
import { declinedTemplate } from '@/src/lib/mailer/templates';

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

    const { paymentId, rejectionReason } = await request.json();
    if (!paymentId || typeof paymentId !== "string") {
      return response(400, 'paymentId is required', undefined, 'paymentId is required');
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { registration: true }
    });

    if (!payment) return response(404, 'Payment not found', undefined, 'Payment not found');
    if (payment.status === "rejected") {
      return response(200, 'Payment already rejected');
    }
    if (payment.status === "approved") {
      return response(409, 'Approved payment cannot be rejected', undefined, 'Approved payment cannot be rejected');
    }

    const safeReason =
      typeof rejectionReason === "string" && rejectionReason.trim()
        ? rejectionReason.trim()
        : "Payment proof does not match our verification criteria.";

    const updatedReg = await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: "rejected",
          rejectionReason: safeReason,
        },
      });

      return tx.registration.update({
        where: { id: payment.registrationId },
        data: {
          status: "pending",
          qrCode: null,
          pdfTicket: null,
        },
      });
    });

    const retryUrl = new URL('/register', request.nextUrl.origin).toString();
    const emailResult = await sendEmail(
      {
        to: updatedReg.email,
        subject: 'Payment rejected - TEDxUC 2026',
        html: declinedTemplate({
          email: updatedReg.email,
          name: updatedReg.fullName,
          reason: safeReason,
          retryUrl,
        }),
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
      ? 'Payment rejected'
      : `Payment rejected, but rejection email failed and should be retried. Reason: ${emailResult.error ?? 'Unknown SMTP error'}`;

    return response(200, message, {
      registrationId: updatedReg.id,
      paymentId,
      notification,
    });
  } catch (error) {
    console.error("Payment rejection error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return response(500, 'Failed to reject payment', undefined, errorMessage);
  }
}