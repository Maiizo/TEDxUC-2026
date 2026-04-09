export type SmtpConfig = {
	host: string;
	port: number;
	secure: boolean;
	user: string;
	pass: string;
};

export type EmailAttachment = {
	filename?: string;
	content?: Buffer | string;
	contentType?: string;
	cid?: string;
	encoding?: string;
	path?: string;
};

export type SendEmailInput = {
	to: string;
	subject: string;
	html: string;
	attachments?: EmailAttachment[];
};

export type SendEmailResult = {
	success: boolean;
	accepted: string[];
	rejected: string[];
	messageId?: string;
	error?: string;
};

export type InlineImagePayload = {
	filename?: string;
	contentBase64: string;
	contentType?: string;
	cid?: string;
};

export type ConfirmedEmailPayload = {
	email: string;
	name: string;
	registrationNumber?: string;
	accessCode: string;
	loginUrl: string;
	qrImageBuffers?: InlineImagePayload[];
};

export type DeclinedEmailPayload = {
	email: string;
	name: string;
	reason: string;
	retryUrl: string;
};