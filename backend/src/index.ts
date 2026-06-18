import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { db } from './db';
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes';
import transactionRoutes from './routes/transactionRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // For parsing application/json

// Database connection check (optional, but good practice)
try {
    await db.$queryRaw`SELECT 1`
    console.log('Database connection successful.');
} catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
}


// --- Router Setup ---

// Wallet Authentication Routes
app.use('/api/auth', authRoutes);

// Job Management Routes
app.use('/api/jobs', jobRoutes);

// Transaction Tracking Routes
app.use('/api/transactions', transactionRoutes);


// Root Route
app.get('/', (req, res) => {
  res.send('TrustLance Backend API is running.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});