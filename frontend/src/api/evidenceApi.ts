/**
 * Client functions for interacting with the backend API.
 */
export const evidenceApi = {
  async analyzeEvidence(title: string, submissionData: string): Promise<{ summary: string, analysisDate: string }> {
    const response = await fetch('http://localhost:3001/api/analyze-evidence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, submissionData }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.error || `HTTP error! Status: ${response.status}`);
    }

    return response.json();
  },
};