import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ status: 'success', message: 'Register endpoint coming soon' }, { status: 200 });
}
