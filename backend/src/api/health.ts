import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // In a real application, this data would be aggregated from contract calls
    // and potentially Redis for caching.
    const healthData = await prisma.PlatformHealth.findFirst();

    if (!healthData) {
      return NextResponse.json({ error: 'Health data not found' }, { status: 404 });
    }

    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    console.error("Error fetching platform health:", error);
    return NextResponse.json({ error: 'Failed to retrieve health data' }, { status: 500 });
  }
}