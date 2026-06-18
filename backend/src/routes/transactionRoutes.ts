import { Router } from 'express';
import { logTransactionHash } from '../controllers/transactionController';

const router = Router();

// POST /api/transactions/log - Log a transaction hash associated with a job
router.post('/log', logTransactionHash);

export default router;