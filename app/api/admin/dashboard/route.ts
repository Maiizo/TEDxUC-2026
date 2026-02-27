import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get all data from database
    const [events, registrations, payments, admins] = await Promise.all([
      prisma.event.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.registration.findMany({
        include: {
          event: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.payment.findMany({
        include: {
          registration: {
            include: {
              event: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.admin.findMany({
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Calculate statistics
    const stats = {
      totalEvents: events.length,
      activeEvents: events.filter((e: any) => e.isActive).length,
      totalRegistrations: registrations.length,
      paidRegistrations: registrations.filter((r: any) => r.status === 'paid').length,
      pendingRegistrations: registrations.filter((r: any) => r.status === 'pending').length,
      totalPayments: payments.length,
      successfulPayments: payments.filter((p: any) => p.status === 'success').length,
      totalRevenue: payments
        .filter((p: any) => p.status === 'success')
        .reduce((sum: number, p: any) => sum + p.amount, 0),
    };

    return NextResponse.json(
      {
        stats,
        events,
        registrations,
        payments,
        admins,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching dashboard data' },
      { status: 500 }
    );
  }
}
