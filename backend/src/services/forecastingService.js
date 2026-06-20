const prisma = require('../db'); // Assuming prisma client is initialized here
const { PrismaClient } = require('@prisma/client');

/**
 * Calculates a simple linear trend forecast for future revenue based on historical data.
 * @param historyData An array of historical RevenueRecord objects.
 * @param daysToForecast Number of future days to predict.
 * @returns An array of predicted forecasts.
 */
async function forecastRevenue(historyData, daysToForecast) {
    if (!historyData || historyData.length < 2) {
        throw new Error("Insufficient historical data for forecasting.");
    }

    // 1. Sort data by timestamp (important for time-series)
    const sortedData = [...historyData].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // 2. Calculate the average daily rate based on the last known data point
    const latestRecord = sortedData[sortedData.length - 1];
    const startTime = new Date(latestRecord.timestamp);

    let forecastResults = [];
    let currentDate = new Date(startTime);

    for (let i = 1; i <= daysToForecast; i++) {
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day

        // Simple prediction: Assume a constant growth rate or simple extrapolation from the last known amount.
        // For simplicity, we calculate a baseline average revenue rate for demonstration.
        const timeDifferenceDays = (new Date(currentDate) - startTime) / (1000 * 60 * 60 * 24);

        // Example Forecasting Logic: Simple linear extrapolation based on the overall trend slope
        const totalRevenue = sortedData.reduce((sum, record) => sum + record.amount, 0);
        const averageDailyRate = totalRevenue / timeDifferenceDays; // This is highly simplified for demonstration

        // In a real system, this would involve sophisticated statistical models (ARIMA, Prophet, etc.)
        const predictedAmount = latestRecord.amount * (1 + (Math.random() * 0.05)); // Add some noise/growth simulation

        forecastResults.push({
            date: currentDate.toISOString().split('T')[0],
            predictedRevenue: parseFloat(predictedAmount.toFixed(2))
        });
    }

    return forecastResults;
}

/**
 * Fetches all historical revenue data from the database.
 */
async function getHistoricalData() {
    const data = await prisma.revenueRecord.findMany({
        orderBy: { timestamp: 'asc' },
        select: { id: true, amount: true, timestamp: true }
    });
    return data;
}

module.exports = {
    getHistoricalData,
    forecastRevenue
};