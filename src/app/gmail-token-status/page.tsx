import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import GmailTokenStatus from '@/components/GmailTokenStatus';

export default async function GmailTokenStatusPage() {
  const session = await getServerSession(authOptions);
  
  // Redirect to sign in if not authenticated
  if (!session?.user) {
    redirect('/api/auth/signin');
  }
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Gmail Token Management</h1>
      
      <div className="mb-6">
        <p className="text-gray-700 mb-4">
          This page allows you to monitor and manage your Gmail authentication tokens. 
          OAuth tokens have a limited lifespan and need to be refreshed periodically.
        </p>
        
        <p className="text-gray-700 mb-4">
          The system is configured to automatically refresh tokens before they expire, 
          but you can also force a refresh manually using the button below.
        </p>
        
        <p className="text-gray-700 mb-4">
          <strong>Note:</strong> If your token is expired for an extended period, 
          you may need to reconnect Gmail using the settings page.
        </p>
      </div>
      
      <GmailTokenStatus />
      
      <div className="mt-10 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-2">How Token Refresh Works</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>OAuth access tokens typically expire after 1 hour</li>
          <li>Our system checks token expiry before making Gmail API calls</li>
          <li>If a token is expired or near expiry (within 5 minutes), it's automatically refreshed</li>
          <li>The new token is stored in the database for future use</li>
          <li>Refresh tokens are long-lived but may occasionally need to be renewed</li>
          <li>If all tokens are invalid, you'll need to reconnect your Gmail account</li>
        </ol>
      </div>
    </div>
  );
} 