const express = require('express');
const router = express.Router();
const forecastingService = require('../services/forecastingService');

/**
 * Route to fetch historical data and generate a revenue forecast.
 * GET /api/forecast?days=30
 */
router.get('/forecast', async (req, res) => {
    try {
        const daysToForecast = parseInt(req.query.days) || 30;

        // 1. Fetch data
        const historyData = await forecastingService.getHistoricalData();

        if (historyData.length === 0) {
            return res.status(404).json({ message: "No historical revenue data found." });
        }

        // 2. Perform forecast calculation
        const forecast = await forecastingService.forecastRevenue(historyData, daysToForecast);

        // 3. Return result
        res.json({
            daysRequested: daysToForecast,
            forecast: forecast
        });

    } catch (error) {
        console.error("Forecasting error:", error);
        res.status(500).json({ error: "Failed to generate revenue forecast", details: error.message });
    }
});

module.exports = router;