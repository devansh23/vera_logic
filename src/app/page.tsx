'use client'
import React, { useState, FormEvent, useRef, useEffect, ClipboardEvent as ReactClipboardEvent } from 'react'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import { prisma } from '@/lib/prisma'

const inter = Inter({ subsets: ['latin'] })

interface LinkPreview {
  title: string;
  description: string;
  image: string;
  url: string;
}

interface MyntraProduct {
  brand: string;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  sizes?: string[];
  colors?: string[];
  images?: string[];
  description?: string;
  image?: string;
  myntraLink?: string;  // Keep for backward compatibility
  productLink?: string; // Add for H&M and other retailers
  category?: string;
  subCategory?: string;
  color?: string;
  pattern?: string;
  fabric?: string;
  dateAdded: string;
  size?: string;
  quantity?: string;
  seller?: string;
}

interface WardrobeItem {
  url: string;
  type: 'youtube' | 'myntra' | 'other';
  videoId?: string;
  preview?: LinkPreview;
  myntraData?: MyntraProduct;
  loading?: boolean;
}

interface SearchResult {
  url: string;
  brand: string;
  name: string;
  price: string;
  originalPrice: string;
  discount: string;
  image: string;
}

function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function isMyntraUrl(url: string): boolean {
  return url.includes('myntra.com');
}

