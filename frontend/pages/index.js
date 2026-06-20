// Next.js frontend component using React hooks to manage state and establish the WebSocket connection for real-time updates.
import React, { useState, useEffect, useCallback } from 'react';
import { useWagmi } from 'wagmi';
import { createConfig, publicClient, mainnet } from 'wagmi/core';
import { connectWallet } from 'wagmi/connect';

const NotificationCenter = () => {
    const { address, isConnected } = useWagmi();
    const [notifications, setNotifications] = useState([]);
    const [status, setStatus] = useState('Disconnected');

    // Initialize connection state when wallet connects
    const handleConnectWallet = useCallback(async () => {
        if (isConnected) return;
        try {
            const { address: walletAddress } = await connectWallet();
            console.log("Wallet connected:", walletAddress);
            setStatus('Connected');
            // In a real app, subscribe to WebSocket here upon connection
        } catch (error) {
            console.error("Wallet connection failed:", error);
            setStatus('Connection Error');
        }
    }, [isConnected]);


    // Real-time data fetching simulation (simulating WebSocket listener)
    useEffect(() => {
        let ws;
        if (!address) return;

        // In a real application, this URL points to the backend WebSocket endpoint
        const socketUrl = `ws://localhost:3000`; 
        setStatus('Connecting...');
        ws = new WebSocket(socketUrl);

        ws.onopen = () => {
            console.log('WebSocket connected successfully.');
            // Send subscription message upon successful connection
            ws.send(JSON.stringify({ action: 'subscribe', topic: address }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'notification') {
                console.log("Received real-time notification:", data.payload);
                setNotifications(prev => [...prev, data.payload]);
            } else if (data.type === 'subscribed') {
                 console.log('Successfully subscribed to feed.');
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
            setStatus('Real-time Error');
        };

        ws.onclose = () => {
            console.log('WebSocket closed.');
            setStatus('Disconnected - Lost connection');
        };

        // Cleanup function
        return () => {
            if (ws) ws.close();
        };
    }, [address]);


    const handleTriggerNotification = async () => {
        if (!address) {
            alert("Please connect a wallet first.");
            return;
        }
        const message = prompt("Enter the notification message:");
        if (message) {
             try {
                const response = await fetch('http://localhost:3000/api/trigger-notification', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ recipientAddress: address, message: message })
                });
                const result = await response.json();
                console.log("Notification triggered successfully:", result);
            } catch (error) {
                console.error("Error triggering notification:", error);
                alert("Failed to trigger notification via backend.");
            }
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-indigo-800 mb-6">TrustLance Notification Center</h1>
            
            <div className="flex items-center space-x-4 mb-6 p-4 bg-white shadow rounded-lg">
                <div>
                    {isConnected ? (
                        <p className="text-lg font-semibold text-green-600">Connected Wallet: {address}</p>
                    ) : (
                        <button 
                            onClick={handleConnectWallet}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                        >
                            Connect Wallet
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Notification Trigger Panel */}
                <div className="lg:col-span-1 bg-white p-6 shadow rounded-lg border border-indigo-200">
                    <h2 className="text-xl font-semibold mb-4 text-indigo-700">Send Notification</h2>
                    <textarea
                        placeholder="Enter message to send..."
                        className="w-full p-3 border rounded mb-4 focus:ring-indigo-500 focus:border-indigo-500"
                        rows="4"
                    ></textarea>
                    <button
                        onClick={handleTriggerNotification}
                        disabled={!isConnected}
                        className={`w-full py-2 px-4 rounded font-semibold transition ${isConnected ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                        Trigger Notification
                    </button>
                     <p className="mt-4 text-sm text-gray-600">Notifications are broadcasted via WebSocket.</p>
                </div>

                {/* Real-time Feed Panel */}
                <div className="lg:col-span-2 bg-white p-6 shadow rounded-lg border border-indigo-200">
                    <h2 className="text-xl font-semibold mb-4 text-indigo-700">Real-time Feed ({notifications.length})</h2>
                    {notifications.length === 0 ? (
                        <p className="text-gray-500 italic">No new notifications received yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {notifications.slice().reverse().map((n, index) => (
                                <div key={index} className={`p-3 border rounded-md ${n.status === 'new' ? 'bg-yellow-50 border-yellow-300' : 'bg-gray-50 border-gray-200'}`}>
                                    <p className="font-medium text-sm">{n.message}</p>
                                    <p className="text-xs mt-1 text-gray-600">Received at: {new Date(n.timestamp).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationCenter;