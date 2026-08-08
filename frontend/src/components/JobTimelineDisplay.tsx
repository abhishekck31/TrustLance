// TrustLance Frontend Component (Next.js)

import React, { useState, useEffect } from 'react';
import { Loader2, Clock, CheckCircle, Package, Award } from 'lucide-react';

interface TimelineEntry {
    stage: string;
    date: string | null;
    status: 'Created' | 'Funded' | 'Milestone' | 'Approved' | 'Released';
}

interface JobTimelineDisplayProps {
    jobId: number;
}

const JobTimelineDisplay: React.FC<JobTimelineDisplayProps> = ({ jobId }) => {
    const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTimeline = async () => {
            setLoading(true);
            setError(null);
            try {
                // In a real app, this would hit the backend API: /api/jobs/:id/timeline
                const response = await fetch(`/api/jobs/${jobId}/timeline`);
                if (!response.ok) {
                    throw new Error('Failed to fetch timeline data.');
                }
                const data = await response.json();
                
                // Process and structure the timeline data for display
                const processedTimeline: TimelineEntry[] = [
                    { stage: 'Job Created', date: data.created, status: 'Created' as const },
                    ...(data.funded ? [{ stage: 'Job Funded', date: data.funded, status: 'Funded' as const }] : []),
                    ...(data.milestone ? [{ stage: 'Milestone Set', date: data.milestone, status: 'Milestone' as const }] : []),
                    ...(data.approved ? [{ stage: 'Approved', date: data.approved, status: 'Approved' as const }] : []),
                    ...(data.released ? [{ stage: 'Released', date: data.released, status: 'Released' as const }] : []),
                ];

                setTimeline(processedTimeline);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchTimeline();
    }, [jobId]);

    if (loading) {
        return <div className="flex items-center justify-center p-4">
            <Loader2 className="w-6 h-6 mr-2 animate-spin text-primary" /> Loading Timeline...
        </div>;
    }

    if (error) {
        return <div className="text-red-500 p-4 border border-red-300 bg-red-50 rounded-lg">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">Activity Timeline</h2>
            {timeline.length === 0 ? (
                <div className="p-6 bg-blue-50 rounded-lg text-center border border-blue-200">
                    No timeline history found for this job.
                </div>
            ) : (
                timeline.map((entry, index) => (
                    <div key={index} className={`p-4 border-l-4 shadow-md rounded-lg transition-all ${entry.status === 'Released' ? 'border-green-500 bg-green-50' : 'border-indigo-400 bg-white'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{entry.stage}</h3>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                entry.status === 'Released' ? 'bg-green-100 text-green-800' : 
                                entry.status === 'Approved' ? 'bg-yellow-100 text-yellow-800' : 'bg-indigo-100 text-indigo-800'
                            }`}>
                                {entry.status}
                            </span>
                        </div>
                        {entry.date && (
                            <p className="text-lg text-gray-600 mt-2">Date: {new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default JobTimelineDisplay;