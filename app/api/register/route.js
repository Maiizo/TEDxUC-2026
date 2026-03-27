import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateRegNumber } from '@/utils/generateRegNumber';

export async function POST(req) {
  try {
    const body = await req.json();
    const { fullName, email, phoneNumber, gender, age, eventId, eventKey, foodAllergy } = body;

    // Validate required fields
    if (!fullName || !email || !phoneNumber || !gender || !age || (!eventId && !eventKey)) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Resolve selected event by ID or key from frontend flow
    let event = null;

    if (eventId) {
      event = await prisma.event.findUnique({
        where: { id: eventId }
      });
    }

    if (!event && eventKey) {
      if (eventKey === 'pre-event-1') {
        event = await prisma.event.findFirst({
          where: {
            isActive: true,
            OR: [
              { type: 'Pre Event Day 1' },
              { type: 'Pre Event 1' },
              { type: 'Pre-Event 1' },
              { name: { contains: 'Pre Event 1', mode: 'insensitive' } },
              { name: { contains: 'Pre-Event 1', mode: 'insensitive' } }
            ]
          },
          orderBy: { date: 'asc' }
        });

        if (!event) {
          event = await prisma.event.create({
            data: {
              name: 'Pre-Event 1: The First Gathering',
              type: 'Pre Event Day 1',
              date: new Date('2026-04-10T14:00:00.000Z'),
              quota: 300,
              registeredCount: 0,
              price: 0,
              description: 'Auto-created Pre-Event 1 for registration flow',
              requireFoodAllergy: false,
              isActive: true,
            }
          });
        }
      }

      if (eventKey === 'main-event') {
        event = await prisma.event.findFirst({
          where: {
            isActive: true,
            OR: [
              { type: 'Main Event' },
              { name: { contains: 'Main Event', mode: 'insensitive' } }
            ]
          },
          orderBy: { date: 'asc' }
        });

        if (!event) {
          event = await prisma.event.create({
            data: {
              name: 'TEDxUC 2026 Main Event',
              type: 'Main Event',
              date: new Date('2026-05-10T10:00:00.000Z'),
              quota: 1500,
              registeredCount: 0,
              price: 0,
              description: 'Auto-created Main Event for registration flow',
              requireFoodAllergy: true,
              isActive: true,
            }
          });
        }
      }
    }

    if (!event) {
      return NextResponse.json(
        { status: 'error', message: 'Selected event is not available' },
        { status: 404 }
      );
    }

    const regNumber = generateRegNumber();

    // Create Registration - schema default status is "pending"
    // Also handling default foodAllergy if not provided
    const registration = await prisma.registration.create({
      data: {
        fullName,
        email,
        phoneNumber,
        gender,
        age: Number(age),
        foodAllergy: event.requireFoodAllergy ? (foodAllergy || '-') : '-',
        eventId: event.id,
        registrationNumber: regNumber,
        status: "pending", // Secara eksplisit diset ke pending (meskipun defaultnya pending di schema)
      }
    });

    return NextResponse.json({ 
      status: 'success', 
      message: 'Registration successful, saved with pending status.',
      data: {
        id: registration.id,
        registrationNumber: registration.registrationNumber,
        status: registration.status
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration POST Error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error while processing registration' },
      { status: 500 }
    );
  }
}
