const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db'); // Connects to PostgreSQL via Prisma
const metricsRoutes = require('./routes/metricsRoutes');
// const redisClient = require('../config/redis'); // Example Redis setup

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Database Connection Check (Optional but good practice)
connectDB()
    .then(() => {
        console.log('Database connected successfully.');
    })
    .catch(err => {
        console.error('Database connection error:', err);
        process.exit(1);
    });


// Routes
app.use('/api/metrics', metricsRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('TrustLance Backend API is running.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});