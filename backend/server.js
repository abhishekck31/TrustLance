// Minimal Node.js server setup for demonstration purposes
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Mock Data for the Dashboard Analytics (In a real app, this would come from DB/Blockchain layer)
const mockAnalyticsData = {
    kpis: {
        totalValue: 1543210.98,
        dailyChange: 1.23,
        totalTransactions: 4521
    },
    areaChartData: [
        { date: '2024-01-01', value: 120000 },
        { date: '2024-01-02', value: 135000 },
        { date: '2024-01-03', value: 148000 },
        { date: '2024-01-04', value: 160000 },
        { date: '2024-01-05', value: 1543210.98 }
    ]
};

app.get('/api/analytics', (req, res) => {
    console.log('Request received for analytics data');
    res.json(mockAnalyticsData);
});

app.listen(PORT, () => {
    console.log(`Backend API running on http://localhost:${PORT}`);
});