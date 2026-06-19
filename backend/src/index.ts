// Main entry point for the backend application (Express server setup)
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { RedisClientType } from 'redis'; // Assuming redis client import structure
import { Redis } from 'redis';

const app = express();
const prisma = new PrismaClient();

// Initialize Redis connection (mock setup)
// In a real application, this would establish the actual connection.
const redisClient: Redis = {
    set: async (key: string, value: string) => console.log(`[Redis] SET ${key}: ${value}`),
    get: async (key: string) => console.log(`[Redis] GET ${key}: nil`),
};


app.use(express.json());

// --- Dispute Endpoints ---

/**
 * POST /api/disputes/initiate
 * Initiates a dispute (Simulates backend preparation before on-chain call).
 */
app.post('/api/disputes/initiate', async (req, res) => {
    try {
        const { assetOwner, amount, reason } = req.body;

        if (!assetOwner || !amount || !reason) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // 1. Simulate check/validation (In production, this would involve verifying signatures or external state)
        console.log(`Backend received dispute request for owner ${assetOwner}: amount ${amount}`);

        // 2. Store the intent off-chain in PostgreSQL (for audit trail synchronization)
        const newDispute = await prisma.Dispute.create({
            data: {
                disputeId: Date.now(), // Placeholder, actual ID should be derived from blockchain interaction later
                assetOwner: assetOwner.toString(),
                amount: BigInt(amount),
                disputeReason: reason,
                isFrozen: true,
            }
        });

        // 3. Simulate triggering the on-chain freeze (This step assumes an external service handles the actual blockchain interaction)
        console.log(`Dispute intent recorded in DB. Ready to trigger smart contract call for freezing.`);
        
        res.status(201).json({ message: "Dispute initiated successfully", disputeData: newDispute });

    } catch (error) {
        console.error("Error initiating dispute:", error);
        res.status(500).json({ error: "Failed to initiate dispute" });
    }
});


/**
 * GET /api/disputes/:id/status
 * Retrieves the status of a specific dispute (State read from DB/Oracle).
 */
app.get('/api/disputes/:id/status', async (req, res) => {
    const disputeId = parseInt(req.params.id);

    if (isNaN(disputeId)) {
        return res.status(400).json({ error: "Invalid Dispute ID" });
    }

    try {
        // Retrieve state from PostgreSQL
        const dispute = await prisma.Dispute.findUnique({
            where: { disputeId: disputeId },
            select: { id: true, assetOwner_assetOwner: true, amount: true, isFrozen: true, disputeReason: true }
        });

        if (!dispute) {
            return res.status(404).json({ error: "Dispute not found" });
        }

        res.status(200).json(dispute);

    } catch (error) {
        console.error("Error fetching dispute status:", error);
        res.status(500).json({ error: "Failed to fetch dispute status" });
    }
});


// --- Start Server ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log("Backend Dispute API operational.");
});