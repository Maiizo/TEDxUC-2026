import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const registrationId = searchParams.get('registrationId');

    // If registrationId is provided, return that specific registration with its event
    if (registrationId) {
      const registration = await prisma.registration.findUnique({
        where: { id: registrationId },
        select: {
          id: true,
          registrationNumber: true,
          fullName: true,
          email: true,
          event: {
            select: {
              id: true,
              name: true,
              type: true,
              isActive: true,
            },
          },
        },
      });

      if (!registration) {
        return NextResponse.json(
          { error: 'Registration not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ registration });
    }

    // Otherwise return all registrations and events
    const [registrations, events] = await Promise.all([
      prisma.registration.findMany({
        select: {
          id: true,
          registrationNumber: true,
          fullName: true,
          email: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.event.findMany({
        select: {
          id: true,
          name: true,
          type: true,
          isActive: true,
          registeredCount: true,
          quota: true,
        },
      }),
    ]);

    return NextResponse.json({ registrations, events });
  } catch (error) {
    console.error('Failed to fetch registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}
