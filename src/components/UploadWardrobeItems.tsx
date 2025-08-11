'use client';

import React, { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/ConfirmationFlow/ConfirmationModal';
import { WardrobeItem } from '@/types/wardrobe';
import { categorizeItem } from '@/lib/categorize-items';
import { CameraIcon } from '@heroicons/react/24/outline';

interface UploadWardrobeItemsProps {
  onSaved?: (items: WardrobeItem[]) => void;
}

export default function UploadWardrobeItems({ onSaved }: UploadWardrobeItemsProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalItems, setModalItems] = useState<WardrobeItem[] | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const arrayBufferToDataUrl = (buffer: ArrayBuffer, mimeType = 'image/png') => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    const base64 = typeof window !== 'undefined' ? window.btoa(binary) : '';
    return `data:${mimeType};base64,${base64}`;
  };

  const inferDisplayType = (detectionClass?: string): string => {
    const cls = (detectionClass || '').toLowerCase();
    if (!cls) return 'item';
    if (cls.includes('shirt') || cls.includes('tshirt') || cls.includes('top')) return 'shirt';
    if (cls.includes('trouser') || cls.includes('pant') || cls.includes('jean')) return 'jeans';
    if (cls.includes('jacket') || cls.includes('coat') || cls.includes('blazer')) return 'jacket';
    if (cls.includes('dress')) return 'dress';
    if (cls.includes('skirt')) return 'skirt';
    if (cls.includes('short')) return 'shorts';
    return cls;
  };

  const onFilesSelected: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsProcessing(true);
    toast.dismiss();
    toast.loading(`Scanning ${files.length} photo${files.length > 1 ? 's' : ''}...`);

    const prepared: (WardrobeItem & { imageOriginal?: string; imageCropped?: string })[] = [];

    for (const file of files) {
      try {
        // Call extract API with AUTO mode
        const form = new FormData();
        form.append('image', file);
        form.append('itemName', 'auto');
        const response = await fetch('/api/extract-item', { method: 'POST', body: form });
        if (!response.ok) throw new Error(`Crop failed (${response.status})`);
        const croppedArrayBuffer = await response.arrayBuffer();
        const detectionClass = response.headers.get('x-detection-class') || undefined;

        // Build names (color omitted in MVP; user can edit in modal)
        const typeName = inferDisplayType(detectionClass) || 'item';
        const displayName = `${typeName}`;

        // Data URLs
        const croppedDataUrl = arrayBufferToDataUrl(croppedArrayBuffer, 'image/png');
        const originalArrayBuffer = await file.arrayBuffer();
        const originalDataUrl = arrayBufferToDataUrl(originalArrayBuffer, file.type || 'image/jpeg');

        const item: WardrobeItem & { imageOriginal?: string; imageCropped?: string } = {
          id: uuidv4(),
          userId: 'temp',
          brand: 'UNKNOWN',
          name: displayName,
          category: categorizeItem({ name: displayName, brand: 'UNKNOWN' }),
          image: croppedDataUrl,
          imageUrl: croppedDataUrl,
          price: '',
          source: 'photo',
          imageOriginal: originalDataUrl,
          imageCropped: croppedDataUrl,
        } as any;

        prepared.push(item);
      } catch (err) {
        console.error('Failed to process file', file.name, err);
        toast.error(`Failed to process ${file.name}`);
      }
    }

    toast.dismiss();
    setIsProcessing(false);

    if (prepared.length > 0) {
      setModalItems(prepared);
    } else {
      toast.error('No items could be prepared from the selected photos');
    }
  };

  const handleConfirm = async (items: WardrobeItem[]) => {
    try {
      toast.loading('Adding items to wardrobe...');
      const res = await fetch('/api/wardrobe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items.map(i => ({
          brand: i.brand || 'Unknown',
          name: i.name,
          price: i.price || '',
          image: i.image || i.imageUrl,
          color: i.color,
          category: i.category,
          source: 'photo',
        }))),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to save items');
      }
      const saved = await res.json();
      toast.dismiss();
      toast.success('Items added');
      setModalItems(null);
      onSaved?.(saved);
    } catch (err) {
      toast.dismiss();
      toast.error(err instanceof Error ? err.message : 'Failed to add items');
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onFilesSelected}
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={isProcessing}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60"
      >
        <CameraIcon className="h-5 w-5" />
        Upload an item
      </button>

      {modalItems && (
        <ConfirmationModal
          items={modalItems}
          onConfirm={handleConfirm}
          onCancel={() => setModalItems(null)}
          isWardrobe
        />
      )}
    </div>
  );
} 