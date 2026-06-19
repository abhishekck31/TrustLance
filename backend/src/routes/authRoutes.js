const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Wallet Authentication Routes
router.post('/login', authController.loginWallet);
router.post('/register', authController.registerWallet);
router.get('/profile/:walletAddress', authController.getWalletProfile);

module.exports = router;