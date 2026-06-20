// Main entry point for the Node.js/Express/WebSocket server.
const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const { PrismaClient } = require('@prisma/client');

const app = express();
const server = http.createServer(app);
const prisma = new PrismaClient();

// --- Real-time Setup (Redis Pub/Sub Simulation) ---
const wss = new WebSocketServer({ server: server });

// Simulate a channel for notifications broadcast via Redis/WebSocket
const notificationChannel = new Map(); // Simple in-memory store for demonstration purposes

app.use(express.json());

// Real-time WebSocket handler
wss.on('connection', (ws) => {
    console.log('Client connected to real-time channel.');
    
    // In a production system, subscriptions would be managed here based on user ID or contract address.

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            // Handle client requests (e.g., subscribing to new notifications)
            if (data.action === 'subscribe') {
                // Simulate subscribing the client to a specific notification feed
                console.log(`Client subscribed to feed: ${data.topic}`);
                ws.send(JSON.stringify({ type: 'subscribed', topic: data.topic }));
            }
        } catch (e) {
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid request' }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected.');
    });
});


// --- Notification Trigger Simulation (Backend Logic) ---
app.post('/api/trigger-notification', async (req, res) => {
    const { recipientAddress, message } = req.body;

    if (!recipientAddress || !message) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    // 1. Log to Database (Prisma)
    const newNotification = await prisma.notification.create({
        data: {
            recipient: recipientAddress,
            message: message,
        },
    });

    // 2. Simulate Real-time Broadcast (Redis Pub/Sub or direct WebSocket push)
    const notificationPayload = {
        id: newNotification.id,
        recipient: recipientAddress,
        message: newNotification.message,
        timestamp: newNotification.timestamp,
        status: 'new'
    };

    // Simulate pushing this data to all subscribed WebSocket clients
    notificationChannel.forEach(ws => {
        // In a real system, we would check if the connected client is interested in this specific recipientAddress.
        if (ws.readyState === 1) { // OPEN
             ws.send(JSON.stringify({ type: 'notification', payload: notificationPayload }));
        }
    });

    console.log(`Notification triggered and broadcasted for recipient: ${recipientAddress}`);
    res.status(200).json({ status: 'success', notificationId: newNotification.id });
});


const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Backend Notification Server running on port ${PORT}`);
});