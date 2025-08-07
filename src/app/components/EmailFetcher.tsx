import { useState } from 'react';
import { format } from 'date-fns';
import GmailConnectButton from '@/components/GmailConnectButton';
import Link from 'next/link';
import { ArrowDownTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useWardrobe } from '@/contexts/WardrobeContext';
import { ConfirmationModal } from '@/components/ConfirmationFlow';
import { toast } from '@/hooks/use-toast';
import { WardrobeItem } from '@/types/wardrobe';

// Define TypeScript interfaces for better type safety
interface EmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  snippet: string;
  body?: string;
}

// Define the extraction result type
interface ExtractionResult {
  success: boolean;
  message: string;
  totalItemsFound: number;
  itemsAdded?: number;
  items: any[];
  debugKey?: string;
}

export default function EmailFetcher() {
  const [retailer, setRetailer] = useState('Myntra');
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
  const [processingEmail, setProcessingEmail] = useState<string | null>(null);
  const [processingAll, setProcessingAll] = useState(false);
  const [isAuthError, setIsAuthError] = useState(false);
  const [useDirectHtml, setUseDirectHtml] = useState(true);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const { refreshItems } = useWardrobe();
  
  // State for confirmation flow
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingItems, setPendingItems] = useState<WardrobeItem[]>([]);

  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
    setSelectedEmail(null);
    setExtractionResult(null);
    setIsAuthError(false);
    try {
      const encodedRetailer = encodeURIComponent(retailer);
      const response = await fetch(`/api/gmail/fetch-emails?retailer=${encodedRetailer}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || `Failed to fetch emails: ${response.status} ${response.statusText}`;
        
        // Check if this is an authentication error
        if (errorMessage.includes('Failed to refresh Gmail token') || 
            errorMessage.includes('User has not connected Gmail') ||
            errorMessage.includes('Missing Gmail tokens')) {
          setIsAuthError(true);
        }
        
        throw new Error(errorMessage);
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

  // Fetch items from a single email without adding to wardrobe
  const fetchEmailItems = async (emailId: string) => {
    setProcessingEmail(emailId);
    setError(null);
    setErrorDetails(null);
    
    try {
      console.log('🔍 Processing single email:', emailId);
      
      const response = await fetch('/api/wardrobe/process-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emails: [emailId],     // ✅ Fixed: Array of email IDs
          retailer,
          strategy: 'custom',
          addToWardrobe: false   // ✅ Added: Don't add to wardrobe automatically
        })
      });
      
      const data = await response.json();
      console.log('📧 API Response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to process email: ${response.status}`);
      }
      
      // ✅ Fix: Map API response to component expectations
      const mappedData = {
        success: data.success,
        message: data.message,
        totalItemsFound: data.totalProducts || 0,  // ✅ Map totalProducts to totalItemsFound
        itemsAdded: data.itemsAdded,
        items: data.products || [],                // ✅ Map products to items
        debugKey: data.debugKey
      };
      
      console.log('🔄 Mapped Data:', mappedData);
      console.log('📦 Items found:', mappedData.items.length);
      
      setExtractionResult(mappedData);
      
      // Show the result for this specific email
      setSelectedEmail(emailId);

      // If items were found, show the confirmation modal
      if (mappedData.items && mappedData.items.length > 0) {
        console.log('✅ Items found, showing confirmation modal');
        
        // Map the items to the format expected by the confirmation modal
        const wardrobeItems: WardrobeItem[] = mappedData.items.map((item: any) => ({
          id: item.id || `temp-${Date.now()}-${Math.random()}`,
          name: item.name || 'Unknown Item',
          brand: item.brand || '',
          category: item.category || '',
          imageUrl: item.imageUrl || '',
          image: item.image || '',
          price: item.price || '',
          originalPrice: item.originalPrice || '',
          discount: item.discount || '',
          size: item.size || '',
          color: item.color || '',
          productLink: item.productLink || ''
        }));
        
        console.log('👕 Wardrobe Items:', wardrobeItems);
        setPendingItems(wardrobeItems);
        setShowConfirmation(true);
        console.log('🎯 Modal should be visible now');
      } else {
        console.log('❌ No items found, modal not shown');
      }
    } catch (err) {
      console.error('Error processing email:', err);
      setError(err instanceof Error ? err.message : 'Failed to process email');
    } finally {
      setProcessingEmail(null);
    }
  };
  
  // Fetch items from all emails without adding to wardrobe
  const fetchAllEmailItems = async () => {
    if (emails.length === 0) return;
    
    setProcessingAll(true);
    setExtractionResult(null);
    setError(null);
    
    try {
      console.log('🔍 Processing all emails for retailer:', retailer);
      
      const response = await fetch('/api/wardrobe/process-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          retailer,
          maxEmails: 50,         // ✅ Fixed: Your specified value
          strategy: 'custom',
          addToWardrobe: false,  // ✅ Added: Don't add to wardrobe automatically
          onlyUnread: false,     // ✅ Added: Your specified value
          daysBack: 1500         // ✅ Added: Your specified value
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Failed to process emails: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('📧 Batch API Response:', result);
      
      // ✅ Fix: Map API response to component expectations
      const mappedResult = {
        success: result.success,
        message: result.message,
        totalItemsFound: result.totalProducts || 0,  // ✅ Map totalProducts to totalItemsFound
        itemsAdded: result.itemsAdded,
        items: result.products || [],                // ✅ Map products to items
        debugKey: result.debugKey
      };
      
      console.log('🔄 Mapped Batch Result:', mappedResult);
      console.log('📦 Items found:', mappedResult.items.length);
      
      setExtractionResult(mappedResult);

      // If items were found, show the confirmation modal
      if (mappedResult.items && mappedResult.items.length > 0) {
        console.log('✅ Items found, showing confirmation modal');
        
        // Map the items to the format expected by the confirmation modal
        const wardrobeItems: WardrobeItem[] = mappedResult.items.map((item: any) => ({
          id: item.id || `temp-${Date.now()}-${Math.random()}`,
          name: item.name || 'Unknown Item',
          brand: item.brand || '',
          category: item.category || '',
          imageUrl: item.imageUrl || '',
          image: item.image || '',
          price: item.price || '',
          originalPrice: item.originalPrice || '',
          discount: item.discount || '',
          size: item.size || '',
          color: item.color || '',
          productLink: item.productLink || '',
          emailId: item.emailId || '',
          retailer: item.retailer || retailer
        }));
        
        console.log('👕 Wardrobe Items:', wardrobeItems);
        setPendingItems(wardrobeItems);
        setShowConfirmation(true);
        console.log('🎯 Modal should be visible now');
      } else {
        console.log('❌ No items found, modal not shown');
      }
    } catch (err) {
      console.error('Error processing emails:', err);
      setError(err instanceof Error ? err.message : 'Failed to process emails');
    } finally {
      setProcessingAll(false);
    }
  };

  // Save confirmed items to wardrobe
  const handleConfirmItems = async (items: WardrobeItem[]) => {
    try {
      console.log('💾 Saving items to wardrobe:', items.length);
      
      // Use the new add-items endpoint that handles deduplication properly
      const response = await fetch('/api/wardrobe/add-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          items: items.map(item => ({
            brand: item.brand || '',
            name: item.name || '',
            price: item.price || '',
            originalPrice: item.originalPrice || '',
            discount: item.discount || '',
            size: item.size || '',
            color: item.color || '',
            imageUrl: item.imageUrl || '',
            image: item.image || '',
            productLink: item.productLink || '',
            category: item.category || '',
            source: 'email',
            sourceEmailId: item.sourceEmailId || '',
            sourceRetailer: item.sourceRetailer || retailer,
            retailer: item.sourceRetailer || retailer,
            emailId: item.sourceEmailId || '',
            orderId: item.sourceOrderId || ''
          }))
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add items to wardrobe');
      }
      
      console.log('✅ Wardrobe save result:', data);
      
      toast({
        title: "Items Added to Wardrobe",
        description: `Successfully added ${data.addedItems || items.length} items to your wardrobe.${data.duplicatesSkipped ? ` ${data.duplicatesSkipped} duplicates were skipped.` : ''}`,
      });
      
      // Close the confirmation modal
      setShowConfirmation(false);
      setPendingItems([]);
      
      // Refresh wardrobe items after successful addition
      await refreshItems();
    } catch (error) {
      console.error('Error confirming items:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to add items to wardrobe',
        variant: "destructive"
      });
    }
  };
  
  // Cancel confirmation and clear pending items
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setPendingItems([]);
  };

  // Handler for successful Gmail connection
  const handleGmailConnectSuccess = () => {
    setIsAuthError(false);
    setError(null);
    // Wait a moment for the connection to register
    setTimeout(() => {
      fetchEmails();
    }, 1000);
  };

  // Handler for Gmail connection errors
  const handleGmailConnectError = (errorMessage: string) => {
    setError(`Gmail connection error: ${errorMessage}`);
  };

  // Debug modal state
  console.log('🔍 Modal Debug:', { 
    showConfirmation, 
    pendingItemsCount: pendingItems.length,
    extractionResult: extractionResult?.totalItemsFound 
  });

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
          <option value="Zara">Zara</option>
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
          <p className="font-medium">Error:</p>
          <p>{error}</p>
          {errorDetails && (
            <div className="mt-2 p-2 bg-red-100 rounded">
              <p className="text-xs font-mono whitespace-pre-wrap">{errorDetails}</p>
            </div>
          )}
          {isAuthError && (
            <div className="mt-4 flex flex-col items-start space-y-2">
              <p className="font-medium">You need to connect your Gmail account first:</p>
              <GmailConnectButton 
                onSuccess={handleGmailConnectSuccess}
                onError={handleGmailConnectError}
                variant="primary"
              />
              <p className="text-xs mt-1">
                <Link href="/settings" className="text-blue-600 hover:underline">
                  Manage your Gmail settings
                </Link>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Show detailed error or success information even when there's no error */}
      {!error && errorDetails && (
        <div className="px-4 py-3 text-sm bg-green-50 text-green-600 rounded-lg">
          <p className="font-medium">System Information:</p>
          <p className="mt-1">{errorDetails}</p>
        </div>
      )}

      {/* Success message */}
      {extractionResult && (
        <div className={`mt-4 p-4 rounded ${extractionResult.success ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
          <h3 className="font-semibold">Processing Results</h3>
          <p>{extractionResult.message}</p>
          <div className="text-sm mt-2">
            <p>Items found: {extractionResult.totalItemsFound}</p>
            {extractionResult.itemsAdded !== undefined && (
              <p>Items added to wardrobe: {extractionResult.itemsAdded}</p>
            )}
          </div>
          {!extractionResult.success && extractionResult.totalItemsFound === 0 && (
            <div className="mt-2 text-sm text-gray-600">
              <p>No items were detected in this email. This could be because:</p>
              <ul className="list-disc list-inside mt-1">
                <li>The email isn't an order confirmation</li>
                <li>The email format isn't recognized</li>
                <li>There might be an issue with the extraction process</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Debug information section */}
      {extractionResult && selectedEmail && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="mb-4">
            <h3 className="font-semibold text-blue-700">Debug Information</h3>
            <p className="text-sm text-blue-600">
              {extractionResult.totalItemsFound} items found in the email.
            </p>
          </div>
          
          <div className="flex flex-col space-y-2">
            {/* OCR Text download button */}
            {extractionResult.debugKey && (
              <a
                href={`/api/extract-items-from-email?debugKey=${encodeURIComponent(extractionResult.debugKey)}`}
                target="_blank"
                className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                rel="noopener noreferrer"
              >
                <DocumentTextIcon className="w-4 h-4 mr-2" /> Download OCR Text
              </a>
            )}
            
            <p className="text-xs text-gray-500 mt-1">
              These debug files can help diagnose issues with item extraction.
            </p>
          </div>
        </div>
      )}

      {!loading && emails.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Order Confirmation Emails ({emails.length})</h3>
            
            <button
              onClick={fetchAllEmailItems}
              disabled={processingAll || emails.length === 0}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-green-300 transition-colors flex items-center space-x-1"
            >
              {processingAll ? (
                <>
                  <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Add All Items to Wardrobe</span>
              )}
            </button>
          </div>
          
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
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            fetchEmailItems(email.id);
                          }}
                          disabled={processingEmail === email.id}
                          className="text-sm bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100 transition-colors flex items-center"
                        >
                          {processingEmail === email.id ? (
                            <>
                              <span className="inline-block animate-spin h-3 w-3 border-2 border-green-600 border-t-transparent rounded-full mr-1"></span>
                              Processing...
                            </>
                          ) : (
                            'Add Items to Wardrobe'
                          )}
                        </button>
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
      
      {/* Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal
          items={pendingItems}
          onConfirm={handleConfirmItems}
          onCancel={handleCancelConfirmation}
          isWardrobe={false}
        />
      )}
    </div>
  );
} 