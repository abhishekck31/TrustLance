'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpRight, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, Typography, Divider } from '@/components/ui/ui'; // Assuming shadcn components setup
import { Separator } from '@/components/ui/separator';

interface Finding {
  id: number;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  reportedBy: string;
  dateReported: string;
}

export default function AuditFindingsDashboard() {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFindings = async () => {
    try {
      // Assuming the backend runs on port 3001 (adjust as necessary)
      const response = await axios.get('http://localhost:3001/api/findings');
      setFindings(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load audit findings. Ensure the backend is running.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFindings();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-lg">Loading Audit Findings...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-8 pb-4 border-b">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <Typography variant="h1" className="text-3xl font-bold text-gray-900">Security Audit Tracker</Typography>
        </div>
        <p className="text-gray-600 mt-2">Monitor and track the status of all security review findings across the platform.</p>
      </header>

      <div className="space-y-6">
        {findings.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300 p-6 text-center bg-white">
            <Typography variant="h5">No Audit Findings Found</Typography>
            <p>No security findings are currently tracked in the system.</p>
          </Card>
        ) : (
          findings.map((finding) => (
            <Card key={finding.id} className="shadow-md hover:shadow-lg transition duration-300 border-l-4" style={{ borderColor: finding.severity === 'Critical' ? 'red' : finding.severity === 'High' ? 'orange' : finding.severity === 'Medium' ? 'yellow' : 'blue' }}>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{finding.title}</h2>
                    <p className="text-sm text-gray-500 mt-1 flex items-center space-x-3">
                        <Clock className='w-4 h-4'/> Reported: {new Date(finding.dateReported).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full uppercase ${
                    finding.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                    finding.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                    finding.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {finding.severity}
                  </span>
                </div>

                <p className="text-gray-600 border-t pt-3">{finding.description}</p>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        finding.status === 'Open' ? 'bg-yellow-500 text-white' :
                        finding.status === 'In Progress' ? 'bg-blue-500 text-white' :
                        finding.status === 'Resolved' ? 'bg-green-500 text-white' :
                        'bg-gray-400 text-white'
                    }`}>
                      Status: {finding.status}
                    </span>
                  </div>

                  {finding.resolutionDate && (
                    <div className="flex items-center space-x-3">
                        <CheckCircle className='w-5 h-5 text-green-600'/>
                        <span className="text-sm font-medium text-gray-700">Resolved: {new Date(finding.resolutionDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}