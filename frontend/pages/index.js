import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { fetchProjectStatus } from '../utils/api'; // Assuming API utility exists
import { Card, CardBody, Typography, Button, Container, CircularProgress, Alert } from '@mui/material';

// Mocking the actual interaction setup (In a full app, this would be hooked up to Wagmi wallet)
const mockProjectData = {
    id: 101,
    name: "TrustLance Initial PoW Project",
    status: "Pending",
    proofHash: "0xabc123xyz456",
};

export default function HomePage() {
    const queryClient = useQueryClient();
    // In a real setup, we'd fetch actual blockchain data via the backend API
    const { data, isLoading, error } = useQuery({
        queryKey: ['projectStatus', mockProjectData.id],
        queryFn: () => fetchProjectStatus(mockProjectData.id), // Calls /api/project/:id/status
        staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
    });

    const { mutate: completeProject, isLoading: isCompleting } = useMutation({
        mutationFn: (projectId, proofHash) => fetchProjectStatus(`${projectId}/complete`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ proofHash }) }), // Simplified to call the backend endpoint directly
        onSuccess: (response) => {
            alert(`Success! Project ${projectId} linked with PoW hash: ${response.proofHash}`);
            queryClient.invalidateQueries(['projectStatus', projectId]);
        },
        onError: (error) => {
            alert(`Error linking project: ${error.message}`);
        }
    });


    return (
        <Container maxWidth="md" style={{ marginTop: '50px' }}>
            <Card>
                <CardBody>
                    <Typography variant="h4" gutterBottom>Proof-of-Work NFT Project Tracker</Typography>
                    <Typography variant="subtitle1" color="text.secondary">Demonstrating on-chain linkage for completed projects.</Typography>

                    {/* Display Status */}
                    <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
                        <h3>Project Details (ID: {mockProjectData.id})</h3>
                        <p><strong>Name:</strong> {mockProjectData.name}</p>
                        <p><strong>Current Status:</strong> <span style={{ fontWeight: 'bold', color: mockProjectData.status === 'Completed' ? 'green' : 'orange' }}>{mockProjectData.status}</span></p>
                        {mockProjectData.proofHash && (
                            <>
                                <p><strong>Proof Hash:</strong> {mockProjectData.proofHash}</p>
                            </>
                        )}
                    </div>

                    {/* Action Button */}
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => completeProject(mockProjectData.id, '0xdeadbeef123456')} // Mocking the proof hash input
                        disabled={isCompleting}
                        sx={{ mt: 2 }}
                    >
                        {isCompleting ? <CircularProgress size={24} /> : 'Submit PoW & Mint NFT Link'}
                    </Button>

                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                </CardBody>
            </Card>
        </Container>
    );
}