// Node.js/Express backend setup for managing off-chain data and interaction hooks
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const app = express();
const prisma = new PrismaClient();

const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- Mock Data and Handlers (In a real app, this would interact with Web3 providers) ---

// Endpoint to simulate creating a job entry in the database linked to an on-chain call
app.post('/api/job/create', async (req, res) => {
    try {
        const { jobId, funderAddress, executorAddress, amount } = req.body;
        
        // In a real scenario, we'd verify the transaction receipt or event logs here to confirm state change.
        
        const newJob = await prisma.escrowJob.create({
            data: {
                jobId: parseInt(jobId),
                funderAddress: funderAddress,
                executorAddress: executorAddress,
                amount: BigInt(amount),
                status: 'PENDING_FUNDING'
            }
        });

        res.status(201).json({ message: "Job recorded successfully", job: newJob });

    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({ error: "Failed to create job record" });
    }
});


// Endpoint to simulate checking job status
app.get('/api/job/:id', async (req, res) => {
    try {
        const job = await prisma.escrowJob.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        res.status(200).json(job);
    } catch (error) {
        console.error("Error fetching job:", error);
        res.status(500).json({ error: "Failed to fetch job status" });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});