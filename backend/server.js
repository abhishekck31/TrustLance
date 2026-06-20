// Basic Express server setup for administrative endpoints.
import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { ethers } from 'ethers';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// --- Mock Web3 Interaction Layer ---
// In a real setup, this would connect to an RPC provider (e.g., Alchemy/Infura)
let mockContractInstance = null;

/**
 * Simulates fetching the current fee from the blockchain.
 */
async function fetchOnChainFee() {
    try {
        // Placeholder: In a live scenario, use ethers.js to read from the deployed contract address.
        console.log("Simulating fetching on-chain data...");
        return 100; // Mock value based on backend data synchronization expectation
    } catch (error) {
        console.error("Error reading mock blockchain data:", error);
        return null;
    }
}

/**
 * Simulates calling the contract to set a new fee.
 */
async function callSetFeeOnChain(newFeeBPS) {
    if (!mockContractInstance) {
        throw new Error("Contract instance is not initialized.");
    }
    console.log(`Simulating transaction: Calling setFee(${newFeeBPS}) on chain.`);
    // Real implementation would use: await mockContractInstance.setFee(newFeeBPS);
    return true;
}
// ------------------------------------


// --- API Endpoints ---

/**
 * GET /api/config - Fetch the platform configuration.
 */
app.get('/api/config', async (req, res) => {
    try {
        const config = await prisma.platformConfig.findUnique({
            where: { id: 1 }, // Assuming ID 1 for the main config
        });

        if (!config) {
            return res.status(404).json({ error: "Configuration not found" });
        }

        // Simulate fetching potentially updated state from the blockchain for display
        const onChainFee = await fetchOnChainFee();
        res.json({
            backendConfig: config,
            onChainFeeBPS: onChainFee // Displaying the synchronized state
        });

    } catch (error) {
        console.error("Error fetching config:", error);
        res.status(500).json({ error: "Failed to retrieve configuration" });
    }
});


/**
 * POST /api/update-fee - Endpoint to trigger a dynamic fee update transaction.
 */
app.post('/api/update-fee', async (req, res) => {
    const { newFeeBPS } = req.body;

    if (!newFeeBPS || typeof newFeeBPS !== 'number') {
        return res.status(400).json({ error: "Invalid input: newFeeBPS is required." });
    }

    try {
        // 1. Trigger the on-chain transaction (Simulated)
        const success = await callSetFeeOnChain(newFeeBPS);

        if (!success) {
             return res.status(500).json({ error: "Failed to execute blockchain transaction." });
        }


        // 2. Update the off-chain persistence (Prisma)
        await prisma.platformConfig.update({
            where: { id: 1 },
            data: {
                feeBPS: newFeeBPS,
                updatedAt: new Date(),
            }
        });

        res.status(200).json({
            message: "Fee successfully updated and reflected on-chain.",
            newFeeBPS: newFeeBPS
        });

    } catch (error) {
        console.error("Error updating fee:", error);
        res.status(500).json({ error: "Failed to update platform fee" });
    }
});


app.listen(PORT, () => {
    console.log(`Platform Fee Engine Backend running on http://localhost:${PORT}`);
});