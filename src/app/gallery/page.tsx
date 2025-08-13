"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import FullBodyPhotoUpload from '@/components/FullBodyPhotoUpload';

export default function GalleryPage() {
  const { data: session } = useSession();
  
  return (
    <div className="min-h-screen bg-[#fdfcfa] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-normal text-[#2d2926] mb-2">My Gallery</h1>
            <p className="text-[#8b8681] font-inter">
              Manage your photos and virtual try-on assets
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="w-full">
          <div className="bg-white rounded-lg border border-[rgba(45,41,38,0.1)] p-6">
            <FullBodyPhotoUpload />
          </div>
        </div>
      </div>
    </div>
  );
} 