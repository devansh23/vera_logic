'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface GmailConnectButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function GmailConnectButton({
  variant = 'primary',
  size = 'medium',
  className = '',
  onSuccess,
  onError
}: GmailConnectButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);

  // Tailwind classes based on variant and size
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
  };

  const sizeClasses = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg',
  };

  const buttonClasses = `
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    rounded-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2
    ${className}
  `;

  const connectGmail = async () => {
    if (!session?.user) {
      onError?.('You must be signed in to connect Gmail');
      return;
    }

    try {
      setIsConnecting(true);

      // Get the authorization URL
      const response = await fetch('/api/auth/gmail');
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Open in a new window
      const authWindow = window.open(
        data.authUrl, 
        '_blank', 
        'width=600,height=700'
      );
      
      // Check if auth window was blocked by popup blocker
      if (!authWindow) {
        throw new Error('Popup was blocked. Please allow popups for this site and try again.');
      }

      // Set up message listener to know when the authorization is complete
      const handleMessage = (event: MessageEvent) => {
        // Validate the origin to ensure it's our expected origin
        if (event.origin !== window.location.origin) return;
        
        if (event.data === 'gmail_auth_success') {
          window.removeEventListener('message', handleMessage);
          onSuccess?.();
          router.refresh(); // Refresh the page to update the UI
        }
      };

      window.addEventListener('message', handleMessage);
      
    } catch (error) {
      console.error('Error connecting Gmail:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to connect Gmail. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <button
      onClick={connectGmail}
      disabled={isConnecting}
      className={buttonClasses}
      aria-label="Connect Gmail"
      data-testid="gmail-connect-button"
    >
      {isConnecting ? (
        <>
          <LoadingSpinner />
          Connecting...
        </>
      ) : (
        <>
          <GmailIcon />
          Connect Gmail
        </>
      )}
    </button>
  );
}

// Simple loading spinner component
function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

// Gmail icon component
function GmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
} 