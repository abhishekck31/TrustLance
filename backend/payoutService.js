// Node.js Backend Service for automating reward distribution via Web3 interaction
const { ethers } = require('ethers');
const { PrismaClient } = require('@prisma/client');

// --- Configuration ---
const RPC_URL = process.env.ETHEREUM_RPC_URL || "YOUR_ETH_NODE_URL";
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Used to sign transactions for automation

// Initialize Prisma Client (assuming setup exists)
const prisma = new PrismaClient();

/**
 * Interacts with the blockchain contract.
 * @param {string} contractAddress - Address of the JurorReward contract.
 * @param {string} privateKey - Wallet private key to sign transactions.
 * @param {function} transactionFunction - The function to call on the contract.
 * @param {...any} args - Arguments for the function call.
 */
async function callContract(contractAddress, privateKey, transactionFunction, ...args) {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, [...new ethers.constants.Interface], wallet);

    try {
        console.log(`Attempting to call ${transactionFunction} on ${contractAddress}...`);
        const tx = await transactionFunction.bind(contract)(...args);
        await tx.wait();
        console.log(`Transaction successful! Hash: ${tx.hash}`);
        return tx;
    } catch (error) {
        console.error("Blockchain transaction failed:", error.message);
        throw new Error(`Failed to execute transaction: ${error.message}`);
    }
}

/**
 * Automation service to distribute rewards based on backend logic.
 * This simulates the automation loop.
 */
async function automateRewardDistribution(contractAddress, payoutConfiguration) {
    console.log("--- Starting Automated Reward Distribution Process ---");

    try {
        // Step 1: Identify eligible jurors (Simulated lookup from DB/Prisma)
        const pendingJurors = await prisma.jurorPayouts.findMany({ where: { status: 'PENDING_PAYOUT' } });
        
        if (pendingJurors.length === 0) {
            console.log("No pending payouts found.");
            return;
        }

        for (const juror of pendingJurors) {
            console.log(`Processing Juror ID: ${juror.id} for payout.`);

            // Step 2: Execute the on-chain distribution logic
            try {
                await callContract(
                    contractAddress,
                    PRIVATE_KEY,
                    "distributeReward",
                    juror.id,
                    payoutConfiguration.payoutWalletAddress // The destination wallet address determined by backend policy
                );

                // Step 3: Update off-chain state upon successful on-chain transaction
                await prisma.jurorPayouts.update({
                    where: { id: juror.id },
                    data: { status: 'PAID', payoutDate: new Date() }
                });
                console.log(`Successfully triggered distribution for Juror ID: ${juror.id}`);

            } catch (e) {
                console.error(`CRITICAL ERROR distributing reward for Juror ID: ${juror.id}. Error:`, e.message);
                // Handle failure: log error, potentially move to a retry queue
            }
        }

        console.log("--- Automated Reward Distribution Process Finished ---");

    } catch (error) {
        console.error("Automation Process Halted Due to Major Error:", error);
    }
}

// --- Example Execution ---
async function runAutomation() {
    const CONTRACT_ADDRESS = "0x..."; // Replace with deployed contract address
    
    if (!PRIVATE_KEY || !RPC_URL) {
        console.error("FATAL: Private Key or RPC URL environment variables are missing.");
        return;
    }

    // Mock Payout Configuration (In a real app, this comes from the database state)
    const payoutConfig = {
        payoutWalletAddress: "0xReceiverWalletAddress123" // This should be determined dynamically based on juror claims/rules
    };

    await automateRewardDistribution(CONTRACT_ADDRESS, payoutConfig);
}

runAutomation();