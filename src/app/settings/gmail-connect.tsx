'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface GmailConnectProps {
  onConnectionChange?: (connected: boolean) => void;
}

export default function GmailConnect({ onConnectionChange }: GmailConnectProps) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [showTips, setShowTips] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if Gmail is connected
    checkGmailConnection();
  }, []);
  
  const checkGmailConnection = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/gmail/status');
      const data = await response.json();
      
      setIsConnected(data.connected);
      if (data.lastSynced) {
        setLastSynced(new Date(data.lastSynced));
      }
      
      if (onConnectionChange) {
        onConnectionChange(data.connected);
      }
    } catch (err) {
      setError('Failed to check Gmail connection status');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const connectGmail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the auth URL
      const response = await fetch('/api/auth/gmail/url');
      const data = await response.json();
      
      if (data.url) {
        // Redirect to Google auth page
        window.location.href = data.url;
      } else {
        setError('Failed to get authentication URL');
      }
    } catch (err) {
      setError('Failed to connect to Gmail');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const disconnectGmail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/gmail/disconnect', {
        method: 'POST',
      });
      
      if (response.ok) {
        setIsConnected(false);
        setLastSynced(null);
        
        if (onConnectionChange) {
          onConnectionChange(false);
        }
      } else {
        setError('Failed to disconnect Gmail');
      }
    } catch (err) {
      setError('Failed to disconnect Gmail');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleTips = () => {
    setShowTips(!showTips);
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Gmail Connection</h2>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p>{error}</p>
              <button 
                className="text-red-700 underline mt-2" 
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
            </div>
          )}
          
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="font-medium">Status:</span>
                {isConnected ? (
                  <span className="ml-2 text-green-600 font-medium">Connected</span>
                ) : (
                  <span className="ml-2 text-red-600 font-medium">Not Connected</span>
                )}
                
                {lastSynced && (
                  <div className="text-sm text-gray-500 mt-1">
                    Last synced: {lastSynced.toLocaleString()}
                  </div>
                )}
              </div>
              
              <div>
                {isConnected ? (
                  <button 
                    onClick={disconnectGmail}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button 
                    onClick={connectGmail}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Connect Gmail
                  </button>
                )}
              </div>
            </div>
            
            {!isConnected && (
              <div className="mt-2 mb-4">
                <button 
                  onClick={toggleTips}
                  className="text-blue-500 hover:text-blue-700 underline"
                >
                  {showTips ? 'Hide Tips' : 'Show Tips'}
                </button>
                
                {showTips && (
                  <div className="mt-2 bg-blue-50 p-4 rounded">
                    <h3 className="font-medium mb-2">Troubleshooting Tips:</h3>
                    <ul className="list-disc list-inside">
                      <li>If Google prompts you to sign in with another account, select "Use another account" and sign in with your desired Gmail account.</li>
                      <li>Make sure to grant all the requested permissions.</li>
                      <li>If you keep getting redirected to the wrong account, try using an incognito window or clearing your cookies.</li>
                      <li>After connecting, you'll be redirected back to this page.</li>
                    </ul>
                    
                    <div className="mt-4">
                      <Link 
                        href="#"
                        className="text-blue-500 hover:text-blue-700 underline"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open('/help/gmail-connection', '_blank');
                        }}
                      >
                        Need help?
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
} 