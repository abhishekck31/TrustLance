'use client';

import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Separator } from '@tailwindcss/components'; // Assuming Tailwind setup supports this or using standard div separators
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming shadcn/ui components structure

interface Proposal {
  id: number;
  title: string;
  description: string;
  body: string;
  aiSummary: string | null;
}

export default function AIgovernanceAssistant() {
  const [proposalId, setProposalId] = useState<number>(1); // Start with the seeded ID
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState<string>('idle');
  const [error, setError] = useState<string>('');

  const fetchProposal = useCallback(async (id: number) => {
    setLoading('loading');
    setError('');
    try {
      const response = await axios.get<Proposal>(`/api/proposals/${id}`);
      setProposal(response.data);
    } catch (err) {
      setError('Failed to fetch proposal data.');
      console.error(err);
    } finally {
      setLoading('idle');
    }
  }, []);

  const triggerSummarization = async () => {
    if (!proposalId || !proposal) return;

    setLoading('processing');
    setError('');
    try {
        const response = await axios.post<any>(`/api/proposals/${proposalId}/summarize`);
        // Refresh the data after successful summarization
        await fetchProposal(proposalId);
        alert(`Success! Summary received: ${response.data.summary}`);
    } catch (err) {
        setError('Failed to trigger AI summarization.');
        console.error(err);
    } finally {
        setLoading('idle');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-10 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-900">AI Governance Assistant</h1>
        <p className="text-lg text-gray-600 mt-2">Summarize complex Web3 proposals instantly.</p>
      </header>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Proposal Display */}
        {proposal ? (
          <Card>
            <CardHeader>
              <CardTitle>{proposal.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-blue-600 mb-2">Original Proposal Text</h2>
                <p className="whitespace-pre-wrap text-gray-700 border p-4 bg-gray-50 rounded">{proposal.body}</p>
              </div>

              {proposal.aiSummary ? (
                <>
                  <div className="pt-6 border-t-2 border-green-500 bg-green-50 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold text-green-700 mb-3">AI Generated Summary</h2>
                    <p className="whitespace-pre-wrap text-gray-800">{proposal.aiSummary}</p>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">Click 'Summarize' to generate the AI summary.</p>
                </div>
              )}

            </CardContent>
          </Card>
        ) : (
          <div className="text-center p-12 bg-white rounded-lg shadow border">
            <h3 className="text-xl text-gray-500">Select a Proposal to Start</h3>
            <p className="text-gray-400 mt-2">Currently viewing simulated proposal ID: {proposalId}</p>
          </div>
        )}

        {/* Action Button */}
        {proposal && (
          <div className="flex justify-center pt-6">
            <button
              onClick={triggerSummarization}
              disabled={loading === 'processing'}
              className={`px-8 py-3 text-lg font-semibold rounded-full transition duration-300 shadow-lg 
                ${loading === 'processing'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white transform hover:scale-[1.02]'
                }`}
            >
              {loading === 'processing' ? 'Generating Summary...' : 'Generate AI Summary'}
            </button>
          </div>
        )}

        {error && (
            <div className="p-4 bg-red-100 text-red-700 border border-red-400 rounded">
                Error: {error}
            </div>
        )}
      </div>
    </div>
  );
}