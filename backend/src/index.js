const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// AI Analyzer Endpoint
app.post('/api/analyze-evidence', async (req, res) => {
  const { title, submissionData } = req.body;

  if (!title || !submissionData) {
    return res.status(400).json({ error: "Title and submissionData are required for analysis." });
  }

  try {
    // --- AI Processing Simulation ---
    // In a real application, this is where you would call an external LLM API (e.g., OpenAI, Gemini)
    const prompt = `Analyze the following dispute evidence and provide a concise summary of the key claims and counterclaims. Evidence: "${submissionData}"`;
    
    // Simulate AI response time and generation
    console.log("Simulating AI analysis for title:", title);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency

    const aiSummary = `[AI ANALYSIS for ${title}]: Based on the provided evidence, the core dispute revolves around ${submissionData.substring(0, 50)}... The analysis suggests Claim A is supported by X data, while Counterclaim B requires further verification from Y documents.`;
    // --- End Simulation ---

    // Store result (or save evidence path if files were uploaded)
    const newEvidence = await prisma.disputeEvidence.create({
      title: title,
      submissionData: submissionData,
      analysisResult: aiSummary,
    });

    res.status(200).json({ 
        message: "Evidence successfully analyzed and summarized.", 
        evidenceId: newEvidence.id,
        summary: aiSummary
    });

  } catch (error) {
    console.error("Error during evidence analysis:", error);
    res.status(500).json({ error: "Failed to process evidence.", details: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});