'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ProcessMyntraEmails from './process-myntra-emails';
import { useState, useEffect } from 'react';
import GmailSettings from '@/components/GmailSettings';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [gmailConnected, setGmailConnected] = useState(false);

  // Check Gmail connection status
  useEffect(() => {
    const checkGmailStatus = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/auth/gmail/status');
          const data = await response.json();
          setGmailConnected(data.connected);
        } catch (error) {
          console.error('Error checking Gmail status:', error);
        }
      }
    };
    
    checkGmailStatus();
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-b from-white to-gray-100">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-b from-white to-gray-100">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-700">
              Please sign in to access your settings.
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-b from-white to-gray-100">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <Link
            href="/"
            className="px-4 py-2 text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50 transition-colors"
          >
            Return to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
          <div className="flex items-center gap-4 mb-6">
            {session.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <p className="font-medium text-lg">{session.user?.name}</p>
              <p className="text-gray-600">{session.user?.email}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
          <GmailSettings />

          {gmailConnected && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Process Emails</h2>
              <ProcessMyntraEmails />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 