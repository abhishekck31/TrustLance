import { NextResponse } from 'next/server';
import { GET } from '@/api/health'; // Assuming a standard Next.js API structure

export async function GET() {
  const response = await GET();
  return response;
}