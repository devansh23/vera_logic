'use client'
import React, { useState, FormEvent, useRef, useEffect, ClipboardEvent as ReactClipboardEvent } from 'react'
import { Inter } from 'next/font/google'
import Image from 'next/image'

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
  myntraLink: string;
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

export default function Home() {
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
    try {
      setIsLoading(true)
      setError(null)
      
      // Ensure the URL is properly formatted
      let productUrl = url
      if (!url.startsWith('http')) {
        // If it's a relative URL, ensure proper formatting
        productUrl = url.startsWith('/') 
          ? `https://www.myntra.com${url}`
          : `https://www.myntra.com/${url}`
      }
      
      const response = await fetch(`/api/myntra-product?url=${encodeURIComponent(productUrl)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch product details')
      }
      
      const data: MyntraProduct = await response.json()
      if (!data || !data.name) {
        throw new Error('Invalid product data received')
      }

      setProducts(prevProducts => [...prevProducts, {
        ...data,
        myntraLink: productUrl,
        dateAdded: new Date().toISOString()
      }])
      
      setInputValue('')
      setSearchResults([]) // Clear search results after adding
    } catch (error) {
      console.error('Error adding product:', error)
      setError(error instanceof Error ? error.message : 'Failed to add product to wardrobe')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

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
          myntraLink: '', // We don't have the Myntra link from the PDF
          dateAdded: new Date().toISOString()
        }));

        setProducts(prevProducts => [...prevProducts, ...newProducts]);
        setError(`Successfully added ${newProducts.length} items to your wardrobe.`);
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
    setProducts(prevProducts => prevProducts.filter((_, i) => i !== index))
    setShowDeleteConfirm(null)
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
              <span className="text-gray-500">{products.length} items</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <div key={index} className="p-6 bg-white rounded-lg shadow-lg relative group">
                  {/* Delete Button */}
                  <button
                    onClick={() => setShowDeleteConfirm(index)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 z-10"
                    aria-label="Delete item"
                  >
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  {product.image && (
                    <div className="relative w-full mb-4 rounded-lg overflow-hidden">
                      <div className="relative pt-[100%]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-contain bg-gray-50"
                        />
                      </div>
                    </div>
                  )}
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">{product.name}</h2>
                    {product.brand && <p className="text-gray-600">{product.brand}</p>}
                    
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                      )}
                      {product.discount && (
                        <span className="text-sm text-green-600">{product.discount}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      {product.size && (
                        <div>
                          <span className="font-medium">Size:</span> {product.size}
                        </div>
                      )}
                      {product.quantity && (
                        <div>
                          <span className="font-medium">Quantity:</span> {product.quantity}
                        </div>
                      )}
                      {product.seller && (
                        <div className="col-span-2">
                          <span className="font-medium">Seller:</span> {product.seller}
                        </div>
                      )}
                      <div className="col-span-2">
                        <span className="font-medium">Added:</span> {new Date(product.dateAdded).toLocaleDateString()}
                      </div>
                    </div>

                    {product.myntraLink && (
                      <a 
                        href={product.myntraLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-sm text-purple-600 hover:text-purple-800 hover:underline"
                      >
                        View on Myntra →
                      </a>
                    )}
                  </div>
                </div>
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
    </main>
  )
}
