'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, useSearchParams, useRouter } from 'next/navigation';
import OutfitPlanner from '@/components/outfit-planner/OutfitPlanner';
import { SavedOutfits } from '@/components/outfit-planner/SavedOutfits';
import { OutfitCalendar } from '@/components/outfit-planner/OutfitCalendar';

// Separate component that uses useSearchParams
function OutfitPlannerContent() {
  const [activeTab, setActiveTab] = useState<'create' | 'saved' | 'calendar'>('create');
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Extract edit ID from URL params and add logging
  const editId = searchParams.get('edit');
  console.log('OutfitPlannerPage - editId from URL:', editId);

  useEffect(() => {
    if (editId) {
      setActiveTab('create');
    }
  }, [editId]);

  return (
    <div className="container mx-auto py-6 h-[calc(100vh-64px)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Outfit Planner</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'create'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Create Outfit
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'saved'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Saved Outfits
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'calendar'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => router.push('/packs')}
            className="px-4 py-2 rounded-lg transition-colors bg-gray-100 hover:bg-gray-200"
          >
            Packs
          </button>
        </div>
      </div>

      {activeTab === 'create' ? (
        <OutfitPlanner editId={editId} />
      ) : activeTab === 'saved' ? (
        <SavedOutfits />
      ) : (
        <OutfitCalendar />
      )}
    </div>
  );
}

export default function OutfitPlannerPage() {
  const { data: session, status } = useSession();
  
  // Show loading state
  if (status === "loading") {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Outfit Planner</h1>
        <div className="text-center">Loading...</div>
      </div>
    );
  }
  
  // Redirect to home if not logged in
  if (status === "unauthenticated") {
    redirect('/');
    return null;
  }
  
  return (
    <Suspense fallback={
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Outfit Planner</h1>
        <div className="text-center">Loading...</div>
      </div>
    }>
      <OutfitPlannerContent />
    </Suspense>
  );
}