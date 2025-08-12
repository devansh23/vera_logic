'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, useSearchParams, useRouter } from 'next/navigation';
import OutfitPlanner from '@/components/outfit-planner/OutfitPlanner';
import { SavedOutfits } from '@/components/outfit-planner/SavedOutfits';

// Separate component that uses useSearchParams
function OutfitPlannerContent() {
  const [activeTab, setActiveTab] = useState<'saved' | 'create'>('saved');
  const [hasOutfits, setHasOutfits] = useState<boolean | null>(null);
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

  // Check if user has any saved outfits
  useEffect(() => {
    const checkOutfits = async () => {
      try {
        const response = await fetch('/api/outfits');
        if (response.ok) {
          const data = await response.json();
          setHasOutfits(data.length > 0);
        } else {
          setHasOutfits(false);
        }
      } catch (error) {
        console.error('Error checking outfits:', error);
        setHasOutfits(false);
      }
    };

    checkOutfits();
  }, []);

  // If user has outfits, show saved outfits first
  // If user has no outfits, show create outfit directly
  // If still loading, show loading state
  if (hasOutfits === null) {
    return (
      <div className="min-h-screen bg-[#fdfcfa] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-[#8b8681] font-inter">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // If user has no outfits, show create outfit directly
  if (hasOutfits === false) {
    return (
      <div className="min-h-screen bg-[#fdfcfa] p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-playfair font-normal text-[#2d2926] mb-2">
                Outfit Planner
              </h1>
              <p className="text-[#8b8681] font-inter">
                Design and organize your perfect outfits
              </p>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg border border-[rgba(45,41,38,0.1)] p-6">
            <OutfitPlanner editId={editId} />
          </div>
        </div>
      </div>
    );
  }

  // If user has outfits, show saved outfits with option to create new
  return (
    <div className="min-h-screen bg-[#fdfcfa] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-normal text-[#2d2926] mb-2">
              Outfit Planner
            </h1>
            <p className="text-[#8b8681] font-inter">
              Design and organize your perfect outfits
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex space-x-3">
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-6 py-3 rounded-full transition-colors font-inter text-sm ${
              activeTab === 'saved'
                ? 'bg-[#2d2926] text-white'
                : 'bg-white text-[#2d2926] border border-[rgba(45,41,38,0.1)] hover:bg-[#f5f4f2]'
            }`}
          >
            Saved Outfits
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 rounded-full transition-colors font-inter text-sm ${
              activeTab === 'create'
                ? 'bg-[#2d2926] text-white'
                : 'bg-white text-[#2d2926] border border-[rgba(45,41,38,0.1)] hover:bg-[#f5f4f2]'
            }`}
          >
            Create New Outfit
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg border border-[rgba(45,41,38,0.1)] p-6">
          {activeTab === 'saved' ? (
            <SavedOutfits />
          ) : (
            <OutfitPlanner editId={editId} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function OutfitPlannerPage() {
  const { data: session, status } = useSession();
  
  // Show loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#fdfcfa] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-[#8b8681] font-inter">
            Loading...
          </div>
        </div>
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
      <div className="min-h-screen bg-[#fdfcfa] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-[#8b8681] font-inter">
            Loading...
          </div>
        </div>
      </div>
    }>
      <OutfitPlannerContent />
    </Suspense>
  );
}