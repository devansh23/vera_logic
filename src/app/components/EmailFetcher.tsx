import { useState } from 'react';

export default function EmailFetcher() {
  const [retailer, setRetailer] = useState('Myntra');
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
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
      
      if (!data.messages) {
        setEmails([]);
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

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Retailer:
        </label>
        <select
          value={retailer}
          onChange={(e) => setRetailer(e.target.value)}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="Myntra">Myntra</option>
          <option value="H&M">H&M</option>
        </select>
        <button
          onClick={fetchEmails}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Fetching...' : 'Fetch Emails'}
        </button>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <div className="mt-4">
        <h3 className="text-lg font-medium">Fetched Emails</h3>
        {emails && emails.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {emails.map((email, index) => (
              <li key={index} className="border p-2 rounded">
                <p><strong>From:</strong> {email.from || 'Unknown'}</p>
                <p><strong>Subject:</strong> {email.subject || 'No Subject'}</p>
                <p><strong>Date:</strong> {email.date || 'Unknown Date'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No emails found.</p>
        )}
      </div>
    </div>
  );
} 