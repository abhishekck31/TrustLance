// Utility functions for interacting with the backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function fetchHiringOpportunities(): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/hiring`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Fetch Error:', error);
    // Re-throw a more specific error for the UI to handle if necessary
    throw new Error('Could not retrieve hiring opportunities.');
  }
}