// Add ProductOverlay component
const ProductOverlay = ({ 
  products, 
  onSelect, 
  onClose 
}: { 
  products: SearchResult[], 
  onSelect: (url: string) => void, 
  onClose: () => void 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select a Product to Add to Your Wardrobe</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.slice(0, 3).map((product, index) => (
            <div 
              key={index}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {product.image && (
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 text-xs rounded">
                    Match #{index + 1}
                  </div>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{product.brand}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.name}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-bold text-lg">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                  )}
                  {product.discount && (
                    <span className="text-sm text-green-600 font-medium">{product.discount}</span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => onSelect(product.url)}
                    className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                  >
                    Add to Wardrobe
                  </button>
                  <a 
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-4 text-center text-purple-600 border border-purple-600 rounded hover:bg-purple-50 transition-colors"
                  >
                    View on Myntra
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WardrobeItem = ({ product, onDelete }: { product: MyntraProduct, onDelete: () => void }) => (
  <div className="relative group">
    <div className="aspect-square relative">
      <div className="absolute inset-0">
        <img
          src={product.image || product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-contain bg-gray-50"
        />
      </div>
    </div>
    <div className="p-4 bg-white">
      <h3 className="font-semibold mb-1">{product.brand}</h3>
      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.name}</p>
      <div className="flex items-center gap-2 mb-2">
        <span className="font-bold">{product.price}</span>
        {product.originalPrice && (
          <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
        )}
        {product.discount && (
          <span className="text-sm text-green-600">{product.discount}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {(product.productLink || product.myntraLink) && (
          <a
            href={product.productLink || product.myntraLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            <span>Visit {product.brand}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Delete item"
        >
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

export default function Home() {
  const { data: session, status } = useSession()
  const [inputValue, setInputValue] = useState('')
  const [products, setProducts] = useState<MyntraProduct[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isProcessingImage, setIsProcessingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const [showProductOverlay, setShowProductOverlay] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [pdfText, setPdfText] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showSaveReminder, setShowSaveReminder] = useState(false)

  // Add beforeunload event listener to warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        // Standard way to show a confirmation dialog
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Load user's wardrobe on session change
  useEffect(() => {
    if (session?.user?.id) {
      loadUserWardrobe();
    }
  }, [session]);

  const loadUserWardrobe = async () => {
    try {
      const response = await fetch('/api/wardrobe');
      if (!response.ok) {
        throw new Error('Failed to load wardrobe');
      }
      const data = await response.json();
      setProducts(data);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error loading wardrobe:', error);
      setError('Failed to load your wardrobe');
    }
  };

  // Save the entire wardrobe state
  const saveWardrobe = async () => {
    if (!session) {
      setError('Please sign in to save your wardrobe');
      return;
    }

    try {
      setIsSaving(true);
      setSaveSuccess(null);
      setError(null);
      
      const response = await fetch('/api/wardrobe/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: products }),
      });

      if (!response.ok) {
        throw new Error('Failed to save wardrobe');
      }
      
      const data = await response.json();
      setSaveSuccess(`Wardrobe saved successfully! (${data.count} items)`);
      setHasUnsavedChanges(false);
      setShowSaveReminder(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving wardrobe:', error);
      setError(error instanceof Error ? error.message : 'Failed to save wardrobe');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!inputValue) return

    setIsLoading(true)
    setError(null)
    setSearchResults([])

    try {
      // Check if input is a Myntra URL
      if (inputValue.includes('myntra.com')) {
        await addProductToWardrobe(inputValue)
      } else {
        // Handle as search query
        const response = await fetch(`/api/myntra-search?q=${encodeURIComponent(inputValue)}`)
        if (!response.ok) {
          throw new Error('Failed to search products')
        }
        const data = await response.json()
        setSearchResults(data)
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const addProductToWardrobe = async (url: string) => {
    if (!session) {
      setError('Please sign in to add items to your wardrobe');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      let productUrl = url;
      if (!url.startsWith('http')) {
        productUrl = url.startsWith('/') 
          ? `https://www.myntra.com${url}`
          : `https://www.myntra.com/${url}`;
      }
      
      const response = await fetch('/api/wardrobe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: productUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      
      const data = await response.json();
      setProducts(prevProducts => [...prevProducts, data]);
      setInputValue('');
      setSearchResults([]);
      setHasUnsavedChanges(true);
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error instanceof Error ? error.message : 'Failed to add product to wardrobe');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = async (url: string) => {
    try {
      await addProductToWardrobe(url)
      handleOverlayClose()
    } catch (error) {
      console.error('Error in product selection:', error)
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      setIsProcessingImage(true)
      setError(null)
      setSearchResults([])

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Process image
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to process image')
      }

      const data = await response.json()
      if (data.searchResults && data.searchResults.length > 0) {
        setSearchResults(data.searchResults)
        setShowProductOverlay(true)  // Show overlay when results are available
      } else {
        throw new Error('No matching products found')
      }
    } catch (error) {
      console.error('Error processing image:', error)
      setError(error instanceof Error ? error.message : 'Failed to process image')
    } finally {
      setIsProcessingImage(false)
    }
  }

  const handlePdfUpload = async (file: File) => {
    try {
      setError(null);
      setPdfText(null);
      console.log('Processing PDF:', file.name);

      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to process PDF');
      }

      const data = await response.json();
      console.log('PDF processing result:', data);

      // Set the extracted text
      setPdfText(data.extractedText);

      // Add extracted items to wardrobe
      if (data.items && data.items.length > 0) {
        const newProducts = data.items.map((item: any) => ({
          brand: item.brand || 'Unknown Brand',
          name: item.name || 'Unknown Product',
          price: item.price || '',
          originalPrice: item.originalPrice || '',
          discount: item.discount || '',
          image: item.image || '',
          size: item.size || '',
          quantity: item.quantity || '',
          seller: item.seller || '',
          productLink: item.productLink || item.myntraLink || '', // Handle both types of links
          myntraLink: item.myntraLink || '', // Keep for backward compatibility
          dateAdded: new Date().toISOString()
        }));

        setProducts(prevProducts => [...prevProducts, ...newProducts]);
        setHasUnsavedChanges(true); // Set unsaved changes flag when adding items from PDF
        setShowSaveReminder(true); // Show the save reminder
        setError(`Successfully added ${newProducts.length} items to your wardrobe. Please click "Save Wardrobe" to permanently save these items.`);
        
        // Scroll to the wardrobe section to make the save button visible
        setTimeout(() => {
          document.querySelector('.text-2xl.font-bold.text-gray-900')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }, 500);
      } else {
        setError('No items found in the PDF.');
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
      setError(error instanceof Error ? error.message : 'Failed to process PDF');
    }
  }

  const handlePaste = async (e: ReactClipboardEvent<HTMLDivElement> | ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (const item of Array.from(items)) {
      if (item.type.includes('image')) {
        const file = item.getAsFile()
        if (file) {
          await handleImageUpload(file)
          break
        }
      }
    }
  }

  const handleOverlayClose = () => {
    setShowProductOverlay(false)
    setSearchResults([])
    setImagePreview(null)
  }

  const handleDeleteProduct = (index: number) => {
    setProducts(prevProducts => prevProducts.filter((_, i) => i !== index));
    setShowDeleteConfirm(null);
    setHasUnsavedChanges(true);
  }

  useEffect(() => {
    const handleDocumentPaste = (e: ClipboardEvent) => {
      handlePaste(e);
    };
    
    document.addEventListener('paste', handleDocumentPaste);
    return () => document.removeEventListener('paste', handleDocumentPaste);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-b from-white to-gray-100">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex justify-end mb-4">
          {status === 'loading' ? (
            <div>Loading...</div>
          ) : session ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-gray-700">{session.user?.name}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
          )}
        </div>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Organize Your Wardrobe, Elevate Your Style
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your personal wardrobe assistant that helps you manage, style, and optimize your clothing collection.
          </p>

          <div className="relative max-w-2xl mx-auto mb-16">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Enter Myntra URL or search for a product (e.g., 'blue cotton shirt')"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button 
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : inputValue.includes('myntra.com') ? 'Add to Wardrobe' : 'Search'}
                </button>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-gray-500">or</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-wrap justify-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-3 border-2 border-dashed border-purple-300 text-purple-600 rounded-lg hover:border-purple-500 hover:text-purple-700 transition-all"
                    disabled={isProcessingImage}
                  >
                    {isProcessingImage ? 'Processing...' : 'Upload Order Screenshot'}
                  </button>
                  
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => e.target.files?.[0] && handlePdfUpload(e.target.files[0])}
                    className="hidden"
                    ref={pdfInputRef}
                  />
                  <button
                    type="button"
                    onClick={() => pdfInputRef.current?.click()}
                    className="px-8 py-3 border-2 border-dashed border-purple-300 text-purple-600 rounded-lg hover:border-purple-500 hover:text-purple-700 transition-all"
                  >
                    Upload PDF
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Or paste (Ctrl/Cmd + V) a screenshot of your Myntra order
                </p>
              </div>

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                  {error}
                </div>
              )}
            </form>

            {imagePreview && (
              <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                <div className="aspect-video relative overflow-hidden rounded-lg">
                  <img
                    src={imagePreview}
                    alt="Uploaded screenshot"
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[70vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">Found {searchResults.length} Products</h2>
                  {imagePreview && (
                    <p className="text-sm text-gray-600 mt-1">Results based on uploaded image</p>
                  )}
                </div>
                <div className="divide-y divide-gray-100">
                  {searchResults.map((result, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      {result.image && (
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <img 
                            src={result.image} 
                            alt={result.name}
                            className="w-full h-full object-cover rounded"
                          />
                          {index < 3 && (
                            <div className="absolute top-0 left-0 bg-purple-600 text-white px-2 py-1 text-xs rounded-br">
                              Top {index + 1}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{result.brand}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{result.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-semibold text-gray-900">{result.price}</span>
                          {result.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">{result.originalPrice}</span>
                          )}
                          {result.discount && (
                            <span className="text-sm text-green-600 font-medium">{result.discount}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button 
                          className="px-4 py-2 text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors whitespace-nowrap"
                          onClick={() => handleProductSelect(result.url)}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Adding...' : 'Add to Wardrobe'}
                        </button>
                        <a 
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors text-center"
                        >
                          View on Myntra
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Your Wardrobe Section */}
        {products.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Wardrobe</h2>
              <div className="flex items-center gap-4">
                {hasUnsavedChanges && (
                  <span className="text-amber-600 font-medium">
                    You have unsaved changes!
                  </span>
                )}
                <button
                  onClick={saveWardrobe}
                  disabled={isSaving || !hasUnsavedChanges}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    hasUnsavedChanges
                      ? 'bg-green-600 text-white hover:bg-green-700 font-medium animate-pulse'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSaving ? 'Saving...' : 'Save Wardrobe'}
                </button>
                <span className="text-gray-500">{products.length} items</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <WardrobeItem key={index} product={product} onDelete={() => setShowDeleteConfirm(index)} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add this before the closing main tag */}
      {showProductOverlay && searchResults.length > 0 && (
        <ProductOverlay
          products={searchResults}
          onSelect={handleProductSelect}
          onClose={handleOverlayClose}
        />
      )}

      {imagePreview && (
        <div className="fixed bottom-4 right-4 bg-white p-2 rounded-lg shadow-lg">
          <img 
            src={imagePreview} 
            alt="Uploaded preview" 
            className="w-24 h-24 object-cover rounded"
          />
          {isProcessingImage && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
              <div className="text-white text-sm">Processing...</div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {pdfText && (
        <div className="mt-8 w-full max-w-6xl">
          <h2 className="text-2xl font-bold mb-4">Extracted Text from PDF</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {pdfText}
            </pre>
          </div>
        </div>
      )}

      {saveSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {saveSuccess}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Item</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to remove this item from your wardrobe?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Reminder */}
      {showSaveReminder && hasUnsavedChanges && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded shadow-lg z-50 flex items-center gap-3 max-w-md">
          <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-medium">Don't forget to save your changes!</p>
            <p className="text-sm">Click the "Save Wardrobe" button to permanently save your items.</p>
          </div>
          <button 
            onClick={saveWardrobe}
            disabled={isSaving}
            className="ml-auto bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-sm font-medium"
          >
            {isSaving ? 'Saving...' : 'Save Now'}
          </button>
          <button 
            onClick={() => setShowSaveReminder(false)} 
            className="text-amber-700 hover:text-amber-900"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </main>
  )
}
