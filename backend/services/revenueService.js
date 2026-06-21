const prisma = require('../lib/prisma'); // Assume prisma client initialization is handled elsewhere
const { Subscription } = require('@prisma/client');

/**
 * Calculates Monthly Recurring Revenue (MRR) and churn for a given month.
 * @param {string} year - The year to analyze (e.g., '2024')
 * @param {string} month - The month to analyze (e.g., '05')
 * @returns {Promise<{totalMRR: number, churnRate: number}>}
 */
async function calculateMonthlyMRR(year, month) {
  const targetMonth = `${year}-${month}`;

  // 1. Calculate Total MRR for the month (MRR = sum of active subscriptions in that month)
  const totalMRR = await prisma.subscription.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: 'ACTIVE',
      // Filter by subscriptions started or active during the target month
      startDate: {
        gte: new Date(`${targetMonth}-01T00:00:00Z`),
        lt: new Date(`${targetMonth + '-01T00:00:00Z'}`) // End of the month
      }
    }
  });

  // 2. Calculate Churn (Simplified example: comparing start vs end states)
  // In a real system, churn calculation is more complex (revenue lost vs revenue gained).
  // Here we approximate by counting cancellations in that period.
  const totalSubscriptionsStart = await prisma.subscription.count({
      where: {
          status: 'ACTIVE',
          startDate: {
              gte: new Date(`${targetMonth}-01T00:00:00Z`),
              lt: new Date(`${targetMonth + '-01T00:00:00Z'}`)
          }
      }
  });

  // A full churn calculation requires knowing the previous month's active count.
  // For demonstration, we return basic MRR based on current active subscriptions in that window.
  const totalChurn = 0; // Placeholder for advanced logic

  return {
    totalMRR: parseFloat(totalMRR || 0),
    churnRate: 0.0, // Requires more data context
  };
}

/**
 * Fetches MRR analytics for the last N months.
 * @param {number} months - Number of trailing months to calculate.
 * @returns {Promise<Array<{monthYear: string, totalMRR: number}>>}
 */
async function getMonthlyRevenueAnalytics(months) {
    const results = [];
    const today = new Date();

    for (let i = months - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const monthYear = `${year}-${month}`;

        // In a production setting, we would call the detailed calculateMonthlyMRR for each period.
        // For brevity here, we will simulate fetching aggregated data by running the core logic:
        const result = await calculateMonthlyMRR(year, month);

        results.push({
            monthYear: monthYear,
            totalMRR: result.totalMRR,
        });
    }
    return results;
}


module.exports = {
  getMonthlyRevenueAnalytics,
};