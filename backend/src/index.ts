import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/hiring', async (req, res) => {
  try {
    const opportunities = await prisma.HiringOpportunity.findMany({
      where: { isActive: true },
      orderBy: { postedDate: 'desc' }
    });
    res.json(opportunities);
  } catch (error) {
    console.error('Error fetching hiring opportunities:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

// Ensure Prisma client is initialized if this is the main entry point setup
// (In a typical Next.js/Express monorepo setup, this file might be integrated into the main server file)
export default app;