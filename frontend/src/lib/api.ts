// Defines the API client utility
const BASE_URL = 'http://localhost:3001/api';

export const api = {
    async get(path: string, config?: RequestInit): Promise<Response> {
        const response = await fetch(`${BASE_URL}/${path}`, config);
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return response;
    },
    async post(path: string, body: any): Promise<Response> {
        const response = await fetch(`${BASE_URL}/${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Post Error (${response.status}): ${errorBody.error || response.statusText}`);
        }
        return response;
    },
};