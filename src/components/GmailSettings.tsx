'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import GmailConnectButton from './GmailConnectButton';
import { GmailConnectionStatus } from '@/types/gmail';

export default function GmailSettings() {
  const { data: session } = useSession();
  const router = useRouter();
  const [status, setStatus] = useState<GmailConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  const fetchStatus = async () => {
    if (!session?.user) return;
    
    try {
      setLoading(true);
      const response = await fetch('/api/auth/gmail/status');
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch connection status');
      }
      
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      console.error('Error fetching Gmail status:', err);
      setError(err instanceof Error ? err.message : 'Failed to check connection status');
    } finally {
      setLoading(false);
    }
  };

  const disconnectGmail = async () => {
    if (!session?.user) return;
    
    try {
      setIsDisconnecting(true);
      setError(null);

      const response = await fetch('/api/auth/gmail/disconnect', {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to disconnect Gmail');
      }

      // Update local state
      setStatus(prev => prev ? { ...prev, connected: false } : null);
      router.refresh(); // Refresh the page to update session data
    } catch (err) {
      console.error('Error disconnecting Gmail:', err);
      setError(err instanceof Error ? err.message : 'Failed to disconnect Gmail');
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleConnectSuccess = () => {
    fetchStatus();
    router.refresh(); // Refresh the page to update session data
  };

  const handleConnectError = (errorMessage: string) => {
    setError(errorMessage);
  };

  // Fetch connection status when component mounts or session changes
  useEffect(() => {
    if (session?.user) {
      fetchStatus();
    }
  }, [session]);

  // Format date for display
  const formatDate = (dateValue: Date | string | null) => {
    if (!dateValue) return 'Never';
    // Convert to Date object if it's a string
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <svg className="w-6 h-6 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" />
              <path d="M22 6L12 13L2 6" fill="white" />
            </svg>
            Gmail Integration
          </h2>
          
          {status?.connected && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
              Connected
            </span>
          )}
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            <div className="flex items-start">
              <svg className="h-5 w-5 mr-2 mt-0.5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
                <button 
                  className="mt-2 text-sm font-medium text-red-700 hover:text-red-800"
                  onClick={() => setShowTips(true)}
                >
                  Need help?
                </button>
              </div>
              <button 
                className="ml-auto -mt-1 text-red-500 hover:text-red-700"
                onClick={() => setError(null)}
                aria-label="Dismiss"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin h-5 w-5 mr-3 border-2 border-gray-500 border-t-blue-600 rounded-full"></div>
            <p className="text-gray-600">Checking connection status...</p>
          </div>
        ) : status?.connected ? (
          <div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <p className="text-green-800 font-medium">
                    Gmail account connected successfully
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    We can now automatically process your order emails
                  </p>
                </div>
                <button
                  onClick={disconnectGmail}
                  disabled={isDisconnecting}
                  className="mt-3 sm:mt-0 px-4 py-2 bg-white border border-red-500 text-red-600 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isDisconnecting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Disconnecting...
                    </>
                  ) : (
                    <>Disconnect Gmail</>
                  )}
                </button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <button 
                onClick={() => setSettingsExpanded(!settingsExpanded)}
                className="flex items-center text-gray-700 hover:text-gray-900 font-medium focus:outline-none"
              >
                <svg 
                  className={`h-5 w-5 mr-1 transition-transform ${settingsExpanded ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Connection Details
              </button>
              
              {settingsExpanded && (
                <div className="mt-3 text-sm space-y-2 text-gray-600">
                  <p><span className="font-medium">Last Synced:</span> {formatDate(status.lastSynced)}</p>
                  <p className="text-xs mt-4">
                    To revoke access on Google's side, visit 
                    <a 
                      href="https://myaccount.google.com/permissions" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 ml-1"
                    >
                      Google Account Permissions
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-6">
              Connect your Gmail account to automatically process order confirmation emails and track your purchases.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <GmailConnectButton 
                onSuccess={handleConnectSuccess}
                onError={handleConnectError}
              />
              
              <button
                onClick={() => setShowTips(!showTips)}
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {showTips ? 'Hide Tips' : 'Show Tips'}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Connection tips section */}
      {showTips && (
        <div className="p-4 bg-blue-50 border-t border-blue-200">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-blue-800">Important Gmail Connection Tips:</h3>
            <button 
              onClick={() => setShowTips(false)}
              className="text-blue-500 hover:text-blue-700"
              aria-label="Close tips"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <ul className="list-disc pl-5 space-y-2 text-sm text-blue-800">
            <li><strong>New window:</strong> We'll open the Google sign-in process in a new window. Please allow pop-ups if prompted.</li>
            <li><strong>Account selection:</strong> If Google asks you to sign in with another account, click "Use another account" and sign in with your Gmail.</li>
            <li><strong>Permission approval:</strong> You must approve all requested permissions for the integration to work properly.</li>
            <li><strong>Separate accounts:</strong> Try using an incognito/private browsing window if you have multiple Google accounts.</li>
            <li><strong>Cookie conflicts:</strong> Consider clearing your browser cookies for Google domains if you experience persistent issues.</li>
          </ul>
          
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <p className="font-medium text-yellow-800">Account Selection Issue?</p>
            <p className="text-yellow-700">If Google keeps asking you to use a different account, try signing out of all Google accounts in another tab before continuing.</p>
          </div>
        </div>
      )}
    </div>
  );
} 