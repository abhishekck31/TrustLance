import { Request, Response } from 'express';
import { db } from '../db';

export const logTransactionHash = async (req: Request, res: Response) => {
    try {
        const { jobId, transactionHash, walletAddress } = req.body;

        if (!transactionHash || !walletAddress) {
            return res.status(400).json({ error: 'transactionHash and walletAddress are required' });
        }

        // Log the transaction hash against a job/user context
        const logEntry = await db.TransactionHashLog.create({
            data: {
                jobId: jobId ? parseInt(jobId) : null, // Ensure jobId is an Int or null
                transactionHash: transactionHash,
                walletAddress: walletAddress,
            }
        });

        res.status(201).json({ message: 'Transaction hash logged successfully', log: logEntry });

    } catch (error) {
        console.error("Error logging transaction hash:", error);
        res.status(500).json({ error: 'Failed to log transaction hash' });
    }
};