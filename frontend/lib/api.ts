/**
 * Centralized function for fetching user data from the backend API.
 * In a real application, this would handle secure API keys and error handling.
 */
export async function fetchUserProfile(username: string): Promise<any | null> {
  // IMPORTANT: This URL must point to the running Node/Express backend (e.g., http://localhost:3001)
  const API_URL = `http://localhost:3001/api/user/${username}`; 

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // In a production app, throw a more specific custom error
    return null; 
  }
}