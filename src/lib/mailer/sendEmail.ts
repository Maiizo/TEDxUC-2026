import { getSmtpConfig } from '@/src/lib/mailer/config';
import { getTransporter, verifyTransporter } from '@/src/lib/mailer/transporter';
import type { SendEmailInput, SendEmailResult } from '@/src/types/mailer';

const MAIL_FROM_NAME = 'TEDxUC 2026';

function logEmailEvent(level: 'info' | 'error', event: string, details: Record<string, unknown>) {
	const payload = {
		level,
		event,
		...details,
	};

	if (level === 'error') {
		console.error(JSON.stringify(payload));
		return;
	}

	console.log(JSON.stringify(payload));
}

function formatError(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}

	return String(error);
}

export async function sendEmail(
	input: SendEmailInput,
	options: { verifyBeforeSend?: boolean } = {}
): Promise<SendEmailResult> {
	const { verifyBeforeSend = false } = options;

	logEmailEvent('info', 'mailer.send.start', {
		to: input.to,
		subject: input.subject,
		attachments: input.attachments?.length ?? 0,
		verifyBeforeSend,
	});

	try {
		const config = getSmtpConfig();
		const transporter = getTransporter();

		if (verifyBeforeSend) {
			await verifyTransporter(transporter);
		}

		const info = await transporter.sendMail({
			from: `"${MAIL_FROM_NAME}" <${config.user}>`,
			to: input.to,
			subject: input.subject,
			html: input.html,
			attachments: input.attachments,
		});

		const accepted = Array.isArray(info.accepted)
			? info.accepted.map((value) => String(value))
			: [];
		const rejected = Array.isArray(info.rejected)
			? info.rejected.map((value) => String(value))
			: [];
		const success = rejected.length === 0;

		logEmailEvent(success ? 'info' : 'error', 'mailer.send.complete', {
			to: input.to,
			subject: input.subject,
			messageId: info.messageId,
			accepted,
			rejected,
			success,
		});

		return {
			success,
			accepted,
			rejected,
			messageId: info.messageId,
		};
	} catch (error) {
		const message = formatError(error);
		logEmailEvent('error', 'mailer.send.failed', {
			to: input.to,
			subject: input.subject,
			error: message,
		});

		return {
			success: false,
			accepted: [],
			rejected: [input.to],
			error: message,
		};
	}
}