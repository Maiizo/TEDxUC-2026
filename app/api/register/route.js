import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateRegNumber } from '@/utils/generateRegNumber';

export async function POST(req) {
  try {
    const body = await req.json();
    const { fullName, email, phoneNumber, gender, age, eventId, foodAllergy } = body;

    // Validate required fields
    if (!fullName || !email || !phoneNumber || !gender || !age || !eventId) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Cek ketersediaan event
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return NextResponse.json(
        { status: 'error', message: 'Event not found' },
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
        foodAllergy: foodAllergy || "-",
        eventId,
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
