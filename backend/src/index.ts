// Backend service responsible for ingesting blockchain events and persisting notifications into the DB (Simulated Pipeline)

import { PrismaClient, Notification } from '@prisma/client';
import { RedisClient } from './redisClient'; // Assume redis client setup exists
import { EventEmitter } from 'events';

const prisma = new PrismaClient();
// Assume we have a service that interfaces with the blockchain data source (e.g., The Graph or direct RPC listener)
const eventIngestor = new EventEmitter(); 

/**
 * Ingests an on-chain event and creates a corresponding database notification record.
 * This simulates the core pipeline logic.
 * @param eventType - The type of event received from the blockchain.
 * @param sender - The address that triggered the event (freelancer or client).
 * @param details - Specific payload data.
 */
async function processBlockchainEvent(eventType: string, sender: string, details: object) {
    console.log(`[Pipeline] Ingesting event: ${eventType} from ${sender}`);

    let notificationData: { [key: string]: any };

    if (eventType === 'MilestoneSubmitted') {
        notificationData = {
            type: 'MILESTONE_SUBMITTED',
            message: `Milestone submitted successfully. Details: ${JSON.stringify(details)}`,
            recipientId: details.freelancer, // Assuming freelancer is the recipient for client notification flow
            eventType: 'MILESTONE',
        };
    } else if (eventType === 'EscrowFunded') {
        notificationData = {
            type: 'ESCROW_FUNDED',
            message: `Escrow successfully funded. Amount: ${details.amount}`,
            recipientId: details.freelancer, // Assuming freelancer is the recipient for freelancer notification flow
            eventType: 'ESCROW',
        };
    } else {
        console.warn(`Unknown event type received: ${eventType}`);
        return;
    }

    try {
        const newNotification = await prisma.notification.create({
            data: {
                type: notificationData.type,
                message: notificationData.message,
                recipientId: notificationData.recipientId,
                eventType: notificationData.eventType,
                status: 'PENDING',
                blockchainTxHash: details.txHash, // Use the hash for traceability
            },
        });
        console.log(`[Pipeline Success] Notification created with ID: ${newNotification.id}`);
        // Optionally push a real-time update to Redis/WebSocket here
        eventIngestor.emit('new_notification', newNotification);

    } catch (error) {
        console.error("[Pipeline Error] Failed to save notification to DB:", error);
    }
}

// --- Simulation of Event Listener Hook ---
// In a real application, this function would be hooked up to The Graph subscriptions or an RPC listener.
async function simulateEventFeed() {
    console.log("--- Simulating Blockchain Data Feed ---");
    
    // 1. Simulate Milestone Submission Event (Client perspective)
    await processBlockchainEvent('MilestoneSubmitted', '0xFreelancerAddress123', { 
        freelancer: '0xFreelancerAddress123', 
        milestoneId: 5, 
        amount: 1000 
    });

    // 2. Simulate Escrow Funding Event (Freelancer perspective)
    await processBlockchainEvent('EscrowFunded', '0xClientAddress456', { 
        client: '0xClientAddress456', 
        freelancer: '0xFreelancerAddress123', 
        amount: 5000 
    });

    console.log("--- Simulation Complete ---");
}


export { processBlockchainEvent, simulateEventFeed };

// NOTE: A separate file (e.g., redisClient.ts) would handle Redis interactions for queueing or real-time delivery.