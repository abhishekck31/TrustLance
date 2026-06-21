// Main entry point for the Node.js/Express application. Setup basic structure and mock API logic for demonstration.
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Mock Data/API Endpoints for Talent System ---

/**
 * Endpoint to simulate fetching all featured talents from the blockchain state.
 * In a real application, this would involve web3 providers (ethers.js) polling or indexing services (The Graph).
 */
app.get('/api/talents/featured', async (req, res) => {
    try {
        // Placeholder: In production, we would call an Ethers.js contract reader here.
        // Mocking the data response for demonstration purposes.
        const featuredData = [
            { id: "talent-123", name: "Alice Dev", tier: 2, owner: "0xTalentOwner1" },
            { id: "talent-456", name: "Bob Artist", tier: 2, owner: "0xTalentOwner2" }
        ];

        res.json(featuredData);
    } catch (error) {
        console.error("Error fetching featured talents:", error);
        res.status(500).json({ error: "Failed to retrieve featured talent data" });
    }
});

/**
 * Endpoint to fetch a single talent's details, including featured status.
 */
app.get('/api/talent/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Mocking data retrieval from the contract state
        const mockTalent = {
            id: id,
            name: "Mock Talent Name",
            description: "This is a premium talent profile.",
            isFeatured: true, // Example feature status
            featuredTier: 2,
            owner: "0xTalentOwner1"
        };

        res.json(mockTalent);
    } catch (error) {
        res.status(404).json({ error: "Talent not found" });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Prisma Sync/Seed would typically run here in a full setup.
// await prisma.$connect();