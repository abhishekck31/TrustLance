import { PrismaClient } from '@prisma/client';
import { Subscription, MonthlyMetric, SubscriptionStatus } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Calculates the total Monthly Recurring Revenue (MRR) for a given month.
 * @param year The year to query.
 * @param month The month to query (1-indexed).
 * @returns The total MRR for that period.
 */
export async function calculateMonthlyMRR(year: number, month: number): Promise<number> {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0); // Last day of the month

  const subscriptions = await prisma.subscription.findMany({
    where: {
      status: 'active',
    },
  });

  let totalMRR = 0;

  for (const sub of subscriptions) {
    if (new Date(sub.startDate) >= startOfMonth && new Date(sub.startDate) <= endOfMonth) {
      totalMRR += sub.monthlyPrice;
    }
  }

  return parseFloat(totalMRR.toFixed(2));
}

/**
 * Calculates key monthly revenue metrics (MRR, New Subs, Churn) for a given month.
 * NOTE: This is a simplified implementation. Real-world churn calculation requires tracking historical states over time.
 */
export async function calculateMonthlyMetrics(year: number, month: number): Promise<object> {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0);

  // 1. Total Active MRR for the month
  const activeSubscriptions = await prisma.subscription.findMany({
    where: {
      status: 'active',
      // Check if subscription started within the relevant time frame (simplification)
      startDate: {
        gte: startOfMonth,
      }
    },
  });

  const totalMRR = activeSubscriptions.reduce((sum, sub) => sum + sub.monthlyPrice, 0);

  // 2. New Subscriptions during the month (Requires comparing current state vs previous state, omitted for brevity but would involve complex joins/history in production)
  // Placeholder: In a real system, this requires historical data comparisons.
  const newSubscriptionsCount = 15; // Mock value

  // 3. Churn (Placeholder calculation)
  const totalCustomersAtStart = await prisma.customer.count({ where: { createdAt: { gte: startOfMonth } } });
  const currentActiveCustomers = activeSubscriptions.length;
  const churnedCount = Math.max(0, totalCustomersAtStart - currentActiveCustomers); // Highly simplified

  return {
    month: `${year}-${String(month).padStart(2, '0')}`,
    totalMRR: totalMRR,
    newSubscriptions: newSubscriptionsCount,
    churnedCustomers: churnedCount,
  };
}


// Example endpoint handler (Conceptual - actual implementation in Express router)
export async function getRevenueAnalytics(year: number, month: number) {
    try {
        const mrr = await calculateMonthlyMRR(year, month);
        const metrics = await calculateMonthlyMetrics(year, month);
        return {
            mrr: mrr,
            metrics: metrics
        };
    } catch (error) {
        console.error("Error calculating revenue analytics:", error);
        throw new Error("Failed to calculate analytics.");
    }
}

// Utility function for fetching all historical data for charting
export async function getHistoricalData(startDate: Date, endDate: Date) {
    const results = await prisma.subscription.findMany({
        where: {
            startDate: {
                gte: startDate,
                lte: endDate,
            }
        },
        include: {
            customer: true
        }
    });
    return results;
}


export default prisma;