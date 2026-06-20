import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import analyticsRoutes from '../routes/analyticsRoutes';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/analytics', analyticsRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Revenue Analytics Backend running on http://localhost:${PORT}`);
});