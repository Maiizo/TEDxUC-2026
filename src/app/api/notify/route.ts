import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
	return NextResponse.json(
		{ success: false, message: 'Submission email endpoint has been removed. Emails are only sent after admin approves payment.' },
		{ status: 404 }
	);
}