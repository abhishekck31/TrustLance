const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const redis = require('redis');

// Initialize Prisma Client (assuming setup is done)
const prisma = new PrismaClient();

// Initialize Redis Client
const redisClient = redis.createClient();
redisClient.connect();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// --- Mock Data/State Management (In a real scenario, this would interact heavily with the DB and Blockchain) ---

// Mock function to simulate W/P submission logging
async function submitProofOfWork(projectId, proofHash) {
    console.log(`[PoW Submission] Project ID: ${projectId}, Hash: ${proofHash}`);
    // In a real system, this would trigger an off-chain computation or connect to a mining pool result.
    return { success: true, message: "Proof submitted successfully." };
}

// API Endpoint 1: Simulate Project Completion and PoW linking
app.post('/api/project/:id/complete', async (req, res) => {
    const projectId = parseInt(req.params.id);
    const { proofHash } = req.body;

    if (!proofHash) {
        return res.status(400).json({ error: "Proof hash is required." });
    }

    try {
        // 1. Simulate off-chain PoW validation/submission logging (using backend data store)
        const poWResult = await submitProofOfWork(projectId, proofHash);

        // 2. In a real application, this is where you would trigger a transaction to update the smart contract state.
        // For this demo, we assume the blockchain interaction happens elsewhere or via a dedicated service layer.
        console.log(`Successfully logged PoW for Project ${projectId}: ${poWResult.message}`);

        res.status(200).json({ message: "Project proof accepted and linked.", projectId });
    } catch (error) {
        console.error("Error during PoW submission:", error);
        res.status(500).json({ error: "Failed to process Proof of Work." });
    }
});

// API Endpoint 2: Fetch Project Status
app.get('/api/project/:id/status', async (req, res) => {
    const projectId = parseInt(req.params.id);
    try {
        // Simulate fetching blockchain data or DB state about the project NFT
        const status = await prisma.project?.findUnique({ where: { id: projectId } });

        if (!status) {
            return res.status(404).json({ error: "Project not found." });
        }

        // Mocking the on-chain check result based on stored data or a hypothetical RPC call
        const isCompleted = status.isCompleted || false;

        res.json({
            projectId: projectId,
            status: isCompleted ? 'Completed' : 'Pending',
            proofHash: status.proofHash
        });

    } catch (error) {
        console.error("Error fetching project status:", error);
        res.status(500).json({ error: "Failed to retrieve project status." });
    }
});


// Start Server
app.listen(PORT, async () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    await redisClient.quit();
});