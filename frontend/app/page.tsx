// Frontend component to display and interact with the dynamic fee engine.
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query'; // Assuming useQuery is available from TanStack Query setup in Next.js context
import { Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';

interface FeeConfig {
  id: number;
  name: string;
  feePercentage: string; // Displayed as percentage (e.g., 5.00%)
  isActive: boolean;
  createdAt: string;
}

export default function PlatformFeeEngine() {
  const [configs, setConfigs] = useState<FeeConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<FeeConfig[]>('http://localhost:3000/api/fees');
      setConfigs(response.data);
    } catch (err) {
      setError("Failed to fetch fee configurations from the backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleCreateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    const newConfig = {
        name: (e.target.name.value || "New Fee") as string,
        feePercentage: (e.target.feePercentage.value) as number,
        isActive: (e.target.isActive.checked)
    };

    try {
      await axios.post('http://localhost:3000/api/fees', newConfig);
      alert("Fee configuration created successfully!");
      fetchConfigs(); // Refresh list
    } catch (err) {
      setError("Failed to create fee configuration.");
      console.error(err);
    }
  };

  const handleUpdateFee = async (id: number, e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = {
        name: (e.target.name.value || "Updated Name") as string,
        feePercentage: (e.target.feePercentage.value) as number,
        isActive: (e.target.isActive.checked)
    };

    try {
      await axios.put(`http://localhost:3000/api/fees/${id}`, updatedData);
      alert(`Fee configuration ${id} updated successfully!`);
      fetchConfigs(); // Refresh list
    } catch (err) {
      setError("Failed to update fee configuration.");
      console.error(err);
    }
  };


  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Platform Fee Engine</h1>

      {error && <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}>Error: {error}</p>}

      <Button variant="contained" color="primary" onClick={fetchConfigs} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Refresh Configurations'}
      </Button>

      <h2>Dynamic Fee Management</h2>

      {configs.length === 0 ? (
        <p>No fee configurations found. Add one below.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          {configs.map((config) => (
            <Card key={config.id} style={{ boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h6">{config.name}</Typography>
                <p><strong>Fee Setting:</strong> {config.feePercentage.toFixed(2)}%</p>
                <p>Status: {config.isActive ? 'Active' : 'Inactive'}</p>

                {/* Edit Form */}
                <form onSubmit={handleUpdateFee}>
                    <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                        <label>Name: <input type="text" name="name" defaultValue={config.name} required /></label><br/>
                        <label>Fee (%): <input type="number" name="feePercentage" step="0.01" required /></label><br/>
                        <label>Active: <input type="checkbox" name="isActive" checked={config.isActive} onChange={(e) => handleUpdateFee(config.id, { name: e.target.name, feePercentage: parseFloat(e.target.name), isActive: e.target.checked })} /></label><br/>
                        <Button variant="contained" color="secondary" type="submit">Save Changes</Button>
                    </div>
                </form>
              </CardContent>
            </Card>
          ))}

          {/* Add New Fee Form */}
          <Card style={{ gridColumn: '1 / -1', marginTop: '20px' }}>
            <CardContent>
              <h3>Add New Configuration</h3>
              <form onSubmit={handleCreateFee}>
                <label>Name: <input type="text" name="name" required /></label><br/>
                <label>Fee (%): <input type="number" name="feePercentage" step="0.01" required /></label><br/>
                <label>Active: <input type="checkbox" name="isActive" checked /></label><br/>
                <Button type="submit" variant="contained" color="error">Create Fee</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}