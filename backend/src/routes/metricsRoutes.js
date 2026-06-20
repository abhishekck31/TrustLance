const express = require('express');
const router = require('express').Router();
const MetricService = require('../services/MetricService');

/**
 * Routes for calculating Juror Accuracy Metrics.
 */
router.get('/accuracy/:proposalId', async (req, res) => {
    const { proposalId } = req.params;

    try {
        // Call the service layer to perform the heavy lifting calculation
        const metrics = await MetricService.getJurorMetrics(parseInt(proposalId));
        
        if (!metrics) {
            return res.status(404).json({ error: 'Proposal not found' });
        }

        res.json(metrics);
    } catch (error) {
        console.error('Error calculating metrics:', error.message);
        res.status(500).json({ error: 'Failed to calculate metrics', details: error.message });
    }
});

module.exports = router;