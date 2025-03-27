'use client';

import { useState, useEffect } from 'react';

export interface ProcessingStats {
  emailsFound: number;
  emailsProcessed: number;
  ordersCreated: number;
  failedEmails: number;
}

export interface ProcessingJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startedAt: string;
  completedAt: string | null;
  retailer: string;
  stats: ProcessingStats;
  error: string | null;
  settings?: {
    daysBack: number;
    maxEmails: number;
    onlyUnread: boolean;
    markAsRead: boolean;
  };
}

interface EmailProcessingNotificationProps {
  processingId: string;
  onComplete?: (job: ProcessingJob) => void;
  onError?: (error: string) => void;
  pollInterval?: number; // in milliseconds
  autoHideOnComplete?: boolean;
  autoHideDelay?: number; // in milliseconds
}

export default function EmailProcessingNotification({
  processingId,
  onComplete,
  onError,
  pollInterval = 3000,
  autoHideOnComplete = false,
  autoHideDelay = 5000,
}: EmailProcessingNotificationProps) {
  const [job, setJob] = useState<ProcessingJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);
  const [fetchCount, setFetchCount] = useState(0);

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (!job || !job.stats) return 0;
    
    const { emailsFound, emailsProcessed } = job.stats;
    
    if (emailsFound === 0) return 0;
    if (emailsProcessed >= emailsFound) return 100;
    
    return Math.round((emailsProcessed / emailsFound) * 100);
  };

  // Handle job status changes
  useEffect(() => {
    if (!job) return;

    if (job.status === 'completed' && onComplete) {
      onComplete(job);
      
      if (autoHideOnComplete) {
        const timer = setTimeout(() => {
          setVisible(false);
        }, autoHideDelay);
        
        return () => clearTimeout(timer);
      }
    }
  }, [job, onComplete, autoHideOnComplete, autoHideDelay]);

  // Poll for status updates
  useEffect(() => {
    if (!processingId || !visible) return;
    
    const fetchStatus = async () => {
      try {
        setFetchCount(count => count + 1);
        const response = await fetch(`/api/gmail/process-status?id=${processingId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch processing status');
        }
        
        const data = await response.json();
        setJob(data);
        
        // If job is complete or failed, stop polling
        if (data.status === 'completed' || data.status === 'failed') {
          if (data.status === 'failed' && onError && data.error) {
            onError(data.error);
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        if (onError) onError(errorMessage);
        
        // Stop polling after 5 consecutive errors
        if (fetchCount > 5) {
          return;
        }
      } finally {
        setLoading(false);
      }
    };
    
    // Initial fetch
    fetchStatus();
    
    // Set up polling interval
    const intervalId = setInterval(fetchStatus, pollInterval);
    
    // Clean up interval on unmount or when job completes/fails
    return () => clearInterval(intervalId);
  }, [processingId, pollInterval, visible, onError, fetchCount]);

  if (!visible) return null;
  
  if (loading && !job) {
    return (
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
        <div className="flex items-center">
          <div className="animate-spin mr-3 h-5 w-5 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-5 h-5">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p>Loading email processing status...</p>
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-sm mb-4">
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium">Failed to load processing status</p>
            <p className="mt-1 text-sm">{error}</p>
            <button 
              onClick={() => { setError(null); setFetchCount(0); setLoading(true); }}
              className="mt-2 text-red-700 hover:text-red-800 text-sm font-medium"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!job) return null;

  const progressPercentage = getProgressPercentage();
  const isComplete = job.status === 'completed';
  const isFailed = job.status === 'failed';
  
  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className={`p-4 border rounded-lg shadow-sm mb-4 ${isFailed ? 'bg-red-50 border-red-200' : isComplete ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className={`font-medium ${isFailed ? 'text-red-700' : isComplete ? 'text-green-700' : 'text-blue-700'}`}>
          {isFailed ? 'Email Processing Failed' : 
           isComplete ? 'Email Processing Complete' : 
           'Processing Emails'}
           {job.retailer ? ` - ${job.retailer}` : ''}
        </h3>
        <button 
          onClick={() => setVisible(false)}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close notification"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Progress bar */}
      {!isFailed && (
        <div className="mb-3">
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-gray-200">
              <div 
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`} 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>{progressPercentage}% complete</span>
              <span>
                {job.stats.emailsProcessed} / {job.stats.emailsFound} emails processed
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-white p-2 rounded border border-gray-200">
          <p className="text-xs text-gray-500">Emails Found</p>
          <p className="text-lg font-semibold">{job.stats.emailsFound}</p>
        </div>
        <div className="bg-white p-2 rounded border border-gray-200">
          <p className="text-xs text-gray-500">Processed</p>
          <p className="text-lg font-semibold">{job.stats.emailsProcessed}</p>
        </div>
        <div className="bg-white p-2 rounded border border-gray-200">
          <p className="text-xs text-gray-500">Orders Created</p>
          <p className="text-lg font-semibold">{job.stats.ordersCreated}</p>
        </div>
        <div className="bg-white p-2 rounded border border-gray-200">
          <p className="text-xs text-gray-500">Failed</p>
          <p className="text-lg font-semibold">{job.stats.failedEmails}</p>
        </div>
      </div>
      
      {/* Times and status */}
      <div className="text-sm text-gray-600 mt-3">
        <p><span className="font-medium">Started:</span> {formatDate(job.startedAt)}</p>
        {job.completedAt && (
          <p><span className="font-medium">Completed:</span> {formatDate(job.completedAt)}</p>
        )}
        <p className="mt-1">
          <span className="font-medium">Status:</span>
          <span className={`ml-1 ${
            job.status === 'pending' ? 'text-yellow-600' :
            job.status === 'processing' ? 'text-blue-600' :
            job.status === 'completed' ? 'text-green-600' :
            'text-red-600'
          }`}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
        </p>
      </div>
      
      {/* Error message if job failed */}
      {isFailed && job.error && (
        <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded text-red-700 text-sm">
          <p className="font-medium">Error:</p>
          <p>{job.error}</p>
        </div>
      )}
    </div>
  );
} 