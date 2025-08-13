"use client";
import React, {
  useState,
  FormEvent,
  useRef,
  useEffect,
  ClipboardEvent as ReactClipboardEvent,
} from "react";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { prisma } from "@/lib/prisma";
import { useWardrobe } from "@/contexts/WardrobeContext";
import { SavedOutfits } from "@/components/outfit-planner/SavedOutfits";
import { ConfirmationModal } from "@/components/ConfirmationFlow";
import type { WardrobeItem as WardrobeItemType } from "@/types/wardrobe";
import { PacksList } from "@/components/packs/PacksList";
import { GreetingSection } from "@/components/GreetingSection";
import { SuggestedOutfitsCarousel } from "@/components/SuggestedOutfitsCarousel";
import { Badge } from "@/components/ui/badge";

const inter = Inter({ subsets: ["latin"] });

interface LinkPreview {
  title: string;
  description: string;
  image: string;
  url: string;
}

interface MyntraProduct {
  brand?: string;
  name: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  sizes?: string[];
  colors?: string[];
  images?: string[];
  description?: string;
  image?: string;
  myntraLink?: string;
  productLink?: string;
  category?: string;
  color?: string;
  pattern?: string;
  fabric?: string;
  dateAdded: string;
  size?: string;
  quantity?: string;
  seller?: string;
  sourceRetailer?: string;
  id: string;
  colorTag?: string;
  dominantColor?: string;
}

