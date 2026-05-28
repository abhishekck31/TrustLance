require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { ethers } = require('ethers');
const { PrismaClient } = require('@prisma/client');
const { createClient } = require('redis');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Redis Setup (Mock/Basic for now)
let redisClient;
(async () => {
    try {
        redisClient = createClient({ url: process.env.REDIS_URL });
        redisClient.on('error', (err) => console.error('Redis Client Error', err));
        await redisClient.connect();
        console.log("Connected to Redis");
    } catch (e) {
        console.log("Redis not available, skipping...");
    }
})();

// Basic API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Fetch all cached jobs
app.get('/api/jobs', async (req, res) => {
    try {
        const jobs = await prisma.job.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Blockchain Event Indexing setup (Ethers.js)
function setupBlockchainListeners() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "https://rpc-amoy.polygon.technology");
    const contractAddress = process.env.ESCROW_ADDRESS;
    
    if (!contractAddress) {
        console.log("Skipping blockchain listeners: ESCROW_ADDRESS not set in .env");
        return;
    }

    // ABI snippet for events
    const abi = [
        "event JobCreated(uint256 indexed jobId, address indexed client, address indexed freelancer, uint256 totalAmount)"
    ];

    const escrowContract = new ethers.Contract(contractAddress, abi, provider);

    escrowContract.on("JobCreated", async (jobId, client, freelancer, totalAmount, event) => {
        console.log(`New Job Created! ID: ${jobId}, Client: ${client}`);
        try {
            await prisma.job.create({
                data: {
                    jobId: Number(jobId),
                    client,
                    freelancer,
                    totalAmount: totalAmount.toString(),
                    status: 'Open'
                }
            });
            console.log("Saved JobCreated event to database");
        } catch (error) {
            console.error("Error saving job to DB:", error);
        }
    });
    
    console.log(`Listening to Escrow contract at ${contractAddress}`);
}

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    setupBlockchainListeners();
});
