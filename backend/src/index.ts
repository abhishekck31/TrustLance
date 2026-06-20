import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const prisma = new PrismaClient();
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// --- API Routes for Freelancer Discovery Engine ---

/**
 * GET /api/freelancers?skill=X&location=Y&minRating=Z
 * Advanced search and filtering endpoint.
 */
app.get('/api/freelancers', async (req, res) => {
  const { skill, location, minRating } = req.query;

  let whereClause: string[] = [];
  let whereConditions: Record<string, any> = {};

  // 1. Skill Filter
  if (skill) {
    whereClause.push(`primarySkill LIKE ${'%' + skill + '%'}`);
  }

  // 2. Location Filter (Assuming location is stored in bio or added to schema later for true filtering)
  if (location) {
    whereClause.push(`bio LIKE ${'%' + location + '%'}`);
  }

  // 3. Rating Filter
  if (minRating) {
    const minRatingInt = parseInt(minRating, 10);
    whereClause.push(`rating >= ${minRatingInt}`);
  }

  let query = `SELECT * FROM "Freelancer" WHERE TRUE`;
  let conditions: string[] = [];
  let args: any[] = [];

  if (whereClause.length > 0) {
    // Dynamically build the WHERE clause using Prisma's safer parameterized query style if possible,
    // or fall back to simple string interpolation for demonstration clarity in this setup.
    // NOTE: For production, true dynamic WHERE clause construction must use Prisma's methods (where: {}).
    for (const clause of whereClause) {
        conditions.push(clause);
    }
    query += ` AND ${conditions.join(' AND ')}`;
  }


  try {
    // Fetching data from the PostgreSQL backend
    const freelancers = await prisma.freelancer.findMany({
      where: {
        // Apply dynamic filtering based on query parameters
        ...(skill && { primarySkill: { contains: skill } }), // Hypothetical "contains" operation for demonstration, actual Prisma requires explicit operators
        ...(location && { bio: { contains: location } }),
        ...(minRating && { rating: { gte: parseInt(minRating) } }),
      },
      select: {
        id: true,
        name: true,
        primarySkill: true,
        bio: true,
        rating: true,
        totalProjectsCompleted: true
      }
    });

    res.json(freelancers);

  } catch (error) {
    console.error("Error fetching freelancers:", error);
    res.status(500).json({ error: "Failed to retrieve freelancer data" });
  }
});


app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});