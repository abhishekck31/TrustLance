// Mock API layer to simulate backend communication, crucial for front-end development.
export const fetchJobs = async (term: string): Promise<any[]> => {
    console.log(`API Call: Fetching Jobs for "${term}"`);
    await new Promise(resolve => setTimeout(resolve, 300));
    return [{ id: 101, title: `${term} Job Role` }, { id: 102, title: `Senior ${term} Position` }];
};

export const fetchEscrows = async (term: string): Promise<any[]> => {
    console.log(`API Call: Fetching Escrows for "${term}"`);
    await new Promise(resolve => setTimeout(resolve, 300));
    return [{ id: 201, amount: 5000, status: 'Pending' }, { id: 202, amount: 12000, status: 'Processing' }];
};

export const fetchUsers = async (term: string): Promise<any[]> => {
    console.log(`API Call: Fetching Users for "${term}"`);
    await new Promise(resolve => setTimeout(resolve, 300));
    return [{ id: 301, username: `${term}User` }, { id: 302, username: `Admin ${term}` }];
};

export const fetchDisputes = async (term: string): Promise<any[]> => {
    console.log(`API Call: Fetching Disputes for "${term}"`);
    await new Promise(resolve => setTimeout(resolve, 300));
    return [{ id: 401, description: `${term} Dispute Case` }, { id: 402, description: `Refund Request` }];
};

// In a real application, these would interface with the /backend API calls via the Node.js/Express layer.
// Example wrapper for complex searches if needed:
export const searchAllEntities = async (term: string) => {
    const [jobs, escrows, users, disputes] = await Promise.all([
        fetchJobs(term),
        fetchEscrows(term),
        fetchUsers(term),
        fetchDisputes(term)
    ]);
    return { jobs, escrows, users, disputes };
};