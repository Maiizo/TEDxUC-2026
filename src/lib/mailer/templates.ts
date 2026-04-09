import type { ConfirmedEmailPayload, DeclinedEmailPayload } from '@/src/types/mailer';

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function baseTemplate(title: string, body: string): string {
	return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4efe7;font-family:Arial,Helvetica,sans-serif;color:#172033;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      ${escapeHtml(title)}
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4efe7;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(18,27,47,0.12);">
            <tr>
              <td style="background:linear-gradient(135deg,#111827 0%,#1f2937 55%,#ca8a04 100%);padding:32px 36px;color:#ffffff;">
                <div style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;opacity:0.8;">TEDxUC 2026</div>
                <h1 style="margin:12px 0 0;font-size:28px;line-height:1.2;">${escapeHtml(title)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 36px;">
                ${body}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function actionButton(label: string, href: string): string {
	return `
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0;">
      <tr>
        <td style="border-radius:999px;background:#111827;">
          <a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 22px;color:#ffffff;text-decoration:none;font-weight:700;">${escapeHtml(label)}</a>
        </td>
      </tr>
    </table>`;
}

function codeChip(value: string): string {
	return `
    <div style="display:inline-block;padding:12px 16px;border:1px solid #d6d3cb;border-radius:14px;background:#f8f7f2;font-family:Menlo,Consolas,monospace;font-size:16px;font-weight:700;letter-spacing:0.06em;">
      ${escapeHtml(value)}
    </div>`;
}

export function confirmedTemplate(data: ConfirmedEmailPayload & { inlineImageCids?: string[] }): string {
  const attendeeCodeValue = data.registrationNumber ?? data.accessCode;

	const images = data.inlineImageCids?.length
		? `
      <div style="margin-bottom:24px;padding:18px;border:1px solid #e7e0d1;border-radius:18px;background:#fffdf8;">
        <p style="margin:0 0 14px;font-size:13px;line-height:1.7;color:#4b5563;">Scan this QR code at the registration desk on event day:</p>
        ${data.inlineImageCids
			.map(
				(cid) => `
          <div style="margin-bottom:12px;text-align:center;">
            <img src="cid:${escapeHtml(cid)}" alt="QR ticket" style="max-width:100%;height:auto;border-radius:14px;" />
          </div>`
			)
			.join('')}
       </div>`
		: '';

	return baseTemplate(
		'Your registration is confirmed',
		`
      <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">Hi ${escapeHtml(data.name)}, your registration has been confirmed.</p>
      ${images}
      <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#4b5563;">Registration ID</p>
      ${codeChip(attendeeCodeValue)}
    `
	);
}

export function declinedTemplate(data: DeclinedEmailPayload): string {
	return baseTemplate(
		'Payment rejected',
		`
      <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">Hi ${escapeHtml(data.name)}, your payment submission was declined.</p>
      <div style="padding:18px 20px;border-radius:18px;background:#fff5f5;border:1px solid #fecaca;margin-bottom:18px;">
        <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#991b1b;">Reason</p>
        <p style="margin:0;font-size:14px;line-height:1.7;color:#7f1d1d;">${escapeHtml(data.reason)}</p>
      </div>
      ${actionButton('Retry submission', data.retryUrl)}
      <p style="margin:0;font-size:14px;line-height:1.7;color:#4b5563;">Please correct the issue and submit again using the link above.</p>
    `
	);
}