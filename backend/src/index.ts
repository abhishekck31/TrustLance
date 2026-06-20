import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Cohort Analytics Endpoints ---

/**
 * Endpoint to calculate monthly retention cohorts.
 * This is the core analytics function.
 */
app.get('/analytics/cohort-retention', async (req, res) => {
  try {
    // 1. Identify Cohorts: Group users by their registration month.
    // 2. Calculate Retention: Determine how many of those users performed an action in subsequent months.
    
    // Placeholder implementation: In a real scenario, this involves complex SQL aggregation (e.g., using date math).
    const cohortData = await prisma.$queryRaw`
      WITH user_cohort AS (
        SELECT 
          DATE_TRUNC('month', T.timestamp) as cohort_month,
          T.user_id
        FROM "Transaction" T
        GROUP BY 1, T.user_id
      ),
      retention_data AS (
        SELECT
          uc.cohort_month,
          COUNT(DISTINCT CASE 
            WHEN DATE_TRUNC('month', T.timestamp) = (uc.cohort_month + INTERVAL '1 month') THEN T.user_id
            ELSE NULL
          END) AS retained_users
        FROM user_cohort uc
        JOIN "Transaction" T ON T.timestamp > (uc.cohort_month - INTERVAL '1 month') AND T.timestamp < (uc.cohort_month + INTERVAL '2 months')
        GROUP BY 1
      )
      SELECT 
        cohort_month,
        COUNT(DISTINCT user_id) AS cohort_size,
        SUM(retained_users) AS retained_count
      FROM retention_data
      GROUP BY cohort_month
      ORDER BY cohort_month;
    `;

    // For simplicity in this example, we return aggregated results directly from the raw query.
    res.json({ message: "Cohort retention data calculated successfully", data: cohortData.rows });

  } catch (error) {
    console.error("Error calculating cohort retention:", error);
    res.status(500).json({ error: "Failed to calculate cohort retention." });
  }
});


app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});