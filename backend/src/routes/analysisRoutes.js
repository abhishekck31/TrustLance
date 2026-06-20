const express = require('express');
const router = express.Router();
const analyzeEvidenceController = require('../controllers/analysisController');

// Define the route for AI Dispute Evidence Analysis
router.post('/analyze-evidence', analyzeEvidenceController.analyzeEvidence);

module.exports = router;