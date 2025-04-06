'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

// Types for extracted items and processing states
interface ExtractedItem {
  id?: string;
  name: string;
  brand?: string;
  price?: string;
  image?: string;
  croppedImage?: string;
  size?: string;
  color?: string;
  status: 'pending' | 'success' | 'error';
  cropStatus?: 'pending' | 'success' | 'error' | 'warning' | 'partial';
  cropMessage?: string;
  saveStatus?: 'pending' | 'success' | 'error';
  error?: string;
  originalImage?: string;
  retailer?: string;
  category?: string;
  itemUrl?: string;
  // Additional fields used in the API call
  originalPrice?: string;
  discount?: string;
  productLink?: string;
  myntraLink?: string;
  emailId?: string;
  sourceRetailer?: string;
  reference?: string;
}

interface EmailSelection {
  id: string;
  subject: string;
  retailer: string;
}

interface GmailEmail {
  id: string;
  from: string;
  to: string;
  subject: string;
  date?: Date;
  snippet: string;
}

// Response item type for API responses
interface ApiResponseItem {
  id: string;
  brand: string;
  name: string;
  price: string;
  originalPrice: string;
  discount: string;
  size: string;
  color: string;
  image: string;
  productLink: string;
  [key: string]: unknown;
}

export default function EmailDebugPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  // State for the three stages
  const [emailSelection, setEmailSelection] = useState<EmailSelection | null>(null);
  const [selectedRetailer, setSelectedRetailer] = useState<string>('zara');
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingEmails, setIsFetchingEmails] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [debugJson, setDebugJson] = useState<string>('');
  const [availableEmails, setAvailableEmails] = useState<GmailEmail[]>([]);
  const [showEmailSelector, setShowEmailSelector] = useState<boolean>(false);
  const [lastSaveTimestamp, setLastSaveTimestamp] = useState<number>(0);
  const SAVE_DEBOUNCE_TIME = 3000; // 3 seconds between allowed save attempts
  
  // Handle retailer selection
  const handleRetailerChange = (retailer: string) => {
    setSelectedRetailer(retailer);
    setEmailSelection(null);
    setAvailableEmails([]);
    setShowEmailSelector(false);
  };

  // Format date for display
  const formatDate = (dateString?: string | Date): string => {
    if (!dateString) return 'Unknown date';
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Fetch emails from Gmail
  const fetchEmails = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication Error",
        description: "You must be signed in to use this feature.",
        variant: "destructive"
      });
      return;
    }
    
    setIsFetchingEmails(true);
    setErrorMessage('');
    
    try {
      const response = await fetch(`/api/gmail/fetch-emails?retailer=${selectedRetailer}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch emails: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.messages && Array.isArray(data.messages) && data.messages.length > 0) {
        setAvailableEmails(data.messages);
        setShowEmailSelector(true);
        
        toast({
          title: "Emails Fetched",
          description: `Found ${data.messages.length} emails from ${selectedRetailer}.`,
        });
      } else {
        toast({
          title: "No Emails Found",
          description: `No emails found from ${selectedRetailer}.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
      toast({
        title: "Failed to Fetch Emails",
        description: error instanceof Error ? error.message : 'Failed to fetch emails',
        variant: "destructive"
      });
    } finally {
      setIsFetchingEmails(false);
    }
  };
  
  // Select an email
  const handleSelectEmail = (email: GmailEmail) => {
    setEmailSelection({
      id: email.id,
      subject: email.subject || 'No Subject',
      retailer: selectedRetailer
    });
    setShowEmailSelector(false);
  };
  
  // Step 1: Extract items from email
  const handleExtractItems = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication Error",
        description: "You must be signed in to use this feature.",
        variant: "destructive"
      });
      return;
    }
    
    if (!emailSelection) {
      toast({
        title: "No Email Selected",
        description: "Please select an email to extract items from.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Use the debug API endpoint instead of the regular one
      const response = await fetch('/api/wardrobe/add-from-emails-html-debug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailId: emailSelection.id,
          retailer: selectedRetailer,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract items from email');
      }
      
      // Create a structured debug JSON for inspection
      setDebugJson(JSON.stringify(data, null, 2));
      
      if (data.items && Array.isArray(data.items)) {
        // Get the items with initial status - but don't modify the image URLs yet
        const updatedItems = data.items.map((item: ApiResponseItem) => ({
          ...item,
          status: 'success' as const,
          cropStatus: 'pending' as const,
          saveStatus: 'pending' as const,
          originalImage: item.image, // Keep a copy of the original image URL
        }));
        setExtractedItems(updatedItems);
        
        toast({
          title: "Items Extracted",
          description: `Successfully extracted ${updatedItems.length} items from the email.`,
        });
        
        // Move to the next step if items were found
        if (updatedItems.length > 0) {
          setCurrentStep(2);
        }
      } else {
        toast({
          title: "No Items Found",
          description: "No items were found in the selected email.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error extracting items:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
      toast({
        title: "Extraction Failed",
        description: error instanceof Error ? error.message : 'Failed to extract items from email',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Step 2: Run image cropping
  const handleRunCropping = async () => {
    if (extractedItems.length === 0) {
      toast({
        title: "No Items to Process",
        description: "There are no items to run cropping on.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Process items one by one
    const updatedItems = [...extractedItems];
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < updatedItems.length; i++) {
      const item = updatedItems[i];
      
      // Update status to pending
      updatedItems[i] = { ...item, cropStatus: 'pending' };
      setExtractedItems([...updatedItems]);
      
      try {
        // Skip if no image URL is available
        if (!item.image) {
          updatedItems[i] = { ...item, cropStatus: 'error', error: 'No image URL available' };
          errorCount++;
          continue;
        }
        
        // Get the image data from the URL
        let imageData;
        try {
          // Fetch the original image URL
          const response = await fetch(item.image);
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status}`);
          }
          imageData = await response.arrayBuffer();
        } catch (fetchError) {
          console.error(`Error fetching image for ${item.name}:`, fetchError);
          updatedItems[i] = { 
            ...item, 
            cropStatus: 'error', 
            error: `Failed to fetch image: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`
          };
          errorCount++;
          continue;
        }
        
        // Create form data with image and item name
        const formData = new FormData();
        formData.append('image', new Blob([imageData]), 'image.jpg');
        formData.append('itemName', item.name);
        
        console.log(`Sending cropping request for item: ${item.name}`);
        
        // Call extract-item API explicitly
        const cropResponse = await fetch('/api/extract-item', {
          method: 'POST',
          body: formData,
        });
        
        if (!cropResponse.ok) {
          const errorData = await cropResponse.json().catch(() => ({}));
          console.error('Cropping API error response:', errorData);
          throw new Error(`Cropping failed with status: ${cropResponse.status}${errorData.error ? ` - ${errorData.error}` : ''}`);
        }
        
        // Convert the cropped image to base64
        const croppedImageBuffer = await cropResponse.arrayBuffer();
        
        // Check if the response is valid and different from the original
        if (!croppedImageBuffer || croppedImageBuffer.byteLength === 0) {
          throw new Error('Received empty response from cropping API');
        }
        
        // Generate a unique identifier for this cropped image to prevent caching issues
        const timestamp = new Date().getTime();
        
        const base64String = btoa(
          new Uint8Array(croppedImageBuffer)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        const croppedImageDataUrl = `data:image/png;base64,${base64String}`;
        
        // Log information about the difference
        console.log(`Item ${item.name} - Original image length: ${imageData.byteLength}, Cropped image length: ${croppedImageBuffer.byteLength}`);
        
        // Compare sizes to detect if cropping actually occurred
        const sizeDifference = Math.abs(imageData.byteLength - croppedImageBuffer.byteLength);
        const percentDifference = (sizeDifference / imageData.byteLength) * 100;
        
        // Check the content length to see if this might be a mock image
        // Mock images are usually very small (less than 1KB for a white rectangle)
        const isMockImage = croppedImageBuffer.byteLength < 1024;
        
        // Check if the cropped image is suspiciously similar to the original
        const isSameAsOriginal = percentDifference < 5;
        
        // Determine the actual cropStatus based on our analysis
        let actualCropStatus = 'success' as const;
        let cropMessage = '';
        
        // Check headers for information about fallback cropping
        const cropMethod = cropResponse.headers.get('X-Crop-Method');
        const baseItemType = cropResponse.headers.get('X-Base-Item-Type');
        const detectedClass = cropResponse.headers.get('X-Detection-Class');
        const availablePredictions = cropResponse.headers.get('X-Available-Predictions');
        
        // Create a detailed diagnostic message
        let diagInfo = [];
        
        if (baseItemType) {
          diagInfo.push(`Base type: ${baseItemType}`);
        }
        
        if (detectedClass) {
          diagInfo.push(`Detected: ${detectedClass}`);
        }
        
        if (availablePredictions) {
          try {
            const predictions = JSON.parse(availablePredictions);
            if (predictions && predictions.length > 0) {
              diagInfo.push(`Available classes: ${predictions.join(', ')}`);
            }
          } catch (e) {
            // Ignore parsing errors
          }
        }
        
        if (cropMethod && cropMethod.includes('manual-fallback')) {
          console.warn(`Using fallback cropping for ${item.name} - Roboflow did not detect objects`);
          cropMessage = 'Using manual fallback cropping (Roboflow did not detect objects)';
          if (diagInfo.length > 0) {
            cropMessage += ` [${diagInfo.join(' | ')}]`;
          }
          actualCropStatus = 'warning' as any;
        } else if (isMockImage) {
          console.warn(`Warning: Cropped image for ${item.name} appears to be a mock response`);
          cropMessage = 'Received mock image (API key missing?)';
          actualCropStatus = 'warning' as any;
        } else if (isSameAsOriginal) {
          console.warn(`Warning: Cropped image for ${item.name} is very similar to original (${percentDifference.toFixed(2)}% difference)`);
          cropMessage = `No meaningful cropping detected (${percentDifference.toFixed(0)}% diff)`;
          if (diagInfo.length > 0) {
            cropMessage += ` [${diagInfo.join(' | ')}]`;
          }
          actualCropStatus = 'partial' as any;
        } else if (diagInfo.length > 0) {
          cropMessage = diagInfo.join(' | ');
        }
        
        // Update the item with the cropped image while preserving the original
        updatedItems[i] = {
          ...item,
          croppedImage: `${croppedImageDataUrl}#t=${timestamp}`,
          cropStatus: actualCropStatus,
          cropMessage: cropMessage
        };
        successCount++;
      } catch (error) {
        console.error(`Error cropping item ${item.name}:`, error);
        updatedItems[i] = {
          ...item,
          cropStatus: 'error',
          error: error instanceof Error ? error.message : 'Cropping failed',
        };
        errorCount++;
      }
      
      // Update the state with the current progress
      setExtractedItems([...updatedItems]);
    }
    
    setIsLoading(false);
    
    toast({
      title: "Cropping Complete",
      description: `Processed ${updatedItems.length} items: ${successCount} successful, ${errorCount} failed.`,
      variant: successCount > errorCount ? "default" : "destructive"
    });
    
    if (successCount > 0) {
      setCurrentStep(3);
    }
  };
  
  // Step 3: Add to wardrobe
  const handleAddToWardrobe = async () => {
    if (extractedItems.length === 0) {
      toast({
        title: "No Items to Add",
        description: "There are no items to add to your wardrobe.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if we're already in the process of saving or if any items have already been saved
    // This prevents multiple rapid save operations
    if (isLoading || extractedItems.some(item => item.saveStatus === 'success')) {
      toast({
        title: "Save In Progress",
        description: "Please wait for the current save operation to complete.",
      });
      return;
    }
    
    // Debounce save operations
    const now = Date.now();
    if (now - lastSaveTimestamp < SAVE_DEBOUNCE_TIME) {
      toast({
        title: "Please Wait",
        description: `Please wait a moment before trying to save again.`,
      });
      return;
    }
    
    setLastSaveTimestamp(now);
    setIsLoading(true);
    
    // Filter for items that were successfully cropped or have original images
    const itemsToAdd = extractedItems.filter(
      item => item.cropStatus === 'success' || item.status === 'success'
    );
    
    if (itemsToAdd.length === 0) {
      toast({
        title: "No Valid Items",
        description: "There are no valid items to add to your wardrobe.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Mark all items as pending save before making the API call
    setExtractedItems(prev => prev.map(item => ({
      ...item,
      saveStatus: 'pending' as const
    })));
    
    // Convert items to the format expected by the API
    const wardrobeItems = itemsToAdd.map(item => ({
      brand: item.brand,
      name: item.name,
      price: item.price || '',
      originalPrice: item.originalPrice || '',
      discount: item.discount || '',
      size: item.size || '',
      color: item.color || '',
      // Use the cropped image if available and cropping was successful,
      // otherwise use the original image
      imageUrl: (item.cropStatus === 'success' && item.croppedImage) 
        ? item.croppedImage 
        : item.image,
      productLink: item.productLink || '',
      emailId: emailSelection?.id || '',
      retailer: selectedRetailer
    }));
    
    try {
      // Call the API to add items to wardrobe
      const response = await fetch('/api/wardrobe/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: wardrobeItems }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add items to wardrobe');
      }
      
      // Update the save status for each item
      const updatedItems = extractedItems.map(item => {
        const matchingItem = data.updatedItems?.find(
          (addedItem: ApiResponseItem) => addedItem.name === item.name && addedItem.brand === item.brand
        );
        
        return {
          ...item,
          saveStatus: matchingItem ? 'success' as const : 'error' as const,
        };
      });
      
      setExtractedItems(updatedItems);
      
      toast({
        title: "Items Added to Wardrobe",
        description: `Successfully added ${data.count} items to your wardrobe.`,
      });
    } catch (error) {
      console.error('Error adding items to wardrobe:', error);
      toast({
        title: "Failed to Add Items",
        description: error instanceof Error ? error.message : 'Failed to add items to wardrobe',
        variant: "destructive"
      });
      
      // Reset save status for failed items
      setExtractedItems(prev => prev.map(item => ({
        ...item,
        saveStatus: item.saveStatus === 'pending' ? undefined : item.saveStatus
      })));
    } finally {
      setIsLoading(false);
      // Update the save timestamp to prevent multiple quick saves
      setLastSaveTimestamp(Date.now());
    }
  };
  
  // Handle copying debug JSON
  const handleCopyDebugJson = () => {
    navigator.clipboard.writeText(debugJson);
    toast({
      title: "Debug JSON Copied",
      description: "Debug JSON has been copied to clipboard.",
    });
  };
  
  // Status badge component
  const StatusBadge = ({ status }: { status: 'pending' | 'success' | 'error' | 'warning' | 'partial' | undefined }) => {
    if (!status) return null;
    
    const statusMap = {
      pending: { text: '⏳ Pending', color: 'bg-yellow-100 text-yellow-800' },
      success: { text: '✅ Success', color: 'bg-green-100 text-green-800' },
      error: { text: '❌ Failed', color: 'bg-red-100 text-red-800' },
      warning: { text: '⚠️ Warning', color: 'bg-orange-100 text-orange-800' },
      partial: { text: '🔍 Partial', color: 'bg-blue-100 text-blue-800' },
    };
    
    const { text, color } = statusMap[status];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {text}
      </span>
    );
  };
  
  // Update debug JSON on any significant state change
  useEffect(() => {
    if (extractedItems.length > 0) {
      const debug = {
        sessionUser: session?.user,
        selectedEmail: emailSelection,
        selectedRetailer,
        extractedItems: extractedItems.map(item => ({
          ...item,
          image: item.image ? '[IMAGE URL]' : null,
          croppedImage: item.croppedImage ? '[CROPPED IMAGE URL]' : null
        })),
        processingSteps: {
          emailSelection: !!emailSelection,
          itemsExtracted: extractedItems.length > 0,
          croppingRun: extractedItems.some(item => item.cropStatus !== 'pending'),
          wardrobe: extractedItems.some(item => item.saveStatus === 'success'),
          currentStep
        }
      };
      setDebugJson(JSON.stringify(debug, null, 2));
    }
  }, [extractedItems, emailSelection, selectedRetailer, currentStep, session?.user]);
  
  // Check API Key
  const handleCheckApiKey = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/extract-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ checkApiKey: true }),
      });
      
      const data = await response.json();
      
      if (data.apiKeyPresent) {
        toast({
          title: "API Key Check",
          description: "Roboflow API key is correctly configured.",
        });
      } else {
        toast({
          title: "API Key Missing",
          description: "Roboflow API key is not configured. Cropping will use mock responses.",
          variant: "warning"
        });
      }
    } catch (error) {
      console.error('API key check failed:', error);
      toast({
        title: "API Key Check Failed",
        description: error instanceof Error ? error.message : 'Failed to check API key',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test Roboflow connection with a sample image
  const handleTestRoboflow = async () => {
    try {
      setIsLoading(true);
      
      toast({
        title: "Testing Roboflow",
        description: "Sending test request to Roboflow API...",
      });
      
      const response = await fetch('/api/extract-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testRoboflow: true }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Roboflow Test Successful",
          description: "Successfully connected to Roboflow API and received predictions.",
        });
        
        // Show predictions in debug JSON
        setDebugJson(JSON.stringify(data, null, 2));
      } else {
        toast({
          title: "Roboflow Test Failed",
          description: data.error || "Failed to get valid response from Roboflow",
          variant: "warning"
        });
      }
    } catch (error) {
      console.error('Roboflow test failed:', error);
      toast({
        title: "Roboflow Test Failed",
        description: error instanceof Error ? error.message : 'Failed to test Roboflow',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Email Debug Tool</h1>
        <p>Please sign in to use this feature.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Email Debug Tool</h1>
      <p className="mb-6 text-gray-600">
        This tool helps debug the Gmail-based item upload flow by breaking the process into clear, controlled steps.
      </p>
      
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md">
          <h3 className="font-bold">Error</h3>
          <p>{errorMessage}</p>
        </div>
      )}
      
      <div className="mb-8 bg-gray-100 p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-4">Step 1: Select Email & Extract Items</h2>
        
        <div className="mb-4">
          <p className="mb-2">Select retailer:</p>
          <div className="flex space-x-2">
            {['zara', 'h&m', 'myntra'].map((retailer) => (
              <Button
                key={retailer}
                variant={selectedRetailer === retailer ? "default" : "outline"}
                onClick={() => handleRetailerChange(retailer)}
                className="capitalize"
              >
                {retailer}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <Button 
            onClick={fetchEmails}
            disabled={isLoading || isFetchingEmails}
            variant="outline"
          >
            {isFetchingEmails ? 'Fetching Emails...' : 'Fetch Emails'}
          </Button>
          
          {emailSelection && (
            <div className="mt-2 p-2 border rounded-md bg-white">
              <p className="font-medium">{emailSelection.subject}</p>
              <p className="text-sm text-gray-500">ID: {emailSelection.id}</p>
            </div>
          )}
          
          {showEmailSelector && availableEmails.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Select an email to extract items from:</h3>
              <ScrollArea className="h-[250px] border rounded-md bg-white p-2">
                {availableEmails.map((email) => (
                  <div 
                    key={email.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-0"
                    onClick={() => handleSelectEmail(email)}
                  >
                    <p className="font-medium">{email.subject || 'No Subject'}</p>
                    <p className="text-sm text-gray-600">{email.from || 'Unknown Sender'}</p>
                    <p className="text-xs text-gray-500">{formatDate(email.date)}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{email.snippet}</p>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
        </div>
        
        <Button
          onClick={handleExtractItems}
          disabled={!emailSelection || isLoading}
          className="mt-2"
        >
          🛠 Extract Items from Email
        </Button>
      </div>
      
      {extractedItems.length > 0 && (
        <>
          <div className={`mb-8 bg-gray-100 p-4 rounded-md ${currentStep < 2 ? 'opacity-50' : ''}`}>
            <h2 className="text-xl font-semibold mb-4">Step 2: Run Image Cropping</h2>
            <p className="mb-4 text-sm text-gray-600">
              {extractedItems.length} items extracted. Click below to run the cropping process on each item.
            </p>
            
            <div className="flex space-x-2">
              <Button
                onClick={handleRunCropping}
                disabled={isLoading || !extractedItems.length}
                className="bg-sky-600 hover:bg-sky-700"
              >
                {isLoading ? 'Running...' : '🔍 Run Cropping on Extracted Items'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleCheckApiKey}
                disabled={isLoading}
                size="sm"
              >
                🔑 Check API Key
              </Button>
              
              <Button
                variant="outline"
                onClick={handleTestRoboflow}
                disabled={isLoading}
                size="sm"
              >
                🚀 Test Roboflow API
              </Button>
            </div>
            
            <div className="mt-4">
              <ScrollArea className="h-[600px] border rounded-md bg-white p-4">
                {extractedItems.map((item, index) => (
                  <div key={index} className="mb-8 border-b pb-4">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-1/2 p-2">
                        <h3 className="font-bold">{item.name}</h3>
                        <div className="mt-2 text-sm">
                          <p className="mb-1"><span className="font-medium">Brand:</span> {item.brand || 'Unknown'}</p>
                          <p className="mb-1"><span className="font-medium">Price:</span> {item.price || 'Unknown'}</p>
                          {item.size && <p className="mb-1"><span className="font-medium">Size:</span> {item.size}</p>}
                          {item.color && <p className="mb-1"><span className="font-medium">Color:</span> {item.color}</p>}
                          {item.retailer && <p className="mb-1"><span className="font-medium">Retailer:</span> {item.retailer}</p>}
                          {item.category && <p className="mb-1"><span className="font-medium">Category:</span> {item.category}</p>}
                          {item.itemUrl && (
                            <p className="mb-1">
                              <span className="font-medium">URL:</span>{" "}
                              <a href={item.itemUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline truncate inline-block max-w-xs">
                                {item.itemUrl.substring(0, 30)}...
                              </a>
                            </p>
                          )}
                        </div>
                        
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center">
                            <span className="font-medium text-sm min-w-20">Extraction:</span>
                            <StatusBadge status={item.status} />
                          </div>
                          
                          <div className="flex items-center">
                            <span className="font-medium text-sm min-w-20">Cropping:</span>
                            <StatusBadge status={item.cropStatus} />
                          </div>
                          
                          <div className="flex items-center">
                            <span className="font-medium text-sm min-w-20">Save Status:</span>
                            {item.saveStatus === 'pending' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <svg className="animate-spin -ml-0.5 mr-1.5 h-3 w-3 text-yellow-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                              </span>
                            ) : item.saveStatus === 'success' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg className="-ml-0.5 mr-1.5 h-3 w-3 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Saved to Wardrobe
                              </span>
                            ) : item.saveStatus === 'error' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <svg className="-ml-0.5 mr-1.5 h-3 w-3 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                                Failed to Save
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Not Saved
                              </span>
                            )}
                          </div>
                          
                          {item.error && (
                            <p className="text-red-500 text-xs mt-1 bg-red-50 p-2 rounded">
                              Error: {item.error}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="sm:w-1/2 p-2">
                        <p className="mb-2 font-medium">Image Comparison:</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="border p-1 relative">
                            <p className="absolute top-0 left-0 bg-black bg-opacity-70 text-white text-xs p-1">Original</p>
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full max-h-48 object-contain"
                              />
                            ) : (
                              <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-500">
                                No image available
                              </div>
                            )}
                          </div>
                          
                          {item.cropStatus === 'pending' && (
                            <div className="border p-1 relative">
                              <p className="absolute top-0 left-0 bg-black bg-opacity-70 text-white text-xs p-1">Cropping...</p>
                              <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                              </div>
                            </div>
                          )}
                          
                          {item.cropStatus === 'error' && (
                            <div className="border p-1 relative">
                              <p className="absolute top-0 left-0 bg-black bg-opacity-70 text-white text-xs p-1">Cropping Failed</p>
                              <div className="w-full h-48 flex items-center justify-center bg-red-50 text-red-500">
                                <p className="text-xs px-2 text-center">Error: {item.error || 'Unknown error'}</p>
                              </div>
                            </div>
                          )}
                          
                          {item.croppedImage && (
                            <div className="border p-1 relative">
                              <p className="absolute top-0 left-0 bg-black bg-opacity-70 text-white text-xs p-1">Cropped</p>
                              <img 
                                src={item.croppedImage} 
                                alt={`${item.name} (cropped)`} 
                                className="w-full max-h-48 object-contain"
                              />
                            </div>
                          )}
                          
                          {item.cropStatus === 'warning' && (
                            <div className="border p-1 relative">
                              <p className="absolute top-0 left-0 bg-black bg-opacity-70 text-white text-xs p-1">Warning</p>
                              <div className="w-full h-48 flex items-center justify-center bg-orange-50 text-orange-700">
                                <div className="flex flex-col items-center">
                                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                  </svg>
                                  <p className="text-xs px-2 text-center mt-2">{item.cropMessage || 'Cropping warning'}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {item.cropStatus === 'partial' && (
                            <div className="border p-1 relative">
                              <p className="absolute top-0 left-0 bg-black bg-opacity-70 text-white text-xs p-1">Partial Result</p>
                              <div className="w-full h-48 flex items-center justify-center">
                                {item.croppedImage ? (
                                  <>
                                    <img 
                                      src={item.croppedImage} 
                                      alt={`${item.name} (partially cropped)`} 
                                      className="w-full max-h-48 object-contain"
                                    />
                                    <p className="absolute bottom-0 w-full bg-blue-500 bg-opacity-70 text-white text-xs p-1 text-center">
                                      {item.cropMessage || 'Minimal cropping detected'}
                                    </p>
                                  </>
                                ) : (
                                  <div className="flex flex-col items-center text-blue-700">
                                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <p className="text-xs px-2 text-center mt-2">{item.cropMessage || 'Minimal cropping detected'}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
          
          <div className={`mb-8 bg-gray-100 p-4 rounded-md ${currentStep < 3 ? 'opacity-50' : ''}`}>
            <h2 className="text-xl font-semibold mb-4">Step 3: Confirm & Add to Wardrobe</h2>
            <p className="mb-4 text-sm text-gray-600">
              Review the processed items and add them to your wardrobe.
            </p>
            
            <Button
              onClick={handleAddToWardrobe}
              disabled={
                currentStep < 3 || 
                isLoading || 
                extractedItems.length === 0 ||
                extractedItems.some(item => item.saveStatus === 'success')
              }
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving to Wardrobe...
                </>
              ) : extractedItems.some(item => item.saveStatus === 'success') ? (
                <>✓ Added to Wardrobe</>
              ) : (
                <>✅ Confirm & Add to Wardrobe</>
              )}
            </Button>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Items Ready to Add:</h3>
              <div className="max-h-[200px] overflow-y-auto border rounded p-2 bg-white">
                {extractedItems.length === 0 ? (
                  <p className="text-gray-500 text-sm p-2">No items extracted yet.</p>
                ) : (
                  <ul className="divide-y">
                    {extractedItems.map((item, index) => (
                      <li key={index} className="py-2 flex items-center justify-between">
                        <div className="flex items-center">
                          {item.croppedImage ? (
                            <img 
                              src={item.croppedImage} 
                              alt={item.name} 
                              className="h-10 w-10 object-cover mr-2 border"
                            />
                          ) : item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="h-10 w-10 object-cover mr-2 border"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-100 flex items-center justify-center mr-2 border">
                              <span className="text-xs text-gray-400">No img</span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.brand} {item.color ? `• ${item.color}` : ''}</p>
                          </div>
                        </div>
                        <div>
                          {item.saveStatus ? (
                            <StatusBadge status={item.saveStatus} />
                          ) : item.cropStatus === 'success' ? (
                            <span className="inline-block px-2 py-1 text-xs bg-green-50 text-green-700 rounded-full">
                              Ready
                            </span>
                          ) : item.cropStatus === 'error' ? (
                            <span className="inline-block px-2 py-1 text-xs bg-red-50 text-red-700 rounded-full">
                              Crop Failed
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">
                              Pending
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          
          {debugJson && (
            <div className="mb-8 bg-gray-100 p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Debug Information</h2>
                <Button variant="outline" size="sm" onClick={handleCopyDebugJson}>
                  Copy JSON
                </Button>
              </div>
              <ScrollArea className="h-[200px] border rounded-md bg-white p-2">
                <pre className="text-xs overflow-x-auto">
                  {debugJson}
                </pre>
              </ScrollArea>
            </div>
          )}
        </>
      )}
      
      {/* Debug Information Section */}
      <section className="mt-8 border-t pt-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setDebugJson(JSON.stringify({
                sessionUser: session?.user,
                selectedEmail: emailSelection,
                selectedRetailer,
                extractedItems,
                processingSteps: {
                  emailSelection: !!emailSelection,
                  itemsExtracted: extractedItems.length > 0,
                  croppingRun: extractedItems.some(item => item.cropStatus !== 'pending'),
                  wardrobe: extractedItems.some(item => item.saveStatus === 'success'),
                  currentStep
                }
              }, null, 2))}
            >
              📊 Generate Debug JSON
            </Button>
          </div>
        </div>
        
        {debugJson && (
          <div className="bg-gray-100 p-4 rounded-md">
            <h4 className="text-sm font-semibold mb-2">Debug JSON</h4>
            <pre className="text-xs overflow-auto max-h-[400px] p-2 bg-gray-900 text-gray-100 rounded">
              {debugJson}
            </pre>
          </div>
        )}
      </section>
    </div>
  );
} 