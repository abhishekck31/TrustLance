import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
    res.status(200).send('TrustLance Security Backend Running');
});

// Dashboard Endpoints
app.get('/api/suspicious-activities', async (req, res) => {
    try {
        const activities = await prisma.suspiciousActivity.findMany({
            orderBy: { timestamp: 'desc' }
        });
        res.json(activities);
    } catch (error) {
        console.error("Error fetching suspicious activities:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// Example endpoint for adding simulated data (for testing purposes)
app.post('/api/activities', async (req, res) => {
    try {
        const { userAddress, amount, reason } = req.body;
        if (!userAddress || !amount || !reason) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newActivity = await prisma.suspiciousActivity.create({
            data: {
                userAddress: userAddress,
                amount: BigInt(amount), // Ensure amount is stored as BigInt
                reason: reason,
            }
        });
        res.status(201).json(newActivity);

    } catch (error) {
        console.error("Error adding activity:", error);
        res.status(500).json({ error: "Failed to record activity" });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});