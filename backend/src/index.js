// Main entry point for the backend service, setting up Express and Redis connections.
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const redis = require('redis');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

// --- Redis Setup (For caching or queueing payout triggers) ---
const redisClient = redis.createClient();
redisClient.on('error', (err) => console.error('Redis Client Error', err));
await redisClient.connect();

// Middleware
app.use(express.json());

// --- API Routes ---

/**
 * Endpoint to trigger the automated reward distribution process.
 * This simulates an off-chain service calling or monitoring on-chain events 
 * and triggering state changes if necessary, or initiates a manual final step.
 */
app.post('/api/payout/trigger/:jurorId', async (req, res) => {
    const { jurorId } = req.params;
    const jurorIdNum = parseInt(jurorId);

    if (isNaN(jurorIdNum)) {
        return res.status(400).json({ error: "Invalid Juror ID provided." });
    }

    console.log(`Attempting to trigger payout for Juror ID: ${jurorIdNum}`);

    try {
        // 1. Check Off-Chain State (Prisma/DB) - Verification step
        // In a production system, this step would involve reading the current status from PostgreSQL
        // and ensuring the on-chain state matches or processing external verification logs.
        const offChainData = await prisma.jurorPayouts.findUnique({ where: { jurorId: jurorIdNum } });

        if (!offChainData) {
             return res.status(404).json({ message: `Juror ID ${jurorIdNum} record not found on backend.` });
        }

        // 2. Initiate On-Chain Call (Simulated Automation Step)
        // This step would typically involve signing a transaction using a private key (e.g., from a service wallet)
        // to call the 'distributeReward' function on the JurorRewards contract.
        console.log(`Successfully verified state. Preparing transaction for on-chain payout of ${offChainData.rewardAmount} for ID ${jurorIdNum}.`);

        // --- REAL AUTOMATION NOTE ---
        // In a fully automated system, this block would use ethers/web3.js to sign and send the transaction:
        /*
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI);
        const tx = await contract.distributeReward(jurorIdNum, { value: offChainData.rewardAmount });
        await tx.wait();
        */

        res.status(200).json({ 
            message: `Payout automation initiated successfully for Juror ID ${jurorIdNum}. Check blockchain for final transaction status.`,
            requiredAction: 'Manual block confirmation or external bridge verification needed for actual token transfer.'
        });

    } catch (error) {
        console.error("Error during payout trigger:", error);
        res.status(500).json({ error: "Failed to process payout trigger.", details: error.message });
    }
});


// --- Start Server ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`TrustLance Backend running on http://localhost:${PORT}`);
    console.log("Ready to automate Juror Reward Distribution.");
});