const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client
const prisma = new PrismaClient();

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// --- Import the AI Analysis Routes ---
const analyzeEvidenceRoutes = require('./routes/analysisRoutes');
app.use('/api', analyzeEvidenceRoutes);

// Root route for health check
app.get('/', (req, res) => {
    res.send('TrustLance Dispute Analyzer Backend Running.');
});


// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});

// Note: In a full setup, you would separate routes into their own files (as done in the next file).