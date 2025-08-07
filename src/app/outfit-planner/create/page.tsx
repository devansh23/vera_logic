'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import OutfitPlanner from '@/components/OutfitPlanner';

// Separate component that uses useSearchParams
function CreateOutfitContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">
        {editId ? 'Edit Outfit' : 'Create New Outfit'}
      </h1>
      <OutfitPlanner />
    </div>
  );
}

export default function CreateOutfitPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Loading...</h1>
      </div>
    }>
      <CreateOutfitContent />
    </Suspense>
  );
} 