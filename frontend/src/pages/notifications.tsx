// Frontend component to display the notifications fetched from the backend.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Notification } from '@prisma/client'; // Assuming Prisma types are generated and available
import { ArrowLeft, Clock } from 'lucide-react';

interface NotificationData {
  id: number;
  type: string;
  message: string;
  recipientId: string;
  eventType: string;
  status: string;
  createdAt: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch notifications specifically for the logged-in user's context (simulated)
        const response = await axios.get<Notification[]>('/api/notifications'); 
        setNotifications(response.data);
      } catch (err) {
        setError("Failed to load notifications.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-50">Loading Notifications...</div>;
  }

  if (error) {
    return <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>;
  }

  return (
    <div className="p-8 bg-white min-h-screen">
      <header className="flex items-center justify-between mb-6 pb-4 border-b">
        <h1 className="text-3xl font-bold text-gray-900">Notification Pipeline</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            View Dashboard
        </button>
      </header>

      {notifications.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <Clock className="w-10 h-10 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600">No new notifications found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              className={`p-5 border rounded-xl shadow-md transition duration-300 ${n.status === 'PENDING' ? 'bg-yellow-50 border-yellow-300' : 'bg-gray-50 border-gray-200'}`}
            >
              <div className="flex justify-between items-start">
                <h2 className={`text-xl font-semibold ${n.type === 'ESCROW' ? 'text-green-600' : 'text-indigo-700'}`}>
                    {n.type} Alert
                </h2>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${n.status === 'PENDING' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                    {n.status}
                </span>
              </div>
              <p className="mt-3 text-gray-700 mb-4 border-l-4 border-indigo-400 pl-3">{n.message}</p>
              <div className="flex justify-between pt-2 border-t">
                <div className="text-sm text-gray-500 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Submitted: {new Date(n.createdAt).toLocaleString()}
                </div>
                {n.status === 'PENDING' && (
                    <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                        Acknowledge & Notify
                    </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;