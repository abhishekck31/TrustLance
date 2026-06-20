import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupRedis } from './redis'; // Placeholder for Redis integration

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Setup Middleware
app.use(cors());
app.use(express.json());

// Initialize Redis (Placeholder)
setupRedis();

// --- API Routes ---

// Category Routes
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: { listings: true }
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

app.get('/api/listings/:id', async (req, res) => {
    try {
        const listing = await prisma.listing.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { category: true }
        });
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        res.json(listing);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch listing' });
    }
});

app.post('/api/listings', async (req, res) => {
    try {
        const { title, categoryId, price, sellerAddress } = req.body;
        const listing = await prisma.listing.create({
            data: {
                title,
                categoryId: parseInt(categoryId),
                price: parseFloat(price),
                sellerAddress,
                status: 'Active'
            }
        });
        res.status(201).json(listing);
    } catch (error) {
        console.error("Error creating listing:", error);
        res.status(400).json({ error: 'Failed to create listing' });
    }
});

app.post('/api/listings/:id/sell', async (req, res) => {
    try {
        const { buyerAddress } = req.body;
        // In a real scenario, this requires wallet signature verification or on-chain execution checks
        const updatedListing = await prisma.listing.update({
            where: { id: parseInt(req.params.id) },
            data: { status: 'Sold' }
        });
        res.json({ message: `Listing ${req.params.id} successfully marked as Sold by ${buyerAddress}`, listing: updatedListing });
    } catch (error) {
        res.status(400).json({ error: 'Failed to mark item as sold' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Placeholder for Redis setup logic (in a separate file)
function setupRedis() {
    console.log("Redis connection initialized (Mock).");
}