import type { SmtpConfig } from '@/src/types/mailer';

let cachedConfig: SmtpConfig | null = null;

function readRequiredEnv(name: string): string {
	const value = process.env[name]?.trim();
	if (!value) {
		throw new Error(`Missing required email environment variable: ${name}`);
	}

	return value;
}

function parseSecureFlag(value: string): boolean {
	const normalized = value.toLowerCase();

	if (normalized === 'true' || normalized === '1' || normalized === 'yes') {
		return true;
	}

	if (normalized === 'false' || normalized === '0' || normalized === 'no') {
		return false;
	}

	throw new Error('EMAIL_SECURE must be a boolean value (true or false)');
}

export function getSmtpConfig(): SmtpConfig {
	if (cachedConfig) {
		return cachedConfig;
	}

	const host = readRequiredEnv('EMAIL_HOST');
	const portRaw = readRequiredEnv('EMAIL_PORT');
	const secureRaw = readRequiredEnv('EMAIL_SECURE');
	const user = readRequiredEnv('EMAIL_USER');
	const pass = readRequiredEnv('EMAIL_PASS');
	const port = Number.parseInt(portRaw, 10);

	if (!Number.isInteger(port) || port <= 0 || port > 65535) {
		throw new Error('EMAIL_PORT must be a valid SMTP port number');
	}

	cachedConfig = {
		host,
		port,
		secure: parseSecureFlag(secureRaw),
		user,
		pass,
	};

	return cachedConfig;
}