import { useState } from 'react';
import { format } from 'date-fns';

// Define TypeScript interfaces for better type safety
interface EmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  snippet: string;
  body: {
    text: string;
    html: string;
  };
}

export default function EmailFetcher() {
  const [retailer, setRetailer] = useState('Myntra');
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
    setSelectedEmail(null);
    try {
      const encodedRetailer = encodeURIComponent(retailer);
      const response = await fetch(`/api/gmail/fetch-emails?retailer=${encodedRetailer}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || `Failed to fetch emails: ${response.status} ${response.statusText}`
        );
      }
      
      const data = await response.json();
      console.log('Fetched email data:', data);
      
      if (!data.messages || data.messages.length === 0) {
        setEmails([]);
        setError(`No order confirmation emails found for ${retailer}`);
        return;
      }
      
      setEmails(data.messages);
    } catch (err) {
      console.error('Error fetching emails:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Format dates to more readable format
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Unknown Date';
      const date = new Date(dateString);
      return format(date, 'PPP p'); // e.g., "April 29, 2023 at 3:36 PM"
    } catch (e) {
      return dateString || 'Unknown Date';
    }
  };

  // Extract order number from subject or snippet
  const extractOrderNumber = (email: EmailMessage) => {
    const orderRegex = /order\s*#?\s*[a-z0-9_-]+/i;
    const match = email.subject.match(orderRegex) || email.snippet.match(orderRegex);
    return match ? match[0] : 'Order Number Not Found';
  };

  // Toggle email details view
  const toggleEmailDetails = (emailId: string) => {
    setSelectedEmail(selectedEmail === emailId ? null : emailId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Retailer:
        </label>
        <select
          value={retailer}
          onChange={(e) => setRetailer(e.target.value)}
          className="block w-full sm:w-auto mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="Myntra">Myntra</option>
          <option value="H&M">H&M</option>
        </select>
        <button
          onClick={fetchEmails}
          disabled={loading}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {loading ? 'Fetching...' : 'Fetch Order Confirmation Emails'}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="px-4 py-3 text-sm bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {!loading && emails.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-4">Order Confirmation Emails ({emails.length})</h3>
          <div className="space-y-4">
            {emails.map((email) => (
              <div 
                key={email.id} 
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div 
                  className="p-4 cursor-pointer bg-gray-50 flex justify-between items-center"
                  onClick={() => toggleEmailDetails(email.id)}
                >
                  <div>
                    <h4 className="font-medium">{email.subject || 'No Subject'}</h4>
                    <p className="text-sm text-gray-600">{email.from || 'Unknown Sender'}</p>
                    <p className="text-xs text-gray-500">{formatDate(email.date)}</p>
                  </div>
                  <div className="text-blue-600">
                    {selectedEmail === email.id ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                
                {selectedEmail === email.id && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium">Order Number:</span> 
                        <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {extractOrderNumber(email)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">From:</span> <span>{email.from}</span>
                      </div>
                      <div>
                        <span className="font-medium">Subject:</span> <span>{email.subject}</span>
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> <span>{formatDate(email.date)}</span>
                      </div>
                      <div>
                        <span className="font-medium">Preview:</span>
                        <p className="mt-1 text-sm text-gray-600 border-l-2 border-gray-200 pl-3">
                          {email.snippet}...
                        </p>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <a 
                          href={`https://mail.google.com/mail/u/0/#search/rfc822msgid:${encodeURIComponent(email.id)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition-colors"
                        >
                          View in Gmail
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!loading && emails.length === 0 && !error && (
        <div className="py-8 text-center text-gray-500">
          <p>No order confirmation emails found. Click "Fetch Order Confirmation Emails" to search for order confirmations.</p>
        </div>
      )}
    </div>
  );
} 