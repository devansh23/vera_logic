import { useState } from 'react';
import { WardrobeItem } from '@/types/wardrobe';

interface ItemEditorModalProps {
  item: WardrobeItem;
  onSave: (updatedItem: WardrobeItem) => void;
  onClose: () => void;
  isWardrobe?: boolean; // New prop to determine if this is in wardrobe section
}

// Get categories from the same source as the main app
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

export default function ItemEditorModal({ item, onSave, onClose, isWardrobe = false }: ItemEditorModalProps) {
  const [name, setName] = useState(item.name);
  const [brand, setBrand] = useState(item.brand || '');
  const [category, setCategory] = useState(item.category);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedItem: WardrobeItem = {
      ...item,
      name,
      brand,
      category,
      imageUrl: previewUrl || item.imageUrl
    };
    
    onSave(updatedItem);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Item</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter brand name"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            {/* Only show the category label if NOT in wardrobe section */}
            {!isWardrobe && (
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
            )}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              aria-label="Category"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            {(previewUrl || item.imageUrl) && (
              <div className="mt-2 aspect-square relative">
                <img
                  src={previewUrl || item.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 