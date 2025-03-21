'use client';

import EmailFetcher from '@/app/components/EmailFetcher';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function EmailFetcherPage() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return <div className="p-8">Loading...</div>;
  }
  
  if (!session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Email Fetcher</h1>
        <p>You must be signed in to access this page.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Return to homepage
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Email Fetcher</h1>
      <p className="mb-4">Use this tool to fetch and view emails from your connected retailers.</p>
      <EmailFetcher />
      
      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          Return to homepage
        </Link>
      </div>
    </div>
  );
} 