// Mock service layer to simulate fetching data from the blockchain
// In a real setup, this would interact with Web3 providers (e.g., Ethers.js)
const MOCK_FREELANCER_DATA = {
    1: { name: "Alice Developer", bio: "Expert in full-stack React and Node.js development.", owner: "0xabc123...", createdAt: 1678886400 },
    2: { name: "Bob Designer", bio: "Creative UI/UX specialist focusing on modern design principles.", owner: "0xdef456...", createdAt: 1678972800 },
};

/**
 * Simulates fetching a profile by its ID from the blockchain.
 * @param {number} id - The Freelancer ID.
 * @returns {Promise<object|null>} Profile data or null if not found.
 */
async function getProfileFromBlockchain(id) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const data = MOCK_FREELANCER_DATA[id];

    if (data) {
        return data;
    }
    return null;
}

module.exports = {
    getProfileFromBlockchain
};