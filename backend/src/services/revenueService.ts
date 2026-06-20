import { db } from '../db';
import { Subscription, Payment } from '@prisma/client';

/**
 * Calculates the Monthly Recurring Revenue (MRR) for a specific user or time period.
 * @param userId The ID of the user to calculate MRR for.
 * @returns The total MRR amount.
 */
export async function calculateMRR(userId: string): Promise<number> {
  // In a real scenario, this would involve complex date filtering and ensuring only active subscriptions count towards MRR.
  const activeSubscriptions = await db.subscription.findMany({
    where: {
      userId: userId,
      status: 'active',
    },
  });

  let totalMRR = 0;

  for (const sub of activeSubscriptions) {
    // For MRR calculation, we typically sum up the recurring price of all currently active subscriptions.
    totalMRR += sub.monthlyPrice;
  }

  return parseFloat(totalMRR.toFixed(2));
}

/**
 * Calculates the total revenue generated from payments in a given period.
 * @param startDate The start date for the calculation (inclusive).
 * @param endDate The end date for the calculation (inclusive).
 * @returns The total revenue amount.
 */
export async function calculateRevenuePeriod(startDate: Date, endDate: Date): Promise<number> {
  const payments = await db.payment.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return parseFloat(totalRevenue.toFixed(2));
}

export async function getMRRAnalytics(userId: string): Promise<{ mrr: number; totalRevenue: number }> {
    const mrr = await calculateMRR(userId);
    // Fetch revenue for the last full month as a simple example analytic hook
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const totalRevenue = await calculateRevenuePeriod(startOfMonth, endOfMonth);


    return {
        mrr: mrr,
        totalRevenueLastMonth: totalRevenue,
    };
}