import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import redisClient from '../redisClient'; // Assuming this connects to Redis
import { setupBlockchainInteraction } from './blockchainService';

dotenv.config();

const app = express();
const PORT = 3001;

// Initialize Prisma Client
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// --- Blockchain Service Mock (Replace with actual web3 interaction logic) ---
const blockchainService = {
    async submitTransaction(txId: string, recipient: string): Promise<any> {
        console.log(`[Blockchain] Submitting transaction ${txId} to ${recipient}`);
        // Simulate external call latency and status update based on chain activity
        return { success: true, hash: `0xabc${txId}` };
    },
    async fetchTransactionStatus(txId: string): Promise<string> {
        // In a real app, this would poll an RPC or query the contract directly
        const status = Math.random() > 0.8 ? 'CONFIRMING' : 'SENT'; // Simulate progression
        return status;
    }
};

// --- API Endpoints ---

/**
 * Endpoint to initiate a new transaction on-chain (simulated)
 */
app.post('/api/transaction/start', async (req, res) => {
    const { recipientAddress } = req.body;
    if (!recipientAddress) {
        return res.status(400).json({ error: "Recipient address is required" });
    }

    try {
        // 1. Create the transaction state record in PostgreSQL
        const newStatusRecord = await prisma.transactionStatus.create({
            data: {
                txId: crypto.randomUUID(),
                recipient: recipientAddress,
                status: 'AWAITING_SIGNATURE',
            },
        });

        // 2. Submit transaction to blockchain (Simulated)
        const blockchainResult = await blockchainService.submitTransaction(newStatusRecord.txId, recipientAddress);

        // 3. Update DB with the result
        await prisma.transactionStatus.update({
            where: { id: newStatusRecord.id },
            data: { status: 'SENT' }
        });
        
        // Publish state update to Redis for real-time frontend updates (optional)
        await redisClient.set(`tx:${newStatusRecord.txId}`, JSON.stringify({ status: 'SENT', timestamp: new Date() }));

        res.status(201).json({ 
            message: "Transaction initiated successfully.", 
            txId: newStatusRecord.txId,
            initialStatus: 'SENT'
        });

    } catch (error) {
        console.error("Error starting transaction:", error);
        res.status(500).json({ error: "Failed to start transaction process." });
    }
});

/**
 * Endpoint to poll the status of a transaction
 */
app.get('/api/transaction/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        // Fetch from PostgreSQL
        const dbStatus = await prisma.transactionStatus.findUnique({ where: { txId: id } });

        if (!dbStatus) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        // Simulate fetching the current status from the blockchain service (polling mechanism)
        const blockchainStatus = await blockchainService.fetchTransactionStatus(id); 

        // Determine final displayed status based on both sources (prioritize chain confirmation if available)
        let finalStatus = dbStatus.status;
        if (blockchainStatus === 'CONFIRMING' && finalStatus !== 'SENT') {
            finalStatus = 'CONFIRMING'; // Prioritize the active blockchain phase
        } else if (blockchainStatus === 'COMPLETED') {
            finalStatus = 'COMPLETED';
        }


        res.status(200).json({ 
            txId: dbStatus.txId,
            recipient: dbStatus.recipient,
            status: finalStatus,
            updatedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error("Error fetching transaction status:", error);
        res.status(500).json({ error: "Failed to retrieve transaction status." });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});