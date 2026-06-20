import { Router } from 'express';
import { getRevenueAnalytics, getHistoricalData } from '../services/revenueService';

const router = Router();

/**
 * GET /api/analytics/monthly/:year/:month
 * Calculates MRR and key metrics for a specific month.
 */
router.get('/monthly/:year/:month', async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        const month = parseInt(req.params.month);

        if (isNaN(year) || isNaN(month)) {
            return res.status(400).json({ error: "Invalid year or month provided." });
        }

        const data = await getRevenueAnalytics(year, month);
        res.json(data);
    } catch (error) {
        console.error("API Error in /monthly route:", error);
        res.status(500).json({ error: "Internal server error during analytics calculation." });
    }
});

/**
 * GET /api/analytics/historical?start=YYYY-MM-DD&end=YYYY-MM-DD
 * Fetches raw subscription data for charting historical trends.
 */
router.get('/historical', async (req, res) => {
    try {
        const { start, end } = req.query;

        if (!start || !end) {
            return res.status(400).json({ error: "Start and end dates are required." });
        }

        // Basic date validation (assuming YYYY-MM-DD format for simplicity in this route layer)
        const startDate = new Date(start);
        const endDate = new Date(end);

        if (isNaN(startDate) || isNaN(endDate)) {
            return res.status(400).json({ error: "Invalid date format provided." });
        }


        const data = await getHistoricalData(startDate, endDate);
        res.json(data);

    } catch (error) {
        console.error("API Error in /historical route:", error);
        res.status(500).json({ error: "Failed to fetch historical data." });
    }
});

export default router;