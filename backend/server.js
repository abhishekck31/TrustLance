const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./lib/db'); // Assumes this handles Prisma client setup
const analyticsRoutes = require('./routes/analyticsRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database (Prisma)
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/analytics', analyticsRoutes);

// Basic Root Route
app.get('/', (req, res) => {
    res.send('TrustLance Revenue Analytics API Running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});