interface WardrobeItem {
  url: string;
  type: "youtube" | "myntra" | "other";
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

interface CategoryMap {
  [key: string]: MyntraProduct[];
}

interface FilterOptions {
  categories: string[];
  brands: string[];
  retailers: string[];
  priceRange: {
    min: number;
    max: number;
  };
  sizes: string[];
  colors: string[];
}

interface SortOption {
  type: "date" | "name" | "price";
  direction: "asc" | "desc";
}

function getYouTubeVideoId(url: string): string | null {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function isMyntraUrl(url: string): boolean {
  return url.includes("myntra.com");
}

// ProductOverlay component
const ProductOverlay = ({
  products,
  onSelect,
  onClose,
}: {
  products: SearchResult[];
  onSelect: (url: string) => void;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Select a Product to Add to Your Wardrobe
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <h3 className="font-semibold text-lg mb-1 truncate">{product.brand}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {product.name}
                </p>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="font-bold text-lg">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-sm text-green-600 font-medium">
                      {product.discount}
                    </span>
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

// Helper function to categorize items
const categorizeItems = (items: MyntraProduct[]): CategoryMap => {
  const defaultCategory = "Uncategorized";
  const categories: CategoryMap = {};

  items.forEach((item) => {
    if (item.category) {
      const category = item.category;
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    } else {
      if (!categories[defaultCategory]) {
        categories[defaultCategory] = [];
      }
      categories[defaultCategory].push(item);
    }
  });

  return categories;
};

export default function Home() {
  const { data: session, status } = useSession();
  const [inputValue, setInputValue] = useState("");
  const [products, setProducts] = useState<MyntraProduct[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [showProductOverlay, setShowProductOverlay] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const { setAutosaveEnabled, autosaveEnabled } = useWardrobe();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingItems, setPendingItems] = useState<WardrobeItemType[]>([]);
  const [onboardingThreshold, setOnboardingThreshold] = useState<number>(10);

  useEffect(() => {
    fetch("/api/app-config")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d?.onboardingThreshold === "number") {
          setOnboardingThreshold(d.onboardingThreshold);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      loadUserWardrobe();
    }
  }, [session]);

  useEffect(() => {
    if (!autosaveEnabled || !products.length || !session?.user?.id) return;

    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    const timeout = setTimeout(() => {
      saveWardrobe(false);
    }, 1500);

    setAutoSaveTimeout(timeout);

    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [products, autosaveEnabled]);

  const loadUserWardrobe = async () => {
    try {
      const response = await fetch("/api/wardrobe");
      if (!response.ok) {
        throw new Error("Failed to load wardrobe");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error loading wardrobe:", error);
      setError("Failed to load your wardrobe");
    }
  };

  const saveWardrobe = async (showMessage = true) => {
    if (!session) {
      setError("Please sign in to save your wardrobe");
      return;
    }

    try {
      setIsSaving(true);
      if (showMessage) {
        setSaveSuccess(null);
      }
      setError(null);

      const response = await fetch("/api/wardrobe/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: products }),
      });

      if (!response.ok) {
        throw new Error("Failed to save wardrobe");
      }

      const data = await response.json();

      if (data.updatedItems) {
        setProducts(data.updatedItems);
      }

      if (showMessage) {
        setSaveSuccess(`Wardrobe saved successfully! (${data.count} items)`);
        setTimeout(() => {
          setSaveSuccess(null);
        }, 3000);
      }
    } catch (error) {
      console.error("Error saving wardrobe:", error);
      setError(
        error instanceof Error ? error.message : "Failed to save wardrobe",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProduct = async (productUrl: string) => {
    if (!session) {
      setError("Please sign in to add products");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const resp = await fetch(
        `/api/extractProductFromURL?url=${encodeURIComponent(productUrl)}`,
      );
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || "Failed to fetch product details");
      }
      const product = await resp.json();

      const item: WardrobeItemType = {
        id: `temp-${Date.now()}-${Math.random()}`,
        name: product.name || "Unknown Product",
        brand: product.brand || "Unknown",
        price: product.price || "",
        originalPrice: product.originalPrice || "",
        discount: product.discount || "",
        imageUrl: product.image || product.imageUrl || "",
        image: product.image || product.imageUrl || "",
        size: product.size || "",
        color: product.color || "",
        productLink: product.productLink || productUrl,
        category: product.category || "Uncategorized",
        sourceRetailer: product.sourceRetailer || product.brand || "Unknown",
        userId: session.user.id,
      } as WardrobeItemType;

      setPendingItems([item]);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error preparing product:", error);
      setError(
        error instanceof Error ? error.message : "Failed to prepare product",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;

    try {
      setIsLoading(true);
      setError(null);

      if (
        inputValue.includes("myntra.com") ||
        inputValue.includes("zara.com") ||
        inputValue.includes("hm.com") ||
        inputValue.includes("2.hm.com")
      ) {
        await handleAddProduct(inputValue);
      } else {
        const response = await fetch(
          `/api/myntra-search?query=${encodeURIComponent(inputValue)}`,
        );
        if (!response.ok) {
          throw new Error("Failed to search Myntra");
        }
        const data = await response.json();

        if (data.length === 0) {
          setError("No results found");
        } else {
          setSearchResults(data);
          setShowProductOverlay(true);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to process request",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = async (url: string) => {
    await handleAddProduct(url);
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsProcessingImage(true);
      setError(null);
      setSearchResults([]);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/process-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to process image");
      }

      const data = await response.json();
      if (data.searchResults && data.searchResults.length > 0) {
        setSearchResults(data.searchResults);
        setShowProductOverlay(true);
      } else {
        throw new Error("No matching products found");
      }
    } catch (error) {
      console.error("Error processing image:", error);
      setError(
        error instanceof Error ? error.message : "Failed to process image",
      );
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handlePdfUpload = async (file: File) => {
    try {
      setError(null);
      setPdfText(null);
      console.log("Processing PDF:", file.name);

      const formData = new FormData();
      formData.append("pdf", file);

      const response = await fetch("/api/process-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to process PDF");
      }

      const data = await response.json();
      console.log("PDF processing result:", data);

      setPdfText(data.extractedText);

      if (data.items && data.items.length > 0) {
        const newProducts = data.items.map((item: any) => ({
          brand: item.brand || "Unknown Brand",
          name: item.name || "Unknown Product",
          price: item.price || "",
          originalPrice: item.originalPrice || "",
          discount: item.discount || "",
          image: item.image || "",
          size: item.size || "",
          quantity: item.quantity || "",
          seller: item.seller || "",
          productLink: item.productLink || item.myntraLink || "",
          myntraLink: item.myntraLink || "",
          dateAdded: new Date().toISOString(),
          id: item.id || "",
        }));

        setProducts((prevProducts) => [...prevProducts, ...newProducts]);
        setError(
          `Successfully added ${newProducts.length} items to your wardrobe.`,
        );
      } else {
        setError("No items found in the PDF.");
      }
    } catch (error) {
      console.error("Error processing PDF:", error);
      setError(
        error instanceof Error ? error.message : "Failed to process PDF",
      );
    }
  };

  const handlePaste = async (
    e: ReactClipboardEvent<HTMLDivElement> | ClipboardEvent,
  ) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.includes("image")) {
        const file = item.getAsFile();
        if (file) {
          await handleImageUpload(file);
          break;
        }
      }
    }
  };

  const handleOverlayClose = () => {
    setShowProductOverlay(false);
    setSearchResults([]);
    setImagePreview(null);
  };

  const handleDeleteProduct = async (index: number) => {
    if (!session) {
      setError("Please sign in to manage your wardrobe");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const currentProducts = products;
      setProducts((prevProducts) => prevProducts.filter((_, i) => i !== index));

      const itemToDelete = currentProducts[index];
      if (itemToDelete?.id) {
        const response = await fetch(
          `/api/wardrobe?id=${encodeURIComponent(itemToDelete.id)}`,
          { method: "DELETE" },
        );
        if (!response.ok) {
          throw new Error("Failed to delete item");
        }
      }

      setSaveSuccess("Item successfully removed from your wardrobe");
      setTimeout(() => {
        setSaveSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Error deleting item:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete item",
      );
    } finally {
      setIsSaving(false);
      setShowDeleteConfirm(null);
    }
  };

  const handleDeleteAllItems = async () => {
    if (!session) {
      setError("Please sign in to manage your wardrobe");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      setProducts([]);

      const currentResp = await fetch("/api/wardrobe");
      if (currentResp.ok) {
      const currentItems = await currentResp.json();
      await Promise.all(
        currentItems.map((i: any) =>
          i.id
            ? fetch(`/api/wardrobe?id=${encodeURIComponent(i.id)}`, {
                method: "DELETE",
              })
            : Promise.resolve(),
        ),
      );
      }

      setSaveSuccess("All items successfully removed from your wardrobe");
      setTimeout(() => {
        setSaveSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Error clearing wardrobe:", error);
      setError(
        error instanceof Error ? error.message : "Failed to clear wardrobe",
      );
    } finally {
      setIsSaving(false);
      setShowDeleteAllConfirm(false);
    }
  };

  useEffect(() => {
    const handleDocumentPaste = (e: ClipboardEvent) => {
      handlePaste(e);
    };

    document.addEventListener("paste", handleDocumentPaste);
    return () => document.removeEventListener("paste", handleDocumentPaste);
  }, []);

  const handleConfirmUrlItems = async (items: WardrobeItemType[]) => {
    try {
      setIsLoading(true);
      setError(null);

      const payload = items.map((it) => ({
        brand: it.brand || "",
        name: it.name || "",
        price: it.price || "",
        originalPrice: it.originalPrice || "",
        discount: it.discount || "",
        size: it.size || "",
        color: it.color || "",
        imageUrl: it.imageUrl || it.image || "",
        productLink: it.productLink || "",
        category: it.category || "Uncategorized",
        source: "url",
        sourceRetailer: it.sourceRetailer || "Unknown",
      }));

      const saveResp = await fetch("/api/wardrobe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload.length === 1 ? payload[0] : payload),
      });
      const created = await saveResp.json().catch(() => []);
      if (!saveResp.ok) {
        throw new Error(
          created?.error || created?.message || "Failed to add product",
        );
      }

      const createdItems = Array.isArray(created) ? created : [created];

      const addedProducts: MyntraProduct[] = createdItems.map((saved: any) => ({
        id: saved.id,
        name: saved.name,
        brand: saved.brand,
        price: saved.price || "",
        originalPrice: saved.originalPrice || "",
        discount: saved.discount || "",
        image: saved.image || "",
        productLink: saved.productLink || "",
        category: saved.category || "Uncategorized",
        size: saved.size || "",
        color: saved.color || "",
        sourceRetailer: saved.sourceRetailer || "Unknown",
        colorTag: saved.colorTag,
        dominantColor: saved.dominantColor,
        dateAdded: new Date().toISOString(),
      }));

      setProducts((prev) => [...prev, ...addedProducts]);

      setInputValue("");
      setShowProductOverlay(false);
      setShowConfirmation(false);
      setPendingItems([]);
    } catch (error) {
      console.error("Error confirming URL items:", error);
      setError(
        error instanceof Error ? error.message : "Failed to add product",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setPendingItems([]);
  };

  return (
    <div className="min-h-screen bg-[#fdfcfa] p-4">
      <div className="w-full max-w-full overflow-hidden">
        <div className="w-full">
          <GreetingSection />
          <SuggestedOutfitsCarousel />
          
          {/* Existing sections adapted to new design */}
          <div className="mb-8">
            <h2 className="text-2xl font-normal mb-4 text-gray-900 font-serif">Saved Outfits</h2>
            <SavedOutfits />
                  </div>

          <div className="mb-8">
            <h2 className="text-2xl font-normal mb-4 text-gray-900 font-serif">Packs</h2>
            <PacksList />
          </div>
        </div>
      </div>

      {/* Keep existing modals and overlays */}
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
        <div className="mt-8 w-full">
              <h2 className="text-2xl font-bold mb-4">
                Extracted Text from PDF
              </h2>
          <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
            <pre className="whitespace-pre-wrap font-mono text-sm break-words">
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

          {/* Delete All Confirmation Modal */}
          {showDeleteAllConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4">Delete All Items</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to remove all {products.length} items
                  from your wardrobe? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowDeleteAllConfirm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAllItems}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    disabled={isSaving}
                  >
                    {isSaving ? "Deleting..." : "Delete All"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4">Delete Item</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to remove this item from your wardrobe?
                </p>
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

      {/* URL Add Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal
          items={pendingItems}
          onConfirm={handleConfirmUrlItems}
          onCancel={handleCancelConfirmation}
          isWardrobe={true}
        />
      )}
    </div>
  );
}
