"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, Edit3, Save, Plus } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const categories = [
  'All', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Bags', 'Jewellery', 'Outerwear', 'Active', 'Occasion'
];

const colorSwatches = [
  '#000000', '#FFFFFF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'
];

interface WardrobeItem {
  id: string;
  image?: string;
  brand?: string;
  name: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  size?: string;
  color?: string;
  category?: string;
  sourceRetailer?: string;
  dominantColor?: string; // Added for color square
}

interface NewWardrobeSectionProps {
  products: WardrobeItem[];
  onDelete: (index: number) => void;
}

export function NewWardrobeSection({ products, onDelete }: NewWardrobeSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WardrobeItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const brandDropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside the brand dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target as Node)) {
        setIsBrandDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Dynamically generate categories from user's actual items
  const userCategories = ['All', ...Array.from(new Set(products
    .map(item => item.category)
    .filter((category): category is string => category !== undefined && category.trim() !== '')
  ))];

  // Dynamically generate brands from user's actual items
  const userBrands = Array.from(new Set(products
    .map(item => item.brand)
    .filter((brand): brand is string => brand !== undefined && brand.trim() !== '')
  )).sort();

  // Filter products based on selected category, brands, and search
  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
    const brandMatch = selectedBrands.length === 0 || (product.brand && selectedBrands.includes(product.brand));
    const searchMatch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return categoryMatch && brandMatch && searchMatch;
  });

  const handleItemClick = (item: WardrobeItem) => {
    setSelectedItem(item);
    setEditingItem({ ...item });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingItem) {
      // Here you would typically save the changes to your backend
      // For now, we'll just update the local state
      const updatedProducts = products.map(p => 
        p.id === editingItem.id ? editingItem : p
      );
      // You might want to call a prop function to update the parent state
      setSelectedItem(editingItem);
      setIsEditing(false);
    }
  };

  const handleAddToOutfit = () => {
    if (selectedItem) {
      // Navigate to outfit canvas with this item
      // You can implement navigation logic here
      console.log('Adding to outfit:', selectedItem);
      // For now, just close the modal
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setEditingItem(null);
    setIsEditing(false);
  };

  return (
    <>
      <section className="mb-8 overflow-hidden">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-normal mb-4 text-gray-900 font-serif">Your Wardrobe</h2>
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1 mb-4">
            {userCategories.map((category, index) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`rounded-full px-4 py-2 cursor-pointer transition-colors ${
                  selectedCategory === category 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search your wardrobe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-0 rounded-lg"
              />
            </div>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 relative"
              onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
            >
              <Filter className="h-4 w-4" />
              Brand
              {selectedBrands.length > 0 && (
                <span className="ml-1 bg-[#2d2926] text-[#fdfcfa] text-xs px-2 py-1 rounded-full">
                  {selectedBrands.length}
                </span>
              )}
              
              {/* Brand Dropdown */}
              {isBrandDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto" ref={brandDropdownRef}>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900">Select Brands</h4>
                      {selectedBrands.length > 0 && (
                        <button
                          onClick={() => setSelectedBrands([])}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    
                    {userBrands.length === 0 ? (
                      <p className="text-sm text-gray-500 py-2">No brands found</p>
                    ) : (
                      <div className="space-y-2">
                        {userBrands.map((brand) => (
                          <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedBrands([...selectedBrands, brand]);
                                } else {
                                  setSelectedBrands(selectedBrands.filter(b => b !== brand));
                                }
                              }}
                              className="rounded border-gray-300 text-[#2d2926] focus:ring-[#2d2926]"
                            />
                            <span className="text-sm text-gray-700">{brand}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Button>
            
            {/* Color Swatches */}
            <div className="flex items-center gap-1">
              {colorSwatches.map((color, index) => (
                <button
                  key={index}
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Wardrobe Grid - Images Only */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 overflow-hidden">
          {filteredProducts.map((item, index) => (
            <div
              key={item.id}
              className="group cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              {/* Item Image Only */}
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 hover:shadow-lg transition-shadow duration-300">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-sm">No Image</span>
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Item Details Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Item Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-3">
              <div className="flex gap-3">
                {/* Item Image - Left Side */}
                <div className="flex-shrink-0">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 w-32">
                    {selectedItem.image ? (
                      <img
                        src={selectedItem.image}
                        alt={selectedItem.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Fields - Right Side */}
                <div className="flex-1 space-y-2">
                  {/* Name */}
                  <div className="group relative">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {isEditing ? (
                          <Input
                            value={editingItem?.name || ''}
                            onChange={(e) => setEditingItem(prev => prev ? { ...prev, name: e.target.value } : null)}
                            className="w-full"
                            placeholder="Enter item name"
                          />
                        ) : (
                          <span className="text-base font-medium text-gray-900">
                            {selectedItem.name || 'Unnamed item'}
                          </span>
                        )}
                      </div>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:bg-gray-100 rounded"
                        >
                          <Edit3 className="h-4 w-4 text-gray-500" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Brand */}
                  <div className="group relative">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {isEditing ? (
                          <Input
                            value={editingItem?.brand || ''}
                            onChange={(e) => setEditingItem(prev => prev ? { ...prev, brand: e.target.value } : null)}
                            className="w-full"
                            placeholder="Enter brand name"
                          />
                        ) : (
                          <span className="text-sm text-gray-700">
                            {selectedItem.brand || 'Unknown Brand'}
                          </span>
                        )}
                      </div>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:bg-gray-100 rounded"
                        >
                          <Edit3 className="h-4 w-4 text-gray-500" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category as Pill */}
                  <div className="group relative">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {isEditing ? (
                          <select
                            value={editingItem?.category || ''}
                            onChange={(e) => setEditingItem(prev => prev ? { ...prev, category: e.target.value } : null)}
                            className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Category</option>
                            {userCategories.filter(cat => cat !== 'All').map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        ) : (
                          <Badge
                            variant={selectedItem.category ? "default" : "outline"}
                            className={`rounded-full px-3 py-1 ${
                              selectedItem.category 
                                ? 'bg-gray-900 text-white' 
                                : 'bg-gray-100 text-gray-600 border-gray-300'
                            }`}
                          >
                            {selectedItem.category || 'Uncategorised'}
                          </Badge>
                        )}
                      </div>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:bg-gray-100 rounded"
                        >
                          <Edit3 className="h-4 w-4 text-gray-500" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Size and Color */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="group relative">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          {isEditing ? (
                            <Input
                              value={editingItem?.size || ''}
                              onChange={(e) => setEditingItem(prev => prev ? { ...prev, size: e.target.value } : null)}
                              className="w-full"
                              placeholder="Enter size"
                            />
                          ) : (
                            <span className="text-sm text-gray-600">
                              {selectedItem.size || 'Unknown Size'}
                            </span>
                          )}
                        </div>
                        {!isEditing && (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:bg-gray-100 rounded"
                          >
                            <Edit3 className="h-4 w-4 text-gray-500" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Color:</span>
                        <div 
                          className="w-6 h-6 rounded border border-gray-300 shadow-sm"
                          style={{ 
                            backgroundColor: selectedItem.color || selectedItem.dominantColor || '#cccccc'
                          }}
                          title={selectedItem.color || selectedItem.dominantColor || 'Unknown Color'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between p-3 border-t border-gray-200">
              <div className="flex gap-1">
                {isEditing ? (
                  <Button onClick={handleSave} className="flex items-center gap-1">
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                ) : null}
                <Button 
                  onClick={handleAddToOutfit} 
                  className="flex items-center gap-1 bg-[#2d2926] hover:bg-[#2d2926]/90 text-[#fdfcfa] rounded-full"
                >
                  <Plus className="h-4 w-4" />
                  Add to Outfit
                </Button>
              </div>
              
              {isEditing && (
                <Button 
                  onClick={() => setIsEditing(false)} 
                  variant="outline"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 