/**
 * Component for processing Myntra emails from Gmail
 * 
 * This component provides a UI for users to trigger the processing of Myntra emails
 * from their Gmail account.
 */

'use client';

import { useState } from 'react';
import { useWardrobeNotification } from '@/contexts/WardrobeNotificationContext';

interface ProcessedOrderStats {
  totalEmails: number;
  myntraEmails: number;
  processedOrders: number;
  successfullyProcessed: number;
  failedToProcess: number;
  itemsAddedToWardrobe?: number;
}

interface ProcessedOrder {
  id: string;
  orderId: string;
  items: any[];
  processed: boolean;
  wardrobeItemsAdded?: string[];
  emailId: string;
  emailDate?: Date;
  emailSubject?: string;
  emailFrom?: string;
  emailSnippet?: string;
  error?: string;
  retailer: string;
}

// Email Preview Component
const EmailPreview = ({ order }: { order: ProcessedOrder }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Update the retailer name in the order preview
  const retailerName = order.retailer === 'Myntra' ? 'Myntra' : 'H&M';

  return (
    <div className="border rounded-md p-4 mb-2 bg-white">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowDetails(!showDetails)}>
        <div>
          <div className="flex items-center">
            <span className="font-medium mr-2">{order.emailFrom || 'Unknown Sender'}</span>
            <span className="text-gray-500 text-sm">
              {order.emailDate ? new Date(order.emailDate).toLocaleString() : 'Unknown date'}
            </span>
          </div>
          <div className="font-medium">{order.emailSubject || 'No Subject'} - {retailerName}</div>
        </div>
        <svg className={`w-5 h-5 transition-transform ${showDetails ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
      
      {showDetails && (
        <div className="mt-3 border-t pt-3">
          <div className="text-sm text-gray-700 mb-2">
            <div><strong>Order ID:</strong> {order.orderId || 'Unknown'}</div>
            <div><strong>Items:</strong> {order.items?.length || 0}</div>
            {order.emailSnippet && (
              <div className="mt-2">
                <strong>Preview:</strong>
                <p className="mt-1 text-gray-600 italic">{order.emailSnippet}</p>
              </div>
            )}
          </div>
          
          {order.items?.length > 0 && (
            <div className="mt-3">
              <h4 className="font-medium mb-2">Items:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {order.items.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="text-sm border rounded p-2 flex items-center">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.productName} className="w-12 h-12 object-cover mr-2" />
                    )}
                    <div>
                      <div className="font-medium">{item.brand || 'Unknown brand'}</div>
                      <div>{item.productName || 'Unknown product'}</div>
                      {item.price && <div>₹{item.price}</div>}
                    </div>
                  </div>
                ))}
                {order.items.length > 4 && (
                  <div className="text-sm text-gray-500">+{order.items.length - 4} more items</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function ProcessMyntraEmails() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<ProcessedOrderStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [daysBack, setDaysBack] = useState(30);
  const [maxEmails, setMaxEmails] = useState(10);
  const [markAsRead, setMarkAsRead] = useState(true);
  const [onlyUnread, setOnlyUnread] = useState(true);
  const [processedOrders, setProcessedOrders] = useState<ProcessedOrder[]>([]);
  const [selectedOrderForNotification, setSelectedOrderForNotification] = useState<ProcessedOrder | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { showNotification } = useWardrobeNotification();

  const processEmails = async () => {
    setIsProcessing(true);
    setStats(null);
    setError(null);
    setProcessedOrders([]);
    setSelectedOrderForNotification(null);
    setShowPreview(false);

    try {
      const response = await fetch('/api/gmail/process-myntra-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          max: maxEmails,
          onlyUnread,
          markAsRead,
          daysBack,
          includeEmailDetails: true, // Request email details for debugging
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to process emails');
      }

      setStats(data.stats);
      setProcessedOrders(data.orders || []);
      
      // Show wardrobe notification if items were added
      if (data.stats.itemsAddedToWardrobe && data.stats.itemsAddedToWardrobe > 0) {
        // Find the first order with items added to wardrobe
        const orderWithAddedItems = data.orders?.find((order: ProcessedOrder) => 
          order.wardrobeItemsAdded && order.wardrobeItemsAdded.length > 0
        );
        
        if (orderWithAddedItems) {
          setSelectedOrderForNotification(orderWithAddedItems);
          showNotification({
            itemCount: orderWithAddedItems.wardrobeItemsAdded?.length || 0,
            orderId: orderWithAddedItems.orderId
          });
        }
      }
    } catch (err) {
      console.error('Error processing emails:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to handle when a user clicks on an order to view details
  const handleShowOrderNotification = (order: ProcessedOrder) => {
    if (order.wardrobeItemsAdded && order.wardrobeItemsAdded.length > 0) {
      setSelectedOrderForNotification(order);
      showNotification({
        itemCount: order.wardrobeItemsAdded.length,
        orderId: order.orderId
      });
    }
  };

  // Get successful orders for preview
  const successfulOrders = processedOrders.filter(order => order.processed);

  return (
    <div className="space-y-6 relative">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Days to look back: {daysBack} days
          </label>
          <input
            type="range"
            min="7"
            max="365" // Increased to 365 days per user request
            step="1"
            value={daysBack}
            onChange={(e) => setDaysBack(Number(e.target.value))}
            disabled={isProcessing}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Maximum emails to process: {maxEmails}
          </label>
          <input
            type="range"
            min="1"
            max="10000" // Increased to 10000 per user request
            step={maxEmails < 100 ? 5 : maxEmails < 1000 ? 50 : 500} // Dynamic step size
            value={maxEmails}
            onChange={(e) => setMaxEmails(Number(e.target.value))}
            disabled={isProcessing}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Only process unread emails
          </label>
          <input
            type="checkbox"
            checked={onlyUnread}
            onChange={(e) => setOnlyUnread(e.target.checked)}
            disabled={isProcessing}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Mark processed emails as read
          </label>
          <input
            type="checkbox"
            checked={markAsRead}
            onChange={(e) => setMarkAsRead(e.target.checked)}
            disabled={isProcessing}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error processing emails: {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {stats && (
        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="font-medium mb-2">Processing Results</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-gray-500">Total emails found:</p>
              <p className="font-medium">{stats.totalEmails}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Myntra emails:</p>
              <p className="font-medium">{stats.myntraEmails}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Processed successfully:</p>
              <p className="font-medium">{stats.successfullyProcessed}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Failed to process:</p>
              <p className="font-medium">{stats.failedToProcess}</p>
            </div>
            {stats.itemsAddedToWardrobe !== undefined && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Items added to wardrobe:</p>
                <p className="font-medium">{stats.itemsAddedToWardrobe}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview section */}
      {processedOrders.length > 0 && (
        <div className="bg-gray-100 p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Email Preview</h3>
            <div className="flex items-center space-x-4">
              <button 
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              
              <a 
                href="/settings/debug-email-processor" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Advanced Debug Tool
              </a>
            </div>
          </div>
          
          {showPreview && (
            <div className="mt-3 space-y-3">
              <p className="text-sm text-gray-500">Showing details of {Math.min(5, successfulOrders.length)} successfully processed emails:</p>
              {successfulOrders.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {successfulOrders.slice(0, 5).map(order => (
                    <EmailPreview key={order.emailId} order={order} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-orange-500">No emails were successfully processed.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Orders list - display first few orders */}
      {processedOrders.length > 0 && (
        <div className="bg-white shadow overflow-hidden rounded-md">
          <ul className="divide-y divide-gray-200">
            {processedOrders.slice(0, 5).map((order) => (
              <li key={order.id || order.emailId} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    {order.processed ? (
                      <>
                        <p className="font-medium">Order #{order.orderId}</p>
                        <p className="text-sm text-gray-500">
                          {order.items.length} items
                        </p>
                        {order.wardrobeItemsAdded && order.wardrobeItemsAdded.length > 0 && (
                          <button 
                            className="text-xs text-green-600 hover:underline focus:outline-none"
                            onClick={() => handleShowOrderNotification(order)}
                          >
                            {order.wardrobeItemsAdded.length} items added to wardrobe
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-red-600">Processing failed</p>
                        <p className="text-sm text-gray-500">{order.error}</p>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
            {processedOrders.length > 5 && (
              <li className="px-4 py-2 text-center text-sm text-gray-500">
                {processedOrders.length - 5} more orders processed
              </li>
            )}
          </ul>
        </div>
      )}

      <button
        onClick={processEmails}
        disabled={isProcessing}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            {stats ? 'Process Again' : 'Process Myntra Emails'}
          </>
        )}
      </button>
    </div>
  );
} 