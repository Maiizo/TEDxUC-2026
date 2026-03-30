import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateRegNumber } from '@/utils/generateRegNumber';

type RegisterBody = {
	fullName?: string;
	email?: string;
	phoneNumber?: string;
	gender?: string;
	age?: number;
	eventKey?: 'pre-event-1' | 'main-event' | string;
	foodAllergy?: string;
};

function badRequest(message: string) {
	return NextResponse.json({ status: 'error', message }, { status: 400 });
}

async function resolveEventId(eventKey: string) {
	const lookup = {
		'pre-event-1': {
			names: ['pre-event 1', 'pre event 1', 'the first gathering'],
			types: ['pre event day 1', 'pre-event 1'],
		},
		'main-event': {
			names: ['main event', 'tedxuc 2026 main event'],
			types: ['main event'],
		},
	} as const;

	const target = lookup[eventKey as keyof typeof lookup];
	if (!target) return null;

	const events = await prisma.event.findMany({
		where: { isActive: true },
		orderBy: { date: 'asc' },
		select: {
			id: true,
			name: true,
			type: true,
			quota: true,
			registeredCount: true,
			price: true,
			requireFoodAllergy: true,
		},
	});

	const matched = events.find((ev) => {
		const name = ev.name.toLowerCase();
		const type = ev.type.toLowerCase();
		return (
			target.names.some((k) => name.includes(k)) ||
			target.types.some((k) => type.includes(k))
		);
	});

	return matched ?? null;
}

export async function POST(request: NextRequest) {
	try {
		const body = (await request.json().catch(() => null)) as RegisterBody | null;

		if (!body) {
			return badRequest('Invalid request body');
		}

		const fullName = body.fullName?.trim();
		const email = body.email?.trim();
		const phoneNumber = body.phoneNumber?.trim();
		const gender = body.gender?.trim();
		const age = Number(body.age);
		const eventKey = body.eventKey;

		if (!fullName || !email || !phoneNumber || !gender || !eventKey) {
			return badRequest('Missing required fields');
		}

		if (!Number.isFinite(age) || age < 12) {
			return badRequest('Invalid age');
		}

		const event = await resolveEventId(eventKey);
		if (!event) {
			return NextResponse.json(
				{ status: 'error', message: 'Selected event is not available' },
				{ status: 404 }
			);
		}

		if (event.registeredCount >= event.quota) {
			return NextResponse.json(
				{ status: 'error', message: 'Event quota is full' },
				{ status: 409 }
			);
		}

		const baseRegNumber = generateRegNumber();
		const registrationNumber = `${baseRegNumber}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

		const foodAllergy = event.requireFoodAllergy
			? (body.foodAllergy?.trim() || '-')
			: '-';

		const registration = await prisma.$transaction(async (tx) => {
			const created = await tx.registration.create({
				data: {
					fullName,
					email,
					phoneNumber,
					gender,
					age,
					foodAllergy,
					eventId: event.id,
					registrationNumber,
					status: 'pending',
					qrCode: null,
				},
				select: {
					id: true,
					registrationNumber: true,
					status: true,
					qrCode: true,
				},
			});

			await tx.event.update({
				where: { id: event.id },
				data: { registeredCount: { increment: 1 } },
			});

			return created;
		});

		return NextResponse.json(
			{
				status: 'success',
				message: 'Registration created successfully',
				data: {
					...registration,
					paymentAmount: Number(event.price ?? 0),
				},
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Registration create error:', error);
		return NextResponse.json(
			{ status: 'error', message: 'Failed to create registration' },
			{ status: 500 }
		);
	}
}
