import { Router } from 'express';
import { getMRRAnalytics } from '../services/revenueService';

const router = Router();

/**
 * Route to calculate and return MRR metrics for a specific user.
 * GET /api/analytics/mrr/:userId
 */
router.get('/mrr/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // In a real application, authentication middleware would be applied here
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    const analytics = await getMRRAnalytics(userId);
    res.status(200).json(analytics);

  } catch (error) {
    console.error('Error calculating MRR analytics:', error);
    res.status(500).json({ error: 'Failed to calculate revenue analytics' });
  }
});


/**
 * Route to calculate total historical revenue for a given date range.
 * GET /api/analytics/revenue/:startDate/:endDate
 */
router.get('/revenue/:startDate/:endDate', async (req, res) => {
    try {
        const { startDate, endDate } = req.params;

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        const revenue = await calculateRevenuePeriod(start, end);

        res.status(200).json({
            startDate: start.toISOString(),
            endDate: end.toISOString(),
            totalRevenue: revenue,
        });

    } catch (error) {
        console.error('Error calculating revenue period:', error);
        res.status(500).json({ error: 'Failed to retrieve revenue data' });
    }
});


export default router;