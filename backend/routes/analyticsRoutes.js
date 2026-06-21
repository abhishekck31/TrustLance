const express = require('express');
const router = express.Router();
const revenueService = require('../services/revenueService');

// Endpoint for fetching aggregated MRR metrics
router.get('/mrr-analytics', async (req, res) => {
    try {
        // Default to calculating the last 12 months of data
        const months = parseInt(req.query.months) || 12;

        if (isNaN(months) || months <= 0) {
            return res.status(400).json({ error: "Invalid number of months specified." });
        }

        console.log(`Calculating MRR for the last ${months} months.`);
        const analyticsData = await revenueService.getMonthlyRevenueAnalytics(months);

        res.json({
            success: true,
            data: analyticsData,
            message: `Successfully calculated MRR for ${analyticsData.length} months.`
        });

    } catch (error) {
        console.error('Error fetching MRR analytics:', error);
        res.status(500).json({ success: false, error: 'Failed to retrieve revenue analytics.' });
    }
});

module.exports = router;