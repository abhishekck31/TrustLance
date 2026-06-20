const express = require('express');
const { PrismaClient } = require('@prisma/client');
const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = 3000;

// Initialize Prisma Client
const prisma = new PrismaClient();

// Initialize Redis Client (for caching recommendations)
const redisClient = redis.createClient();
redisClient.connect(process.env.REDIS_HOST || 'localhost:6379');


app.use(express.json());

// --- AI Recommendation Endpoint ---
/**
 * Endpoint to get AI-generated job recommendations for a specific freelancer.
 * Simulates calling the matching logic (which would typically run in a dedicated microservice or on-chain calculation).
 */
app.get('/api/recommendations/:freelancerId', async (req, res) => {
    const { freelancerId } = req.params;

    try {
        // 1. Fetch Freelancer Profile
        const freelancer = await prisma.freelancer.findUnique({ where: { id: parseInt(freelancerId) } });

        if (!freelancer) {
            return res.status(404).json({ error: 'Freelancer not found' });
        }

        // 2. Simulate AI Matching Logic (The core recommendation step)
        // In a production system, this is where you would query the Vector DB or ML model via Redis/DB.
        const mockRecommendations = [];

        // Mock data based on the contract simulation: we pretend to find jobs and calculate scores.
        mockRecommendations.push({ jobId: 101, score: 95, title: "React Frontend Job" });
        mockRecommendations.push({ jobId: 102, score: 88, title: "Node Backend Role" });

        // Fetch the actual data from DB if needed for final display (omitted for this mock)

        res.json({
            freelancerId: freelancer.id,
            recommendations: mockRecommendations
        });

    } catch (error) {
        console.error("Recommendation error:", error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
});


// --- Dummy API Endpoints for Posting Data (Simulating Blockchain interaction/Data Ingestion) ---

app.post('/api/freelancer', async (req, res) => {
    try {
        const { name, skillSet, ownerAddress } = req.body;
        const newFreelancer = await prisma.freelancer.create({ data: { name, skillSet, ownerAddress } });
        res.status(201).json(newFreelancer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to register freelancer' });
    }
});

app.post('/api/job', async (req, res) => {
     try {
        const { title, description } = req.body;
        // Simulating storing the job details and a placeholder for skill matching index
        const newJob = await prisma.job.create({ data: { title, description } });
        res.status(201).json(newJob);
    } catch (error) {
        res.status(500).json({ error: 'Failed to post job' });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});