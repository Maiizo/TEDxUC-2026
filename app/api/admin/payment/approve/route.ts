import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import QRCode from "qrcode";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { paymentId } = await request.json();
    if (!paymentId || typeof paymentId !== "string") {
      return NextResponse.json({ error: "paymentId is required" }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { registration: true }
    });

    if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    if (payment.status === "approved") {
      return NextResponse.json({ success: true, message: "Payment already approved" });
    }
    if (payment.status === "rejected") {
      return NextResponse.json({ error: "Rejected payment cannot be approved" }, { status: 409 });
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

    // Skip email in development or if email not configured
    const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS !== "password_app_gmail_kamu";
    if (isEmailConfigured) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      try {
        await transporter.sendMail({
          from: `"TEDxUC 2026" <${process.env.EMAIL_USER}>`,
          to: updatedReg.email,
          subject: "Ticket Confirmed! - TEDxUC 2026",
          html: `
            <h2>Hi ${updatedReg.fullName}, your payment is approved!</h2>
            <p>Attached is your QR Code ticket. Please present it on D-Day.</p>
            <img src="cid:ticket-qr" alt="QR Ticket" />
          `,
          attachments: [{
            filename: 'ticket-qr.png',
            content: pngBuffer,
            cid: 'ticket-qr'
          }]
        });
      } catch (emailError) {
        console.error("Email send failed:", emailError);
        // Continue anyway - payment approval is already recorded in database
      }
    } else {
      console.log(`[DEV] Email skipped for ${updatedReg.email} (email not configured)`);
    }

    return NextResponse.json({ success: true, message: "Payment approved" });
  } catch (error) {
    console.error("Payment approval error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: `Failed to approve payment: ${errorMessage}` }, { status: 500 });
  }
}