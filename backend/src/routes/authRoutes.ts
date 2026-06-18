import { Router } from 'express';
import { authenticateWallet, getUserProfile } from '../controllers/authController';

const router = Router();

// POST /api/auth/wallet - Authenticate wallet (simulated)
router.post('/wallet', authenticateWallet);

// GET /api/auth/profile/:walletAddress - Get user profile
router.get('/profile/:walletAddress', getUserProfile);

export default router;