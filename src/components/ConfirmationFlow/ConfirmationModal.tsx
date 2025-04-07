import { useState, useEffect } from 'react';
import { WardrobeItem } from '@/types/wardrobe';
import ItemEditorModal from './ItemEditorModal';

interface ConfirmationModalProps {
  items: WardrobeItem[];
  onConfirm: (items: WardrobeItem[]) => void;
  onCancel: () => void;
  isWardrobe?: boolean;
}

const ITEMS_PER_PAGE = 3;

export default function ConfirmationModal({ items, onConfirm, onCancel, isWardrobe = false }: ConfirmationModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editedItems, setEditedItems] = useState<WardrobeItem[]>(items);
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);

  // Calculate modal width based on number of items
  const getModalWidth = () => {
    const itemCount = Math.min(items.length, ITEMS_PER_PAGE);
    switch (itemCount) {
      case 1: return 'max-w-md'; // Smaller width for 1 item
      case 2: return 'max-w-2xl'; // Medium width for 2 items
      case 3: return 'max-w-4xl'; // Full width for 3 items
      default: return 'max-w-4xl'; // Default case
    }
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => Math.min(Math.ceil(items.length / ITEMS_PER_PAGE) - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items.length]);

  const handleItemUpdate = (updatedItem: WardrobeItem) => {
    setEditedItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setSelectedItem(null);
  };

  const visibleItems = editedItems.slice(
    currentIndex * ITEMS_PER_PAGE,
    (currentIndex + 1) * ITEMS_PER_PAGE
  );

  // Determine if we should show carousel indicators
  const hasMultiplePages = items.length > ITEMS_PER_PAGE;
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg p-6 w-full ${getModalWidth()} mx-4`}>
        <h2 className="text-2xl font-bold mb-4">Review Items</h2>
        
        <div className="relative">
          <div className="flex gap-4 overflow-hidden">
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className={`flex-shrink-0 cursor-pointer ${
                  visibleItems.length === 1 ? 'w-full' : 
                  visibleItems.length === 2 ? 'w-1/2' : 'w-1/3'
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="aspect-square relative">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                {item.brand && (
                  <h4 className="mt-2 text-sm font-medium text-gray-700 truncate">{item.brand}</h4>
                )}
                <h3 className="mt-1 font-medium truncate">{item.name}</h3>
                <p className="text-sm text-gray-500 truncate">{item.category}</p>
              </div>
            ))}
          </div>

          {/* Carousel controls - only show if needed */}
          {currentIndex > 0 && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg"
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              aria-label="Previous items"
            >
              ←
            </button>
          )}

          {currentIndex < Math.ceil(items.length / ITEMS_PER_PAGE) - 1 && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg"
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              aria-label="Next items"
            >
              →
            </button>
          )}

          {/* Carousel indicators for multiple pages */}
          {hasMultiplePages && (
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    currentIndex === index ? 'bg-purple-600' : 'bg-gray-300'
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
          >
            {items.length === 1 ? 'Save' : 'Save All'}
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