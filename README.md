This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install all dependency dulu (setiap kali switch to another branch buat lihat" misalnya, npm install dulu) (ga akan keredwonload yg sdh ke download kok) 
```bash
npm install 
```
next, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Vercel Blob Setup (Payment Proof)

Payment proof uploads use Vercel Blob from the API route `app/api/payment/route.ts`.

Set this environment variable in local `.env` and in your Vercel project settings:

```bash
BLOB_READ_WRITE_TOKEN=your_vercel_blob_read_write_token
```

How to get the token:
1. Open Vercel Dashboard.
2. Go to your project.
3. Storage -> Blob -> Connect/Create store.
4. Copy the Read/Write token and set it as `BLOB_READ_WRITE_TOKEN`.

## Email Notifications

This project includes a production-ready SMTP mailer for submission, confirmation, and rejection emails.

### Environment Variables

Set these values in `.env.local` for local development and in your deployment environment:

```bash
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=notifications@example.com
EMAIL_PASS=replace-with-your-smtp-password
```

Use `EMAIL_SECURE=true` for SMTPS ports like `465`.

### Email Flows

- Submission received email after a successful registration.
- Approved/confirmed email after payment approval.
- Declined/rejected email after payment rejection.

The approved flow supports inline CID images for QR-style attachments.

### API Endpoints

Submission notification:

```bash
POST /api/notify
```

Sample JSON:

```json
{
	"email": "attendee@example.com",
	"name": "Alya Putri",
	"referenceId": "TEDX-REG-2026-001"
}
```

Confirmed notification:

```bash
POST /api/notify/confirmed
```

Sample JSON:

```json
{
	"email": "attendee@example.com",
	"name": "Alya Putri",
	"accessCode": "TEDX-ACCESS-2026",
	"loginUrl": "https://example.com/event",
	"qrImageBuffers": [
		{
			"filename": "ticket-qr.png",
			"contentBase64": "iVBORw0KGgoAAAANSUhEUgAA...",
			"contentType": "image/png",
			"cid": "ticket-qr"
		}
	]
}
```

Declined notification:

```bash
POST /api/notify/declined
```

Sample JSON:

```json
{
	"email": "attendee@example.com",
	"name": "Alya Putri",
	"reason": "Uploaded proof is blurred and the amount is not readable.",
	"retryUrl": "https://example.com/register"
}
```

### Business Flow Integration

- `POST /api/register` sends the submission email after the registration transaction commits.
- `POST /api/admin/payment/approve` sends the confirmed email with an inline QR attachment.
- `POST /api/admin/payment/reject` sends the declined email with a retry link.

If the database action succeeds but email delivery fails, the API still returns success for the business action and includes a notification object in the response data so the email can be retried later.

### Expected Responses

Success responses follow this shape:

```json
{
	"success": true,
	"message": "...",
	"data": {
		"accepted": ["attendee@example.com"],
		"rejected": [],
		"messageId": "..."
	}
}
```

Validation or SMTP failures follow this shape:

```json
{
	"success": false,
	"message": "...",
	"error": "..."
}
```

For registration, approval, and rejection flows, the database action stays successful even if the email fails, and the response includes a `notification` object with the mailer result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
