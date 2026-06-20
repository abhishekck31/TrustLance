// Main entry point for the Node.js/Express server
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { RedisClientType } from 'redis';
import { createClient } from 'redis';

const app = express();
const PORT = 3000;

// Database and Cache Clients
const prisma = new PrismaClient();

// Redis Setup (Mock setup for demonstration)
let redisClient: RedisClientType | null = null;

async function setupRedis() {
    try {
        // In a real app, this would connect to Redis. We mock the client creation here.
        redisClient = createClient({
            // Use connection details from environment variables in production
        });
        await redisClient.connect();
        console.log('Successfully connected to Redis.');
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
}

async function startServer() {
    await setupRedis();

    app.use(cors());
    app.use(express.json());

    // --- API Routes ---

    // 1. Get Listings by Category
    app.get('/listings/category/:category', async (req, res) => {
        const { category } = req.params;
        try {
            const listings = await prisma.Listing.findMany({
                where: { categoryName: category, status: 'active' },
                include: { user: true }
            });
            res.json(listings);
        } catch (error) {
            console.error("Error fetching listings:", error);
            res.status(500).json({ error: "Failed to retrieve listings" });
        }
    });

    // 2. Get All Listings
    app.get('/listings', async (req, res) => {
        try {
            const listings = await prisma.Listing.findMany({
                include: { user: true }
            });
            res.json(listings);
        } catch (error) {
            console.error("Error fetching all listings:", error);
            res.status(500).json({ error: "Failed to retrieve all listings" });
        }
    });

    // 3. Create Listing (Seller Action)
    app.post('/listings', async (req, res) => {
        try {
            const { title, categoryName, price, sellerAddress } = req.body;
            if (!title || !categoryName || typeof price === 'undefined' || !sellerAddress) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const newListing = await prisma.Listing.create({
                data: {
                    title,
                    categoryName,
                    price: parseFloat(price),
                    sellerAddress,
                },
            });
            res.status(201).json(newListing);
        } catch (error) {
            console.error("Error creating listing:", error);
            res.status(500).json({ error: "Failed to create listing" });
        }
    });

    // 4. Mock Transaction Logic (Placeholder for Web3 interaction hook)
     app.post('/listings/:id/buy', async (req, res) => {
         const { id } = req.params;
         try {
             const listing = await prisma.Listing.findUnique({ where: { id: parseInt(id) } });

             if (!listing) {
                 return res.status(404).json({ error: "Listing not found" });
             }

             // In a real application, this is where you would verify the transaction on-chain via Web3 provider
             if (listing.status === 'active') {
                // Mock successful purchase status update
                await prisma.Listing.update({
                    where: { id: parseInt(id) },
                    data: { status: 'sold' }
                });
                res.json({ message: `Listing ${id} successfully marked as sold via backend mock.` });
             } else {
                 res.status(400).json({ error: "Listing is already sold or invalid." });
             }

         } catch (error) {
             console.error("Error processing purchase:", error);
             res.status(500).json({ error: "Purchase failed" });
         }
     });


    app.listen(PORT, async () => {
        console.log(`Server running on http://localhost:${PORT}`);
        // Ensure Redis is initialized before starting the HTTP server fully if it blocks initialization
    });
}

startServer().catch(err => {
    console.error("Server failed to start:", err);
});