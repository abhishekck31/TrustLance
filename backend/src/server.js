// Backend setup to handle data fetching and link generation.
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

/**
 * Mock function to simulate fetching block explorer data based on a transaction hash.
 * In a real application, this would call an external API (like Etherscan RPC) or an internal index.
 * @param txHash The transaction hash.
 * @returns A Block Explorer URL.
 */
function getBlockExplorerUrl(txHash) {
    // Simulating linking to Etherscan for demonstration
    return `https://etherscan.io/tx/${txHash}`;
}

/**
 * Endpoint to fetch historical events and link them to block explorer URLs.
 * In a real scenario, this would query an indexed database or RPC service.
 */
app.get('/api/events/history', async (req, res) => {
    try {
        // Mock data representing past contract events
        const mockEvents = [
            {
                eventName: 'FundsTransferred',
                blockNumber: 100000,
                transactionHash: '0xabc123...', // Placeholder hash
                from: '0xSenderA',
                to: '0xReceiverB',
                amount: 1000
            },
            {
                eventName: 'EscrowReleased',
                blockNumber: 100001,
                transactionHash: '0xdef456...', // Placeholder hash
                escrower: '0xContractAddress',
                recipient: '0xFinalRecipient',
                amount: 500
            }
        ];

        const linkedEvents = mockEvents.map(event => ({
            ...event,
            blockExplorerUrl: getBlockExplorerUrl(event.transactionHash)
        }));

        res.json(linkedEvents);

    } catch (error) {
        console.error('Error fetching event history:', error);
        res.status(500).json({ error: 'Failed to retrieve event history' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});