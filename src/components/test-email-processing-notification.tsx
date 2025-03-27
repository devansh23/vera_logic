'use client';

import { useState } from 'react';
import EmailProcessingNotification, { ProcessingJob } from './EmailProcessingNotification';

export default function TestEmailProcessingNotification() {
  const [processingId, setProcessingId] = useState<string>('');
  const [showNotification, setShowNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    setShowNotification(true);
  };

  const handleComplete = (job: ProcessingJob) => {
    setSuccessMessage(`Processing completed successfully. Found ${job.stats.emailsFound} emails, created ${job.stats.ordersCreated} orders.`);
  };

  const handleError = (error: string) => {
    setErrorMessage(`Error: ${error}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Email Processing Notification Test</h1>
      
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Test with Processing ID</h2>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label htmlFor="processingId" className="block text-sm font-medium text-gray-700 mb-1">
              Processing ID
            </label>
            <input
              type="text"
              id="processingId"
              value={processingId}
              onChange={(e) => setProcessingId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter a processing job ID"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter a valid processing job ID to test the notification component
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={!processingId}
            >
              Show Notification
            </button>
            
            <button
              type="button"
              onClick={() => setShowNotification(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Hide Notification
            </button>
          </div>
        </form>
        
        {successMessage && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}
      </div>
      
      {showNotification && processingId && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Live Notification</h2>
          <EmailProcessingNotification
            processingId={processingId}
            onComplete={handleComplete}
            onError={handleError}
            pollInterval={3000}
            autoHideOnComplete={false}
          />
        </div>
      )}
      
      <div className="bg-gray-50 p-6 border border-gray-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Component Features</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Real-time polling of job status from the API</li>
          <li>Progress bar that updates as emails are processed</li>
          <li>Detailed statistics display for found, processed, created, and failed items</li>
          <li>Color-coded statuses (blue for processing, green for complete, red for failed)</li>
          <li>Callback functions for completion and error handling</li>
          <li>Option to auto-hide after completion</li>
          <li>Configurable polling interval</li>
          <li>Error handling with retry option</li>
        </ul>
      </div>
    </div>
  );
} 