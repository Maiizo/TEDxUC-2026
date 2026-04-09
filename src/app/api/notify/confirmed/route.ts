import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/src/lib/mailer/sendEmail';
import { confirmedTemplate } from '@/src/lib/mailer/templates';
import type { ConfirmedEmailPayload, EmailAttachment, InlineImagePayload } from '@/src/types/mailer';

export const runtime = 'nodejs';

type ConfirmedBody = ConfirmedEmailPayload;

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

function toInlineAttachments(buffers: InlineImagePayload[] = []): {
	attachments: EmailAttachment[];
	cids: string[];
} {
	const attachments: EmailAttachment[] = [];
	const cids: string[] = [];

	buffers.forEach((item, index) => {
		const cid = item.cid?.trim() || `qr-inline-${index + 1}`;
		attachments.push({
			filename: item.filename?.trim() || `qr-inline-${index + 1}.png`,
			content: Buffer.from(item.contentBase64, 'base64'),
			contentType: item.contentType?.trim() || 'image/png',
			cid,
		});
		cids.push(cid);
	});

	return { attachments, cids };
}

export async function POST(request: NextRequest) {
	try {
		const body = (await request.json().catch(() => null)) as ConfirmedBody | null;

		if (!body) {
			return jsonResponse(400, 'Invalid request body', undefined, 'Request body must be valid JSON');
		}

		const email = body.email?.trim();
		const name = body.name?.trim();
		const accessCode = body.accessCode?.trim();
		const loginUrl = body.loginUrl?.trim();

		if (!email || !name || !accessCode || !loginUrl) {
			return jsonResponse(400, 'Missing required fields', undefined, 'email, name, accessCode, and loginUrl are required');
		}

		if (!isValidEmail(email)) {
			return jsonResponse(400, 'Invalid email address', undefined, 'Provide a valid attendee email');
		}

		try {
			new URL(loginUrl);
		} catch {
			return jsonResponse(400, 'Invalid loginUrl', undefined, 'loginUrl must be an absolute URL');
		}

		const { attachments, cids } = toInlineAttachments(body.qrImageBuffers ?? []);
		const result = await sendEmail(
			{
				to: email,
				subject: 'Your registration is confirmed - TEDxUC 2026',
				html: confirmedTemplate({
					email,
					name,
					accessCode,
					loginUrl,
					qrImageBuffers: body.qrImageBuffers,
					inlineImageCids: cids,
				}),
				attachments,
			},
			{ verifyBeforeSend: true }
		);

		if (!result.success) {
			return jsonResponse(
				500,
				'Failed to send confirmation email',
				{ accepted: result.accepted, rejected: result.rejected, messageId: result.messageId },
				result.error ?? 'SMTP send failed'
			);
		}

		return jsonResponse(200, 'Confirmation email sent', {
			accepted: result.accepted,
			rejected: result.rejected,
			messageId: result.messageId,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		return jsonResponse(500, 'Failed to send confirmation email', undefined, message);
	}
}