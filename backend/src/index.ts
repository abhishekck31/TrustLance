import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import redisClient from '../redisClient'; // Assume this connects to Redis
import { Listing } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// --- Mock/Integration Layer ---

// Placeholder for connecting to the Web3 contract (Placeholder logic)
const mockContractInteraction = {
    fetchListingsByCategory: async (category: string) => {
        console.log(`Simulating fetching listings for category: ${category} from Blockchain...`);
        // In a real application, this calls an RPC node or uses indexers
        return [
            { id: '1', category: category, title: `Item A in ${category}`, price: 10.5, seller: '0xabc...', isSold: false },
            { id: '2', category: category, title: `Item B in ${category}`, price: 20.0, seller: '0xdef...', isSold: false }
        ];
    },
    createListingOnChain: async (category: string, title: string, price: number) => {
        console.log(`Simulating writing transaction to Blockchain for new listing: ${title}`);
        // Actual interaction with contracts would happen here
        return { success: true, hash: '0xmockhash123' };
    }
};

// --- API Routes ---

app.get('/api/listings/:category', async (req, res) => {
    try {
        const { category } = req.params;
        // Fetch from Blockchain simulation
        const listings = await mockContractInteraction.fetchListingsByCategory(category);
        res.json(listings);
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).json({ error: "Failed to fetch listings" });
    }
});

app.post('/api/listings/create', async (req, res) => {
    try {
        const { category, title, price } = req.body;

        // 1. Interact with Smart Contract (Simulated call)
        const txResult = await mockContractInteraction.createListingOnChain(category, title, parseFloat(price));

        if (txResult.success) {
            // 2. Update local database/index based on contract event simulation
            console.log(`Listing created successfully on chain: ${txResult.hash}`);
            res.status(201).json({ message: "Listing created and indexed.", txHash: txResult.hash });
        } else {
            res.status(500).json({ error: "Transaction failed" });
        }

    } catch (error) {
        console.error("Error creating listing:", error);
        res.status(500).json({ error: "Failed to create listing" });
    }
});


app.post('/api/listings/:id/sell', async (req, res) => {
    try {
        const listingId = parseInt(req.params.id);

        // 1. Interact with Smart Contract (Simulated call)
        console.log(`Attempting to sell listing ${listingId} on chain...`);
        await mockContractInteraction.sellListing(listingId);

        res.json({ message: `Listing ${listingId} successfully marked as sold.` });

    } catch (error) {
        console.error("Error selling listing:", error);
        res.status(400).json({ error: "Failed to execute sale transaction" });
    }
});


app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});