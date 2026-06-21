'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api'; // Assume this handles calls to /api/
import { Loader2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface TransactionState {
    txId: string;
    recipient: string;
    status: string; // AWAITING_SIGNATURE, SENT, CONFIRMING, COMPLETED
    updatedAt: string;
}

export default function TransactionFlowPage() {
    const [newRecipient, setNewRecipient] = useState('');
    const [txId, setTxId] = useState<string | null>(null);
    const [transactionData, setTransactionData] = useState<TransactionState | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const fetchTransactionStatus = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`/transaction/${id}`);
            setTransactionData(res.data);
        } catch (err) {
            setError("Failed to fetch transaction status.");
            setTransactionData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleStartTransaction = async () => {
        if (!newRecipient) {
            setError("Please enter a recipient address.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // Initiate transaction via backend
            const res = await api.post('/transaction/start', { recipientAddress: newRecipient });
            setTxId(res.data.txId);
            // Immediately start polling the status
            await fetchTransactionStatus(res.data.txId); 
        } catch (err) {
            setError("Failed to start transaction.");
        } finally {
            setLoading(false);
        }
    };

    // Effect to run initial fetch if txId exists and is newly created
    useEffect(() => {
        if (txId && !transactionData) {
             fetchTransactionStatus(txId);
        }
    }, [txId, transactionData]);


    const renderStatus = () => {
        if (!transactionData) return null;

        let statusClass = 'bg-gray-100 text-gray-800';
        let Icon = Clock;

        switch (transactionData.status) {
            case 'AWAITING_SIGNATURE':
                statusClass = 'bg-yellow-100 text-yellow-800 border border-yellow-400';
                Icon = AlertTriangle;
                break;
            case 'SENT':
                statusClass = 'bg-blue-100 text-blue-800 border border-blue-400';
                Icon = Loader2;
                break;
            case 'CONFIRMING':
                statusClass = 'bg-indigo-100 text-indigo-800 border border-indigo-400 animate-pulse';
                Icon = Clock;
                break;
            case 'COMPLETED':
                statusClass = 'bg-green-100 text-green-800 border border-green-400';
                Icon = CheckCircle;
                break;
        }

        return (
            <div className={`p-4 mt-6 rounded-lg border-l-4 ${statusClass}`}>
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{transactionData.status}</h3>
                    <Icon className="w-6 h-6" />
                </div>
                <p className="mt-2 text-sm">Transaction ID: <span className="font-mono bg-white p-1 rounded">{transactionData.txId}</span></p>
                <p className="text-sm">Recipient: {transactionData.recipient}</p>
                {transactionData.updatedAt && <p className="text-xs mt-1 text-gray-500">Last Updated: {new Date(transactionData.updatedAt).toLocaleString()}</p>}
            </div>
        );
    };


    return (
        <div className="min-h-screen bg-gray-50 p-8 sm:p-12 font-sans">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 border-b pb-4">TrustLance Transaction Flow</h1>
                <p className="mt-2 text-lg text-gray-600">Awaiting Signature -> Sent -> Confirming -> Completed</p>
            </header>

            <div className="max-w-3xl mx-auto bg-white p-8 shadow-2xl rounded-xl border">
                {/* Step 1: Initiate */}
                <section className="mb-8 p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Start New Transaction</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Enter Recipient Address"
                            value={newRecipient}
                            onChange={(e) => setNewRecipient(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                            onClick={handleStartTransaction}
                            disabled={loading || !newRecipient}
                            className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-150 ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'}`}
                        >
                            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : 'Start Process'}
                        </button>
                    </div>
                    {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}
                </section>

                {/* Step 2: Status Tracking */}
                {transactionData ? (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">Transaction Status Tracker</h2>
                        {renderStatus()}
                    </section>
                ) : (
                    <div className="p-6 text-center border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-gray-500">Click "Start Process" above to begin tracking your transaction status.</p>
                    </div>
                )}
            </div>
        </div>
    );
}