// Main entry point for the backend service layer.
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = 3001;

app.use(express.json());

// --- Cohort Analytics Logic ---

/**
 * Calculates monthly retention rates for a given cohort based on recorded activities.
 * @param cohortId The ID of the cohort to analyze.
 * @returns An object containing the retention data.
 */
async function calculateCohortRetention(cohortId) {
    // 1. Get initial cohort size (N0)
    const initialCohort = await prisma.Cohort.findUnique({
        where: { id: cohortId },
    });

    if (!initialCohort) {
        throw new Error(`Cohort ID ${cohortId} not found.`);
    }

    // 2. Get the initial members for comparison (this is simplified; real world needs a distinct list of starters)
    const initialMembers = await prisma.CohortActivity.findMany({
        where: { cohortId: cohortId },
    });

    if (initialMembers.length === 0) {
        return {
            cohortId: cohortId,
            retentionRates: {},
            details: "No activity recorded for this cohort."
        };
    }

    const initialCohortSize = initialMembers.length;

    // 3. Group activities by month (to track retention)
    const monthlyActivity = await prisma.CohortActivity.groupBy({
        by: ['activityMonth'],
        _sum: { metricValue: true }, // Sum of metrics for that month
    });

    const monthlyMetrics = monthlyActivity.reduce((acc, item) => {
        acc[item.activityMonth] = item._sum.metricValue;
        return acc;
    }, {});


    // 4. Calculate Retention (Simplistic retention based on presence of activity)
    const cohortData = {
        cohortId: cohortId,
        initialSize: initialCohortSize,
        retentionRates: {},
        monthlyMetrics: monthlyMetrics,
        details: "Calculated using recorded activity metrics."
    };

    // Calculate retention for each subsequent month relative to the start month (Month 1)
    for (let m = 2; m <= 12; m++) {
        const retentionNumerator = Object.values(monthlyMetrics).filter(metric => metric !== undefined && metric > 0).length;

        if (initialCohortSize > 0) {
            const retentionRate = (retentionNumerator / initialCohortSize) * 100;
            cohortData.retentionRates[m] = parseFloat(retentionRate.toFixed(2));
        } else {
             cohortData.retentionRates[m] = 0.00;
        }
    }

    return cohortData;
}


// --- API Endpoint ---

app.get('/api/cohort-analytics/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await calculateCohortRetention(parseInt(id));
        res.json(result);
    } catch (error) {
        console.error("Error calculating cohort analytics:", error);
        res.status(500).json({ error: "Failed to calculate cohort retention." });
    }
});


app.listen(PORT, () => {
    console.log(`TrustLance Backend running on http://localhost:${PORT}`);
});