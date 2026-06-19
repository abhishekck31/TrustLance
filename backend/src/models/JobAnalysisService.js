// Service layer responsible for interacting with the local Gemma model for analysis.

const analyzeJobDescription = async (jobDescription) => {
    console.log("--- Starting Job Description Analysis via Local Gemma Model ---");
    
    // --- SIMULATION OF LOCAL MODEL INFERENCE ---
    // In a real application, this section would involve:
    // 1. Loading the Gemma model weights.
    // 2. Preprocessing the jobDescription.
    // 3. Running inference (prompting the model).
    // 4. Post-processing the output.

    if (!jobDescription || typeof jobDescription !== 'string') {
        throw new Error("Invalid input: Job description must be provided.");
    }

    // Simulated Scam Trait Analysis based on prompt engineering for Gemma
    const analysisPrompt = `Analyze the following job description for potential scam traits, red flags, or over-promising language. Return a JSON object with fields: "scam_risk" (low/medium/high), "red_flags", and "summary". Job Description: "${jobDescription}"`;

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulated Model Output based on input content analysis
    let scamRisk = 'low';
    let redFlags = [];
    let summary = "No immediate scam indicators found.";

    if (jobDescription.toLowerCase().includes("guaranteed income") || jobDescription.toLowerCase().includes("no experience required") || jobDescription.toLowerCase().includes("click here to pay")) {
        scamRisk = 'high';
        redFlags.push("Guaranteed income claims are a major red flag.");
    } else if (jobDescription.toLowerCase().includes("vacation") && jobDescription.toLowerCase().includes("remote")) {
        scamRisk = 'medium';
        redFlags.push("Unrealistic or vague remote work promises.");
    }

    if (redFlags.length > 0) {
        summary = `Potential Scam Risk Detected (${scamRisk}): ${redFlags.join('; ')}`;
    }


    const analysisResult = {
        job_description: jobDescription,
        scam_risk: scamRisk,
        red_flags: redFlags,
        summary: summary
    };

    console.log("--- Analysis Complete ---");
    return analysisResult;
};

module.exports = { analyzeJobDescription };