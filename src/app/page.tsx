'use client'
import React, { useState, FormEvent } from 'react'
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

export default function Home() {
  const [inputValue, setInputValue] = useState('')
  const [products, setProducts] = useState<MyntraProduct[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    } catch (error) {
      console.error('Error in product selection:', error)
    }
  }

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
                  required
                />
                <button 
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : inputValue.includes('myntra.com') ? 'Add to Wardrobe' : 'Search'}
                </button>
              </div>
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                  {error}
                </div>
              )}
              <p className="text-sm text-gray-500">
                Tip: Paste a Myntra product URL to add directly, or type a product name to search
              </p>
            </form>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[70vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">Search Results</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {searchResults.map((result, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      {result.image && (
                        <img 
                          src={result.image} 
                          alt={result.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{result.brand}</h3>
                        <p className="text-sm text-gray-600">{result.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-semibold text-gray-900">{result.price}</span>
                          {result.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">{result.originalPrice}</span>
                          )}
                          {result.discount && (
                            <span className="text-sm text-green-600">{result.discount}</span>
                          )}
                        </div>
                      </div>
                      <button 
                        className="px-4 py-2 text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                        onClick={() => handleProductSelect(result.url)}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Adding...' : 'Add to Wardrobe'}
                      </button>
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
                <div key={index} className="p-6 bg-white rounded-lg shadow-lg">
                  {product.image && (
                    <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden group">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                      {product.images && product.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                          +{product.images.length - 1} more
                        </div>
                      )}
                    </div>
                  )}
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
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
                      {product.category && (
                        <div>
                          <span className="font-medium">Category:</span> {product.category}
                        </div>
                      )}
                      {product.subCategory && (
                        <div>
                          <span className="font-medium">Type:</span> {product.subCategory}
                        </div>
                      )}
                      {product.color && (
                        <div>
                          <span className="font-medium">Color:</span> {product.color}
                        </div>
                      )}
                      {product.pattern && (
                        <div>
                          <span className="font-medium">Pattern:</span> {product.pattern}
                        </div>
                      )}
                      {product.fabric && (
                        <div>
                          <span className="font-medium">Material:</span> {product.fabric}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Added:</span> {new Date(product.dateAdded).toLocaleDateString()}
                      </div>
                    </div>

                    <a 
                      href={product.myntraLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-sm text-purple-600 hover:text-purple-800 hover:underline"
                    >
                      View on Myntra →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
