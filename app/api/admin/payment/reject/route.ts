import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
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

    const { paymentId, rejectionReason } = await request.json();
    if (!paymentId || typeof paymentId !== "string") {
      return NextResponse.json({ error: "paymentId is required" }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { registration: true }
    });

    if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    if (payment.status === "rejected") {
      return NextResponse.json({ success: true, message: "Payment already rejected" });
    }
    if (payment.status === "approved") {
      return NextResponse.json({ error: "Approved payment cannot be rejected" }, { status: 409 });
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
          subject: "Ticket Rejected - TEDxUC 2026",
          html: `
            <h2>Hi ${updatedReg.fullName}, your payment has been rejected.</h2>
            <p>Reason: ${safeReason}</p>
            <p>Please re-upload valid payment proof.</p>
          `
        });
      } catch (emailError) {
        console.error("Email send failed:", emailError);
        // Continue anyway - payment rejection is already recorded in database
      }
    } else {
      console.log(`[DEV] Email skipped for ${updatedReg.email} (email not configured)`);
    }

    return NextResponse.json({ success: true, message: "Payment rejected" });
  } catch (error) {
    console.error("Payment rejection error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: `Failed to reject payment: ${errorMessage}` }, { status: 500 });
  }
}