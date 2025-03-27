'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GmailAuthError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorReason, setErrorReason] = useState<string>('unknown');

  // Get the error reason from the URL
  useEffect(() => {
    const reason = searchParams.get('reason') || 'unknown';
    setErrorReason(reason);
  }, [searchParams]);

  // Redirect to home page after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  // Get error message based on reason
  const getErrorMessage = () => {
    switch (errorReason) {
      case 'access_denied':
        return 'You denied the permission request.';
      case 'missing_parameters':
        return 'Required parameters were missing from the authentication request.';
      case 'token_error':
        return 'There was an error obtaining access tokens from Google.';
      case 'server_error':
        return 'A server error occurred while processing your request.';
      default:
        return 'There was an unexpected error during authentication.';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mb-6 text-red-500">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Gmail Connection Failed</h1>
        <p className="text-gray-600 mb-2">
          We couldn't connect your Gmail account.
        </p>
        <p className="text-gray-700 font-medium mb-6">
          {getErrorMessage()}
        </p>
        <ul className="text-left text-gray-600 mb-6 list-disc pl-6">
          <li>Try using an incognito/private window for the authentication</li>
          <li>Make sure you're signed into the correct Google account</li>
          <li>Clear your browser cookies for Google domains</li>
          <li>Try logging out of all Google accounts first, then try again</li>
        </ul>
        <p className="text-gray-500 mb-6">
          You will be redirected to the home page in 10 seconds...
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Return to Home
          </Link>
          <Link
            href="/settings"
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
} 