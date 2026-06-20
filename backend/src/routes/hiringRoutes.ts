import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Router as ExpressRouter } from 'express';

const router: ExpressRouter = Router();
const prisma = new PrismaClient();

// GET /api/hiring - Fetch all public hiring opportunities
router.get('/', async (req, res) => {
  try {
    const opportunities = await prisma.hiringOpportunity.findMany({
      where: { isPublic: true },
      orderBy: { postedAt: 'desc' },
    });
    res.status(200).json(opportunities);
  } catch (error) {
    console.error('Error fetching hiring opportunities:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

export default router;

[FILE: backend/src/routes/index.ts]
import express from 'express';
import hiringRoutes from './hiringRoutes';

const indexRouter = Router();

// Use the specific hiring routes
indexRouter.use('/api/hiring', hiringRoutes);

export default indexRouter;

[FILE: backend/src/server.ts]
import express from 'express';
import dotenv from 'dotenv';
import indexRouter from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use(indexRouter);

// Basic root route
app.get('/', (req, res) => {
  res.send('TrustLance Backend API is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});