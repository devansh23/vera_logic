'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function GmailConnect() {
  const { data: session } = useSession();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const connectGmail = async () => {
    if (!session?.user) {
      setError('You must be signed in to connect Gmail');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      // Get the authorization URL
      const response = await fetch('/api/auth/gmail');
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Provide instructions before redirecting
      setShowTips(true);
      
      // Redirect after a short delay to give user time to read instructions
      setTimeout(() => {
        // Open in a new window to avoid session conflicts
        window.open(data.authUrl, '_blank', 'width=600,height=700');
      }, 1500);
      
    } catch (error) {
      console.error('Error connecting Gmail:', error);
      setError('Failed to connect Gmail. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectGmail = async () => {
    if (!session?.user) {
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      const response = await fetch('/api/auth/gmail', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setIsConnected(false);
    } catch (error) {
      console.error('Error disconnecting Gmail:', error);
      setError('Failed to disconnect Gmail. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Check if Gmail is connected when the component mounts
  const checkGmailConnection = async () => {
    if (!session?.user) {
      return;
    }

    try {
      const response = await fetch('/api/auth/gmail/status');
      const data = await response.json();

      if (data.connected) {
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error checking Gmail connection:', error);
    }
  };

  // Call checkGmailConnection when the session changes
  useEffect(() => {
    if (session?.user) {
      checkGmailConnection();
    }
  }, [session]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Gmail Integration</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
          <button 
            className="ml-2 text-red-800 underline"
            onClick={() => setShowTips(true)}
          >
            Need help?
          </button>
        </div>
      )}
      
      {showTips && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-semibold mb-2">Important Gmail Connection Tips:</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li><strong>New window:</strong> We'll open the Google sign-in process in a new window. Please allow pop-ups if prompted.</li>
            <li><strong>Account selection:</strong> If Google asks you to sign in with another account, click "Use another account" and sign in with your Gmail.</li>
            <li><strong>Permission approval:</strong> You must approve all requested permissions for the integration to work properly.</li>
            <li><strong>Separate accounts:</strong> Try using an incognito/private browsing window if you have multiple Google accounts.</li>
            <li><strong>Cookie conflicts:</strong> Consider clearing your browser cookies for Google domains if you experience persistent issues.</li>
          </ul>
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <p className="font-semibold text-yellow-800">Account Selection Issue?</p>
            <p className="text-yellow-700">If Google keeps asking you to use a different account, try signing out of all Google accounts in another tab before continuing.</p>
          </div>
          <button 
            className="mt-3 text-blue-600 text-sm"
            onClick={() => setShowTips(false)}
          >
            Hide tips
          </button>
        </div>
      )}
      
      {isConnected ? (
        <div>
          <p className="mb-4 text-green-600">
            Your Gmail account is connected! We can now automatically process your order emails.
          </p>
          <button
            onClick={disconnectGmail}
            disabled={isConnecting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isConnecting ? 'Disconnecting...' : 'Disconnect Gmail'}
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-4">
            Connect your Gmail account to automatically import products from your order emails.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={connectGmail}
              disabled={isConnecting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isConnecting ? 'Connecting...' : 'Connect Gmail'}
            </button>
            <button
              onClick={() => setShowTips(!showTips)}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              {showTips ? 'Hide Tips' : 'Show Tips'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 