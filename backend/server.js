const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Prisma Client
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// --- Mock Blockchain Interaction Functions (Replace with actual Web3 provider calls) ---

/**
 * Mock function to fetch a badge from the blockchain.
 * In a real app, this would use Ethers.js to query the deployed contracts.
 */
async function getBadgeFromChain(tokenId) {
    console.log(`[MOCK] Querying chain for Token ID: ${tokenId}`);
    // Mock data simulating fetching details from the deployed contract
    if (tokenId === 101) {
        return {
            tokenId: 101,
            name: "Advanced Solidity Development",
            description: "Certified expertise in writing secure and complex smart contracts using Rust/Solidity."
        };
    }
    if (tokenId === 102) {
        return {
            tokenId: 102,
            name: "Web3 Frontend Mastery",
            description: "Proficiency in Next.js, React hooks, and Wagmi integration for decentralized applications."
        };
    }
    return null;
}

/**
 * Mock function to check ownership on the blockchain.
 */
async function checkOwnership(tokenId, ownerAddress) {
    console.log(`[MOCK] Checking ownership for Token ID ${tokenId} by ${ownerAddress}`);
    // Mock logic: Assume owner '0x123...' owns token 101 for demonstration
    if (tokenId === 101 && ownerAddress === '0x1234567890abcdef') {
        return true;
    }
    return false;
}

// --- API Endpoints ---

app.get('/api/badges/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const badgeData = await getBadgeFromChain(parseInt(id));

        if (!badgeData) {
            return res.status(404).json({ error: 'Badge not found on chain' });
        }

        // In a real scenario, you would fetch the token metadata from IPFS here if needed
        res.json(badgeData);

    } catch (error) {
        console.error("Error fetching badge:", error);
        res.status(500).json({ error: 'Failed to retrieve badge data' });
    }
});

app.post('/api/verify', async (req, res) => {
    const { tokenId, ownerAddress } = req.body;

    if (!tokenId || !ownerAddress) {
        return res.status(400).json({ error: 'Missing required fields: tokenId and ownerAddress' });
    }

    try {
        const isOwner = await checkOwnership(parseInt(tokenId), ownerAddress);

        if (isOwner) {
            res.json({ verified: true, message: `Certificate for Badge ${tokenId} successfully verified for address ${ownerAddress}.` });
        } else {
            res.status(403).json({ verified: false, message: 'Ownership mismatch. Verification failed.' });
        }
    } catch (error) {
        console.error("Error during verification:", error);
        res.status(500).json({ error: 'Verification process failed' });
    }
});


app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});