'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import OutfitPlanner from '@/components/OutfitPlanner';

export default function CreateOutfitPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">
        {editId ? 'Edit Outfit' : 'Create New Outfit'}
      </h1>
      <OutfitPlanner editId={editId} />
    </div>
  );
} 