const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Transaction Hash Tracking Routes
router.post('/hash', transactionController.trackTransactionHash);
router.get('/', transactionController.getWalletTransactions);

module.exports = router;