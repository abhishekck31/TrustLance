// Backend setup using Express to expose job management endpoints.
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// --- Simulated Database Interaction (In a real application, this would interact with the contract via web3 provider) ---

/**
 * Simulation function: In a production system, this logic would call the Solidity contract
 * to verify state changes, ensuring off-chain data matches on-chain reality.
 */
async function handleJobRequest(req, res) {
    try {
        const { action, jobId, amount, description } = req.body;

        switch (action) {
            case 'INITIATE':
                // Logic to call contract.initiateJob(...) and record initial state in DB
                console.log(`Backend: Initiating Job ${jobId} for ${amount}`);
                // Placeholder for actual Web3 interaction
                res.status(200).json({ message: `Job initiated successfully. Tracking ID: ${jobId}` });
                break;

            case 'FUND':
                // Logic to call contract.fundJob(...) and update DB state
                console.log(`Backend: Funding Job ${jobId}`);
                // Placeholder for actual Web3 interaction
                res.status(200).json({ message: `Job ${jobId} marked as Funded` });
                break;

            case 'COMPLETE':
                // Logic to call contract.completeJob(...) and update DB state
                console.log(`Backend: Completing Job ${jobId}`);
                // Placeholder for actual Web3 interaction
                res.status(200).json({ message: `Job ${jobId} marked as Completed` });
                break;

            default:
                res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error("Error during job processing:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// --- API Routes ---

app.post('/api/job/:id/initiate', async (req, res) => {
    // In a real app, verify permissions and call contract execution here
    await handleJobRequest(req, res);
});

app.post('/api/job/:id/fund', async (req, res) => {
    // In a real app, verify caller has authority to fund this job
    await handleJobRequest(req, res);
});

app.post('/api/job/:id/complete', async (req, res) => {
    // In a real app, verify completion metrics if needed
    await handleJobRequest(req, res);
});

app.get('/api/jobs/:id', async (req, res) => {
    const { id } = req.params;
    // Fetch status from DB (or read from contract via Web3 Provider)
    try {
        const jobData = await prisma.job.findUnique({ where: { jobId: parseInt(id) } });
        if (!jobData) return res.status(404).json({ error: 'Job not found' });
        res.json(jobData);
    } catch (e) {
        res.status(500).json({ error: 'Failed to retrieve job status' });
    }
});

// --- Startup ---
app.listen(PORT, async () => {
    console.log(`TrustLance Backend running on http://localhost:${PORT}`);
});