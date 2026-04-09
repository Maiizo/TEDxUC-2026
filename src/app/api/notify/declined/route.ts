import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/src/lib/mailer/sendEmail';
import { declinedTemplate } from '@/src/lib/mailer/templates';
import type { DeclinedEmailPayload } from '@/src/types/mailer';

export const runtime = 'nodejs';

type DeclinedBody = DeclinedEmailPayload;

function jsonResponse(
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

function isValidEmail(value: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
	try {
		const body = (await request.json().catch(() => null)) as DeclinedBody | null;

		if (!body) {
			return jsonResponse(400, 'Invalid request body', undefined, 'Request body must be valid JSON');
		}

		const email = body.email?.trim();
		const name = body.name?.trim();
		const reason = body.reason?.trim();
		const retryUrl = body.retryUrl?.trim();

		if (!email || !name || !reason || !retryUrl) {
			return jsonResponse(400, 'Missing required fields', undefined, 'email, name, reason, and retryUrl are required');
		}

		if (!isValidEmail(email)) {
			return jsonResponse(400, 'Invalid email address', undefined, 'Provide a valid attendee email');
		}

		try {
			new URL(retryUrl);
		} catch {
			return jsonResponse(400, 'Invalid retryUrl', undefined, 'retryUrl must be an absolute URL');
		}

		const result = await sendEmail(
			{
				to: email,
				subject: 'Payment rejected - TEDxUC 2026',
				html: declinedTemplate({ email, name, reason, retryUrl }),
			},
			{ verifyBeforeSend: true }
		);

		if (!result.success) {
			return jsonResponse(
				500,
				'Failed to send rejection email',
				{ accepted: result.accepted, rejected: result.rejected, messageId: result.messageId },
				result.error ?? 'SMTP send failed'
			);
		}

		return jsonResponse(200, 'Rejection email sent', {
			accepted: result.accepted,
			rejected: result.rejected,
			messageId: result.messageId,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		return jsonResponse(500, 'Failed to send rejection email', undefined, message);
	}
}