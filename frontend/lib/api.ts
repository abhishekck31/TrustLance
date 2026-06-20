// Utility function for interacting with the backend API.
const BASE_URL = 'http://localhost:3001/api';

export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
    }
    return response;
}