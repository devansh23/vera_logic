'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import OutfitPlanner from '@/components/OutfitPlanner';

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
    <div className="container mx-auto py-6 h-[calc(100vh-64px)]">
      <h1 className="text-2xl font-bold mb-6">Outfit Planner</h1>
      <OutfitPlanner />
    </div>
  );
} 