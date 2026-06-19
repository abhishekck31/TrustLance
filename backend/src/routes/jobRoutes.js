// Defines the API routes for job-related operations.

const express = require('express');
const router = express.Router();
const JobAnalysisService = require('../models/JobAnalysisService');

/**
 * @route POST /api/job/analyze
 * @description Analyzes a job description using the local Gemma model simulation to detect scam traits.
 * @param {object} req - Express request object
 * @param {string} req.body - The job description text to analyze
 * @param {object} res - Express response object
 */
router.post('/analyze', async (req, res) => {
    const { jobDescription } = req.body;

    if (!jobDescription) {
        return res.status(400).json({ error: "Job description is required for analysis." });
    }

    try {
        // Call the service layer to perform the AI evaluation
        const analysisResult = await JobAnalysisService.analyzeJobDescription(jobDescription);

        res.status(200).json({ 
            message: "Job description successfully analyzed.",
            data: analysisResult 
        });

    } catch (error) {
        console.error("Error during job analysis:", error);
        res.status(500).json({ 
            error: "Failed to analyze job description", 
            details: error.message 
        });
    }
});

module.exports = router;