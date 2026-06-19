// Main entry point for the Node.js Express application, integrating routes.

const express = require('express');
const dotenv = require('dotenv');
const jobRoutes = require('./routes/jobRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // To parse JSON bodies

// Route Registration
app.get('/', (req, res) => {
    res.send('TrustLance Backend API is running.');
});

// Register Job Routes
app.use('/api/job', jobRoutes);


// Start Server
app.listen(PORT, () => {
    console.log(`✅ TrustLance Backend running on port ${PORT}`);
    console.log("AI Job Scammer Evaluation Endpoint available at /api/job/analyze");
});

/* 
Note: In a full production setup, this file would also handle database connections (Prisma) 
and Redis integration for caching, but it is scoped here for API routing demonstration.
*/