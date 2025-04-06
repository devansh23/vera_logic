'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

// Types for extracted items and processing states
interface ExtractedItem {
  brand: string;
  name: string;
  price: string;
  originalPrice: string;
  discount: string;
  size: string;
  color: string;
  image: string;
  productLink: string;
  myntraLink?: string;
  sourceRetailer?: string;
  reference?: string;
  status?: 'pending' | 'success' | 'error';
  croppedImage?: string;
  cropStatus?: 'pending' | 'success' | 'error';
  saveStatus?: 'pending' | 'success' | 'error';
  error?: string;
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
      const response = await fetch('/api/wardrobe/add-from-emails-html', {
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
        // Get the items with initial status
        const updatedItems = data.items.map((item: ApiResponseItem) => ({
          ...item,
          status: 'success' as const,
          cropStatus: 'pending' as const,
          saveStatus: 'pending' as const,
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
        
        // Get the image data from the data URL or fetch from URL
        let imageData;
        if (item.image.startsWith('data:')) {
          // Extract the base64 part of the data URL
          const base64Data = item.image.split(',')[1];
          imageData = Buffer.from(base64Data, 'base64');
        } else {
          // Fetch the image if it's a URL
          const response = await fetch(item.image);
          imageData = await response.arrayBuffer();
        }
        
        // Create form data with image and item name
        const formData = new FormData();
        formData.append('image', new Blob([imageData]), 'image.jpg');
        formData.append('itemName', item.name);
        
        // Call extract-item API
        const cropResponse = await fetch('/api/extract-item', {
          method: 'POST',
          body: formData,
        });
        
        if (!cropResponse.ok) {
          throw new Error(`Cropping failed with status: ${cropResponse.status}`);
        }
        
        // Convert the cropped image to base64
        const croppedImageBuffer = await cropResponse.arrayBuffer();
        const base64String = btoa(
          new Uint8Array(croppedImageBuffer)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        const croppedImageDataUrl = `data:image/png;base64,${base64String}`;
        
        // Update the item with the cropped image
        updatedItems[i] = {
          ...item,
          croppedImage: croppedImageDataUrl,
          cropStatus: 'success',
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
    
    // Convert items to the format expected by the API
    const wardrobeItems = itemsToAdd.map(item => ({
      brand: item.brand,
      name: item.name,
      price: item.price || '',
      originalPrice: item.originalPrice || '',
      discount: item.discount || '',
      size: item.size || '',
      color: item.color || '',
      imageUrl: item.croppedImage || item.image, // Use cropped image if available
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
        const matchingItem = data.items.find(
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
        description: `Successfully added ${data.items.length} items to your wardrobe.`,
      });
    } catch (error) {
      console.error('Error adding items to wardrobe:', error);
      toast({
        title: "Failed to Add Items",
        description: error instanceof Error ? error.message : 'Failed to add items to wardrobe',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
  const StatusBadge = ({ status }: { status: 'pending' | 'success' | 'error' | undefined }) => {
    if (!status) return null;
    
    const statusMap = {
      pending: { text: '⏳ Pending', color: 'bg-yellow-100 text-yellow-800' },
      success: { text: '✅ Success', color: 'bg-green-100 text-green-800' },
      error: { text: '❌ Failed', color: 'bg-red-100 text-red-800' },
    };
    
    const { text, color } = statusMap[status];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {text}
      </span>
    );
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
            
            <Button
              onClick={handleRunCropping}
              disabled={currentStep < 2 || isLoading}
            >
              ✂️ Run Cropping on Extracted Items
            </Button>
            
            <div className="mt-4">
              <ScrollArea className="h-[400px] border rounded-md bg-white p-4">
                {extractedItems.map((item, index) => (
                  <div key={index} className="mb-8 border-b pb-4">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-1/2 p-2">
                        <h3 className="font-bold">{item.name}</h3>
                        <p>Brand: {item.brand}</p>
                        <p>Price: {item.price}</p>
                        {item.size && <p>Size: {item.size}</p>}
                        {item.color && <p>Color: {item.color}</p>}
                        
                        <div className="mt-2">
                          <p>Extraction: <StatusBadge status={item.status} /></p>
                          <p>Cropping: <StatusBadge status={item.cropStatus} /></p>
                          {item.error && <p className="text-red-500 text-sm mt-1">{item.error}</p>}
                        </div>
                      </div>
                      
                      <div className="sm:w-1/2 p-2">
                        <p className="mb-2 font-medium">Image Comparison:</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="border p-1 relative">
                            <p className="absolute top-0 left-0 bg-black bg-opacity-70 text-white text-xs p-1">Original</p>
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full max-h-48 object-contain"
                            />
                          </div>
                          
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
              disabled={currentStep < 3 || isLoading}
            >
              ✅ Confirm & Add to Wardrobe
            </Button>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Items Ready to Add:</h3>
              <ul className="list-disc pl-5">
                {extractedItems
                  .filter(item => item.cropStatus === 'success' || item.status === 'success')
                  .map((item, index) => (
                    <li key={index} className="mb-1">
                      {item.name} ({item.brand}) - 
                      {item.saveStatus ? (
                        <StatusBadge status={item.saveStatus} />
                      ) : 'Pending'}
                    </li>
                  ))}
              </ul>
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
    </div>
  );
} 