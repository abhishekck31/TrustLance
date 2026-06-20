// Node.js/Express server setup with API routes and Prisma integration

import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/health', async (req, res) => {
  try {
    // Fetch the aggregated health data from the database
    const data = await prisma.platformHealthData.findFirst({
      where: { platformName: 'TrustLance Platform' },
    });

    if (!data) {
      return res.status(404).json({ error: 'Platform health data not found.' });
    }

    // Convert BigInts to standard numbers for easier JSON transfer (assuming TVL is scaled appropriately on the backend if needed, or handling large numbers in the client)
    const response = {
      platformName: data.platformName,
      tvl: Number(data.tvl), // Note: Handling large number conversion carefully is crucial in production Web3 APIs.
      totalDisputes: Number(data.totalDisputes),
      completedDisputes: Number(data.completedDisputes),
      completionRate: parseFloat(data.disputeCompletionRate.toFixed(2)),
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching health data:', error);
    res.status(500).json({ error: 'Failed to retrieve platform health metrics.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});