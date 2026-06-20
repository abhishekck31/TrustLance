import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// --- Freelancer Discovery Routes ---

/**
 * GET /api/freelancers
 * Retrieves all freelancers (basic listing)
 */
app.get('/api/freelancers', async (req, res) => {
  try {
    const freelancers = await prisma.freelancer.findMany({
      select: { id: true, name: true, rating: true, bio: true },
      where: { isActive: true }
    });
    res.json(freelancers);
  } catch (error) {
    console.error("Error fetching freelancers:", error);
    res.status(500).json({ error: 'Failed to retrieve freelancers' });
  }
});

/**
 * GET /api/freelancers/search
 * Advanced search and filtering functionality.
 * Example usage: ?name=John&minRating=4&category=WebDev
 */
app.get('/api/freelancers/search', async (req, res) => {
  const { name, minRating, category } = req.query;

  try {
    let whereClause: any = {};

    if (name) {
      whereClause.name = { contains: name, mode: 'insensitive' };
    }
    if (minRating) {
      whereClause.rating = { gte: parseInt(minRating) };
    }
    if (category) {
      whereClause.category = category;
    }

    const freelancers = await prisma.freelancer.findMany({
      where: whereClause,
      select: { id: true, name: true, rating: true, bio: true }
    });

    res.json(freelancers);

  } catch (error) {
    console.error("Error during freelancer search:", error);
    res.status(500).json({ error: 'Failed to perform search' });
  }
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});