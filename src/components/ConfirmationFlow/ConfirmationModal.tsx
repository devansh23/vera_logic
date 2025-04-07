import { useState, useEffect, useRef } from 'react';
import { WardrobeItem } from '@/types/wardrobe';
import ItemEditorModal from './ItemEditorModal';
import { PencilIcon, TrashIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ConfirmationModalProps {
  items: WardrobeItem[];
  onConfirm: (items: WardrobeItem[]) => void;
  onCancel: () => void;
  isWardrobe?: boolean;
}

const ITEMS_PER_PAGE = 3;
const CATEGORIES = [
  'T-Shirts',
  'Casual Shirts',
  'Formal Shirts',
  'Sweatshirts',
  'Sweaters',
  'Jackets',
  'Blazers & Coats',
  'Mens Jeans',
  'Casual Trousers',
  'Mens Shorts',
  'Track Pants & Joggers',
  'Dresses',
  'Womens Tops',
  'Womens Jeans',
  'Skirts',
  'Womens Shorts',
  'Mens Casual Shoes',
  'Womens Casual Shoes',
  'Formal Shoes',
  'Heels',
  'Boots',
  'Sandals & Floaters',
  'Bags & Backpacks',
  'Watches',
  'Sunglasses',
  'Belts',
  'Wallets',
  'Uncategorized'
];

export default function ConfirmationModal({ items, onConfirm, onCancel, isWardrobe = false }: ConfirmationModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editedItems, setEditedItems] = useState<WardrobeItem[]>(items);
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  
  // States for inline editing
  const [editingField, setEditingField] = useState<{itemId: string, field: 'brand' | 'name' | 'category' | null}>({itemId: '', field: null});
  const [inlineValue, setInlineValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Calculate modal width based on number of items (fixed for more consistent UI)
  const getModalWidth = () => {
    return 'max-w-4xl'; // Always use the larger width for better consistency
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Focus input when editing starts
  useEffect(() => {
    if (editingField.field && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingField]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevPage();
      } else if (e.key === 'ArrowRight') {
        nextPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, editedItems.length]);

  const handleItemUpdate = (updatedItem: WardrobeItem) => {
    setEditedItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setSelectedItem(null);
  };

  // Handle manual scrolling via buttons
  const nextPage = () => {
    if (currentIndex < Math.ceil(editedItems.length / ITEMS_PER_PAGE) - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Start inline editing for a field
  const startEditing = (itemId: string, field: 'brand' | 'name' | 'category') => {
    const item = editedItems.find(item => item.id === itemId);
    if (!item) return;
    
    let initialValue = '';
    switch (field) {
      case 'brand':
        initialValue = item.brand || '';
        break;
      case 'name':
        initialValue = item.name;
        break;
      case 'category':
        initialValue = item.category;
        break;
    }
    
    setInlineValue(initialValue);
    setEditingField({itemId, field});
  };

  // Save the inline edit
  const saveInlineEdit = () => {
    if (!editingField.field || !editingField.itemId) return;
    
    setEditedItems(prev => 
      prev.map(item => {
        if (item.id === editingField.itemId) {
          const updatedItem = {...item};
          switch (editingField.field) {
            case 'brand':
              updatedItem.brand = inlineValue;
              break;
            case 'name':
              updatedItem.name = inlineValue;
              break;
            case 'category':
              updatedItem.category = inlineValue;
              break;
          }
          return updatedItem;
        }
        return item;
      })
    );
    
    setEditingField({itemId: '', field: null});
  };

  // Handle inline edit input change
  const handleInlineChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInlineValue(e.target.value);
  };

  // Handle key press in inline edit
  const handleInlineKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveInlineEdit();
    } else if (e.key === 'Escape') {
      setEditingField({itemId: '', field: null});
    }
  };

  // Handle image upload
  const handleImageClick = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from reaching the parent div
    if (fileInputRef.current) {
      fileInputRef.current.dataset.itemId = itemId;
      fileInputRef.current.click();
    }
  };

  // Handle image file change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const itemId = e.target.dataset.itemId;
    
    if (file && itemId) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        
        setEditedItems(prev => 
          prev.map(item => {
            if (item.id === itemId) {
              return {...item, imageUrl};
            }
            return item;
          })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove an item
  const removeItem = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from reaching the parent div
    setEditedItems(prev => prev.filter(item => item.id !== itemId));
    
    // If we just removed the last item on the current page, go to previous page
    const remainingItems = editedItems.filter(item => item.id !== itemId);
    const newTotalPages = Math.ceil(remainingItems.length / ITEMS_PER_PAGE);
    if (currentIndex >= newTotalPages && currentIndex > 0) {
      setCurrentIndex(newTotalPages - 1);
    }
  };

  const visibleItems = editedItems.slice(
    currentIndex * ITEMS_PER_PAGE,
    (currentIndex + 1) * ITEMS_PER_PAGE
  );

  // Determine if we should show carousel indicators
  const hasMultiplePages = editedItems.length > ITEMS_PER_PAGE;
  const totalPages = Math.ceil(editedItems.length / ITEMS_PER_PAGE);

  // Hidden file input for image uploads
  const hiddenFileInput = (
    <input
      type="file"
      ref={fileInputRef}
      className="hidden"
      accept="image/*"
      onChange={handleImageChange}
    />
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg p-6 w-full ${getModalWidth()} mx-4`}>
        <h2 className="text-2xl font-bold mb-4">Review Items</h2>
        
        <div className="relative">
          <div className="flex gap-4 overflow-hidden" ref={carouselRef}>
            {visibleItems.length > 0 ? (
              <>
                {visibleItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 w-1/3 relative group"
                  >
                    {/* Remove item button - moved to top left */}
                    <button
                      className="absolute top-2 left-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      onClick={(e) => removeItem(item.id, e)}
                      aria-label="Remove item"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>

                    {/* Image with edit on hover - edit icon moved to top right */}
                    <div className="aspect-square relative">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-contain rounded-lg"
                      />
                      {/* Edit button for image */}
                      <button
                        className="absolute top-2 right-2 p-1 rounded-full bg-blue-600 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        onClick={(e) => handleImageClick(item.id, e)}
                        aria-label="Edit image"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Brand field with inline edit */}
                    <div className="mt-2 group/brand relative">
                      {editingField.itemId === item.id && editingField.field === 'brand' ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={inlineValue}
                          onChange={handleInlineChange}
                          onBlur={saveInlineEdit}
                          onKeyDown={handleInlineKeyPress}
                          className="w-full px-2 py-1 border border-blue-300 rounded text-sm"
                          placeholder="Enter brand"
                        />
                      ) : (
                        <div className="flex items-center">
                          <h4 className="text-sm font-medium text-gray-700 truncate">
                            {item.brand || "Add brand"}
                          </h4>
                          <button 
                            className="ml-2 opacity-0 group-hover/brand:opacity-100 transition-opacity"
                            onClick={() => startEditing(item.id, 'brand')}
                          >
                            <PencilIcon className="h-3 w-3 text-gray-500" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Name field with inline edit */}
                    <div className="mt-1 group/name relative">
                      {editingField.itemId === item.id && editingField.field === 'name' ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={inlineValue}
                          onChange={handleInlineChange}
                          onBlur={saveInlineEdit}
                          onKeyDown={handleInlineKeyPress}
                          className="w-full px-2 py-1 border border-blue-300 rounded"
                          placeholder="Product name"
                        />
                      ) : (
                        <div className="flex items-center">
                          <h3 className="font-medium truncate">{item.name}</h3>
                          <button 
                            className="ml-2 opacity-0 group-hover/name:opacity-100 transition-opacity"
                            onClick={() => startEditing(item.id, 'name')}
                          >
                            <PencilIcon className="h-3 w-3 text-gray-500" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Category field with inline edit */}
                    <div className="mt-1 group/category relative">
                      {editingField.itemId === item.id && editingField.field === 'category' ? (
                        <select
                          value={inlineValue}
                          onChange={handleInlineChange}
                          onBlur={saveInlineEdit}
                          className="w-full px-2 py-1 border border-blue-300 rounded text-sm"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center">
                          <p className="text-sm text-gray-500 truncate">{item.category}</p>
                          <button 
                            className="ml-2 opacity-0 group-hover/category:opacity-100 transition-opacity"
                            onClick={() => startEditing(item.id, 'category')}
                          >
                            <PencilIcon className="h-3 w-3 text-gray-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="w-full text-center py-12 text-gray-500">
                No items to display
              </div>
            )}
          </div>

          {/* Hidden file input for image uploads */}
          {hiddenFileInput}

          {/* Improved carousel controls - make them always visible */}
          {hasMultiplePages && (
            <>
              {currentIndex > 0 && (
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                  onClick={prevPage}
                  aria-label="Previous items"
                >
                  <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                </button>
              )}

              {currentIndex < totalPages - 1 && (
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                  onClick={nextPage}
                  aria-label="Next items"
                >
                  <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                </button>
              )}
            </>
          )}

          {/* Carousel indicators with improved UI */}
          {hasMultiplePages && (
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentIndex === index ? 'bg-purple-600' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => onConfirm(editedItems)}
            disabled={editedItems.length === 0}
          >
            {editedItems.length === 0 ? 'No Items' :
             editedItems.length === 1 ? 'Save' : `Save All (${editedItems.length})`}
          </button>
        </div>
      </div>

      {selectedItem && (
        <ItemEditorModal
          item={selectedItem}
          onSave={handleItemUpdate}
          onClose={() => setSelectedItem(null)}
          isWardrobe={isWardrobe}
        />
      )}
    </div>
  );
} 