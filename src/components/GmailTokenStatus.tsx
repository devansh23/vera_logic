'use client';

import React, { useState, useEffect } from 'react';
import { log } from '@/lib/logger';

interface TokenStatus {
  connected: boolean;
  tokenExpiry: string | null;
  isTokenExpired: boolean;
  lastSynced: string | null;
}

interface TokenStatusResponse {
  success: boolean;
  status: TokenStatus;
}

interface TokenRefreshResponse {
  success: boolean;
  message: string;
  before: TokenStatus;
  after: TokenStatus;
  tokenDetails: {
    tokenRefreshed: boolean;
    newExpiry: string;
  };
}

export default function GmailTokenStatus() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenStatus, setTokenStatus] = useState<TokenStatus | null>(null);
  const [refreshHistory, setRefreshHistory] = useState<{
    timestamp: string;
    before: TokenStatus;
    after: TokenStatus;
  }[]>([]);

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleString();
  };

  // Get token status
  const fetchTokenStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/gmail/token-status');
      const data: TokenStatusResponse = await response.json();
      
      if (data.success) {
        setTokenStatus(data.status);
      } else {
        setError(data.status ? 'Failed to fetch token status' : 'Not connected to Gmail');
      }
    } catch (err) {
      setError('Error fetching token status');
      log('Error fetching token status', { error: err });
    } finally {
      setLoading(false);
    }
  };

  // Force token refresh
  const refreshToken = async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      const response = await fetch('/api/gmail/token-status', {
        method: 'POST',
      });
      
      const data: TokenRefreshResponse = await response.json();
      
      if (data.success) {
        setTokenStatus(data.after);
        setRefreshHistory(prev => [
          {
            timestamp: new Date().toISOString(),
            before: data.before,
            after: data.after
          },
          ...prev
        ]);
      } else {
        setError('Failed to refresh token');
      }
    } catch (err) {
      setError('Error refreshing token');
      log('Error refreshing token', { error: err });
    } finally {
      setRefreshing(false);
    }
  };

  // Fetch token status on component mount
  useEffect(() => {
    fetchTokenStatus();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Gmail Token Status</h2>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : tokenStatus ? (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Connection Status:</span>
              <span className={`px-3 py-1 rounded text-sm ${tokenStatus.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {tokenStatus.connected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Token Status:</span>
              <span className={`px-3 py-1 rounded text-sm ${tokenStatus.isTokenExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {tokenStatus.isTokenExpired ? 'Expired' : 'Valid'}
              </span>
            </div>
            
            <div className="mb-2">
              <span className="font-medium">Expires:</span>
              <span className="ml-2">{formatDate(tokenStatus.tokenExpiry)}</span>
            </div>
            
            <div className="mb-2">
              <span className="font-medium">Last Synced:</span>
              <span className="ml-2">{formatDate(tokenStatus.lastSynced)}</span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={refreshToken} 
              disabled={refreshing || !tokenStatus.connected}
              className={`px-4 py-2 rounded text-white ${
                refreshing || !tokenStatus.connected
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {refreshing ? 'Refreshing...' : 'Force Token Refresh'}
            </button>
            
            <button 
              onClick={fetchTokenStatus} 
              disabled={loading}
              className={`px-4 py-2 rounded ${
                loading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {loading ? 'Loading...' : 'Refresh Status'}
            </button>
          </div>
        </div>
      ) : (
        <div>No token status available</div>
      )}
      
      {refreshHistory.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Refresh History</h3>
          <div className="border rounded-lg divide-y">
            {refreshHistory.map((entry, i) => (
              <div key={i} className="p-3">
                <div className="text-sm text-gray-500 mb-2">
                  {new Date(entry.timestamp).toLocaleString()}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Before</div>
                    <div className="text-sm">
                      Expired: <span className={entry.before.isTokenExpired ? 'text-red-600' : 'text-green-600'}>
                        {entry.before.isTokenExpired ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="text-sm">
                      Expiry: {formatDate(entry.before.tokenExpiry)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">After</div>
                    <div className="text-sm">
                      Expired: <span className={entry.after.isTokenExpired ? 'text-red-600' : 'text-green-600'}>
                        {entry.after.isTokenExpired ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="text-sm">
                      Expiry: {formatDate(entry.after.tokenExpiry)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 