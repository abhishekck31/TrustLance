import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { setupRedis } from "./redisSetup"; // Assume this handles Redis connection
import { Prisma } from "@prisma/client";

const app = express();
const PORT = 3001;

// Initialize Prisma Client
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// --- Mock Redis Setup (For future caching/rate limiting) ---
const redisClient = setupRedis(); // Placeholder function assumed to exist

// --- Discovery Endpoints ---

/**
 * Endpoint for discovering freelancers based on search criteria.
 * Supports basic filtering on name and skill.
 */
app.get("/api/freelancers", async (req, res) => {
    const { searchName, searchSkill } = req.query;

    let whereClause: string = "";
    const whereConditions: { [key: string]: string | number } = {};

    if (searchName) {
        whereConditions.name = { contains: searchName }; // Using PostgreSQL LIKE for simplicity if native support is complex, or full-text search in production.
        whereClause += "name ILIKE $1 ";
        // NOTE: In a real setup, we would use Prisma's raw query or specific DB indexing for efficient text search.
    }

    if (searchSkill) {
        whereConditions.skill = { contains: searchSkill };
        whereClause += "skill ILIKE $2 ";
    }

    let query: Prisma.FreelancerGetPayload<typeof prisma.freelancer.findMany>;
    let where: any = {};
    let args: any[] = [];

    if (Object.keys(whereConditions).length > 0) {
        where = whereConditions;
        args = [searchName ? '%' + searchName + '%' : null, searchSkill ? '%' + searchSkill + '%' : null];
    }


    try {
        const freelancers = await prisma.freelancer.findMany({
            where: where,
            select: { id: true, name: true, skill: true, rating: true },
            // Order by relevance or rating for discovery
            orderBy: [{ name: 'asc' }, { rating: 'desc' }]
        });

        res.json(freelancers);

    } catch (error) {
        console.error("Error fetching freelancers:", error);
        res.status(500).json({ error: "Failed to discover freelancers" });
    }
});


/**
 * Endpoint for retrieving a single freelancer profile by ID.
 */
app.get("/api/freelancer/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const freelancer = await prisma.freelancer.findUnique({
            where: { id: id },
            select: {
                name: true,
                bio: true,
                skill: true,
                rating: true,
                address: true, // Include address for Web3 context
            }
        });

        if (!freelancer) {
            return res.status(404).json({ error: "Freelancer not found" });
        }

        res.json(freelancer);
    } catch (error) {
        console.error("Error fetching freelancer:", error);
        res.status(500).json({ error: "Failed to retrieve profile" });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Placeholder for redisSetup implementation (to avoid build errors)
function setupRedis() {
    // In a real scenario, this would set up the Redis connection pool.
    return {
        set: (key, value) => console.log(`[Redis Mock] SET ${key} to ${value}`),
        get: (key) => Promise.resolve(null),
        // Add other necessary methods
    };
}