const express = require('express');
const { PrismaClient } = require('@prisma/client');
const redisClient = require('./redisClient'); // Assume this connects to Redis
const db = new PrismaClient();

const app = express();
const PORT = 3000;

app.use(express.json());

// --- Mock Database/State Management (In a real system, this would be interaction with a blockchain indexer or direct contract calls) ---
async function mockFetchJurorData() {
    // Simulate fetching data that needs payout processing
    return [
        { id: 1, jurorAddress: '0xabc...', awarded: 500 },
        { id: 2, jurorAddress: '0xdef...', awarded: 750 },
    ];
}

/**
 * Automation Endpoint: Triggers the reward distribution process.
 * In a production system, this endpoint would verify off-chain results and then trigger a transaction on-chain.
 */
app.post('/api/payout/distribute/:jurorId', async (req, res) => {
    const { jurorId } = req.params;
    const { amountToDistribute } = req.body;

    if (!jurorId || !amountToDistribute) {
        return res.status(400).json({ error: "Missing jurorId or amount." });
    }

    try {
        // 1. Authorization Check (Mocked security layer)
        // In production, check JWT/API key permissions here.

        // 2. Verification (Mocking validation step where off-chain data is confirmed)
        const mockJuror = await mockFetchJurorData().find(j => j.id === parseInt(jurorId));
        if (!mockJuror) {
            return res.status(404).json({ error: `Juror ID ${jurorId} not found.` });
        }

        // 3. Trigger On-Chain Distribution (This is the automation step)
        // In a real scenario, this would involve signing and sending a transaction to the JurorRewards contract.
        console.log(`[AUTOMATION] Initiating reward distribution for Juror ID ${jurorId}: Amount ${amountToDistribute}`);

        // --- SIMULATION OF CHAIN INTERACTION ---
        // const tx = await provider.sendTransaction({to: '0xContractAddress', data: 'distributeReward(...)', gas: ...});
        
        res.status(200).json({ 
            message: `Successfully triggered payout request for Juror ID ${jurorId}. Check blockchain for execution.`,
            status: 'PENDING_BLOCKCHAIN_EXECUTION'
        });

    } catch (error) {
        console.error("Payout Automation Error:", error);
        res.status(500).json({ error: "Failed to automate reward distribution.", details: error.message });
    }
});


// --- Example for Backend Health Check/Status ---
app.get('/api/payout/status/:jurorId', async (req, res) => {
     const { jurorId } = req.params;
     try {
         // Fetch status directly from blockchain via an indexer or direct RPC call
         // Mocking the result based on the contract structure
         const mockStatus = await db.query(`SELECT awardedAmount, hasClaimed FROM jurors WHERE id = $1`, [parseInt(jurorId)]);
         if (mockStatus.length === 0) {
             return res.status(404).json({ error: "Juror not found." });
         }
         res.json({ jurorId, ...mockStatus[0] });

     } catch (error) {
         res.status(500).json({ error: "Failed to fetch payout status." });
     }
});


// Initialize Redis connection check (Placeholder for actual implementation)
async function startServer() {
    try {
        await db.ping();
        console.log("Database connected successfully.");
        app.listen(PORT, () => {
            console.log(`TrustLance Backend running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Database connection failed:", err);
    }
}

startServer();