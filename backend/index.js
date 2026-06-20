// Main Node.js server handling API requests, connecting to Prisma and Redis.
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const redis = require('redis').createClient();
const app = express();
const port = 3001;

// Initialize clients
const prisma = new PrismaClient();
redis.connect().catch(console.error);

app.use(express.json());

// --- Skill Badge API Endpoints ---

/**
 * Endpoint to register an off-chain verification proof for an on-chain badge ID.
 * This bridges the world of external skill assessment to the blockchain record.
 * POST /api/badges/verify
 * Body: { tokenId: "...", skillName: "...", verifiedByHash: "..." }
 */
app.post('/api/badges/verify', async (req, res) => {
    const { tokenId, skillName, verifiedByHash } = req.body;

    if (!tokenId || !skillName || !verifiedByHash) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // 1. Check if the badge exists on-chain (Simulated check, in a real app this would involve RPC calls)
        // For demonstration, we rely on Prisma for tracking *recorded* verification events.

        // 2. Record the off-chain proof linking to the ID
        const newRecord = await prisma.SkillBadgeRecord.create({
            data: {
                tokenId: tokenId,
                skillName: skillName,
                isVerified: true, // Assume external hash validation passed for this demo
                contractAddress: "0x...", // Placeholder for actual contract address reference
            }
        });

        // 3. Update cache (Redis)
        await redis.set(`badge:${tokenId}:status`, 'verified');

        res.status(200).json({ message: "Skill badge successfully recorded and verified.", recordId: newRecord.id });

    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ error: "Failed to process verification" });
    }
});


/**
 * Endpoint to fetch details of a specific skill badge.
 * GET /api/badges/:tokenId
 */
app.get('/api/badges/:tokenId', async (req, res) => {
    const { tokenId } = req.params;

    try {
        // 1. Fetch the on-chain mapping (Simulated - requires RPC call in reality)
        // Simulated fetch from a contract layer: Assume Token ID 1 exists and maps to 'Advanced Solidity'
        let skillName = "Unknown Skill";
        let isVerified = false;

        if (tokenId === "12345") { // Example token check
            skillName = "Advanced Solidity Development";
            isVerified = true;
        } else if (tokenId === "67890") {
            skillName = "Web3 Backend Integration";
            isVerified = false;
        }

        // 2. Fetch the off-chain recorded verification status
        const record = await prisma.SkillBadgeRecord.findUnique({
            where: { tokenId: tokenId },
            select: { isVerified: true }
        });


        if (!record) {
            return res.status(404).json({ error: "Badge not found in the system." });
        }

        res.status(200).json({
            tokenId: tokenId,
            skill: skillName,
            isVerified: record.isVerified,
            recordId: record.id
        });

    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ error: "Failed to fetch badge details" });
    }
});


app.listen(port, () => {
    console.log(`TrustLance Backend listening at http://localhost:${port}`);
});