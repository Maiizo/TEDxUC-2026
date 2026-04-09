import nodemailer from 'nodemailer';
import { getSmtpConfig } from '@/src/lib/mailer/config';

type MailTransporter = ReturnType<typeof nodemailer.createTransport>;

let cachedTransporter: MailTransporter | null = null;

export function getTransporter(): MailTransporter {
	if (cachedTransporter) {
		return cachedTransporter;
	}

	const config = getSmtpConfig();
	cachedTransporter = nodemailer.createTransport({
		host: config.host,
		port: config.port,
		secure: config.secure,
		auth: {
			user: config.user,
			pass: config.pass,
		},
	});

	return cachedTransporter;
}

export async function verifyTransporter(transporter: MailTransporter = getTransporter()): Promise<void> {
	await transporter.verify();
}