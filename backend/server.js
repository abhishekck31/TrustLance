// Assuming a Node.js/Express setup interacting with PostgreSQL (Prisma) and potentially fetching data from the blockchain via a Web3 provider.
const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const redis = require('redis');

// Placeholder setup - assume connection details for DB and Redis are configured elsewhere.
const prisma = new PrismaClient();
const redisClient = redis.createClient();
redisClient.connect();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// --- Mock Blockchain Interaction Layer ---
// In a real setup, this layer would use web3.js to call the Solidity contract functions.
async function fetchReputationFromChain(userAddress) {
    console.log(`Fetching reputation for ${userAddress} from blockchain...`);
    // Placeholder: Simulate fetching data based on an external oracle or direct RPC call result
    return { score: 15000, lastUpdated: Date.now() }; // Mock response
}

async function calculateDecay(reputationData) {
    const now = Date.now();
    // Actual decay logic is typically done on-chain, but backend might run checks.
    const timeElapsedSeconds = Math.floor((now - reputationData.lastUpdated) / 1000);

    if (timeElapsedSeconds > 0) {
        console.log(`Calculated decay for ${reputationData.score}: Time elapsed ${timeElapsedSeconds}s.`);
        // In a real setup, you would calculate the exact decay based on contract logic or pre-calculate it here.
        // Since we cannot execute the full chain call here, this remains illustrative.
    }
    return reputationData;
}

// --- API Endpoints ---

app.get('/reputation/:address', async (req, res) => {
    const userAddress = req.params.address;
    try {
        // 1. Fetch raw data from the blockchain via an Oracle/Indexer
        const chainData = await fetchReputationFromChain(userAddress);

        // 2. Optionally perform off-chain calculation or caching using Redis
        const calculatedData = await calculateDecay(chainData);

        res.json({
            address: userAddress,
            reputationScore: calculatedData.score,
            lastUpdated: new Date(calculatedData.lastUpdated).toISOString()
        });

    } catch (error) {
        console.error("Error fetching reputation:", error);
        res.status(500).json({ error: "Failed to retrieve reputation data" });
    }
});

app.post('/reputation/update', async (req, res) => {
    const { address, type, amount } = req.body; // type: 'grant' or 'penalize'
    if (!address || !type || !amount) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // In a real application, this would sign and send a transaction to the deployed contract.
        console.log(`Attempting to update ${address}: ${type} of ${amount}`);
        
        // Mock success response
        res.status(200).json({ message: `Transaction initiated for ${address}`, status: 'pending_on_chain' });

    } catch (error) {
        console.error("Error updating reputation:", error);
        res.status(500).json({ error: "Failed to initiate transaction" });
    }
});


app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});