'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function GmailAuthSuccess() {
  const router = useRouter();

  // Send a message to the parent window and redirect to home page after 5 seconds
  useEffect(() => {
    // Send a message to the parent window (if opened from there)
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage('gmail_auth_success', window.location.origin);
        console.log('Sent gmail_auth_success message to parent window');
      }
    } catch (e) {
      console.error('Error sending message to parent window:', e);
    }

    // Redirect to home page after 5 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mb-6 text-green-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Gmail Connected Successfully!</h1>
        <p className="text-gray-600 mb-6">
          Your Gmail account has been successfully connected to Vera. We can now automatically process your order emails.
        </p>
        <p className="text-gray-500 mb-6">
          This window will close automatically in 5 seconds. You can also close it manually.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.close()}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close Window
          </button>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 