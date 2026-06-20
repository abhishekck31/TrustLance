// Main entry point for the Node.js application setup and Express server.
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
  res.status(200).send('TrustLance Security Monitoring Backend is running.');
});

// API Endpoints for Dashboard Data
app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await prisma.securityAlert.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100, // Limit results for dashboard performance
    });
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to retrieve security alerts' });
  }
});

// Monitoring Simulation Endpoint (Simulates receiving blockchain events for logging)
app.post('/api/log-activity', async (req, res) => {
    try {
        const { address, reason, amount, blockchain } = req.body;
        if (!address || !reason || !amount || !blockchain) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        await prisma.securityAlert.create({
            data: { address, reason, amount: BigInt(amount), blockchain }
        });

        res.status(201).json({ message: 'Activity logged successfully' });
    } catch (error) {
        console.error('Error logging activity:', error);
        res.status(500).json({ error: 'Failed to log activity' });
    }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});