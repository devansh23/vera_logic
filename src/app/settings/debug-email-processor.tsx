'use client';

import { useState } from 'react';
import Link from 'next/link';

interface EmailContent {
  id: string;
  from: string;
  to: string;
  subject: string;
  date?: Date;
  snippet?: string;
  body?: {
    text?: string;
    html?: string;
  };
}

export default function DebugEmailProcessor() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailId, setEmailId] = useState('');
  const [emailPreview, setEmailPreview] = useState<EmailContent | null>(null);
  const [processingResult, setProcessingResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'text' | 'html' | 'result'>('preview');

  const fetchEmailDetails = async () => {
    if (!emailId.trim()) {
      setError('Please enter a valid email ID');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEmailPreview(null);
    setProcessingResult(null);

    try {
      const response = await fetch(`/api/gmail/debug-email?emailId=${encodeURIComponent(emailId)}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Failed to fetch email');
      }
      
      const data = await response.json();
      setEmailPreview(data.email);
      setProcessingResult(data.processingResult);
    } catch (err) {
      console.error('Error fetching email:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Format date if available
  const formattedDate = emailPreview?.date 
    ? new Date(emailPreview.date).toLocaleString() 
    : 'Unknown date';

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Email Processor Debugger</h2>
        <p className="text-gray-600 mb-4">
          Enter an email ID to debug why it might be failing to process correctly. The email ID can be found 
          in the Email Preview section of the Process Emails page.
        </p>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            placeholder="Enter email ID"
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={fetchEmailDetails}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-purple-300"
          >
            {isLoading ? 'Loading...' : 'Debug Email'}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}
      </div>
      
      {emailPreview && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">{emailPreview.subject}</h3>
            <div className="text-sm text-gray-600">
              <div>From: {emailPreview.from}</div>
              <div>To: {emailPreview.to}</div>
              <div>Date: {formattedDate}</div>
            </div>
          </div>
          
          <div className="border-b border-gray-200 mb-4">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('preview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'preview'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setActiveTab('text')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'text'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Text
              </button>
              <button
                onClick={() => setActiveTab('html')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'html'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                HTML
              </button>
              <button
                onClick={() => setActiveTab('result')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'result'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Processing Result
              </button>
            </nav>
          </div>
          
          <div className="mt-4">
            {activeTab === 'preview' && (
              <div>
                <h4 className="font-medium mb-2">Email Snippet</h4>
                <p className="text-gray-700 italic bg-gray-50 p-3 rounded">
                  {emailPreview.snippet || 'No preview available'}
                </p>
              </div>
            )}
            
            {activeTab === 'text' && (
              <div>
                <h4 className="font-medium mb-2">Email Text Content</h4>
                <pre className="text-xs overflow-auto bg-gray-50 p-3 rounded h-[400px]">
                  {emailPreview.body?.text || 'No text content available'}
                </pre>
              </div>
            )}
            
            {activeTab === 'html' && (
              <div>
                <h4 className="font-medium mb-2">Email HTML Content</h4>
                <div className="flex space-x-2 mb-2">
                  <button
                    onClick={() => {
                      const htmlContent = emailPreview.body?.html;
                      if (htmlContent) {
                        const blob = new Blob([htmlContent], { type: 'text/html' });
                        const url = URL.createObjectURL(blob);
                        window.open(url, '_blank');
                      }
                    }}
                    className="text-sm text-purple-600 hover:text-purple-800"
                  >
                    View in New Tab
                  </button>
                </div>
                <pre className="text-xs overflow-auto bg-gray-50 p-3 rounded h-[400px]">
                  {emailPreview.body?.html || 'No HTML content available'}
                </pre>
              </div>
            )}
            
            {activeTab === 'result' && (
              <div>
                <h4 className="font-medium mb-2">Processing Result</h4>
                {processingResult ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="font-medium text-sm text-gray-700">Order ID</p>
                        <p className="text-lg">{processingResult.orderId || 'Not found'}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="font-medium text-sm text-gray-700">Status</p>
                        <p className="text-lg">{processingResult.orderStatus || 'Unknown'}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="font-medium text-sm text-gray-700">Order Date</p>
                        <p>{processingResult.orderDate 
                          ? new Date(processingResult.orderDate).toLocaleDateString() 
                          : 'Not found'}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="font-medium text-sm text-gray-700">Total Amount</p>
                        <p>
                          {processingResult.totalAmount 
                            ? `${processingResult.currency || '₹'}${processingResult.totalAmount}` 
                            : 'Not found'}
                        </p>
                      </div>
                    </div>
                    
                    {processingResult.items && processingResult.items.length > 0 ? (
                      <div>
                        <h5 className="font-medium mb-2">Items ({processingResult.items.length})</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {processingResult.items.map((item: any, idx: number) => (
                            <div key={idx} className="border rounded-md p-3 flex items-start">
                              {item.imageUrl && (
                                <img 
                                  src={item.imageUrl} 
                                  alt={item.productName || 'Product'} 
                                  className="w-16 h-16 object-cover mr-3"
                                />
                              )}
                              <div>
                                <p className="font-medium">{item.brand || 'Unknown Brand'}</p>
                                <p className="text-sm">{item.productName || 'Unknown Product'}</p>
                                {item.price && <p className="text-sm">₹{item.price}</p>}
                                {item.size && <p className="text-xs text-gray-600">Size: {item.size}</p>}
                                {item.color && <p className="text-xs text-gray-600">Color: {item.color}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-yellow-600">No items found in the order.</p>
                    )}
                    
                    {/* Additional details could be shown here */}
                    <div className="mt-4 border-t pt-4">
                      <h5 className="font-medium mb-2">Additional Details</h5>
                      <pre className="text-xs overflow-auto bg-gray-50 p-3 rounded max-h-[200px]">
                        {JSON.stringify(processingResult, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <p className="text-yellow-600">
                    The email could not be processed. Check the email content for more information.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      <Link 
        href="/settings/process-myntra-emails"
        className="text-sm text-purple-600 hover:text-purple-800"
      >
        &larr; Back to Process Emails
      </Link>
    </div>
  );
} 