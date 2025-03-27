'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { log } from '@/lib/logger';

interface SyncHistory {
  id: string;
  startedAt: string;
  completedAt: string | null;
  status: string;
  retailer: string | null;
  emailsFound: number | null;
  emailsProcessed: number | null;
  ordersCreated: number | null;
  failedEmails: number | null;
  errorMessage: string | null;
}

interface SyncStats {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  totalEmailsProcessed: number;
  totalOrdersCreated: number;
}

export default function GmailSyncPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncHistory, setSyncHistory] = useState<SyncHistory[]>([]);
  const [syncStats, setSyncStats] = useState<SyncStats>({
    totalJobs: 0,
    completedJobs: 0,
    failedJobs: 0,
    totalEmailsProcessed: 0,
    totalOrdersCreated: 0,
  });
  const [syncSettings, setSyncSettings] = useState({
    daysBack: 30,
    maxEmails: 10,
    onlyUnread: true,
    markAsRead: true,
  });

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    fetchSyncHistory();
  }, [session, router]);

  const fetchSyncHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/gmail/sync-history');
      const data = await response.json();
      
      if (data.success) {
        setSyncHistory(data.history);
        
        // Calculate stats
        const stats: SyncStats = {
          totalJobs: data.history.length,
          completedJobs: data.history.filter((job: SyncHistory) => job.status === 'completed').length,
          failedJobs: data.history.filter((job: SyncHistory) => job.status === 'failed').length,
          totalEmailsProcessed: data.history.reduce((sum: number, job: SyncHistory) => 
            sum + (job.emailsProcessed || 0), 0),
          totalOrdersCreated: data.history.reduce((sum: number, job: SyncHistory) => 
            sum + (job.ordersCreated || 0), 0),
        };
        setSyncStats(stats);
      } else {
        setError('Failed to fetch sync history');
      }
    } catch (err) {
      setError('Error fetching sync history');
      log('Error fetching sync history', { error: err });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const response = await fetch('/api/gmail/process-myntra-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(syncSettings),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh the history
        await fetchSyncHistory();
      } else {
        setError(data.error || 'Failed to start sync');
      }
    } catch (err) {
      setError('Error starting sync');
      log('Error starting sync', { error: err });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gmail Sync</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
          <button 
            className="text-red-700 underline mt-2" 
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      
      {/* Sync Settings */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Sync Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Days Back
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={syncSettings.daysBack}
              onChange={(e) => setSyncSettings(prev => ({
                ...prev,
                daysBack: parseInt(e.target.value)
              }))}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Emails
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={syncSettings.maxEmails}
              onChange={(e) => setSyncSettings(prev => ({
                ...prev,
                maxEmails: parseInt(e.target.value)
              }))}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={syncSettings.onlyUnread}
                onChange={(e) => setSyncSettings(prev => ({
                  ...prev,
                  onlyUnread: e.target.checked
                }))}
                className="rounded text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">
                Only Process Unread Emails
              </span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={syncSettings.markAsRead}
                onChange={(e) => setSyncSettings(prev => ({
                  ...prev,
                  markAsRead: e.target.checked
                }))}
                className="rounded text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">
                Mark Processed Emails as Read
              </span>
            </label>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleSync}
            disabled={isProcessing}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              isProcessing
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Start Sync'}
          </button>
        </div>
      </div>
      
      {/* Sync Stats */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Sync Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Jobs</div>
            <div className="text-2xl font-semibold">{syncStats.totalJobs}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Emails Processed</div>
            <div className="text-2xl font-semibold">{syncStats.totalEmailsProcessed}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Orders Created</div>
            <div className="text-2xl font-semibold">{syncStats.totalOrdersCreated}</div>
          </div>
        </div>
      </div>
      
      {/* Sync History */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Sync History</h2>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : syncHistory.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No sync history available
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Retailer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Emails
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {syncHistory.map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(job.startedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.retailer || 'All'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.emailsProcessed || 0} / {job.emailsFound || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.ordersCreated || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 