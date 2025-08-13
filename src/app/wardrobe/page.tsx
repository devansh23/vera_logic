"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { NewWardrobeSection } from "@/components/NewWardrobeSection";

interface WardrobeItem {
  id: string;
  name: string;
  brand?: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  image?: string;
  size?: string;
  color?: string;
  productLink?: string;
  category?: string;
  sourceRetailer?: string;
  dominantColor?: string;
  colorTag?: string;
}

export default function WardrobePage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<WardrobeItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      loadUserWardrobe();
    }
  }, [session]);

  const loadUserWardrobe = async () => {
    try {
      const response = await fetch("/api/wardrobe");
      if (!response.ok) {
        throw new Error("Failed to load wardrobe");
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Error loading wardrobe:", err);
      setError("Failed to load your wardrobe");
    }
  };

  const handleDeleteProduct = async (index: number) => {
    if (!session) {
      setError("Please sign in to manage your wardrobe");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const current = products;
      setProducts((prev) => prev.filter((_, i) => i !== index));

      const itemToDelete = current[index];
      if (itemToDelete?.id) {
        const response = await fetch(
          `/api/wardrobe?id=${encodeURIComponent(itemToDelete.id)}`,
          { method: "DELETE" }
        );
        if (!response.ok) {
          throw new Error("Failed to delete item");
        }
      }

      setSaveSuccess("Item removed from your wardrobe");
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting item:", err);
      setError(err instanceof Error ? err.message : "Failed to delete item");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateProduct = (updatedItem: WardrobeItem) => {
    setProducts((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
  };

  return (
    <div className="min-h-screen bg-[#fdfcfa] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-normal text-[#2d2926] mb-2">Wardrobe</h1>
          </div>
        </div>

        {/* Content */}
        <div className="w-full">
          <NewWardrobeSection products={products} onDelete={handleDeleteProduct} onUpdate={handleUpdateProduct} showTitle={false} />
        </div>

        {error && (
          <div className="fixed bottom-4 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {saveSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {saveSuccess}
          </div>
        )}
      </div>
    </div>
  );
} 