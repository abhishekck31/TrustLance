import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { BigInt } from 'bigint';

const prisma = new PrismaClient();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- API Endpoints ---

/**
 * Endpoint to fetch the total treasury holdings.
 */
app.get('/api/treasury/holdings', async (req, res) => {
  try {
    const holdings = await prisma.TreasuryHolding.findMany();
    res.json(holdings);
  } catch (error) {
    console.error('Error fetching holdings:', error);
    res.status(500).json({ error: 'Failed to fetch treasury holdings' });
  }
});

/**
 * Endpoint to fetch all recorded treasury flows.
 */
app.get('/api/treasury/flows', async (req, res) => {
  try {
    const flows = await prisma.TreasuryFlow.findMany();
    res.json(flows);
  } catch (error) {
    console.error('Error fetching flows:', error);
    res.status(500).json({ error: 'Failed to fetch treasury flows' });
  }
});

// Basic health check
app.get('/', (req, res) => {
    res.send('TrustLance DAO Treasury API is running.');
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});